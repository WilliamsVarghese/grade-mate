import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { academicService } from '../services/academicService';
import { storageService } from '../services/storageService';
import { calculateSubjectMarks, calculateSGPA, calculateCGPA } from '../utils/calculations';
import { INITIAL_SETTINGS } from '../utils/initialData';

const AcademicContext = createContext();

export function AcademicProvider({ children }) {
  // Load state from academicService (backed by localStorage)
  const [settings, setSettings] = useState(() => academicService.getSettings());
  const [semester5Subjects, setSemester5Subjects] = useState(() => academicService.getSemester5Subjects());
  const [minorSubjects, setMinorSubjects] = useState(() => academicService.getMinorSubjects());
  const [electiveSubjects, setElectiveSubjects] = useState(() => academicService.getElectiveSubjects());
  const [pastSemesters, setPastSemesters] = useState(() => academicService.getPastSemesters());
  const [exams, setExams] = useState(() => academicService.getExams());
  const [activities, setActivities] = useState(() => academicService.getActivities());
  const [internalAssessments, setInternalAssessments] = useState(() => academicService.getInternalAssessments());
  const [endSemAssessments, setEndSemAssessments] = useState(() => academicService.getEndSemAssessments());

  // Save to storage whenever state changes
  useEffect(() => {
    academicService.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    academicService.saveSemester5Subjects(semester5Subjects);
  }, [semester5Subjects]);

  useEffect(() => {
    academicService.saveMinorSubjects(minorSubjects);
  }, [minorSubjects]);

  useEffect(() => {
    academicService.saveElectiveSubjects(electiveSubjects);
  }, [electiveSubjects]);

  useEffect(() => {
    academicService.savePastSemesters(pastSemesters);
  }, [pastSemesters]);

  useEffect(() => {
    academicService.saveExams(exams);
  }, [exams]);

  useEffect(() => {
    academicService.saveActivities(activities);
  }, [activities]);

  useEffect(() => {
    academicService.saveInternalAssessments(internalAssessments);
  }, [internalAssessments]);

  useEffect(() => {
    academicService.saveEndSemAssessments(endSemAssessments);
  }, [endSemAssessments]);

  // Activity logger
  const logActivity = useCallback((action, details, type = 'general') => {
    const newActivity = {
      id: 'act-' + Date.now(),
      action,
      details,
      timestamp: 'Just now',
      type,
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // keep recent 20
  }, []);

  // Update subject marks with active settings
  const recomputeSubject = useCallback((subject, customSettings = settings) => {
    return calculateSubjectMarks(subject, customSettings);
  }, [settings]);

  // ---- SEMESTER 5 SUBJECTS CRUD ----
  const addSemester5Subject = useCallback((newSubject) => {
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || 's5-' + Date.now(),
    });
    setSemester5Subjects(prev => [...prev, computed]);
    logActivity('Subject Added', `Added ${computed.name} (${computed.code || 'No Code'})`, 'subject');
  }, [recomputeSubject, logActivity]);

  const updateSemester5Subject = useCallback((id, updatedFields) => {
    setSemester5Subjects(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const merged = { ...sub, ...updatedFields };
          return recomputeSubject(merged);
        }
        return sub;
      })
    );
    logActivity('Subject Updated', `Updated records for ${updatedFields.name || 'Subject'}`, 'marks');
  }, [recomputeSubject, logActivity]);

  const deleteSemester5Subject = useCallback((id) => {
    const target = semester5Subjects.find(s => s.id === id);
    setSemester5Subjects(prev => prev.filter(s => s.id !== id));
    logActivity('Subject Removed', `Deleted ${target?.name || 'subject'} from Semester 5`, 'delete');
  }, [semester5Subjects, logActivity]);

  // ---- MINOR SUBJECTS CRUD ----
  const addMinorSubject = useCallback((newSubject) => {
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || 'min-' + Date.now(),
      track: newSubject.track || 'Minor in IoT and Sensors'
    });
    setMinorSubjects(prev => [...prev, computed]);
    logActivity('Minor Subject Added', `Added ${computed.name} to Minor track`, 'subject');
  }, [recomputeSubject, logActivity]);

  const updateMinorSubject = useCallback((id, updatedFields) => {
    setMinorSubjects(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const merged = { ...sub, ...updatedFields };
          return recomputeSubject(merged);
        }
        return sub;
      })
    );
    logActivity('Minor Updated', `Updated minor subject ${updatedFields.name || ''}`, 'marks');
  }, [recomputeSubject, logActivity]);

  const deleteMinorSubject = useCallback((id) => {
    const target = minorSubjects.find(s => s.id === id);
    setMinorSubjects(prev => prev.filter(s => s.id !== id));
    logActivity('Minor Subject Removed', `Removed ${target?.name || 'subject'} from Minor track`, 'delete');
  }, [minorSubjects, logActivity]);

  // ---- ELECTIVE SUBJECTS CRUD ----
  const addElectiveSubject = useCallback((newSubject) => {
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || 'elec-' + Date.now(),
      electiveTrack: newSubject.electiveTrack || 'Operating System Security'
    });
    setElectiveSubjects(prev => [...prev, computed]);
    logActivity('Elective Subject Added', `Added ${computed.name} to Elective track`, 'subject');
  }, [recomputeSubject, logActivity]);

  const updateElectiveSubject = useCallback((id, updatedFields) => {
    setElectiveSubjects(prev =>
      prev.map(sub => {
        if (sub.id === id) {
          const merged = { ...sub, ...updatedFields };
          return recomputeSubject(merged);
        }
        return sub;
      })
    );
    logActivity('Elective Updated', `Updated elective subject ${updatedFields.name || ''}`, 'marks');
  }, [recomputeSubject, logActivity]);

  const deleteElectiveSubject = useCallback((id) => {
    const target = electiveSubjects.find(s => s.id === id);
    setElectiveSubjects(prev => prev.filter(s => s.id !== id));
    logActivity('Elective Removed', `Removed ${target?.name || 'elective'}`, 'delete');
  }, [electiveSubjects, logActivity]);

  // ---- EXAMS CRUD ----
  const addExam = useCallback((examData) => {
    const newExam = {
      id: 'exam-' + Date.now(),
      ...examData,
    };
    setExams(prev => [...prev, newExam]);
    logActivity('Exam Scheduled', `Scheduled ${newExam.subject} (${newExam.type})`, 'exam');
  }, [logActivity]);

  const updateExam = useCallback((id, updatedFields) => {
    setExams(prev => prev.map(ex => (ex.id === id ? { ...ex, ...updatedFields } : ex)));
    logActivity('Exam Updated', `Updated exam schedule details`, 'exam');
  }, [logActivity]);

  const deleteExam = useCallback((id) => {
    setExams(prev => prev.filter(ex => ex.id !== id));
    logActivity('Exam Removed', `Removed exam from schedule`, 'delete');
  }, [logActivity]);

  // ---- PAST SEMESTERS CRUD ----
  const updatePastSemester = useCallback((semesterName, data) => {
    setPastSemesters(prev =>
      prev.map(sem => (sem.semester === semesterName ? { ...sem, ...data } : sem))
    );
    logActivity('Semester History Updated', `Updated results for ${semesterName}`, 'settings');
  }, [logActivity]);

  const addPastSemester = useCallback((data) => {
    setPastSemesters(prev => [...prev, data]);
    logActivity('Semester Added', `Added record for ${data.semester}`, 'settings');
  }, [logActivity]);

  const deletePastSemester = useCallback((semesterName) => {
    setPastSemesters(prev => prev.filter(sem => sem.semester !== semesterName));
    logActivity('Semester Removed', `Deleted ${semesterName} history`, 'delete');
  }, [logActivity]);

  // ---- SETTINGS UPDATES ----
  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      return merged;
    });
    logActivity('Settings Updated', 'Academic configuration and profile updated', 'settings');
  }, [logActivity]);

  // Recalculate all subjects when grading scale or assessment scheme changes
  const updateGradeScale = useCallback((newScale) => {
    setSettings(prev => ({ ...prev, gradeScale: newScale }));
    const updatedSettings = { ...settings, gradeScale: newScale };
    setSemester5Subjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setMinorSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setElectiveSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    logActivity('Grade Scale Updated', 'Recalculated grades for all registered courses', 'settings');
  }, [settings, logActivity]);

  const updateAssessmentScheme = useCallback((newScheme) => {
    setSettings(prev => ({ ...prev, assessmentScheme: { ...prev.assessmentScheme, ...newScheme } }));
    const updatedSettings = {
      ...settings,
      assessmentScheme: { ...settings.assessmentScheme, ...newScheme }
    };
    setSemester5Subjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setMinorSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setElectiveSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    logActivity('Assessment Scheme Updated', 'Updated weightage rules and recomputed total marks', 'settings');
  }, [settings, logActivity]);

  // ---- RESET & CLEAR DATA ----
  const resetToDefaults = useCallback(() => {
    academicService.resetToDefaults();
    setSettings(academicService.getSettings());
    setSemester5Subjects(academicService.getSemester5Subjects());
    setMinorSubjects(academicService.getMinorSubjects());
    setElectiveSubjects(academicService.getElectiveSubjects());
    setPastSemesters(academicService.getPastSemesters());
    setExams(academicService.getExams());
    setActivities(academicService.getActivities());
    logActivity('System Reset', 'All records reset to default demo data', 'settings');
  }, [logActivity]);

  const clearAllData = useCallback(() => {
    academicService.clearAllData();
    setSettings(INITIAL_SETTINGS);
    setSemester5Subjects([]);
    setMinorSubjects([]);
    setElectiveSubjects([]);
    setPastSemesters([]);
    setExams([]);
    setActivities([]);
    logActivity('Data Cleared', 'All academic records purged', 'delete');
  }, [logActivity]);

  const exportDataJSON = useCallback(() => {
    const jsonString = storageService.exportAllData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GradeMate_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity('Backup Exported', 'Full student academic data exported to JSON', 'settings');
  }, [logActivity]);

  const importDataJSON = useCallback((jsonString) => {
    const res = storageService.importAllData(jsonString);
    if (res.success) {
      setSettings(academicService.getSettings());
      setSemester5Subjects(academicService.getSemester5Subjects());
      setMinorSubjects(academicService.getMinorSubjects());
      setElectiveSubjects(academicService.getElectiveSubjects());
      setPastSemesters(academicService.getPastSemesters());
      setExams(academicService.getExams());
      setActivities(academicService.getActivities());
      logActivity('Backup Restored', 'Restored records from JSON backup', 'settings');
    }
    return res;
  }, [logActivity]);

  // ---- COMPUTED METRICS ----
  // Current Semester 5 SGPA
  const semester5SGPA = useMemo(() => {
    return calculateSGPA(semester5Subjects);
  }, [semester5Subjects]);

  // Minor performance
  const minorPerformance = useMemo(() => {
    return calculateSGPA(minorSubjects);
  }, [minorSubjects]);

  // Elective performance
  const electivePerformance = useMemo(() => {
    return calculateSGPA(electiveSubjects);
  }, [electiveSubjects]);

  // Cumulative CGPA calculation
  const cumulativeCGPA = useMemo(() => {
    return calculateCGPA(pastSemesters, {
      sgpa: semester5SGPA.sgpa,
      credits: semester5SGPA.totalCredits,
    });
  }, [pastSemesters, semester5SGPA]);

  // Combined list of all registered subjects
  const allSubjects = useMemo(() => {
    return [
      ...semester5Subjects.map(s => ({ ...s, category: 'Semester 5 Core' })),
      ...minorSubjects.map(s => ({ ...s, category: 'Minor Track' })),
      ...electiveSubjects.map(s => ({ ...s, category: 'Elective Track' })),
    ];
  }, [semester5Subjects, minorSubjects, electiveSubjects]);

  // Subject-specific internal assessment configuration persistence and application
  const saveSubjectInternalAssessment = useCallback((subjectId, config, applyToSubject = true) => {
    setInternalAssessments(prev => ({
      ...prev,
      [subjectId]: config
    }));

    if (applyToSubject && subjectId && subjectId !== 'custom') {
      const subject = allSubjects.find(s => s.id === subjectId);
      if (subject) {
        const updatePayload = {
          ciaMarks: config.totalObtained,
          ciaMax: config.maxInternal,
          internalConfig: config
        };
        if (config.attendance && config.attendance.percentage !== undefined) {
          updatePayload.attendance = config.attendance.percentage;
        } else if (config.attendance && config.attendance.max > 0 && config.attendance.obtained !== undefined) {
          updatePayload.attendance = Math.round((Number(config.attendance.obtained) / Number(config.attendance.max)) * 100);
        }

        if (semester5Subjects.some(s => s.id === subjectId)) {
          updateSemester5Subject(subjectId, updatePayload);
        } else if (minorSubjects.some(s => s.id === subjectId)) {
          updateMinorSubject(subjectId, updatePayload);
        } else if (electiveSubjects.some(s => s.id === subjectId)) {
          updateElectiveSubject(subjectId, updatePayload);
        }
        logActivity('Internal Assessment Saved', `Calculated ${config.totalObtained}/${config.maxInternal} CIA for ${subject.name}`, 'marks');
      }
    }
  }, [allSubjects, semester5Subjects, minorSubjects, electiveSubjects, updateSemester5Subject, updateMinorSubject, updateElectiveSubject, logActivity]);

  // Subject-specific end-semester assessment configuration persistence and application
  const saveSubjectEndSemAssessment = useCallback((subjectId, config, applyToSubject = true) => {
    setEndSemAssessments(prev => ({
      ...prev,
      [subjectId]: config
    }));

    if (applyToSubject && subjectId && subjectId !== 'custom') {
      const subject = allSubjects.find(s => s.id === subjectId);
      if (subject) {
        const updatePayload = {
          eseMarks: config.weightedEse,
          eseMax: config.maxEse,
          endSemConfig: config
        };

        if (semester5Subjects.some(s => s.id === subjectId)) {
          updateSemester5Subject(subjectId, updatePayload);
        } else if (minorSubjects.some(s => s.id === subjectId)) {
          updateMinorSubject(subjectId, updatePayload);
        } else if (electiveSubjects.some(s => s.id === subjectId)) {
          updateElectiveSubject(subjectId, updatePayload);
        }
        logActivity('End-Sem Assessment Saved', `Updated ${config.weightedEse}/${config.maxEse} ESE for ${subject.name}`, 'marks');
      }
    }
  }, [allSubjects, semester5Subjects, minorSubjects, electiveSubjects, updateSemester5Subject, updateMinorSubject, updateElectiveSubject, logActivity]);

  const value = {
    settings,
    semester5Subjects,
    minorSubjects,
    electiveSubjects,
    allSubjects,
    pastSemesters,
    exams,
    activities,
    internalAssessments,
    endSemAssessments,
    semester5SGPA,
    minorPerformance,
    electivePerformance,
    cumulativeCGPA,
    saveSubjectInternalAssessment,
    saveSubjectEndSemAssessment,
    addSemester5Subject,
    updateSemester5Subject,
    deleteSemester5Subject,
    addMinorSubject,
    updateMinorSubject,
    deleteMinorSubject,
    addElectiveSubject,
    updateElectiveSubject,
    deleteElectiveSubject,
    addExam,
    updateExam,
    deleteExam,
    updatePastSemester,
    addPastSemester,
    deletePastSemester,
    updateSettings,
    updateGradeScale,
    updateAssessmentScheme,
    resetToDefaults,
    clearAllData,
    exportDataJSON,
    importDataJSON,
    logActivity,
  };

  return <AcademicContext.Provider value={value}>{children}</AcademicContext.Provider>;
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
}


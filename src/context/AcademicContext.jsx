import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { academicService } from '../services/academicService';
import { storageService } from '../services/storageService';
import { calculateSubjectMarks, calculateSGPA } from '../utils/calculations';
import { INITIAL_SETTINGS, SEMESTERS } from '../utils/initialData';

const AcademicContext = createContext();

export function AcademicProvider({ children }) {
  // Load state from academicService (backed by localStorage)
  const [settings, setSettings] = useState(() => academicService.getSettings());
  const [selectedSemesterId, setSelectedSemesterIdState] = useState(() => academicService.getSelectedSemesterId());
  const [semestersData, setSemestersData] = useState(() => academicService.getSemestersData());
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
    academicService.saveSelectedSemesterId(selectedSemesterId);
  }, [selectedSemesterId]);

  useEffect(() => {
    academicService.saveSemestersData(semestersData);
  }, [semestersData]);

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

  // Selected semester object
  const selectedSemester = useMemo(() => {
    return SEMESTERS.find(s => s.id === selectedSemesterId) || SEMESTERS[4]; // default Semester 5
  }, [selectedSemesterId]);

  // Switch selected semester
  const setSelectedSemesterId = useCallback((id) => {
    if (SEMESTERS.some(s => s.id === id)) {
      setSelectedSemesterIdState(id);
    }
  }, []);

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

  // ---- MULTI-SEMESTER SUBJECTS CRUD ----
  // Add a subject to a specific semester (defaults to currently selected semester)
  const addSubject = useCallback((newSubject, targetSemesterId = selectedSemesterId) => {
    const targetSem = SEMESTERS.find(s => s.id === targetSemesterId) || selectedSemester;
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || `${targetSemesterId}-${Date.now()}`,
      semester: targetSem.name,
    });

    setSemestersData(prev => {
      const currentList = prev[targetSemesterId] || [];
      return {
        ...prev,
        [targetSemesterId]: [...currentList, computed],
      };
    });

    logActivity('Subject Added', `Added ${computed.name} to ${targetSem.name}`, 'subject');
  }, [selectedSemesterId, selectedSemester, recomputeSubject, logActivity]);

  // Update a subject in its respective semester
  const updateSubject = useCallback((id, updatedFields, targetSemesterId = null) => {
    setSemestersData(prev => {
      const next = { ...prev };
      // Locate which semester contains this subject
      const semKey = targetSemesterId || Object.keys(next).find(k => (next[k] || []).some(s => s.id === id));
      if (!semKey || !next[semKey]) return prev;

      next[semKey] = next[semKey].map(sub => {
        if (sub.id === id) {
          const merged = { ...sub, ...updatedFields };
          return recomputeSubject(merged);
        }
        return sub;
      });

      return next;
    });

    logActivity('Subject Updated', `Updated records for ${updatedFields.name || 'Subject'}`, 'marks');
  }, [recomputeSubject, logActivity]);

  // Delete a subject from its respective semester
  const deleteSubject = useCallback((id, targetSemesterId = null) => {
    setSemestersData(prev => {
      const next = { ...prev };
      const semKey = targetSemesterId || Object.keys(next).find(k => (next[k] || []).some(s => s.id === id));
      if (!semKey || !next[semKey]) return prev;

      const target = next[semKey].find(s => s.id === id);
      next[semKey] = next[semKey].filter(s => s.id !== id);

      const targetSem = SEMESTERS.find(s => s.id === semKey);
      logActivity('Subject Removed', `Deleted ${target?.name || 'subject'} from ${targetSem?.name || 'semester'}`, 'delete');

      return next;
    });
  }, [logActivity]);

  // ---- LEGACY SEMESTER 5 WRAPPERS (Full Backward Compatibility) ----
  const semester5Subjects = useMemo(() => {
    return semestersData['sem-5'] || [];
  }, [semestersData]);

  const addSemester5Subject = useCallback((newSubject) => {
    addSubject(newSubject, 'sem-5');
  }, [addSubject]);

  const updateSemester5Subject = useCallback((id, updatedFields) => {
    updateSubject(id, updatedFields, 'sem-5');
  }, [updateSubject]);

  const deleteSemester5Subject = useCallback((id) => {
    deleteSubject(id, 'sem-5');
  }, [deleteSubject]);

  // ---- MINOR SUBJECTS CRUD ----
  const addMinorSubject = useCallback((newSubject) => {
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || 'min-' + Date.now(),
      track: newSubject.track || 'Minor in IoT and Sensors',
      semester: newSubject.semester || selectedSemester.name,
    });
    setMinorSubjects(prev => [...prev, computed]);
    logActivity('Minor Subject Added', `Added ${computed.name} to Minor track`, 'subject');
  }, [recomputeSubject, selectedSemester, logActivity]);

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
    logActivity('Minor Subject Updated', `Updated ${updatedFields.name || 'Minor course'}`, 'marks');
  }, [recomputeSubject, logActivity]);

  const deleteMinorSubject = useCallback((id) => {
    const target = minorSubjects.find(s => s.id === id);
    setMinorSubjects(prev => prev.filter(s => s.id !== id));
    logActivity('Minor Subject Removed', `Deleted ${target?.name || 'course'} from Minor track`, 'delete');
  }, [minorSubjects, logActivity]);

  // ---- ELECTIVE SUBJECTS CRUD ----
  const addElectiveSubject = useCallback((newSubject) => {
    const computed = recomputeSubject({
      ...newSubject,
      id: newSubject.id || 'elec-' + Date.now(),
      electiveTrack: newSubject.electiveTrack || 'Professional Elective 2',
      semester: newSubject.semester || selectedSemester.name,
    });
    setElectiveSubjects(prev => [...prev, computed]);
    logActivity('Elective Added', `Added ${computed.name} to Elective track`, 'subject');
  }, [recomputeSubject, selectedSemester, logActivity]);

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
    logActivity('Elective Updated', `Updated ${updatedFields.name || 'Elective course'}`, 'marks');
  }, [recomputeSubject, logActivity]);

  const deleteElectiveSubject = useCallback((id) => {
    const target = electiveSubjects.find(s => s.id === id);
    setElectiveSubjects(prev => prev.filter(s => s.id !== id));
    logActivity('Elective Removed', `Deleted ${target?.name || 'course'} from Elective track`, 'delete');
  }, [electiveSubjects, logActivity]);

  // ---- EXAMS CRUD ----
  const addExam = useCallback((newExam) => {
    const exam = {
      ...newExam,
      id: newExam.id || 'exam-' + Date.now(),
      semester: newExam.semester || selectedSemester.name,
    };
    setExams(prev => [...prev, exam]);
    logActivity('Exam Scheduled', `Scheduled ${exam.type} for ${exam.subject}`, 'exam');
  }, [selectedSemester, logActivity]);

  const updateExam = useCallback((id, updatedFields) => {
    setExams(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, ...updatedFields } : ex))
    );
    logActivity('Exam Updated', 'Exam schedule modified', 'exam');
  }, [logActivity]);

  const deleteExam = useCallback((id) => {
    setExams(prev => prev.filter(ex => ex.id !== id));
    logActivity('Exam Deleted', 'Exam entry removed', 'delete');
  }, [logActivity]);

  // ---- PAST SEMESTERS MANUAL RECORDS ----
  const updatePastSemester = useCallback((semesterName, updatedData) => {
    setPastSemesters(prev =>
      prev.map(s => (s.semester === semesterName ? { ...s, ...updatedData } : s))
    );
    logActivity('Semester Record Updated', `Updated ${semesterName} GPA records`, 'settings');
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

    setSemestersData(prev => {
      const next = {};
      Object.keys(prev).forEach(semKey => {
        next[semKey] = (prev[semKey] || []).map(s => calculateSubjectMarks(s, updatedSettings));
      });
      return next;
    });

    setMinorSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setElectiveSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    logActivity('Grade Scale Updated', 'Recalculated grades for all registered courses across all semesters', 'settings');
  }, [settings, logActivity]);

  const updateAssessmentScheme = useCallback((newScheme) => {
    setSettings(prev => ({ ...prev, assessmentScheme: { ...prev.assessmentScheme, ...newScheme } }));
    const updatedSettings = {
      ...settings,
      assessmentScheme: { ...settings.assessmentScheme, ...newScheme }
    };

    setSemestersData(prev => {
      const next = {};
      Object.keys(prev).forEach(semKey => {
        next[semKey] = (prev[semKey] || []).map(s => calculateSubjectMarks(s, updatedSettings));
      });
      return next;
    });

    setMinorSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    setElectiveSubjects(prev => prev.map(s => calculateSubjectMarks(s, updatedSettings)));
    logActivity('Assessment Scheme Updated', 'Updated weightage rules and recomputed total marks across semesters', 'settings');
  }, [settings, logActivity]);

  // ---- RESET & CLEAR DATA ----
  const resetToDefaults = useCallback(() => {
    academicService.resetToDefaults();
    setSettings(academicService.getSettings());
    setSelectedSemesterIdState(academicService.getSelectedSemesterId());
    setSemestersData(academicService.getSemestersData());
    setMinorSubjects(academicService.getMinorSubjects());
    setElectiveSubjects(academicService.getElectiveSubjects());
    setPastSemesters(academicService.getPastSemesters());
    setExams(academicService.getExams());
    setActivities(academicService.getActivities());
    logActivity('System Reset', 'All 8 semesters reset to default curriculum data', 'settings');
  }, [logActivity]);

  const clearAllData = useCallback(() => {
    academicService.clearAllData();
    setSettings(INITIAL_SETTINGS);
    setSelectedSemesterIdState('sem-1');
    const emptySemesters = {};
    SEMESTERS.forEach(s => { emptySemesters[s.id] = []; });
    setSemestersData(emptySemesters);
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
    link.download = `GradeMate_8Sem_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    logActivity('Backup Exported', 'Full 8-semester student academic data exported to JSON', 'settings');
  }, [logActivity]);

  const importDataJSON = useCallback((jsonString) => {
    const res = storageService.importAllData(jsonString);
    if (res.success) {
      setSettings(academicService.getSettings());
      setSelectedSemesterIdState(academicService.getSelectedSemesterId());
      setSemestersData(academicService.getSemestersData());
      setMinorSubjects(academicService.getMinorSubjects());
      setElectiveSubjects(academicService.getElectiveSubjects());
      setPastSemesters(academicService.getPastSemesters());
      setExams(academicService.getExams());
      setActivities(academicService.getActivities());
      logActivity('Backup Restored', 'Restored records from JSON backup', 'settings');
    }
    return res;
  }, [logActivity]);

  // ---- DYNAMIC COMPUTED METRICS PER SEMESTER & OVERALL CGPA ----

  // Subjects for the currently selected semester
  const currentSemesterSubjects = useMemo(() => {
    return semestersData[selectedSemesterId] || [];
  }, [semestersData, selectedSemesterId]);

  // Current selected semester SGPA
  const currentSemesterSGPA = useMemo(() => {
    return calculateSGPA(currentSemesterSubjects);
  }, [currentSemesterSubjects]);

  // Legacy Semester 5 SGPA
  const semester5SGPA = useMemo(() => {
    return calculateSGPA(semestersData['sem-5'] || []);
  }, [semestersData]);

  // Performance metrics for all 8 semesters
  const allSemestersSGPA = useMemo(() => {
    return SEMESTERS.map(sem => {
      const subjects = semestersData[sem.id] || [];
      const sgpaResult = calculateSGPA(subjects);
      const evaluatedSubjects = subjects.filter(s =>
        s.gradePoint !== undefined && s.gradePoint !== null && (s.ciaMarks > 0 || s.eseMarks > 0 || s.grade)
      );

      return {
        ...sem,
        sgpa: sgpaResult.sgpa,
        totalCredits: sgpaResult.totalCredits,
        totalWeightedPoints: sgpaResult.totalWeightedPoints,
        subjectsCount: subjects.length,
        evaluatedCount: evaluatedSubjects.length,
        isEvaluated: evaluatedSubjects.length > 0 && Number(sgpaResult.sgpa) > 0,
      };
    });
  }, [semestersData]);

  // Minor performance
  const minorPerformance = useMemo(() => {
    return calculateSGPA(minorSubjects);
  }, [minorSubjects]);

  // Elective performance
  const electivePerformance = useMemo(() => {
    return calculateSGPA(electiveSubjects);
  }, [electiveSubjects]);

  /**
   * Overall CGPA Calculation:
   * Formula: CGPA = Total weighted grade points / Total completed credits
   * Calculated using all completed/evaluated semesters and their actual subject credits.
   * Does NOT calculate CGPA by taking a simple average of semester SGPAs!
   * If previous semester marks have not been entered, flags that the CGPA data is incomplete.
   */
  const cumulativeCGPA = useMemo(() => {
    let totalCompletedCredits = 0;
    let totalWeightedPoints = 0;
    let evaluatedSemestersCount = 0;
    const evaluatedSemesters = [];
    const pendingSemesters = [];

    SEMESTERS.forEach((sem) => {
      const subjects = semestersData[sem.id] || [];
      // Evaluated subjects with valid credits and grade points
      const evaluatedSubjects = subjects.filter(s =>
        Number(s.credits) > 0 &&
        s.gradePoint !== undefined &&
        s.gradePoint !== null &&
        (Number(s.ciaMarks) > 0 || Number(s.eseMarks) > 0 || s.grade)
      );

      if (evaluatedSubjects.length > 0) {
        evaluatedSemestersCount++;
        evaluatedSemesters.push(sem.name);
        evaluatedSubjects.forEach(s => {
          const cr = Number(s.credits) || 0;
          const gp = Number(s.gradePoint) || 0;
          totalCompletedCredits += cr;
          totalWeightedPoints += (cr * gp);
        });
      } else {
        pendingSemesters.push(sem.name);
      }
    });

    const cgpa = totalCompletedCredits > 0
      ? Math.round((totalWeightedPoints / totalCompletedCredits) * 100) / 100
      : 0;

    const currentSemNum = selectedSemester.number || 5;
    // Check if any previous semester prior to or equal to current semester is missing marks
    const missingPriorSemesters = SEMESTERS.filter(s => s.number <= currentSemNum && pendingSemesters.includes(s.name));
    const isIncomplete = missingPriorSemesters.length > 0;

    return {
      cgpa,
      totalCompletedCredits,
      totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
      evaluatedSemestersCount,
      evaluatedSemesters,
      pendingSemesters,
      missingPriorSemesters: missingPriorSemesters.map(s => s.name),
      isIncomplete,
    };
  }, [semestersData, selectedSemester]);

  // Combined list of all registered subjects across all 8 semesters, minor & elective
  const allSubjects = useMemo(() => {
    const list = [];
    SEMESTERS.forEach(sem => {
      const subjects = semestersData[sem.id] || [];
      subjects.forEach(s => {
        list.push({
          ...s,
          semesterId: sem.id,
          semesterName: sem.name,
          category: `${sem.name} Core`,
        });
      });
    });

    minorSubjects.forEach(s => {
      list.push({
        ...s,
        category: 'Minor Track',
      });
    });

    electiveSubjects.forEach(s => {
      list.push({
        ...s,
        category: 'Elective Track',
      });
    });

    return list;
  }, [semestersData, minorSubjects, electiveSubjects]);

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

        if (minorSubjects.some(s => s.id === subjectId)) {
          updateMinorSubject(subjectId, updatePayload);
        } else if (electiveSubjects.some(s => s.id === subjectId)) {
          updateElectiveSubject(subjectId, updatePayload);
        } else {
          // Regular semester subject
          updateSubject(subjectId, updatePayload);
        }
        logActivity('Internal Assessment Saved', `Calculated ${config.totalObtained}/${config.maxInternal} CIA for ${subject.name}`, 'marks');
      }
    }
  }, [allSubjects, minorSubjects, electiveSubjects, updateMinorSubject, updateElectiveSubject, updateSubject, logActivity]);

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

        if (minorSubjects.some(s => s.id === subjectId)) {
          updateMinorSubject(subjectId, updatePayload);
        } else if (electiveSubjects.some(s => s.id === subjectId)) {
          updateElectiveSubject(subjectId, updatePayload);
        } else {
          updateSubject(subjectId, updatePayload);
        }
        logActivity('End-Sem Assessment Saved', `Updated ${config.weightedEse}/${config.maxEse} ESE for ${subject.name}`, 'marks');
      }
    }
  }, [allSubjects, minorSubjects, electiveSubjects, updateMinorSubject, updateElectiveSubject, updateSubject, logActivity]);

  const value = {
    settings,
    semesters: SEMESTERS,
    selectedSemesterId,
    selectedSemester,
    setSelectedSemesterId,
    semestersData,
    currentSemesterSubjects,
    currentSemesterSGPA,
    allSemestersSGPA,
    addSubject,
    updateSubject,
    deleteSubject,
    // Legacy Semester 5 compatibility
    semester5Subjects,
    semester5SGPA,
    addSemester5Subject,
    updateSemester5Subject,
    deleteSemester5Subject,
    // Minor & Electives
    minorSubjects,
    minorPerformance,
    addMinorSubject,
    updateMinorSubject,
    deleteMinorSubject,
    electiveSubjects,
    electivePerformance,
    addElectiveSubject,
    updateElectiveSubject,
    deleteElectiveSubject,
    // Overall & History
    pastSemesters,
    updatePastSemester,
    addPastSemester,
    deletePastSemester,
    cumulativeCGPA,
    allSubjects,
    // Assessments & Exams
    exams,
    addExam,
    updateExam,
    deleteExam,
    activities,
    logActivity,
    internalAssessments,
    endSemAssessments,
    saveSubjectInternalAssessment,
    saveSubjectEndSemAssessment,
    // System
    updateSettings,
    updateGradeScale,
    updateAssessmentScheme,
    resetToDefaults,
    clearAllData,
    exportDataJSON,
    importDataJSON,
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
}

export function useAcademic() {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
}

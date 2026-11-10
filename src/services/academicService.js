import { storageService } from './storageService';
import {
  INITIAL_SETTINGS,
  INITIAL_SEMESTER_5_SUBJECTS,
  INITIAL_MINOR_SUBJECTS,
  INITIAL_ELECTIVE_SUBJECTS,
  INITIAL_PAST_SEMESTERS,
  INITIAL_EXAMS,
  INITIAL_ACTIVITIES
} from '../utils/initialData';

const { KEYS } = storageService;

/**
 * Service to manage academic records.
 * Acts as the single point of contact for data.
 * Ready to be replaced by REST API calls (e.g. axios/fetch to Spring Boot).
 */
export const academicService = {
  // Settings & Profile
  getSettings: () => {
    return storageService.getItem(KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  saveSettings: (settings) => {
    storageService.setItem(KEYS.SETTINGS, settings);
  },

  // Semester 5 Regular Subjects
  getSemester5Subjects: () => {
    return storageService.getItem(KEYS.SEMESTER_5, INITIAL_SEMESTER_5_SUBJECTS);
  },
  saveSemester5Subjects: (subjects) => {
    storageService.setItem(KEYS.SEMESTER_5, subjects);
  },

  // Minor Subjects (IoT & Sensors)
  getMinorSubjects: () => {
    return storageService.getItem(KEYS.MINOR, INITIAL_MINOR_SUBJECTS);
  },
  saveMinorSubjects: (subjects) => {
    storageService.setItem(KEYS.MINOR, subjects);
  },

  // Elective Subjects (Operating System Security)
  getElectiveSubjects: () => {
    return storageService.getItem(KEYS.ELECTIVE, INITIAL_ELECTIVE_SUBJECTS);
  },
  saveElectiveSubjects: (subjects) => {
    storageService.setItem(KEYS.ELECTIVE, subjects);
  },

  // Past Semesters
  getPastSemesters: () => {
    return storageService.getItem(KEYS.PAST_SEMESTERS, INITIAL_PAST_SEMESTERS);
  },
  savePastSemesters: (semesters) => {
    storageService.setItem(KEYS.PAST_SEMESTERS, semesters);
  },

  // Upcoming Exams
  getExams: () => {
    return storageService.getItem(KEYS.EXAMS, INITIAL_EXAMS);
  },
  saveExams: (exams) => {
    storageService.setItem(KEYS.EXAMS, exams);
  },

  // Activity Log
  getActivities: () => {
    return storageService.getItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },
  saveActivities: (activities) => {
    storageService.setItem(KEYS.ACTIVITIES, activities);
  },

  // Internal Assessment Configurations per Subject
  getInternalAssessments: () => {
    return storageService.getItem(KEYS.INTERNAL_ASSESSMENTS, {});
  },
  saveInternalAssessments: (configs) => {
    storageService.setItem(KEYS.INTERNAL_ASSESSMENTS, configs);
  },

  // End Semester Assessment Configurations per Subject
  getEndSemAssessments: () => {
    return storageService.getItem(KEYS.END_SEM_ASSESSMENTS, {});
  },
  saveEndSemAssessments: (configs) => {
    storageService.setItem(KEYS.END_SEM_ASSESSMENTS, configs);
  },

  // Reset to defaults
  resetToDefaults: () => {
    storageService.setItem(KEYS.SETTINGS, INITIAL_SETTINGS);
    storageService.setItem(KEYS.SEMESTER_5, INITIAL_SEMESTER_5_SUBJECTS);
    storageService.setItem(KEYS.MINOR, INITIAL_MINOR_SUBJECTS);
    storageService.setItem(KEYS.ELECTIVE, INITIAL_ELECTIVE_SUBJECTS);
    storageService.setItem(KEYS.PAST_SEMESTERS, INITIAL_PAST_SEMESTERS);
    storageService.setItem(KEYS.EXAMS, INITIAL_EXAMS);
    storageService.setItem(KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },

  // Hard clear all data
  clearAllData: () => {
    storageService.clearAll();
  }
};


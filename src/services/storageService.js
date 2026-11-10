/**
 * LocalStorage Service abstraction for GradeMate
 * Designed for seamless transition to Spring Boot REST endpoints in the future.
 */

const STORAGE_KEYS = {
  SETTINGS: 'grademate_settings_v1',
  SEMESTER_5: 'grademate_semester5_v1',
  MINOR: 'grademate_minor_v1',
  ELECTIVE: 'grademate_elective_v1',
  PAST_SEMESTERS: 'grademate_past_semesters_v1',
  EXAMS: 'grademate_exams_v1',
  ACTIVITIES: 'grademate_activities_v1',
  INTERNAL_ASSESSMENTS: 'grademate_internal_assessments_v1',
  END_SEM_ASSESSMENTS: 'grademate_end_sem_assessments_v1',
};

export const storageService = {
  getItem: (key, defaultValue) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Failed to load ${key} from localStorage:`, e);
      return defaultValue;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save ${key} to localStorage:`, e);
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Failed to remove ${key} from localStorage:`, e);
    }
  },

  clearAll: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.error('Failed to clear application storage:', e);
    }
  },

  // Export all application data as a JSON string
  exportAllData: () => {
    const data = {};
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      const val = localStorage.getItem(key);
      data[name] = val ? JSON.parse(val) : null;
    });
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      appName: 'GradeMate',
      data
    }, null, 2);
  },

  // Import application data from JSON
  importAllData: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.data) {
        throw new Error('Invalid backup file format: missing data container.');
      }
      const data = parsed.data;
      Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
        if (data[name] !== undefined && data[name] !== null) {
          localStorage.setItem(key, JSON.stringify(data[name]));
        }
      });
      return { success: true, message: 'Data imported successfully.' };
    } catch (err) {
      console.error('Error importing JSON data:', err);
      return { success: false, message: err.message || 'Corrupt JSON file.' };
    }
  },

  KEYS: STORAGE_KEYS,
};


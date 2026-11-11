/**
 * GradeMate – Syllabus-Based Continuous Internal Assessment (CIA) Distributions
 * 
 * Defines the standard syllabus mark distributions for KTU / Autonomous schemes:
 * - Theory (50 CIA): 12.5 CAT 1 + 12.5 CAT 2 + 15 Assignments (7.5 + 7.5) + 10 Attendance
 * - Core / Autonomous (25 CIA): 7.5 CAT 1 + 7.5 CAT 2 + 5 Assignment + 5 Attendance
 * - Integrated Theory + Practical (50 CIA): 7.5 CAT 1 + 7.5 CAT 2 + 5 Assignment + 5 Attendance + 25 Practical
 * - Laboratory (50 CIA): 7.5 Lab Test 1 + 7.5 Lab Test 2 + 30 Continuous Lab Record + 5 Attendance
 */

export const SYLLABUS_PRESETS = [
  {
    id: 'preset-theory-50',
    name: 'Standard Theory (50 CIA)',
    schemeName: 'Standard Theory (50 CIA)',
    description: '12.5 + 12.5 CATs, 15 Assignments, 10 Attendance',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical Component',
    practicalMax: 0,
  },
  {
    id: 'preset-core-25',
    name: 'Core Curriculum (25 CIA)',
    schemeName: 'Core Curriculum (25 CIA)',
    description: '7.5 + 7.5 CATs, 5 Assignment, 5 Attendance',
    totalCiaMax: 25,
    attendanceMax: 5,
    assignment1Max: 5,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: false,
    practicalName: 'Practical Component',
    practicalMax: 0,
  },
  {
    id: 'preset-integrated-50',
    name: 'Integrated Activity / Project (50 CIA)',
    schemeName: 'Integrated Activity / Project (50 CIA)',
    description: '7.5 + 7.5 CATs, 5 Assignment, 5 Attendance, 25 Design Project',
    totalCiaMax: 50,
    attendanceMax: 5,
    assignment1Max: 5,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: true,
    practicalName: 'Design Project / Practical Work',
    practicalMax: 25,
  },
  {
    id: 'preset-lab-50',
    name: 'Laboratory / Practical Course (50 CIA)',
    schemeName: 'Laboratory / Practical Course (50 CIA)',
    description: '7.5 + 7.5 Lab Tests, 30 Continuous Lab Work, 5 Attendance',
    totalCiaMax: 50,
    attendanceMax: 5,
    assignment1Max: 0,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: true,
    practicalName: 'Continuous Lab Work & Records',
    practicalMax: 30,
  },
];

export const DEFAULT_SUBJECT_SYLLABUS_SCHEMES = {
  // CS301 Computer Networks (Theory 4 Credits)
  's5-1': {
    schemeName: 'Theory Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // CS303 Software Engineering (Theory 3 Credits)
  's5-2': {
    schemeName: 'Theory Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // MA301 Advanced Mathematics for Data Science (Theory 4 Credits)
  's5-3': {
    schemeName: 'Theory Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // CS305 Machine Learning (Theory 4 Credits)
  's5-4': {
    schemeName: 'Theory Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // ES301 Design Thinking for Engineering (Activity / Project Based)
  's5-5': {
    schemeName: 'Project & Activity Based (7.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 5,
    assignment1Max: 5,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: true,
    practicalName: 'Design Thinking Project & Portfolio',
    practicalMax: 25,
  },
  // CS331 Machine Learning Lab (Lab Course)
  's5-6': {
    schemeName: 'Laboratory & Practical (Continuous Evaluation)',
    totalCiaMax: 50,
    attendanceMax: 5,
    assignment1Max: 0,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: true,
    practicalName: 'Continuous Lab Work & Record',
    practicalMax: 30,
  },
  // CS333 Computer Networks Lab (Lab Course)
  's5-7': {
    schemeName: 'Laboratory & Practical (Continuous Evaluation)',
    totalCiaMax: 50,
    attendanceMax: 5,
    assignment1Max: 0,
    hasAssignment2: false,
    assignment2Max: 0,
    cat1Contribution: 7.5,
    cat2Contribution: 7.5,
    hasPractical: true,
    practicalName: 'Continuous Lab Work & Record',
    practicalMax: 30,
  },
  // IOT301 Introduction to IoT (Minor Track)
  'min-1': {
    schemeName: 'Minor Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // IOT302 Sensors & Signal Conditioning (Minor Track)
  'min-2': {
    schemeName: 'Minor Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
  // PE-CS411 OS Security (Elective Track)
  'elec-1': {
    schemeName: 'Elective Curriculum (12.5 CATs)',
    totalCiaMax: 50,
    attendanceMax: 10,
    assignment1Max: 7.5,
    hasAssignment2: true,
    assignment2Max: 7.5,
    cat1Contribution: 12.5,
    cat2Contribution: 12.5,
    hasPractical: false,
    practicalName: 'Practical / Lab Work',
    practicalMax: 0,
  },
};

/**
 * Resolve the default syllabus scheme for any given subject
 */
export function getSubjectDefaultSyllabusScheme(subject) {
  if (!subject) return { ...SYLLABUS_PRESETS[0] };

  if (DEFAULT_SUBJECT_SYLLABUS_SCHEMES[subject.id]) {
    return { ...DEFAULT_SUBJECT_SYLLABUS_SCHEMES[subject.id] };
  }

  const nameLower = (subject.name || '').toLowerCase();
  const codeLower = (subject.code || '').toLowerCase();

  // Detect laboratory subjects
  if (nameLower.includes('lab') || codeLower.includes('lab') || codeLower.startsWith('cs33')) {
    return { ...SYLLABUS_PRESETS[3] }; // preset-lab-50
  }

  // Detect courses with maximum CIA = 25
  const ciaMax = Number(subject.ciaMax) || 50;
  if (ciaMax <= 25) {
    return { ...SYLLABUS_PRESETS[1] }; // preset-core-25
  }

  // Detect project or design thinking courses
  if (nameLower.includes('design thinking') || nameLower.includes('project') || nameLower.includes('seminar')) {
    return { ...SYLLABUS_PRESETS[2] }; // preset-integrated-50
  }

  // Default theory course (50 CIA, 12.5 CATs)
  return { ...SYLLABUS_PRESETS[0] };
}

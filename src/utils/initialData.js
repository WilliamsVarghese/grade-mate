import { DEFAULT_GRADE_SCALE } from './grading.js';
import { calculateSubjectMarks } from './calculations.js';

export const INITIAL_SETTINGS = {
  studentProfile: {
    name: 'Alex Morgan',
    college: 'Sahrdaya College of Engineering & Technology',
    department: 'Computer Science and Engineering',
    academicYear: '2024–2025',
    currentSemester: 'Semester 5',
    studentId: 'SCET-CS-22-045',
    degreeCreditsTarget: 160,
    regulations: 'Autonomous 2023 Regulation (KTU Scheme)'
  },
  assessmentScheme: {
    type: 'sum', // 'sum' or 'weighted'
    ciaWeight: 50,
    eseWeight: 50,
    defaultCiaMax: 50,
    defaultEseMax: 50,
    minPassPercentage: 45,
  },
  gradeScale: DEFAULT_GRADE_SCALE,
  theme: 'system', // 'light', 'dark', 'system'
};

export const SEMESTERS = [
  { id: 'sem-1', number: 1, name: 'Semester 1', shortName: 'S1', academicYear: '2022–2023', status: 'Completed' },
  { id: 'sem-2', number: 2, name: 'Semester 2', shortName: 'S2', academicYear: '2022–2023', status: 'Completed' },
  { id: 'sem-3', number: 3, name: 'Semester 3', shortName: 'S3', academicYear: '2023–2024', status: 'Completed' },
  { id: 'sem-4', number: 4, name: 'Semester 4', shortName: 'S4', academicYear: '2023–2024', status: 'Completed' },
  { id: 'sem-5', number: 5, name: 'Semester 5', shortName: 'S5', academicYear: '2024–2025', status: 'In Progress' },
  { id: 'sem-6', number: 6, name: 'Semester 6', shortName: 'S6', academicYear: '2024–2025', status: 'Upcoming' },
  { id: 'sem-7', number: 7, name: 'Semester 7', shortName: 'S7', academicYear: '2025–2026', status: 'Upcoming' },
  { id: 'sem-8', number: 8, name: 'Semester 8', shortName: 'S8', academicYear: '2025–2026', status: 'Upcoming' },
];

const rawSemester1Subjects = [
  { id: 's1-1', name: 'Linear Algebra and Calculus', code: 'MAT101', credits: 4, ciaMarks: 44, ciaMax: 50, eseMarks: 41, eseMax: 50, attendance: 92, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-2', name: 'Engineering Physics', code: 'PHT100', credits: 4, ciaMarks: 45, ciaMax: 50, eseMarks: 43, eseMax: 50, attendance: 95, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-3', name: 'Engineering Graphics', code: 'EST110', credits: 3, ciaMarks: 42, ciaMax: 50, eseMarks: 40, eseMax: 50, attendance: 88, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-4', name: 'Basics of Civil & Mechanical Engg', code: 'EST100', credits: 4, ciaMarks: 43, ciaMax: 50, eseMarks: 42, eseMax: 50, attendance: 90, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-5', name: 'Life Skills', code: 'HUN101', credits: 2, ciaMarks: 46, ciaMax: 50, eseMarks: 45, eseMax: 50, attendance: 96, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-6', name: 'Engineering Physics Lab', code: 'PHL120', credits: 1, ciaMarks: 48, ciaMax: 50, eseMarks: 47, eseMax: 50, attendance: 98, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
  { id: 's1-7', name: 'Civil & Mechanical Workshop', code: 'ESL130', credits: 1, ciaMarks: 49, ciaMax: 50, eseMarks: 48, eseMax: 50, attendance: 97, progress: 100, schemeType: 'sum', semester: 'Semester 1' },
];

const rawSemester2Subjects = [
  { id: 's2-1', name: 'Vector Calculus & Diff Equations', code: 'MAT102', credits: 4, ciaMarks: 43, ciaMax: 50, eseMarks: 42, eseMax: 50, attendance: 91, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-2', name: 'Engineering Chemistry', code: 'CYT100', credits: 4, ciaMarks: 44, ciaMax: 50, eseMarks: 43, eseMax: 50, attendance: 94, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-3', name: 'Programming in C', code: 'EST102', credits: 4, ciaMarks: 48, ciaMax: 50, eseMarks: 46, eseMax: 50, attendance: 96, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-4', name: 'Basics of Electrical & Electronics', code: 'EST130', credits: 4, ciaMarks: 42, ciaMax: 50, eseMarks: 40, eseMax: 50, attendance: 89, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-5', name: 'Professional Communication', code: 'HUN102', credits: 2, ciaMarks: 46, ciaMax: 50, eseMarks: 45, eseMax: 50, attendance: 95, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-6', name: 'Chemistry Lab', code: 'CYL120', credits: 1, ciaMarks: 47, ciaMax: 50, eseMarks: 46, eseMax: 50, attendance: 98, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
  { id: 's2-7', name: 'Programming in C Lab', code: 'ESL120', credits: 1, ciaMarks: 49, ciaMax: 50, eseMarks: 49, eseMax: 50, attendance: 99, progress: 100, schemeType: 'sum', semester: 'Semester 2' },
];

const rawSemester3Subjects = [
  { id: 's3-1', name: 'Discrete Mathematical Structures', code: 'MAT203', credits: 4, ciaMarks: 44, ciaMax: 50, eseMarks: 43, eseMax: 50, attendance: 93, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-2', name: 'Data Structures', code: 'CST201', credits: 4, ciaMarks: 47, ciaMax: 50, eseMarks: 46, eseMax: 50, attendance: 96, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-3', name: 'Logic System Design', code: 'CST203', credits: 4, ciaMarks: 42, ciaMax: 50, eseMarks: 41, eseMax: 50, attendance: 90, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-4', name: 'Object Oriented Programming in Java', code: 'CST205', credits: 4, ciaMarks: 48, ciaMax: 50, eseMarks: 47, eseMax: 50, attendance: 97, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-5', name: 'Sustainable Engineering', code: 'MCN201', credits: 2, ciaMarks: 45, ciaMax: 50, eseMarks: 44, eseMax: 50, attendance: 92, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-6', name: 'Data Structures Lab', code: 'CSL201', credits: 2, ciaMarks: 48, ciaMax: 50, eseMarks: 47, eseMax: 50, attendance: 98, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
  { id: 's3-7', name: 'Java Programming Lab', code: 'CSL203', credits: 2, ciaMarks: 49, ciaMax: 50, eseMarks: 48, eseMax: 50, attendance: 99, progress: 100, schemeType: 'sum', semester: 'Semester 3' },
];

const rawSemester4Subjects = [
  { id: 's4-1', name: 'Probability, Stats & Numerical Methods', code: 'MAT206', credits: 4, ciaMarks: 45, ciaMax: 50, eseMarks: 44, eseMax: 50, attendance: 94, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-2', name: 'Computer Organization & Architecture', code: 'CST202', credits: 4, ciaMarks: 44, ciaMax: 50, eseMarks: 43, eseMax: 50, attendance: 92, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-3', name: 'Database Management Systems', code: 'CST204', credits: 4, ciaMarks: 47, ciaMax: 50, eseMarks: 46, eseMax: 50, attendance: 96, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-4', name: 'Operating Systems', code: 'CST206', credits: 4, ciaMarks: 46, ciaMax: 50, eseMarks: 45, eseMax: 50, attendance: 95, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-5', name: 'Constitution of India', code: 'MCN202', credits: 2, ciaMarks: 45, ciaMax: 50, eseMarks: 44, eseMax: 50, attendance: 91, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-6', name: 'Digital Systems Lab', code: 'CSL202', credits: 2, ciaMarks: 48, ciaMax: 50, eseMarks: 48, eseMax: 50, attendance: 98, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
  { id: 's4-7', name: 'DBMS Lab', code: 'CSL204', credits: 2, ciaMarks: 49, ciaMax: 50, eseMarks: 48, eseMax: 50, attendance: 99, progress: 100, schemeType: 'sum', semester: 'Semester 4' },
];

const rawSemester5Subjects = [
  { id: 's5-1', name: 'Computer Networks', code: 'CS301', credits: 4, ciaMarks: 44, ciaMax: 50, eseMarks: 42, eseMax: 50, attendance: 92, progress: 85, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-2', name: 'Software Engineering', code: 'CS303', credits: 3, ciaMarks: 46, ciaMax: 50, eseMarks: 45, eseMax: 50, attendance: 95, progress: 90, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-3', name: 'Advanced Mathematics for Data Science', code: 'MA301', credits: 4, ciaMarks: 40, ciaMax: 50, eseMarks: 39, eseMax: 50, attendance: 88, progress: 80, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-4', name: 'Machine Learning', code: 'CS305', credits: 4, ciaMarks: 47, ciaMax: 50, eseMarks: 46, eseMax: 50, attendance: 96, progress: 92, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-5', name: 'Design Thinking for Engineering', code: 'ES301', credits: 2, ciaMarks: 45, ciaMax: 50, eseMarks: 43, eseMax: 50, attendance: 90, progress: 88, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-6', name: 'Machine Learning Lab', code: 'CS331', credits: 2, ciaMarks: 48, ciaMax: 50, eseMarks: 47, eseMax: 50, attendance: 98, progress: 95, schemeType: 'sum', semester: 'Semester 5' },
  { id: 's5-7', name: 'Computer Networks Lab', code: 'CS333', credits: 2, ciaMarks: 45, ciaMax: 50, eseMarks: 44, eseMax: 50, attendance: 94, progress: 90, schemeType: 'sum', semester: 'Semester 5' },
];

const rawSemester6Subjects = [
  { id: 's6-1', name: 'Compiler Design', code: 'CST302', credits: 4, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
  { id: 's6-2', name: 'Computer Graphics & Image Processing', code: 'CST304', credits: 4, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
  { id: 's6-3', name: 'Algorithm Analysis & Design', code: 'CST306', credits: 4, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
  { id: 's6-4', name: 'Comprehensive Course Work', code: 'CST308', credits: 1, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
  { id: 's6-5', name: 'Networking Lab', code: 'CSL332', credits: 2, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
  { id: 's6-6', name: 'Mini Project', code: 'CSD334', credits: 2, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 6' },
];

const rawSemester7Subjects = [
  { id: 's7-1', name: 'Artificial Intelligence', code: 'CST401', credits: 3, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 7' },
  { id: 's7-2', name: 'Industrial Economics & Foreign Trade', code: 'HUT401', credits: 3, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 7' },
  { id: 's7-3', name: 'Distributed Computing', code: 'CST411', credits: 3, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 7' },
  { id: 's7-4', name: 'Compiler Lab', code: 'CSL411', credits: 2, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 7' },
  { id: 's7-5', name: 'Seminar & Project Phase I', code: 'CSD415', credits: 2, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 7' },
];

const rawSemester8Subjects = [
  { id: 's8-1', name: 'Cloud Computing', code: 'CST402', credits: 3, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 8' },
  { id: 's8-2', name: 'Cyber Security & Ethics', code: 'CST404', credits: 3, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 8' },
  { id: 's8-3', name: 'Project Phase II', code: 'CSD416', credits: 4, ciaMarks: 0, ciaMax: 50, eseMarks: 0, eseMax: 50, attendance: 0, progress: 0, schemeType: 'sum', semester: 'Semester 8' },
];

const rawMinorSubjects = [
  {
    id: 'min-1',
    name: 'Introduction to IoT & Smart Architectures',
    code: 'IOT301',
    credits: 4,
    ciaMarks: 43,
    ciaMax: 50,
    eseMarks: 41,
    eseMax: 50,
    attendance: 91,
    progress: 85,
    track: 'Minor in IoT and Sensors',
    semester: 'Semester 5',
    schemeType: 'sum',
  },
  {
    id: 'min-2',
    name: 'Sensors, Actuators & Signal Conditioning',
    code: 'IOT302',
    credits: 4,
    ciaMarks: 45,
    ciaMax: 50,
    eseMarks: 44,
    eseMax: 50,
    attendance: 93,
    progress: 80,
    track: 'Minor in IoT and Sensors',
    semester: 'Semester 5',
    schemeType: 'sum',
  },
];

const rawElectiveSubjects = [
  {
    id: 'elec-1',
    name: 'Operating System Security',
    code: 'PE-CS411',
    credits: 3,
    ciaMarks: 46,
    ciaMax: 50,
    eseMarks: 45,
    eseMax: 50,
    attendance: 94,
    progress: 90,
    electiveTrack: 'Professional Elective 2',
    semester: 'Semester 5',
    schemeType: 'sum',
  },
];

// Helper to compute calculated subject marks
const transformSubjects = (list) => list.map(s => calculateSubjectMarks(s, INITIAL_SETTINGS));

export const INITIAL_SEMESTERS_DATA = {
  'sem-1': transformSubjects(rawSemester1Subjects),
  'sem-2': transformSubjects(rawSemester2Subjects),
  'sem-3': transformSubjects(rawSemester3Subjects),
  'sem-4': transformSubjects(rawSemester4Subjects),
  'sem-5': transformSubjects(rawSemester5Subjects),
  'sem-6': transformSubjects(rawSemester6Subjects),
  'sem-7': transformSubjects(rawSemester7Subjects),
  'sem-8': transformSubjects(rawSemester8Subjects),
};

export const INITIAL_SEMESTER_5_SUBJECTS = INITIAL_SEMESTERS_DATA['sem-5'];
export const INITIAL_MINOR_SUBJECTS = transformSubjects(rawMinorSubjects);
export const INITIAL_ELECTIVE_SUBJECTS = transformSubjects(rawElectiveSubjects);

export const INITIAL_PAST_SEMESTERS = [
  { semester: 'Semester 1', sgpa: 8.52, credits: 19, academicYear: '2022-2023', status: 'Completed' },
  { semester: 'Semester 2', sgpa: 8.68, credits: 20, academicYear: '2022-2023', status: 'Completed' },
  { semester: 'Semester 3', sgpa: 8.75, credits: 22, academicYear: '2023-2024', status: 'Completed' },
  { semester: 'Semester 4', sgpa: 8.85, credits: 22, academicYear: '2023-2024', status: 'Completed' },
];

export const INITIAL_EXAMS = [
  {
    id: 'exam-1',
    subject: 'Machine Learning (CS305)',
    type: 'Internal Assessment 2',
    date: '2026-11-18',
    time: '10:00 AM - 12:00 PM',
    venue: 'Exam Hall B-204',
    syllabus: 'Modules 3 & 4 (Ensembles, Neural Networks)',
  },
  {
    id: 'exam-2',
    subject: 'Computer Networks (CS301)',
    type: 'Internal Assessment 2',
    date: '2026-11-20',
    time: '02:00 PM - 04:00 PM',
    venue: 'Exam Hall A-102',
    syllabus: 'Transport & Network Layer Protocols',
  },
  {
    id: 'exam-3',
    subject: 'Operating System Security (PE-CS411)',
    type: 'Mid-term Practical Review',
    date: '2026-11-25',
    time: '09:30 AM - 12:30 PM',
    venue: 'Security Research Lab 3',
    syllabus: 'Access Control Models, Buffer Overflow Defenses',
  },
  {
    id: 'exam-4',
    subject: 'End Semester University Examinations',
    type: 'Final Theory ESE',
    date: '2026-12-10',
    time: '09:30 AM - 12:30 PM',
    venue: 'Main Examination Center',
    syllabus: 'Full Course Syllabus (All 5 Modules)',
  },
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    action: 'Marks Updated',
    details: 'Internal score recorded for Machine Learning (47/50)',
    timestamp: '2 hours ago',
    type: 'marks',
  },
  {
    id: 'act-2',
    action: 'Exam Scheduled',
    details: 'Added Internal Assessment 2 for Computer Networks',
    timestamp: '1 day ago',
    type: 'exam',
  },
  {
    id: 'act-3',
    action: 'Subject Enrolled',
    details: 'Enrolled in Operating System Security (PE-CS411)',
    timestamp: '3 days ago',
    type: 'subject',
  },
  {
    id: 'act-4',
    action: 'Grade Scale Configured',
    details: 'Updated Autonomous 2023 10-point grading boundaries',
    timestamp: '1 week ago',
    type: 'settings',
  },
];

import { DEFAULT_GRADE_SCALE } from './grading';
import { calculateSubjectMarks } from './calculations';

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

const rawSemester5Subjects = [
  {
    id: 's5-1',
    name: 'Computer Networks',
    code: 'CS301',
    credits: 4,
    ciaMarks: 44,
    ciaMax: 50,
    eseMarks: 42,
    eseMax: 50,
    attendance: 92,
    progress: 85,
    schemeType: 'sum',
  },
  {
    id: 's5-2',
    name: 'Software Engineering',
    code: 'CS303',
    credits: 3,
    ciaMarks: 46,
    ciaMax: 50,
    eseMarks: 45,
    eseMax: 50,
    attendance: 95,
    progress: 90,
    schemeType: 'sum',
  },
  {
    id: 's5-3',
    name: 'Advanced Mathematics for Data Science',
    code: 'MA301',
    credits: 4,
    ciaMarks: 40,
    ciaMax: 50,
    eseMarks: 39,
    eseMax: 50,
    attendance: 88,
    progress: 80,
    schemeType: 'sum',
  },
  {
    id: 's5-4',
    name: 'Machine Learning',
    code: 'CS305',
    credits: 4,
    ciaMarks: 47,
    ciaMax: 50,
    eseMarks: 46,
    eseMax: 50,
    attendance: 96,
    progress: 92,
    schemeType: 'sum',
  },
  {
    id: 's5-5',
    name: 'Design Thinking for Engineering',
    code: 'ES301',
    credits: 2,
    ciaMarks: 45,
    ciaMax: 50,
    eseMarks: 43,
    eseMax: 50,
    attendance: 90,
    progress: 88,
    schemeType: 'sum',
  },
  {
    id: 's5-6',
    name: 'Machine Learning Lab',
    code: 'CS331',
    credits: 2,
    ciaMarks: 48,
    ciaMax: 50,
    eseMarks: 47,
    eseMax: 50,
    attendance: 98,
    progress: 95,
    schemeType: 'sum',
  },
  {
    id: 's5-7',
    name: 'Computer Networks Lab',
    code: 'CS333',
    credits: 2,
    ciaMarks: 45,
    ciaMax: 50,
    eseMarks: 44,
    eseMax: 50,
    attendance: 94,
    progress: 90,
    schemeType: 'sum',
  },
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
    schemeType: 'sum',
  },
];

export const INITIAL_SEMESTER_5_SUBJECTS = rawSemester5Subjects.map(s => calculateSubjectMarks(s, INITIAL_SETTINGS));
export const INITIAL_MINOR_SUBJECTS = rawMinorSubjects.map(s => calculateSubjectMarks(s, INITIAL_SETTINGS));
export const INITIAL_ELECTIVE_SUBJECTS = rawElectiveSubjects.map(s => calculateSubjectMarks(s, INITIAL_SETTINGS));

export const INITIAL_PAST_SEMESTERS = [
  { semester: 'Semester 1', sgpa: 8.52, credits: 21, academicYear: '2022-2023', status: 'Completed' },
  { semester: 'Semester 2', sgpa: 8.68, credits: 21, academicYear: '2022-2023', status: 'Completed' },
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


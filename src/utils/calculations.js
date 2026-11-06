import { getGradeFromPercentage } from './grading';

/**
 * Calculate subject total, percentage, grade and grade points based on assessment scheme.
 */
export function calculateSubjectMarks(subject, globalSettings = null) {
  const cia = Number(subject.ciaMarks) || 0;
  const ciaMax = Number(subject.ciaMax) || (globalSettings?.defaultCiaMax ?? 50);
  const ese = Number(subject.eseMarks) || 0;
  const eseMax = Number(subject.eseMax) || (globalSettings?.defaultEseMax ?? 50);

  const schemeType = subject.schemeType || globalSettings?.assessmentSchemeType || 'sum'; // 'sum' or 'weighted'
  const ciaWeight = Number(subject.ciaWeight ?? globalSettings?.ciaWeight ?? 50);
  const eseWeight = Number(subject.eseWeight ?? globalSettings?.eseWeight ?? 50);

  let totalMarks = 0;
  let maxMarks = ciaMax + eseMax;
  let percentage = 0;

  if (schemeType === 'weighted') {
    const totalWeight = ciaWeight + eseWeight;
    const ciaRatio = ciaMax > 0 ? (cia / ciaMax) : 0;
    const eseRatio = eseMax > 0 ? (ese / eseMax) : 0;

    const weightedScore = (ciaRatio * ciaWeight) + (eseRatio * eseWeight);
    percentage = totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
    totalMarks = (percentage / 100) * maxMarks;
  } else {
    // Direct sum
    totalMarks = cia + ese;
    percentage = maxMarks > 0 ? (totalMarks / maxMarks) * 100 : 0;
  }

  // Round percentage to 2 decimal places
  percentage = Math.min(100, Math.max(0, Math.round(percentage * 100) / 100));
  totalMarks = Math.round(totalMarks * 10) / 10;

  // Derive grade unless user manually overrode it with an explicit valid grade
  const gradeScale = globalSettings?.gradeScale;
  let grade = subject.grade;
  let gradePoint = subject.gradePoint;

  if (!grade || subject.autoCalculateGrade !== false) {
    const derived = getGradeFromPercentage(percentage, gradeScale);
    grade = derived.grade;
    gradePoint = derived.gradePoint;
  } else if (gradePoint === undefined || gradePoint === null) {
    const derived = getGradeFromPercentage(percentage, gradeScale);
    gradePoint = derived.gradePoint;
  }

  return {
    ...subject,
    ciaMarks: cia,
    ciaMax,
    eseMarks: ese,
    eseMax,
    maxMarks,
    totalMarks,
    percentage,
    grade,
    gradePoint: Number(gradePoint) || 0,
  };
}

/**
 * Calculate SGPA for a list of subjects
 * SGPA = Σ(Credit × Grade Point) / Σ(Credits)
 */
export function calculateSGPA(subjects = []) {
  if (!subjects || subjects.length === 0) {
    return { sgpa: 0, totalCredits: 0, totalWeightedPoints: 0 };
  }

  let totalCredits = 0;
  let totalWeightedPoints = 0;

  subjects.forEach(sub => {
    const credits = Number(sub.credits) || 0;
    const gradePoint = Number(sub.gradePoint) || 0;

    totalCredits += credits;
    totalWeightedPoints += credits * gradePoint;
  });

  const sgpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;

  return {
    sgpa,
    totalCredits,
    totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
  };
}

/**
 * Calculate overall CGPA combining past semesters and current semester
 * CGPA = Total weighted grade points / Total completed credits
 */
export function calculateCGPA(pastSemesters = [], currentSemesterData = { sgpa: 0, credits: 0 }) {
  let totalCredits = 0;
  let totalWeightedPoints = 0;

  pastSemesters.forEach(sem => {
    const credits = Number(sem.credits) || 0;
    const sgpa = Number(sem.sgpa) || 0;
    totalCredits += credits;
    totalWeightedPoints += credits * sgpa;
  });

  if (currentSemesterData && currentSemesterData.credits > 0) {
    const curCredits = Number(currentSemesterData.credits) || 0;
    const curSgpa = Number(currentSemesterData.sgpa) || 0;
    totalCredits += curCredits;
    totalWeightedPoints += curCredits * curSgpa;
  }

  const cgpa = totalCredits > 0 ? Math.round((totalWeightedPoints / totalCredits) * 100) / 100 : 0;

  return {
    cgpa,
    totalCompletedCredits: totalCredits,
    totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
  };
}

/**
 * Calculate average CIA score and percentage across subjects
 */
export function calculateAverageCIA(subjects = []) {
  if (!subjects || subjects.length === 0) return { avgCIA: 0, avgCIAPercentage: 0 };

  let totalCIA = 0;
  let totalCIAMax = 0;

  subjects.forEach(s => {
    totalCIA += Number(s.ciaMarks) || 0;
    totalCIAMax += Number(s.ciaMax) || 50;
  });

  const avgCIA = Math.round((totalCIA / subjects.length) * 10) / 10;
  const avgCIAPercentage = totalCIAMax > 0 ? Math.round((totalCIA / totalCIAMax) * 1000) / 10 : 0;

  return { avgCIA, avgCIAPercentage };
}

/**
 * Find best and lowest performing subjects
 */
export function findExtremeSubjects(subjects = []) {
  if (!subjects || subjects.length === 0) {
    return { best: null, lowest: null };
  }

  const sorted = [...subjects].sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
  return {
    best: sorted[0],
    lowest: sorted[sorted.length - 1],
  };
}


import { getGradeFromPercentage } from './grading.js';

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

/**
 * Calculate weighted marks for a single component:
 * Weighted = (Obtained / Maximum) * Contribution
 */
export function calculateWeightedComponent(obtained, maximum, contribution) {
  const obt = Number(obtained) || 0;
  const max = Number(maximum) || 0;
  const cont = Number(contribution) || 0;

  if (max <= 0) return 0;
  const score = (obt / max) * cont;
  return Math.round(score * 100) / 100;
}

/**
 * Calculate attendance percentage and marks based on marking scheme:
 * - 'proportional': (percentage / 100) * contribution
 * - 'slab': Standard university slabs (>=90: 100%, >=85: 80%, >=80: 60%, >=75: 40%, <75: 0)
 * - 'direct': directly entered score
 */
export function calculateAttendanceEvaluation(attended, conducted, contribution, scheme = 'proportional', manualScore = null) {
  const att = Math.max(0, Number(attended) || 0);
  const cond = Math.max(0, Number(conducted) || 0);
  const cont = Math.max(0, Number(contribution) || 0);

  const percentage = cond > 0 ? Math.min(100, Math.round((att / cond) * 10000) / 100) : 0;
  let marksObtained = 0;

  if (scheme === 'direct' && manualScore !== null && manualScore !== undefined) {
    marksObtained = Math.min(cont, Math.max(0, Number(manualScore) || 0));
  } else if (scheme === 'slab') {
    if (percentage >= 90) {
      marksObtained = cont;
    } else if (percentage >= 85) {
      marksObtained = Math.round(cont * 0.8 * 100) / 100;
    } else if (percentage >= 80) {
      marksObtained = Math.round(cont * 0.6 * 100) / 100;
    } else if (percentage >= 75) {
      marksObtained = Math.round(cont * 0.4 * 100) / 100;
    } else {
      marksObtained = 0;
    }
  } else {
    // Default proportional
    marksObtained = Math.round(((percentage / 100) * cont) * 100) / 100;
  }

  marksObtained = Math.min(cont, Math.max(0, marksObtained));

  return {
    percentage,
    marksObtained,
    isShortage: percentage < 75 && cond > 0,
    contribution: cont,
  };
}

/**
 * Calculate comprehensive internal assessment total from CAT1, CAT2, Attendance, and Additional components
 */
export function calculateInternalAssessmentBreakdown({
  cat1 = { obtained: 0, max: 50, contribution: 7.5 },
  cat2 = { obtained: 0, max: 50, contribution: 7.5 },
  attendance = { attended: 0, conducted: 0, contribution: 5, scheme: 'proportional', manualScore: null },
  components = []
}) {
  const cat1Weighted = calculateWeightedComponent(cat1.obtained, cat1.max, cat1.contribution);
  const cat2Weighted = calculateWeightedComponent(cat2.obtained, cat2.max, cat2.contribution);
  const combinedCatObtained = Math.round((cat1Weighted + cat2Weighted) * 100) / 100;
  const combinedCatContribution = Math.round(((Number(cat1.contribution) || 0) + (Number(cat2.contribution) || 0)) * 100) / 100;

  const attendanceResult = calculateAttendanceEvaluation(
    attendance.attended,
    attendance.conducted,
    attendance.contribution,
    attendance.scheme,
    attendance.manualScore
  );

  let componentsObtained = 0;
  let componentsContribution = 0;

  const evaluatedComponents = components.map(c => {
    const weighted = calculateWeightedComponent(c.obtained, c.max, c.contribution);
    componentsObtained += weighted;
    componentsContribution += Number(c.contribution) || 0;
    return {
      ...c,
      weighted,
    };
  });

  componentsObtained = Math.round(componentsObtained * 100) / 100;
  componentsContribution = Math.round(componentsContribution * 100) / 100;

  const totalObtained = Math.round((cat1Weighted + cat2Weighted + attendanceResult.marksObtained + componentsObtained) * 100) / 100;
  const maxInternal = Math.round((Number(cat1.contribution || 0) + Number(cat2.contribution || 0) + Number(attendance.contribution || 0) + componentsContribution) * 100) / 100;

  const internalPercentage = maxInternal > 0 ? Math.min(100, Math.round((totalObtained / maxInternal) * 10000) / 100) : 0;
  const remainingMarks = Math.max(0, Math.round((maxInternal - totalObtained) * 100) / 100);

  return {
    cat1: { ...cat1, weighted: cat1Weighted },
    cat2: { ...cat2, weighted: cat2Weighted },
    combinedCat: { obtained: combinedCatObtained, contribution: combinedCatContribution },
    attendance: { ...attendance, ...attendanceResult },
    components: evaluatedComponents,
    totalObtained,
    maxInternal,
    internalPercentage,
    remainingMarks,
  };
}

/**
 * Calculate converted CAT mark:
 * Both CAT examinations are conducted out of 30 marks.
 * Formula: CAT weighted mark = (Obtained CAT marks / 30) * CAT contribution
 * Rounded to 2 decimal places.
 *
 * Examples:
 * - CAT 1: 24/30, contribution 7.5 -> 6.00
 * - CAT 2: 26/30, contribution 7.5 -> 6.50
 * - CAT 1: 24/30, contribution 12.5 -> 10.00
 * - CAT 2: 26/30, contribution 12.5 -> 10.83
 */
export function calculateCatContribution(obtainedMarks, catContribution) {
  const obt = Math.max(0, Math.min(30, Number(obtainedMarks) || 0));
  const contrib = Math.max(0, Number(catContribution) || 0);
  const weighted = (obt / 30) * contrib;
  return Math.round(weighted * 100) / 100;
}

/**
 * Calculate simple syllabus-based CIA total:
 * - Attendance: obtained / max
 * - Assignment 1: obtained / max
 * - Assignment 2 (optional): obtained / max
 * - CAT 1: (obtained out of 30 / 30) * CAT 1 contribution
 * - CAT 2: (obtained out of 30 / 30) * CAT 2 contribution
 * - Practical / Lab (optional): obtained / max
 */
export function calculateSimpleInternalAssessment({
  attendance = { obtained: 0, max: 10 },
  assignment1 = { obtained: 0, max: 7.5 },
  assignment2 = { enabled: true, obtained: 0, max: 7.5 },
  cat1 = { obtained: 0, contribution: 12.5 },
  cat2 = { obtained: 0, contribution: 12.5 },
  practical = { enabled: false, name: 'Practical Component', obtained: 0, max: 25 },
}) {
  const attObtained = Math.min(Number(attendance.max) || 0, Math.max(0, Number(attendance.obtained) || 0));
  const attMax = Math.max(0, Number(attendance.max) || 0);

  const assign1Obtained = Math.min(Number(assignment1.max) || 0, Math.max(0, Number(assignment1.obtained) || 0));
  const assign1Max = Math.max(0, Number(assignment1.max) || 0);

  const hasAssign2 = !!assignment2.enabled;
  const assign2Obtained = hasAssign2
    ? Math.min(Number(assignment2.max) || 0, Math.max(0, Number(assignment2.obtained) || 0))
    : 0;
  const assign2Max = hasAssign2 ? Math.max(0, Number(assignment2.max) || 0) : 0;

  const cat1ObtainedRaw = Math.min(30, Math.max(0, Number(cat1.obtained) || 0));
  const cat1Contribution = Math.max(0, Number(cat1.contribution) || 0);
  const cat1Converted = calculateCatContribution(cat1ObtainedRaw, cat1Contribution);

  const cat2ObtainedRaw = Math.min(30, Math.max(0, Number(cat2.obtained) || 0));
  const cat2Contribution = Math.max(0, Number(cat2.contribution) || 0);
  const cat2Converted = calculateCatContribution(cat2ObtainedRaw, cat2Contribution);

  const hasPractical = !!practical.enabled;
  const practicalObtained = hasPractical
    ? Math.min(Number(practical.max) || 0, Math.max(0, Number(practical.obtained) || 0))
    : 0;
  const practicalMax = hasPractical ? Math.max(0, Number(practical.max) || 0) : 0;

  const totalObtained = Math.round(
    (attObtained + assign1Obtained + assign2Obtained + cat1Converted + cat2Converted + practicalObtained) * 100
  ) / 100;

  const maxInternal = Math.round(
    (attMax + assign1Max + assign2Max + cat1Contribution + cat2Contribution + practicalMax) * 100
  ) / 100;

  const percentage = maxInternal > 0 ? Math.min(100, Math.round((totalObtained / maxInternal) * 10000) / 100) : 0;
  const remainingMarks = Math.max(0, Math.round((maxInternal - totalObtained) * 100) / 100);

  return {
    attendance: { obtained: attObtained, max: attMax },
    assignment1: { obtained: assign1Obtained, max: assign1Max },
    assignment2: { enabled: hasAssign2, obtained: assign2Obtained, max: assign2Max },
    cat1: { obtained: cat1ObtainedRaw, converted: cat1Converted, contribution: cat1Contribution },
    cat2: { obtained: cat2ObtainedRaw, converted: cat2Converted, contribution: cat2Contribution },
    practical: {
      enabled: hasPractical,
      name: practical.name || 'Practical / Lab Work',
      obtained: practicalObtained,
      max: practicalMax
    },
    totalObtained,
    maxInternal,
    percentage,
    remainingMarks,
  };
}


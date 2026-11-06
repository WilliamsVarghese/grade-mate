/**
 * Default grading scales and calculation helpers
 */

export const DEFAULT_GRADE_SCALE = [
  { grade: 'O', minPercentage: 90, gradePoint: 10, description: 'Outstanding', color: 'emerald' },
  { grade: 'A+', minPercentage: 85, gradePoint: 9, description: 'Excellent', color: 'indigo' },
  { grade: 'A', minPercentage: 80, gradePoint: 8.5, description: 'Very Good', color: 'blue' },
  { grade: 'B+', minPercentage: 75, gradePoint: 8, description: 'Good', color: 'cyan' },
  { grade: 'B', minPercentage: 70, gradePoint: 7, description: 'Above Average', color: 'sky' },
  { grade: 'C', minPercentage: 60, gradePoint: 6, description: 'Average', color: 'amber' },
  { grade: 'P', minPercentage: 45, gradePoint: 5, description: 'Pass', color: 'orange' },
  { grade: 'F', minPercentage: 0, gradePoint: 0, description: 'Fail', color: 'rose' },
];

/**
 * Determine grade and grade point from a given percentage and grade scale
 */
export function getGradeFromPercentage(percentage, customScale = null) {
  const scale = customScale && customScale.length > 0 ? customScale : DEFAULT_GRADE_SCALE;
  // Sort descending by minPercentage
  const sorted = [...scale].sort((a, b) => b.minPercentage - a.minPercentage);

  const rounded = Math.round(percentage * 100) / 100;
  for (const item of sorted) {
    if (rounded >= item.minPercentage) {
      return {
        grade: item.grade,
        gradePoint: Number(item.gradePoint),
        description: item.description || '',
        color: item.color || 'slate'
      };
    }
  }

  const failItem = sorted[sorted.length - 1];
  return {
    grade: failItem.grade || 'F',
    gradePoint: Number(failItem.gradePoint) || 0,
    description: failItem.description || 'Fail',
    color: 'rose'
  };
}

/**
 * Get grade point directly from a letter grade
 */
export function getGradePointFromGrade(grade, customScale = null) {
  const scale = customScale && customScale.length > 0 ? customScale : DEFAULT_GRADE_SCALE;
  const match = scale.find(s => s.grade.toUpperCase() === (grade || '').toUpperCase());
  return match ? Number(match.gradePoint) : 0;
}


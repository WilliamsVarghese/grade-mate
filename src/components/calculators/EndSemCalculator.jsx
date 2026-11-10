import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Award,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Target,
  ArrowRight,
  Sparkles,
  Percent,
  Sliders
} from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAcademic } from '../../context/AcademicContext';
import { getGradeFromPercentage } from '../../utils/grading';
import { calculateWeightedComponent } from '../../utils/calculations';

export function EndSemCalculator({
  initialSubjectId = null,
  onApplySuccess = null,
  onSwitchToInternal = null,
}) {
  const {
    allSubjects,
    endSemAssessments,
    saveSubjectEndSemAssessment,
    settings,
  } = useAcademic();

  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    if (initialSubjectId && allSubjects.some(s => s.id === initialSubjectId)) {
      return initialSubjectId;
    }
    return allSubjects.length > 0 ? allSubjects[0].id : 'custom';
  });

  const selectedSubject = allSubjects.find(s => s.id === selectedSubjectId);

  // ESE fields
  const [eseObtained, setEseObtained] = useState('80');
  const [eseMax, setEseMax] = useState('100');
  const [eseWeightage, setEseWeightage] = useState('50'); // Scaled ESE contribution
  const [minPassPercentage, setMinPassPercentage] = useState('40'); // Min ESE % needed to pass
  const [ciaReferenceMarks, setCiaReferenceMarks] = useState('42');
  const [ciaReferenceMax, setCiaReferenceMax] = useState('50');

  const [validationErrors, setValidationErrors] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Sync if initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && allSubjects.some(s => s.id === initialSubjectId)) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId, allSubjects]);

  // Pre-fill when subject changes
  useEffect(() => {
    if (selectedSubjectId && selectedSubjectId !== 'custom') {
      const saved = endSemAssessments[selectedSubjectId];
      if (saved) {
        setEseObtained(saved.eseObtained?.toString() || '80');
        setEseMax(saved.eseMax?.toString() || '100');
        setEseWeightage(saved.eseWeightage?.toString() || '50');
        setMinPassPercentage(saved.minPassPercentage?.toString() || '40');
      } else if (selectedSubject) {
        setEseObtained(selectedSubject.eseMarks ? (selectedSubject.eseMarks * 2).toString() : '80');
        setEseMax('100');
        setEseWeightage(selectedSubject.eseMax?.toString() || '50');
        setMinPassPercentage('40');
      }

      if (selectedSubject) {
        setCiaReferenceMarks(selectedSubject.ciaMarks?.toString() || '40');
        setCiaReferenceMax(selectedSubject.ciaMax?.toString() || '50');
      }
    }
  }, [selectedSubjectId]);

  // Calculations
  const calculation = useMemo(() => {
    const errs = {};
    const obt = parseFloat(eseObtained) || 0;
    const max = parseFloat(eseMax) || 0;
    const weight = parseFloat(eseWeightage) || 0;
    const minPassPct = parseFloat(minPassPercentage) || 40;
    const cia = parseFloat(ciaReferenceMarks) || 0;
    const ciaM = parseFloat(ciaReferenceMax) || 50;

    if (max <= 0) errs.eseMax = 'Maximum marks must be > 0';
    if (weight <= 0) errs.eseWeightage = 'Weightage must be > 0';
    if (obt < 0) errs.eseObtained = 'Marks cannot be negative';
    if (obt > max) errs.eseObtained = `Cannot exceed max (${max})`;

    setValidationErrors(errs);

    const weightedEse = calculateWeightedComponent(obt, max, weight);
    const rawEsePercentage = max > 0 ? Math.round((obt / max) * 10000) / 100 : 0;
    const isEseThresholdPassed = rawEsePercentage >= minPassPct;

    // Combined total estimation
    const totalScore = Math.round((cia + weightedEse) * 10) / 10;
    const maxTotalScore = Math.round((ciaM + weight) * 10) / 10;
    const finalPercentage = maxTotalScore > 0 ? Math.round((totalScore / maxTotalScore) * 10000) / 100 : 0;

    const gradeInfo = getGradeFromPercentage(finalPercentage, settings.gradeScale);

    // Target ESE predictions for key letter grades
    const targets = [
      { grade: 'O', targetPct: 90 },
      { grade: 'A+', targetPct: 85 },
      { grade: 'A', targetPct: 80 },
      { grade: 'B+', targetPct: 75 },
      { grade: 'Pass', targetPct: 45 },
    ].map(t => {
      // FinalPct = (cia + weightedEse) / maxTotalScore * 100 = t.targetPct
      // cia + weightedEse = (t.targetPct / 100) * maxTotalScore
      // weightedEse = (t.targetPct / 100) * maxTotalScore - cia
      // (obtReq / max) * weight = weightedEse
      // obtReq = (weightedEse / weight) * max
      const neededWeighted = ((t.targetPct / 100) * maxTotalScore) - cia;
      let rawNeeded = 0;
      if (neededWeighted <= 0) {
        rawNeeded = 0; // Already attained!
      } else if (weight > 0) {
        rawNeeded = Math.round(((neededWeighted / weight) * max) * 10) / 10;
      }

      const isAchievable = rawNeeded <= max;
      return {
        ...t,
        rawNeeded,
        isAchievable,
        isGuaranteed: neededWeighted <= 0,
      };
    });

    return {
      weightedEse,
      rawEsePercentage,
      isEseThresholdPassed,
      totalScore,
      maxTotalScore,
      finalPercentage,
      grade: gradeInfo.grade,
      gradePoint: gradeInfo.gradePoint,
      gradeDescription: gradeInfo.description,
      targets,
    };
  }, [eseObtained, eseMax, eseWeightage, minPassPercentage, ciaReferenceMarks, ciaReferenceMax, settings.gradeScale]);

  const handleReset = () => {
    setEseObtained('80');
    setEseMax('100');
    setEseWeightage('50');
    setMinPassPercentage('40');
    setSaveSuccessMsg(null);
  };

  const handleSaveAndApply = () => {
    const payload = {
      eseObtained: parseFloat(eseObtained),
      eseMax: parseFloat(eseMax),
      eseWeightage: parseFloat(eseWeightage),
      minPassPercentage: parseFloat(minPassPercentage),
      weightedEse: calculation.weightedEse,
      maxEse: parseFloat(eseWeightage),
      calculatedAt: new Date().toISOString(),
    };

    saveSubjectEndSemAssessment(selectedSubjectId, payload, selectedSubjectId !== 'custom');

    const name = selectedSubject ? selectedSubject.name : 'Custom';
    setSaveSuccessMsg(`Applied ${calculation.weightedEse} / ${eseWeightage} ESE marks to ${name}!`);

    if (onApplySuccess) onApplySuccess(calculation);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Subject Selection */}
      <div className="p-5 rounded-3xl bg-[#141724] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9655F5] mb-1.5">
            Subject End-Semester Evaluation:
          </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-2xl bg-[#1C2030] text-white border border-white/[0.1] text-xs sm:text-sm font-semibold outline-none focus:border-[#9655F5]"
            >
              <option value="custom">⚡ Standalone / Custom Simulation</option>
              <optgroup label="Semester 5 Core Courses">
                {allSubjects
                  .filter(s => s.category === 'Semester 5 Core')
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || 'Core'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Minor Track (IoT & Sensors)">
                {allSubjects
                  .filter(s => s.category === 'Minor Track')
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || 'Minor'})
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Elective Track (OS Security)">
                {allSubjects
                  .filter(s => s.category === 'Elective Track')
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || 'Elective'})
                    </option>
                  ))}
              </optgroup>
            </select>

            {selectedSubject && (
              <span className="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.06] text-slate-300">
                CIA Score: {selectedSubject.ciaMarks} / {selectedSubject.ciaMax}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end">
          {onSwitchToInternal && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSwitchToInternal}
            >
              ← Open Internal Calc
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Exam Inputs & Scaling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: University ESE Raw Score */}
        <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9655F5]/20 text-[#C084FC] flex items-center justify-center font-black text-xs">
                  ESE
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    End-Semester University Exam
                  </h3>
                  <p className="text-[11px] text-slate-400">Written / Theory Examination</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#9655F5]/20 text-[#C084FC]">
                Weight: {eseWeightage}M
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <Input
                label="Exam Marks Obtained"
                type="number"
                step="0.5"
                min="0"
                value={eseObtained}
                onChange={(e) => setEseObtained(e.target.value)}
                error={validationErrors.eseObtained}
                placeholder="80"
              />
              <Input
                label="Exam Question Paper Max"
                type="number"
                step="1"
                min="1"
                value={eseMax}
                onChange={(e) => setEseMax(e.target.value)}
                error={validationErrors.eseMax}
                placeholder="100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
              <Input
                label="Scaled ESE Contribution"
                type="number"
                step="0.5"
                min="1"
                value={eseWeightage}
                onChange={(e) => setEseWeightage(e.target.value)}
                error={validationErrors.eseWeightage}
                helperText="Weight in final marks (e.g. 50)"
              />
              <Input
                label="Min ESE Passing Threshold (%)"
                type="number"
                min="0"
                max="100"
                value={minPassPercentage}
                onChange={(e) => setMinPassPercentage(e.target.value)}
                suffix="%"
                helperText="Typically 40% in university exams"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Passing Threshold</span>
              <span className={`text-xs font-bold ${calculation.isEseThresholdPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {calculation.isEseThresholdPassed ? '✓ Passed Min Cutoff' : '⚠ Below Min Cutoff'} ({calculation.rawEsePercentage}%)
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Scaled ESE Marks</span>
              <span className="text-xl font-black text-[#9655F5]">
                {calculation.weightedEse} <span className="text-xs font-normal text-slate-400">/ {eseWeightage}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Combined Subject Total & Grade Estimation */}
        <div className="p-5 rounded-3xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 px-2.5 py-0.5 rounded-full bg-black/10">
                Combined Course Result
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#0A0D06] text-[#9AF04F]">
                Grade {calculation.grade} ({calculation.gradePoint} GP)
              </span>
            </div>

            <div className="my-4">
              <span className="text-xs font-bold text-[#0A0D06]/70 uppercase block">Estimated Final Score</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-5xl font-black text-[#0A0D06]">
                  {calculation.totalScore}
                </span>
                <span className="text-lg font-bold text-[#0A0D06]/60">
                  / {calculation.maxTotalScore} Marks
                </span>
              </div>
              <p className="text-sm font-black text-[#0A0D06] mt-1">
                {calculation.finalPercentage}% • {calculation.gradeDescription}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/10 space-y-1.5 text-xs font-bold text-[#0A0D06]">
              <div className="flex justify-between">
                <span>Internal Continuous Assessment (CIA):</span>
                <span>{ciaReferenceMarks} / {ciaReferenceMax} M</span>
              </div>
              <div className="flex justify-between">
                <span>End-Semester Examination (ESE):</span>
                <span>{calculation.weightedEse} / {eseWeightage} M</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/10 flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#0A0D06]/70">
              Immediate grade point impact
            </span>
            <Button
              variant="dark"
              size="sm"
              icon={Check}
              onClick={handleSaveAndApply}
            >
              Apply to Subject ESE
            </Button>
          </div>
        </div>
      </div>

      {/* Target ESE Score Simulator (Fintech Smart Assistant) */}
      <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">
              Target ESE Marks Predictor
            </h3>
            <p className="text-xs text-slate-400">
              Minimum raw question paper marks needed in ESE (out of {eseMax}) given your current CIA score of {ciaReferenceMarks}/{ciaReferenceMax}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {calculation.targets.map((tgt) => (
            <div
              key={tgt.grade}
              className={`p-3.5 rounded-2xl border text-center flex flex-col justify-between ${
                tgt.isGuaranteed
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : tgt.isAchievable
                  ? 'bg-[#161824] border-white/[0.06]'
                  : 'bg-rose-500/10 border-rose-500/20'
              }`}
            >
              <div>
                <span className="text-xs font-black text-white uppercase block">
                  Grade {tgt.grade}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  ({tgt.targetPct}% Cutoff)
                </span>
              </div>

              <div className="my-2">
                {tgt.isGuaranteed ? (
                  <span className="text-xs font-black text-emerald-400 block">
                    ✓ Guaranteed!
                  </span>
                ) : tgt.isAchievable ? (
                  <span className="text-xl font-black text-[#9AF04F] block">
                    {tgt.rawNeeded}{' '}
                    <span className="text-[10px] font-normal text-slate-400">/ {eseMax}</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-400 block">
                    Mathematical Max Exceeded
                  </span>
                )}
              </div>

              <span className="text-[10px] text-slate-500 block">
                {tgt.isGuaranteed ? 'CIA covers it' : tgt.isAchievable ? 'Needed in exam' : 'Target unreachable'}
              </span>
            </div>
          ))}
        </div>

        {saveSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            {saveSuccessMsg}
          </div>
        )}
      </div>
    </div>
  );
}

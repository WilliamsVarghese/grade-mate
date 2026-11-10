import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Award,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Save,
  BookOpen,
  Info
} from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAcademic } from '../../context/AcademicContext';
import {
  calculateWeightedComponent,
  calculateAttendanceEvaluation,
  calculateInternalAssessmentBreakdown,
} from '../../utils/calculations';

export function InternalAssessmentCalculator({
  initialSubjectId = null,
  onApplySuccess = null,
  onSwitchToEndSem = null,
}) {
  const {
    allSubjects,
    internalAssessments,
    saveSubjectInternalAssessment,
  } = useAcademic();

  // Subject selector state
  const [selectedSubjectId, setSelectedSubjectId] = useState(() => {
    if (initialSubjectId && allSubjects.some(s => s.id === initialSubjectId)) {
      return initialSubjectId;
    }
    return allSubjects.length > 0 ? allSubjects[0].id : 'custom';
  });

  // Target maximum internal marks (e.g. 25, 40, or 50)
  const [targetMaxInternal, setTargetMaxInternal] = useState(50);

  // CAT 1 state
  const [cat1, setCat1] = useState({
    obtained: 35,
    max: 50,
    contribution: 7.5,
  });

  // CAT 2 state (Purple accent)
  const [cat2, setCat2] = useState({
    obtained: 40,
    max: 50,
    contribution: 7.5,
  });

  // Attendance state
  const [attendance, setAttendance] = useState({
    attended: 36,
    conducted: 40,
    contribution: 5,
    scheme: 'proportional', // 'proportional', 'slab', 'direct'
    manualScore: 4,
  });

  // Optional Additional Components (Assignment, Quiz, Lab, Seminar, etc.)
  const [components, setComponents] = useState([
    {
      id: 'comp-1',
      name: 'Assignment & Mini-Project',
      obtained: 18,
      max: 20,
      contribution: 5,
    },
  ]);

  const [validationErrors, setValidationErrors] = useState({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Sync if initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && allSubjects.some(s => s.id === initialSubjectId)) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId, allSubjects]);

  // Load saved subject configuration when selected subject changes
  useEffect(() => {
    if (selectedSubjectId && selectedSubjectId !== 'custom') {
      const saved = internalAssessments[selectedSubjectId];
      const subject = allSubjects.find(s => s.id === selectedSubjectId);

      if (saved) {
        setCat1(saved.cat1 || { obtained: 35, max: 50, contribution: 7.5 });
        setCat2(saved.cat2 || { obtained: 40, max: 50, contribution: 7.5 });
        setAttendance(saved.attendance || { attended: 36, conducted: 40, contribution: 5, scheme: 'proportional', manualScore: null });
        setComponents(saved.components || []);
        if (saved.targetMaxInternal) setTargetMaxInternal(saved.targetMaxInternal);
      } else if (subject) {
        // Pre-populate with intelligent defaults matching subject CIA Max
        const subjectCiaMax = Number(subject.ciaMax) || 50;
        setTargetMaxInternal(subjectCiaMax);

        if (subjectCiaMax <= 25) {
          // 7.5 + 7.5 + 5 + 5 = 25
          setCat1({ obtained: Math.round(subject.ciaMarks * 0.35 * 10) / 10 || 35, max: 50, contribution: 7.5 });
          setCat2({ obtained: Math.round(subject.ciaMarks * 0.35 * 10) / 10 || 40, max: 50, contribution: 7.5 });
          setAttendance({ attended: 36, conducted: 40, contribution: 5, scheme: 'proportional', manualScore: null });
          setComponents([{ id: 'comp-1', name: 'Assignment', obtained: 18, max: 20, contribution: 5 }]);
        } else if (subjectCiaMax <= 40) {
          // 12.5 + 12.5 + 5 + 10 = 40
          setCat1({ obtained: 38, max: 50, contribution: 12.5 });
          setCat2({ obtained: 42, max: 50, contribution: 12.5 });
          setAttendance({ attended: 38, conducted: 40, contribution: 5, scheme: 'proportional', manualScore: null });
          setComponents([{ id: 'comp-1', name: 'Assignment & Quiz', obtained: 19, max: 20, contribution: 10 }]);
        } else {
          // 15 + 15 + 10 + 10 = 50, or 20 + 20 + 5 + 5 = 50
          setCat1({ obtained: Math.round(subject.ciaMarks * 0.45 * 10) / 10 || 42, max: 50, contribution: 15 });
          setCat2({ obtained: Math.round(subject.ciaMarks * 0.45 * 10) / 10 || 44, max: 50, contribution: 15 });
          setAttendance({ attended: 38, conducted: 40, contribution: 10, scheme: 'proportional', manualScore: null });
          setComponents([
            { id: 'comp-1', name: 'Continuous Assignment', obtained: 18, max: 20, contribution: 10 },
          ]);
        }
      }
    }
  }, [selectedSubjectId]);

  // Handle Add New Component
  const handleAddComponent = () => {
    const newComp = {
      id: 'comp-' + Date.now(),
      name: `Assessment Component ${components.length + 1}`,
      obtained: 15,
      max: 20,
      contribution: 5,
    };
    setComponents(prev => [...prev, newComp]);
  };

  // Handle Remove Component
  const handleRemoveComponent = (id) => {
    setComponents(prev => prev.filter(c => c.id !== id));
  };

  // Handle Component Field Change
  const handleComponentChange = (id, field, value) => {
    setComponents(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            [field]: field === 'name' ? value : Math.max(0, parseFloat(value) || 0),
          };
        }
        return c;
      })
    );
  };

  // Live Comprehensive Calculation
  const calculation = useMemo(() => {
    const errs = {};

    // Validate CAT 1
    if (cat1.max <= 0) errs.cat1Max = 'Maximum marks must be > 0';
    if (cat1.obtained < 0) errs.cat1Obt = 'Marks cannot be negative';
    if (cat1.obtained > cat1.max) errs.cat1Obt = `Cannot exceed max (${cat1.max})`;
    if (cat1.contribution < 0) errs.cat1Cont = 'Contribution cannot be negative';

    // Validate CAT 2
    if (cat2.max <= 0) errs.cat2Max = 'Maximum marks must be > 0';
    if (cat2.obtained < 0) errs.cat2Obt = 'Marks cannot be negative';
    if (cat2.obtained > cat2.max) errs.cat2Obt = `Cannot exceed max (${cat2.max})`;
    if (cat2.contribution < 0) errs.cat2Cont = 'Contribution cannot be negative';

    // Validate Attendance
    if (attendance.conducted <= 0) errs.attConducted = 'Classes conducted must be > 0';
    if (attendance.attended < 0) errs.attAttended = 'Cannot be negative';
    if (attendance.attended > attendance.conducted) errs.attAttended = 'Cannot exceed conducted';
    if (attendance.contribution < 0) errs.attCont = 'Contribution cannot be negative';

    // Validate components
    components.forEach((c, idx) => {
      if (c.max <= 0) errs[`comp_${idx}_max`] = 'Must be > 0';
      if (c.obtained < 0) errs[`comp_${idx}_obt`] = 'Cannot be negative';
      if (c.obtained > c.max) errs[`comp_${idx}_obt`] = `Exceeds max (${c.max})`;
    });

    setValidationErrors(errs);

    return calculateInternalAssessmentBreakdown({
      cat1,
      cat2,
      attendance,
      components,
    });
  }, [cat1, cat2, attendance, components]);

  // Check if sum of all component contributions matches targetMaxInternal
  const totalWeightageConfigured = useMemo(() => {
    const cat1C = Number(cat1.contribution) || 0;
    const cat2C = Number(cat2.contribution) || 0;
    const attC = Number(attendance.contribution) || 0;
    const compsC = components.reduce((sum, c) => sum + (Number(c.contribution) || 0), 0);
    return Math.round((cat1C + cat2C + attC + compsC) * 100) / 100;
  }, [cat1.contribution, cat2.contribution, attendance.contribution, components]);

  const weightageMatchesTarget = Math.abs(totalWeightageConfigured - targetMaxInternal) < 0.05;

  // Reset function
  const handleReset = () => {
    setCat1({ obtained: 35, max: 50, contribution: 7.5 });
    setCat2({ obtained: 40, max: 50, contribution: 7.5 });
    setAttendance({ attended: 36, conducted: 40, contribution: 5, scheme: 'proportional', manualScore: null });
    setComponents([{ id: 'comp-1', name: 'Assignment', obtained: 18, max: 20, contribution: 5 }]);
    setTargetMaxInternal(25);
    setSaveSuccessMsg(null);
  };

  // Save & Apply directly to Subject
  const handleSaveAndApply = () => {
    const payload = {
      targetMaxInternal,
      cat1,
      cat2,
      attendance,
      components,
      totalObtained: calculation.totalObtained,
      maxInternal: calculation.maxInternal,
      internalPercentage: calculation.internalPercentage,
      calculatedAt: new Date().toISOString(),
    };

    saveSubjectInternalAssessment(selectedSubjectId, payload, selectedSubjectId !== 'custom');

    const subj = allSubjects.find(s => s.id === selectedSubjectId);
    const name = subj ? subj.name : 'Custom';
    setSaveSuccessMsg(`Successfully applied ${calculation.totalObtained} / ${calculation.maxInternal} CIA marks to ${name}!`);

    if (onApplySuccess) {
      onApplySuccess(calculation);
    }

    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  const selectedSubjectObj = allSubjects.find(s => s.id === selectedSubjectId);

  return (
    <div className="space-y-6">
      {/* Top Controls: Subject Selection & Target Max CIA */}
      <div className="p-5 rounded-3xl bg-[#141724] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#9AF04F] mb-1.5">
            Subject-Specific Assessment Profile:
          </label>
          <div className="flex items-center gap-3">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full sm:w-80 px-4 py-2.5 rounded-2xl bg-[#1C2030] text-white border border-white/[0.1] text-xs sm:text-sm font-semibold outline-none focus:border-[#9AF04F]"
            >
              <option value="custom">⚡ Standalone / Custom Simulation</option>
              <optgroup label="Semester 5 Core Courses">
                {allSubjects
                  .filter(s => s.category === 'Semester 5 Core')
                  .map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code || 'Core'}) – {s.credits} Cr
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

            {selectedSubjectObj && (
              <span className="hidden sm:inline-flex text-[11px] font-bold px-3 py-1 rounded-full bg-white/[0.06] text-slate-300">
                Current CIA: {selectedSubjectObj.ciaMarks} / {selectedSubjectObj.ciaMax}
              </span>
            )}
          </div>
        </div>

        {/* Target Max Internal Marks Input */}
        <div className="flex items-center gap-3 shrink-0">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Target Max CIA
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="1"
                max="100"
                step="0.5"
                value={targetMaxInternal}
                onChange={(e) => setTargetMaxInternal(parseFloat(e.target.value) || 50)}
                className="w-20 px-3 py-1.5 text-xs font-black rounded-xl border border-white/[0.1] bg-[#1C2030] text-[#9AF04F]"
              />
              <span className="text-xs text-slate-400 font-semibold">Marks</span>
            </div>
          </div>

          {/* Quick preset weightage buttons */}
          <div className="flex items-center gap-1.5 self-end">
            <button
              type="button"
              onClick={() => {
                setTargetMaxInternal(25);
                setCat1(p => ({ ...p, contribution: 7.5 }));
                setCat2(p => ({ ...p, contribution: 7.5 }));
                setAttendance(p => ({ ...p, contribution: 5 }));
                setComponents([{ id: 'comp-1', name: 'Assignment', obtained: 18, max: 20, contribution: 5 }]);
              }}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors"
            >
              25M Scheme
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetMaxInternal(50);
                setCat1(p => ({ ...p, contribution: 15 }));
                setCat2(p => ({ ...p, contribution: 15 }));
                setAttendance(p => ({ ...p, contribution: 10 }));
                setComponents([{ id: 'comp-1', name: 'Assignment', obtained: 18, max: 20, contribution: 10 }]);
              }}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 transition-colors"
            >
              50M Scheme
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: CAT 1, CAT 2, Attendance, and Additional Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 1: CAT 1 (First Internal Examination) */}
        <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] hover:border-[#9AF04F]/30 shadow-card-dark transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] flex items-center justify-center font-black text-xs">
                  C1
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    CAT 1 Examination
                  </h3>
                  <p className="text-[11px] text-slate-400">First Continuous Assessment Test</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#9AF04F]/15 text-[#9AF04F]">
                Weight: {cat1.contribution}M
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              <Input
                label="Obtained"
                type="number"
                step="0.25"
                min="0"
                value={cat1.obtained}
                onChange={(e) => setCat1({ ...cat1, obtained: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                error={validationErrors.cat1Obt}
                placeholder="35"
              />
              <Input
                label="Maximum"
                type="number"
                step="1"
                min="1"
                value={cat1.max}
                onChange={(e) => setCat1({ ...cat1, max: parseFloat(e.target.value) || 0 })}
                error={validationErrors.cat1Max}
                placeholder="50"
              />
              <Input
                label="Contribution"
                type="number"
                step="0.5"
                min="0"
                value={cat1.contribution}
                onChange={(e) => setCat1({ ...cat1, contribution: parseFloat(e.target.value) || 0 })}
                error={validationErrors.cat1Cont}
                placeholder="7.5"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              ({cat1.obtained || 0} / {cat1.max || 50}) × {cat1.contribution}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Weighted CAT 1</span>
              <span className="text-lg font-black text-[#9AF04F]">
                {calculation.cat1.weighted} <span className="text-xs font-normal text-slate-400">/ {cat1.contribution}</span>
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: CAT 2 (Second Internal Examination) - PURPLE ACCENT AS REQUIRED */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1C1230] via-[#140D24] to-[#0E0919] border border-[#9655F5]/40 hover:border-[#9655F5]/70 shadow-purple-glow transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9655F5]/25 text-[#C084FC] flex items-center justify-center font-black text-xs">
                  C2
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    CAT 2 Examination
                  </h3>
                  <p className="text-[11px] text-[#C084FC]">Second Continuous Assessment Test</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#9655F5]/25 text-[#C084FC] border border-[#9655F5]/40">
                Weight: {cat2.contribution}M
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              <Input
                label="Obtained"
                type="number"
                step="0.25"
                min="0"
                value={cat2.obtained}
                onChange={(e) => setCat2({ ...cat2, obtained: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                error={validationErrors.cat2Obt}
                placeholder="40"
              />
              <Input
                label="Maximum"
                type="number"
                step="1"
                min="1"
                value={cat2.max}
                onChange={(e) => setCat2({ ...cat2, max: parseFloat(e.target.value) || 0 })}
                error={validationErrors.cat2Max}
                placeholder="50"
              />
              <Input
                label="Contribution"
                type="number"
                step="0.5"
                min="0"
                value={cat2.contribution}
                onChange={(e) => setCat2({ ...cat2, contribution: parseFloat(e.target.value) || 0 })}
                error={validationErrors.cat2Cont}
                placeholder="7.5"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#9655F5]/20 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              ({cat2.obtained || 0} / {cat2.max || 50}) × {cat2.contribution}
            </span>
            <div className="text-right">
              <span className="text-[10px] text-[#C084FC] block uppercase font-bold">Weighted CAT 2</span>
              <span className="text-lg font-black text-white">
                {calculation.cat2.weighted} <span className="text-xs font-normal text-slate-400">/ {cat2.contribution}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Combined CAT Marks Pill Banner */}
      <div className="p-3.5 rounded-2xl bg-[#161824] border border-white/[0.06] flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-300">
          Combined CAT Assessment Performance (CAT 1 + CAT 2):
        </span>
        <span className="text-sm font-black text-white">
          <strong className="text-[#9AF04F]">{calculation.combinedCat.obtained}</strong> / {calculation.combinedCat.contribution} Marks{' '}
          <span className="text-xs font-normal text-slate-400">
            ({calculation.combinedCat.contribution > 0 ? Math.round((calculation.combinedCat.obtained / calculation.combinedCat.contribution) * 100) : 0}%)
          </span>
        </span>
      </div>

      {/* Secondary Grid: Attendance & Additional Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CARD 3: Attendance Marks Calculator */}
        <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                  %
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Attendance Marks Calculator
                  </h3>
                  <p className="text-[11px] text-slate-400">Configurable attendance assessment</p>
                </div>
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                Weight: {attendance.contribution}M
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 my-3">
              <Input
                label="Attended"
                type="number"
                min="0"
                value={attendance.attended}
                onChange={(e) => setAttendance({ ...attendance, attended: e.target.value === '' ? '' : parseFloat(e.target.value) })}
                error={validationErrors.attAttended}
                placeholder="36"
              />
              <Input
                label="Conducted"
                type="number"
                min="1"
                value={attendance.conducted}
                onChange={(e) => setAttendance({ ...attendance, conducted: parseFloat(e.target.value) || 0 })}
                error={validationErrors.attConducted}
                placeholder="40"
              />
              <Input
                label="Contribution"
                type="number"
                step="0.5"
                min="0"
                value={attendance.contribution}
                onChange={(e) => setAttendance({ ...attendance, contribution: parseFloat(e.target.value) || 0 })}
                error={validationErrors.attCont}
                placeholder="5"
              />
            </div>

            {/* Attendance Marking Scheme Selector */}
            <div className="mt-3 p-3 rounded-2xl bg-[#161824] border border-white/[0.05] flex items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-semibold">Evaluation Mode:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setAttendance({ ...attendance, scheme: 'proportional' })}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                    attendance.scheme === 'proportional'
                      ? 'bg-[#9AF04F] text-[#0A0D06]'
                      : 'bg-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                >
                  Proportional
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance({ ...attendance, scheme: 'slab' })}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                    attendance.scheme === 'slab'
                      ? 'bg-[#9AF04F] text-[#0A0D06]'
                      : 'bg-white/[0.06] text-slate-400 hover:text-white'
                  }`}
                  title="≥90%: 100%, ≥85%: 80%, ≥80%: 60%, ≥75%: 40%, <75%: 0%"
                >
                  Slab (University)
                </button>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Calculated Attendance</span>
              <span className={`text-sm font-black ${calculation.attendance.isShortage ? 'text-rose-400' : 'text-emerald-400'}`}>
                {calculation.attendance.percentage}%{' '}
                {calculation.attendance.isShortage && '(Shortage < 75%)'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Attendance Marks</span>
              <span className="text-lg font-black text-emerald-400">
                {calculation.attendance.marksObtained} <span className="text-xs font-normal text-slate-400">/ {attendance.contribution}</span>
              </span>
            </div>
          </div>
        </div>

        {/* CARD 4: Assignment and Additional Components */}
        <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                  +
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Assignments & Additional Activities
                  </h3>
                  <p className="text-[11px] text-slate-400">Quizzes, seminars, labs, mini-projects</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="xs"
                icon={Plus}
                onClick={handleAddComponent}
              >
                Add Activity
              </Button>
            </div>

            {/* Dynamic Components List */}
            <div className="space-y-3 my-2 max-h-52 overflow-y-auto pr-1">
              {components.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500 rounded-2xl border border-dashed border-white/[0.08]">
                  No additional components. Click "+ Add Activity" if your subject includes assignments, seminars, or lab evaluations.
                </div>
              ) : (
                components.map((comp, idx) => {
                  const compWeighted = calculateWeightedComponent(comp.obtained, comp.max, comp.contribution);
                  return (
                    <div
                      key={comp.id}
                      className="p-3 rounded-2xl bg-[#161824] border border-white/[0.05] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={comp.name}
                          onChange={(e) => handleComponentChange(comp.id, 'name', e.target.value)}
                          placeholder="Component Name (e.g. Assignment 1)"
                          className="w-full text-xs font-bold bg-transparent text-white border-b border-white/[0.1] pb-1 focus:border-[#9AF04F] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(comp.id)}
                          className="w-6 h-6 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors shrink-0"
                          title="Remove activity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Obtained</label>
                          <input
                            type="number"
                            step="0.25"
                            min="0"
                            value={comp.obtained}
                            onChange={(e) => handleComponentChange(comp.id, 'obtained', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#1C2030] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Maximum</label>
                          <input
                            type="number"
                            step="1"
                            min="1"
                            value={comp.max}
                            onChange={(e) => handleComponentChange(comp.id, 'max', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#1C2030] text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Contribution</label>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={comp.contribution}
                            onChange={(e) => handleComponentChange(comp.id, 'contribution', e.target.value)}
                            className="w-full px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#1C2030] text-amber-400 font-bold"
                          />
                        </div>
                      </div>

                      <div className="text-right text-[11px] text-slate-400">
                        Weighted: <strong className="text-amber-400">{compWeighted}</strong> / {comp.contribution}M
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Additional Activities:</span>
            <span className="font-bold text-amber-400">
              {components.reduce((sum, c) => sum + (calculateWeightedComponent(c.obtained, c.max, c.contribution) || 0), 0).toFixed(2)} Marks
            </span>
          </div>
        </div>
      </div>

      {/* 5. FINAL INTERNAL MARKS SUMMARY TABLE & LEDGER */}
      <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-black text-white">
              Final Internal Assessment Scorecard
            </h3>
            <p className="text-xs text-slate-400">
              Live calculation summary of all continuous evaluation components
            </p>
          </div>

          {/* Weightage match check badge */}
          <div>
            {weightageMatchesTarget ? (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Component sum ({totalWeightageConfigured}M) matches Max CIA ({targetMaxInternal}M)
              </span>
            ) : (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Component sum: {totalWeightageConfigured}M ≠ Target {targetMaxInternal}M
              </span>
            )}
          </div>
        </div>

        {/* Breakdown Table matching user's exact demonstration format */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm text-left">
            <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3 rounded-l-2xl">Component</th>
                <th className="px-4 py-3">Raw Performance</th>
                <th className="px-4 py-3">Formula / Scaling</th>
                <th className="px-4 py-3 text-right rounded-r-2xl">Obtained Contribution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9AF04F]" /> CAT 1 Examination
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {cat1.obtained} / {cat1.max} ({cat1.max > 0 ? Math.round((cat1.obtained / cat1.max) * 100) : 0}%)
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                  ({cat1.obtained} / {cat1.max}) × {cat1.contribution}
                </td>
                <td className="px-4 py-3 text-right font-black text-[#9AF04F]">
                  {calculation.cat1.weighted} / {cat1.contribution}
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9655F5]" /> CAT 2 Examination
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {cat2.obtained} / {cat2.max} ({cat2.max > 0 ? Math.round((cat2.obtained / cat2.max) * 100) : 0}%)
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                  ({cat2.obtained} / {cat2.max}) × {cat2.contribution}
                </td>
                <td className="px-4 py-3 text-right font-black text-[#C084FC]">
                  {calculation.cat2.weighted} / {cat2.contribution}
                </td>
              </tr>

              <tr className="hover:bg-white/[0.02]">
                <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Attendance Score
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {attendance.attended} / {attendance.conducted} classes ({calculation.attendance.percentage}%)
                </td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs capitalize">
                  {attendance.scheme} ({attendance.contribution}M cap)
                </td>
                <td className="px-4 py-3 text-right font-black text-emerald-400">
                  {calculation.attendance.marksObtained} / {attendance.contribution}
                </td>
              </tr>

              {calculation.components.map((comp) => (
                <tr key={comp.id} className="hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> {comp.name}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {comp.obtained} / {comp.max} ({comp.max > 0 ? Math.round((comp.obtained / comp.max) * 100) : 0}%)
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs">
                    ({comp.obtained} / {comp.max}) × {comp.contribution}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-amber-400">
                    {comp.weighted} / {comp.contribution}
                  </td>
                </tr>
              ))}

              {/* Total Summary Row */}
              <tr className="bg-[#9AF04F]/10 font-bold">
                <td className="px-4 py-4 font-black text-white text-sm" colSpan={3}>
                  Total Internal Continuous Assessment Marks (CIA)
                </td>
                <td className="px-4 py-4 text-right font-black text-[#9AF04F] text-base sm:text-lg">
                  {calculation.totalObtained} / {calculation.maxInternal}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4 Summary Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Total CIA Obtained
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#9AF04F] mt-0.5 block">
              {calculation.totalObtained}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Maximum Internal Cap
            </span>
            <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
              {calculation.maxInternal}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Internal Percentage
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#9AF04F] mt-0.5 block">
              {calculation.internalPercentage}%
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">
              Remaining Available
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-300 mt-0.5 block">
              {calculation.remainingMarks} M
            </span>
          </div>
        </div>

        {/* Feedback message */}
        {saveSuccessMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            {saveSuccessMsg}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <Button
            variant="dark"
            size="sm"
            icon={RefreshCw}
            onClick={handleReset}
          >
            Reset Form
          </Button>

          <div className="flex items-center gap-2.5">
            {onSwitchToEndSem && (
              <Button
                variant="outline"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={onSwitchToEndSem}
              >
                Proceed to End-Sem Calc
              </Button>
            )}

            <Button
              variant="neon"
              size="sm"
              icon={Check}
              onClick={handleSaveAndApply}
            >
              Apply to Subject CIA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

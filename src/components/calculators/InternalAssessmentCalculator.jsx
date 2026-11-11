import React, { useState, useEffect, useMemo } from 'react';
import {
  Calculator,
  Check,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  GraduationCap
} from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAcademic } from '../../context/AcademicContext';
import {
  calculateCatContribution,
  calculateSimpleInternalAssessment,
} from '../../utils/calculations';
import {
  DEFAULT_SUBJECT_SYLLABUS_SCHEMES,
  SYLLABUS_PRESETS,
  getSubjectDefaultSyllabusScheme,
} from '../../utils/syllabusSchemes';

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
    return allSubjects.length > 0 ? allSubjects[0].id : '';
  });

  // Synchronize when initialSubjectId prop changes
  useEffect(() => {
    if (initialSubjectId && allSubjects.some(s => s.id === initialSubjectId)) {
      setSelectedSubjectId(initialSubjectId);
    }
  }, [initialSubjectId, allSubjects]);

  const currentSubject = allSubjects.find(s => s.id === selectedSubjectId) || allSubjects[0];

  // Syllabus scheme configuration
  const [scheme, setScheme] = useState(() => {
    return getSubjectDefaultSyllabusScheme(currentSubject);
  });

  // Marks entered by the user
  const [attendanceObtained, setAttendanceObtained] = useState('8.5');
  const [assignment1Obtained, setAssignment1Obtained] = useState('6.5');
  const [assignment2Obtained, setAssignment2Obtained] = useState('7');
  const [hasAssignment2, setHasAssignment2] = useState(true);

  // Both CATs are conducted out of 30 marks
  const [cat1MarksOut30, setCat1MarksOut30] = useState('24');
  const [cat2MarksOut30, setCat2MarksOut30] = useState('26');

  // Optional Practical / Lab component
  const [hasPractical, setHasPractical] = useState(false);
  const [practicalObtained, setPracticalObtained] = useState('26');

  // UI state for editing syllabus scheme
  const [showSchemeEditor, setShowSchemeEditor] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(null);

  // Load saved subject configuration or initial syllabus when subject changes
  useEffect(() => {
    if (!selectedSubjectId) return;

    const saved = internalAssessments[selectedSubjectId];
    const defaultScheme = getSubjectDefaultSyllabusScheme(currentSubject);

    if (saved && saved.isSimpleScheme) {
      // Restore previously saved simple scheme and marks
      if (saved.scheme) setScheme(saved.scheme);
      setAttendanceObtained(saved.attendanceObtained?.toString() || '0');
      setAssignment1Obtained(saved.assignment1Obtained?.toString() || '0');
      setAssignment2Obtained(saved.assignment2Obtained?.toString() || '0');
      setHasAssignment2(saved.hasAssignment2 !== false);
      setCat1MarksOut30(saved.cat1MarksOut30?.toString() || '0');
      setCat2MarksOut30(saved.cat2MarksOut30?.toString() || '0');
      setHasPractical(!!saved.hasPractical);
      setPracticalObtained(saved.practicalObtained?.toString() || '0');
    } else {
      // Apply subject's syllabus scheme
      setScheme(defaultScheme);
      setHasAssignment2(defaultScheme.hasAssignment2);
      setHasPractical(defaultScheme.hasPractical);

      // Intelligent starter marks matching subject's current CIA or realistic default
      if (defaultScheme.cat1Contribution === 7.5 && defaultScheme.totalCiaMax <= 25) {
        // 7.5 CATs (25 CIA)
        setAttendanceObtained('4.5');
        setAssignment1Obtained('4.5');
        setAssignment2Obtained('0');
        setCat1MarksOut30('24'); // 24/30 * 7.5 = 6.00
        setCat2MarksOut30('26'); // 26/30 * 7.5 = 6.50
        setPracticalObtained('0');
      } else if (defaultScheme.hasPractical && defaultScheme.practicalMax >= 25) {
        // Lab or Project (50 CIA)
        setAttendanceObtained('4.5');
        setAssignment1Obtained('0');
        setAssignment2Obtained('0');
        setCat1MarksOut30('25'); // 25/30 * 7.5 = 6.25
        setCat2MarksOut30('27'); // 27/30 * 7.5 = 6.75
        setPracticalObtained(defaultScheme.practicalMax === 30 ? '28' : '23');
      } else {
        // Standard Theory (50 CIA, 12.5 CATs)
        setAttendanceObtained('9');
        setAssignment1Obtained('7');
        setAssignment2Obtained('6.5');
        setCat1MarksOut30('24'); // 24/30 * 12.5 = 10.00
        setCat2MarksOut30('26'); // 26/30 * 12.5 = 10.83
        setPracticalObtained('0');
      }
    }
  }, [selectedSubjectId]);

  // Real-time calculation
  const calculation = useMemo(() => {
    const attObt = Math.max(0, parseFloat(attendanceObtained) || 0);
    const assign1Obt = Math.max(0, parseFloat(assignment1Obtained) || 0);
    const assign2Obt = Math.max(0, parseFloat(assignment2Obtained) || 0);
    const cat1Raw = Math.max(0, Math.min(30, parseFloat(cat1MarksOut30) || 0));
    const cat2Raw = Math.max(0, Math.min(30, parseFloat(cat2MarksOut30) || 0));
    const practicalObt = Math.max(0, parseFloat(practicalObtained) || 0);

    return calculateSimpleInternalAssessment({
      attendance: {
        obtained: attObt,
        max: Number(scheme.attendanceMax) || 0,
      },
      assignment1: {
        obtained: assign1Obt,
        max: Number(scheme.assignment1Max) || 0,
      },
      assignment2: {
        enabled: hasAssignment2,
        obtained: assign2Obt,
        max: Number(scheme.assignment2Max) || 0,
      },
      cat1: {
        obtained: cat1Raw,
        contribution: Number(scheme.cat1Contribution) || 0,
      },
      cat2: {
        obtained: cat2Raw,
        contribution: Number(scheme.cat2Contribution) || 0,
      },
      practical: {
        enabled: hasPractical,
        name: scheme.practicalName || 'Practical / Lab Work',
        obtained: practicalObt,
        max: Number(scheme.practicalMax) || 0,
      },
    });
  }, [
    attendanceObtained,
    assignment1Obtained,
    assignment2Obtained,
    hasAssignment2,
    cat1MarksOut30,
    cat2MarksOut30,
    hasPractical,
    practicalObtained,
    scheme,
  ]);

  // Validation warnings
  const validationWarnings = useMemo(() => {
    const warnings = {};
    const attObt = parseFloat(attendanceObtained) || 0;
    const assign1Obt = parseFloat(assignment1Obtained) || 0;
    const assign2Obt = parseFloat(assignment2Obtained) || 0;
    const cat1Raw = parseFloat(cat1MarksOut30) || 0;
    const cat2Raw = parseFloat(cat2MarksOut30) || 0;
    const practicalObt = parseFloat(practicalObtained) || 0;

    if (attObt > scheme.attendanceMax) warnings.attendance = `Cannot exceed max (${scheme.attendanceMax})`;
    if (assign1Obt > scheme.assignment1Max) warnings.assignment1 = `Cannot exceed max (${scheme.assignment1Max})`;
    if (hasAssignment2 && assign2Obt > scheme.assignment2Max) warnings.assignment2 = `Cannot exceed max (${scheme.assignment2Max})`;
    if (cat1Raw > 30) warnings.cat1 = 'CAT 1 is conducted out of 30 marks';
    if (cat2Raw > 30) warnings.cat2 = 'CAT 2 is conducted out of 30 marks';
    if (hasPractical && practicalObt > scheme.practicalMax) warnings.practical = `Cannot exceed max (${scheme.practicalMax})`;

    return warnings;
  }, [
    attendanceObtained,
    assignment1Obtained,
    assignment2Obtained,
    hasAssignment2,
    cat1MarksOut30,
    cat2MarksOut30,
    hasPractical,
    practicalObtained,
    scheme,
  ]);

  // Save changes to current subject
  const handleApplyToSubject = () => {
    if (!selectedSubjectId) return;

    const payload = {
      isSimpleScheme: true,
      scheme,
      attendanceObtained,
      assignment1Obtained,
      assignment2Obtained,
      hasAssignment2,
      cat1MarksOut30,
      cat2MarksOut30,
      hasPractical,
      practicalObtained,
      totalObtained: calculation.totalObtained,
      maxInternal: calculation.maxInternal,
      percentage: calculation.percentage,
      attendance: {
        obtained: calculation.attendance.obtained,
        max: calculation.attendance.max,
        percentage: calculation.attendance.max > 0
          ? Math.round((calculation.attendance.obtained / calculation.attendance.max) * 100)
          : 90,
      },
    };

    saveSubjectInternalAssessment(selectedSubjectId, payload, true);
    setSaveSuccessMsg(`Applied ${calculation.totalObtained} / ${calculation.maxInternal} CIA to ${currentSubject?.name || 'course'}!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);

    if (onApplySuccess) onApplySuccess();
  };

  // Reset marks for current subject
  const handleResetMarks = () => {
    setAttendanceObtained('0');
    setAssignment1Obtained('0');
    setAssignment2Obtained('0');
    setCat1MarksOut30('0');
    setCat2MarksOut30('0');
    setPracticalObtained('0');
  };

  // Apply syllabus preset
  const handleSelectPreset = (preset) => {
    setScheme(preset);
    setHasAssignment2(preset.hasAssignment2);
    setHasPractical(preset.hasPractical);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & SUBJECT SELECTOR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
            Select Course / Subject
          </label>
          <div className="relative">
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full text-sm font-bold bg-[#141724] border border-white/[0.1] rounded-2xl py-2.5 px-3.5 text-white focus:outline-none focus:border-[#9AF04F] transition-all cursor-pointer pr-10"
            >
              {allSubjects.map((sub) => (
                <option key={sub.id} value={sub.id} className="bg-[#141724] text-white">
                  {sub.code ? `[${sub.code}] ` : ''}{sub.name} — ({sub.category || 'Regular'}) • Current CIA: {sub.ciaMarks ?? 0}/{sub.ciaMax ?? 50}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Syllabus Tag & Configure Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <div className="px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-right">
            <span className="text-[10px] text-slate-400 font-semibold block">Syllabus Scheme</span>
            <span className="text-xs font-black text-[#9AF04F]">{scheme.cat1Contribution} CATs • Max CIA: {scheme.totalCiaMax}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowSchemeEditor(!showSchemeEditor)}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              showSchemeEditor
                ? 'bg-[#9AF04F]/15 border-[#9AF04F] text-[#9AF04F]'
                : 'bg-white/[0.05] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
            title="Configure Syllabus Weightages"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden sm:inline">Scheme</span>
            {showSchemeEditor ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. SYLLABUS SCHEME CONFIGURATION PANEL (Collapsible) */}
      {showSchemeEditor && (
        <div className="p-4 sm:p-5 rounded-3xl bg-[#0D0F16] border border-[#9AF04F]/30 shadow-card-dark space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#9AF04F]" />
                Syllabus Mark Distribution for {currentSubject?.name || 'Subject'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Loaded according to curriculum syllabus guidelines. Adjust contributions if required.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Sum of Components:</span>
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                (scheme.attendanceMax + scheme.assignment1Max + (scheme.hasAssignment2 ? scheme.assignment2Max : 0) + scheme.cat1Contribution + scheme.cat2Contribution + (scheme.hasPractical ? scheme.practicalMax : 0)) === scheme.totalCiaMax
                  ? 'bg-[#9AF04F]/20 text-[#9AF04F]'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {scheme.attendanceMax + scheme.assignment1Max + (scheme.hasAssignment2 ? scheme.assignment2Max : 0) + scheme.cat1Contribution + scheme.cat2Contribution + (scheme.hasPractical ? scheme.practicalMax : 0)} / {scheme.totalCiaMax}
              </span>
            </div>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
              Quick Syllabus Presets
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {SYLLABUS_PRESETS.map((p) => {
                const isActive = scheme.cat1Contribution === p.cat1Contribution && scheme.totalCiaMax === p.totalCiaMax && scheme.hasPractical === p.hasPractical;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-2xl text-left border transition-all ${
                      isActive
                        ? 'bg-[#9AF04F]/10 border-[#9AF04F] text-white shadow-neon-sm'
                        : 'bg-[#141724] border-white/[0.06] text-slate-300 hover:border-white/[0.15] hover:text-white'
                    }`}
                  >
                    <p className="text-xs font-bold leading-tight">{p.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{p.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editable Weightage Inputs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Attendance Max
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={scheme.attendanceMax}
                onChange={(e) => setScheme(prev => ({ ...prev, attendanceMax: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#9AF04F]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Assign 1 Max
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={scheme.assignment1Max}
                onChange={(e) => setScheme(prev => ({ ...prev, assignment1Max: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#9AF04F]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Assign 2 Max
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={scheme.assignment2Max}
                onChange={(e) => setScheme(prev => ({ ...prev, assignment2Max: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#9AF04F]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                CAT 1 Weight
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={scheme.cat1Contribution}
                onChange={(e) => setScheme(prev => ({ ...prev, cat1Contribution: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-[#9AF04F] focus:outline-none focus:border-[#9AF04F]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                CAT 2 Weight
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={scheme.cat2Contribution}
                onChange={(e) => setScheme(prev => ({ ...prev, cat2Contribution: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-[#9655F5] focus:outline-none focus:border-[#9655F5]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                Total CIA Target
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={scheme.totalCiaMax}
                onChange={(e) => setScheme(prev => ({ ...prev, totalCiaMax: Math.max(0, parseFloat(e.target.value) || 0) }))}
                className="w-full text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-white focus:outline-none focus:border-[#9AF04F]"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN MARKS ENTRY & RESULT SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Simple Marks Inputs (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal Marks Components
            </span>
            <span className="text-[11px] text-slate-500">
              Auto-scaled to subject syllabus
            </span>
          </div>

          {/* Component 1: Attendance */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9AF04F]" />
                Attendance Marks
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Max: {scheme.attendanceMax} marks
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max={scheme.attendanceMax}
                  value={attendanceObtained}
                  onChange={(e) => setAttendanceObtained(e.target.value)}
                  placeholder="Enter obtained marks"
                  className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                    validationWarnings.attendance ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9AF04F]'
                  }`}
                />
              </div>
              <span className="text-sm font-bold text-slate-500">/</span>
              <div className="w-20 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-sm font-bold text-slate-300">
                {scheme.attendanceMax}
              </div>
            </div>

            {validationWarnings.attendance && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.attendance}
              </p>
            )}
          </div>

          {/* Component 2: Assignment 1 */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Assignment 1
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Max: {scheme.assignment1Max} marks
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max={scheme.assignment1Max}
                  value={assignment1Obtained}
                  onChange={(e) => setAssignment1Obtained(e.target.value)}
                  placeholder="Enter obtained marks"
                  className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                    validationWarnings.assignment1 ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9AF04F]'
                  }`}
                />
              </div>
              <span className="text-sm font-bold text-slate-500">/</span>
              <div className="w-20 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-sm font-bold text-slate-300">
                {scheme.assignment1Max}
              </div>
            </div>

            {validationWarnings.assignment1 && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.assignment1}
              </p>
            )}
          </div>

          {/* Component 3: Assignment 2 (Optional) */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasAssignment2 ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                <span className="text-xs font-bold text-white">Assignment 2 (optional)</span>
              </div>

              <button
                type="button"
                onClick={() => setHasAssignment2(!hasAssignment2)}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  hasAssignment2
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                    : 'bg-white/[0.05] text-slate-400 border-white/[0.08] hover:text-white'
                }`}
              >
                {hasAssignment2 ? '✓ Enabled' : '+ Enable'}
              </button>
            </div>

            {hasAssignment2 ? (
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max={scheme.assignment2Max}
                      value={assignment2Obtained}
                      onChange={(e) => setAssignment2Obtained(e.target.value)}
                      placeholder="Enter obtained marks"
                      className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                        validationWarnings.assignment2 ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9AF04F]'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-500">/</span>
                  <div className="w-20 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-sm font-bold text-slate-300">
                    {scheme.assignment2Max}
                  </div>
                </div>

                {validationWarnings.assignment2 && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.assignment2}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 py-1">
                Disabled for this subject. Click "Enable" if your subject includes a second assignment.
              </p>
            )}
          </div>

          {/* Component 4: CAT 1 (Exam conducted out of 30) */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-[#9AF04F]/40 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9AF04F] shadow-neon-sm" />
                CAT 1 (First Internal Examination)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/10 text-[#9AF04F] border border-[#9AF04F]/20">
                Syllabus Weight: {scheme.cat1Contribution} Marks
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={cat1MarksOut30}
                  onChange={(e) => setCat1MarksOut30(e.target.value)}
                  placeholder="Enter marks out of 30"
                  className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                    validationWarnings.cat1 ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9AF04F]'
                  }`}
                />
              </div>
              <span className="text-sm font-bold text-slate-500">/ 30</span>
              <div className="w-28 py-2 px-3 rounded-xl bg-[#9AF04F]/15 border border-[#9AF04F]/30 text-center font-bold text-xs text-[#9AF04F]">
                → {calculation.cat1.converted}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>Formula: ({calculation.cat1.obtained} / 30) × {scheme.cat1Contribution}</span>
              <span className="font-bold text-[#9AF04F]">{calculation.cat1.converted} / {scheme.cat1Contribution}</span>
            </div>

            {validationWarnings.cat1 && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.cat1}
              </p>
            )}
          </div>

          {/* Component 5: CAT 2 (Exam conducted out of 30 - Purple Accent) */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-[#9655F5]/50 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#9655F5] shadow-purple-glow" />
                CAT 2 (Second Internal Examination)
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#9655F5]/15 text-[#9655F5] border border-[#9655F5]/30">
                Syllabus Weight: {scheme.cat2Contribution} Marks
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="30"
                  value={cat2MarksOut30}
                  onChange={(e) => setCat2MarksOut30(e.target.value)}
                  placeholder="Enter marks out of 30"
                  className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                    validationWarnings.cat2 ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9655F5]'
                  }`}
                />
              </div>
              <span className="text-sm font-bold text-slate-500">/ 30</span>
              <div className="w-28 py-2 px-3 rounded-xl bg-[#9655F5]/20 border border-[#9655F5]/35 text-center font-bold text-xs text-white">
                → {calculation.cat2.converted}
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
              <span>Formula: ({calculation.cat2.obtained} / 30) × {scheme.cat2Contribution}</span>
              <span className="font-bold text-[#9655F5]">{calculation.cat2.converted} / {scheme.cat2Contribution}</span>
            </div>

            {validationWarnings.cat2 && (
              <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.cat2}
              </p>
            )}
          </div>

          {/* Optional Practical / Lab Component */}
          <div className="p-4 rounded-2xl bg-[#11131B] border border-white/[0.08] hover:border-white/[0.15] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FlaskConical className={`w-4 h-4 ${hasPractical ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="text-xs font-bold text-white">
                  {scheme.practicalName || 'Practical / Laboratory Component'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setHasPractical(!hasPractical)}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                  hasPractical
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-white/[0.05] text-slate-400 border-white/[0.08] hover:text-white'
                }`}
              >
                {hasPractical ? '✓ Included' : '+ Include Practical'}
              </button>
            </div>

            {hasPractical ? (
              <div>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max={scheme.practicalMax || 30}
                      value={practicalObtained}
                      onChange={(e) => setPracticalObtained(e.target.value)}
                      placeholder="Enter practical / lab marks"
                      className={`w-full text-sm font-bold bg-[#141724] border rounded-xl py-2 px-3 text-white focus:outline-none ${
                        validationWarnings.practical ? 'border-rose-500' : 'border-white/[0.1] focus:border-[#9AF04F]'
                      }`}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-500">/</span>
                  <div className="w-20 py-2 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-center text-sm font-bold text-slate-300">
                    {scheme.practicalMax || 30}
                  </div>
                </div>

                {validationWarnings.practical && (
                  <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> {validationWarnings.practical}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 py-1">
                Optional practical / lab record assessment. Disabled by default for pure theory courses.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Clear Automatic Result Card (5 cols on desktop) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live CIA Result
            </span>
            <span className="text-[11px] font-bold text-[#9AF04F]">Instant Calculation</span>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-5">
            {/* Subject Identity Header */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {currentSubject?.code || 'COURSE'} • {currentSubject?.category || 'Semester 5'}
              </span>
              <h3 className="text-lg font-black text-white tracking-tight line-clamp-1">
                {currentSubject?.name || 'Academic Course'}
              </h3>
            </div>

            {/* Component Ledger Summary */}
            <div className="space-y-2.5 pt-2 border-t border-white/[0.06] text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
                  Attendance:
                </span>
                <span className="font-bold text-white font-mono">
                  {calculation.attendance.obtained.toFixed(2)} / {calculation.attendance.max}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Assignment 1:
                </span>
                <span className="font-bold text-white font-mono">
                  {calculation.assignment1.obtained.toFixed(2)} / {calculation.assignment1.max}
                </span>
              </div>

              {hasAssignment2 && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    Assignment 2:
                  </span>
                  <span className="font-bold text-white font-mono">
                    {calculation.assignment2.obtained.toFixed(2)} / {calculation.assignment2.max}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
                  CAT 1 (out of 30):
                </span>
                <span className="font-bold text-[#9AF04F] font-mono">
                  {calculation.cat1.converted.toFixed(2)} / {calculation.cat1.contribution}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9655F5]" />
                  CAT 2 (out of 30):
                </span>
                <span className="font-bold text-[#9655F5] font-mono">
                  {calculation.cat2.converted.toFixed(2)} / {calculation.cat2.contribution}
                </span>
              </div>

              {hasPractical && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {scheme.practicalName || 'Practical / Lab'}:
                  </span>
                  <span className="font-bold text-emerald-300 font-mono">
                    {calculation.practical.obtained.toFixed(2)} / {calculation.practical.max}
                  </span>
                </div>
              )}
            </div>

            {/* TOTAL CIA SCORE HERO DISPLAY */}
            <div className="p-4 rounded-2xl bg-[#090B10] border border-white/[0.08] shadow-inner space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    TOTAL CIA MARKS
                  </span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {calculation.totalObtained.toFixed(2)}{' '}
                    <span className="text-sm font-bold text-slate-400">/ {calculation.maxInternal}</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-[#9AF04F]">
                    {calculation.percentage.toFixed(1)}%
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block">
                    Internal Ratio
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#9AF04F] to-[#9655F5] rounded-full shadow-neon-sm transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(0, calculation.percentage))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Remaining: <strong className="text-white">{calculation.remainingMarks.toFixed(2)}</strong></span>
                <span className="text-[#9AF04F] font-semibold">
                  {calculation.percentage >= 80 ? '✓ Excellent CIA Standing' : calculation.percentage >= 50 ? '✓ Passing Threshold Met' : '⚠ Action Needed'}
                </span>
              </div>
            </div>

            {/* Success toast message */}
            {saveSuccessMsg && (
              <div className="p-3 rounded-2xl bg-[#9AF04F]/15 border border-[#9AF04F]/40 text-[#9AF04F] text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <Button
                variant="neon"
                size="md"
                icon={Check}
                onClick={handleApplyToSubject}
                className="w-full font-bold shadow-neon-sm py-3"
              >
                Apply to Subject CIA
              </Button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetMarks}
                  className="flex-1 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Marks
                </button>

                {onSwitchToEndSem && (
                  <button
                    type="button"
                    onClick={onSwitchToEndSem}
                    className="flex-1 py-2 rounded-xl bg-[#9655F5]/10 hover:bg-[#9655F5]/20 text-[#9655F5] border border-[#9655F5]/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <GraduationCap className="w-3.5 h-3.5" /> End-Sem Calc
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

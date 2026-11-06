import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Calculator, Check, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { getGradeFromPercentage } from '../../utils/grading';

export function MarksCalculatorModal({ isOpen, onClose, onApplyToSubject = null }) {
  const { settings } = useAcademic();

  const [schemeType, setSchemeType] = useState('sum');
  const [ciaMarks, setCiaMarks] = useState('45');
  const [ciaMax, setCiaMax] = useState('50');
  const [eseMarks, setEseMarks] = useState('44');
  const [eseMax, setEseMax] = useState('50');
  const [ciaWeight, setCiaWeight] = useState('50');
  const [eseWeight, setEseWeight] = useState('50');

  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);

  useEffect(() => {
    const errs = {};
    const cia = parseFloat(ciaMarks) || 0;
    const cMax = parseFloat(ciaMax) || 0;
    const ese = parseFloat(eseMarks) || 0;
    const eMax = parseFloat(eseMax) || 0;
    const cWeight = parseFloat(ciaWeight) || 0;
    const eWeight = parseFloat(eseWeight) || 0;

    if (cMax <= 0) errs.ciaMax = 'Max marks must be greater than 0';
    if (eMax <= 0) errs.eseMax = 'Max marks must be greater than 0';
    if (cia < 0) errs.ciaMarks = 'Marks cannot be negative';
    if (cia > cMax) errs.ciaMarks = `Cannot exceed maximum (${cMax})`;
    if (ese < 0) errs.eseMarks = 'Marks cannot be negative';
    if (ese > eMax) errs.eseMarks = `Cannot exceed maximum (${eMax})`;

    if (schemeType === 'weighted' && cWeight + eWeight <= 0) {
      errs.weight = 'Total weightage must be greater than 0';
    }

    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      let totalMarks = 0;
      let totalMax = cMax + eMax;
      let percentage = 0;

      if (schemeType === 'weighted') {
        const totalW = cWeight + eWeight;
        const ciaRatio = cMax > 0 ? (cia / cMax) : 0;
        const eseRatio = eMax > 0 ? (ese / eMax) : 0;
        const weightedScore = (ciaRatio * cWeight) + (eseRatio * eWeight);
        percentage = (weightedScore / totalW) * 100;
        totalMarks = (percentage / 100) * totalMax;
      } else {
        totalMarks = cia + ese;
        percentage = totalMax > 0 ? (totalMarks / totalMax) * 100 : 0;
      }

      percentage = Math.min(100, Math.max(0, Math.round(percentage * 100) / 100));
      totalMarks = Math.round(totalMarks * 10) / 10;

      const gradeInfo = getGradeFromPercentage(percentage, settings.gradeScale);

      setResults({
        totalMarks,
        totalMax,
        percentage,
        grade: gradeInfo.grade,
        gradePoint: gradeInfo.gradePoint,
        description: gradeInfo.description,
      });
    } else {
      setResults(null);
    }
  }, [ciaMarks, ciaMax, eseMarks, eseMax, schemeType, ciaWeight, eseWeight, settings.gradeScale]);

  const handleReset = () => {
    setCiaMarks('40');
    setCiaMax('50');
    setEseMarks('40');
    setEseMax('50');
    setSchemeType('sum');
    setCiaWeight('50');
    setEseWeight('50');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Academic Marks & Grade Engine"
      subtitle="Fintech-style evaluation simulator for weighted internal and end-semester scores."
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Assessment Scheme Switcher Pills */}
        <div className="p-2.5 rounded-2xl bg-[#141724] border border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-300 pl-2">
            Scheme Mode:
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSchemeType('sum')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                schemeType === 'sum'
                  ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                  : 'bg-white/[0.05] text-slate-400 hover:text-white'
              }`}
            >
              Direct Sum
            </button>
            <button
              type="button"
              onClick={() => setSchemeType('weighted')}
              className={`text-xs px-3.5 py-1.5 rounded-full font-bold transition-all ${
                schemeType === 'weighted'
                  ? 'bg-[#9655F5] text-white shadow-purple-glow'
                  : 'bg-white/[0.05] text-slate-400 hover:text-white'
              }`}
            >
              Weighted Ratio
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Internal Marks (CIA) */}
          <div className="space-y-3 p-4 rounded-2xl border border-white/[0.06] bg-[#141724]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#9AF04F]">
              Internal Assessment (CIA)
            </h4>
            <Input
              label="Obtained CIA Marks"
              type="number"
              step="0.5"
              value={ciaMarks}
              onChange={(e) => setCiaMarks(e.target.value)}
              error={errors.ciaMarks}
              placeholder="e.g. 45"
            />
            <Input
              label="Maximum CIA Marks"
              type="number"
              step="1"
              value={ciaMax}
              onChange={(e) => setCiaMax(e.target.value)}
              error={errors.ciaMax}
              placeholder="e.g. 50"
            />
            {schemeType === 'weighted' && (
              <Input
                label="CIA Weight (%)"
                type="number"
                value={ciaWeight}
                onChange={(e) => setCiaWeight(e.target.value)}
                suffix="%"
              />
            )}
          </div>

          {/* End-Semester Exam (ESE) */}
          <div className="space-y-3 p-4 rounded-2xl border border-white/[0.06] bg-[#141724]">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#9655F5]">
              End-Semester Exam (ESE)
            </h4>
            <Input
              label="Obtained ESE Marks"
              type="number"
              step="0.5"
              value={eseMarks}
              onChange={(e) => setEseMarks(e.target.value)}
              error={errors.eseMarks}
              placeholder="e.g. 42"
            />
            <Input
              label="Maximum ESE Marks"
              type="number"
              step="1"
              value={eseMax}
              onChange={(e) => setEseMax(e.target.value)}
              error={errors.eseMax}
              placeholder="e.g. 50"
            />
            {schemeType === 'weighted' && (
              <Input
                label="ESE Weight (%)"
                type="number"
                value={eseWeight}
                onChange={(e) => setEseWeight(e.target.value)}
                suffix="%"
              />
            )}
          </div>
        </div>

        {/* Real-time Result Box */}
        {results ? (
          <div className="p-5 rounded-3xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#0A0D06]/80">
                Evaluation Output
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0A0D06] text-[#9AF04F]">
                Grade {results.grade} ({results.gradePoint} GP)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-black/10">
                <span className="text-[11px] font-bold text-[#0A0D06]/70 block">
                  Total Marks
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0A0D06]">
                  {results.totalMarks}{' '}
                  <span className="text-xs font-bold text-[#0A0D06]/50">
                    /{results.totalMax}
                  </span>
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/10">
                <span className="text-[11px] font-bold text-[#0A0D06]/70 block">
                  Percentage
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0A0D06]">
                  {results.percentage}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/10">
                <span className="text-[11px] font-bold text-[#0A0D06]/70 block">
                  Grade Point
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#0A0D06]">
                  {results.gradePoint} / 10
                </span>
              </div>
            </div>

            <p className="text-[11px] font-semibold text-[#0A0D06]/80 mt-3 text-center">
              Classification: <strong>{results.description}</strong> based on active grading scale.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Please correct validation errors above to view calculation results.
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="dark"
            size="sm"
            icon={RefreshCw}
            onClick={handleReset}
          >
            Reset
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            {onApplyToSubject && results && (
              <Button
                variant="neon"
                size="sm"
                icon={Check}
                onClick={() => {
                  onApplyToSubject(results);
                  onClose();
                }}
              >
                Apply Marks
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

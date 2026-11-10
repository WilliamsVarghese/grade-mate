import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { InternalAssessmentCalculator } from '../calculators/InternalAssessmentCalculator';
import { EndSemCalculator } from '../calculators/EndSemCalculator';
import { OverallMarksCalculator } from '../calculators/OverallMarksCalculator';
import { Calculator, Award, GraduationCap, Zap, Sparkles } from 'lucide-react';

export function MarksCalculatorModal({
  isOpen,
  onClose,
  initialTab = 'internal',
  initialSubjectId = null,
  onApplyToSubject = null,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Academic Calculation Engines"
      subtitle="Comprehensive tools for Internal Assessment (CAT 1 & 2), End-Semester scaling, and overall subject grades."
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Navigation Tabs Pill Bar */}
        <div className="p-1.5 rounded-full bg-[#141724] border border-white/[0.08] flex items-center justify-between gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('internal')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'internal'
                ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Internal Assessment
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('endsem')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'endsem'
                ? 'bg-[#9655F5] text-white shadow-purple-glow'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            End-Semester Exam
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overall')}
            className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'overall'
                ? 'bg-white text-[#0A0D06] shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Overall Grade Engine
          </button>
        </div>

        {/* Tab 1: Internal Assessment Calculator */}
        {activeTab === 'internal' && (
          <InternalAssessmentCalculator
            initialSubjectId={initialSubjectId}
            onSwitchToEndSem={() => setActiveTab('endsem')}
            onApplySuccess={() => {
              if (onApplyToSubject) onApplyToSubject();
            }}
          />
        )}

        {/* Tab 2: End-Semester Exam Calculator */}
        {activeTab === 'endsem' && (
          <EndSemCalculator
            initialSubjectId={initialSubjectId}
            onSwitchToInternal={() => setActiveTab('internal')}
            onApplySuccess={() => {
              if (onApplyToSubject) onApplyToSubject();
            }}
          />
        )}

        {/* Tab 3: Overall Marks & Grade Engine */}
        {activeTab === 'overall' && (
          <OverallMarksCalculator
            onSwitchToInternal={() => setActiveTab('internal')}
            onApplyToSubject={onApplyToSubject}
          />
        )}
      </div>
    </Modal>
  );
}

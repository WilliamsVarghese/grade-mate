import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Calculator,
  Award,
  Layers,
  Search,
  BookOpen,
  Info,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { SubjectDetailModal } from '../components/subjects/SubjectDetailModal';
import { MarksCalculatorModal } from '../components/subjects/MarksCalculatorModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';

export function Elective() {
  const {
    electiveSubjects,
    electivePerformance,
    addElectiveSubject,
    updateElectiveSubject,
    deleteElectiveSubject,
  } = useAcademic();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState('internal');
  const [calculatorSubjectId, setCalculatorSubjectId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openCalculator = (tab = 'internal', subjectId = null) => {
    setCalculatorTab(tab);
    setCalculatorSubjectId(subjectId);
    setCalculatorOpen(true);
  };

  const filteredSubjects = electiveSubjects.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.code && s.code.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubject(sub);
    setModalOpen(true);
  };

  const handleSave = (data) => {
    if (editingSubject) {
      updateElectiveSubject(editingSubject.id, data);
    } else {
      addElectiveSubject(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFA07A]">
              Specialized Elective
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFA07A]" />
            <span className="text-xs text-slate-400">Professional Elective 2 Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Elective – Operating System Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dedicated academic section for advanced Operating System Security and cybersecurity elective modules.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="dark"
            size="sm"
            icon={Calculator}
            onClick={() => openCalculator('internal')}
          >
            Marks Calc
          </Button>
          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Elective Course
          </Button>
        </div>
      </div>

      {/* Elective Performance Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#2D1B14] via-[#20120D] to-[#120A07] border border-[#FFA07A]/30 text-white shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFA07A]">
              Elective Stream GPA
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFA07A]/20 text-[#FFA07A] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {electivePerformance.sgpa}{' '}
            <span className="text-xs font-bold text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-[#FFA07A] mt-2 font-semibold">
            Total Grade Points: {electivePerformance.totalWeightedPoints}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.07] text-white shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Elective Credits
            </span>
            <div className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {electivePerformance.totalCredits}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Registered elective credit weight
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.07] text-white shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Elective Modules
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FFE7D9] text-[#682D0F] flex items-center justify-center font-bold">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {electiveSubjects.length}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Segregated from regular semester core list
          </p>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-[#151824] border border-white/[0.06] flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-[#FFA07A] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Elective Specialization Scope:</strong> This track isolates Operating System Security (PE-2) and cybersecurity modules so you can analyze your specialization mastery independently.
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search elective courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-2.5 rounded-full bg-[#141724] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#FFA07A]"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.1] bg-[#11131B]/50">
          <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {searchTerm ? 'No matching elective courses' : 'No elective courses enrolled'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            Add your Operating System Security elective module or lab to record internal CIA marks, external examination marks, and grade points.
          </p>
          <Button variant="neon" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Elective Course
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => (
            <SubjectCard
              key={sub.id}
              subject={sub}
              onViewDetails={(s) => setViewingSubject(s)}
              onEdit={(s) => handleOpenEdit(s)}
              onDelete={(id) => setDeleteConfirmId(id)}
              onOpenInternalCalc={(subId) => openCalculator('internal', subId)}
              onOpenEndSemCalc={(subId) => openCalculator('endsem', subId)}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      <SubjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        subjectToEdit={editingSubject}
        sectionTitle="Elective Subject"
        defaultTrack="Operating System Security"
      />

      {/* Detail Modal */}
      <SubjectDetailModal
        isOpen={!!viewingSubject}
        onClose={() => setViewingSubject(null)}
        subject={viewingSubject}
        onEdit={(s) => handleOpenEdit(s)}
        onDelete={(id) => setDeleteConfirmId(id)}
        onOpenInternalCalc={(subId) => openCalculator('internal', subId)}
        onOpenEndSemCalc={(subId) => openCalculator('endsem', subId)}
      />

      {/* Marks Calculator */}
      <MarksCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        initialTab={calculatorTab}
        initialSubjectId={calculatorSubjectId}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteElectiveSubject(deleteConfirmId);
        }}
        title="Delete Elective Course"
        message="Are you sure you want to delete this course from the Elective track? Elective GPA will recalculate immediately."
      />
    </div>
  );
}

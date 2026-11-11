import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Calculator,
  Award,
  Layers,
  ArrowUpRight,
  ChevronRight,
  Check,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { SubjectCard } from '../components/subjects/SubjectCard';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { SubjectDetailModal } from '../components/subjects/SubjectDetailModal';
import { MarksCalculatorModal } from '../components/subjects/MarksCalculatorModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export function Semester5() {
  const {
    semesters,
    selectedSemesterId,
    selectedSemester,
    setSelectedSemesterId,
    currentSemesterSubjects,
    currentSemesterSGPA,
    allSemestersSGPA,
    addSubject,
    updateSubject,
    deleteSubject,
  } = useAcademic();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState('internal');
  const [calculatorSubjectId, setCalculatorSubjectId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const openCalculator = (tab = 'internal', subjectId = null) => {
    setCalculatorTab(tab);
    setCalculatorSubjectId(subjectId);
    setCalculatorOpen(true);
  };

  const filteredSubjects = useMemo(() => {
    return currentSemesterSubjects.filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q))
      );
    });
  }, [currentSemesterSubjects, searchTerm]);

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (subject) => {
    setEditingSubject(subject);
    setModalOpen(true);
  };

  const handleSaveSubject = (data) => {
    if (editingSubject) {
      updateSubject(editingSubject.id, data, selectedSemesterId);
    } else {
      addSubject(data, selectedSemesterId);
    }
  };

  return (
    <div className="space-y-6">
      {/* 8-SEMESTER TAB BAR */}
      <div className="p-1.5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {semesters.map((sem) => {
          const isSelected = sem.id === selectedSemesterId;
          const semMetric = allSemestersSGPA.find(s => s.id === sem.id);
          const hasSGPA = semMetric && semMetric.isEvaluated;

          return (
            <button
              key={sem.id}
              type="button"
              onClick={() => setSelectedSemesterId(sem.id)}
              className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                isSelected
                  ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08]'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span>{sem.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <span className={`text-[10px] font-mono ${isSelected ? 'text-[#0A0D06]/85 font-black' : 'text-slate-500'}`}>
                {hasSGPA ? `${semMetric.sgpa} SGPA` : `${semMetric?.subjectsCount || 0} Courses`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
              Curriculum Core
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
            <span className="text-xs text-slate-400">{selectedSemester.academicYear} • B.Tech CSE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {selectedSemester.name} – Regular Curriculum Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track subjects, internal assessment (CIA), end-semester (ESE) marks, credits, and SGPA for {selectedSemester.name}.
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
            Add Subject
          </Button>
        </div>
      </div>

      {/* Semester Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-3xl bg-[#11131B] border border-white/[0.07] shadow-card-dark">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            {selectedSemester.shortName} SGPA
          </span>
          <span className="text-3xl font-black text-[#9AF04F] mt-0.5 block">
            {currentSemesterSGPA.sgpa > 0 ? currentSemesterSGPA.sgpa : '—'}{' '}
            <span className="text-xs font-bold text-slate-500">/ 10</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Registered Credits
          </span>
          <span className="text-3xl font-black text-white mt-0.5 block">
            {currentSemesterSGPA.totalCredits}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Weighted Points
          </span>
          <span className="text-3xl font-black text-[#9655F5] mt-0.5 block">
            {currentSemesterSGPA.totalWeightedPoints}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Enrolled Courses
          </span>
          <span className="text-3xl font-black text-white mt-0.5 block">
            {currentSemesterSubjects.length}
          </span>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${selectedSemester.shortName} courses or code...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-2.5 rounded-full bg-[#141724] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F]"
          />
        </div>

        <div className="text-xs font-semibold text-slate-400 self-end sm:self-center">
          Showing {filteredSubjects.length} of {currentSemesterSubjects.length} courses in {selectedSemester.name}
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.1] bg-[#11131B]/50">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {searchTerm ? 'No matching subjects found' : `No subjects added for ${selectedSemester.name}`}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            {searchTerm
              ? 'Try adjusting your search query.'
              : `Add subjects for ${selectedSemester.name} to calculate its SGPA and track credits towards your B.Tech degree.`}
          </p>
          <Button variant="neon" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add First Subject to {selectedSemester.name}
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

      {/* Add / Edit Subject Modal */}
      <SubjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveSubject}
        subjectToEdit={editingSubject}
        sectionTitle={`${selectedSemester.name} Subject`}
      />

      {/* View Subject Details Modal */}
      <SubjectDetailModal
        isOpen={!!viewingSubject}
        onClose={() => setViewingSubject(null)}
        subject={viewingSubject}
        onEdit={(s) => handleOpenEdit(s)}
        onDelete={(id) => setDeleteConfirmId(id)}
        onOpenInternalCalc={(subId) => openCalculator('internal', subId)}
        onOpenEndSemCalc={(subId) => openCalculator('endsem', subId)}
      />

      {/* Marks Calculator Modal */}
      <MarksCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
        initialTab={calculatorTab}
        initialSubjectId={calculatorSubjectId}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteSubject(deleteConfirmId, selectedSemesterId);
        }}
        title="Delete Subject"
        message={`Are you sure you want to remove this subject from ${selectedSemester.name}? All marks, grades, and records for this subject will be removed.`}
      />
    </div>
  );
}

export const SemesterView = Semester5;
export default Semester5;

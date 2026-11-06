import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Calculator,
  Award,
  Layers,
  ArrowUpRight
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
    semester5Subjects,
    semester5SGPA,
    addSemester5Subject,
    updateSemester5Subject,
    deleteSemester5Subject,
  } = useAcademic();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const filteredSubjects = useMemo(() => {
    return semester5Subjects.filter((s) => {
      const q = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        (s.code && s.code.toLowerCase().includes(q))
      );
    });
  }, [semester5Subjects, searchTerm]);

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
      updateSemester5Subject(editingSubject.id, data);
    } else {
      addSemester5Subject(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
              Curriculum Core
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
            <span className="text-xs text-slate-400">Regular Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Semester 5 – Regular Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Core B.Tech curriculum subjects, internal assessment (CIA), and end-semester (ESE) scores.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="dark"
            size="sm"
            icon={Calculator}
            onClick={() => setCalculatorOpen(true)}
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
            Semester 5 SGPA
          </span>
          <span className="text-3xl font-black text-[#9AF04F] mt-0.5 block">
            {semester5SGPA.sgpa}{' '}
            <span className="text-xs font-bold text-slate-500">/ 10</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Registered Credits
          </span>
          <span className="text-3xl font-black text-white mt-0.5 block">
            {semester5SGPA.totalCredits}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Weighted Points
          </span>
          <span className="text-3xl font-black text-[#9655F5] mt-0.5 block">
            {semester5SGPA.totalWeightedPoints}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            Enrolled Courses
          </span>
          <span className="text-3xl font-black text-white mt-0.5 block">
            {semester5Subjects.length}
          </span>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search course title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-2.5 rounded-full bg-[#141724] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F]"
          />
        </div>

        <div className="text-xs font-semibold text-slate-400 self-end sm:self-center">
          Showing {filteredSubjects.length} of {semester5Subjects.length} core courses
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.1] bg-[#11131B]/50">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {searchTerm ? 'No matching subjects found' : 'No regular subjects added'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            {searchTerm
              ? 'Try adjusting your search query.'
              : 'Add your Semester 5 subjects to start tracking credits, internal assessment marks, and SGPA.'}
          </p>
          <Button variant="neon" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add First Subject
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
        sectionTitle="Semester 5 Regular Subject"
      />

      {/* View Subject Details Modal */}
      <SubjectDetailModal
        isOpen={!!viewingSubject}
        onClose={() => setViewingSubject(null)}
        subject={viewingSubject}
        onEdit={(s) => handleOpenEdit(s)}
        onDelete={(id) => setDeleteConfirmId(id)}
      />

      {/* Marks Calculator Modal */}
      <MarksCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteSemester5Subject(deleteConfirmId);
        }}
        title="Delete Subject"
        message="Are you sure you want to remove this subject from Semester 5? All internal marks, grades, and records for this subject will be permanently deleted."
      />
    </div>
  );
}

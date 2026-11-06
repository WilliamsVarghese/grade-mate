import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Calculator,
  Award,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  Info,
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

export function Minor() {
  const {
    minorSubjects,
    minorPerformance,
    addMinorSubject,
    updateMinorSubject,
    deleteMinorSubject,
  } = useAcademic();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [viewingSubject, setViewingSubject] = useState(null);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubjects = minorSubjects.filter((s) => {
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
      updateMinorSubject(editingSubject.id, data);
    } else {
      addMinorSubject(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C084FC]">
              Specialization Stream
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9655F5]" />
            <span className="text-xs text-slate-400">Independent Minor Degree</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Minor – IoT and Sensors
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Dedicated academic tracker for the specialized Internet of Things and Sensor Systems minor degree stream.
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
            variant="purple"
            size="sm"
            icon={Plus}
            onClick={handleOpenAdd}
          >
            Add Minor Course
          </Button>
        </div>
      </div>

      {/* Minor Stream Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Purple Fintech Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#201338] via-[#160D26] to-[#0E0919] border border-[#9655F5]/30 text-white shadow-purple-glow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C084FC]">
              Minor Stream GPA
            </span>
            <div className="w-8 h-8 rounded-full bg-[#9655F5]/20 text-[#C084FC] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {minorPerformance.sgpa}{' '}
            <span className="text-xs font-bold text-slate-400">/ 10</span>
          </div>
          <p className="text-xs text-[#C084FC] mt-2 font-semibold">
            Weighted Points: {minorPerformance.totalWeightedPoints}
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.07] text-white shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Minor Credits Earned
            </span>
            <div className="w-8 h-8 rounded-full bg-white/[0.06] text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {minorPerformance.totalCredits}{' '}
            <span className="text-xs font-bold text-slate-400">/ 20 Target</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {Math.round(((minorPerformance.totalCredits || 0) / 20) * 100)}% of Minor requirements fulfilled
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.07] text-white shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enrolled Minor Courses
            </span>
            <div className="w-8 h-8 rounded-full bg-[#EBDDFB] text-[#3B1768] flex items-center justify-center font-bold">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-4xl font-black text-white">
            {minorSubjects.length}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Completely segregated from regular Semester 5 subjects
          </p>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-[#151824] border border-white/[0.06] flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-4 h-4 text-[#9655F5] shrink-0 mt-0.5" />
        <div>
          <strong className="text-white">Autonomous Minor Specialization:</strong> Minor courses are tracked independently and do not mix with regular semester core credits. Minor GPA contributes to your honors/minor certification.
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search minor subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-2.5 rounded-full bg-[#141724] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9655F5]"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.1] bg-[#11131B]/50">
          <Cpu className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {searchTerm ? 'No matching minor subjects' : 'No minor subjects enrolled yet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm mx-auto">
            Add subjects under IoT and Sensors Minor to start recording internal marks, external scores, and calculate minor GPA.
          </p>
          <Button variant="purple" size="sm" icon={Plus} onClick={handleOpenAdd}>
            Add Minor Course
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

      {/* Add / Edit Modal */}
      <SubjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        subjectToEdit={editingSubject}
        sectionTitle="Minor Subject"
        defaultTrack="Minor in IoT and Sensors"
      />

      {/* Detail Modal */}
      <SubjectDetailModal
        isOpen={!!viewingSubject}
        onClose={() => setViewingSubject(null)}
        subject={viewingSubject}
        onEdit={(s) => handleOpenEdit(s)}
        onDelete={(id) => setDeleteConfirmId(id)}
      />

      {/* Marks Calculator */}
      <MarksCalculatorModal
        isOpen={calculatorOpen}
        onClose={() => setCalculatorOpen(false)}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => {
          if (deleteConfirmId) deleteMinorSubject(deleteConfirmId);
        }}
        title="Delete Minor Course"
        message="Are you sure you want to delete this course from the IoT and Sensors Minor? This will update your minor credits and minor GPA immediately."
      />
    </div>
  );
}

import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Award,
  BookOpen,
  Calendar,
  Percent,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Edit2,
  Trash2,
  ArrowUpRight
} from 'lucide-react';

export function SubjectDetailModal({
  isOpen,
  onClose,
  subject,
  onEdit,
  onDelete,
}) {
  if (!subject) return null;

  const attendanceAlert = subject.attendance !== undefined && Number(subject.attendance) < 75;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject.name}
      subtitle={`Code: ${subject.code || 'N/A'} • ${subject.credits} Credits • ${subject.track || 'Semester 5 Core'}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Top Highlight Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Grade
            </span>
            <span className="text-2xl font-black text-[#9AF04F]">
              {subject.grade || '–'}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Grade Point
            </span>
            <span className="text-2xl font-black text-white">
              {subject.gradePoint ?? 0}
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Total Score
            </span>
            <span className="text-2xl font-black text-white">
              {subject.totalMarks}
              <span className="text-xs font-normal text-slate-400">
                /{subject.maxMarks}
              </span>
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Percentage
            </span>
            <span className="text-2xl font-black text-[#9AF04F]">
              {subject.percentage}%
            </span>
          </div>
        </div>

        {/* Assessment Component Breakdown */}
        <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#141724] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Assessment Breakdown
          </h4>

          {/* Internal (CIA) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">
                Internal Assessment (CIA)
              </span>
              <span className="text-white font-bold">
                {subject.ciaMarks} / {subject.ciaMax}{' '}
                <span className="text-slate-400 font-normal">
                  ({Math.round(((subject.ciaMarks || 0) / (subject.ciaMax || 50)) * 100)}%)
                </span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-[#9AF04F] rounded-full shadow-neon-sm transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, ((subject.ciaMarks || 0) / (subject.ciaMax || 50)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* External (ESE) */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">
                End-Semester Exam (ESE)
              </span>
              <span className="text-white font-bold">
                {subject.eseMarks} / {subject.eseMax}{' '}
                <span className="text-slate-400 font-normal">
                  ({Math.round(((subject.eseMarks || 0) / (subject.eseMax || 50)) * 100)}%)
                </span>
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-[#9655F5] rounded-full shadow-purple-glow transition-all duration-500"
                style={{
                  width: `${Math.min(100, Math.max(0, ((subject.eseMarks || 0) / (subject.eseMax || 50)) * 100))}%`,
                }}
              />
            </div>
          </div>

          {/* Scheme Note */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
            <span>Evaluation Scheme:</span>
            <span className="font-semibold text-white capitalize">
              {subject.schemeType === 'weighted'
                ? `Weighted Ratio (${subject.ciaWeight || 50}% CIA : ${subject.eseWeight || 50}% ESE)`
                : 'Direct Marks Sum (CIA + ESE)'}
            </span>
          </div>
        </div>

        {/* Progress & Attendance Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Attendance */}
          <div
            className={`p-4 rounded-2xl border ${
              attendanceAlert
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-[#141724] border-white/[0.06]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Attendance
              </span>
              <span
                className={`text-xs font-bold ${
                  attendanceAlert ? 'text-rose-400' : 'text-white'
                }`}
              >
                {subject.attendance ?? '–'}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  attendanceAlert ? 'bg-rose-500' : 'bg-[#9AF04F]'
                }`}
                style={{ width: `${subject.attendance || 0}%` }}
              />
            </div>
            {attendanceAlert && (
              <p className="text-[11px] text-rose-400 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Below mandatory 75% attendance threshold
              </p>
            )}
          </div>

          {/* Progress */}
          <div className="p-4 rounded-2xl bg-[#141724] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-300">
                Syllabus Covered
              </span>
              <span className="text-xs font-bold text-[#9AF04F]">
                {subject.progress ?? '–'}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#9AF04F]"
                style={{ width: `${subject.progress || 0}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Based on curriculum milestone completion
            </p>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <Button
            variant="dangerOutline"
            size="sm"
            icon={Trash2}
            onClick={() => {
              onClose();
              onDelete(subject.id);
            }}
          >
            Delete
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button
              variant="neon"
              size="sm"
              icon={Edit2}
              onClick={() => {
                onClose();
                onEdit(subject);
              }}
            >
              Edit Course
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

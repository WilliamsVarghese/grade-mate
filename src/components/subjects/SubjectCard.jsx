import React from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export function SubjectCard({
  subject,
  onViewDetails,
  onEdit,
  onDelete,
  onOpenInternalCalc,
  onOpenEndSemCalc,
}) {
  const isLowAttendance = subject.attendance !== undefined && Number(subject.attendance) < 75;

  return (
    <div className="group relative bg-[#11131B] rounded-3xl border border-white/[0.07] hover:border-[#9AF04F]/40 p-5 sm:p-6 shadow-card-dark transition-all duration-200 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-[#9AF04F]">
                {subject.code || 'NO-CODE'}
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-slate-300">
                {subject.credits} Credits
              </span>
              {subject.track && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBDDFB] text-[#3B1768]">
                  Minor
                </span>
              )}
              {subject.electiveTrack && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFE7D9] text-[#682D0F]">
                  Elective
                </span>
              )}
            </div>

            <h3
              onClick={() => onViewDetails(subject)}
              className="text-base font-bold text-white tracking-tight cursor-pointer hover:text-[#9AF04F] transition-colors line-clamp-1"
              title={subject.name}
            >
              {subject.name}
            </h3>
          </div>

          {/* Grade Badge */}
          <div className="shrink-0 text-right">
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm inline-flex items-center gap-1">
              {subject.grade || 'N/A'} • {subject.gradePoint ?? 0} GP
            </span>
          </div>
        </div>

        {/* Scores & Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 my-3 p-3 rounded-2xl bg-[#161824] border border-white/[0.04] text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Internal (CIA)
            </span>
            <span className="font-bold text-white text-sm">
              {subject.ciaMarks} <span className="text-[10px] font-normal text-slate-400">/ {subject.ciaMax}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              End-Sem (ESE)
            </span>
            <span className="font-bold text-white text-sm">
              {subject.eseMarks} <span className="text-[10px] font-normal text-slate-400">/ {subject.eseMax}</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Total Score
            </span>
            <span className="font-black text-[#9AF04F] text-sm">
              {subject.totalMarks} <span className="text-[10px] font-normal text-slate-400">({subject.percentage}%)</span>
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-semibold">
              Attendance
            </span>
            <span
              className={`font-bold text-sm ${
                isLowAttendance ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              {subject.attendance ?? '–'}%
            </span>
          </div>
        </div>

        {/* Progress bar with neon accent */}
        {subject.progress !== undefined && (
          <div className="mt-2 mb-3">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
              <span>Syllabus covered</span>
              <span className="font-bold text-white">{subject.progress}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
              <div
                className="h-full bg-[#9AF04F] rounded-full shadow-neon-sm transition-all duration-300"
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onViewDetails(subject)}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Details
          </button>
          {onOpenInternalCalc && (
            <button
              type="button"
              onClick={() => onOpenInternalCalc(subject.id)}
              className="text-[11px] font-bold text-[#9AF04F] hover:underline flex items-center gap-0.5 transition-colors"
              title="Open Internal Assessment Calculator for this course"
            >
              ⚡ CIA
            </button>
          )}
          {onOpenEndSemCalc && (
            <button
              type="button"
              onClick={() => onOpenEndSemCalc(subject.id)}
              className="text-[11px] font-bold text-[#9655F5] hover:underline flex items-center gap-0.5 transition-colors"
              title="Open End-Semester Exam Calculator for this course"
            >
              🎓 ESE
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(subject)}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Edit Course"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(subject.id)}
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
            title="Delete Course"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import {
  BookOpen,
  FileText,
  Bell,
  Plus,
  ArrowUpRight,
  Calculator,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';

export function SubjectWorkspaceCard({
  subject,
  notesCount = 0,
  remindersCount = 0,
  onOpenNotes,
  onAddNote,
  onCreateReminder,
  onOpenInternalCalc,
  onOpenEndSemCalc,
  onEditSubject,
  onDeleteSubject,
}) {
  const isLowAttendance = subject.attendance !== undefined && Number(subject.attendance) < 75;

  // Category determination
  let categoryLabel = 'Regular';
  let categoryBadgeColor = 'bg-[#9AF04F]/10 text-[#9AF04F] border-[#9AF04F]/30';

  if (subject.track || subject.category?.includes('Minor')) {
    categoryLabel = 'Minor';
    categoryBadgeColor = 'bg-[#9655F5]/15 text-[#C084FC] border-[#9655F5]/30';
  } else if (subject.electiveTrack || subject.category?.includes('Elective')) {
    categoryLabel = 'Elective';
    categoryBadgeColor = 'bg-[#FFA07A]/15 text-[#FFA07A] border-[#FFA07A]/30';
  }

  // Calculate CIA progress percentage if available
  const ciaMax = Number(subject.ciaMax) || 50;
  const ciaObtained = Number(subject.ciaMarks) || 0;
  const ciaPercent = ciaMax > 0 ? Math.min(100, Math.round((ciaObtained / ciaMax) * 100)) : 0;
  const hasMarks = ciaObtained > 0 || (subject.totalMarks && Number(subject.totalMarks) > 0);

  return (
    <div className="group relative bg-[#11131B] hover:bg-[#141622] rounded-3xl border border-white/[0.08] hover:border-[#9AF04F]/40 p-5 shadow-card-dark transition-all duration-200 flex flex-col justify-between">
      {/* Top Meta Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Subject Code */}
            <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white">
              {subject.code || 'CORE'}
            </span>
            {/* Credits */}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-300">
              {subject.credits} Credits
            </span>
            {/* Category */}
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${categoryBadgeColor}`}>
              {categoryLabel}
            </span>
          </div>

          {/* Quick Academic Grade/Score Badge */}
          {subject.grade ? (
            <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm shrink-0">
              {subject.grade} • {subject.gradePoint ?? 0} GP
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-slate-500 shrink-0">
              Sem {subject.semester?.replace('Semester ', '') || ''}
            </span>
          )}
        </div>

        {/* Subject Name */}
        <h3
          onClick={() => onOpenNotes(subject)}
          className="text-base sm:text-lg font-bold text-white tracking-tight cursor-pointer hover:text-[#9AF04F] transition-colors line-clamp-1 mb-3"
          title={subject.name}
        >
          {subject.name}
        </h3>

        {/* Internal Marks Progress bar */}
        <div className="mb-4 p-3 rounded-2xl bg-[#161826] border border-white/[0.04] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>CIA Progress</span>
              {hasMarks && (
                <span className="text-white font-mono font-semibold">
                  {ciaObtained}/{ciaMax}
                </span>
              )}
            </span>
            <span className="text-[11px] font-black text-[#9AF04F] font-mono">
              {hasMarks ? `${ciaPercent}%` : 'Not recorded'}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#9AF04F]/60 to-[#9AF04F] rounded-full transition-all duration-500"
              style={{ width: `${hasMarks ? ciaPercent : 0}%` }}
            />
          </div>

          {/* Attendance footnote */}
          {subject.attendance !== undefined && (
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
              <span>Attendance</span>
              <span className={`font-semibold ${isLowAttendance ? 'text-rose-400' : 'text-slate-200'}`}>
                {subject.attendance}% {isLowAttendance && '⚠️ (<75%)'}
              </span>
            </div>
          )}
        </div>

        {/* Notes & Reminder Badges */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => onOpenNotes(subject)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#9AF04F]" />
            <span>{notesCount} {notesCount === 1 ? 'Note' : 'Notes'}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenNotes(subject, 'reminders')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors ${
              remindersCount > 0
                ? 'bg-[#9655F5]/15 text-[#C084FC] hover:bg-[#9655F5]/25 border border-[#9655F5]/30'
                : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{remindersCount} {remindersCount === 1 ? 'Reminder' : 'Reminders'}</span>
          </button>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
        {/* Quick action to open notes / workspace */}
        <button
          type="button"
          onClick={() => onOpenNotes(subject)}
          className="flex-1 py-2 px-3 rounded-xl bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-bold transition-all shadow-neon-sm active:scale-95 flex items-center justify-center gap-1"
        >
          <span>Open Notes</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>

        {/* Quick action to add a note */}
        <button
          type="button"
          onClick={() => onAddNote(subject)}
          className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white transition-colors active:scale-95"
          title="Add Note"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Quick action to create a reminder */}
        <button
          type="button"
          onClick={() => onCreateReminder(subject)}
          className="p-2 rounded-xl bg-[#9655F5]/20 hover:bg-[#9655F5]/35 text-[#C084FC] transition-colors active:scale-95"
          title="Create Reminder"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Quick Calculator button to retain calculation tools */}
        {onOpenInternalCalc && (
          <button
            type="button"
            onClick={() => onOpenInternalCalc(subject.id)}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-400 hover:text-[#9AF04F] transition-colors active:scale-95"
            title="Calculate Marks"
          >
            <Calculator className="w-4 h-4" />
          </button>
        )}

        {/* Edit Subject */}
        {onEditSubject && (
          <button
            type="button"
            onClick={() => onEditSubject(subject)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-500 hover:text-white transition-colors"
            title="Edit Subject"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Delete Subject */}
        {onDeleteSubject && (
          <button
            type="button"
            onClick={() => onDeleteSubject(subject.id)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
            title="Delete Subject"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Pin, Bell, Trash2 } from 'lucide-react';

export function KeepNoteCard({
  note,
  onOpen,
  onTogglePin,
  onDelete,
}) {
  const isPinned = !!note.isPinned;
  const hasReminder = !!note.hasReminder && !!note.reminder;

  // Format date cleanly (e.g. "Nov 22")
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const formattedDate = formatDate(note.updatedAt || note.createdAt);

  return (
    <div
      onClick={() => onOpen(note)}
      className={`group relative rounded-2xl p-4 sm:p-4.5 transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
        isPinned
          ? 'bg-emerald-50/40 dark:bg-[#131625] border-[#9AF04F] shadow-sm dark:shadow-neon-sm'
          : 'bg-white hover:bg-slate-50 dark:bg-[#11131B] dark:hover:bg-[#141624] border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.2] hover:shadow-md'
      }`}
    >
      <div>
        {/* Top: Title & Pin Button */}
        <div className="flex items-start justify-between gap-2 mb-1.5">
          {note.title ? (
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-tight line-clamp-2 pr-1">
              {note.title}
            </h3>
          ) : (
            <div className="h-4" />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
            className={`p-1.5 rounded-lg transition-colors shrink-0 -mt-1 -mr-1 ${
              isPinned
                ? 'text-emerald-700 dark:text-[#9AF04F] hover:text-emerald-800 dark:hover:text-white bg-[#9AF04F]/15 dark:bg-[#9AF04F]/10'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 opacity-60 sm:opacity-0 group-hover:opacity-100'
            }`}
            title={isPinned ? 'Unpin note' : 'Pin note'}
          >
            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content: Short preview (multiline supported, line-clamped) */}
        {note.content && (
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-normal leading-relaxed whitespace-pre-wrap line-clamp-4 mb-3">
            {note.content}
          </p>
        )}
      </div>

      {/* Card Footer: Subject Badge (optional), Reminder, Date & Delete Action */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-white/[0.04] mt-auto space-y-2">
        {/* Badges row: Subject and/or Reminder */}
        {(note.subjectName || hasReminder) && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Optional Subject Name Badge */}
            {note.subjectName && (
              <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-white/[0.06] text-emerald-800 dark:text-[#9AF04F] font-mono truncate max-w-[170px]">
                {note.subjectCode ? `${note.subjectCode} • ` : ''}{note.subjectName}
              </span>
            )}

            {/* Optional Reminder Badge */}
            {hasReminder && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                  note.reminder?.isCompleted
                    ? 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400 line-through'
                    : 'bg-purple-50 dark:bg-[#9655F5]/20 text-purple-700 dark:text-[#C084FC] border border-purple-200 dark:border-[#9655F5]/30'
                }`}
              >
                <Bell className="w-2.5 h-2.5" />
                <span>{note.reminder.date} {note.reminder.time}</span>
              </span>
            )}
          </div>
        )}

        {/* Date and Delete Button row */}
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{formattedDate}</span>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="p-1 rounded-md text-slate-500 hover:text-rose-400 opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500/10"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

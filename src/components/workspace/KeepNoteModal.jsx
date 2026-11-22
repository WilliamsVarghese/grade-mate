import React, { useState, useEffect } from 'react';
import {
  X,
  Pin,
  Bell,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export function KeepNoteModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  noteToEdit = null,
  allSubjects = [],
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Optional Reminder states
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('18:00');

  // Notification permission state
  const [permStatus, setPermStatus] = useState(() => notificationService.getPermission());
  const [permMessage, setPermMessage] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;

    setPermStatus(notificationService.getPermission());
    setPermMessage(null);

    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setSelectedSubjectId(noteToEdit.subjectId || '');
      setIsPinned(!!noteToEdit.isPinned);

      if (noteToEdit.hasReminder && noteToEdit.reminder) {
        setHasReminder(true);
        setReminderDate(noteToEdit.reminder.date || todayStr);
        setReminderTime(noteToEdit.reminder.time || '18:00');
      } else {
        setHasReminder(false);
        setReminderDate(todayStr);
        setReminderTime('18:00');
      }
    } else {
      setTitle('');
      setContent('');
      setSelectedSubjectId('');
      setIsPinned(false);
      setHasReminder(false);
      setReminderDate(todayStr);
      setReminderTime('18:00');
    }
  }, [isOpen, noteToEdit, todayStr]);

  // Handle "Set reminder" toggle change
  const handleToggleReminder = async (checked) => {
    setHasReminder(checked);

    if (checked) {
      const current = notificationService.getPermission();
      setPermStatus(current);

      if (current === 'default') {
        const res = await notificationService.requestPermission();
        setPermStatus(res.status);
        setPermMessage(res.message);
      } else if (current === 'denied') {
        setPermMessage(
          'Notifications are blocked in your browser settings. You can still set this reminder for in-app viewing.'
        );
      }
    } else {
      setPermMessage(null);
    }
  };

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setPermStatus(res.status);
    setPermMessage(res.message);
  };

  const handleSaveAndClose = () => {
    // If both title and content are empty and not editing an existing note, don't save
    if (!title.trim() && !content.trim()) {
      onClose();
      return;
    }

    const matchedSubject = allSubjects.find((s) => s.id === selectedSubjectId);

    const payload = {
      ...(noteToEdit || {}),
      id: noteToEdit?.id || `note-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      subjectId: matchedSubject?.id || (selectedSubjectId ? selectedSubjectId : null),
      subjectName: matchedSubject?.name || noteToEdit?.subjectName || '',
      subjectCode: matchedSubject?.code || noteToEdit?.subjectCode || '',
      semesterId: matchedSubject?.semesterId || noteToEdit?.semesterId || 'sem-5',
      isPinned,
      hasReminder,
      updatedAt: new Date().toISOString(),
    };

    if (hasReminder) {
      payload.reminder = {
        ...(noteToEdit?.reminder || {}),
        id: noteToEdit?.reminder?.id || `rem-${Date.now()}`,
        date: reminderDate || todayStr,
        time: reminderTime || '18:00',
        notificationTitle: title.trim() || `${payload.subjectName || 'Study'} Reminder`,
        notificationMessage:
          content.trim().slice(0, 100) || `Revise notes for ${payload.subjectName || 'your course'}.`,
        isCompleted: noteToEdit?.reminder?.isCompleted || false,
        notified: false,
      };
    } else {
      payload.reminder = null;
    }

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Google Keep style card modal */}
      <div className="relative w-full max-w-xl bg-[#12141F] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Control Bar: Optional Subject Selector, Pin, and Close */}
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between gap-3 shrink-0 bg-[#161826]">
          {/* Optional Subject Dropdown */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0">
              Subject:
            </span>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-[#1B1E30] border border-white/[0.1] text-white focus:outline-none focus:border-[#9AF04F] truncate max-w-[200px] sm:max-w-[280px]"
            >
              <option value="">None (General Note)</option>
              {allSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.code ? `${sub.code} • ` : ''}{sub.name} {sub.semesterName ? `(${sub.semesterName})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Pin Button */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-xl transition-all ${
                isPinned
                  ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
              }`}
              title={isPinned ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleSaveAndClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              title="Save & Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Note Body: Title & Content (Google Keep Style) */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
          {/* Note Title Input */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full bg-transparent text-white placeholder:text-slate-500 text-lg sm:text-xl font-bold focus:outline-none tracking-tight"
          />

          {/* Multiline Note Content Textarea */}
          <textarea
            rows={7}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Take a note..."
            className="w-full bg-transparent text-slate-200 placeholder:text-slate-500 text-sm leading-relaxed focus:outline-none resize-none custom-scrollbar font-normal whitespace-pre-wrap"
          />

          {/* OPTIONAL REMINDER SECTION */}
          <div className="pt-3 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReminder}
                  onChange={(e) => handleToggleReminder(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#9AF04F] bg-[#1B1E30] border-white/[0.2] cursor-pointer"
                />
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#C084FC]" />
                  Set reminder (optional)
                </span>
              </label>

              {hasReminder && (
                <span className="text-[10px] font-mono text-[#C084FC] bg-[#9655F5]/15 px-2 py-0.5 rounded-full">
                  Reminder Active
                </span>
              )}
            </div>

            {/* If reminder is checked, show Date & Time inputs */}
            {hasReminder && (
              <div className="p-3.5 rounded-2xl bg-[#171A27] border border-white/[0.06] space-y-2.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Date
                    </span>
                    <input
                      type="date"
                      min={todayStr}
                      value={reminderDate}
                      onChange={(e) => setReminderDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#12141F] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#9AF04F]"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Time
                    </span>
                    <input
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#12141F] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#9AF04F]"
                    />
                  </div>
                </div>

                {/* Permission status handling */}
                {permStatus === 'granted' ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#9AF04F]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Browser notifications enabled</span>
                  </div>
                ) : permStatus === 'denied' ? (
                  <div className="flex items-start gap-1.5 text-[11px] text-rose-300 bg-rose-500/10 p-2 rounded-xl">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      Notifications are blocked in your browser. You can still set this reminder to see it in your notes.
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Receive desktop notification when due?</span>
                    <button
                      type="button"
                      onClick={handleRequestPermission}
                      className="px-2.5 py-1 rounded-lg bg-[#9655F5] hover:bg-[#8338EC] text-white text-[11px] font-bold transition-all"
                    >
                      Allow Alerts
                    </button>
                  </div>
                )}

                {permMessage && permStatus !== 'denied' && (
                  <p className="text-[10px] text-slate-400">{permMessage}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between shrink-0 bg-[#161826]">
          {/* Delete button (if editing existing note) */}
          {noteToEdit && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete(noteToEdit.id);
                onClose();
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          ) : (
            <div />
          )}

          {/* Done / Save Button */}
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-5 py-2 rounded-2xl bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-black shadow-neon-sm active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

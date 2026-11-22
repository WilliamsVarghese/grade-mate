import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Pin,
  Bell,
  Calendar,
  Clock,
  Tag,
  Check,
  AlertCircle,
  Save,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

const SUGGESTED_TAGS = [
  'Unit 1 Important Questions',
  'CAT 2 Revision',
  'Assignment 1',
  'OS Security Module 3',
  'Exam Preparation',
  'Formulas & Derivations',
  'Lab Practical',
];

export function NoteEditorModal({
  isOpen,
  onClose,
  onSave,
  noteToEdit = null,
  subject = null,
  semester = null,
  defaultWithReminder = false,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Optional Reminder states
  const [hasReminder, setHasReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  // Notification permission state
  const [permStatus, setPermStatus] = useState(() => notificationService.getPermission());
  const [permMessage, setPermMessage] = useState(null);

  // Autosave status
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'draft'
  const draftKey = useRef('');

  // Get current date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isOpen) return;

    setPermStatus(notificationService.getPermission());
    setPermMessage(null);

    const subjectId = noteToEdit?.subjectId || subject?.id || 'general';
    draftKey.current = `grademate_draft_${subjectId}_${noteToEdit?.id || 'new'}`;

    if (noteToEdit) {
      setTitle(noteToEdit.title || '');
      setContent(noteToEdit.content || '');
      setTags(noteToEdit.tags || []);
      setIsPinned(!!noteToEdit.isPinned);

      if (noteToEdit.hasReminder && noteToEdit.reminder) {
        setHasReminder(true);
        setReminderDate(noteToEdit.reminder.date || todayStr);
        setReminderTime(noteToEdit.reminder.time || '18:00');
        setNotificationTitle(noteToEdit.reminder.notificationTitle || noteToEdit.title || '');
        setNotificationMessage(noteToEdit.reminder.notificationMessage || '');
      } else {
        setHasReminder(false);
        setReminderDate(todayStr);
        setReminderTime('18:00');
        setNotificationTitle('');
        setNotificationMessage('');
      }
    } else {
      // Check for autosaved draft if creating a new note
      const savedDraft = localStorage.getItem(draftKey.current);
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setContent(parsed.content || '');
          setTags(parsed.tags || []);
          setIsPinned(!!parsed.isPinned);
        } catch {
          setTitle('');
          setContent('');
          setTags([]);
          setIsPinned(false);
        }
      } else {
        setTitle('');
        setContent('');
        setTags([]);
        setIsPinned(false);
      }

      if (defaultWithReminder) {
        setHasReminder(true);
        setReminderDate(todayStr);
        setReminderTime('19:00');
        setNotificationTitle('');
        setNotificationMessage(
          subject ? `Revise notes for ${subject.name}` : 'Study note revision reminder'
        );
      } else {
        setHasReminder(false);
        setReminderDate(todayStr);
        setReminderTime('18:00');
        setNotificationTitle('');
        setNotificationMessage('');
      }
    }
    setSaveStatus('saved');
  }, [isOpen, noteToEdit, subject, defaultWithReminder, todayStr]);

  // Autosave draft while typing
  useEffect(() => {
    if (!isOpen) return;
    setSaveStatus('draft');

    const timer = setTimeout(() => {
      if (draftKey.current) {
        const draftData = {
          title,
          content,
          tags,
          isPinned,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(draftKey.current, JSON.stringify(draftData));
        setSaveStatus('saved');
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [title, content, tags, isPinned, isOpen]);

  // Request browser notification permission only when explicitly requested
  const handleRequestPermission = async () => {
    const result = await notificationService.requestPermission();
    setPermStatus(result.status);
    setPermMessage(result.message);
  };

  const handleAddTag = (tagToAdd) => {
    const clean = (tagToAdd || tagInput).trim();
    if (!clean) return;
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a note title.');
      return;
    }

    const targetSubject = subject || (noteToEdit ? {
      id: noteToEdit.subjectId,
      name: noteToEdit.subjectName,
      code: noteToEdit.subjectCode,
    } : null);

    const notePayload = {
      ...(noteToEdit || {}),
      subjectId: targetSubject?.id || noteToEdit?.subjectId || 'general',
      subjectName: targetSubject?.name || noteToEdit?.subjectName || 'General Note',
      subjectCode: targetSubject?.code || noteToEdit?.subjectCode || '',
      semesterId: semester?.id || noteToEdit?.semesterId || 'sem-5',
      title: title.trim(),
      content: content.trim(),
      tags,
      isPinned,
      hasReminder,
    };

    if (hasReminder) {
      notePayload.reminder = {
        ...(noteToEdit?.reminder || {}),
        id: noteToEdit?.reminder?.id || `rem-${Date.now()}`,
        date: reminderDate || todayStr,
        time: reminderTime || '18:00',
        notificationTitle: notificationTitle.trim() || title.trim(),
        notificationMessage:
          notificationMessage.trim() ||
          `Revise "${title.trim()}" for ${targetSubject?.name || 'your subject'}.`,
        isCompleted: noteToEdit?.reminder?.isCompleted || false,
        notified: false,
      };
    } else {
      notePayload.reminder = null;
    }

    // Clear draft on successful save
    if (draftKey.current) {
      localStorage.removeItem(draftKey.current);
    }

    onSave(notePayload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0F111A] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-[#131622]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#9AF04F] shadow-neon-sm" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {noteToEdit ? 'Edit Note' : 'Create New Note'}
              </h3>
              <p className="text-xs text-slate-400">
                {subject ? `${subject.name} (${subject.code || 'Core'})` : 'Student Academic Workspace'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Autosave status indicator */}
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
              <Save className="w-3 h-3 text-[#9AF04F]" />
              {saveStatus === 'saved' ? 'Autosaved' : 'Saving draft...'}
            </span>

            {/* Pin note button */}
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              className={`p-2 rounded-xl transition-all ${
                isPinned
                  ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm font-bold'
                  : 'bg-white/[0.06] text-slate-400 hover:text-white'
              }`}
              title={isPinned ? 'Pinned to top' : 'Pin note'}
            >
              <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.1] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar">
          {/* Note Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Note Title <span className="text-[#9AF04F]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Unit 1 Important Questions, CAT 2 Revision, OSPF Summary..."
              className="w-full px-4 py-2.5 rounded-2xl bg-[#171A27] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F] text-sm font-semibold transition-colors"
            />
          </div>

          {/* Tags Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Tags & Categorization
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] border border-[#9AF04F]/30"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder="Type tag and press Enter (e.g. Exam Prep, Module 2)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#171A27] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F] text-xs transition-colors"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-xs font-semibold text-white transition-colors"
              >
                Add Tag
              </button>
            </div>

            {/* Suggested Tags */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
              {SUGGESTED_TAGS.filter((st) => !tags.includes(st)).slice(0, 4).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleAddTag(st)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  + {st}
                </button>
              ))}
            </div>
          </div>

          {/* Multiline Text Content (Supports Long Content) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Note Content
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {content.length} characters • Multiline supported
              </span>
            </div>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study notes, formulas, important exam questions, summaries, or assignments here..."
              className="w-full p-4 rounded-2xl bg-[#171A27] border border-white/[0.08] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F] text-sm leading-relaxed custom-scrollbar font-normal transition-colors"
            />
          </div>

          {/* OPTIONAL REMINDERS AND NOTIFICATIONS SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#131622] border border-[#9655F5]/30 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#9655F5]/20 flex items-center justify-center text-[#C084FC]">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                    Schedule Reminder & Notification
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#9655F5]/20 text-[#C084FC]">
                      Optional
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Get an alert to review these notes before exams or deadlines
                  </p>
                </div>
              </div>

              {/* Toggle switch for reminder */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReminder}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasReminder(checked);
                    if (checked && !notificationTitle) {
                      setNotificationTitle(title || (subject ? `${subject.name} Revision` : 'Study Reminder'));
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9655F5]"></div>
              </label>
            </div>

            {/* Expanded Reminder Controls (When hasReminder is true) */}
            {hasReminder && (
              <div className="pt-3 border-t border-white/[0.08] space-y-3.5 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Reminder Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        min={todayStr}
                        value={reminderDate}
                        onChange={(e) => setReminderDate(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#171A27] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#9655F5]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Reminder Time
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#171A27] border border-white/[0.1] text-white text-xs focus:outline-none focus:border-[#9655F5]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder={title || 'Computer Networks – OSPF Revision'}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#171A27] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#9655F5]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Notification Message
                  </label>
                  <input
                    type="text"
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    placeholder="e.g. Revise OSPF routing notes for Computer Networks."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#171A27] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#9655F5]"
                  />
                </div>

                {/* Browser Notification Status & Permission Request */}
                <div className="p-3 rounded-xl bg-[#171A27] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-[11px]">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      {permStatus === 'granted' ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#9AF04F]" />
                          Browser Notifications: <span className="text-[#9AF04F]">Enabled</span>
                        </>
                      ) : permStatus === 'denied' ? (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                          Browser Notifications: <span className="text-rose-400">Blocked in Browser</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-[#C084FC]" />
                          Browser Notifications: <span className="text-slate-400">Not Enabled Yet</span>
                        </>
                      )}
                    </div>
                    {permMessage && (
                      <p className="text-[10px] text-slate-400 mt-0.5">{permMessage}</p>
                    )}
                  </div>

                  {permStatus !== 'granted' && (
                    <button
                      type="button"
                      onClick={handleRequestPermission}
                      className="px-3 py-1.5 rounded-lg bg-[#9655F5] hover:bg-[#8338EC] text-white text-[11px] font-bold transition-all shrink-0 active:scale-95"
                    >
                      Enable Browser Alerts
                    </button>
                  )}
                </div>

                {/* Honest Browser Limitation Statement */}
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[10px] text-slate-400 leading-normal">
                  <Info className="w-3.5 h-3.5 text-[#C084FC] shrink-0 mt-0.5" />
                  <span>
                    <strong>Browser Limitation:</strong> Web notifications trigger while GradeMate is open in your browser. Reliable scheduled notifications when your device is completely off or browser is closed require a native mobile app or backend push server.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-black shadow-neon-sm hover:shadow-neon-glow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 stroke-[2.5]" />
              {noteToEdit ? 'Save Changes' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Plus,
  Search,
  Pin,
  Bell,
  Calendar,
  Clock,
  Tag,
  Edit2,
  Trash2,
  Calculator,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Award,
  MoreVertical,
  Share2,
} from 'lucide-react';

export function SubjectDetailWorkspace({
  subject,
  semester,
  notes = [],
  onBack,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onTogglePin,
  onToggleReminderCompletion,
  onOpenReminderEdit,
  onDeleteReminder,
  onOpenInternalCalc,
  onOpenEndSemCalc,
  onEditSubject,
  initialTab = 'notes',
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'overview', 'notes', 'reminders'
  const [noteSearch, setNoteSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  // Subject notes
  const subjectNotes = useMemo(() => {
    return notes.filter((n) => n.subjectId === subject.id);
  }, [notes, subject.id]);

  // Subject reminders
  const subjectReminders = useMemo(() => {
    const list = [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    subjectNotes.forEach((n) => {
      if (n.hasReminder && n.reminder) {
        let status = 'upcoming';
        if (n.reminder.isCompleted) {
          status = 'completed';
        } else {
          const [hours, minutes] = (n.reminder.time || '00:00').split(':').map(Number);
          const remDate = new Date(n.reminder.date);
          remDate.setHours(hours || 0, minutes || 0, 0, 0);

          if (remDate < now) {
            status = 'overdue';
          } else if (n.reminder.date === todayStr) {
            status = 'today';
          }
        }

        list.push({
          ...n.reminder,
          noteId: n.id,
          noteTitle: n.title,
          noteTags: n.tags,
          status,
        });
      }
    });

    return list;
  }, [subjectNotes]);

  // Unique tags for this subject
  const subjectTags = useMemo(() => {
    const s = new Set();
    subjectNotes.forEach((n) => (n.tags || []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [subjectNotes]);

  // Filtered notes for Notes tab
  const filteredNotes = useMemo(() => {
    let list = [...subjectNotes];

    if (selectedTag) {
      list = list.filter((n) => (n.tags || []).includes(selectedTag));
    }

    if (noteSearch.trim()) {
      const q = noteSearch.toLowerCase();
      list = list.filter((n) => {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const contentMatch = (n.content || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // Pinned notes come first!
    list.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    });

    return list;
  }, [subjectNotes, selectedTag, noteSearch]);

  const isLowAttendance = subject.attendance !== undefined && Number(subject.attendance) < 75;
  const ciaMax = Number(subject.ciaMax) || 50;
  const ciaMarks = Number(subject.ciaMarks) || 0;
  const ciaPercent = ciaMax > 0 ? Math.round((ciaMarks / ciaMax) * 100) : 0;

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#9AF04F] transition-colors py-1 group self-start"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to {semester?.name || 'Semester'} Hub</span>
        </button>

        <div className="flex items-center gap-2">
          {onOpenInternalCalc && (
            <button
              type="button"
              onClick={() => onOpenInternalCalc(subject.id)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-slate-200 hover:text-[#9AF04F] transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Marks Calc</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onAddNote(subject)}
            className="px-4 py-1.5 rounded-xl bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-black shadow-neon-sm active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {/* Subject Header Card */}
      <div className="p-5 sm:p-7 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/[0.08] text-[#9AF04F]">
                {subject.code || 'CORE'}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-300">
                {subject.credits} Credits
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] border border-[#9AF04F]/30">
                {subject.track ? 'Minor' : subject.electiveTrack ? 'Elective' : 'Regular Core'}
              </span>
              <span className="text-xs font-medium text-slate-400">
                • {semester?.name || subject.semester}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {subject.name}
            </h1>
          </div>

          {/* Quick Academic Badges */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#171A27] border border-white/[0.06] text-center min-w-[85px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Grade
              </span>
              <span className="text-xl font-black text-[#9AF04F]">
                {subject.grade || '–'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#171A27] border border-white/[0.06] text-center min-w-[85px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                CIA Score
              </span>
              <span className="text-xl font-black text-white">
                {ciaMarks}
                <span className="text-xs text-slate-400 font-normal">/{ciaMax}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#171A27] border border-white/[0.06] text-center min-w-[85px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Attendance
              </span>
              <span
                className={`text-xl font-black ${
                  isLowAttendance ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {subject.attendance ?? '–'}%
              </span>
            </div>
          </div>
        </div>

        {/* 3 Workspace Tabs: Overview, Notes, Reminders */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/[0.06] overflow-x-auto">
          {[
            { id: 'notes', label: 'Notes', count: subjectNotes.length, icon: FileText },
            { id: 'reminders', label: 'Reminders', count: subjectReminders.length, icon: Bell },
            { id: 'overview', label: 'Overview', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  isActive
                    ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.2 rounded-full ${
                      isActive ? 'bg-[#0A0D06]/20 text-[#0A0D06] font-black' : 'bg-white/[0.08] text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Internal Marks (CIA) Card */}
            <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Continuous Internal Assessment
                </span>
                <span className="text-xs font-black text-[#9AF04F] font-mono">
                  {ciaPercent}%
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {ciaMarks} <span className="text-sm font-normal text-slate-400">/ {ciaMax}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-[#9AF04F] rounded-full transition-all"
                  style={{ width: `${ciaPercent}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                Calculated based on CAT 1, CAT 2, assignments, and attendance weightage.
              </p>
              {onOpenInternalCalc && (
                <button
                  type="button"
                  onClick={() => onOpenInternalCalc(subject.id)}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-bold text-[#9AF04F] transition-colors"
                >
                  Recalculate Internal Marks →
                </button>
              )}
            </div>

            {/* Attendance & Engagement Card */}
            <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attendance Record
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    isLowAttendance
                      ? 'bg-rose-500/20 text-rose-400'
                      : 'bg-[#9AF04F]/15 text-[#9AF04F]'
                  }`}
                >
                  {isLowAttendance ? 'Attendance Alert' : 'On Track'}
                </span>
              </div>
              <div className="text-3xl font-black text-white">
                {subject.attendance ?? '–'}%
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLowAttendance ? 'bg-rose-500' : 'bg-[#9AF04F]'
                  }`}
                  style={{ width: `${Math.min(100, Number(subject.attendance) || 0)}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {isLowAttendance
                  ? '⚠️ Attendance is below the mandatory 75% university eligibility requirement.'
                  : 'Eligible for university examination hall ticket.'}
              </p>
            </div>

            {/* Study Material & Workspace Activity */}
            <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Study Notes & Reminders
              </span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-2xl bg-[#171A27]">
                  <span className="text-2xl font-black text-[#9AF04F] block">
                    {subjectNotes.length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Saved Notes
                  </span>
                </div>
                <div className="p-2.5 rounded-2xl bg-[#171A27]">
                  <span className="text-2xl font-black text-[#C084FC] block">
                    {subjectReminders.length}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Reminders
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onAddNote(subject)}
                className="w-full py-2 px-3 rounded-xl bg-[#9AF04F]/15 hover:bg-[#9AF04F]/25 text-xs font-bold text-[#9AF04F] transition-colors"
              >
                + Create Note for {subject.name}
              </button>
            </div>
          </div>

          {/* Subject Meta Details Table */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
              Curriculum Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Course Code</span>
                <span className="font-mono font-bold text-white text-sm">{subject.code || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Academic Credits</span>
                <span className="font-bold text-white text-sm">{subject.credits} Credits</span>
              </div>
              <div>
                <span className="text-slate-500 block">Semester</span>
                <span className="font-bold text-white text-sm">{semester?.name || subject.semester}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="font-bold text-white text-sm">
                  {subject.track || subject.electiveTrack || 'Regular Core Subject'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Notes Toolbar: Search, Tag Filters, Add Note Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                placeholder={`Search notes in ${subject.code || 'this course'}...`}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#141624] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F]"
              />
            </div>

            <button
              type="button"
              onClick={() => onAddNote(subject)}
              className="px-4 py-2.5 rounded-2xl bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-black shadow-neon-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Note</span>
            </button>
          </div>

          {/* Tags Filter Chips */}
          {subjectTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedTag(null)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTag === null
                    ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                All Notes ({subjectNotes.length})
              </button>
              {subjectTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}

          {/* Notes Cards Grid */}
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.08] bg-[#11131B]/40">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">
                {noteSearch || selectedTag ? 'No matching notes' : `No notes for ${subject.name} yet`}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {noteSearch || selectedTag
                  ? 'Try clearing your search query or tag filter.'
                  : 'Take study notes, write formulas, record CAT questions, and optionally set revision reminders.'}
              </p>
              <button
                type="button"
                onClick={() => onAddNote(subject)}
                className="mt-4 px-4 py-2 rounded-full bg-[#9AF04F] text-[#0A0D06] text-xs font-black shadow-neon-sm hover:bg-[#8DE840] transition-colors"
              >
                Create First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNotes.map((note) => {
                const isPinned = note.isPinned;
                const hasRem = note.hasReminder && note.reminder;
                const isRemCompleted = hasRem && note.reminder.isCompleted;

                return (
                  <div
                    key={note.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between group ${
                      isPinned
                        ? 'bg-[#131625] border-[#9AF04F]/40 shadow-neon-sm'
                        : 'bg-[#11131B] border-white/[0.08] hover:border-white/[0.18]'
                    }`}
                  >
                    <div>
                      {/* Top Note Row: Pinned status, Tags, Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isPinned && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06] flex items-center gap-1 font-mono">
                              <Pin className="w-2.5 h-2.5 fill-current" />
                              PINNED
                            </span>
                          )}

                          {(note.tags || []).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>

                        {/* Top quick actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onTogglePin(note.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isPinned
                                ? 'text-[#9AF04F] hover:text-white'
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                            title={isPinned ? 'Unpin note' : 'Pin note to top'}
                          >
                            <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onEditNote(note.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors"
                            title="Edit note"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteNote(note.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Note Title */}
                      <h4
                        onClick={() => onEditNote(note.id)}
                        className="text-base font-bold text-white tracking-tight cursor-pointer hover:text-[#9AF04F] transition-colors mb-2"
                      >
                        {note.title}
                      </h4>

                      {/* Multiline Text Content (Pre-wrap preserves line breaks cleanly) */}
                      {note.content && (
                        <div
                          onClick={() => onEditNote(note.id)}
                          className="text-xs text-slate-300 leading-relaxed font-normal whitespace-pre-wrap line-clamp-6 mb-3 cursor-pointer hover:text-white transition-colors"
                        >
                          {note.content}
                        </div>
                      )}
                    </div>

                    {/* Bottom Metadata & Reminder Pill */}
                    <div className="pt-3 border-t border-white/[0.04] space-y-2">
                      {/* Attached Reminder (if enabled) */}
                      {hasRem && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-[#9655F5]/10 border border-[#9655F5]/25 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <Bell className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
                            <div className="min-w-0">
                              <span
                                className={`text-[11px] font-bold block truncate ${
                                  isRemCompleted ? 'line-through text-slate-400' : 'text-white'
                                }`}
                              >
                                {note.reminder.date} • {note.reminder.time}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => onToggleReminderCompletion(note.id)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                                isRemCompleted
                                  ? 'bg-[#9AF04F] text-[#0A0D06]'
                                  : 'bg-white/[0.08] text-slate-300 hover:text-white'
                              }`}
                            >
                              {isRemCompleted ? 'Done' : 'Mark Done'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Date details */}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        <span>Edited: {formatDate(note.updatedAt || note.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REMINDERS */}
      {activeTab === 'reminders' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Scheduled Reminders for {subject.name}
              </h3>
              <p className="text-xs text-slate-400">
                Study sessions, CAT revision alerts, and assignment due dates.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpenReminderEdit(subject)}
              className="px-4 py-2 rounded-2xl bg-[#9655F5] hover:bg-[#8338EC] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Add Reminder</span>
            </button>
          </div>

          {subjectReminders.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.08] bg-[#11131B]/40">
              <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-white">No reminders set for this subject</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                You can attach an optional reminder to any note when creating or editing it.
              </p>
              <button
                type="button"
                onClick={() => onOpenReminderEdit(subject)}
                className="mt-4 px-4 py-2 rounded-full bg-[#9AF04F] text-[#0A0D06] text-xs font-black shadow-neon-sm hover:bg-[#8DE840]"
              >
                Schedule First Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {subjectReminders.map((rem) => {
                const isCompleted = rem.isCompleted;

                return (
                  <div
                    key={rem.id || rem.noteId}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      isCompleted
                        ? 'bg-[#11131B]/60 border-white/[0.04] opacity-70'
                        : 'bg-[#11131B] border-white/[0.08] hover:border-[#9655F5]/40'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onToggleReminderCompletion(rem.noteId)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                          isCompleted
                            ? 'bg-[#9AF04F] border-[#9AF04F] text-[#0A0D06]'
                            : 'border-white/[0.2] hover:border-[#9AF04F] bg-white/[0.04]'
                        }`}
                      >
                        {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              rem.status === 'overdue'
                                ? 'bg-rose-500/20 text-rose-300'
                                : rem.status === 'today'
                                ? 'bg-[#9AF04F]/20 text-[#9AF04F]'
                                : 'bg-[#9655F5]/20 text-[#C084FC]'
                            }`}
                          >
                            {rem.status.toUpperCase()}
                          </span>
                        </div>

                        <h4
                          onClick={() => onEditNote(rem.noteId)}
                          className={`text-sm font-bold tracking-tight cursor-pointer hover:text-[#9AF04F] transition-colors ${
                            isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {rem.noteTitle}
                        </h4>

                        {rem.notificationMessage && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            "{rem.notificationMessage}"
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-500" />
                            {rem.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            {rem.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onEditNote(rem.noteId)}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-slate-200 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteReminder(rem.noteId)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Check,
  Trash2,
  Edit2,
  ExternalLink,
  Plus,
  Info,
  Sparkles,
  Search,
  Filter,
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export function ReminderDashboard({
  reminders = [],
  onToggleComplete,
  onEditNote,
  onDeleteReminder,
  onAddNewReminder,
  onOpenSubjectNotes,
}) {
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'today', 'upcoming', 'overdue', 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [permStatus, setPermStatus] = useState(() => notificationService.getPermission());
  const [permMessage, setPermMessage] = useState(null);

  const handleRequestPermission = async () => {
    const res = await notificationService.requestPermission();
    setPermStatus(res.status);
    setPermMessage(res.message);
  };

  const handleTestNotification = () => {
    notificationService.sendNotification('GradeMate Reminder Test', {
      body: 'Your browser notifications and audio chime are working perfectly!',
      tag: 'grademate-test-' + Date.now(),
    });
  };

  // Group counts
  const todayCount = reminders.filter((r) => r.status === 'today').length;
  const upcomingCount = reminders.filter((r) => r.status === 'upcoming').length;
  const overdueCount = reminders.filter((r) => r.status === 'overdue').length;
  const completedCount = reminders.filter((r) => r.status === 'completed').length;

  const filteredReminders = reminders.filter((rem) => {
    // Filter by tab
    if (filterTab === 'today' && rem.status !== 'today') return false;
    if (filterTab === 'upcoming' && rem.status !== 'upcoming') return false;
    if (filterTab === 'overdue' && rem.status !== 'overdue') return false;
    if (filterTab === 'completed' && rem.status !== 'completed') return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (rem.noteTitle || '').toLowerCase().includes(q);
      const matchSubject = (rem.subjectName || '').toLowerCase().includes(q);
      const matchMsg = (rem.notificationMessage || '').toLowerCase().includes(q);
      const matchCode = (rem.subjectCode || '').toLowerCase().includes(q);
      return matchTitle || matchSubject || matchMsg || matchCode;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification Permission Status */}
      <div className="p-5 rounded-3xl bg-[#11131B] border border-white/[0.08] shadow-card-dark flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#9655F5]/15 border border-[#9655F5]/30 flex items-center justify-center text-[#C084FC] shrink-0">
            <Bell className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Academic Reminder Hub
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#9655F5]/20 text-[#C084FC]">
                {reminders.length} Active & Past
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Scheduled revision sessions, CAT prep, and coursework deadlines.
            </p>
          </div>
        </div>

        {/* Browser Notification Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {permStatus === 'granted' ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] border border-[#9AF04F]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Browser Alerts Active
              </span>
              <button
                type="button"
                onClick={handleTestNotification}
                className="text-xs px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors"
                title="Play test notification and chime"
              >
                Test Sound & Alert
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="px-4 py-2 rounded-full bg-[#9655F5] hover:bg-[#8338EC] text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5" />
              Enable Browser Notifications
            </button>
          )}

          {onAddNewReminder && (
            <button
              type="button"
              onClick={onAddNewReminder}
              className="px-4 py-2 rounded-full bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] text-xs font-black shadow-neon-sm active:scale-95 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              New Reminder
            </button>
          )}
        </div>
      </div>

      {permMessage && (
        <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 flex items-center justify-between">
          <span>{permMessage}</span>
          <button
            type="button"
            onClick={() => setPermMessage(null)}
            className="text-slate-500 hover:text-white text-sm ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* 4 Category Pill Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => setFilterTab(filterTab === 'today' ? 'all' : 'today')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterTab === 'today'
              ? 'bg-[#9AF04F]/10 border-[#9AF04F] shadow-neon-sm'
              : 'bg-[#11131B] border-white/[0.06] hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Today's Reminders
            </span>
            <span className="w-2 h-2 rounded-full bg-[#9AF04F]" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#9AF04F] block">
            {todayCount}
          </span>
          <span className="text-[11px] text-slate-500">Scheduled for today</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab(filterTab === 'upcoming' ? 'all' : 'upcoming')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterTab === 'upcoming'
              ? 'bg-[#9655F5]/15 border-[#9655F5] shadow-sm'
              : 'bg-[#11131B] border-white/[0.06] hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Upcoming
            </span>
            <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-[#C084FC] block">
            {upcomingCount}
          </span>
          <span className="text-[11px] text-slate-500">Future scheduled dates</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab(filterTab === 'overdue' ? 'all' : 'overdue')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterTab === 'overdue'
              ? 'bg-rose-500/15 border-rose-500 shadow-sm'
              : 'bg-[#11131B] border-white/[0.06] hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Overdue
            </span>
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-rose-400 block">
            {overdueCount}
          </span>
          <span className="text-[11px] text-slate-500">Passed scheduled time</span>
        </button>

        <button
          type="button"
          onClick={() => setFilterTab(filterTab === 'completed' ? 'all' : 'completed')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            filterTab === 'completed'
              ? 'bg-white/[0.08] border-white/40 shadow-sm'
              : 'bg-[#11131B] border-white/[0.06] hover:border-white/[0.15]'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Completed
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-300 block">
            {completedCount}
          </span>
          <span className="text-[11px] text-slate-500">Marked as finished</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#131520] border border-white/[0.06] overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Reminders', count: reminders.length },
            { id: 'today', label: 'Today', count: todayCount },
            { id: 'upcoming', label: 'Upcoming', count: upcomingCount },
            { id: 'overdue', label: 'Overdue', count: overdueCount },
            { id: 'completed', label: 'Completed', count: completedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                filterTab === tab.id
                  ? 'bg-white/[0.12] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/40 text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reminders or subjects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131520] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#9655F5]"
          />
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-white/[0.08] bg-[#11131B]/40">
          <Bell className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">
            {searchQuery
              ? 'No matching reminders found'
              : filterTab !== 'all'
              ? `No ${filterTab} reminders`
              : 'No reminders scheduled'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search keywords.'
              : 'Create or edit any note to attach an optional scheduled reminder with notification.'}
          </p>
          {onAddNewReminder && (
            <button
              type="button"
              onClick={onAddNewReminder}
              className="mt-4 px-4 py-2 rounded-full bg-[#9AF04F] text-[#0A0D06] text-xs font-black shadow-neon-sm hover:bg-[#8DE840] transition-colors"
            >
              Create First Reminder
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReminders.map((rem) => {
            const isCompleted = rem.isCompleted;
            let statusBadge = null;

            if (isCompleted) {
              statusBadge = (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/[0.06] text-slate-400">
                  Completed
                </span>
              );
            } else if (rem.status === 'overdue') {
              statusBadge = (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Overdue
                </span>
              );
            } else if (rem.status === 'today') {
              statusBadge = (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#9AF04F]/20 text-[#9AF04F] border border-[#9AF04F]/30 animate-pulse">
                  Today
                </span>
              );
            } else {
              statusBadge = (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#9655F5]/20 text-[#C084FC] border border-[#9655F5]/30">
                  Upcoming
                </span>
              );
            }

            return (
              <div
                key={rem.id || rem.noteId}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-[#11131B]/60 border-white/[0.04] opacity-70'
                    : rem.status === 'overdue'
                    ? 'bg-[#14121A] border-rose-500/30'
                    : rem.status === 'today'
                    ? 'bg-[#12161A] border-[#9AF04F]/30 shadow-neon-sm'
                    : 'bg-[#11131B] border-white/[0.08] hover:border-[#9655F5]/40'
                }`}
              >
                {/* Left: Complete Checkbox & Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Mark complete toggle checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggleComplete(rem.noteId)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isCompleted
                        ? 'bg-[#9AF04F] border-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                        : 'border-white/[0.2] hover:border-[#9AF04F] bg-white/[0.04]'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    {/* Meta row: Subject & Status */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-slate-300 bg-white/[0.06] px-2 py-0.5 rounded-md">
                        {rem.subjectCode || 'SUBJECT'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {rem.subjectName}
                      </span>
                      {statusBadge}
                    </div>

                    {/* Note Title */}
                    <h4
                      onClick={() => onEditNote && onEditNote(rem.noteId)}
                      className={`text-sm sm:text-base font-bold tracking-tight cursor-pointer hover:text-[#9AF04F] transition-colors line-clamp-1 ${
                        isCompleted ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {rem.noteTitle}
                    </h4>

                    {/* Notification message if custom */}
                    {rem.notificationMessage && (
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        "{rem.notificationMessage}"
                      </p>
                    )}

                    {/* Date and Time */}
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2 flex-wrap">
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

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {onEditNote && (
                    <button
                      type="button"
                      onClick={() => onEditNote(rem.noteId)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit Note</span>
                    </button>
                  )}

                  {onOpenSubjectNotes && (
                    <button
                      type="button"
                      onClick={() => onOpenSubjectNotes(rem.subjectId)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
                      title="Open Subject Workspace"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  )}

                  {onDeleteReminder && (
                    <button
                      type="button"
                      onClick={() => onDeleteReminder(rem.noteId)}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Honest Browser Notification Disclaimer Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#11131B]/80 border border-white/[0.06] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#9655F5]/15 flex items-center justify-center text-[#C084FC] shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <h4 className="font-bold text-slate-200">
            Important Note on Browser Notifications & Offline Privacy
          </h4>
          <p className="leading-relaxed">
            GradeMate is an autonomous frontend student workstation that securely saves your notes and marks in your browser's LocalStorage. Browser notifications trigger while GradeMate remains open in a background tab. Reliable push notifications when your device is powered off or browser is closed require a backend notification server or native app.
          </p>
        </div>
      </div>
    </div>
  );
}

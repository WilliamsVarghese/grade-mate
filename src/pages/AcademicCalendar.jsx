import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
  Search,
  BookOpen,
  Sparkles,
  AlertCircle,
  FileText,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CATEGORIES = [
  { id: 'all', label: 'All Events' },
  { id: 'exam', label: 'Exams & CATs', color: 'neon' },
  { id: 'assignment', label: 'Assignments', color: 'purple' },
  { id: 'review', label: 'Labs & Reviews', color: 'peach' },
  { id: 'milestone', label: 'Milestones & Holidays', color: 'blue' },
];

export function AcademicCalendar() {
  const { exams, addExam, updateExam, deleteExam, allSubjects, selectedSemester } = useAcademic();

  // Current view date (year & month)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  // Selected date for filtering timeline (e.g. '2026-11-25')
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  // Active category filter
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Event modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    type: 'Internal Assessment / CAT',
    category: 'exam',
    date: '',
    time: '10:00 AM - 12:00 PM',
    venue: '',
    syllabus: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Today string in YYYY-MM-DD format
  const todayStr = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

  // Format month and year label (e.g. "November 2026")
  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [currentDate]);

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateStr(todayStr);
  };

  // Calendar matrix calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNum,
        dateStr,
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: true,
      });
    }

    // Leading days from next month to complete row multiples of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Group events by date string (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    exams.forEach((item) => {
      const d = item.date;
      if (!d) return;
      if (!map[d]) map[d] = [];
      map[d].push(item);
    });
    return map;
  }, [exams]);

  // Next upcoming major event
  const nextEvent = useMemo(() => {
    const upcoming = exams
      .filter((e) => e.date && !e.isCompleted && e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return upcoming[0] || null;
  }, [exams, todayStr]);

  // Days left calculation
  const getDaysDiff = (targetDateStr) => {
    if (!targetDateStr) return '';
    const now = new Date(todayStr + 'T00:00:00');
    const target = new Date(targetDateStr + 'T00:00:00');
    const diffTime = target - now;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `In ${diffDays} days`;
  };

  // Filtered events list
  const filteredEvents = useMemo(() => {
    return exams.filter((e) => {
      // Date filter
      if (selectedDateStr && e.date !== selectedDateStr) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const cat = e.category || (e.type?.toLowerCase().includes('assignment') ? 'assignment' : 'exam');
        if (selectedCategory === 'milestone') {
          if (cat !== 'milestone' && cat !== 'holiday') return false;
        } else if (cat !== selectedCategory) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const subMatch = (e.subject || '').toLowerCase().includes(q);
        const typeMatch = (e.type || '').toLowerCase().includes(q);
        const venueMatch = (e.venue || '').toLowerCase().includes(q);
        const sylMatch = (e.syllabus || '').toLowerCase().includes(q);
        return subMatch || typeMatch || venueMatch || sylMatch;
      }

      return true;
    }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [exams, selectedDateStr, selectedCategory, searchQuery]);

  // Open modal to add a new event
  const handleOpenAdd = (preferredDate = null) => {
    setEditingEvent(null);
    setFormData({
      subject: allSubjects[0]?.name ? `${allSubjects[0].name} (${allSubjects[0].code})` : '',
      type: 'Internal Assessment / CAT',
      category: 'exam',
      date: preferredDate || selectedDateStr || todayStr,
      time: '10:00 AM - 12:00 PM',
      venue: 'Exam Hall B-204',
      syllabus: '',
    });
    setModalOpen(true);
  };

  // Open modal to edit existing event
  const handleOpenEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      subject: event.subject || '',
      type: event.type || 'Internal Assessment',
      category: event.category || 'exam',
      date: event.date || todayStr,
      time: event.time || '10:00 AM - 12:00 PM',
      venue: event.venue || '',
      syllabus: event.syllabus || '',
    });
    setModalOpen(true);
  };

  // Submit modal form
  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    if (editingEvent) {
      updateExam(editingEvent.id, formData);
    } else {
      addExam(formData);
    }
    setModalOpen(false);
  };

  // Toggle completion
  const handleToggleComplete = (event) => {
    updateExam(event.id, { isCompleted: !event.isCompleted });
  };

  // Category badge styling helper
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'assignment':
        return 'bg-purple-100 dark:bg-[#9655F5]/20 text-purple-700 dark:text-[#C084FC] border-purple-300 dark:border-[#9655F5]/30';
      case 'review':
        return 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30';
      case 'holiday':
        return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/30';
      case 'milestone':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/30';
      default:
        return 'bg-emerald-100 dark:bg-[#9AF04F]/15 text-emerald-900 dark:text-[#9AF04F] border-emerald-300 dark:border-[#9AF04F]/30';
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* 1. Header with Title & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
              Academic Timetable & Deadlines
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Semester Schedule Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track exam schedules, assignment due dates, lab vivas, university milestones, and holidays.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button
            variant="dark"
            size="sm"
            onClick={handleJumpToToday}
            icon={CalendarIcon}
          >
            Today
          </Button>
          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={() => handleOpenAdd(selectedDateStr || todayStr)}
          >
            Add Academic Event
          </Button>
        </div>
      </div>

      {/* 2. Hero Countdown / Next Major Deadline Widget */}
      {nextEvent && (
        <div className="p-5 sm:p-6 rounded-3xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow relative overflow-hidden transition-all duration-300">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0A0D06] text-[#9AF04F]">
                  Next Deadline • {getDaysDiff(nextEvent.date)}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/10">
                  {nextEvent.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0A0D06]">
                {nextEvent.subject}
              </h2>
              <div className="flex items-center gap-3 text-xs font-bold text-[#0A0D06]/80 flex-wrap">
                <span>{nextEvent.type}</span>
                {nextEvent.time && <span>• {nextEvent.time}</span>}
                {nextEvent.venue && <span>• {nextEvent.venue}</span>}
              </div>
              {nextEvent.syllabus && (
                <p className="text-xs text-[#0A0D06]/90 font-medium max-w-2xl pt-1">
                  Topics: {nextEvent.syllabus}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggleComplete(nextEvent)}
                className="px-4 py-2 rounded-2xl bg-[#0A0D06] hover:bg-[#1A2010] text-[#9AF04F] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Completed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Metric Badges Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#11131B] border border-slate-200 dark:border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Total Scheduled
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">
            {exams.length} <span className="text-xs font-normal text-slate-400">Events</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#11131B] border border-slate-200 dark:border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Upcoming Exams
          </span>
          <p className="text-2xl font-black text-emerald-600 dark:text-[#9AF04F] mt-0.5">
            {exams.filter((e) => !e.isCompleted && (e.category === 'exam' || e.type?.toLowerCase().includes('exam') || e.type?.toLowerCase().includes('assessment'))).length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#11131B] border border-slate-200 dark:border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Assignments & Tasks
          </span>
          <p className="text-2xl font-black text-purple-600 dark:text-[#C084FC] mt-0.5">
            {exams.filter((e) => !e.isCompleted && (e.category === 'assignment' || e.type?.toLowerCase().includes('assignment'))).length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#11131B] border border-slate-200 dark:border-white/[0.06] shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            Completed
          </span>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-0.5">
            {exams.filter((e) => e.isCompleted).length}
          </p>
        </div>
      </div>

      {/* 4. Interactive Monthly Calendar Card */}
      <Card
        title="Monthly Examination & Event Grid"
        subtitle="Click any date to see scheduled evaluations or double-click to add a new event."
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 dark:text-white min-w-[120px] text-center">
              {monthYearLabel}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center">
            {DAYS_OF_WEEK.map((d, idx) => (
              <div
                key={d}
                className={`py-2 text-[11px] font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6
                    ? 'text-rose-500/80 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              const cellEvents = eventsByDate[cell.dateStr] || [];
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;
              const hasEvents = cellEvents.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (selectedDateStr === cell.dateStr) {
                      setSelectedDateStr(null); // Toggle unselect
                    } else {
                      setSelectedDateStr(cell.dateStr);
                    }
                  }}
                  onDoubleClick={() => handleOpenAdd(cell.dateStr)}
                  className={`min-h-[56px] sm:min-h-[72px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-[#9AF04F] bg-[#9AF04F]/10 ring-2 ring-[#9AF04F]/40 shadow-neon-sm'
                      : isToday
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : cell.isCurrentMonth
                      ? 'border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#141724] hover:border-slate-300 dark:hover:border-white/[0.15]'
                      : 'border-transparent bg-slate-50/50 dark:bg-white/[0.01] opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#9AF04F] text-[#0A0D06] font-black'
                          : cell.isCurrentMonth
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Quick Add indicator on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenAdd(cell.dateStr);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-500 transition-opacity hidden sm:block"
                      title="Add event on this date"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Event indicator badges / dots */}
                  {hasEvents && (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {cellEvents.slice(0, 3).map((ev) => (
                        <span
                          key={ev.id}
                          className={`w-2 h-2 rounded-full ${
                            ev.isCompleted
                              ? 'bg-slate-400'
                              : ev.category === 'assignment'
                              ? 'bg-purple-500'
                              : ev.category === 'holiday'
                              ? 'bg-rose-500'
                              : ev.category === 'review'
                              ? 'bg-amber-500'
                              : 'bg-[#9AF04F]'
                          }`}
                          title={`${ev.subject} (${ev.type})`}
                        />
                      ))}
                      {cellEvents.length > 3 && (
                        <span className="text-[9px] font-bold text-slate-500 font-mono">
                          +{cellEvents.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* 5. Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                    : 'bg-white dark:bg-[#141724] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search timetable..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-8 py-2 rounded-2xl bg-white dark:bg-[#141724] border border-slate-200 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#9AF04F]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 6. Active Date Filter Indicator (if any) */}
      {selectedDateStr && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-[#9AF04F]/10 border border-emerald-200 dark:border-[#9AF04F]/20 text-xs text-emerald-900 dark:text-[#9AF04F] font-bold">
          <span className="flex items-center gap-1.5">
            <CalendarIcon className="w-4 h-4" />
            Filtering events for date: {selectedDateStr} ({getDaysDiff(selectedDateStr)})
          </span>
          <button
            type="button"
            onClick={() => setSelectedDateStr(null)}
            className="underline hover:text-emerald-700 dark:hover:text-white text-xs font-extrabold"
          >
            Show All Dates
          </button>
        </div>
      )}

      {/* 7. Timeline List of Scheduled Events */}
      <div className="space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-white/[0.1] bg-white/40 dark:bg-[#11131B]/40 max-w-md mx-auto my-6">
            <CalendarIcon className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery || selectedDateStr
                ? 'No matching events found'
                : 'No academic events scheduled'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
              {searchQuery || selectedDateStr
                ? 'Try clearing the search or date filter to see other events.'
                : 'Add series tests, assignments, review dates or university exam schedules.'}
            </p>
            <Button
              variant="neon"
              size="sm"
              icon={Plus}
              onClick={() => handleOpenAdd(selectedDateStr || todayStr)}
            >
              Schedule Event
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEvents.map((item) => {
              const isPast = item.date && item.date < todayStr && !item.isCompleted;
              const dateObj = item.date ? new Date(item.date + 'T00:00:00') : null;
              const monthShort = dateObj
                ? dateObj.toLocaleDateString('en-US', { month: 'short' })
                : 'DATE';
              const dayNum = dateObj ? dateObj.getDate() : '--';

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex items-start gap-4 ${
                    item.isCompleted
                      ? 'bg-slate-50/70 dark:bg-white/[0.02] border-slate-200 dark:border-white/[0.04] opacity-70'
                      : 'bg-white dark:bg-[#11131B] border-slate-200 dark:border-white/[0.07] hover:border-[#9AF04F]/50 shadow-sm dark:shadow-card-dark'
                  }`}
                >
                  {/* Left Calendar Date Block */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                      item.isCompleted
                        ? 'bg-slate-100 dark:bg-white/[0.04] border-slate-200 dark:border-white/[0.06] text-slate-400'
                        : 'bg-emerald-50 dark:bg-[#9AF04F]/10 border-emerald-200 dark:border-[#9AF04F]/25 text-emerald-800 dark:text-[#9AF04F]'
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase leading-none tracking-wider">
                      {monthShort}
                    </span>
                    <span className="text-lg font-black leading-none mt-1 text-slate-900 dark:text-white">
                      {dayNum}
                    </span>
                  </div>

                  {/* Center Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryStyles(
                          item.category
                        )}`}
                      >
                        {item.type || 'Evaluation'}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.isCompleted
                            ? 'bg-slate-100 dark:bg-white/[0.06] text-slate-500'
                            : isPast
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {item.isCompleted
                          ? 'Done'
                          : getDaysDiff(item.date)}
                      </span>
                    </div>

                    <h4
                      className={`text-sm sm:text-base font-bold truncate ${
                        item.isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                      title={item.subject}
                    >
                      {item.subject}
                    </h4>

                    {/* Time & Venue meta */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex-wrap">
                      {item.time && (
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-[#9AF04F]" />
                          {item.time}
                        </span>
                      )}
                      {item.venue && (
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {item.venue}
                        </span>
                      )}
                    </div>

                    {/* Syllabus / Notes */}
                    {item.syllabus && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.syllabus}
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-center gap-1 shrink-0 -mr-1">
                    <button
                      type="button"
                      onClick={() => handleToggleComplete(item)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        item.isCompleted
                          ? 'text-emerald-600 dark:text-[#9AF04F] bg-emerald-500/10 hover:bg-emerald-500/20'
                          : 'text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                      }`}
                      title={item.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                      title="Edit Event"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteExam(item.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 8. Add / Edit Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingEvent ? 'Edit Academic Event' : 'Schedule Academic Event'}
        subtitle="Schedule internal examinations, university tests, deadlines, or project presentations."
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <Input
            label="Event / Exam Title or Course"
            placeholder="e.g. Internal Assessment 2 – Machine Learning"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm py-2.5 px-4 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F]"
              >
                <option value="exam">Internal Assessment / Exam</option>
                <option value="assignment">Assignment Submission</option>
                <option value="review">Lab / Project Review</option>
                <option value="milestone">Academic Milestone</option>
                <option value="holiday">Holiday / Vacation</option>
              </select>
            </div>

            <Input
              label="Evaluation Type / Tag"
              placeholder="e.g. Series Test 2 / Viva"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <Input
              label="Time"
              placeholder="e.g. 10:00 AM - 12:00 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            />
          </div>

          <Input
            label="Venue / Classroom / Link"
            placeholder="e.g. Exam Hall B-204 / Seminar Hall"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Syllabus / Notes / Topics
            </label>
            <textarea
              rows={3}
              placeholder="Enter covered modules, topics to revise, or submission instructions..."
              value={formData.syllabus}
              onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
              className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm p-3.5 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/[0.06]">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="neon" size="sm" type="submit">
              {editingEvent ? 'Save Changes' : 'Schedule Event'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AcademicCalendar;

import React, { useState, useEffect, useMemo } from 'react';
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
  Bell,
  BookOpen,
  X,
  AlertCircle
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { notificationService } from '../services/notificationService';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const INITIAL_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'Assignment 2 – Turing Machines & Complexity',
    subject: 'Formal Languages & Automata (CS303)',
    dueDate: '2026-11-24',
    dueTime: '11:59 PM',
    hasReminder: true,
    reminderDate: '2026-11-24',
    reminderTime: '18:00',
    isCompleted: false,
    notes: 'Solve problems 1 through 8 from Module 4 and upload PDF.',
  },
  {
    id: 'asg-2',
    title: 'Buffer Overflow Vulnerability Audit Report',
    subject: 'Operating System Security (PE-CS411)',
    dueDate: '2026-11-29',
    dueTime: '05:00 PM',
    hasReminder: true,
    reminderDate: '2026-11-29',
    reminderTime: '09:00',
    isCompleted: false,
    notes: 'Document exploit demonstration and defensive countermeasures.',
  },
  {
    id: 'asg-3',
    title: 'Mini Project Phase 1 Architecture Diagram',
    subject: 'Mini Project (CS333)',
    dueDate: '2026-12-02',
    dueTime: '10:00 AM',
    hasReminder: false,
    reminderDate: '',
    reminderTime: '',
    isCompleted: false,
    notes: 'Submit system block diagram and database schema.',
  },
];

export function AcademicCalendar() {
  const { exams, addExam, updateExam, deleteExam, allSubjects } = useAcademic();

  // 1. Calendar View Month & Selected Date
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(null);

  // 2. Assignments state with LocalStorage
  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('grademate_assignments_v1');
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('grademate_assignments_v1', JSON.stringify(assignments));
    } catch (e) {
      console.error('Failed to save assignments:', e);
    }
  }, [assignments]);

  // Periodic reminder checker for assignments
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const nowTime = `${hours}:${mins}`;

      assignments.forEach((asg) => {
        if (asg.hasReminder && !asg.isCompleted && !asg.notified) {
          if (asg.reminderDate === today && asg.reminderTime <= nowTime) {
            notificationService.sendNotification(`Assignment Reminder: ${asg.title}`, {
              body: `Due today at ${asg.dueTime} for ${asg.subject}.`,
            });
            setAssignments((prev) =>
              prev.map((item) => (item.id === asg.id ? { ...item, notified: true } : item))
            );
          }
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [assignments]);

  // Modals state
  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [examForm, setExamForm] = useState({
    subject: '',
    type: 'Series Test 1',
    date: '',
    time: '10:00 AM - 12:00 PM',
    venue: '',
    syllabus: '',
  });

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    subject: '',
    dueDate: '',
    dueTime: '11:59 PM',
    hasReminder: false,
    reminderDate: '',
    reminderTime: '18:00',
    notes: '',
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  // Calendar Day Grid calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const days = [];

    // Trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateStr = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dayNum, dateStr, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNum: i, dateStr, isCurrentMonth: true });
    }

    // Next month days
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextDate = new Date(year, month + 1, i);
      const dateStr = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dayNum: i, dateStr, isCurrentMonth: false });
    }

    return days;
  }, [year, month]);

  // Month navigation
  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Exam actions
  const handleOpenAddExam = (prefilledDate = null) => {
    setEditingExam(null);
    setExamForm({
      subject: allSubjects[0]?.name ? `${allSubjects[0].name} (${allSubjects[0].code})` : '',
      type: 'Series Test 1',
      date: prefilledDate || selectedDateStr || todayStr,
      time: '10:00 AM - 12:00 PM',
      venue: 'Exam Hall B-204',
      syllabus: '',
    });
    setExamModalOpen(true);
  };

  const handleOpenEditExam = (exam) => {
    setEditingExam(exam);
    setExamForm({
      subject: exam.subject || '',
      type: exam.type || 'Series Test',
      date: exam.date || todayStr,
      time: exam.time || '10:00 AM - 12:00 PM',
      venue: exam.venue || '',
      syllabus: exam.syllabus || '',
    });
    setExamModalOpen(true);
  };

  const handleSaveExam = (e) => {
    e.preventDefault();
    if (!examForm.subject.trim()) return;

    if (editingExam) {
      updateExam(editingExam.id, examForm);
    } else {
      addExam(examForm);
    }
    setExamModalOpen(false);
  };

  // Assignment actions
  const handleOpenAddAssignment = (prefilledDate = null) => {
    setEditingAssignment(null);
    setAssignmentForm({
      title: '',
      subject: allSubjects[0]?.name ? `${allSubjects[0].name} (${allSubjects[0].code})` : '',
      dueDate: prefilledDate || selectedDateStr || todayStr,
      dueTime: '11:59 PM',
      hasReminder: false,
      reminderDate: prefilledDate || selectedDateStr || todayStr,
      reminderTime: '18:00',
      notes: '',
    });
    setAssignmentModalOpen(true);
  };

  const handleOpenEditAssignment = (asg) => {
    setEditingAssignment(asg);
    setAssignmentForm({
      title: asg.title || '',
      subject: asg.subject || '',
      dueDate: asg.dueDate || todayStr,
      dueTime: asg.dueTime || '11:59 PM',
      hasReminder: !!asg.hasReminder,
      reminderDate: asg.reminderDate || todayStr,
      reminderTime: asg.reminderTime || '18:00',
      notes: asg.notes || '',
    });
    setAssignmentModalOpen(true);
  };

  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!assignmentForm.title.trim()) return;

    if (assignmentForm.hasReminder) {
      if (notificationService.getPermission() === 'default') {
        await notificationService.requestPermission();
      }
    }

    if (editingAssignment) {
      setAssignments((prev) =>
        prev.map((item) => (item.id === editingAssignment.id ? { ...item, ...assignmentForm } : item))
      );
    } else {
      const newAsg = {
        ...assignmentForm,
        id: 'asg-' + Date.now(),
        isCompleted: false,
        notified: false,
      };
      setAssignments((prev) => [newAsg, ...prev]);
    }
    setAssignmentModalOpen(false);
  };

  const handleDeleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleAssignmentComplete = (id) => {
    setAssignments((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item))
    );
  };

  // Filter exams/assignments if a date is selected
  const displayedExams = useMemo(() => {
    let list = [...exams];
    if (selectedDateStr) {
      list = list.filter((e) => e.date === selectedDateStr);
    }
    return list.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  }, [exams, selectedDateStr]);

  const displayedAssignments = useMemo(() => {
    let list = [...assignments];
    if (selectedDateStr) {
      list = list.filter((a) => a.dueDate === selectedDateStr);
    }
    return list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }, [assignments, selectedDateStr]);

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Semester exam timetable and assignment deadlines.
          </p>
        </div>
      </div>

      {/* 1. FIRST: THE CALENDAR */}
      <Card
        title="Calendar"
        subtitle={
          <div className="flex items-center gap-3 text-xs mt-1">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#9AF04F] shadow-sm" />
              Exams
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#9655F5] shadow-sm" />
              Assignments
            </span>
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToday}
              className="text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center gap-1 border border-slate-200 dark:border-white/[0.08] rounded-xl p-0.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-900 dark:text-white px-1.5 sm:px-2 min-w-[95px] sm:min-w-[110px] text-center">
                {monthYearLabel}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        }
      >
        <div className="space-y-3">
          {/* Days of week header */}
          <div className="grid grid-cols-7 text-center">
            {DAYS_OF_WEEK.map((d, idx) => (
              <div
                key={d}
                className={`py-1.5 text-[11px] font-bold uppercase tracking-wider ${
                  idx === 0 || idx === 6
                    ? 'text-rose-500/80 dark:text-rose-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Matrix */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((cell, idx) => {
              const dayExams = exams.filter((e) => e.date === cell.dateStr);
              const dayAssignments = assignments.filter((a) => a.dueDate === cell.dateStr);
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDateStr;
              const hasEvents = dayExams.length > 0 || dayAssignments.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (selectedDateStr === cell.dateStr) {
                      setSelectedDateStr(null);
                    } else {
                      setSelectedDateStr(cell.dateStr);
                    }
                  }}
                  className={`min-h-[52px] sm:min-h-[64px] p-1.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#9AF04F] bg-[#9AF04F]/10 ring-2 ring-[#9AF04F]/40 shadow-sm'
                      : isToday
                      ? 'border-emerald-500/50 bg-emerald-500/5'
                      : cell.isCurrentMonth
                      ? 'border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#141724] hover:border-slate-300 dark:hover:border-white/[0.15]'
                      : 'border-transparent bg-slate-50/40 dark:bg-white/[0.01] opacity-40 hover:opacity-70'
                  }`}
                >
                  <span
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-[#9AF04F] text-[#0A0D06] font-black'
                        : cell.isCurrentMonth
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {/* Indicator Dots */}
                  {hasEvents && (
                    <div className="flex items-center gap-1 mt-1">
                      {dayExams.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-[#9AF04F]" title={`${dayExams.length} Exam(s)`} />
                      )}
                      {dayAssignments.length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-[#9655F5]" title={`${dayAssignments.length} Assignment(s)`} />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Date Filter pill if day selected */}
          {selectedDateStr && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-[#9AF04F]/10 border border-emerald-200 dark:border-[#9AF04F]/20 text-xs font-bold text-emerald-900 dark:text-[#9AF04F]">
              <span>Showing timetable for: {selectedDateStr}</span>
              <button
                type="button"
                onClick={() => setSelectedDateStr(null)}
                className="underline hover:text-emerald-700 dark:hover:text-white"
              >
                Show All Dates
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* 2. SECOND: SEMESTER EXAM TIME TABLE (With option to add exam dates) */}
      <Card
        title="Semester Exam Time Table"
        subtitle="Manage upcoming internal tests, practicals, and university semester exam dates."
        action={
          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={() => handleOpenAddExam(selectedDateStr || todayStr)}
          >
            Add Exam Date
          </Button>
        }
      >
        <div className="space-y-3">
          {displayedExams.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/[0.08] text-xs text-slate-500">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-slate-900 dark:text-white">No exam dates scheduled {selectedDateStr ? 'for this date' : ''}</p>
              <p className="text-slate-500 mt-1 mb-3">Click "+ Add Exam Date" to schedule your series tests or final exam.</p>
              <Button variant="neon" size="xs" icon={Plus} onClick={() => handleOpenAddExam(selectedDateStr || todayStr)}>
                Add Exam Date
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayedExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#151824] hover:border-[#9AF04F]/40 shadow-sm flex items-start justify-between gap-3 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Date Block */}
                    <div className="w-12 h-12 rounded-2xl bg-[#9AF04F]/10 border border-[#9AF04F]/20 text-emerald-800 dark:text-[#9AF04F] flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-black uppercase leading-none">
                        {exam.date ? new Date(exam.date + 'T00:00:00').toLocaleString('default', { month: 'short' }) : 'EXAM'}
                      </span>
                      <span className="text-base font-black leading-none mt-1 text-slate-900 dark:text-white">
                        {exam.date ? new Date(exam.date + 'T00:00:00').getDate() : '--'}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#9AF04F]/15 text-emerald-900 dark:text-[#9AF04F]">
                          {exam.type || 'Exam'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate mt-1" title={exam.subject}>
                        {exam.subject}
                      </h4>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        {exam.time && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3 text-[#9AF04F]" />
                            {exam.time}
                          </span>
                        )}
                        {exam.venue && (
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {exam.venue}
                          </span>
                        )}
                      </div>

                      {exam.syllabus && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1">
                          Syllabus: {exam.syllabus}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditExam(exam)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                      title="Edit Exam Date"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExam(exam.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete Exam Date"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* 3. THIRD: ASSIGNMENTS & NOTIFICATIONS (Simple configuration) */}
      <Card
        title="Assignments & Notifications"
        subtitle="Manage upcoming assignments with optional notification alerts."
        action={
          <Button
            variant="purple"
            size="sm"
            icon={Plus}
            onClick={() => handleOpenAddAssignment(selectedDateStr || todayStr)}
          >
            Add Assignment
          </Button>
        }
      >
        <div className="space-y-3">
          {displayedAssignments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-white/[0.08] text-xs text-slate-500">
              <Bell className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="font-bold text-slate-900 dark:text-white">No assignments recorded {selectedDateStr ? 'for this date' : ''}</p>
              <p className="text-slate-500 mt-1 mb-3">Add assignments to track deadlines and receive notification alerts.</p>
              <Button variant="purple" size="xs" icon={Plus} onClick={() => handleOpenAddAssignment(selectedDateStr || todayStr)}>
                Add Assignment
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {displayedAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className={`py-3.5 flex items-start justify-between gap-3 transition-colors ${
                    asg.isCompleted ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Completion Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleAssignmentComplete(asg.id)}
                      className={`mt-0.5 p-1 rounded-lg transition-colors shrink-0 ${
                        asg.isCompleted
                          ? 'text-[#9AF04F] bg-[#9AF04F]/10'
                          : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title={asg.isCompleted ? 'Mark pending' : 'Mark submitted'}
                    >
                      {asg.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 fill-current" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`text-sm font-bold truncate ${
                            asg.isCompleted
                              ? 'line-through text-slate-400 dark:text-slate-500'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {asg.title}
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 dark:bg-[#9655F5]/20 text-purple-700 dark:text-[#C084FC]">
                          {asg.subject}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3.5 h-3.5 text-purple-500" />
                          Due: {asg.dueDate} {asg.dueTime}
                        </span>

                        {asg.hasReminder ? (
                          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-[#9AF04F] bg-emerald-50 dark:bg-[#9AF04F]/10 px-2 py-0.5 rounded-full">
                            <Bell className="w-3 h-3" />
                            Alert: {asg.reminderDate} at {asg.reminderTime}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">No alert set</span>
                        )}
                      </div>

                      {asg.notes && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {asg.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEditAssignment(asg)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAssignment(asg.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* MODAL 1: ADD / EDIT EXAM DATE */}
      <Modal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        title={editingExam ? 'Edit Exam Date' : 'Add Semester Exam Date'}
        subtitle="Schedule internal assessment tests, practicals, or end-semester exam dates."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveExam} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject / Course <span className="text-[#9AF04F]">*</span>
            </label>
            <input
              type="text"
              list="exam-subjects-list"
              value={examForm.subject}
              onChange={(e) => setExamForm({ ...examForm, subject: e.target.value })}
              placeholder="e.g. Machine Learning (CS305)"
              className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm py-2.5 px-4 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F]"
              required
            />
            <datalist id="exam-subjects-list">
              {allSubjects.map((s) => (
                <option key={s.id} value={`${s.name} (${s.code || 'CS'})`} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Exam Type
              </label>
              <select
                value={examForm.type}
                onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}
                className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm py-2.5 px-4 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F]"
              >
                <option value="Series Test 1">Series Test 1 / CAT 1</option>
                <option value="Series Test 2">Series Test 2 / CAT 2</option>
                <option value="Model Practical Exam">Model Practical Exam</option>
                <option value="End-Semester University Exam">End-Semester University Exam</option>
                <option value="Lab Viva & Review">Lab Viva & Review</option>
              </select>
            </div>

            <Input
              label="Exam Date"
              type="date"
              value={examForm.date}
              onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Time"
              placeholder="e.g. 10:00 AM - 12:00 PM"
              value={examForm.time}
              onChange={(e) => setExamForm({ ...examForm, time: e.target.value })}
            />
            <Input
              label="Hall / Venue"
              placeholder="e.g. Exam Hall B-204"
              value={examForm.venue}
              onChange={(e) => setExamForm({ ...examForm, venue: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Syllabus / Topics to Revise (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Modules 1 and 2, Unit Test formulas..."
              value={examForm.syllabus}
              onChange={(e) => setExamForm({ ...examForm, syllabus: e.target.value })}
              className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm p-3 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/[0.06]">
            <Button variant="ghost" size="sm" onClick={() => setExamModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="neon" size="sm" type="submit">
              {editingExam ? 'Save Changes' : 'Add Exam Date'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: ADD / EDIT ASSIGNMENT & NOTIFICATION */}
      <Modal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        title={editingAssignment ? 'Edit Assignment' : 'Add Assignment'}
        subtitle="Set coursework assignment title, due date, and optional notification reminder."
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSaveAssignment} className="space-y-4">
          <Input
            label="Assignment Title"
            placeholder="e.g. Assignment 2 – Problem Set 4"
            value={assignmentForm.title}
            onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject / Course
            </label>
            <select
              value={assignmentForm.subject}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, subject: e.target.value })}
              className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm py-2.5 px-4 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F]"
            >
              <option value="">General Assignment</option>
              {allSubjects.map((s) => (
                <option key={s.id} value={`${s.name} (${s.code || 'CS'})`}>
                  {s.name} ({s.code || 'CS'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Due Date"
              type="date"
              value={assignmentForm.dueDate}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, dueDate: e.target.value })}
              required
            />
            <Input
              label="Due Time"
              placeholder="e.g. 11:59 PM"
              value={assignmentForm.dueTime}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, dueTime: e.target.value })}
            />
          </div>

          {/* Simple Reminder / Notification Option */}
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-[#9655F5]/10 border border-purple-200 dark:border-[#9655F5]/25 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={assignmentForm.hasReminder}
                onChange={(e) => setAssignmentForm({ ...assignmentForm, hasReminder: e.target.checked })}
                className="w-4 h-4 rounded accent-[#9655F5] cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-purple-600 dark:text-[#C084FC]" />
                Set Notification Alert
              </span>
            </label>

            {assignmentForm.hasReminder && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Alert Date
                  </span>
                  <input
                    type="date"
                    value={assignmentForm.reminderDate}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, reminderDate: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-purple-200 dark:border-white/[0.1] bg-white dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9655F5]"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                    Alert Time
                  </span>
                  <input
                    type="time"
                    value={assignmentForm.reminderTime}
                    onChange={(e) => setAssignmentForm({ ...assignmentForm, reminderTime: e.target.value })}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-purple-200 dark:border-white/[0.1] bg-white dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9655F5]"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Upload PDF to Classroom portal, max 5 pages..."
              value={assignmentForm.notes}
              onChange={(e) => setAssignmentForm({ ...assignmentForm, notes: e.target.value })}
              className="block w-full rounded-2xl border border-slate-300 dark:border-white/[0.08] text-sm p-3 bg-slate-50 dark:bg-[#151824] text-slate-900 dark:text-white outline-none focus:border-[#9AF04F] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-white/[0.06]">
            <Button variant="ghost" size="sm" onClick={() => setAssignmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="purple" size="sm" type="submit">
              {editingAssignment ? 'Save Changes' : 'Add Assignment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AcademicCalendar;

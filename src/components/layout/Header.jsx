import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Calculator,
  Plus,
  GraduationCap,
  CheckCircle2,
  ChevronDown,
  Check,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function Header({ onMenuClick, onOpenCalculator, onOpenAddSubject }) {
  const {
    settings,
    activities,
    semesters,
    selectedSemesterId,
    selectedSemester,
    setSelectedSemesterId,
    allSemestersSGPA,
  } = useAcademic();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSemesterMenu, setShowSemesterMenu] = useState(false);

  const notifRef = useRef(null);
  const semRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (semRef.current && !semRef.current.contains(e.target)) {
        setShowSemesterMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#08090C]/85 backdrop-blur-xl border-b border-white/[0.06] transition-colors">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4 max-w-7xl mx-auto w-full">
        {/* Left: Mobile Toggle & Mobile Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 rounded-full bg-white/[0.06] text-slate-300 hover:text-white flex items-center justify-center lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Mobile title */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-[#9AF04F] flex items-center justify-center text-[#0A0D06] shadow-neon-sm font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              GradeMate
            </span>
          </div>

          {/* 1. SEMESTER SELECTOR DROPDOWN (Matches Dark Theme & Neon Green) */}
          <div className="relative" ref={semRef}>
            <button
              type="button"
              onClick={() => setShowSemesterMenu(!showSemesterMenu)}
              className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#131520] hover:bg-[#181B29] border border-white/[0.1] hover:border-[#9AF04F]/50 transition-all text-left shadow-sm group active:scale-95"
              title="Switch Semester"
            >
              <span className="w-2 h-2 rounded-full bg-[#9AF04F] shadow-neon-sm animate-pulse shrink-0" />
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs sm:text-sm font-black text-white group-hover:text-[#9AF04F] transition-colors">
                  {selectedSemester.name}
                </span>
                <span className="hidden md:inline text-[11px] font-medium text-slate-400">
                  / {selectedSemester.academicYear}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform ${
                  showSemesterMenu ? 'rotate-180 text-[#9AF04F]' : ''
                }`}
              />
            </button>

            {/* Semester Dropdown Menu */}
            {showSemesterMenu && (
              <div className="absolute left-0 mt-3 w-72 sm:w-84 rounded-3xl bg-[#12141D] border border-white/[0.12] shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl">
                <div className="px-3 py-2 border-b border-white/[0.06] flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Select Academic Term
                    </span>
                    <span className="text-xs font-black text-white">
                      B.Tech CSE (8 Semesters)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F]">
                    {selectedSemester.shortName} Active
                  </span>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {semesters.map((sem) => {
                    const isSelected = sem.id === selectedSemesterId;
                    const semMetrics = allSemestersSGPA.find(s => s.id === sem.id);
                    const hasSGPA = semMetrics && semMetrics.isEvaluated;

                    return (
                      <button
                        key={sem.id}
                        type="button"
                        onClick={() => {
                          setSelectedSemesterId(sem.id);
                          setShowSemesterMenu(false);
                        }}
                        className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition-all ${
                          isSelected
                            ? 'bg-[#9AF04F] text-[#0A0D06] font-bold shadow-neon-sm'
                            : 'hover:bg-white/[0.05] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              isSelected
                                ? 'bg-[#0A0D06] text-[#9AF04F]'
                                : 'bg-white/[0.06] text-slate-400'
                            }`}
                          >
                            {sem.shortName}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-black truncate leading-tight">
                              {sem.name}
                            </p>
                            <p
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-[#0A0D06]/70' : 'text-slate-500'
                              }`}
                            >
                              {sem.academicYear} • {semMetrics?.subjectsCount || 0} courses
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {hasSGPA ? (
                            <span
                              className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#0A0D06] text-[#9AF04F]'
                                  : 'bg-[#9655F5]/20 text-[#C084FC]'
                              }`}
                            >
                              {semMetrics.sgpa} SGPA
                            </span>
                          ) : (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                isSelected
                                  ? 'bg-[#0A0D06]/20 text-[#0A0D06]'
                                  : 'bg-white/[0.04] text-slate-500'
                              }`}
                            >
                              {sem.status}
                            </span>
                          )}

                          {isSelected && (
                            <Check className="w-4 h-4 stroke-[3] text-[#0A0D06]" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick actions, notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Marks Calculator */}
          {onOpenCalculator && (
            <Button
              variant="dark"
              size="sm"
              icon={Calculator}
              onClick={onOpenCalculator}
              className="hidden md:inline-flex"
            >
              Calculator
            </Button>
          )}

          {/* Quick Add Course */}
          {onOpenAddSubject && (
            <Button
              variant="neon"
              size="sm"
              icon={Plus}
              onClick={onOpenAddSubject}
              className="hidden sm:inline-flex font-bold"
            >
              Add Course
            </Button>
          )}

          {/* Activity / Notification circular button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-full bg-[#131520] hover:bg-[#1C2030] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors relative"
              title="Recent academic activity"
            >
              <Bell className="w-4 h-4" />
              {activities.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9AF04F] shadow-neon-sm" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl bg-[#12141D] border border-white/[0.1] shadow-2xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-5 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Recent Activity
                  </span>
                  <Badge color="neonOutline" size="xs">
                    {activities.length} new
                  </Badge>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04]">
                  {activities.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No activity recorded yet
                    </div>
                  ) : (
                    activities.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        className="p-4 hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-7 h-7 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white">
                              {act.action}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {act.details}
                            </p>
                            <span className="text-[10px] text-slate-500 block mt-1">
                              {act.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

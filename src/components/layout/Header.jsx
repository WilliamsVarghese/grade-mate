import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Bell,
  Calculator,
  Plus,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export function Header({ onMenuClick, onOpenCalculator, onOpenAddSubject }) {
  const { settings, activities } = useAcademic();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#08090C]/85 backdrop-blur-xl border-b border-white/[0.06] transition-colors">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
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

          {/* Academic Semester Pill on Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#131520] border border-white/[0.08]">
              <span className="w-2 h-2 rounded-full bg-[#9AF04F] shadow-neon-sm animate-pulse" />
              <span className="text-xs font-bold text-white">
                {settings.studentProfile.currentSemester}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-xs font-medium text-slate-400">
                {settings.studentProfile.academicYear}
              </span>
            </div>
            <span className="hidden md:inline-flex text-[11px] font-semibold text-slate-400 px-3 py-1 rounded-full bg-white/[0.04]">
              {settings.studentProfile.department}
            </span>
          </div>
        </div>

        {/* Right: Quick actions, notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Marks Calculator Circular/Pill Button */}
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

          {/* Quick Add Subject Trigger */}
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

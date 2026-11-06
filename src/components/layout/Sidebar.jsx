import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  ShieldCheck,
  TrendingUp,
  Settings,
  GraduationCap,
  Sparkles,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export function Sidebar({ mobileOpen = false, setMobileOpen = () => {} }) {
  const { semester5Subjects, minorSubjects, electiveSubjects, cumulativeCGPA, settings } = useAcademic();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/semester-5',
      label: 'Semester 5',
      icon: BookOpen,
      badge: `${semester5Subjects.length}`,
      badgeColor: 'bg-white/10 text-white',
    },
    {
      to: '/minor',
      label: 'Minor – IoT & Sensors',
      icon: Cpu,
      badge: `${minorSubjects.length}`,
      badgeColor: 'bg-[#9655F5]/20 text-[#C084FC]',
    },
    {
      to: '/elective',
      label: 'Elective – OS Security',
      icon: ShieldCheck,
      badge: `${electiveSubjects.length}`,
      badgeColor: 'bg-[#FFE7D9]/15 text-[#FFA07A]',
    },
    {
      to: '/performance',
      label: 'Performance Analytics',
      icon: TrendingUp,
      accent: 'purple',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleNavClick = () => {
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#090A10] border-r border-white/[0.06] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9AF04F] flex items-center justify-center text-[#0A0D06] shadow-neon-sm">
              <GraduationCap className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  GradeMate
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06]">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                Academic Performance
              </p>
            </div>
          </div>
        </div>

        {/* Quick Academic Balance Pill in Sidebar */}
        <div className="px-5 pt-5 pb-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121520] to-[#0D0F18] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Standing
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-black text-white tracking-tight">
                  {cumulativeCGPA.cgpa}
                </span>
                <span className="text-xs text-slate-400 font-semibold">CGPA</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] font-bold inline-flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Honours
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">
                {cumulativeCGPA.totalCompletedCredits} Credits
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isActive
                            ? 'bg-[#0A0D06]/15 text-[#0A0D06]'
                            : 'bg-white/[0.05] text-slate-400 group-hover:text-white group-hover:bg-white/[0.1]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold shrink-0 ${
                          isActive
                            ? 'bg-[#0A0D06] text-[#9AF04F]'
                            : item.badgeColor
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Student Profile Pill at Footer */}
        <div className="p-4 border-t border-white/[0.06] shrink-0">
          <NavLink
            to="/settings"
            onClick={handleNavClick}
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#9AF04F] to-[#9655F5] p-[2px] shrink-0">
              <div className="w-full h-full rounded-full bg-[#0E1017] flex items-center justify-center text-white font-bold text-xs">
                {settings.studentProfile.name.charAt(0)}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate group-hover:text-[#9AF04F] transition-colors">
                {settings.studentProfile.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {settings.studentProfile.currentSemester} • B.Tech
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
      </aside>
    </>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Cpu,
  TrendingUp,
  Settings,
  Plus
} from 'lucide-react';

export function BottomNav({ onQuickAction }) {
  const navItems = [
    { to: '/', label: 'Home', icon: LayoutDashboard, end: true },
    { to: '/semester-5', label: 'Sem 5', icon: BookOpen },
    { to: '/minor', label: 'Minor', icon: Cpu },
    { to: '/performance', label: 'Analytics', icon: TrendingUp },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 max-w-lg mx-auto">
      <nav className="glass-panel bg-[#0F1118]/90 backdrop-blur-xl border border-white/[0.12] rounded-full p-2 flex items-center justify-between shadow-2xl">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all relative ${
                  isActive
                    ? 'text-[#9AF04F] bg-[#9AF04F]/10'
                    : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#9AF04F] absolute bottom-1.5 shadow-neon-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        {/* Center Quick Action Circular Neon Button */}
        <button
          type="button"
          onClick={onQuickAction}
          className="w-12 h-12 rounded-full bg-[#9AF04F] hover:bg-[#8DE840] active:scale-95 text-[#0A0D06] flex items-center justify-center shadow-neon-glow transition-transform shrink-0"
          title="Quick Academic Action"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all relative ${
                  isActive
                    ? 'text-[#9AF04F] bg-[#9AF04F]/10'
                    : 'text-slate-400 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-[#9AF04F] absolute bottom-1.5 shadow-neon-sm" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}


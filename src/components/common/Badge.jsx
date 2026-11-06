import React from 'react';

const COLORS = {
  neon:
    'bg-[#9AF04F] text-[#0A0D06] font-bold border-transparent',
  neonOutline:
    'bg-[#9AF04F]/10 text-[#9AF04F] border-[#9AF04F]/30',
  purple:
    'bg-[#9655F5] text-white font-semibold border-transparent shadow-purple-glow',
  purpleOutline:
    'bg-[#9655F5]/15 text-[#C084FC] border-[#9655F5]/30',
  pastelMint:
    'bg-[#D8F7E0] text-[#0F4725] border-transparent font-semibold',
  pastelPurple:
    'bg-[#EBDDFB] text-[#3B1768] border-transparent font-semibold',
  pastelPeach:
    'bg-[#FFE7D9] text-[#682D0F] border-transparent font-semibold',
  pastelBlue:
    'bg-[#DCF1FF] text-[#103F64] border-transparent font-semibold',
  dark:
    'bg-[#191C26] text-slate-300 border-white/[0.08]',
  emerald:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  indigo:
    'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  amber:
    'bg-amber-500/15 text-amber-400 border-amber-500/25',
  rose:
    'bg-rose-500/15 text-rose-400 border-rose-500/25',
  slate:
    'bg-white/[0.06] text-slate-300 border-white/[0.08]',
};

export function Badge({
  children,
  color = 'neonOutline',
  size = 'sm',
  className = '',
  dot = false,
}) {
  const colorStyle = COLORS[color] || COLORS.neonOutline;
  const sizeStyle =
    size === 'xs'
      ? 'text-[10px] px-2 py-0.5'
      : size === 'lg'
      ? 'text-sm px-3.5 py-1.5'
      : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${sizeStyle} ${colorStyle} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse" />}
      {children}
    </span>
  );
}

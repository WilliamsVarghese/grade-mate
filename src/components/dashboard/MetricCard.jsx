import React from 'react';
import { Card } from '../common/Card';

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'neon',
  color = 'neon',
}) {
  return (
    <Card className="hover:border-[#9AF04F]/40 transition-all bg-[#11131B] border border-white/[0.07]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="w-10 h-10 rounded-2xl bg-white/[0.06] text-[#9AF04F] flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-3xl font-black tracking-tight text-white">
          {value}
        </div>
        {badge && (
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#9AF04F]/15 text-[#9AF04F]">
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 mt-2 truncate">
          {subtitle}
        </p>
      )}
    </Card>
  );
}

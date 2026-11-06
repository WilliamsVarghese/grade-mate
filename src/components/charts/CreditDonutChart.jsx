import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card } from '../common/Card';
import { useAcademic } from '../../context/AcademicContext';

export function CreditDonutChart({ height = 240 }) {
  const { cumulativeCGPA, settings } = useAcademic();

  const totalCompleted = cumulativeCGPA.totalCompletedCredits || 0;
  const targetCredits = Number(settings.studentProfile.degreeCreditsTarget) || 160;
  const remaining = Math.max(0, targetCredits - totalCompleted);
  const completionRate = Math.round((totalCompleted / targetCredits) * 100);

  const data = [
    { name: 'Completed Credits', value: totalCompleted, color: '#9AF04F' },
    { name: 'Remaining Target', value: remaining, color: '#1B1E2B' },
  ];

  return (
    <Card
      title="Credit Completion Gauge"
      subtitle={`Progress toward ${targetCredits} credits degree requirement`}
    >
      <div className="relative" style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} Credits`, name]}
              contentStyle={{
                backgroundColor: '#141724',
                borderColor: '#23283B',
                borderRadius: '1rem',
                color: '#ffffff',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black text-white">
            {completionRate}%
          </span>
          <span className="text-[11px] text-[#9AF04F] font-bold">
            {totalCompleted} / {targetCredits}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-around pt-3 text-xs text-slate-400 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9AF04F] shadow-neon-sm" />
          <span>Earned: <strong className="text-white">{totalCompleted} Credits</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B1E2B]" />
          <span>Remaining: <strong className="text-white">{remaining} Credits</strong></span>
        </div>
      </div>
    </Card>
  );
}

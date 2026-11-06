import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../common/Card';
import { useAcademic } from '../../context/AcademicContext';

export function MarksBarChart({ height = 280, subjects = null, title = "Subject-wise Performance" }) {
  const { semester5Subjects } = useAcademic();
  const [viewMode, setViewMode] = useState('components'); // 'components' or 'percentage'

  const activeSubjects = subjects || semester5Subjects;

  const data = activeSubjects.map((s) => ({
    name: s.code || s.name.slice(0, 10),
    fullName: s.name,
    cia: Number(s.ciaMarks) || 0,
    ese: Number(s.eseMarks) || 0,
    total: Number(s.totalMarks) || 0,
    percentage: Number(s.percentage) || 0,
    grade: s.grade,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#141724] p-3.5 rounded-2xl shadow-2xl border border-white/[0.1] text-xs">
          <p className="font-bold text-white">
            {item.fullName}
          </p>
          <div className="mt-1 space-y-1">
            <p className="text-[#9AF04F] font-bold">
              CIA (Internal): {item.cia}
            </p>
            <p className="text-[#C084FC] font-bold">
              ESE (End-Sem): {item.ese}
            </p>
            <div className="pt-1.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <span className="font-black text-white">
                Total: {item.total} ({item.percentage}%)
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06] font-black text-[10px]">
                Grade {item.grade}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title={title}
      subtitle="Comparison of internal assessment and end-semester scores"
      action={
        <div className="flex items-center gap-1 bg-[#141724] p-1 rounded-full text-[11px] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setViewMode('components')}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              viewMode === 'components'
                ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            CIA / ESE
          </button>
          <button
            type="button"
            onClick={() => setViewMode('percentage')}
            className={`px-3 py-1 rounded-full font-bold transition-all ${
              viewMode === 'percentage'
                ? 'bg-[#9655F5] text-white shadow-purple-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Percentage %
          </button>
        </div>
      }
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {viewMode === 'components' ? (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1C1F2E"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingBottom: '8px' }}
              />
              <Bar
                name="CIA (Internal)"
                dataKey="cia"
                fill="#9AF04F"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="ESE (End-Sem)"
                dataKey="ese"
                fill="#9655F5"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1C1F2E"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Total %"
                dataKey="percentage"
                fill="#9AF04F"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

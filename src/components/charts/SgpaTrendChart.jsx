import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Card } from '../common/Card';
import { useAcademic } from '../../context/AcademicContext';

export function SgpaTrendChart({ height = 280 }) {
  const { pastSemesters, semester5SGPA, cumulativeCGPA } = useAcademic();

  const data = [
    ...pastSemesters.map((s) => ({
      name: s.semester.replace('Semester ', 'Sem '),
      fullName: s.semester,
      sgpa: Number(s.sgpa) || 0,
      credits: s.credits,
      isCurrent: false,
    })),
    {
      name: 'Sem 5',
      fullName: 'Semester 5 (Active)',
      sgpa: semester5SGPA.sgpa || 0,
      credits: semester5SGPA.totalCredits,
      isCurrent: true,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-[#141724] p-3.5 rounded-2xl shadow-2xl border border-white/[0.1] text-xs">
          <p className="font-bold text-white">
            {item.fullName}
          </p>
          <div className="mt-1 space-y-1">
            <p className="text-[#9AF04F] font-black text-sm">
              SGPA: {item.sgpa} / 10
            </p>
            <p className="text-slate-400">
              Registered Credits: {item.credits}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Semester-wise SGPA Progression"
      subtitle="Academic trajectory from Semester 1 through active semester"
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="fintechSgpa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9655F5" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#9655F5" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              domain={[6, 10]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[6, 7, 8, 9, 10]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={cumulativeCGPA.cgpa}
              stroke="#9AF04F"
              strokeDasharray="3 3"
              label={{
                value: `CGPA: ${cumulativeCGPA.cgpa}`,
                fill: '#9AF04F',
                fontSize: 10,
                position: 'top',
              }}
            />
            <Area
              type="monotone"
              dataKey="sgpa"
              stroke="#9655F5"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#fintechSgpa)"
              activeDot={{ r: 6, fill: '#9AF04F', stroke: '#000000', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

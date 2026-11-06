import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';
import { Card } from '../common/Card';
import { useAcademic } from '../../context/AcademicContext';

export function GradeDistributionChart({ height = 240 }) {
  const { semester5Subjects, minorSubjects, electiveSubjects } = useAcademic();

  const allSubjects = [...semester5Subjects, ...minorSubjects, ...electiveSubjects];

  const counts = {};
  allSubjects.forEach((s) => {
    const g = (s.grade || 'N/A').toUpperCase();
    counts[g] = (counts[g] || 0) + 1;
  });

  const gradeOrder = ['O', 'A+', 'A', 'B+', 'B', 'C', 'P', 'F'];
  const data = gradeOrder
    .filter((g) => counts[g] !== undefined)
    .map((g) => ({
      grade: g,
      count: counts[g],
    }));

  const gradeColors = {
    O: '#9AF04F',
    'A+': '#9655F5',
    A: '#C084FC',
    'B+': '#67E8F9',
    B: '#38BDF8',
    C: '#FBBF24',
    P: '#FB923C',
    F: '#F43F5E',
  };

  return (
    <Card
      title="Grade Ledger Distribution"
      subtitle="Frequency of letter grades attained across all registered subjects"
    >
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1C1F2E"
              vertical={false}
            />
            <XAxis
              dataKey="grade"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141724',
                borderColor: '#23283B',
                borderRadius: '1rem',
                color: '#ffffff',
                fontSize: '12px',
              }}
              formatter={(val) => [`${val} Courses`, 'Total']}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={gradeColors[entry.grade] || '#9AF04F'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

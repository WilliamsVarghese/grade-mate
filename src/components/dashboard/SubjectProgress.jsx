import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { BookOpen, CheckCircle, TrendingUp } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export function SubjectProgress() {
  const { semester5Subjects } = useAcademic();

  return (
    <Card
      title="Semester 5 Course Milestone Progress"
      subtitle="Curriculum syllabus coverage & internal assessment progress"
    >
      <div className="space-y-4">
        {semester5Subjects.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No subjects enrolled for Semester 5.
          </div>
        ) : (
          semester5Subjects.map((sub) => {
            const progress = sub.progress || 0;
            return (
              <div key={sub.id} className="space-y-1.5 p-3 rounded-2xl bg-[#141724] border border-white/[0.04]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-white truncate">
                      {sub.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      ({sub.code})
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-black text-[#9AF04F]">
                      {progress}%
                    </span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F]">
                      {sub.grade || '–'}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#9AF04F] shadow-neon-sm transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

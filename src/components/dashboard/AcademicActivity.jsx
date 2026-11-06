import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckCircle2, BookOpen, Award, Calendar, Settings, Trash2 } from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export function AcademicActivity() {
  const { activities } = useAcademic();

  const getIcon = (type) => {
    switch (type) {
      case 'marks':
        return <Award className="w-4 h-4 text-[#9AF04F]" />;
      case 'subject':
        return <BookOpen className="w-4 h-4 text-[#9655F5]" />;
      case 'exam':
        return <Calendar className="w-4 h-4 text-[#FFA07A]" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-rose-400" />;
      default:
        return <Settings className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <Card
      title="Recent Academic Activity"
      subtitle="Audit log of marks updates, courses enrolled, and exam schedules"
    >
      <div className="space-y-3">
        {activities.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No activity recorded.
          </div>
        ) : (
          activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="w-9 h-9 rounded-2xl bg-[#171A27] border border-white/[0.05] flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-white">
                    {act.action}
                  </span>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {act.details}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

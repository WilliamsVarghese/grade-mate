import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Award,
  BookOpen,
  TrendingUp,
  Percent,
  Plus,
  Calculator,
  Calendar,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
  Sparkles,
  Cpu,
  ShieldCheck,
  Target,
  Clock,
  Layers,
  ChevronRight,
  Download
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { UpcomingExams } from '../components/dashboard/UpcomingExams';
import { SubjectModal } from '../components/subjects/SubjectModal';
import { MarksCalculatorModal } from '../components/subjects/MarksCalculatorModal';
import { calculateAverageCIA } from '../utils/calculations';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    semester5Subjects,
    minorSubjects,
    electiveSubjects,
    pastSemesters,
    semester5SGPA,
    cumulativeCGPA,
    activities,
    addSemester5Subject,
    settings,
    exportDataJSON,
  } = useAcademic();

  const [addSubjectModalOpen, setAddSubjectModalOpen] = useState(false);
  const [calculatorModalOpen, setCalculatorModalOpen] = useState(false);
  const [calculatorTab, setCalculatorTab] = useState('internal');
  const [calculatorSubjectId, setCalculatorSubjectId] = useState(null);

  const openCalculator = (tab = 'internal', subjectId = null) => {
    setCalculatorTab(tab);
    setCalculatorSubjectId(subjectId);
    setCalculatorModalOpen(true);
  };

  const { avgCIA, avgCIAPercentage } = calculateAverageCIA(semester5Subjects);
  const targetCredits = Number(settings.studentProfile.degreeCreditsTarget) || 160;
  const completedCredits = cumulativeCGPA.totalCompletedCredits || 107;
  const creditsPercentage = Math.min(100, Math.round((completedCredits / targetCredits) * 100));

  // Analytics chart data
  const trendData = [
    ...pastSemesters.map((s, idx) => ({
      name: `Sem ${idx + 1}`,
      sgpa: Number(s.sgpa) || 0,
    })),
    {
      name: 'Sem 5',
      sgpa: Number(semester5SGPA.sgpa) || 0,
      isCurrent: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Greeting & Academic Chip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
              Academic Dashboard
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
            <span className="text-xs text-slate-400">
              {settings.studentProfile.college}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hi, {settings.studentProfile.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="dark"
            size="sm"
            icon={Calculator}
            onClick={() => openCalculator('internal')}
          >
            Internal Calc
          </Button>
          <Button
            variant="neon"
            size="sm"
            icon={Plus}
            onClick={() => setAddSubjectModalOpen(true)}
          >
            Add Subject
          </Button>
        </div>
      </div>

      {/* 1. HERO CARD: Account Balance → Current CGPA */}
      <div className="relative rounded-3xl bg-[#9AF04F] text-[#0A0D06] p-6 sm:p-8 shadow-neon-glow overflow-hidden">
        {/* Subtle decorative curved background overlay */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-12 w-48 h-48 rounded-full bg-[#84cc16]/30 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 px-3 py-1 rounded-full bg-black/10">
                Academic Balance • Current CGPA
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-black text-[#9AF04F] inline-flex items-center gap-1 shadow-sm">
                <ArrowUpRight className="w-3.5 h-3.5" /> +0.14 vs Sem 4
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/40 text-[#0A0D06]">
                Honours Candidate
              </span>
            </div>

            {/* Giant CGPA Display */}
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#0A0D06] leading-none">
                {cumulativeCGPA.cgpa}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-[#0A0D06]/60">
                / 10.0
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold text-[#0A0D06]/80 flex-wrap">
              <span>Semester 5 SGPA: <strong>{semester5SGPA.sgpa}</strong></span>
              <span>•</span>
              <span>Credits: <strong>{completedCredits} / {targetCredits}</strong> ({creditsPercentage}%)</span>
              <span>•</span>
              <span>Scale: <strong>Autonomous 10-Point</strong></span>
            </div>
          </div>

          {/* Quick Circular Action Buttons on Hero Card */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => setAddSubjectModalOpen(true)}
                className="w-12 h-12 rounded-full bg-[#0A0D06] hover:bg-[#1C2030] text-[#9AF04F] flex items-center justify-center transition-all shadow-md active:scale-95"
                title="Add Course"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
              <span className="text-[11px] font-bold text-[#0A0D06]">Add Course</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => openCalculator('internal')}
                className="w-12 h-12 rounded-full bg-[#0A0D06] hover:bg-[#1C2030] text-[#9AF04F] flex items-center justify-center transition-all shadow-md active:scale-95"
                title="Internal Assessment Calculator"
              >
                <Calculator className="w-5 h-5 stroke-[2.5]" />
              </button>
              <span className="text-[11px] font-bold text-[#0A0D06]">Internal Calc</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={() => navigate('/performance')}
                className="w-12 h-12 rounded-full bg-[#0A0D06] hover:bg-[#1C2030] text-[#9AF04F] flex items-center justify-center transition-all shadow-md active:scale-95"
                title="Performance Analytics"
              >
                <TrendingUp className="w-5 h-5 stroke-[2.5]" />
              </button>
              <span className="text-[11px] font-bold text-[#0A0D06]">Analytics</span>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <button
                type="button"
                onClick={exportDataJSON}
                className="w-12 h-12 rounded-full bg-[#0A0D06] hover:bg-[#1C2030] text-[#9AF04F] flex items-center justify-center transition-all shadow-md active:scale-95"
                title="Export Data"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
              </button>
              <span className="text-[11px] font-bold text-[#0A0D06]">Backup</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK TRANSFERS → QUICK ACADEMIC ACTIONS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </span>
          <span className="text-xs text-slate-500">Shortcuts & Tools</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => setAddSubjectModalOpen(true)}
            className="p-4 rounded-2xl bg-[#11131B] hover:bg-[#161924] border border-white/[0.06] hover:border-[#9AF04F]/40 transition-all flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#9AF04F] text-[#0A0D06] flex items-center justify-center font-bold shrink-0 shadow-neon-sm group-hover:scale-105 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#9AF04F] transition-colors">
                Add Course
              </p>
              <p className="text-[10px] text-slate-400">Regular / Minor</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCalculator('internal')}
            className="p-4 rounded-2xl bg-[#11131B] hover:bg-[#161924] border border-white/[0.06] hover:border-[#9AF04F]/40 transition-all flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] border border-[#9AF04F]/30 flex items-center justify-center font-bold shrink-0 shadow-neon-sm group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#9AF04F] transition-colors">
                Internal Calc
              </p>
              <p className="text-[10px] text-slate-400">CAT 1, 2 & Attd</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCalculator('endsem')}
            className="p-4 rounded-2xl bg-[#11131B] hover:bg-[#161924] border border-white/[0.06] hover:border-[#9655F5]/40 transition-all flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#9655F5] text-white flex items-center justify-center font-bold shrink-0 shadow-purple-glow group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-[#9655F5] transition-colors">
                End-Sem Calc
              </p>
              <p className="text-[10px] text-slate-400">Scale & Cutoffs</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => openCalculator('overall')}
            className="p-4 rounded-2xl bg-[#11131B] hover:bg-[#161924] border border-white/[0.06] hover:border-sky-500/40 transition-all flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                Grade Engine
              </p>
              <p className="text-[10px] text-slate-400">CIA + ESE Final</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/performance')}
            className="p-4 rounded-2xl bg-[#11131B] hover:bg-[#161924] border border-white/[0.06] hover:border-emerald-500/40 transition-all flex items-center gap-3 group text-left"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                SGPA Engine
              </p>
              <p className="text-[10px] text-slate-400">Live Simulator</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. EXPENSE CATEGORIES → SUBJECT CATEGORIES (Colourful Pastel Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Subject Categories & Streams
            </h2>
            <p className="text-xs text-slate-500">
              Categorized course streams with dedicated credit and performance metrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pastel Mint Card: Semester 5 Regular Core */}
          <div
            onClick={() => navigate('/semester-5')}
            className="p-5 rounded-3xl bg-[#D8F7E0] text-[#0F4725] cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/70 text-[#0F4725] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 text-[#0F4725]">
                {semester5Subjects.length} Courses
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
              Core Degree
            </span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">
              Semester 5 Core
            </h3>
            <div className="mt-4 pt-3 border-t border-[#0F4725]/15 flex items-center justify-between text-xs font-bold">
              <span>{semester5SGPA.totalCredits} Credits</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                SGPA {semester5SGPA.sgpa} <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Pastel Purple Card: Minor in IoT and Sensors */}
          <div
            onClick={() => navigate('/minor')}
            className="p-5 rounded-3xl bg-[#EBDDFB] text-[#3B1768] cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/70 text-[#3B1768] flex items-center justify-center shadow-xs">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 text-[#3B1768]">
                {minorSubjects.length} Courses
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
              Specialization
            </span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">
              IoT & Sensors Minor
            </h3>
            <div className="mt-4 pt-3 border-t border-[#3B1768]/15 flex items-center justify-between text-xs font-bold">
              <span>8 Credits</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                GPA 8.63 <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Pastel Peach Card: Elective – OS Security */}
          <div
            onClick={() => navigate('/elective')}
            className="p-5 rounded-3xl bg-[#FFE7D9] text-[#682D0F] cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/70 text-[#682D0F] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 text-[#682D0F]">
                {electiveSubjects.length} Course
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
              Professional Elective
            </span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">
              OS Security
            </h3>
            <div className="mt-4 pt-3 border-t border-[#682D0F]/15 flex items-center justify-between text-xs font-bold">
              <span>3 Credits</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Grade O <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Pastel Sky Blue Card: Engineering Labs & Practical */}
          <div
            onClick={() => navigate('/semester-5')}
            className="p-5 rounded-3xl bg-[#DCF1FF] text-[#103F64] cursor-pointer hover:shadow-lg transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-2xl bg-white/70 text-[#103F64] flex items-center justify-center shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 text-[#103F64]">
                2 Labs
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider opacity-80 block">
              Practicals
            </span>
            <h3 className="text-lg font-black tracking-tight mt-0.5">
              ML & Net Labs
            </h3>
            <div className="mt-4 pt-3 border-t border-[#103F64]/15 flex items-center justify-between text-xs font-bold">
              <span>4 Credits</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Avg 95% <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. PERFORMANCE ANALYTICS & ACADEMIC TARGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SPENDING ANALYTICS → ACADEMIC PERFORMANCE ANALYTICS (PURPLE #9655F5 CARD) */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-to-br from-[#1C112F] via-[#140D24] to-[#0D0917] border border-[#9655F5]/30 p-6 sm:p-7 shadow-purple-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C084FC]">
                    Analytics
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#9655F5]/20 text-[#C084FC] text-[10px] font-bold">
                    SGPA Trajectory
                  </span>
                </div>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Academic Performance Curve
                </h3>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-[#9AF04F]">
                  {semester5SGPA.sgpa}
                </span>
                <span className="text-xs text-slate-400 block font-semibold">Active SGPA</span>
              </div>
            </div>

            {/* Recharts Performance Area Chart with Purple Gradient & Neon Dot */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="purpleFintech" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9655F5" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#9655F5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2B1A48" vertical={false} />
                  <XAxis dataKey="name" stroke="#A78BFA" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[7, 10]} stroke="#A78BFA" fontSize={11} tickLine={false} axisLine={false} ticks={[7, 8, 9, 10]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#160E27',
                      borderColor: '#9655F5',
                      borderRadius: '1rem',
                      color: '#ffffff',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val} / 10`, 'SGPA']}
                  />
                  <Area
                    type="monotone"
                    dataKey="sgpa"
                    stroke="#9655F5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#purpleFintech)"
                    activeDot={{ r: 6, fill: '#9AF04F', stroke: '#000000', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-4 border-t border-[#9655F5]/20 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9655F5]" /> Cumulative CGPA: <strong className="text-white">{cumulativeCGPA.cgpa}</strong>
            </span>
            <button
              type="button"
              onClick={() => navigate('/performance')}
              className="text-[#9AF04F] hover:underline font-bold inline-flex items-center gap-1"
            >
              Full Analytics Report <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* SAVINGS GOALS → ACADEMIC TARGETS */}
        <div className="rounded-3xl bg-[#11131B] border border-white/[0.07] p-6 sm:p-7 flex flex-col justify-between shadow-card-dark">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#9AF04F]/15 text-[#9AF04F] flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Academic Targets
                  </h3>
                  <p className="text-[11px] text-slate-400">Goals & milestones</p>
                </div>
              </div>
              <Badge color="neonOutline" size="xs">
                In Progress
              </Badge>
            </div>

            <div className="space-y-4">
              {/* Target 1: Degree Credits Completion */}
              <div className="p-3.5 rounded-2xl bg-[#161824] border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">B.Tech Degree Credits</span>
                  <span className="font-bold text-[#9AF04F]">{creditsPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#9AF04F] shadow-neon-sm transition-all duration-500"
                    style={{ width: `${creditsPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Earned: <strong>{completedCredits}</strong></span>
                  <span>Target: <strong>{targetCredits} Credits</strong></span>
                </div>
              </div>

              {/* Target 2: Honours Distinction CGPA ≥ 9.0 */}
              <div className="p-3.5 rounded-2xl bg-[#161824] border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">Target CGPA (Honours)</span>
                  <span className="font-bold text-[#9655F5]">
                    {Math.round((cumulativeCGPA.cgpa / 9.0) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#9655F5] to-[#9AF04F] shadow-purple-glow transition-all duration-500"
                    style={{ width: `${Math.min(100, (cumulativeCGPA.cgpa / 9.0) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Current: <strong>{cumulativeCGPA.cgpa}</strong></span>
                  <span>Goal: <strong>9.00 CGPA</strong></span>
                </div>
              </div>

              {/* Target 3: Mandatory Attendance ≥ 75% */}
              <div className="p-3.5 rounded-2xl bg-[#161824] border border-white/[0.05]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white">Average Attendance</span>
                  <span className="font-bold text-emerald-400">93%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: '93%' }} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                  <span>Threshold: 75%</span>
                  <span className="text-emerald-400 font-bold">Safely Above</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. TRANSACTIONS → RECENT MARKS & ACADEMIC ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Marks Stream (styled like fintech transaction history) */}
        <div className="lg:col-span-2 rounded-3xl bg-[#11131B] border border-white/[0.07] p-6 shadow-card-dark">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Recent Marks & Evaluations
              </h3>
              <p className="text-xs text-slate-400">
                Latest internal continuous assessments and university test recordings
              </p>
            </div>
            <Badge color="neonOutline" size="xs">
              Live Feed
            </Badge>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {semester5Subjects.slice(0, 5).map((sub, idx) => {
              const pastelVariants = [
                'bg-[#D8F7E0] text-[#0F4725]',
                'bg-[#EBDDFB] text-[#3B1768]',
                'bg-[#FFE7D9] text-[#682D0F]',
                'bg-[#DCF1FF] text-[#103F64]',
                'bg-[#FFF3CD] text-[#594406]',
              ];
              const pastelStyle = pastelVariants[idx % pastelVariants.length];

              return (
                <div
                  key={sub.id}
                  className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 ${pastelStyle}`}>
                      {sub.code ? sub.code.slice(0, 2) : 'CS'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white truncate">
                          {sub.name}
                        </p>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-slate-400">
                          {sub.code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Internal Assessment CIA: {sub.ciaMarks}/{sub.ciaMax} • ESE: {sub.eseMarks}/{sub.eseMax}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-base font-black text-[#9AF04F] block">
                      +{sub.totalMarks} <span className="text-xs font-normal text-slate-400">/ {sub.maxMarks}</span>
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">
                      Grade: <span className="text-[#9AF04F]">{sub.grade}</span> ({sub.gradePoint} GP)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Examination Schedule */}
        <div>
          <UpcomingExams />
        </div>
      </div>

      {/* Add Subject Modal */}
      <SubjectModal
        isOpen={addSubjectModalOpen}
        onClose={() => setAddSubjectModalOpen(false)}
        onSave={addSemester5Subject}
        sectionTitle="Semester 5 Regular Subject"
      />

      {/* Marks Calculator Modal */}
      <MarksCalculatorModal
        isOpen={calculatorModalOpen}
        onClose={() => setCalculatorModalOpen(false)}
        initialTab={calculatorTab}
        initialSubjectId={calculatorSubjectId}
      />
    </div>
  );
}

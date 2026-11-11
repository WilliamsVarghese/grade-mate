import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Calculator,
  Flame,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Target,
  AlertCircle,
  Check
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Input } from '../components/common/Input';
import { SgpaTrendChart } from '../components/charts/SgpaTrendChart';
import { MarksBarChart } from '../components/charts/MarksBarChart';
import { CreditDonutChart } from '../components/charts/CreditDonutChart';
import { GradeDistributionChart } from '../components/charts/GradeDistributionChart';
import { findExtremeSubjects, calculateSGPA } from '../utils/calculations';

export function Performance() {
  const {
    semesters,
    selectedSemesterId,
    selectedSemester,
    setSelectedSemesterId,
    semestersData,
    currentSemesterSubjects,
    allSemestersSGPA,
    cumulativeCGPA,
    updateSubject,
  } = useAcademic();

  const [simulatingSemesterId, setSimulatingSemesterId] = useState(selectedSemesterId);
  const activeSimSubjects = semestersData[simulatingSemesterId] || [];
  const activeSimSGPA = calculateSGPA(activeSimSubjects);
  const activeSimSem = semesters.find(s => s.id === simulatingSemesterId) || selectedSemester;

  const { best, lowest } = findExtremeSubjects(currentSemesterSubjects);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
              Academic Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
            <span className="text-xs text-slate-400">8-Semester B.Tech Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Performance Analytics & Cumulative CGPA
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overall CGPA calculated from evaluated subject credits and live SGPA simulation for all 8 semesters.
          </p>
        </div>
      </div>

      {/* Extreme Subject Highlights (Best & Lowest for Active Semester) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Best Subject in Neon Card */}
        {best ? (
          <div className="p-6 rounded-3xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 px-2.5 py-0.5 rounded-full bg-black/10">
                  <ArrowUpRight className="w-4 h-4" /> Top Course in {selectedSemester.name}
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0A0D06] text-[#9AF04F]">
                  Grade {best.grade} ({best.gradePoint} GP)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0A0D06] tracking-tight">
                {best.name}
              </h3>
              <p className="text-xs font-bold text-[#0A0D06]/70 mt-0.5">
                Code: {best.code || 'N/A'} • {best.credits} Credits • {best.attendance}% Attendance
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-black">
              <span>Total: {best.totalMarks} / {best.maxMarks}</span>
              <span className="text-base font-black">{best.percentage}%</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] text-slate-400 flex items-center justify-center text-xs">
            No evaluated course data in {selectedSemester.name}
          </div>
        )}

        {/* Opportunity Subject in Pastel Peach / Orange */}
        {lowest ? (
          <div className="p-6 rounded-3xl bg-[#FFE7D9] text-[#682D0F] shadow-card-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#682D0F]/80 px-2.5 py-0.5 rounded-full bg-black/10">
                  <ArrowDownRight className="w-4 h-4" /> Scope for Improvement ({selectedSemester.name})
                </span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#682D0F] text-[#FFE7D9]">
                  Grade {lowest.grade} ({lowest.gradePoint} GP)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#682D0F] tracking-tight">
                {lowest.name}
              </h3>
              <p className="text-xs font-bold text-[#682D0F]/70 mt-0.5">
                Code: {lowest.code || 'N/A'} • {lowest.credits} Credits • {lowest.attendance}% Attendance
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#682D0F]/15 flex items-center justify-between text-xs font-black">
              <span>Total: {lowest.totalMarks} / {lowest.maxMarks}</span>
              <span className="text-base font-black">{lowest.percentage}%</span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-[#11131B] border border-white/[0.08] text-slate-400 flex items-center justify-center text-xs">
            All subjects on track
          </div>
        )}
      </div>

      {/* Main Visualizations: SGPA Curve & Subject Marks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SgpaTrendChart height={300} />
        <MarksBarChart height={300} title={`${selectedSemester.name} Marks Breakdown`} />
      </div>

      {/* Secondary Charts: Credit Fulfillment & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditDonutChart height={260} />
        <GradeDistributionChart height={260} />
      </div>

      {/* 1. 8-SEMESTER CUMULATIVE CGPA LEDGER */}
      <Card
        title="8-Semester Progression & CGPA Ledger"
        subtitle="CGPA = Total Weighted Grade Points ÷ Total Completed Credits. Never computed via simple SGPA averaging."
      >
        <div className="space-y-4">
          {/* CGPA Summary Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171A26] to-[#12141F] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Overall Cumulative CGPA Status
              </span>
              <p className="text-xs font-mono text-slate-300 mt-1">
                CGPA = Total Weighted Points (<strong className="text-[#9AF04F]">{cumulativeCGPA.totalWeightedPoints}</strong>) ÷ Total Completed Credits (<strong className="text-white">{cumulativeCGPA.totalCompletedCredits}</strong>)
              </p>
              {cumulativeCGPA.isIncomplete && (
                <p className="text-xs font-bold text-amber-400 mt-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Prior records incomplete: {cumulativeCGPA.missingPriorSemesters.join(', ')} marks pending.
                </p>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-semibold">Overall CGPA:</span>
              <span className="text-4xl font-black text-[#9AF04F] tracking-tight">
                {cumulativeCGPA.cgpa > 0 ? cumulativeCGPA.cgpa : '—'}
              </span>
              <span className="text-xs font-bold text-slate-500">/ 10</span>
            </div>
          </div>

          {/* Table of all 8 Semesters */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-2xl">Semester</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Courses</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">SGPA</th>
                  <th className="px-4 py-3">Weighted Points</th>
                  <th className="px-4 py-3 rounded-r-2xl text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {allSemestersSGPA.map((sem) => {
                  const isActive = sem.id === selectedSemesterId;
                  return (
                    <tr
                      key={sem.id}
                      onClick={() => setSelectedSemesterId(sem.id)}
                      className={`cursor-pointer transition-colors ${
                        isActive
                          ? 'bg-[#9AF04F]/10 font-bold'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="px-4 py-3.5 text-white flex items-center gap-2">
                        <span className="font-black">{sem.name}</span>
                        {isActive && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06]">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {sem.academicYear}
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-semibold">
                        {sem.subjectsCount} Courses
                      </td>
                      <td className="px-4 py-3.5 font-bold text-white">
                        {sem.totalCredits}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-[#9AF04F]">
                        {sem.isEvaluated ? sem.sgpa : '—'}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-300">
                        {sem.totalWeightedPoints}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sem.isEvaluated
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-white/[0.05] text-slate-400'
                          }`}
                        >
                          {sem.isEvaluated ? 'Evaluated' : sem.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* 2. WORKING SGPA SIMULATION ENGINE (Support all 8 semesters) */}
      <Card
        title="Live Semester SGPA Simulation Engine"
        subtitle="SGPA = Σ(Credit × Grade Point) / Σ(Credits). Select any semester and tweak credits or grade points to test hypothetical GPA scenarios."
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Simulating:</span>
            <select
              value={simulatingSemesterId}
              onChange={(e) => setSimulatingSemesterId(e.target.value)}
              className="text-xs font-bold bg-[#141724] border border-white/[0.1] rounded-xl px-3 py-1.5 text-[#9AF04F] focus:outline-none focus:border-[#9AF04F]"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#141724] text-white">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <div className="space-y-4">
          {activeSimSubjects.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No subjects registered for {activeSimSem.name}.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3 rounded-l-2xl">Course</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3 w-28">Credits</th>
                    <th className="px-4 py-3">Marks %</th>
                    <th className="px-4 py-3 w-32">Grade Point</th>
                    <th className="px-4 py-3">Credit × GP</th>
                    <th className="px-4 py-3 rounded-r-2xl">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {activeSimSubjects.map((sub) => {
                    const cr = Number(sub.credits) || 0;
                    const gp = Number(sub.gradePoint) || 0;
                    const weighted = Math.round((cr * gp) * 100) / 100;
                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-bold text-white">
                          {sub.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {sub.code || '–'}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={sub.credits}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 1;
                              updateSubject(sub.id, { credits: val }, simulatingSemesterId);
                            }}
                            className="w-16 px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-white font-bold"
                          />
                        </td>
                        <td className="px-4 py-3 text-slate-300 font-bold">
                          {sub.percentage}%
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            max="10"
                            value={sub.gradePoint}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              updateSubject(sub.id, {
                                gradePoint: val,
                                autoCalculateGrade: false,
                              }, simulatingSemesterId);
                            }}
                            className="w-20 px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-[#9AF04F] font-black"
                          />
                        </td>
                        <td className="px-4 py-3 font-bold text-white">
                          {weighted}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F]">
                            {sub.grade || '—'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Instant SGPA calculation output bar */}
          <div className="p-5 rounded-2xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 block">
                {activeSimSem.name} Recalculation Output
              </span>
              <p className="text-xs font-bold text-[#0A0D06] mt-0.5">
                Total Credits: <strong>{activeSimSGPA.totalCredits}</strong> • Total Weighted Grade Points: <strong>{activeSimSGPA.totalWeightedPoints}</strong>
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[#0A0D06]/70 uppercase">Calculated SGPA:</span>
              <span className="text-3xl font-black text-[#0A0D06]">
                {activeSimSGPA.sgpa > 0 ? activeSimSGPA.sgpa : '—'}
              </span>
              <span className="text-xs font-bold text-[#0A0D06]/70">/ 10</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Performance;

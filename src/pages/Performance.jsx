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
  Target
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
import { findExtremeSubjects, calculateSGPA, calculateCGPA } from '../utils/calculations';

export function Performance() {
  const {
    semester5Subjects,
    pastSemesters,
    semester5SGPA,
    cumulativeCGPA,
    updatePastSemester,
    addPastSemester,
    deletePastSemester,
    updateSemester5Subject,
  } = useAcademic();

  const { best, lowest } = findExtremeSubjects(semester5Subjects);

  const [semesterModalOpen, setSemesterModalOpen] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [semesterForm, setSemesterForm] = useState({
    semester: '',
    sgpa: '',
    credits: '',
    academicYear: '2023-2024',
    status: 'Completed',
  });

  const handleOpenAddSemester = () => {
    setEditingSemester(null);
    setSemesterForm({
      semester: `Semester ${pastSemesters.length + 1}`,
      sgpa: '8.5',
      credits: '21',
      academicYear: '2023-2024',
      status: 'Completed',
    });
    setSemesterModalOpen(true);
  };

  const handleOpenEditSemester = (sem) => {
    setEditingSemester(sem);
    setSemesterForm({
      semester: sem.semester,
      sgpa: sem.sgpa,
      credits: sem.credits,
      academicYear: sem.academicYear || '',
      status: sem.status || 'Completed',
    });
    setSemesterModalOpen(true);
  };

  const handleSaveSemester = (e) => {
    e.preventDefault();
    if (!semesterForm.semester || !semesterForm.sgpa || !semesterForm.credits) return;

    if (editingSemester) {
      updatePastSemester(editingSemester.semester, {
        semester: semesterForm.semester,
        sgpa: parseFloat(semesterForm.sgpa),
        credits: parseInt(semesterForm.credits, 10),
        academicYear: semesterForm.academicYear,
        status: semesterForm.status,
      });
    } else {
      addPastSemester({
        semester: semesterForm.semester,
        sgpa: parseFloat(semesterForm.sgpa),
        credits: parseInt(semesterForm.credits, 10),
        academicYear: semesterForm.academicYear,
        status: semesterForm.status,
      });
    }
    setSemesterModalOpen(false);
  };

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
            <span className="text-xs text-slate-400">Live Formula Engines</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Performance Analytics & GPA Engines
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics for SGPA trajectory, cumulative CGPA progression, credit fulfillment, and subject comparisons.
          </p>
        </div>
      </div>

      {/* Extreme Subject Highlights (Best & Lowest) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Best Subject in Neon Card */}
        {best && (
          <div className="p-6 rounded-3xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 px-2.5 py-0.5 rounded-full bg-black/10">
                  <ArrowUpRight className="w-4 h-4" /> Top Performing Subject
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
        )}

        {/* Opportunity Subject in Pastel Peach / Orange */}
        {lowest && (
          <div className="p-6 rounded-3xl bg-[#FFE7D9] text-[#682D0F] shadow-card-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#682D0F]/80 px-2.5 py-0.5 rounded-full bg-black/10">
                  <ArrowDownRight className="w-4 h-4" /> Scope for Improvement
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
        )}
      </div>

      {/* Main Visualizations: SGPA Curve & Subject Marks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SgpaTrendChart height={300} />
        <MarksBarChart height={300} title="Core Subject Marks Comparison" />
      </div>

      {/* Secondary Charts: Credit Fulfillment & Grade Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreditDonutChart height={260} />
        <GradeDistributionChart height={260} />
      </div>

      {/* CUMULATIVE CGPA & PAST SEMESTERS TRACKER */}
      <Card
        title="Cumulative CGPA Ledger"
        subtitle="Maintain previous semester results. Cumulative CGPA updates instantaneously via Σ(Credits × SGPA) / Σ(Credits)."
        action={
          <Button
            variant="neon"
            size="xs"
            icon={Plus}
            onClick={handleOpenAddSemester}
          >
            Add Past Sem
          </Button>
        }
      >
        <div className="space-y-4">
          {/* CGPA Summary Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#171A26] to-[#12141F] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Total Cumulative CGPA Formula
              </span>
              <p className="text-xs font-mono text-slate-300 mt-1">
                CGPA = Total Weighted Grade Points (<strong className="text-[#9AF04F]">{cumulativeCGPA.totalWeightedPoints}</strong>) ÷ Total Completed Credits (<strong className="text-white">{cumulativeCGPA.totalCompletedCredits}</strong>)
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-400 font-semibold">Result:</span>
              <span className="text-4xl font-black text-[#9AF04F] tracking-tight">
                {cumulativeCGPA.cgpa}
              </span>
              <span className="text-xs font-bold text-slate-500">/ 10</span>
            </div>
          </div>

          {/* Table of Semesters */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3 rounded-l-2xl">Semester</th>
                  <th className="px-4 py-3">Academic Year</th>
                  <th className="px-4 py-3">Credits</th>
                  <th className="px-4 py-3">SGPA</th>
                  <th className="px-4 py-3">Weighted Points</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-r-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {pastSemesters.map((sem) => {
                  const weighted = Math.round((sem.credits * sem.sgpa) * 100) / 100;
                  return (
                    <tr
                      key={sem.semester}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3.5 font-bold text-white">
                        {sem.semester}
                      </td>
                      <td className="px-4 py-3.5 text-slate-400">
                        {sem.academicYear || '–'}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-200">
                        {sem.credits}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-[#9AF04F]">
                        {sem.sgpa}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-slate-300">
                        {weighted}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                          {sem.status || 'Completed'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditSemester(sem)}
                            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            title="Edit semester"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePastSemester(sem.semester)}
                            className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                            title="Delete semester"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {/* Current Active Semester 5 Row */}
                <tr className="bg-[#9AF04F]/10 font-medium">
                  <td className="px-4 py-3.5 font-black text-white flex items-center gap-2">
                    <span>Semester 5</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#9AF04F] text-[#0A0D06]">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">
                    2024–2025
                  </td>
                  <td className="px-4 py-3.5 font-black text-white">
                    {semester5SGPA.totalCredits}
                  </td>
                  <td className="px-4 py-3.5 font-black text-[#9AF04F]">
                    {semester5SGPA.sgpa}
                  </td>
                  <td className="px-4 py-3.5 font-black text-white">
                    {semester5SGPA.totalWeightedPoints}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/20 text-[#9AF04F]">
                      In Progress
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-xs text-slate-400 italic">
                    Derived dynamically
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* WORKING SGPA CALCULATOR & GRADE POINT SIMULATION */}
      <Card
        title="Live Semester 5 SGPA Engine"
        subtitle="SGPA = Σ(Credit × Grade Point) / Σ(Credits). Directly tweak credits or grade points to test hypothetical GPA scenarios."
      >
        <div className="space-y-4">
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
                {semester5Subjects.map((sub) => {
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
                            updateSemester5Subject(sub.id, { credits: val });
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
                            updateSemester5Subject(sub.id, {
                              gradePoint: val,
                              autoCalculateGrade: false,
                            });
                          }}
                          className="w-20 px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-[#9AF04F] font-black"
                        />
                      </td>
                      <td className="px-4 py-3 font-bold text-white">
                        {weighted}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/15 text-[#9AF04F]">
                          {sub.grade}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Instant SGPA calculation output bar */}
          <div className="p-5 rounded-2xl bg-[#9AF04F] text-[#0A0D06] shadow-neon-glow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#0A0D06]/80 block">
                Instant Recalculation Output
              </span>
              <p className="text-xs font-bold text-[#0A0D06] mt-0.5">
                Total Credits: <strong>{semester5SGPA.totalCredits}</strong> • Total Weighted Grade Points: <strong>{semester5SGPA.totalWeightedPoints}</strong>
              </p>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-black text-[#0A0D06]/70 uppercase">Calculated SGPA:</span>
              <span className="text-3xl font-black text-[#0A0D06]">
                {semester5SGPA.sgpa}
              </span>
              <span className="text-xs font-bold text-[#0A0D06]/70">/ 10</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Add / Edit Past Semester Modal */}
      <Modal
        isOpen={semesterModalOpen}
        onClose={() => setSemesterModalOpen(false)}
        title={editingSemester ? 'Edit Semester Record' : 'Add Past Semester Result'}
        subtitle="Enter semester name, registered credits, and attained SGPA for cumulative CGPA calculation."
      >
        <form onSubmit={handleSaveSemester} className="space-y-4">
          <Input
            label="Semester Name"
            value={semesterForm.semester}
            onChange={(e) => setSemesterForm({ ...semesterForm, semester: e.target.value })}
            placeholder="e.g. Semester 1"
            required
            disabled={!!editingSemester}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SGPA (Out of 10)"
              type="number"
              step="0.01"
              min="0"
              max="10"
              value={semesterForm.sgpa}
              onChange={(e) => setSemesterForm({ ...semesterForm, sgpa: e.target.value })}
              placeholder="e.g. 8.65"
              required
            />
            <Input
              label="Total Credits"
              type="number"
              min="1"
              max="40"
              value={semesterForm.credits}
              onChange={(e) => setSemesterForm({ ...semesterForm, credits: e.target.value })}
              placeholder="e.g. 21"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Academic Year"
              value={semesterForm.academicYear}
              onChange={(e) => setSemesterForm({ ...semesterForm, academicYear: e.target.value })}
              placeholder="e.g. 2022-2023"
            />
            <Input
              label="Status"
              value={semesterForm.status}
              onChange={(e) => setSemesterForm({ ...semesterForm, status: e.target.value })}
              placeholder="e.g. Completed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button variant="ghost" size="sm" onClick={() => setSemesterModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="neon" size="sm" type="submit">
              {editingSemester ? 'Save Changes' : 'Add Semester'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

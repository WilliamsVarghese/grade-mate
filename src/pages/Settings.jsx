import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Sliders,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Moon,
  Laptop,
  Plus,
  Save,
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { useTheme } from '../context/ThemeContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DEFAULT_GRADE_SCALE } from '../utils/grading';

export function Settings() {
  const {
    settings,
    updateSettings,
    updateGradeScale,
    updateAssessmentScheme,
    resetToDefaults,
    clearAllData,
  } = useAcademic();

  const { theme, setTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({ ...settings.studentProfile });
  const [profileSaved, setProfileSaved] = useState(false);

  const [assessmentForm, setAssessmentForm] = useState({ ...settings.assessmentScheme });
  const [schemeSaved, setSchemeSaved] = useState(false);

  const [gradeScale, setGradeScale] = useState(() =>
    settings.gradeScale && settings.gradeScale.length > 0 ? settings.gradeScale : DEFAULT_GRADE_SCALE
  );
  const [scaleSaved, setScaleSaved] = useState(false);

  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateSettings({ studentProfile: profileForm });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleAssessmentSubmit = (e) => {
    e.preventDefault();
    updateAssessmentScheme(assessmentForm);
    setSchemeSaved(true);
    setTimeout(() => setSchemeSaved(false), 2500);
  };

  const handleGradeScaleSubmit = (e) => {
    e.preventDefault();
    updateGradeScale(gradeScale);
    setScaleSaved(true);
    setTimeout(() => setScaleSaved(false), 2500);
  };

  const handleGradeChange = (index, field, value) => {
    setGradeScale((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === 'minPercentage' || field === 'gradePoint' ? parseFloat(value) || 0 : value,
      };
      return updated;
    });
  };

  const handleAddGradeRow = () => {
    setGradeScale((prev) => [
      ...prev,
      { grade: 'New', minPercentage: 50, gradePoint: 5, description: 'Passing', color: 'slate' },
    ]);
  };

  const handleDeleteGradeRow = (index) => {
    setGradeScale((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page Header */}
      <div className="pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#9AF04F]">
            Settings & Security
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#9AF04F]" />
          <span className="text-xs text-slate-400">Configuration Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Application Preferences & Regulations
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your academic profile, regulations, grading scales, and assessment weightages.
        </p>
      </div>

      {/* 1. Student Profile & Regulations */}
      <Card
        title="Student Profile & Academic Regulation"
        subtitle="Manage student identification and target degree credits"
      >
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Student Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              required
            />
            <Input
              label="Student ID / Roll No"
              value={profileForm.studentId}
              onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
              required
            />
            <Input
              label="College / Institution"
              value={profileForm.college}
              onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
              required
            />
            <Input
              label="Department / Program"
              value={profileForm.department}
              onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
              required
            />
            <Input
              label="Academic Year"
              value={profileForm.academicYear}
              onChange={(e) => setProfileForm({ ...profileForm, academicYear: e.target.value })}
              placeholder="e.g. 2024–2025"
            />
            <Input
              label="Active Semester"
              value={profileForm.currentSemester}
              onChange={(e) => setProfileForm({ ...profileForm, currentSemester: e.target.value })}
              placeholder="e.g. Semester 5"
            />
            <Input
              label="Academic Regulation / Scheme"
              value={profileForm.regulations}
              onChange={(e) => setProfileForm({ ...profileForm, regulations: e.target.value })}
              placeholder="e.g. KTU 2019 / Autonomous 2023"
            />
            <Input
              label="Total Degree Credits Target"
              type="number"
              value={profileForm.degreeCreditsTarget}
              onChange={(e) =>
                setProfileForm({ ...profileForm, degreeCreditsTarget: parseInt(e.target.value, 10) || 160 })
              }
              helperText="Standard B.Tech degree target is typically 160 credits"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSaved && (
              <span className="text-xs font-bold text-[#9AF04F] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
              </span>
            )}
            <div className="ml-auto">
              <Button variant="neon" type="submit" size="sm" icon={Save}>
                Save Profile
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* 2. Assessment Scheme Settings */}
      <Card
        title="Assessment Weightage & Evaluation Rules"
        subtitle="Configure default continuous internal assessment (CIA) and end-semester (ESE) ratios"
      >
        <form onSubmit={handleAssessmentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Evaluation Scheme Pattern
              </label>
              <select
                value={assessmentForm.type}
                onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value })}
                className="block w-full rounded-2xl border border-white/[0.08] text-sm py-2.5 px-4 bg-[#151824] text-white"
              >
                <option value="sum">Direct Addition (Obtained CIA + ESE / Max Marks)</option>
                <option value="weighted">Weighted Ratio (Configurable percentage weight)</option>
              </select>
            </div>

            <Input
              label="Minimum Passing Percentage (%)"
              type="number"
              value={assessmentForm.minPassPercentage}
              onChange={(e) =>
                setAssessmentForm({ ...assessmentForm, minPassPercentage: parseFloat(e.target.value) || 45 })
              }
              suffix="%"
            />

            <Input
              label="Default CIA Max Marks"
              type="number"
              value={assessmentForm.defaultCiaMax}
              onChange={(e) =>
                setAssessmentForm({ ...assessmentForm, defaultCiaMax: parseFloat(e.target.value) || 50 })
              }
            />

            <Input
              label="Default ESE Max Marks"
              type="number"
              value={assessmentForm.defaultEseMax}
              onChange={(e) =>
                setAssessmentForm({ ...assessmentForm, defaultEseMax: parseFloat(e.target.value) || 50 })
              }
            />

            {assessmentForm.type === 'weighted' && (
              <>
                <Input
                  label="Internal (CIA) Weight (%)"
                  type="number"
                  value={assessmentForm.ciaWeight}
                  onChange={(e) =>
                    setAssessmentForm({ ...assessmentForm, ciaWeight: parseFloat(e.target.value) || 50 })
                  }
                  suffix="%"
                />
                <Input
                  label="End-Sem (ESE) Weight (%)"
                  type="number"
                  value={assessmentForm.eseWeight}
                  onChange={(e) =>
                    setAssessmentForm({ ...assessmentForm, eseWeight: parseFloat(e.target.value) || 50 })
                  }
                  suffix="%"
                />
              </>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            {schemeSaved && (
              <span className="text-xs font-bold text-[#9AF04F] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Assessment scheme updated across all subjects!
              </span>
            )}
            <div className="ml-auto">
              <Button variant="neon" type="submit" size="sm" icon={Save}>
                Save Assessment Settings
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* 3. Configurable Grade-Point Mapping */}
      <Card
        title="Grade-Point Mapping Scale"
        subtitle="Configurable grading thresholds. Modifying this recalculates grades and SGPAs for all courses."
        action={
          <Button variant="dark" size="xs" icon={Plus} onClick={handleAddGradeRow}>
            Add Tier
          </Button>
        }
      >
        <form onSubmit={handleGradeScaleSubmit} className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-[#151824] text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-3 py-2.5 rounded-l-2xl">Letter Grade</th>
                  <th className="px-3 py-2.5">Min Percentage (%)</th>
                  <th className="px-3 py-2.5">Grade Point (out of 10)</th>
                  <th className="px-3 py-2.5">Classification</th>
                  <th className="px-3 py-2.5 text-right rounded-r-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {gradeScale.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        value={item.grade}
                        onChange={(e) => handleGradeChange(idx, 'grade', e.target.value)}
                        className="w-16 px-2.5 py-1 font-bold text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-white"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.minPercentage}
                        onChange={(e) => handleGradeChange(idx, 'minPercentage', e.target.value)}
                        className="w-20 px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-white"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={item.gradePoint}
                        onChange={(e) => handleGradeChange(idx, 'gradePoint', e.target.value)}
                        className="w-20 px-2.5 py-1 text-xs font-black text-[#9AF04F] rounded-xl border border-white/[0.1] bg-[#141724]"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleGradeChange(idx, 'description', e.target.value)}
                        className="w-full min-w-[120px] px-2.5 py-1 text-xs rounded-xl border border-white/[0.1] bg-[#141724] text-white"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteGradeRow(idx)}
                        disabled={gradeScale.length <= 1}
                        className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2">
            {scaleSaved && (
              <span className="text-xs font-bold text-[#9AF04F] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Grade scale saved! All subjects recalculated.
              </span>
            )}
            <div className="ml-auto">
              <Button variant="neon" type="submit" size="sm" icon={Save}>
                Save Grade Scale
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* 4. Theme Selection */}
      <Card
        title="Application Theme Mode"
        subtitle="GradeMate default is the premium dark fintech interface"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'border-[#9AF04F] bg-[#9AF04F]/10 ring-1 ring-[#9AF04F]'
                : 'border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#181B26] text-[#9AF04F] flex items-center justify-center shadow-neon-sm">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Fintech Dark</p>
              <p className="text-xs text-slate-400">Near-black & neon</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'system'
                ? 'border-[#9AF04F] bg-[#9AF04F]/10 ring-1 ring-[#9AF04F]'
                : 'border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#181B26] text-slate-300 flex items-center justify-center">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Device System</p>
              <p className="text-xs text-slate-400">Sync with OS theme</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'border-[#9AF04F] bg-[#9AF04F]/10 ring-1 ring-[#9AF04F]'
                : 'border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-[#181B26] text-amber-400 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Light Mode</p>
              <p className="text-xs text-slate-400">High contrast</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card
        title="Danger Zone"
        subtitle="Reset demo records or purge all application data from local storage"
        className="border-rose-500/20"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
          <div>
            <h4 className="text-sm font-bold text-rose-300">
              Reset or Purge Academic Storage
            </h4>
            <p className="text-xs text-rose-300/70 mt-0.5 max-w-xl">
              You can restore the default demonstration data at any time or completely purge all stored subjects, exams, and settings.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="dark"
              size="sm"
              icon={RotateCcw}
              onClick={() => setResetConfirmOpen(true)}
            >
              Reset Demo
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setClearConfirmOpen(true)}
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={resetToDefaults}
        title="Reset to Sample Data"
        message="Are you sure you want to restore the default sample curriculum data? This will overwrite your current courses and exam schedules with initial demo records."
        confirmText="Reset to Sample"
        variant="neon"
      />

      {/* Confirm Clear All Dialog */}
      <ConfirmDialog
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={clearAllData}
        title="Clear All Application Data"
        message="Are you sure you want to wipe all local data? All subjects, marks, past semesters, exams, and settings will be permanently erased from your browser storage."
        confirmText="Yes, Purge Everything"
        variant="danger"
      />
    </div>
  );
}

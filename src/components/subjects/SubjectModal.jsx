import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { useAcademic } from '../../context/AcademicContext';
import { calculateSubjectMarks } from '../../utils/calculations';

export function SubjectModal({
  isOpen,
  onClose,
  onSave,
  subjectToEdit = null,
  sectionTitle = 'Subject',
  defaultTrack = null,
}) {
  const { settings } = useAcademic();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    credits: 3,
    ciaMarks: 40,
    ciaMax: 50,
    eseMarks: 40,
    eseMax: 50,
    attendance: 90,
    progress: 75,
    schemeType: 'sum',
    ciaWeight: 50,
    eseWeight: 50,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        name: subjectToEdit.name || '',
        code: subjectToEdit.code || '',
        credits: subjectToEdit.credits ?? 3,
        ciaMarks: subjectToEdit.ciaMarks ?? 40,
        ciaMax: subjectToEdit.ciaMax ?? 50,
        eseMarks: subjectToEdit.eseMarks ?? 40,
        eseMax: subjectToEdit.eseMax ?? 50,
        attendance: subjectToEdit.attendance ?? 90,
        progress: subjectToEdit.progress ?? 75,
        schemeType: subjectToEdit.schemeType || 'sum',
        ciaWeight: subjectToEdit.ciaWeight ?? 50,
        eseWeight: subjectToEdit.eseWeight ?? 50,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        credits: 3,
        ciaMarks: 40,
        ciaMax: settings.assessmentScheme.defaultCiaMax || 50,
        eseMarks: 40,
        eseMax: settings.assessmentScheme.defaultEseMax || 50,
        attendance: 90,
        progress: 70,
        schemeType: settings.assessmentScheme.type || 'sum',
        ciaWeight: settings.assessmentScheme.ciaWeight || 50,
        eseWeight: settings.assessmentScheme.eseWeight || 50,
      });
    }
    setErrors({});
  }, [subjectToEdit, isOpen, settings]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const previewSubject = calculateSubjectMarks(formData, settings);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Subject name is required';
    if (!formData.credits || Number(formData.credits) <= 0) {
      errs.credits = 'Credits must be at least 1';
    }
    if (Number(formData.ciaMax) <= 0) errs.ciaMax = 'Max must be > 0';
    if (Number(formData.eseMax) <= 0) errs.eseMax = 'Max must be > 0';

    if (Number(formData.ciaMarks) < 0) errs.ciaMarks = 'Marks cannot be negative';
    if (Number(formData.ciaMarks) > Number(formData.ciaMax)) {
      errs.ciaMarks = `Cannot exceed max (${formData.ciaMax})`;
    }

    if (Number(formData.eseMarks) < 0) errs.eseMarks = 'Marks cannot be negative';
    if (Number(formData.eseMarks) > Number(formData.eseMax)) {
      errs.eseMarks = `Cannot exceed max (${formData.eseMax})`;
    }

    if (formData.attendance !== undefined && (Number(formData.attendance) < 0 || Number(formData.attendance) > 100)) {
      errs.attendance = 'Attendance must be between 0% and 100%';
    }

    if (formData.progress !== undefined && (Number(formData.progress) < 0 || Number(formData.progress) > 100)) {
      errs.progress = 'Progress must be between 0% and 100%';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      ...(subjectToEdit ? { id: subjectToEdit.id } : {}),
      ...(defaultTrack ? { track: defaultTrack } : {}),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? `Edit ${sectionTitle}` : `Add New ${sectionTitle}`}
      subtitle="Register course credits, evaluation patterns, and internal/external marks."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Input
              label="Course Title"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Computer Networks"
              error={errors.name}
              required
            />
          </div>
          <div>
            <Input
              label="Course Code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. CS301"
            />
          </div>
        </div>

        {/* Credits, Attendance, Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Credits"
            name="credits"
            type="number"
            min="1"
            max="12"
            value={formData.credits}
            onChange={handleChange}
            error={errors.credits}
            required
          />
          <Input
            label="Attendance (%)"
            name="attendance"
            type="number"
            min="0"
            max="100"
            value={formData.attendance}
            onChange={handleChange}
            error={errors.attendance}
            suffix="%"
          />
          <Input
            label="Syllabus Progress (%)"
            name="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress}
            onChange={handleChange}
            error={errors.progress}
            suffix="%"
          />
        </div>

        {/* Marks & Assessment Scheme */}
        <div className="p-4 rounded-2xl border border-white/[0.06] bg-[#141724] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Evaluation Pattern
            </span>
            <div className="flex items-center gap-1.5 text-xs">
              <label className="text-slate-400 text-xs">Scheme:</label>
              <select
                name="schemeType"
                value={formData.schemeType}
                onChange={handleChange}
                className="text-xs px-2.5 py-1 rounded-full border border-white/[0.1] bg-[#1B1E2E] text-white"
              >
                <option value="sum">Direct Sum (CIA + ESE)</option>
                <option value="weighted">Weighted Ratio</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Input
              label="CIA Obtained"
              name="ciaMarks"
              type="number"
              step="0.5"
              value={formData.ciaMarks}
              onChange={handleChange}
              error={errors.ciaMarks}
            />
            <Input
              label="CIA Max"
              name="ciaMax"
              type="number"
              value={formData.ciaMax}
              onChange={handleChange}
              error={errors.ciaMax}
            />
            <Input
              label="ESE Obtained"
              name="eseMarks"
              type="number"
              step="0.5"
              value={formData.eseMarks}
              onChange={handleChange}
              error={errors.eseMarks}
            />
            <Input
              label="ESE Max"
              name="eseMax"
              type="number"
              value={formData.eseMax}
              onChange={handleChange}
              error={errors.eseMax}
            />
          </div>

          {formData.schemeType === 'weighted' && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Input
                label="CIA Weight (%)"
                name="ciaWeight"
                type="number"
                value={formData.ciaWeight}
                onChange={handleChange}
                suffix="%"
              />
              <Input
                label="ESE Weight (%)"
                name="eseWeight"
                type="number"
                value={formData.eseWeight}
                onChange={handleChange}
                suffix="%"
              />
            </div>
          )}
        </div>

        {/* Live Calculation Preview Card */}
        <div className="p-4 rounded-2xl bg-[#9AF04F] text-[#0A0D06] flex items-center justify-between shadow-neon-sm">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0A0D06]/80 block">
              Calculated Preview
            </span>
            <div className="text-xs font-bold text-[#0A0D06] mt-0.5">
              Score: <strong>{previewSubject.totalMarks}</strong> / {previewSubject.maxMarks} ({previewSubject.percentage}%)
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0A0D06] text-[#9AF04F]">
              Grade {previewSubject.grade}
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0A0D06]/10 text-[#0A0D06]">
              {previewSubject.gradePoint} GP
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" type="submit">
            {subjectToEdit ? 'Save Changes' : 'Add Course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

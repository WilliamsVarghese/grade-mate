import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  BookOpen
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';

export function UpcomingExams() {
  const { exams, addExam, updateExam, deleteExam } = useAcademic();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    type: 'Internal Assessment',
    date: '',
    time: '10:00 AM - 12:00 PM',
    venue: '',
    syllabus: '',
  });

  const handleOpenAdd = () => {
    setEditingExam(null);
    setFormData({
      subject: '',
      type: 'Internal Assessment',
      date: new Date().toISOString().slice(0, 10),
      time: '10:00 AM - 12:00 PM',
      venue: 'Main Hall',
      syllabus: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (exam) => {
    setEditingExam(exam);
    setFormData({
      subject: exam.subject || '',
      type: exam.type || 'Internal Assessment',
      date: exam.date || '',
      time: exam.time || '',
      venue: exam.venue || '',
      syllabus: exam.syllabus || '',
    });
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    if (editingExam) {
      updateExam(editingExam.id, formData);
    } else {
      addExam(formData);
    }
    setModalOpen(false);
  };

  return (
    <>
      <Card
        title="Upcoming Exam Calendar"
        subtitle="Internal tests and end-semester dates"
        action={
          <Button variant="neon" size="xs" icon={Plus} onClick={handleOpenAdd}>
            Add
          </Button>
        }
      >
        <div className="space-y-3">
          {exams.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No exams scheduled. Click "Add" to schedule one.
            </div>
          ) : (
            exams.map((exam) => (
              <div
                key={exam.id}
                className="group p-3.5 rounded-2xl border border-white/[0.05] bg-[#151824] hover:border-[#9AF04F]/40 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#9AF04F]/10 text-[#9AF04F] border border-[#9AF04F]/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-black uppercase leading-none">
                      {exam.date ? new Date(exam.date).toLocaleString('default', { month: 'short' }) : 'EXAM'}
                    </span>
                    <span className="text-base font-black leading-none mt-1 text-white">
                      {exam.date ? new Date(exam.date).getDate() : '--'}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {exam.subject}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                        {exam.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 flex-wrap">
                      {exam.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#9AF04F]" />
                          {exam.time}
                        </span>
                      )}
                      {exam.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {exam.venue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(exam)}
                    className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                    title="Edit exam"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteExam(exam.id)}
                    className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
                    title="Delete exam"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Exam Edit/Add Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingExam ? 'Edit Exam Schedule' : 'Schedule New Exam'}
        subtitle="Enter subject, evaluation type, date and venue details."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Subject & Code"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="e.g. Machine Learning (CS305)"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Exam Category"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              placeholder="e.g. Internal Assessment 2 / ESE"
            />
            <Input
              label="Exam Date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Time Slot"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 10:00 AM - 12:00 PM"
            />
            <Input
              label="Venue / Hall"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g. Hall B-204"
            />
          </div>

          <Input
            label="Syllabus Scope"
            value={formData.syllabus}
            onChange={(e) => setFormData({ ...formData, syllabus: e.target.value })}
            placeholder="e.g. Modules 3 and 4"
          />

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <Button variant="dark" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="neon" size="sm" type="submit">
              {editingExam ? 'Save Changes' : 'Schedule Exam'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

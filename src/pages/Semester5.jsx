import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  X,
  Pin,
  FileText,
} from 'lucide-react';
import { useAcademic } from '../context/AcademicContext';
import { KeepNoteCard } from '../components/workspace/KeepNoteCard';
import { KeepNoteModal } from '../components/workspace/KeepNoteModal';

export function Semester5() {
  const {
    notes,
    allSubjects,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
  } = useAcademic();

  // Search query
  const [searchTerm, setSearchTerm] = useState('');

  // Note Modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Search across all notes regardless of semester
  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) {
      return notes;
    }

    const q = searchTerm.toLowerCase().trim();
    return notes.filter((n) => {
      const titleMatch = (n.title || '').toLowerCase().includes(q);
      const contentMatch = (n.content || '').toLowerCase().includes(q);
      const subjectMatch = (n.subjectName || '').toLowerCase().includes(q);
      const codeMatch = (n.subjectCode || '').toLowerCase().includes(q);
      return titleMatch || contentMatch || subjectMatch || codeMatch;
    });
  }, [notes, searchTerm]);

  // Partition into Pinned and Others (Google Keep style)
  const pinnedNotes = useMemo(() => {
    return filteredNotes.filter((n) => !!n.isPinned);
  }, [filteredNotes]);

  const otherNotes = useMemo(() => {
    return filteredNotes.filter((n) => !n.isPinned);
  }, [filteredNotes]);

  // Open note for editing
  const handleOpenNote = (note) => {
    setEditingNote(note);
    setNoteModalOpen(true);
  };

  // Open blank note editor
  const handleOpenNewNote = () => {
    setEditingNote(null);
    setNoteModalOpen(true);
  };

  // Save note (Add or Update)
  const handleSaveNote = (payload) => {
    if (editingNote) {
      updateNote(editingNote.id, payload);
    } else {
      addNote(payload);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto animate-fadeIn">
      {/* 1. SIMPLE HEADER TITLED "Notes" */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Notes
          </h1>
          {notes.length > 0 && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400">
              {notes.length}
            </span>
          )}
        </div>
      </div>

      {/* 2. SEARCH BAR: "Search your notes..." */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search your notes..."
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#12141F] border border-white/[0.08] hover:border-white/[0.15] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F] text-sm shadow-md transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. GOOGLE KEEP QUICK NOTE INPUT BAR */}
      <div className="max-w-xl mx-auto">
        <div
          onClick={handleOpenNewNote}
          className="bg-[#12141F] hover:bg-[#151826] border border-white/[0.08] hover:border-white/[0.2] rounded-2xl px-5 py-3.5 flex items-center justify-between cursor-pointer shadow-md transition-all group"
        >
          <span className="text-sm text-slate-400 group-hover:text-slate-300">
            Take a note...
          </span>
          <span className="text-xs font-semibold text-[#9AF04F] bg-[#9AF04F]/10 px-2.5 py-1 rounded-lg">
            + New Note
          </span>
        </div>
      </div>

      {/* 4. NOTES DISPLAYED AS COMPACT CARDS IN RESPONSIVE GRID */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-white/[0.08] max-w-md mx-auto my-8">
          <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">
            {searchTerm ? 'No matching notes found' : 'No notes yet'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            {searchTerm
              ? 'Try searching with different keywords.'
              : 'Add your study notes, formulas, quick reminders or coursework points.'}
          </p>
          <button
            type="button"
            onClick={handleOpenNewNote}
            className="px-4 py-2 rounded-xl bg-[#9AF04F] text-[#0A0D06] text-xs font-black shadow-neon-sm hover:bg-[#8DE840] transition-colors"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* PINNED NOTES SECTION */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                <Pin className="w-3 h-3 text-[#9AF04F] fill-current" />
                <span>Pinned ({pinnedNotes.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {pinnedNotes.map((note) => (
                  <KeepNoteCard
                    key={note.id}
                    note={note}
                    onOpen={handleOpenNote}
                    onTogglePin={togglePinNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* OTHER NOTES SECTION */}
          {otherNotes.length > 0 && (
            <div className="space-y-3">
              {pinnedNotes.length > 0 && (
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                  <span>Others ({otherNotes.length})</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {otherNotes.map((note) => (
                  <KeepNoteCard
                    key={note.id}
                    note={note}
                    onOpen={handleOpenNote}
                    onTogglePin={togglePinNote}
                    onDelete={deleteNote}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. FLOATING "+" BUTTON (Mobile First) */}
      <button
        type="button"
        onClick={handleOpenNewNote}
        className="fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-[#9AF04F] hover:bg-[#8DE840] text-[#0A0D06] flex items-center justify-center shadow-neon-glow active:scale-95 transition-all"
        title="Create Note"
      >
        <Plus className="w-7 h-7 stroke-[3]" />
      </button>

      {/* 6. SIMPLE NOTE EDITOR MODAL */}
      <KeepNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        onSave={handleSaveNote}
        onDelete={deleteNote}
        noteToEdit={editingNote}
        allSubjects={allSubjects}
      />
    </div>
  );
}

export const SemesterView = Semester5;
export default Semester5;

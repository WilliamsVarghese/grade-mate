import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  FileText,
  Tag,
  Calendar,
  Bell,
  Pin,
  ArrowRight,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export function GlobalNotesSearchModal({
  isOpen,
  onClose,
  notes = [],
  semesters = [],
  onSelectNote,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSemesterFilter, setSelectedSemesterFilter] = useState('all');

  // Extract all unique tags across all notes
  const allTags = useMemo(() => {
    const set = new Set();
    notes.forEach((n) => {
      (n.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [notes]);

  // Filter notes globally
  const searchResults = useMemo(() => {
    if (!searchTerm.trim() && !selectedTag && selectedSemesterFilter === 'all') {
      return notes.slice(0, 8); // show recent notes
    }

    const q = searchTerm.toLowerCase().trim();

    return notes.filter((n) => {
      // Semester filter
      if (selectedSemesterFilter !== 'all' && n.semesterId !== selectedSemesterFilter) {
        return false;
      }

      // Tag filter
      if (selectedTag && !(n.tags || []).includes(selectedTag)) {
        return false;
      }

      // Query filter: title, content, subject name, code, tags
      if (q) {
        const titleMatch = (n.title || '').toLowerCase().includes(q);
        const contentMatch = (n.content || '').toLowerCase().includes(q);
        const subjectMatch = (n.subjectName || '').toLowerCase().includes(q);
        const codeMatch = (n.subjectCode || '').toLowerCase().includes(q);
        const tagMatch = (n.tags || []).some((t) => t.toLowerCase().includes(q));
        return titleMatch || contentMatch || subjectMatch || codeMatch || tagMatch;
      }

      return true;
    });
  }, [notes, searchTerm, selectedTag, selectedSemesterFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0F111A] border border-white/[0.12] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] bg-[#131622] shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#9AF04F] shadow-neon-sm" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Global Academic Notes Search
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Big Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9AF04F]" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search across all 8 semesters by title, content, subject, or tag..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-[#171A27] border border-white/[0.1] text-white placeholder:text-slate-500 focus:outline-none focus:border-[#9AF04F] text-sm font-semibold shadow-inner"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter Row: Semester & Tags */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Semester selector */}
            <select
              value={selectedSemesterFilter}
              onChange={(e) => setSelectedSemesterFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#171A27] border border-white/[0.08] text-slate-300 focus:outline-none focus:border-[#9AF04F]"
            >
              <option value="all">All Semesters</option>
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Tag Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 custom-scrollbar max-w-full">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    selectedTag === tag
                      ? 'bg-[#9AF04F] text-[#0A0D06] shadow-neon-sm'
                      : 'bg-white/[0.05] text-slate-400 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 custom-scrollbar">
          <div className="text-xs font-semibold text-slate-400 mb-2 flex items-center justify-between">
            <span>
              {searchTerm || selectedTag || selectedSemesterFilter !== 'all'
                ? `Found ${searchResults.length} matching notes`
                : 'Recent Notes across all semesters'}
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {notes.length} total notes stored
            </span>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border border-dashed border-white/[0.08]">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No matching notes found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with different terms or clear tag and semester filters.
              </p>
            </div>
          ) : (
            searchResults.map((note) => {
              const semObj = semesters.find((s) => s.id === note.semesterId);
              const semName = semObj ? semObj.name : note.semesterId?.replace('sem-', 'Semester ') || 'Sem';

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-[#131622] border border-white/[0.06] hover:border-[#9AF04F]/40 cursor-pointer transition-all hover:bg-[#161927] group"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-white">
                        {semName}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-[#9AF04F]">
                        {note.subjectCode || 'CORE'}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {note.subjectName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {note.isPinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9AF04F]/20 text-[#9AF04F] flex items-center gap-1">
                          <Pin className="w-3 h-3 fill-current" />
                          Pinned
                        </span>
                      )}
                      {note.hasReminder && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9655F5]/20 text-[#C084FC] flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          Reminder
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#9AF04F] transition-colors mb-1">
                    {note.title}
                  </h4>

                  {note.content && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {note.content}
                    </p>
                  )}

                  {/* Tags & Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(note.tags || []).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-[#9AF04F] inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

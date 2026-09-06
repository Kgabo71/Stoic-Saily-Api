import React, { useState, useEffect } from 'react';
import { JournalEntry } from '../types';
import { AmbientCard } from './AmbientCard';
import { 
  Feather, 
  Sun, 
  Moon, 
  Trash2, 
  Calendar, 
  Sparkles, 
  Check, 
  Plus, 
  BookMarked 
} from 'lucide-react';

interface JournalTabProps {
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

const STORAGE_KEY = 'stoic_journal_entries';

export const JournalTab: React.FC<JournalTabProps> = ({
  initialPrompt,
  onClearInitialPrompt
}) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [entryType, setEntryType] = useState<'morning' | 'evening' | 'freeform'>('morning');
  const [prompt, setPrompt] = useState(initialPrompt || 'What challenges will test my temperance or justice today, and how will I respond?');
  const [content, setContent] = useState('');
  const [virtue, setVirtue] = useState<'wisdom' | 'courage' | 'justice' | 'temperance'>('wisdom');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setEntries(JSON.parse(saved));
      } else {
        // Initial sample entry
        const sample: JournalEntry = {
          id: 'sample-1',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          type: 'morning',
          prompt: 'When you wake up in the morning, tell yourself: The people I deal with today will be meddling and difficult...',
          content: 'I will remain centered today regardless of team friction. If someone speaks harshly, I will recognize it stems from confusion or stress, not personal malice. My only job is to govern my own response with dignity and clarity.',
          virtueApplied: 'wisdom',
          moodRating: 4
        };
        setEntries([sample]);
      }
    } catch (e) {
      console.warn('Could not read journal from localStorage:', e);
    }
  }, []);

  // Update prompt if opened with one
  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      setIsWriting(true);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      type: entryType,
      prompt,
      content,
      virtueApplied: virtue,
      moodRating: 5
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    setContent('');
    setIsWriting(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleDeleteEntry = (id: string) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const setTypeTemplate = (type: 'morning' | 'evening' | 'freeform') => {
    setEntryType(type);
    if (type === 'morning') {
      setPrompt('Morning Preparation: Which external events or individuals might disrupt my serenity today? How will I anchor myself in virtue?');
    } else if (type === 'evening') {
      setPrompt('Seneca\'s Night Audit: What fault did I overcome today? Where did I act with patience or courage? What could I improve tomorrow?');
    } else {
      setPrompt('Stoic Contemplation: Reflections on impermanence, friendship, and the cosmic perspective.');
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
            Marcus Aurelius's Private Notebook
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Stoic Reflections & Journal
          </h2>
        </div>

        {!isWriting && (
          <button
            id="new-journal-entry-btn"
            onClick={() => setIsWriting(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-text)',
              boxShadow: '0 4px 16px -2px var(--glow-strong)'
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Reflection</span>
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold text-emerald-500 bg-emerald-500/10 border-emerald-500/20">
          <Check className="w-4 h-4" />
          <span>Your reflection has been sealed into your private Stoic journal.</span>
        </div>
      )}

      {/* Editor Drawer */}
      {isWriting && (
        <AmbientCard elevation="md" className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
              <Feather className="w-4 h-4" />
              <span>Compose Reflection</span>
            </div>

            {/* Morning vs Evening toggle */}
            <div className="flex rounded-xl p-0.5 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
              <button
                type="button"
                id="btn-template-morning"
                onClick={() => setTypeTemplate('morning')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                  entryType === 'morning' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'opacity-70'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>Morning</span>
              </button>
              <button
                type="button"
                id="btn-template-evening"
                onClick={() => setTypeTemplate('evening')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                  entryType === 'evening' ? 'bg-indigo-500/20 text-indigo-400 font-bold' : 'opacity-70'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>Evening</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                Philosophical Prompt
              </label>
              <input
                id="journal-prompt-input"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border text-xs font-serif italic focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                Your Honest Examination
              </label>
              <textarea
                id="journal-content-textarea"
                rows={5}
                required
                placeholder="Write candidly to yourself, as Marcus did in his camp along the Gran..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3.5 rounded-xl border text-xs sm:text-sm font-serif leading-relaxed focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Virtue practiced selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>
                  Virtue Focus:
                </span>
                {(['wisdom', 'courage', 'justice', 'temperance'] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    id={`journal-virtue-${v}`}
                    onClick={() => setVirtue(v)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold border transition-all ${
                      virtue === v ? 'ring-1' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: virtue === v ? 'var(--glow-color)' : 'transparent',
                      borderColor: 'var(--border-color)',
                      color: virtue === v ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="cancel-journal-btn"
                  onClick={() => setIsWriting(false)}
                  className="px-3.5 py-2 rounded-xl border text-xs font-semibold hover:bg-white/10"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  id="save-journal-btn"
                  className="px-5 py-2 rounded-xl text-xs font-bold shadow-md active:scale-95"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--accent-text)'
                  }}
                >
                  Save Entry
                </button>
              </div>
            </div>
          </form>
        </AmbientCard>
      )}

      {/* Journal Entries List */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Past Entries ({entries.length})
        </h3>

        {entries.length === 0 ? (
          <AmbientCard elevation="sm" className="p-8 text-center">
            <BookMarked className="w-10 h-10 mx-auto mb-2 opacity-40" style={{ color: 'var(--accent-primary)' }} />
            <p className="font-cinzel text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              No Journal Entries Yet
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Begin your morning preparation or evening review to train your ruling center.
            </p>
          </AmbientCard>
        ) : (
          entries.map((item) => (
            <AmbientCard key={item.id} elevation="sm" className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md border text-[10px] uppercase font-bold" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--accent-primary)' }}>
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                    <Calendar className="w-3 h-3" />
                    {item.date}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-primary)' }}>
                    Virtue: {item.virtueApplied}
                  </span>
                </div>

                <button
                  id={`delete-entry-${item.id}`}
                  onClick={() => handleDeleteEntry(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-stone-500 transition-colors"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-serif italic text-xs font-semibold mb-2" style={{ color: 'var(--accent-primary)' }}>
                "{item.prompt}"
              </h4>

              <p className="font-serif text-xs sm:text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>
                {item.content}
              </p>
            </AmbientCard>
          ))
        )}
      </div>
    </div>
  );
};

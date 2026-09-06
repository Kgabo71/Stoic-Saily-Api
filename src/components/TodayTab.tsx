import React, { useState } from 'react';
import { StoicQuote } from '../types';
import { STOIC_QUOTES, VIRTUES } from '../data/stoicData';
import { AmbientCard } from './AmbientCard';
import { 
  Sparkles, 
  Bookmark, 
  Share2, 
  Volume2, 
  Compass, 
  Feather, 
  Sun, 
  Moon, 
  ChevronRight, 
  ChevronLeft,
  RefreshCw,
  Check,
  Flame,
  Heart
} from 'lucide-react';

interface TodayTabProps {
  onOpenJournal: (prompt: string) => void;
  onOpenLibrary: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ onOpenJournal, onOpenLibrary }) => {
  // Pick quote based on day of year, or let user cycle through wisdom
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReflection, setShowReflection] = useState(true);
  const [activeVirtue, setActiveVirtue] = useState<number | null>(null);

  const currentQuote: StoicQuote = STOIC_QUOTES[Math.abs(quoteIndex) % STOIC_QUOTES.length] || STOIC_QUOTES[0];

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % STOIC_QUOTES.length);
    setIsBookmarked(false);
  };

  const handlePrevQuote = () => {
    setQuoteIndex((prev) => (prev - 1 + STOIC_QUOTES.length) % STOIC_QUOTES.length);
    setIsBookmarked(false);
  };

  const handleCopyQuote = () => {
    const text = `"${currentQuote.text}" — ${currentQuote.author}, ${currentQuote.work}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Harmonious Web Audio Bell Chime (Synthesized peaceful meditation tone)
  const playContemplationChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Fundamental frequency (C#4 - 277.18 Hz) + harmonic overtone
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(277.18, ctx.currentTime);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(554.36, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 3.6);
      osc2.stop(ctx.currentTime + 3.6);
    } catch (e) {
      console.warn('Audio chime context error:', e);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 pb-8">
      {/* Date & Streak Header from Sophisticated Dark theme */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: 'var(--accent-primary)' }}>
            The Daily Stoa
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-[#E0E0E0]">
            {todayDate}
          </h2>
        </div>

        {/* Streak Component */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] text-white/40 tracking-[0.2em] uppercase font-bold">Streak</span>
            <span className="text-[#B8860B] text-xs font-mono font-bold">Day 42</span>
          </div>
          <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full w-[42%] bg-[#B8860B] shadow-[0_0_10px_rgba(184,134,11,0.5)] rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero Ambient Glowing Card — Daily Stoic Meditation */}
      <div 
        className="w-full bg-[#0C0C0C] rounded-[36px] sm:rounded-[40px] p-6 sm:p-10 border border-white/10 glowing-card flex flex-col items-center text-center relative overflow-hidden transition-all duration-300"
      >
        {/* Subtle top interior illumination */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[40px] opacity-40"
          style={{ background: 'radial-gradient(ellipse at top, rgba(184, 134, 11, 0.12) 0%, transparent 70%)' }}
        />

        {/* Top bar controls */}
        <div className="w-full flex items-center justify-between z-10 mb-4">
          <span className="text-[9px] px-2.5 py-1 rounded-full border border-white/10 text-[#B8860B] uppercase font-bold tracking-[0.2em] bg-white/5">
            {currentQuote.discipline} • {currentQuote.conceptEnglish || 'MEDITATION'}
          </span>

          <div className="flex items-center gap-1">
            <button
              id="audio-chime-btn"
              onClick={playContemplationChime}
              title="Sound mindfulness chime"
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-[#B8860B]"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              id="copy-quote-btn"
              onClick={handleCopyQuote}
              title="Copy quote to clipboard"
              className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Golden accent indicator */}
        <div className="mb-6 w-12 h-1 bg-[#B8860B]/30 rounded-full mx-auto" />

        {/* The Quote Body in Georgia Serif */}
        <blockquote className="my-2 max-w-xl z-10">
          <p className="text-xl sm:text-2xl lg:text-3xl serif italic leading-relaxed text-white">
            '{currentQuote.text}'
          </p>
        </blockquote>

        {/* Author Signature & Open Library Metadata */}
        <div className="flex flex-col items-center mt-6 z-10">
          <cite className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#B8860B] font-bold mb-1.5 not-italic">
            {currentQuote.author}
          </cite>
          <span className="text-[11px] text-white/30 font-medium">
            Source: {currentQuote.work}
          </span>

          {/* Open Library & Era Badges */}
          <div className="mt-4 flex items-center space-x-2">
            <span className="text-[10px] px-2.5 py-0.5 rounded border border-white/10 text-white/40 uppercase font-mono">
              {currentQuote.openLibraryEdition || 'OL6741753M'}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded border border-white/10 text-white/40 uppercase">
              {currentQuote.era || '161 AD'}
            </span>
          </div>
        </div>

        {/* Interactive Stoic Reflection Accordion */}
        <div className="w-full mt-6 pt-5 border-t border-white/10 z-10 text-left">
          <div className="flex items-center justify-between">
            <button
              id="toggle-reflection-btn"
              onClick={() => setShowReflection(!showReflection)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] transition-colors text-[#B8860B] hover:text-[#d4af37]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Philosopher's Reflection</span>
            </button>

            <button
              id="journal-quote-btn"
              onClick={() => onOpenJournal(currentQuote.reflectionPrompt)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[#E0E0E0] hover:bg-white/10 transition-all active:scale-95"
            >
              <Feather className="w-3 h-3 text-[#B8860B]" />
              <span>Write Reflection</span>
            </button>
          </div>

          {showReflection && (
            <div className="mt-3 p-4 rounded-xl border border-white/5 bg-black/40 text-xs sm:text-sm leading-relaxed">
              <p className="serif mb-2 text-white/80">
                {currentQuote.context}
              </p>
              <p className="font-bold pt-2 border-t border-white/5 text-[#B8860B]">
                Daily Question: {currentQuote.reflectionPrompt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sophisticated Dark Wisdom Controls (Previous, Save to Soul, Next Wisdom) */}
      <div className="h-20 px-4 flex items-center justify-center space-x-8 sm:space-x-12 z-10">
        <button 
          id="prev-wisdom-btn"
          onClick={handlePrevQuote}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-1.5 group-hover:border-[#B8860B]/40 group-active:scale-95 transition-all bg-[#0C0C0C]">
            <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 font-medium">Previous</span>
        </button>

        <button 
          id="save-to-soul-btn"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1.5 shadow-[0_0_25px_rgba(184,134,11,0.3)] group-hover:scale-105 active:scale-95 transition-all ${isBookmarked ? 'bg-amber-400 text-black' : 'bg-[#B8860B] text-black'}`}>
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-black' : ''}`} />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">
            {isBookmarked ? 'Saved in Soul' : 'Save to Soul'}
          </span>
        </button>

        <button 
          id="next-wisdom-btn"
          onClick={handleNextQuote}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-1.5 group-hover:border-[#B8860B]/40 group-active:scale-95 transition-all bg-[#0C0C0C]">
            <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/30 group-hover:text-white/60 font-medium">Next Wisdom</span>
        </button>
      </div>

      {/* The Four Cardinal Virtues Bar */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#B8860B]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E0E0E0]">
              The Four Cardinal Virtues
            </h3>
          </div>
          <span className="text-[10px] text-white/40">
            Tap to contemplate
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {VIRTUES.map((v, i) => {
            const isSelected = activeVirtue === i;
            return (
              <button
                key={v.name}
                id={`virtue-btn-${v.name.toLowerCase()}`}
                onClick={() => setActiveVirtue(isSelected ? null : i)}
                className={`p-3 rounded-2xl border text-left transition-all bg-[#0C0C0C] ${
                  isSelected ? 'border-[#B8860B] shadow-[0_0_20px_rgba(184,134,11,0.25)]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#E0E0E0]">
                    {v.name}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                </div>
                <p className="text-[10px] serif italic truncate text-[#B8860B]">
                  {v.greek}
                </p>
                {isSelected && (
                  <p className="text-[11px] mt-2 pt-2 border-t border-white/10 leading-snug text-white/70">
                    {v.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amor Fati & Memento Mori Micro Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
              <Flame className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0]">
                Amor Fati
              </h4>
              <p className="text-[11px] text-white/60">
                Love not just what is pleasant, but everything that occurs.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-white/10 bg-white/5">
              <Moon className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0]">
                Memento Mori
              </h4>
              <p className="text-[11px] text-white/60">
                You could leave life right now. Let that determine what you do.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Library Quick Feature */}
      <div 
        onClick={onOpenLibrary}
        className="p-5 rounded-3xl border border-white/10 bg-[#0C0C0C] cursor-pointer flex items-center justify-between group hover:border-[#B8860B]/40 transition-all glowing-card"
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-md border border-white/10"
          >
            <img 
              src="https://covers.openlibrary.org/b/id/8231856-M.jpg" 
              alt="Meditations Open Library"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded border border-white/10 text-[#B8860B] bg-white/5">
                Open Library Integration
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold mt-1 text-[#E0E0E0]">
              Explore the Classical Stoic Stoa
            </h4>
            <p className="text-xs text-white/60">
              Browse Marcus Aurelius, Seneca & Epictetus scanned texts on Open Library.
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl text-[#B8860B]">
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { StoicQuote, OpenLibraryDoc } from '../types';
import { STOIC_QUOTES, VIRTUES, getDayOfYear } from '../data/stoicData';
import { aiVoiceService, STOIC_PERSONAS, StoicPersona } from '../services/aiVoiceService';
import { getStreakData, onStreakChange, manuallyCheckInToday, recordStreakActivity, StreakData } from '../services/streakService';
import { 
  Sparkles, 
  Bookmark, 
  Share2, 
  Volume2, 
  Pause, 
  Play, 
  RotateCcw, 
  Compass, 
  Feather, 
  Sun, 
  Moon, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Flame, 
  BookOpen, 
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

interface TodayTabProps {
  onOpenJournal: (prompt: string) => void;
  onOpenLibrary: () => void;
  onSelectBook?: (book: OpenLibraryDoc) => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({ 
  onOpenJournal, 
  onOpenLibrary, 
  onSelectBook 
}) => {
  // Compute day of year dynamically so teachings update every calendar day
  const todayDayOfYear = useMemo(() => getDayOfYear(new Date()), []);
  const [currentCalendarDay, setCurrentCalendarDay] = useState(todayDayOfYear);
  const [quoteIndex, setQuoteIndex] = useState(todayDayOfYear);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReflection, setShowReflection] = useState(true);
  const [activeVirtue, setActiveVirtue] = useState<number | null>(null);

  // Real Daily Streak State
  const [streakData, setStreakData] = useState<StreakData>(getStreakData());

  // AI Voice Reader State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activePersona, setActivePersona] = useState<StoicPersona>(aiVoiceService.getActivePersona());

  const currentQuote: StoicQuote = STOIC_QUOTES[Math.abs(quoteIndex) % STOIC_QUOTES.length] || STOIC_QUOTES[0];
  const isViewingToday = quoteIndex === currentCalendarDay;

  // Check for calendar day rollover (e.g. when app stays open across midnight)
  useEffect(() => {
    const checkMidnightRollover = () => {
      const freshDay = getDayOfYear(new Date());
      if (freshDay !== currentCalendarDay) {
        setCurrentCalendarDay(freshDay);
        // If user was viewing today's teaching, advance to the new day automatically
        setQuoteIndex((prev) => (prev === currentCalendarDay ? freshDay : prev));
      }
    };

    const intervalId = setInterval(checkMidnightRollover, 60000);
    window.addEventListener('focus', checkMidnightRollover);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', checkMidnightRollover);
    };
  }, [currentCalendarDay]);

  useEffect(() => {
    setStreakData(getStreakData());
    const unsubscribeStreak = onStreakChange((data) => {
      setStreakData(data);
    });

    const unsubscribeVoice = aiVoiceService.subscribeState((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsPaused(state.isPaused);
      setActivePersona(aiVoiceService.getActivePersona());
    });

    return () => {
      unsubscribeStreak();
      unsubscribeVoice();
    };
  }, []);

  const handleNextQuote = () => {
    aiVoiceService.stop();
    setQuoteIndex((prev) => (prev + 1));
    setIsBookmarked(false);
    recordStreakActivity('readWisdom');
  };

  const handlePrevQuote = () => {
    aiVoiceService.stop();
    setQuoteIndex((prev) => (prev - 1));
    setIsBookmarked(false);
    recordStreakActivity('readWisdom');
  };

  const handleReturnToToday = () => {
    aiVoiceService.stop();
    setQuoteIndex(currentCalendarDay);
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

  const handleToggleVoice = async () => {
    if (isSpeaking && !isPaused) {
      aiVoiceService.pause();
    } else if (isPaused) {
      aiVoiceService.resume();
    } else {
      // Build natural spoken philosophical text
      const speechText = `${currentQuote.text}. By ${currentQuote.author}, from ${currentQuote.work}. Philosophical reflection: ${currentQuote.context}. Daily meditation question: ${currentQuote.reflectionPrompt}`;
      recordStreakActivity('aiListen');
      await aiVoiceService.speakText(speechText, { withChime: true });
    }
  };

  const handleStopVoice = () => {
    aiVoiceService.stop();
  };

  const handleSelectPersona = (personaId: string) => {
    aiVoiceService.setPersona(personaId);
    setActivePersona(aiVoiceService.getActivePersona());
    if (isSpeaking) {
      handleToggleVoice();
    }
  };

  const handleOpenCurrentDocument = () => {
    if (onSelectBook) {
      // Create document object pointing to this specific classical work
      const doc: OpenLibraryDoc = {
        key: currentQuote.work.includes('Meditations') ? '/works/OL12345W'
          : currentQuote.work.includes('Letters') ? '/works/OL15438865W'
          : currentQuote.work.includes('Enchiridion') ? '/works/OL66749W'
          : '/works/OL15438902W',
        title: currentQuote.work,
        author_name: [currentQuote.author],
        first_publish_year: currentQuote.era ? parseInt(currentQuote.era) : 161,
        edition_count: 85,
        cover_i: currentQuote.work.includes('Meditations') ? 8231856 : 8231998,
        subject: [currentQuote.discipline, 'Philosophy', 'Stoicism', 'Ethics']
      };
      recordStreakActivity('openLibraryRead');
      onSelectBook(doc);
    } else {
      onOpenLibrary();
    }
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Date & Live Real Streak Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B8860B]">
              The Daily Stoa
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 text-[#B8860B] font-mono">
              <CalendarDays className="w-3 h-3" /> Day {currentCalendarDay} of 365
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-[#E0E0E0] mt-0.5">
            {todayDate}
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            Teachings rotate automatically each day according to the solar calendar.
          </p>
        </div>

        {/* Real Dynamic Streak Widget */}
        <div className="flex items-center gap-3 bg-[#111111] px-4 py-2.5 rounded-2xl border border-white/10 shadow-md">
          <div className="p-2 rounded-xl bg-[#B8860B]/15 text-[#B8860B]">
            <Flame className="w-5 h-5 fill-current animate-pulse text-[#B8860B]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-mono font-bold text-sm">
                Day {streakData.currentStreak}
              </span>
              <span className="text-[10px] text-[#B8860B] font-bold uppercase tracking-wider">
                Streak
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-white/50">
                Best: {streakData.bestStreak}d
              </span>
              {streakData.todayCompleted ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Checked in
                </span>
              ) : (
                <button
                  onClick={() => {
                    const res = manuallyCheckInToday();
                    setStreakData(res);
                  }}
                  className="text-[10px] text-[#B8860B] underline hover:text-amber-300"
                >
                  Check in today
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Browsing Historical/Future Teaching Banner */}
      {!isViewingToday && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#B8860B]/10 border border-[#B8860B]/30 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#B8860B] font-bold">Browsing Wisdom Archive</span>
            <span className="text-white/40">•</span>
            <span className="text-white/70">
              Viewing Day {((Math.abs(quoteIndex) - 1) % 365) + 1} of 365
            </span>
          </div>
          <button
            onClick={handleReturnToToday}
            className="px-3 py-1 rounded-full bg-[#B8860B] text-black font-semibold text-[11px] hover:bg-amber-300 transition-all shadow-sm"
          >
            Return to Today's Teaching
          </button>
        </div>
      )}

      {/* Hero Glowing Meditation Card */}
      <div 
        className="w-full bg-[#0C0C0C] rounded-[36px] sm:rounded-[40px] p-6 sm:p-10 border border-white/10 glowing-card flex flex-col items-center text-center relative overflow-hidden transition-all duration-300"
      >
        {/* Subtle top interior radiance */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-[40px] opacity-35"
          style={{ background: 'radial-gradient(ellipse at top, rgba(184, 134, 11, 0.15) 0%, transparent 70%)' }}
        />

        {/* Top Control Bar with AI Voice Persona & Tools */}
        <div className="w-full flex flex-wrap items-center justify-between z-10 mb-6 gap-2">
          <span className="text-[10px] px-3 py-1 rounded-full border border-white/10 text-[#B8860B] uppercase font-bold tracking-[0.2em] bg-white/5">
            {isViewingToday ? "TODAY'S TEACHING" : `ARCHIVE DAY ${((Math.abs(quoteIndex) - 1) % 365) + 1}`} • {currentQuote.discipline}
          </span>

          <div className="flex items-center gap-2">
            {/* AI Voice Selector */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 border border-white/10 text-xs">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Narrator:</span>
              <select
                value={activePersona.id}
                onChange={(e) => handleSelectPersona(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
              >
                {STOIC_PERSONAS.map(p => (
                  <option key={p.id} value={p.id} className="bg-[#151515] text-white">
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Voice Play/Pause Button */}
            <button
              id="voice-read-quote-btn"
              onClick={handleToggleVoice}
              title="Listen to this meditation read aloud with human-like AI voice"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 shadow-md ${
                isSpeaking && !isPaused
                  ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-[#B8860B] hover:bg-[#d4af37] text-black shadow-[0_0_12px_rgba(184,134,11,0.25)]'
              }`}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Voice</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>AI Voice Reader</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopVoice}
                className="p-1.5 rounded-full border border-white/10 text-white/60 hover:text-white transition-all"
                title="Stop audio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

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

        {/* Golden accent bar */}
        <div className="mb-6 w-12 h-1 bg-[#B8860B]/40 rounded-full mx-auto" />

        {/* The Quote Body */}
        <blockquote className="my-2 max-w-2xl z-10">
          <p className="text-xl sm:text-2xl lg:text-3xl font-serif italic leading-relaxed text-white">
            "{currentQuote.text}"
          </p>
        </blockquote>

        {/* Author Signature & Open Library Action */}
        <div className="flex flex-col items-center mt-6 z-10">
          <cite className="text-sm uppercase tracking-[0.25em] text-[#B8860B] font-bold mb-1.5 not-italic">
            {currentQuote.author}
          </cite>
          
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            <span className="text-xs text-white/60 font-medium">
              Source: {currentQuote.work}
            </span>
            <span className="text-white/30">•</span>
            {/* Pop up specific document in app button */}
            <button
              id="read-source-doc-btn"
              onClick={handleOpenCurrentDocument}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 text-[#B8860B] hover:text-amber-300 text-xs font-semibold transition-colors hover:border-[#B8860B]"
            >
              <BookOpen className="w-3 h-3" />
              <span>Read Document & Text</span>
            </button>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <span className="text-[10px] px-2.5 py-0.5 rounded border border-white/10 text-white/40 uppercase font-mono">
              {currentQuote.openLibraryEdition || 'OL6741753M'}
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded border border-white/10 text-white/40 uppercase">
              {currentQuote.era || '161 CE'}
            </span>
          </div>
        </div>

        {/* Interactive Stoic Reflection */}
        <div className="w-full mt-8 pt-6 border-t border-white/10 z-10 text-left">
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-white/10 bg-white/5 text-[#E0E0E0] hover:bg-white/10 transition-all active:scale-95"
            >
              <Feather className="w-3 h-3 text-[#B8860B]" />
              <span>Write Reflection</span>
            </button>
          </div>

          {showReflection && (
            <div className="mt-4 p-5 rounded-2xl border border-white/10 bg-black/50 text-sm leading-relaxed space-y-3 font-serif">
              <p className="text-white/85">
                {currentQuote.context}
              </p>
              <p className="font-bold pt-3 border-t border-white/10 text-[#B8860B] font-sans text-xs sm:text-sm">
                Daily Inquiry: {currentQuote.reflectionPrompt}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wisdom Navigation Controls */}
      <div className="flex items-center justify-center space-x-6 sm:space-x-12 z-10">
        <button 
          id="prev-wisdom-btn"
          onClick={handlePrevQuote}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-1.5 group-hover:border-[#B8860B]/40 group-active:scale-95 transition-all bg-[#0C0C0C]">
            <ChevronLeft className="w-5 h-5 text-white/60 group-hover:text-white" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/70 font-medium">Previous</span>
        </button>

        <button 
          id="save-to-soul-btn"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1.5 shadow-[0_0_25px_rgba(184,134,11,0.3)] group-hover:scale-105 active:scale-95 transition-all ${isBookmarked ? 'bg-amber-400 text-black' : 'bg-[#B8860B] text-black'}`}>
            <Bookmark className={`w-6 h-6 ${isBookmarked ? 'fill-black' : ''}`} />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/70 font-bold">
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
          <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/70 font-medium">Next Wisdom</span>
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
          <span className="text-[10px] text-white/50">
            Daily Focus: <span className="text-[#B8860B] font-semibold">{VIRTUES[Math.abs(currentCalendarDay) % VIRTUES.length].name}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VIRTUES.map((v, i) => {
            const isSelected = activeVirtue === i;
            const isTodayVirtue = i === (Math.abs(currentCalendarDay) % VIRTUES.length);
            return (
              <button
                key={v.name}
                id={`virtue-btn-${v.name.toLowerCase()}`}
                onClick={() => setActiveVirtue(isSelected ? null : i)}
                className={`p-4 rounded-2xl border text-left transition-all bg-[#0C0C0C] relative overflow-hidden ${
                  isSelected 
                    ? 'border-[#B8860B] shadow-[0_0_20px_rgba(184,134,11,0.25)]' 
                    : isTodayVirtue
                    ? 'border-[#B8860B]/40 bg-gradient-to-b from-[#B8860B]/10 to-transparent'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {isTodayVirtue && (
                  <span className="absolute top-1 right-2 text-[8px] uppercase tracking-wider text-[#B8860B] font-bold">
                    Today
                  </span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#E0E0E0]">
                    {v.name}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                </div>
                <p className="text-[10px] font-serif italic truncate text-[#B8860B]">
                  {v.greek}
                </p>
                {isSelected && (
                  <p className="text-[11px] mt-2 pt-2 border-t border-white/10 leading-snug text-white/70 font-sans">
                    {v.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amor Fati & Memento Mori Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl border border-white/10 bg-white/5">
              <Flame className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0]">
                Amor Fati
              </h4>
              <p className="text-xs text-white/60 mt-0.5">
                Love not just what is pleasant, but whatever circumstance arrives.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/10 bg-[#0C0C0C] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl border border-white/10 bg-white/5">
              <Moon className="w-5 h-5 text-[#B8860B]" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#E0E0E0]">
                Memento Mori
              </h4>
              <p className="text-xs text-white/60 mt-0.5">
                You could leave life right now. Let that determine what you do and say.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Open Library Classical Archive Banner */}
      <div 
        id="open-library-spotlight-card"
        onClick={handleOpenCurrentDocument}
        className="p-6 rounded-3xl border border-white/10 bg-[#0C0C0C] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-[#B8860B]/40 transition-all glowing-card"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
            <img 
              src="https://covers.openlibrary.org/b/id/8231856-M.jpg" 
              alt="Meditations Open Library"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-0.5 rounded border border-white/10 text-[#B8860B] bg-white/5">
                Open Library Scanned Archive
              </span>
              <span className="text-[10px] text-white/40 font-mono">OL12345W</span>
            </div>
            <h4 className="text-base font-bold mt-1 text-[#E0E0E0] font-serif">
              Marcus Aurelius — Meditations
            </h4>
            <p className="text-xs text-white/60 mt-0.5">
              Click to pop up the document reader in the app and listen to chapters with the AI voice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <span className="text-xs text-[#B8860B] font-semibold group-hover:underline">Open Document Reader</span>
          <div className="p-2 rounded-xl text-[#B8860B] bg-white/5 border border-white/10">
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

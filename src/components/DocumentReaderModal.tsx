import React, { useState, useEffect, useRef } from 'react';
import { OpenLibraryDoc, OpenLibraryWorkDetails } from '../types';
import { fetchWorkDetails, getBookCoverUrl } from '../services/openLibrary';
import { getDocumentByOpenLibraryKey, StoicDocument, DocumentChapter } from '../data/stoicTexts';
import { aiVoiceService, STOIC_PERSONAS, StoicPersona } from '../services/aiVoiceService';
import { recordStreakActivity } from '../services/streakService';
import { 
  X, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Bookmark, 
  CheckCircle, 
  Calendar, 
  Globe, 
  ExternalLink, 
  Type, 
  ChevronRight, 
  Sparkles, 
  Check, 
  Copy,
  Flame,
  UserCheck
} from 'lucide-react';

interface DocumentReaderModalProps {
  book: OpenLibraryDoc | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (book: OpenLibraryDoc) => void;
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  isSaved,
  onToggleSave
}) => {
  const [workDetails, setWorkDetails] = useState<OpenLibraryWorkDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [stoicDoc, setStoicDoc] = useState<StoicDocument | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');

  // AI Voice Reader State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(-1);
  const [activePersona, setActivePersona] = useState<StoicPersona>(aiVoiceService.getActivePersona());
  const [voiceRate, setVoiceRate] = useState<number>(1.0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);

  const readerContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to AI voice state changes
  useEffect(() => {
    const unsubscribe = aiVoiceService.subscribeState((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsPaused(state.isPaused);
      setCurrentSentenceIndex(state.currentSentence);
    });
    return () => {
      unsubscribe();
      aiVoiceService.stop();
    };
  }, []);

  // Fetch real Open Library Work details & link authentic Stoic text
  useEffect(() => {
    if (!book || !isOpen) {
      setWorkDetails(null);
      setStoicDoc(null);
      aiVoiceService.stop();
      return;
    }

    // Try matching authentic classical text chapters
    const matchedDoc = getDocumentByOpenLibraryKey(book.key) || 
                       getDocumentByOpenLibraryKey(book.title);
    setStoicDoc(matchedDoc);
    setActiveChapterIndex(0);

    let isMounted = true;
    if (book.key) {
      setLoadingDetails(true);
      fetchWorkDetails(book.key)
        .then((details) => {
          if (isMounted) {
            setWorkDetails(details);
            setLoadingDetails(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingDetails(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const authorName = book.author_name ? book.author_name.join(', ') : 'Classical Stoic Philosopher';
  const coverUrl = getBookCoverUrl(book.cover_i, 'L');
  const openLibraryUrl = `https://openlibrary.org${book.key}`;

  const currentChapter: DocumentChapter | null = stoicDoc?.chapters[activeChapterIndex] || null;

  // Prepare full chapter text for the AI voice reader
  const getChapterSpeechText = (): string => {
    if (currentChapter) {
      return `${currentChapter.title}. ${currentChapter.subtitle || ''}. ${currentChapter.text.join(' ')}`;
    }
    if (workDetails?.description) {
      const desc = typeof workDetails.description === 'string' 
        ? workDetails.description 
        : workDetails.description.value;
      return `${book.title} by ${authorName}. ${desc}`;
    }
    return `${book.title} by ${authorName}. A foundational treatise preserved in the Open Library classical archives.`;
  };

  const handleStartAudio = async () => {
    if (isPaused) {
      aiVoiceService.resume();
      return;
    }
    const textToRead = getChapterSpeechText();
    // Record streak activity when listening to voice
    recordStreakActivity('openLibraryRead');
    setHasMarkedRead(true);
    await aiVoiceService.speakText(textToRead, { withChime: true });
  };

  const handlePauseAudio = () => {
    aiVoiceService.pause();
  };

  const handleStopAudio = () => {
    aiVoiceService.stop();
  };

  const handlePersonaChange = (personaId: string) => {
    aiVoiceService.setPersona(personaId);
    setActivePersona(aiVoiceService.getActivePersona());
    if (isSpeaking) {
      handleStartAudio();
    }
  };

  const handleRateChange = (rate: number) => {
    setVoiceRate(rate);
    aiVoiceService.setRate(rate);
  };

  const handleCopyParagraph = (text: string, idx: number) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`"${text}" — ${book.title}, ${authorName}`);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleMarkAsRead = () => {
    recordStreakActivity('openLibraryRead');
    setHasMarkedRead(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-text"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-4xl h-[92vh] max-h-[920px] rounded-[32px] sm:rounded-[36px] border flex flex-col relative shadow-2xl overflow-hidden bg-[#0C0C0C] text-[#E0E0E0]"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.12)',
          boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.9), 0 0 60px 10px rgba(184, 134, 11, 0.12)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar with Open Library Badge, Streak and Close Button */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0 bg-[#0A0A0A]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase font-bold tracking-[0.2em] text-[#B8860B]">
              <Globe className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>Open Library Reader</span>
            </div>
            <span className="hidden sm:inline text-xs text-white/40 font-mono">
              {book.key.replace('/works/', '')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mark as read today button */}
            <button
              id="mark-doc-read-btn"
              onClick={handleMarkAsRead}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all active:scale-95 ${
                hasMarkedRead 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400' 
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-[#B8860B]/50 hover:text-white'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${hasMarkedRead ? 'text-emerald-400' : 'text-[#B8860B]'}`} />
              <span>{hasMarkedRead ? 'Read Today' : 'Mark Today Read'}</span>
            </button>

            {/* Font Size Selector */}
            <div className="hidden md:flex items-center border border-white/10 rounded-full p-0.5 bg-white/5">
              <button 
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded-full text-xs font-serif ${fontSize === 'normal' ? 'bg-[#B8860B] text-black font-bold' : 'text-white/60'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded-full text-sm font-serif ${fontSize === 'large' ? 'bg-[#B8860B] text-black font-bold' : 'text-white/60'}`}
              >
                A+
              </button>
              <button 
                onClick={() => setFontSize('huge')}
                className={`px-2 py-0.5 rounded-full text-base font-serif ${fontSize === 'huge' ? 'bg-[#B8860B] text-black font-bold' : 'text-white/60'}`}
              >
                A++
              </button>
            </div>

            {/* Save to Reading Stoa */}
            <button
              id="doc-save-btn"
              onClick={() => onToggleSave(book)}
              title={isSaved ? 'Remove from Saved' : 'Save to Reading Stoa'}
              className={`p-2 rounded-full border transition-all ${
                isSaved 
                  ? 'bg-[#B8860B] border-[#B8860B] text-black' 
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/20'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Close modal */}
            <button
              id="close-reader-modal-btn"
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all ml-1"
              aria-label="Close reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* AI Voice Reader Floating Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-[#111111] flex flex-wrap items-center justify-between gap-3 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              id="ai-reader-play-btn"
              onClick={isSpeaking && !isPaused ? handlePauseAudio : handleStartAudio}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-xs transition-all shadow-md active:scale-95 ${
                isSpeaking && !isPaused
                  ? 'bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]'
                  : 'bg-[#B8860B] hover:bg-[#d4af37] text-black shadow-[0_0_15px_rgba(184,134,11,0.3)]'
              }`}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause AI Voice</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Voice</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen with AI Voice</span>
                </>
              )}
            </button>

            {isSpeaking && (
              <button
                id="ai-reader-stop-btn"
                onClick={handleStopAudio}
                className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
                title="Stop audio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Active Voice Persona Indicator */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <span className="text-[10px] uppercase tracking-widest text-white/40 hidden sm:inline">Voice:</span>
              <select
                id="ai-voice-persona-select"
                value={activePersona.id}
                onChange={(e) => handlePersonaChange(e.target.value)}
                className="bg-black/60 border border-white/10 rounded-lg px-2 py-1 text-xs text-[#E0E0E0] focus:outline-none focus:border-[#B8860B]"
              >
                {STOIC_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#151515] text-white">
                    {p.name} ({p.title.split('•')[0].trim()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speed selector & Equalizer Wave */}
          <div className="flex items-center gap-3">
            {isSpeaking && !isPaused && (
              <div className="flex items-center gap-1">
                <span className="w-1 h-3 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-4 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-5 bg-[#B8860B] rounded-full animate-bounce" style={{ animationDelay: '75ms' }} />
              </div>
            )}

            <div className="flex items-center gap-1 border border-white/10 rounded-lg p-0.5 bg-black/40 text-[11px]">
              {[0.9, 1.0, 1.2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-0.5 rounded ${voiceRate === rate ? 'bg-white/20 text-white font-bold' : 'text-white/50'}`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Document Content Workspace */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Left Column: Chapters / Contents & Metadata */}
          <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 p-5 overflow-y-auto bg-[#090909]/60 flex-shrink-0">
            {/* Book Cover & Author */}
            <div className="flex items-start gap-3.5 mb-5">
              {coverUrl ? (
                <img 
                  src={coverUrl} 
                  alt={book.title} 
                  referrerPolicy="no-referrer"
                  className="w-16 h-24 rounded-lg object-cover border border-white/10 shadow-md flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-24 rounded-lg bg-white/5 border border-white/10 flex flex-col items-center justify-center p-2 text-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-[#B8860B] mb-1" />
                  <span className="text-[8px] uppercase tracking-wider text-white/40">Open Library</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-white font-serif line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-xs text-[#B8860B] font-semibold mt-0.5 truncate">
                  {authorName}
                </p>
                {book.first_publish_year && (
                  <span className="inline-block text-[10px] text-white/40 mt-1">
                    First Pub: {book.first_publish_year} CE
                  </span>
                )}
              </div>
            </div>

            {/* Chapters / Sections List */}
            {stoicDoc && stoicDoc.chapters.length > 0 ? (
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold block mb-2">
                  Passages & Books
                </span>
                <div className="space-y-1.5">
                  {stoicDoc.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        aiVoiceService.stop();
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                        activeChapterIndex === idx 
                          ? 'bg-[#B8860B]/15 border-[#B8860B] text-white font-bold shadow-[0_0_15px_rgba(184,134,11,0.15)]' 
                          : 'border-white/5 hover:border-white/15 bg-white/5 text-white/70'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <span className="text-[10px] text-[#B8860B] block font-mono">
                          {ch.chapterNumber}
                        </span>
                        <span className="truncate block font-medium">
                          {ch.title}
                        </span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 ${activeChapterIndex === idx ? 'text-[#B8860B]' : 'text-white/30'}`} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/50 space-y-3">
                <p>
                  This work is indexed in Open Library. Below you can read the philosophical synopsis, edition records, and curated excerpts.
                </p>
                <a
                  href={openLibraryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-[#B8860B] hover:underline pt-2"
                >
                  <span>View Full Scan on Open Library</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Subjects Tags */}
            {book.subject && book.subject.length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold block mb-2">
                  Themes
                </span>
                <div className="flex flex-wrap gap-1">
                  {book.subject.slice(0, 5).map((s, i) => (
                    <span key={i} className="text-[9px] px-2 py-0.5 rounded border border-white/5 bg-white/5 text-white/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Right Column: The Actual Readable Text */}
          <main 
            ref={readerContainerRef}
            className="flex-1 overflow-y-auto p-6 sm:p-10 relative bg-[#0C0C0C]"
          >
            {currentChapter ? (
              <div className="max-w-2xl mx-auto space-y-6">
                {/* Chapter Header */}
                <div className="border-b border-white/10 pb-5">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#B8860B] uppercase">
                    {currentChapter.chapterNumber}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    {currentChapter.title}
                  </h2>
                  {currentChapter.subtitle && (
                    <p className="text-sm text-white/60 font-serif italic mt-1">
                      {currentChapter.subtitle}
                    </p>
                  )}
                  {stoicDoc.translator && (
                    <span className="text-[11px] text-white/40 mt-2 block font-sans">
                      Translation: {stoicDoc.translator} • Classical Greek / Latin Edition
                    </span>
                  )}
                </div>

                {/* Paragraphs with sentence highlighting and copy */}
                <div className={`space-y-5 font-serif leading-relaxed text-white/90 ${
                  fontSize === 'normal' ? 'text-base sm:text-lg' : fontSize === 'large' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                }`}>
                  {currentChapter.text.map((paragraph, pIdx) => {
                    const isCopied = copiedIndex === pIdx;
                    return (
                      <div 
                        key={pIdx}
                        className="group relative p-3 rounded-2xl transition-colors hover:bg-white/[0.03] border border-transparent hover:border-white/5"
                      >
                        <p className="leading-relaxed">
                          {paragraph}
                        </p>

                        <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity text-xs pt-1 border-t border-white/5">
                          <button
                            onClick={() => handleCopyParagraph(paragraph, pIdx)}
                            className="flex items-center gap-1 text-[11px] text-white/50 hover:text-[#B8860B] transition-colors"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{isCopied ? 'Copied to Clipboard' : 'Copy Passage'}</span>
                          </button>

                          <button
                            onClick={async () => {
                              recordStreakActivity('openLibraryRead');
                              await aiVoiceService.speakText(paragraph, { withChime: false });
                            }}
                            className="flex items-center gap-1 text-[11px] text-[#B8860B] hover:text-amber-400 transition-colors"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>Read This Passage Aloud</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Fallback for General Open Library Work without pre-compiled chapter set */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-white/10 pb-5">
                  <span className="text-xs font-mono font-bold tracking-widest text-[#B8860B] uppercase">
                    Open Library Work Overview
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    {book.title}
                  </h2>
                  <p className="text-sm text-white/60 mt-1">
                    By {authorName}
                  </p>
                </div>

                <div className="space-y-4 text-base sm:text-lg font-serif leading-relaxed text-white/85">
                  {loadingDetails ? (
                    <div className="py-12 text-center text-white/40 text-sm">
                      Retrieving work records from Open Library...
                    </div>
                  ) : (
                    <div>
                      <p className="mb-4">
                        {typeof workDetails?.description === 'string' 
                          ? workDetails.description 
                          : workDetails?.description?.value || 'This classical treatise is indexed in the Open Library global catalog. Readers around the world study this edition for Stoic wisdom and ethical instruction.'}
                      </p>

                      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-3 font-sans text-xs sm:text-sm">
                        <div className="flex items-center gap-2 text-[#B8860B] font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>Internet Archive & Open Library Access</span>
                        </div>
                        <p className="text-white/70">
                          Digital scans and borrowable copies of this edition are hosted through the open-source Internet Archive book preservation project.
                        </p>
                        <a
                          href={openLibraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B8860B] text-black font-semibold text-xs transition-all hover:bg-amber-400"
                        >
                          <span>Open Full Book on Open Library</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

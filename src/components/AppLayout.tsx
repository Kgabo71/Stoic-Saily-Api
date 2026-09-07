import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { 
  Sun, 
  BookOpen, 
  Scale, 
  Feather, 
  Palette, 
  Flame, 
  Volume2, 
  Pause, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { getStreakData, onStreakChange, manuallyCheckInToday, StreakData } from '../services/streakService';
import { aiVoiceService, STOIC_PERSONAS, StoicPersona } from '../services/aiVoiceService';

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenThemeModal: () => void;
  savedBooksCount: number;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeTab,
  onChangeTab,
  onOpenThemeModal,
  savedBooksCount
}) => {
  const [streakData, setStreakData] = useState<StreakData>(getStreakData());
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isVoicePaused, setIsVoicePaused] = useState(false);
  const [activePersona, setActivePersona] = useState<StoicPersona>(aiVoiceService.getActivePersona());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Subscribe to streak updates
  useEffect(() => {
    setStreakData(getStreakData());
    const unsubscribe = onStreakChange((data) => {
      setStreakData(data);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to AI voice state
  useEffect(() => {
    const unsubscribe = aiVoiceService.subscribeState((state) => {
      setIsVoiceSpeaking(state.isSpeaking);
      setIsVoicePaused(state.isPaused);
      setActivePersona(aiVoiceService.getActivePersona());
    });
    return () => unsubscribe();
  }, []);

  const handleManualCheckIn = () => {
    const updated = manuallyCheckInToday();
    setStreakData(updated);
  };

  const navItems: { id: TabType; label: string; sub: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Daily Wisdom', sub: 'Marcus Aurelius & Sages', icon: Sun },
    { id: 'library', label: 'Open Library', sub: 'Classical Texts & Editions', icon: BookOpen },
    { id: 'practices', label: 'Stoic Practices', sub: 'Amor Fati & Memento Mori', icon: Scale },
    { id: 'journal', label: 'Philosopher Journal', sub: 'Reflections & Inquiries', icon: Feather },
    { id: 'settings', label: 'Settings & Appearance', sub: 'Themes & Audio', icon: Palette },
  ];

  const todayActivitiesCount = Object.values(streakData.todayActivities).filter(Boolean).length;
  const highestMilestone = streakData.milestones.filter(m => m.unlocked).pop();

  return (
    <div className="min-h-screen flex bg-[#080808] text-[#E0E0E0] font-sans antialiased relative overflow-x-hidden selection:bg-[#B8860B]/30 selection:text-white">
      {/* Background Subtle Ambient Radiance */}
      <div className="fixed inset-0 active-glow pointer-events-none -z-10" />

      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 h-screen sticky top-0 border-r border-white/5 bg-[#0C0C0C]/90 backdrop-blur-xl p-6 z-30 justify-between flex-shrink-0">
        <div className="space-y-6">
          {/* App Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#B8860B] to-[#705206] flex items-center justify-center text-black font-cinzel font-bold text-lg shadow-[0_0_20px_rgba(184,134,11,0.25)] border border-[#d4af37]/30">
                Σ
              </div>
              <div>
                <h1 className="font-cinzel text-base font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
                  <span>The Stoa</span>
                  <span className="text-[10px] text-[#B8860B] font-mono font-normal">v2.0</span>
                </h1>
                <p className="text-xs text-white/50 font-serif italic">
                  Daily Stoic Wisdom & Texts
                </p>
              </div>
            </div>

            {/* Theme switcher pill */}
            <button
              id="sidebar-theme-btn"
              onClick={onOpenThemeModal}
              className="p-2 rounded-xl border border-white/10 hover:border-[#B8860B]/50 hover:bg-white/5 text-white/60 hover:text-white transition-all group"
              title="Change Theme & Aesthetics"
            >
              <Palette className="w-4 h-4 group-hover:rotate-12 transition-transform text-[#B8860B]" />
            </button>
          </div>

          {/* Real Daily Streak Widget */}
          <div 
            className="p-4 rounded-2xl border border-white/10 bg-[#121212] relative overflow-hidden group shadow-lg"
            style={{
              borderColor: 'rgba(184, 134, 11, 0.2)',
              boxShadow: '0 8px 30px -5px rgba(0, 0, 0, 0.6), 0 0 20px -2px rgba(184, 134, 11, 0.08)'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#B8860B]/20 text-[#B8860B]">
                  <Flame className="w-5 h-5 fill-current animate-pulse text-[#B8860B]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-bold text-white">
                      Day {streakData.currentStreak}
                    </span>
                    <span className="text-[10px] text-[#B8860B] uppercase font-bold tracking-widest">
                      Streak
                    </span>
                  </div>
                  <span className="text-[11px] text-white/50">
                    Best: {streakData.bestStreak} days
                  </span>
                </div>
              </div>

              {streakData.todayCompleted ? (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Active Today</span>
                </div>
              ) : (
                <button
                  id="checkin-streak-btn"
                  onClick={handleManualCheckIn}
                  className="px-2.5 py-1 rounded-full bg-[#B8860B] hover:bg-amber-400 text-black text-[10px] font-bold transition-all shadow-sm active:scale-95"
                >
                  Check In
                </button>
              )}
            </div>

            {/* Daily Practice Progress Bar */}
            <div className="space-y-1.5 mt-2">
              <div className="flex justify-between text-[10px] text-white/50">
                <span>Today's Practices</span>
                <span className="font-mono text-[#B8860B]">{todayActivitiesCount}/3 Done</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#B8860B] to-amber-300 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(15, (todayActivitiesCount / 3) * 100))}%` }}
                />
              </div>
            </div>

            {/* Current Milestone Badge */}
            {highestMilestone && (
              <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-white/40 flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#B8860B]" />
                  <span>Rank:</span>
                </span>
                <span className="text-white/80 font-medium truncate max-w-[170px]">
                  {highestMilestone.badge} {highestMilestone.title}
                </span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => onChangeTab(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all flex items-center justify-between group ${
                    isActive 
                      ? 'bg-white/10 border border-[#B8860B]/40 text-white shadow-[0_0_20px_rgba(184,134,11,0.12)]' 
                      : 'hover:bg-white/5 border border-transparent text-white/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-colors ${
                      isActive ? 'bg-[#B8860B] text-black' : 'bg-white/5 text-white/60 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-white/80'}`}>
                          {item.label}
                        </span>
                        {item.id === 'library' && savedBooksCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#B8860B]/30 border border-[#B8860B]/50 text-[9px] font-mono text-amber-300 font-bold">
                            {savedBooksCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/40 block">
                        {item.sub}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-[#B8860B] translate-x-0.5' : 'text-white/20 group-hover:text-white/40'
                  }`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* AI Voice Status & Quick Control Card */}
        <div className="mt-6 pt-4 border-t border-white/5">
          <div className="p-3.5 rounded-2xl border border-white/10 bg-[#121212] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isVoiceSpeaking && !isVoicePaused ? 'bg-amber-400 animate-ping' : 'bg-white/30'}`} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#B8860B]">
                  AI Reader Voice
                </span>
              </div>
              {isVoiceSpeaking && !isVoicePaused && (
                <span className="text-[10px] font-mono text-amber-300 animate-pulse">
                  Speaking
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="min-w-0 pr-2">
                <p className="font-semibold text-white truncate text-xs">
                  {activePersona.name}
                </p>
                <p className="text-[10px] text-white/40 truncate">
                  {activePersona.title.split('•')[0]}
                </p>
              </div>

              {isVoiceSpeaking ? (
                <button
                  onClick={() => isVoicePaused ? aiVoiceService.resume() : aiVoiceService.pause()}
                  className="p-2 rounded-full bg-[#B8860B] text-black hover:bg-amber-400 transition-all shadow-md"
                  title={isVoicePaused ? 'Resume Voice' : 'Pause Voice'}
                >
                  {isVoicePaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
                </button>
              ) : (
                <button
                  onClick={() => onChangeTab('today')}
                  className="p-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white text-[10px] hover:border-[#B8860B]/40 transition-all"
                >
                  Listen
                </button>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] text-white/30 px-1">
            <span>Open Library Sync • Real Data</span>
            <span className="font-mono">v2.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile & Tablet Header Bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#0C0C0C]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-white/10 text-white/70 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-sm font-bold text-white">THE STOA</span>
              <span className="text-[9px] text-[#B8860B] font-mono px-1.5 py-0.5 rounded border border-[#B8860B]/30 bg-[#B8860B]/10">
                DAILY
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Streak Pill on Mobile */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141414] border border-[#B8860B]/30 text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-[#B8860B] fill-current" />
              <span className="text-white font-bold">{streakData.currentStreak}d</span>
            </div>

            {/* Themes */}
            <button
              onClick={onOpenThemeModal}
              className="p-2 rounded-full border border-white/10 text-white/70 hover:text-white"
              aria-label="Themes"
            >
              <Palette className="w-4 h-4 text-[#B8860B]" />
            </button>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md pt-16 px-6 pb-8 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] text-white/40 font-bold block mb-2">
                Navigation
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChangeTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                      isActive 
                        ? 'bg-[#B8860B]/20 border-[#B8860B] text-white font-bold' 
                        : 'border-white/5 bg-white/5 text-white/70'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-[#B8860B]" />
                    <span className="text-sm font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl border border-white/10 text-white/60 text-center text-xs"
            >
              Close Menu
            </button>
          </div>
        )}

        {/* Main Viewport Content */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
          {children}
        </main>
      </div>
    </div>
  );
};

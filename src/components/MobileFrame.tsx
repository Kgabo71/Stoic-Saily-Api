import React, { useState } from 'react';
import { TabType, ThemeId } from '../types';
import { 
  Sun, 
  BookOpen, 
  Scale, 
  Feather, 
  Palette, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Wifi, 
  Battery, 
  Sparkles 
} from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  onOpenThemeModal: () => void;
  savedBooksCount: number;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onChangeTab,
  onOpenThemeModal,
  savedBooksCount
}) => {
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 transition-colors duration-300 relative">
      {/* Background Active Glow Radial Field */}
      <div className="fixed inset-0 active-glow pointer-events-none -z-10" />

      {/* Top Bar with The Stoa brand, Expo Go badge, view mode toggle & theme button */}
      <header className="w-full max-w-md md:max-w-2xl flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold" style={{ color: 'var(--accent-primary)' }}>
              The Stoa
            </span>
            <span className="text-xs font-serif italic" style={{ color: 'var(--text-secondary)' }}>
              Daily Wisdom
            </span>
          </div>
          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-[0.2em] uppercase shadow-sm"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-primary)'
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] animate-pulse shadow-[0_0_6px_#B8860B]" />
            <span>Expo Go • SDK 52</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Dynamic Theme Switcher Trigger */}
          <button
            id="header-theme-toggle-btn"
            onClick={onOpenThemeModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm group hover:border-[#B8860B]/40"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              boxShadow: '0 4px 14px -2px var(--glow-color)'
            }}
          >
            <Palette className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-[11px] uppercase tracking-wider">Themes</span>
          </button>

          {/* Phone Frame Toggle */}
          <button
            id="toggle-device-frame-btn"
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Phone Frame'}
            className="p-1.5 rounded-full border hover:bg-white/5 hover:border-white/20 transition-all text-white/60"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
            }}
          >
            {isPhoneFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container: Mobile Frame Simulator or Fullscreen */}
      <main 
        className={`w-full transition-all duration-300 relative flex flex-col ${
          isPhoneFrame 
            ? 'max-w-[420px] h-[860px] max-h-[92vh] rounded-[44px] border shadow-2xl overflow-hidden' 
            : 'max-w-3xl min-h-[85vh] rounded-[36px] border shadow-2xl p-4 sm:p-6'
        } glowing-card`}
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 25px 70px -15px rgba(0, 0, 0, 0.9), 0 0 60px 10px rgba(184, 134, 11, 0.08), 0 0 20px 2px rgba(184, 134, 11, 0.05)'
        }}
      >
        {/* iOS / Mobile Status Bar (Visible in phone frame) */}
        {isPhoneFrame && (
          <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between flex-shrink-0 z-30 select-none border-b border-white/5">
            <span className="text-xs font-semibold tracking-tight text-white/70">
              9:41
            </span>

            {/* Dynamic Island Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center border border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-800 mr-2" />
            </div>

            <div className="flex items-center gap-1.5 text-white/70">
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Scrollable Content Viewport */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-3 pb-24 relative no-scrollbar">
          {children}
        </div>

        {/* Expo Native Style Bottom Navigation Tab Bar with Sophisticated Dark nav-blur */}
        <nav 
          className="absolute bottom-0 left-0 right-0 z-40 border-t nav-blur px-2 py-2 flex items-center justify-around"
          style={{
            borderColor: 'var(--border-subtle)',
            boxShadow: '0 -8px 25px -5px rgba(184, 134, 11, 0.08)'
          }}
        >
          {/* Tab 1: Today */}
          <button
            id="nav-tab-today"
            onClick={() => onChangeTab('today')}
            className="flex-1 flex flex-col items-center py-1 transition-all relative group"
            style={{ color: activeTab === 'today' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            <div className="relative">
              <Sun className={`w-5 h-5 transition-transform ${activeTab === 'today' ? 'scale-110' : 'group-hover:scale-105'}`} />
              {activeTab === 'today' && (
                <div 
                  className="absolute -inset-1 rounded-full opacity-60 blur-xs -z-10"
                  style={{ backgroundColor: 'var(--glow-color)' }}
                />
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${activeTab === 'today' ? 'text-white' : 'text-white/40'}`}>
              Today
            </span>
          </button>

          {/* Tab 2: Open Library */}
          <button
            id="nav-tab-library"
            onClick={() => onChangeTab('library')}
            className="flex-1 flex flex-col items-center py-1 transition-all relative group"
            style={{ color: activeTab === 'library' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            <div className="relative">
              <BookOpen className={`w-5 h-5 transition-transform ${activeTab === 'library' ? 'scale-110' : 'group-hover:scale-105'}`} />
              {savedBooksCount > 0 && (
                <span className="absolute -top-1 -right-2 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center text-black bg-[#B8860B]">
                  {savedBooksCount}
                </span>
              )}
              {activeTab === 'library' && (
                <div 
                  className="absolute -inset-1 rounded-full opacity-60 blur-xs -z-10"
                  style={{ backgroundColor: 'var(--glow-color)' }}
                />
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${activeTab === 'library' ? 'text-white' : 'text-white/40'}`}>
              Library
            </span>
          </button>

          {/* Tab 3: Practices */}
          <button
            id="nav-tab-practices"
            onClick={() => onChangeTab('practices')}
            className="flex-1 flex flex-col items-center py-1 transition-all relative group"
            style={{ color: activeTab === 'practices' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            <div className="relative">
              <Scale className={`w-5 h-5 transition-transform ${activeTab === 'practices' ? 'scale-110' : 'group-hover:scale-105'}`} />
              {activeTab === 'practices' && (
                <div 
                  className="absolute -inset-1 rounded-full opacity-60 blur-xs -z-10"
                  style={{ backgroundColor: 'var(--glow-color)' }}
                />
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${activeTab === 'practices' ? 'text-white' : 'text-white/40'}`}>
              Practices
            </span>
          </button>

          {/* Tab 4: Journal */}
          <button
            id="nav-tab-journal"
            onClick={() => onChangeTab('journal')}
            className="flex-1 flex flex-col items-center py-1 transition-all relative group"
            style={{ color: activeTab === 'journal' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            <div className="relative">
              <Feather className={`w-5 h-5 transition-transform ${activeTab === 'journal' ? 'scale-110' : 'group-hover:scale-105'}`} />
              {activeTab === 'journal' && (
                <div 
                  className="absolute -inset-1 rounded-full opacity-60 blur-xs -z-10"
                  style={{ backgroundColor: 'var(--glow-color)' }}
                />
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${activeTab === 'journal' ? 'text-white' : 'text-white/40'}`}>
              Journal
            </span>
          </button>

          {/* Tab 5: Settings / Themes */}
          <button
            id="nav-tab-settings"
            onClick={() => onChangeTab('settings')}
            className="flex-1 flex flex-col items-center py-1 transition-all relative group"
            style={{ color: activeTab === 'settings' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
          >
            <div className="relative">
              <Palette className={`w-5 h-5 transition-transform ${activeTab === 'settings' ? 'scale-110' : 'group-hover:scale-105'}`} />
              {activeTab === 'settings' && (
                <div 
                  className="absolute -inset-1 rounded-full opacity-60 blur-xs -z-10"
                  style={{ backgroundColor: 'var(--glow-color)' }}
                />
              )}
            </div>
            <span className={`text-[9px] uppercase tracking-[0.2em] mt-1 font-bold ${activeTab === 'settings' ? 'text-white' : 'text-white/40'}`}>
              Themes
            </span>
          </button>
        </nav>

        {/* iPhone Bottom Home Bar Indicator (Phone frame only) */}
        {isPhoneFrame && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-white/20 z-50 pointer-events-none" />
        )}
      </main>
    </div>
  );
};

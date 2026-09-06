import React from 'react';
import { THEMES } from '../data/stoicData';
import { ThemeId } from '../types';
import { AmbientCard } from './AmbientCard';
import { 
  Palette, 
  Sliders, 
  BookOpen, 
  Sparkles, 
  Check, 
  Globe, 
  RotateCcw, 
  Info,
  ShieldCheck
} from 'lucide-react';

interface SettingsTabProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  glowIntensity: number;
  onGlowIntensityChange: (val: number) => void;
  onOpenThemeModal: () => void;
}

const STOIC_GLOSSARY = [
  { term: 'Amor Fati', greek: 'Latin', meaning: 'Love of fate. Not merely bearing what is necessary, but loving it.' },
  { term: 'Memento Mori', greek: 'Latin', meaning: 'Remember you must die. The ultimate clarifier of time and priorities.' },
  { term: 'Hēgemonikon', greek: 'Ἡγεμονικόν', meaning: 'The ruling center of the soul; our faculty of judgment and assent.' },
  { term: 'Ataraxia', greek: 'Ἀταραξία', meaning: 'Imperturbable tranquility; freedom from psychological turmoil.' },
  { term: 'Apatheia', greek: 'Ἀπάθεια', meaning: 'Freedom from irrational, destructive passions and anger.' },
  { term: 'Prosochē', greek: 'Προσοχή', meaning: 'Continuous Stoic mindfulness and moral vigilance in every moment.' },
  { term: 'Sympatheia', greek: 'Συμπάθεια', meaning: 'Cosmic mutual interdependence; the realization that all humans are kin.' }
];

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentTheme,
  onSelectTheme,
  glowIntensity,
  onGlowIntensityChange,
  onOpenThemeModal
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pt-1">
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
          Preferences & Foundations
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Themes & Settings
        </h2>
      </div>

      {/* Dynamic Theme Switcher Card */}
      <AmbientCard elevation="md" className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
            <div>
              <h3 className="font-cinzel text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Dynamic Theme Switching
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Switch sanctuary atmospheres and ambient glow colors
              </p>
            </div>
          </div>

          <button
            id="open-theme-palette-modal-btn"
            onClick={onOpenThemeModal}
            className="px-3 py-1.5 rounded-xl border text-xs font-semibold hover:bg-white/10"
            style={{ borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}
          >
            Detailed Palette
          </button>
        </div>

        {/* Quick Theme Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id;
            return (
              <button
                key={theme.id}
                id={`settings-theme-${theme.id}`}
                onClick={() => onSelectTheme(theme.id)}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected ? 'ring-2' : 'hover:scale-[1.02]'
                }`}
                style={{
                  backgroundColor: theme.previewBg,
                  borderColor: isSelected ? theme.previewAccent : 'rgba(255,255,255,0.1)',
                  boxShadow: isSelected ? `0 6px 20px -3px ${theme.previewGlow}` : 'none'
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: theme.previewAccent }} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <p className={`text-xs font-bold truncate ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                  {theme.name}
                </p>
                <p className={`text-[10px] truncate ${theme.isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                  {theme.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </AmbientCard>

      {/* Ambient Glowing Shadow Intensity Control */}
      <AmbientCard elevation="sm" className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="font-cinzel text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Ambient Card Glow Intensity: {Math.round(glowIntensity * 100)}%
          </h3>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          Calibrate the atmospheric card shadows and radiant halo around the daily texts.
        </p>

        <input
          id="settings-glow-slider"
          type="range"
          min="0.3"
          max="1.8"
          step="0.1"
          value={glowIntensity}
          onChange={(e) => onGlowIntensityChange(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg cursor-pointer"
          style={{ accentColor: 'var(--accent-primary)' }}
        />
        <div className="flex justify-between text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
          <span>Soft Subtle Shadow (30%)</span>
          <span>Balanced Radiance (100%)</span>
          <span>Vibrant Aura (180%)</span>
        </div>
      </AmbientCard>

      {/* Open Library Status & Integration Details */}
      <AmbientCard elevation="sm" className="p-5">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-primary)' }}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-cinzel text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Open Library APIs Status
            </h3>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Connected to <strong>https://openlibrary.org</strong> and <strong>https://covers.openlibrary.org</strong>. Book metadata, historical publish dates, edition scans, and author portraits are fetched live from the non-profit Internet Archive.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-500">Live API Endpoint Ready</span>
            </div>
          </div>
        </div>
      </AmbientCard>

      {/* Greek Stoic Terminology Glossary */}
      <AmbientCard elevation="sm" className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h3 className="font-cinzel text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            Essential Stoic Lexicon
          </h3>
        </div>

        <div className="divide-y divide-white/10">
          {STOIC_GLOSSARY.map((g) => (
            <div key={g.term} className="py-2.5">
              <div className="flex items-center justify-between">
                <span className="font-cinzel text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                  {g.term}
                </span>
                <span className="font-serif italic text-xs" style={{ color: 'var(--accent-primary)' }}>
                  {g.greek}
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {g.meaning}
              </p>
            </div>
          ))}
        </div>
      </AmbientCard>

      {/* App Architecture & Info */}
      <div className="text-center pt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <p className="font-cinzel tracking-wider">
          Daily Stoic • React Native Expo Architecture
        </p>
        <p className="text-[11px] mt-0.5">
          "Very little is needed to make a happy life; it is all within yourself, in your way of thinking." — Marcus Aurelius
        </p>
      </div>
    </div>
  );
};

import React from 'react';
import { THEMES } from '../data/stoicData';
import { ThemeId } from '../types';
import { AmbientCard } from './AmbientCard';
import { Check, Sparkles, X, Sun, Moon, Sliders } from 'lucide-react';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
  glowIntensity: number;
  onGlowIntensityChange: (val: number) => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  glowIntensity,
  onGlowIntensityChange
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg rounded-3xl p-6 sm:p-7 relative shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 25px 60px -15px var(--glow-strong), 0 0 35px 2px var(--glow-accent)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-primary)' }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-cinzel tracking-wide" style={{ color: 'var(--text-primary)' }}>
                Dynamic Theme & Glow
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Stoic Sanctuary Palettes & Ambient Lighting
              </p>
            </div>
          </div>
          <button
            id="close-theme-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Glow Intensity Slider */}
        <div className="my-5 p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                Ambient Card Glow Intensity
              </span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-primary)' }}>
              {Math.round(glowIntensity * 100)}%
            </span>
          </div>
          <input
            id="glow-slider"
            type="range"
            min="0.3"
            max="1.8"
            step="0.1"
            value={glowIntensity}
            onChange={(e) => onGlowIntensityChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500"
            style={{ accentColor: 'var(--accent-primary)' }}
          />
          <div className="flex justify-between text-[10px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            <span>Subtle Aura</span>
            <span>Balanced Stoa</span>
            <span>Luminous Halo</span>
          </div>
        </div>

        {/* Theme Grid */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Select Sanctuary Aesthetic
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  id={`theme-btn-${theme.id}`}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between group ${
                    isSelected ? 'ring-2' : 'hover:border-opacity-50'
                  }`}
                  style={{
                    backgroundColor: theme.previewBg,
                    borderColor: isSelected ? theme.previewAccent : 'rgba(255, 255, 255, 0.1)',
                    ringColor: theme.previewAccent,
                    boxShadow: isSelected 
                      ? `0 10px 30px -5px ${theme.previewGlow}, 0 0 15px 1px ${theme.previewAccent}` 
                      : 'none'
                  }}
                >
                  <div className="flex items-start justify-between w-full mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: theme.previewAccent }}
                      />
                      <span className={`text-sm font-bold ${theme.isDark ? 'text-white' : 'text-stone-900'}`}>
                        {theme.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {theme.isDark ? (
                        <Moon className="w-3.5 h-3.5 text-stone-400" />
                      ) : (
                        <Sun className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      {isSelected && (
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white"
                          style={{ backgroundColor: theme.previewAccent }}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className={`text-[11px] line-clamp-2 ${theme.isDark ? 'text-stone-400' : 'text-stone-600'}`}>
                    {theme.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    <span className={theme.isDark ? 'text-stone-400' : 'text-stone-700'}>
                      {theme.subtitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Card Preview */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            Live Ambient Shadow Preview
          </p>
          <AmbientCard elevation="pulse" className="p-4">
            <p className="font-serif italic text-sm mb-1.5" style={{ color: 'var(--text-primary)' }}>
              "The soul becomes dyed with the color of its thoughts."
            </p>
            <p className="text-xs font-cinzel tracking-wider" style={{ color: 'var(--accent-primary)' }}>
              — Marcus Aurelius, Meditations
            </p>
          </AmbientCard>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            id="apply-theme-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md active:scale-95"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-text)',
              boxShadow: '0 4px 20px -2px var(--glow-strong)'
            }}
          >
            Apply & Return to Stoa
          </button>
        </div>
      </div>
    </div>
  );
};

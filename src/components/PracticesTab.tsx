import React, { useState, useEffect } from 'react';
import { DichotomyItem } from '../types';
import { INITIAL_DICHOTOMY_ITEMS } from '../data/stoicData';
import { AmbientCard } from './AmbientCard';
import { 
  Scale, 
  Clock, 
  Wind, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  ArrowRight,
  ShieldAlert,
  HeartHandshake
} from 'lucide-react';

export const PracticesTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'dichotomy' | 'memento' | 'breathing'>('dichotomy');

  // Dichotomy State
  const [items, setItems] = useState<DichotomyItem[]>(INITIAL_DICHOTOMY_ITEMS);
  const [userCustomTitle, setUserCustomTitle] = useState('');
  const [customFeedback, setCustomFeedback] = useState<string | null>(null);

  // Memento Mori State
  const [ageYears, setAgeYears] = useState<number>(32);
  const totalLifespanYears = 80;

  // Box Breathing State
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold (Stillness)' | 'Exhale' | 'Rest (Equanimity)'>('Inhale');
  const [secondsInPhase, setSecondsInPhase] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Box breathing timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathing) {
      timer = setInterval(() => {
        setSecondsInPhase((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold (Stillness)';
              if (currentPhase === 'Hold (Stillness)') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Rest (Equanimity)';
              setCycleCount((c) => c + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathing]);

  const handleClassify = (id: string, category: 'control' | 'no_control') => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, userCategory: category } : item))
    );
  };

  const handleAddCustomAnxiety = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCustomTitle.trim()) return;

    const newItem: DichotomyItem = {
      id: `custom-${Date.now()}`,
      title: userCustomTitle,
      description: 'Your personal current situation or worry.',
      category: 'control', // user will classify
      explanation: 'Notice: If it involves other people\'s actions or outcomes, it is outside your control. Your reaction and virtue are inside your control.'
    };

    setItems([newItem, ...items]);
    setUserCustomTitle('');
    setCustomFeedback('Added to your Dichotomy of Control sorter below!');
    setTimeout(() => setCustomFeedback(null), 3000);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="pt-1">
        <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
          Stoic Spiritual Exercises (Askesis)
        </span>
        <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Interactive Practices
        </h2>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex rounded-2xl p-1 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
        <button
          id="practice-tab-dichotomy"
          onClick={() => setActiveSubTab('dichotomy')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'dichotomy' ? 'shadow-md' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: activeSubTab === 'dichotomy' ? 'var(--accent-primary)' : 'transparent',
            color: activeSubTab === 'dichotomy' ? 'var(--accent-text)' : 'var(--text-secondary)'
          }}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>Dichotomy of Control</span>
        </button>

        <button
          id="practice-tab-memento"
          onClick={() => setActiveSubTab('memento')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'memento' ? 'shadow-md' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: activeSubTab === 'memento' ? 'var(--accent-primary)' : 'transparent',
            color: activeSubTab === 'memento' ? 'var(--accent-text)' : 'var(--text-secondary)'
          }}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Memento Mori</span>
        </button>

        <button
          id="practice-tab-breathing"
          onClick={() => setActiveSubTab('breathing')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'breathing' ? 'shadow-md' : 'hover:opacity-80'
          }`}
          style={{
            backgroundColor: activeSubTab === 'breathing' ? 'var(--accent-primary)' : 'transparent',
            color: activeSubTab === 'breathing' ? 'var(--accent-text)' : 'var(--text-secondary)'
          }}
        >
          <Wind className="w-3.5 h-3.5" />
          <span>Inner Citadel Breath</span>
        </button>
      </div>

      {/* PRACTICE 1: DICHOTOMY OF CONTROL */}
      {activeSubTab === 'dichotomy' && (
        <div className="space-y-5">
          <AmbientCard elevation="sm" className="p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--glow-color)', color: 'var(--accent-primary)' }}>
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-cinzel text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  Epictetus's Grand Divider
                </h3>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  "Some things are in our control (our opinions, desires, virtues) and others are not (reputation, wealth, body, other people's choices). Sift your worries to conquer anxiety."
                </p>
              </div>
            </div>
          </AmbientCard>

          {/* Add custom worry form */}
          <form onSubmit={handleAddCustomAnxiety} className="flex gap-2">
            <input
              id="custom-worry-input"
              type="text"
              placeholder="Enter a situation causing you anxiety today..."
              value={userCustomTitle}
              onChange={(e) => setUserCustomTitle(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-1"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
            <button
              type="submit"
              id="add-worry-btn"
              className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--accent-text)'
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>

          {customFeedback && (
            <p className="text-xs text-emerald-500 font-semibold">{customFeedback}</p>
          )}

          {/* Sorting Cards */}
          <div className="space-y-3">
            {items.map((item) => {
              const isClassified = item.userCategory !== undefined;
              const isCorrect = item.userCategory === item.category;

              return (
                <AmbientCard key={item.id} elevation="sm" className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {item.description}
                      </p>
                    </div>

                    {/* Classification Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        id={`btn-control-${item.id}`}
                        onClick={() => handleClassify(item.id, 'control')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                          item.userCategory === 'control' ? 'ring-2' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: item.userCategory === 'control' ? 'rgba(16, 185, 129, 0.2)' : 'var(--bg-surface-elevated)',
                          borderColor: item.userCategory === 'control' ? '#10b981' : 'var(--border-color)',
                          color: item.userCategory === 'control' ? '#10b981' : 'var(--text-secondary)'
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In My Control</span>
                      </button>

                      <button
                        id={`btn-no-control-${item.id}`}
                        onClick={() => handleClassify(item.id, 'no_control')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                          item.userCategory === 'no_control' ? 'ring-2' : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: item.userCategory === 'no_control' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg-surface-elevated)',
                          borderColor: item.userCategory === 'no_control' ? '#ef4444' : 'var(--border-color)',
                          color: item.userCategory === 'no_control' ? '#ef4444' : 'var(--text-secondary)'
                        }}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Outside My Control</span>
                      </button>
                    </div>
                  </div>

                  {/* Feedback Explanation */}
                  {isClassified && (
                    <div 
                      className="mt-3 pt-3 border-t border-white/10 text-xs flex items-start gap-2"
                      style={{ color: isCorrect ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                    >
                      <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
                      <div>
                        <span className="font-bold mr-1" style={{ color: 'var(--accent-primary)' }}>
                          Stoic Insight:
                        </span>
                        <span>{item.explanation}</span>
                      </div>
                    </div>
                  )}
                </AmbientCard>
              );
            })}
          </div>
        </div>
      )}

      {/* PRACTICE 2: MEMENTO MORI */}
      {activeSubTab === 'memento' && (
        <div className="space-y-5">
          <AmbientCard elevation="pulse" className="p-6 text-center">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ backgroundColor: 'var(--glow-color)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              Seneca's De Brevitate Vitae
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>
              Memento Mori: The Life Grid
            </h3>
            <p className="font-serif italic text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              "Let each thing you would do, say, or intend, be like that of a dying person." — Marcus Aurelius
            </p>

            {/* Age Slider */}
            <div className="mt-6 max-w-xs mx-auto p-4 rounded-2xl border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span style={{ color: 'var(--text-muted)' }}>Current Age:</span>
                <span className="font-bold text-sm" style={{ color: 'var(--accent-primary)' }}>{ageYears} Years</span>
              </div>
              <input
                id="age-slider"
                type="range"
                min="10"
                max="90"
                value={ageYears}
                onChange={(e) => setAgeYears(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </div>

            {/* Life Stats Breakdown */}
            <div className="grid grid-cols-3 gap-3 mt-5 max-w-md mx-auto">
              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Weeks Lived</span>
                <p className="text-lg font-bold font-cinzel mt-0.5" style={{ color: 'var(--accent-primary)' }}>
                  {(ageYears * 52).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Days Lived</span>
                <p className="text-lg font-bold font-cinzel mt-0.5" style={{ color: 'var(--text-primary)' }}>
                  {(ageYears * 365.25).toFixed(0)}
                </p>
              </div>
              <div className="p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
                <span className="text-[10px] uppercase font-bold" style={{ color: 'var(--text-muted)' }}>Estimated Left</span>
                <p className="text-lg font-bold font-cinzel mt-0.5" style={{ color: '#10b981' }}>
                  {Math.max(0, (totalLifespanYears - ageYears) * 52).toLocaleString()} wks
                </p>
              </div>
            </div>

            {/* Visual Year Matrix (80 years) */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Your 80-Year Life Tapestry (Each Dot = 1 Year)
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center max-w-sm mx-auto">
                {Array.from({ length: totalLifespanYears }).map((_, i) => {
                  const isPast = i < ageYears;
                  const isCurrent = i === ageYears;
                  return (
                    <div
                      key={i}
                      title={`Year ${i + 1}`}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isCurrent ? 'scale-125 ring-2 ring-amber-400' : ''
                      }`}
                      style={{
                        backgroundColor: isPast 
                          ? 'var(--accent-primary)' 
                          : isCurrent 
                            ? '#f59e0b' 
                            : 'rgba(255,255,255,0.12)',
                        boxShadow: isPast ? '0 0 6px var(--glow-accent)' : 'none'
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-4 text-[10px] mt-4" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span>Years Completed</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/20" />
                  <span>Unwritten Future</span>
                </span>
              </div>
            </div>
          </AmbientCard>
        </div>
      )}

      {/* PRACTICE 3: INNER CITADEL BOX BREATHING */}
      {activeSubTab === 'breathing' && (
        <div className="space-y-5">
          <AmbientCard elevation="pulse" className="p-8 text-center flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border" style={{ backgroundColor: 'var(--glow-color)', borderColor: 'var(--border-color)', color: 'var(--accent-primary)' }}>
              Stoic Ataraxia & Centering
            </span>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold mt-3 mb-1" style={{ color: 'var(--text-primary)' }}>
              The Citadel Breath (4-4-4-4)
            </h3>
            <p className="text-xs max-w-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Steady the autonomic nervous system to restore the sovereign throne of reason (Hēgemonikon).
            </p>

            {/* Glowing Breathing Orb with Multi-layered Shadows */}
            <div className="relative my-6 flex items-center justify-center">
              <div
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-1000 border relative ${
                  isBreathing && (breathPhase === 'Inhale' || breathPhase === 'Hold (Stillness)')
                    ? 'scale-110'
                    : 'scale-90'
                }`}
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--accent-primary)',
                  boxShadow: `0 0 ${isBreathing ? '50px 10px' : '20px 2px'} var(--glow-strong), 0 0 ${isBreathing ? '80px 20px' : '35px 5px'} var(--glow-accent)`
                }}
              >
                <span className="font-cinzel text-xs uppercase tracking-widest font-bold" style={{ color: 'var(--accent-primary)' }}>
                  {breathPhase}
                </span>
                <span className="text-3xl font-extrabold font-cinzel my-1" style={{ color: 'var(--text-primary)' }}>
                  {secondsInPhase}s
                </span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Cycle #{cycleCount}
                </span>
              </div>
            </div>

            {/* Guidance aphorism */}
            <p className="font-serif italic text-xs max-w-xs h-8 text-center" style={{ color: 'var(--text-secondary)' }}>
              {breathPhase === 'Inhale' && '"Draw in the breath of life, tranquil and receptive."'}
              {breathPhase === 'Hold (Stillness)' && '"Observe the internal silence of the ruling center."'}
              {breathPhase === 'Exhale' && '"Release tension, irritation, and false attachments."'}
              {breathPhase === 'Rest (Equanimity)' && '"Rest rooted in virtue before the next cycle begins."'}
            </p>

            {/* Breathing Controls */}
            <div className="mt-6 flex items-center gap-3">
              <button
                id="toggle-breathing-btn"
                onClick={() => setIsBreathing(!isBreathing)}
                className="px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: 'var(--accent-text)',
                  boxShadow: '0 8px 24px -4px var(--glow-strong)'
                }}
              >
                {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isBreathing ? 'Pause Citadel' : 'Begin Stillness'}</span>
              </button>

              <button
                id="reset-breathing-btn"
                onClick={() => {
                  setIsBreathing(false);
                  setBreathPhase('Inhale');
                  setSecondsInPhase(4);
                  setCycleCount(0);
                }}
                className="p-2.5 rounded-xl border hover:bg-white/10 transition-colors"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </AmbientCard>
        </div>
      )}
    </div>
  );
};

import { recordStreakActivity } from './streakService';

export interface StoicPersona {
  id: string;
  name: string;
  title: string;
  gender: 'male' | 'female';
  description: string;
  pitch: number;
  rate: number;
  preferredKeywords: string[];
}

export const STOIC_PERSONAS: StoicPersona[] = [
  {
    id: 'marcus',
    name: 'Marcus Aurelius',
    title: 'Sage Male • Grounded & Resolute',
    gender: 'male',
    description: 'Deep, calm baritone with measured pacing for deep reflection.',
    pitch: 0.90,
    rate: 0.88,
    preferredKeywords: ['Google UK English Male', 'Daniel', 'Guy', 'George', 'Arthur', 'Male', 'en-GB']
  },
  {
    id: 'hypatia',
    name: 'Hypatia of Alexandria',
    title: 'Calm Female • Meditative & Lucid',
    gender: 'female',
    description: 'Warm, luminous soprano with serene rhythm and natural breath.',
    pitch: 1.02,
    rate: 0.90,
    preferredKeywords: ['Samantha', 'Google US English', 'Serena', 'Ava', 'Jenny', 'Female', 'en-US']
  },
  {
    id: 'seneca',
    name: 'Lucius Seneca',
    title: 'Refined Orator • Classical Eloquence',
    gender: 'male',
    description: 'Eloquent, cultured phrasing with subtle pauses for maximum resonance.',
    pitch: 0.95,
    rate: 0.92,
    preferredKeywords: ['Oliver', 'Google UK English Male', 'Natural', 'en-GB', 'Male']
  },
  {
    id: 'epictetus',
    name: 'Epictetus',
    title: 'Direct Mentor • Firm & Awakening',
    gender: 'male',
    description: 'Resolute, unvarnished cadence urging direct self-examination.',
    pitch: 0.88,
    rate: 0.96,
    preferredKeywords: ['Ryan', 'David', 'English United States', 'en-US']
  }
];

class AiVoiceService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private activePersonaId: string = 'marcus';
  private customRateMultiplier: number = 1.0;
  private audioContext: AudioContext | null = null;
  private isSpeakingState: boolean = false;
  private isPausedState: boolean = false;
  private currentSentenceIndex: number = 0;
  private sentences: string[] = [];
  private onStateChangeListeners: ((state: { isSpeaking: boolean; isPaused: boolean; currentSentence: number; totalSentences: number }) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public getPersonas(): StoicPersona[] {
    return STOIC_PERSONAS;
  }

  public getActivePersona(): StoicPersona {
    return STOIC_PERSONAS.find(p => p.id === this.activePersonaId) || STOIC_PERSONAS[0];
  }

  public setPersona(id: string) {
    if (STOIC_PERSONAS.some(p => p.id === id)) {
      this.activePersonaId = id;
    }
  }

  public setRate(multiplier: number) {
    this.customRateMultiplier = Math.max(0.7, Math.min(1.5, multiplier));
  }

  public getRate(): number {
    return this.customRateMultiplier;
  }

  /**
   * Selects the most natural, human-like voice available for the persona
   */
  private findBestVoice(persona: StoicPersona): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }
    if (this.voices.length === 0) return null;

    // 1. Try matching preferred keywords (e.g. Natural, Neural, Google, Daniel, Samantha)
    for (const keyword of persona.preferredKeywords) {
      const match = this.voices.find(v => 
        v.name.toLowerCase().includes(keyword.toLowerCase()) || 
        v.lang.toLowerCase().includes(keyword.toLowerCase())
      );
      if (match) return match;
    }

    // 2. Look for high quality English voices (Natural/Neural)
    const naturalVoice = this.voices.find(v => 
      v.lang.startsWith('en') && (
        v.name.toLowerCase().includes('natural') || 
        v.name.toLowerCase().includes('neural') ||
        v.name.toLowerCase().includes('premium') ||
        v.name.toLowerCase().includes('enhanced')
      )
    );
    if (naturalVoice) return naturalVoice;

    // 3. Any English voice
    const anyEnglish = this.voices.find(v => v.lang.startsWith('en'));
    if (anyEnglish) return anyEnglish;

    // 4. Default
    return this.voices[0] || null;
  }

  /**
   * Pre-processes text to add human breath pauses and rhythm
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/—/g, ', ')
      .replace(/–/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Splits long passages into natural sentence chunks
   */
  private splitIntoSentences(text: string): string[] {
    const cleaned = this.cleanTextForSpeech(text);
    // Split on sentence terminators while preserving punctuation
    const raw = cleaned.match(/[^.!?]+[.!?]+(\s+|$)|[^.!?]+$/g);
    if (!raw) return [cleaned];
    return raw.map(s => s.trim()).filter(s => s.length > 0);
  }

  /**
   * Plays ancient harmonic temple chime before reading
   */
  public async playSacredChime(): Promise<void> {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      // 432Hz (Philosophical Pythagorean tuning) & 528Hz (Solfeggio transformation tone)
      const freqs = [432, 528];
      
      freqs.forEach((freq, idx) => {
        if (!this.audioContext) return;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + (idx * 0.05));

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.04 + (idx * 0.05));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6 + (idx * 0.1));

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(now + (idx * 0.05));
        osc.stop(now + 1.8 + (idx * 0.1));
      });
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  /**
   * Reads the text with a human-like voice, emitting sentence tracking events
   */
  public async speakText(text: string, options?: { withChime?: boolean; onSentence?: (index: number, sentence: string) => void }): Promise<void> {
    if (!this.synth) {
      console.warn('Speech synthesis not supported in this environment');
      return;
    }

    // Stop any ongoing speech
    this.stop();

    if (!text || text.trim().length === 0) return;

    // Award streak activity for listening to AI voice meditation
    recordStreakActivity('aiListen');

    if (options?.withChime !== false) {
      await this.playSacredChime();
      // Brief pause after the sacred chime
      await new Promise(r => setTimeout(r, 450));
    }

    this.sentences = this.splitIntoSentences(text);
    this.currentSentenceIndex = 0;
    this.isSpeakingState = true;
    this.isPausedState = false;
    this.notifyState();

    this.speakNextSentence(options?.onSentence);
  }

  private speakNextSentence(onSentence?: (index: number, sentence: string) => void) {
    if (!this.synth || this.currentSentenceIndex >= this.sentences.length) {
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notifyState();
      return;
    }

    const currentText = this.sentences[this.currentSentenceIndex];
    if (onSentence) {
      onSentence(this.currentSentenceIndex, currentText);
    }

    const persona = this.getActivePersona();
    const voice = this.findBestVoice(persona);

    const utterance = new SpeechSynthesisUtterance(currentText);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate * this.customRateMultiplier;

    utterance.onend = () => {
      this.currentSentenceIndex++;
      this.notifyState();
      if (this.currentSentenceIndex < this.sentences.length && this.isSpeakingState && !this.isPausedState) {
        // Natural human breath pause between philosophical thoughts
        setTimeout(() => {
          this.speakNextSentence(onSentence);
        }, 220);
      } else {
        this.isSpeakingState = false;
        this.isPausedState = false;
        this.notifyState();
      }
    };

    utterance.onerror = (e) => {
      console.warn('AI Reader speech error:', e);
      this.isSpeakingState = false;
      this.isPausedState = false;
      this.notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    this.notifyState();
  }

  public pause() {
    if (this.synth && this.isSpeakingState && !this.isPausedState) {
      this.synth.pause();
      this.isPausedState = true;
      this.notifyState();
    }
  }

  public resume() {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
      this.notifyState();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentSentenceIndex = 0;
    this.notifyState();
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  public isPaused(): boolean {
    return this.isPausedState;
  }

  public getCurrentSentenceIndex(): number {
    return this.currentSentenceIndex;
  }

  public subscribeState(listener: (state: { isSpeaking: boolean; isPaused: boolean; currentSentence: number; totalSentences: number }) => void): () => void {
    this.onStateChangeListeners.push(listener);
    // Initial emit
    listener({
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentSentence: this.currentSentenceIndex,
      totalSentences: this.sentences.length
    });
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notifyState() {
    const state = {
      isSpeaking: this.isSpeakingState,
      isPaused: this.isPausedState,
      currentSentence: this.currentSentenceIndex,
      totalSentences: this.sentences.length
    };
    this.onStateChangeListeners.forEach(l => l(state));
  }
}

export const aiVoiceService = new AiVoiceService();

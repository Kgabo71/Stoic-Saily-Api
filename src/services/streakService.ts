export interface TodayActivities {
  readWisdom: boolean;
  aiListen: boolean;
  openLibraryRead: boolean;
  journalEntry: boolean;
}

export interface Milestone {
  days: number;
  title: string;
  description: string;
  unlocked: boolean;
  badge: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // 'YYYY-MM-DD'
  todayCompleted: boolean;
  todayActivities: TodayActivities;
  streakHistory: { date: string; completed: boolean }[];
  milestones: Milestone[];
}

const STORAGE_KEY = 'stoic_daily_streak_v1';
const STREAK_EVENT = 'stoic_streak_updated';

const DEFAULT_MILESTONES: Omit<Milestone, 'unlocked'>[] = [
  { days: 1, title: 'Novice of the Stoa', description: 'Began the philosophical journey', badge: '🏛️' },
  { days: 3, title: 'Ataraxia Apprentice', description: 'Cultivated tranquility for 3 days', badge: '🌿' },
  { days: 7, title: 'Week of Equanimity', description: 'One full week of steadfast mind', badge: '⚔️' },
  { days: 14, title: 'Fortitude of Seneca', description: 'Two weeks of continuous wisdom', badge: '📜' },
  { days: 30, title: 'Discipline of Marcus', description: 'A month of unshakeable presence', badge: '👑' },
  { days: 50, title: 'Freedom of Epictetus', description: 'Fifty days mastering control', badge: '🦅' },
  { days: 100, title: 'True Roman Sage', description: 'A hundred days of Stoic mastery', badge: '🔥' },
];

function getFormattedDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getFormattedDate(d);
}

function calculateMilestones(streak: number): Milestone[] {
  return DEFAULT_MILESTONES.map(m => ({
    ...m,
    unlocked: streak >= m.days
  }));
}

export function getStreakData(): StreakData {
  const today = getFormattedDate();
  const yesterday = getYesterdayDate();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time user: initialize with Day 1 active today
      const initial: StreakData = {
        currentStreak: 1,
        bestStreak: 1,
        lastActiveDate: today,
        todayCompleted: true,
        todayActivities: {
          readWisdom: true,
          aiListen: false,
          openLibraryRead: false,
          journalEntry: false,
        },
        streakHistory: generateRecentHistory(today, 1),
        milestones: calculateMilestones(1)
      };
      saveStreakData(initial);
      return initial;
    }

    const data: StreakData = JSON.parse(raw);

    // Check if new day
    if (data.lastActiveDate === today) {
      // Already recorded today
      data.milestones = calculateMilestones(data.currentStreak);
      return data;
    } else if (data.lastActiveDate === yesterday) {
      // Visited yesterday, continuing streak for today
      // Reset today's activities for the fresh day
      data.todayCompleted = false;
      data.todayActivities = {
        readWisdom: false,
        aiListen: false,
        openLibraryRead: false,
        journalEntry: false,
      };
      data.milestones = calculateMilestones(data.currentStreak);
      return data;
    } else {
      // Missed more than 1 day: streak resets
      data.currentStreak = 0;
      data.todayCompleted = false;
      data.todayActivities = {
        readWisdom: false,
        aiListen: false,
        openLibraryRead: false,
        journalEntry: false,
      };
      data.milestones = calculateMilestones(0);
      return data;
    }
  } catch (e) {
    console.warn('Error reading streak from localStorage:', e);
    return {
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
      todayCompleted: true,
      todayActivities: {
        readWisdom: true,
        aiListen: false,
        openLibraryRead: false,
        journalEntry: false,
      },
      streakHistory: generateRecentHistory(today, 1),
      milestones: calculateMilestones(1)
    };
  }
}

export function recordStreakActivity(activityKey: keyof TodayActivities): StreakData {
  const today = getFormattedDate();
  const yesterday = getYesterdayDate();
  const current = getStreakData();

  let streak = current.currentStreak;
  let best = current.bestStreak;

  // If previous active date was yesterday, increment streak today
  if (current.lastActiveDate === yesterday) {
    streak += 1;
  } else if (current.lastActiveDate !== today) {
    // Started fresh
    streak = 1;
  }

  best = Math.max(best, streak);

  const updatedActivities: TodayActivities = {
    ...current.todayActivities,
    [activityKey]: true
  };

  const updatedHistory = [...(current.streakHistory || [])];
  const existingTodayIndex = updatedHistory.findIndex(h => h.date === today);
  if (existingTodayIndex >= 0) {
    updatedHistory[existingTodayIndex].completed = true;
  } else {
    updatedHistory.push({ date: today, completed: true });
    if (updatedHistory.length > 14) updatedHistory.shift();
  }

  const updated: StreakData = {
    currentStreak: streak,
    bestStreak: best,
    lastActiveDate: today,
    todayCompleted: true,
    todayActivities: updatedActivities,
    streakHistory: updatedHistory,
    milestones: calculateMilestones(streak)
  };

  saveStreakData(updated);
  dispatchStreakEvent(updated);
  return updated;
}

export function manuallyCheckInToday(): StreakData {
  return recordStreakActivity('readWisdom');
}

function saveStreakData(data: StreakData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Error saving streak to localStorage:', e);
  }
}

function dispatchStreakEvent(data: StreakData): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STREAK_EVENT, { detail: data }));
  }
}

export function onStreakChange(callback: (data: StreakData) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (e: Event) => {
    const custom = e as CustomEvent<StreakData>;
    if (custom.detail) callback(custom.detail);
  };
  window.addEventListener(STREAK_EVENT, handler);
  return () => window.removeEventListener(STREAK_EVENT, handler);
}

function generateRecentHistory(today: string, streak: number): { date: string; completed: boolean }[] {
  const history: { date: string; completed: boolean }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getFormattedDate(d);
    // If within the active streak days, mark completed
    const isCompleted = i < streak;
    history.push({ date: dateStr, completed: isCompleted });
  }
  return history;
}

export type ThemeId = 
  | 'theme-obsidian' 
  | 'theme-marble' 
  | 'theme-elysian' 
  | 'theme-tyrian' 
  | 'theme-cypress' 
  | 'theme-parchment';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  subtitle: string;
  isDark: boolean;
  previewBg: string;
  previewAccent: string;
  previewGlow: string;
  description: string;
}

export type Discipline = 'perception' | 'action' | 'will';

export interface StoicQuote {
  id: string;
  text: string;
  author: string;
  work: string;
  discipline: Discipline;
  conceptGreek?: string;
  conceptEnglish?: string;
  reflectionPrompt: string;
  context: string;
  openLibraryEdition?: string;
  era?: string;
}

export interface StoicAuthor {
  id: string;
  name: string;
  era: string;
  title: string;
  openLibraryKey: string;
  bio: string;
  portraitCoverId?: number;
  famousWorks: string[];
}

export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  author_key?: string[];
  first_publish_year?: number;
  cover_i?: number;
  edition_count?: number;
  subject?: string[];
  isbn?: string[];
  ratings_average?: number;
  has_fulltext?: boolean;
}

export interface OpenLibraryWorkDetails {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  first_publish_date?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  type: 'morning' | 'evening' | 'freeform';
  prompt: string;
  content: string;
  virtueApplied: 'wisdom' | 'courage' | 'justice' | 'temperance';
  moodRating: number; // 1 to 5
}

export interface DichotomyItem {
  id: string;
  title: string;
  description: string;
  category: 'control' | 'no_control';
  userCategory?: 'control' | 'no_control';
  explanation: string;
}

export type TabType = 'today' | 'library' | 'practices' | 'journal' | 'settings';

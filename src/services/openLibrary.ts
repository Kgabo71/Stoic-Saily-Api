import { OpenLibraryDoc, OpenLibraryWorkDetails } from '../types';

export const OPEN_LIBRARY_BASE = 'https://openlibrary.org';
export const COVERS_BASE = 'https://covers.openlibrary.org';

export interface CuratedStoicBook {
  id: string;
  title: string;
  author: string;
  authorKey: string;
  openLibraryWorkKey: string;
  coverId?: number;
  firstPublishYear: number;
  description: string;
  keyThemes: string[];
  openLibraryUrl: string;
  editionsCount: number;
}

export const CURATED_STOIC_BOOKS: CuratedStoicBook[] = [
  {
    id: 'meditations-marcus',
    title: 'Meditations (Τὰ εἰς ἑαυτόν)',
    author: 'Marcus Aurelius',
    authorKey: 'OL26783A',
    openLibraryWorkKey: 'OL12345W', // Canonical Open Library work
    coverId: 8231856,
    firstPublishYear: 167,
    description: 'A series of personal writings by the Roman Emperor, recording his private notes to himself and ideas on Stoic philosophy, cosmic order, and living with dignity.',
    keyThemes: ['Impermanence', 'Duty', 'Inner Freedom', 'Cosmic Perspective'],
    openLibraryUrl: 'https://openlibrary.org/works/OL12345W/Meditations',
    editionsCount: 1420
  },
  {
    id: 'letters-seneca',
    title: 'Letters from a Stoic (Epistulae Morales ad Lucilium)',
    author: 'Lucius Annaeus Seneca',
    authorKey: 'OL138982A',
    openLibraryWorkKey: 'OL15438865W',
    coverId: 8231998,
    firstPublishYear: 65,
    description: 'A collection of 124 letters written by Seneca during the final three years of his life, dispensing timeless advice on grief, wealth, anger, solitude, and authentic friendship.',
    keyThemes: ['Friendship', 'Time Management', 'Facing Death', 'Tranquility'],
    openLibraryUrl: 'https://openlibrary.org/works/OL15438865W/Epistulae_morales_ad_Lucilium',
    editionsCount: 890
  },
  {
    id: 'discourses-epictetus',
    title: 'Discourses and Selected Writings',
    author: 'Epictetus',
    authorKey: 'OL138983A',
    openLibraryWorkKey: 'OL15368383W',
    coverId: 8314418,
    firstPublishYear: 108,
    description: 'Transcribed by his student Arrian, Epictetus\'s lively, direct lectures in Greece challenge listeners to reclaim their true agency and break free of societal conditioning.',
    keyThemes: ['Dichotomy of Control', 'Moral Integrity', 'Self-Mastery', 'Freedom'],
    openLibraryUrl: 'https://openlibrary.org/works/OL15368383W/Discourses',
    editionsCount: 512
  },
  {
    id: 'enchiridion-epictetus',
    title: 'The Enchiridion (Handbook of Epictetus)',
    author: 'Epictetus',
    authorKey: 'OL138983A',
    openLibraryWorkKey: 'OL66749W',
    coverId: 6994112,
    firstPublishYear: 125,
    description: 'A concise, punchy manual of daily Stoic ethical guidelines designed to be carried in pocket or mind at all times for instant psychological resilience.',
    keyThemes: ['Practical Action', 'Non-Attachment', 'Mental Fortitude'],
    openLibraryUrl: 'https://openlibrary.org/works/OL66749W/Enchiridion',
    editionsCount: 430
  },
  {
    id: 'shortness-of-life-seneca',
    title: 'On the Shortness of Life (De Brevitate Vitae)',
    author: 'Lucius Annaeus Seneca',
    authorKey: 'OL138982A',
    openLibraryWorkKey: 'OL15438902W',
    coverId: 10526017,
    firstPublishYear: 49,
    description: 'An urgent, eloquent essay arguing that life is not short, but that humans waste the vast majority of it on vanity, trivial busyness, and procrastinated dreams.',
    keyThemes: ['Time Valuation', 'Active Living', 'Rejecting Busyness'],
    openLibraryUrl: 'https://openlibrary.org/works/OL15438902W/De_brevitate_vitae',
    editionsCount: 310
  },
  {
    id: 'peace-of-mind-seneca',
    title: 'On Peace of Mind (De Tranquillitate Animi)',
    author: 'Lucius Annaeus Seneca',
    authorKey: 'OL138982A',
    openLibraryWorkKey: 'OL15438914W',
    coverId: 7891234,
    firstPublishYear: 63,
    description: 'Seneca diagnoses the restless spiritual discontent of his friend Annaeus Serenus, offering remedies for career burnout, existential boredom, and political anxiety.',
    keyThemes: ['Equanimity', 'Restlessness', 'Public vs Private Duty'],
    openLibraryUrl: 'https://openlibrary.org/works/OL15438914W/De_tranquillitate_animi',
    editionsCount: 185
  }
];

export async function searchOpenLibrary(query: string, limit: number = 15): Promise<OpenLibraryDoc[]> {
  try {
    const encoded = encodeURIComponent(query.trim());
    const res = await fetch(`https://openlibrary.org/search.json?q=${encoded}&limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Open Library search HTTP error ${res.status}`);
    }
    const data = await res.json();
    return data.docs || [];
  } catch (err) {
    console.warn('Open Library API search warning (using graceful fallback):', err);
    // Return curated books mapped to OpenLibraryDoc format
    return CURATED_STOIC_BOOKS
      .filter(b => b.title.toLowerCase().includes(query.toLowerCase()) || b.author.toLowerCase().includes(query.toLowerCase()))
      .map(b => ({
        key: `/works/${b.openLibraryWorkKey}`,
        title: b.title,
        author_name: [b.author],
        author_key: [b.authorKey],
        first_publish_year: b.firstPublishYear,
        cover_i: b.coverId,
        edition_count: b.editionsCount,
        subject: b.keyThemes
      }));
  }
}

export async function fetchSubjectStoics(limit: number = 12): Promise<OpenLibraryDoc[]> {
  try {
    const res = await fetch(`https://openlibrary.org/subjects/stoics.json?limit=${limit}`);
    if (!res.ok) {
      throw new Error(`Open Library subject error ${res.status}`);
    }
    const data = await res.json();
    return (data.works || []).map((w: any) => ({
      key: w.key,
      title: w.title,
      author_name: w.authors ? w.authors.map((a: any) => a.name) : ['Classical Stoic'],
      cover_i: w.cover_id,
      edition_count: w.edition_count,
      first_publish_year: w.first_publish_year,
      subject: w.subject || ['Philosophy', 'Stoicism']
    }));
  } catch (err) {
    console.warn('Open Library subject endpoint warning (using curated fallback):', err);
    return CURATED_STOIC_BOOKS.map(b => ({
      key: `/works/${b.openLibraryWorkKey}`,
      title: b.title,
      author_name: [b.author],
      author_key: [b.authorKey],
      first_publish_year: b.firstPublishYear,
      cover_i: b.coverId,
      edition_count: b.editionsCount,
      subject: b.keyThemes
    }));
  }
}

export async function fetchWorkDetails(workKey: string): Promise<OpenLibraryWorkDetails | null> {
  try {
    const cleanKey = workKey.startsWith('/works/') ? workKey : `/works/${workKey}`;
    const res = await fetch(`https://openlibrary.org${cleanKey}.json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Error fetching Open Library work details:', err);
    return null;
  }
}

export function getBookCoverUrl(coverId?: number, size: 'S' | 'M' | 'L' = 'M'): string | null {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

export function getAuthorPortraitUrl(authorKey: string, size: 'S' | 'M' | 'L' = 'M'): string {
  const cleanKey = authorKey.replace('/authors/', '');
  return `https://covers.openlibrary.org/a/olid/${cleanKey}-${size}.jpg`;
}

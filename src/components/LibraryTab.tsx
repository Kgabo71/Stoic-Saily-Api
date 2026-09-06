import React, { useState, useEffect } from 'react';
import { OpenLibraryDoc } from '../types';
import { 
  searchOpenLibrary, 
  fetchSubjectStoics, 
  CURATED_STOIC_BOOKS, 
  getBookCoverUrl 
} from '../services/openLibrary';
import { STOIC_AUTHORS } from '../data/stoicData';
import { AmbientCard } from './AmbientCard';
import { 
  Search, 
  BookOpen, 
  Globe, 
  Sparkles, 
  ExternalLink, 
  Bookmark, 
  Calendar, 
  Users, 
  Loader2,
  Filter
} from 'lucide-react';

interface LibraryTabProps {
  onSelectBook: (book: OpenLibraryDoc) => void;
  savedBooks: OpenLibraryDoc[];
  onToggleSaveBook: (book: OpenLibraryDoc) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({
  onSelectBook,
  savedBooks,
  onToggleSaveBook
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'marcus' | 'seneca' | 'epictetus' | 'saved'>('all');
  const [books, setBooks] = useState<OpenLibraryDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  // Initialize with curated Open Library Stoic collection
  useEffect(() => {
    loadDefaultStoics();
  }, []);

  const loadDefaultStoics = async () => {
    setLoading(true);
    try {
      const subjectBooks = await fetchSubjectStoics(15);
      if (subjectBooks && subjectBooks.length > 0) {
        setBooks(subjectBooks);
      } else {
        // Fallback to curated
        setBooks(CURATED_STOIC_BOOKS.map(b => ({
          key: `/works/${b.openLibraryWorkKey}`,
          title: b.title,
          author_name: [b.author],
          author_key: [b.authorKey],
          first_publish_year: b.firstPublishYear,
          cover_i: b.coverId,
          edition_count: b.editionsCount,
          subject: b.keyThemes
        })));
      }
    } catch (err) {
      console.warn('Error loading stoic books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadDefaultStoics();
      return;
    }

    setLoading(true);
    setActiveFilter('all');
    try {
      const results = await searchOpenLibrary(searchQuery, 16);
      setBooks(results);
    } catch (err) {
      console.warn('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterClick = async (filter: 'all' | 'marcus' | 'seneca' | 'epictetus' | 'saved') => {
    setActiveFilter(filter);
    if (filter === 'saved') return;

    setLoading(true);
    try {
      if (filter === 'all') {
        await loadDefaultStoics();
      } else if (filter === 'marcus') {
        const res = await searchOpenLibrary('Marcus Aurelius Meditations', 12);
        setBooks(res);
      } else if (filter === 'seneca') {
        const res = await searchOpenLibrary('Lucius Annaeus Seneca Letters', 12);
        setBooks(res);
      } else if (filter === 'epictetus') {
        const res = await searchOpenLibrary('Epictetus Discourses Enchiridion', 12);
        setBooks(res);
      }
    } catch (err) {
      console.warn('Filter search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayedBooks = activeFilter === 'saved' ? savedBooks : books;

  return (
    <div className="space-y-6 pb-10">
      {/* Title & Open Library Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase" style={{ color: 'var(--accent-primary)' }}>
            <Globe className="w-3.5 h-3.5" />
            <span>Open Library APIs (Internet Archive)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-tight" style={{ color: 'var(--text-primary)' }}>
            The Stoic Library
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px]" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-color)' }}>
            <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
            <span>{displayedBooks.length} Editions Indexed</span>
          </span>
        </div>
      </div>

      {/* Live Open Library Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            id="openlibrary-search-input"
            type="text"
            placeholder="Search Open Library (e.g. Seneca On Anger, Meditations, Epictetus)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 shadow-sm"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          />
          <Search className="w-4 h-4 absolute left-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />

          <button
            type="submit"
            id="search-submit-btn"
            disabled={loading}
            className="absolute right-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center gap-1"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--accent-text)'
            }}
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
          </button>
        </div>
      </form>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          id="filter-all"
          onClick={() => handleFilterClick('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeFilter === 'all' ? 'ring-2' : 'opacity-80'
          }`}
          style={{
            backgroundColor: activeFilter === 'all' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: activeFilter === 'all' ? 'var(--accent-text)' : 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          All Classics
        </button>

        <button
          id="filter-marcus"
          onClick={() => handleFilterClick('marcus')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeFilter === 'marcus' ? 'ring-2' : 'opacity-80'
          }`}
          style={{
            backgroundColor: activeFilter === 'marcus' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: activeFilter === 'marcus' ? 'var(--accent-text)' : 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          Marcus Aurelius
        </button>

        <button
          id="filter-seneca"
          onClick={() => handleFilterClick('seneca')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeFilter === 'seneca' ? 'ring-2' : 'opacity-80'
          }`}
          style={{
            backgroundColor: activeFilter === 'seneca' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: activeFilter === 'seneca' ? 'var(--accent-text)' : 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          Seneca
        </button>

        <button
          id="filter-epictetus"
          onClick={() => handleFilterClick('epictetus')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeFilter === 'epictetus' ? 'ring-2' : 'opacity-80'
          }`}
          style={{
            backgroundColor: activeFilter === 'epictetus' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: activeFilter === 'epictetus' ? 'var(--accent-text)' : 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          Epictetus
        </button>

        <button
          id="filter-saved"
          onClick={() => handleFilterClick('saved')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
            activeFilter === 'saved' ? 'ring-2' : 'opacity-80'
          }`}
          style={{
            backgroundColor: activeFilter === 'saved' ? 'var(--accent-primary)' : 'var(--bg-surface)',
            color: activeFilter === 'saved' ? 'var(--accent-text)' : 'var(--text-primary)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Bookmark className="w-3 h-3" />
          <span>My Reading Stoa ({savedBooks.length})</span>
        </button>
      </div>

      {/* Classical Stoic Masters Showcase Row */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Stoic Masters on Open Library
            </h3>
          </div>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Tap author to view biography
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {STOIC_AUTHORS.map((author) => {
            const isSelected = selectedAuthor === author.id;
            return (
              <button
                key={author.id}
                id={`author-card-${author.id}`}
                onClick={() => setSelectedAuthor(isSelected ? null : author.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected ? 'ring-2' : 'hover:scale-[1.02]'
                }`}
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-color)',
                  boxShadow: isSelected ? '0 8px 24px -4px var(--glow-strong)' : 'none'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div 
                    className="w-9 h-9 rounded-full overflow-hidden border flex-shrink-0"
                    style={{ borderColor: 'var(--accent-primary)' }}
                  >
                    <img 
                      src={`https://covers.openlibrary.org/a/olid/${author.openLibraryKey}-M.jpg`} 
                      alt={author.name}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // fallback if author portrait not in OL
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-cinzel text-xs font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                      {author.name}
                    </h4>
                    <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                      {author.era}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {author.title}
                </p>
              </button>
            );
          })}
        </div>

        {/* Expanded Author Bio if Selected */}
        {selectedAuthor && (
          <div className="mt-3">
            {(() => {
              const a = STOIC_AUTHORS.find(x => x.id === selectedAuthor);
              if (!a) return null;
              return (
                <AmbientCard elevation="sm" className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-cinzel text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                        {a.name} — {a.title}
                      </h4>
                      <p className="text-xs font-serif italic" style={{ color: 'var(--accent-primary)' }}>
                        Open Library Key: {a.openLibraryKey} • Era: {a.era}
                      </p>
                    </div>
                    <a
                      href={`https://openlibrary.org/authors/${a.openLibraryKey}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border"
                      style={{
                        backgroundColor: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-color)',
                        color: 'var(--accent-primary)'
                      }}
                    >
                      <span>Author on Open Library</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs font-serif leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {a.bio}
                  </p>
                  <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5 items-center text-[11px]">
                    <span className="font-bold text-[10px] uppercase" style={{ color: 'var(--text-muted)' }}>Essential Texts:</span>
                    {a.famousWorks.map((w, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md border text-[10px]" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </AmbientCard>
              );
            })()}
          </div>
        )}
      </div>

      {/* Books Grid with Ambient Glowing Shadows */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {activeFilter === 'saved' ? 'Saved to Your Reading Stoa' : 'Open Library Canonical Editions'}
          </h3>
          {loading && (
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent-primary)' }}>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Querying Open Library...</span>
            </div>
          )}
        </div>

        {displayedBooks.length === 0 && !loading ? (
          <AmbientCard elevation="sm" className="p-8 text-center">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" style={{ color: 'var(--accent-primary)' }} />
            <h4 className="font-cinzel text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {activeFilter === 'saved' ? 'Your Reading Stoa is Empty' : 'No Open Library Results Found'}
            </h4>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              {activeFilter === 'saved' 
                ? 'Save timeless works from Marcus Aurelius, Seneca, or Epictetus to build your personal sanctuary bookshelf.' 
                : 'Try searching for "Meditations", "Seneca Letters", or "Stoics".'}
            </p>
          </AmbientCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayedBooks.map((book) => {
              const coverUrl = getBookCoverUrl(book.cover_i, 'M');
              const isSaved = savedBooks.some(b => b.key === book.key);
              const authorText = book.author_name ? book.author_name.join(', ') : 'Classical Stoic';

              return (
                <AmbientCard
                  key={book.key}
                  elevation="md"
                  interactive={true}
                  onClick={() => onSelectBook(book)}
                  className="p-4 cursor-pointer flex flex-col justify-between group h-full"
                >
                  <div className="flex gap-3.5">
                    {/* Cover thumbnail from Open Library CDN */}
                    <div className="w-18 h-26 sm:w-20 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md border relative" style={{ borderColor: 'var(--border-color)' }}>
                      {coverUrl ? (
                        <img 
                          src={coverUrl} 
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
                          style={{ backgroundColor: 'var(--bg-surface-elevated)' }}
                        >
                          <BookOpen className="w-5 h-5 mb-1" style={{ color: 'var(--accent-primary)' }} />
                          <span className="text-[9px] font-bold font-cinzel line-clamp-2" style={{ color: 'var(--text-primary)' }}>
                            {book.title}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Book Metadata */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-cinzel text-sm font-bold line-clamp-2 group-hover:text-amber-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
                          {book.title}
                        </h4>
                        <p className="text-xs font-semibold truncate mt-0.5" style={{ color: 'var(--accent-primary)' }}>
                          {authorText}
                        </p>
                      </div>

                      <div className="mt-2 space-y-1 text-[11px]" style={{ color: 'var(--text-secondary)' }}>
                        {book.first_publish_year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{book.first_publish_year > 0 ? `${book.first_publish_year} CE` : `${Math.abs(book.first_publish_year)} BCE`}</span>
                          </div>
                        )}
                        {book.edition_count && (
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>{book.edition_count} Open Library Editions</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                      Tap for Details & Scan
                    </span>

                    <button
                      id={`save-book-${book.key.replace(/[^a-zA-Z0-9]/g, '-')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSaveBook(book);
                      }}
                      className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                      title={isSaved ? 'Remove from Stoa' : 'Save to Reading Stoa'}
                      style={{ color: isSaved ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </AmbientCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

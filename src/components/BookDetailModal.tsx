import React, { useState, useEffect } from 'react';
import { OpenLibraryDoc, OpenLibraryWorkDetails } from '../types';
import { fetchWorkDetails, getBookCoverUrl } from '../services/openLibrary';
import { X, ExternalLink, Bookmark, CheckCircle, BookOpen, Clock, Calendar, Globe, Sparkles } from 'lucide-react';
import { AmbientCard } from './AmbientCard';

interface BookDetailModalProps {
  book: OpenLibraryDoc | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (book: OpenLibraryDoc) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isOpen,
  onClose,
  isSaved,
  onToggleSave
}) => {
  const [workDetails, setWorkDetails] = useState<OpenLibraryWorkDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (!book || !isOpen) {
      setWorkDetails(null);
      return;
    }

    let isMounted = true;
    if (book.key) {
      setLoadingDetails(true);
      fetchWorkDetails(book.key)
        .then((details) => {
          if (isMounted) {
            setWorkDetails(details);
            setLoadingDetails(false);
          }
        })
        .catch(() => {
          if (isMounted) setLoadingDetails(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const authorName = book.author_name ? book.author_name.join(', ') : 'Classical Stoic Philosopher';
  const coverUrl = getBookCoverUrl(book.cover_i, 'L');
  const openLibraryUrl = `https://openlibrary.org${book.key}`;

  const getDescriptionText = (): string => {
    if (!workDetails?.description) {
      return 'A fundamental pillar of Stoic philosophy. Open Library indexes historical editions, critical commentaries, and full-text scans of this work.';
    }
    if (typeof workDetails.description === 'string') {
      return workDetails.description;
    }
    return workDetails.description.value || 'Classical Stoic text.';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-3xl p-6 sm:p-7 relative shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          boxShadow: '0 25px 60px -15px var(--glow-strong), 0 0 35px 2px var(--glow-accent)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
            <Globe className="w-4 h-4" />
            <span>Open Library Edition</span>
          </div>
          <button
            id="close-book-detail-btn"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section with Ambient Glowing Book Cover */}
        <div className="mt-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start">
          <div className="flex-shrink-0 relative group">
            {coverUrl ? (
              <div 
                className="w-32 h-48 sm:w-36 sm:h-52 rounded-xl overflow-hidden shadow-xl border relative"
                style={{
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 16px 36px -8px var(--glow-strong), 0 0 25px 2px var(--glow-accent)'
                }}
              >
                <img 
                  src={coverUrl} 
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div 
                className="w-32 h-48 sm:w-36 sm:h-52 rounded-xl flex flex-col items-center justify-center p-3 text-center border shadow-xl"
                style={{
                  background: 'var(--card-gradient)',
                  borderColor: 'var(--border-color)',
                  boxShadow: '0 12px 30px -6px var(--glow-strong)'
                }}
              >
                <BookOpen className="w-8 h-8 mb-2" style={{ color: 'var(--accent-primary)' }} />
                <span className="font-cinzel text-xs font-bold line-clamp-3" style={{ color: 'var(--text-primary)' }}>
                  {book.title}
                </span>
                <span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Open Library
                </span>
              </div>
            )}
          </div>

          {/* Book Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold font-cinzel tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {book.title}
            </h2>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--accent-primary)' }}>
              {authorName}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
              {book.first_publish_year && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <Calendar className="w-3.5 h-3.5" />
                  First published: {book.first_publish_year > 0 ? `${book.first_publish_year} CE` : `${Math.abs(book.first_publish_year)} BCE`}
                </span>
              )}
              {book.edition_count && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  <BookOpen className="w-3.5 h-3.5" />
                  {book.edition_count} Editions
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex flex-wrap gap-2.5 justify-center sm:justify-start">
              <button
                id="bookmark-book-btn"
                onClick={() => onToggleSave(book)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm"
                style={{
                  backgroundColor: isSaved ? 'var(--accent-primary)' : 'var(--bg-surface-elevated)',
                  color: isSaved ? 'var(--accent-text)' : 'var(--text-primary)',
                  borderColor: 'var(--border-color)',
                  borderWidth: '1px'
                }}
              >
                {isSaved ? <CheckCircle className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'In My Reading Stoa' : 'Save to Reading List'}</span>
              </button>

              <a
                id="openlibrary-external-link"
                href={openLibraryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 border"
                style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <span>Read on Open Library</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Synopsis & Subjects */}
        <div className="mt-6 space-y-4">
          <AmbientCard elevation="sm" className="p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: 'var(--accent-primary)' }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Philosophical Synopsis & Context</span>
            </h4>
            {loadingDetails ? (
              <div className="py-4 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                Loading details from Open Library...
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-serif leading-relaxed line-clamp-6" style={{ color: 'var(--text-primary)' }}>
                {getDescriptionText()}
              </p>
            )}
          </AmbientCard>

          {book.subject && book.subject.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Subjects & Disciplines
              </p>
              <div className="flex flex-wrap gap-1.5">
                {book.subject.slice(0, 8).map((sub, idx) => (
                  <span 
                    key={idx}
                    className="text-[11px] px-2.5 py-1 rounded-lg border"
                    style={{
                      backgroundColor: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2.5" style={{ backgroundColor: 'var(--bg-surface-elevated)', borderColor: 'var(--border-subtle)' }}>
            <Clock className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            <p style={{ color: 'var(--text-muted)' }}>
              Data synchronized directly via the public <strong>Open Library API (Internet Archive)</strong>. Public domain editions are freely borrowable and readable online.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

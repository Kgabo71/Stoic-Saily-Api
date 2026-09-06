/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, ThemeId, OpenLibraryDoc } from './types';
import { MobileFrame } from './components/MobileFrame';
import { TodayTab } from './components/TodayTab';
import { LibraryTab } from './components/LibraryTab';
import { PracticesTab } from './components/PracticesTab';
import { JournalTab } from './components/JournalTab';
import { SettingsTab } from './components/SettingsTab';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { BookDetailModal } from './components/BookDetailModal';

const SAVED_BOOKS_STORAGE_KEY = 'stoic_saved_books';
const THEME_STORAGE_KEY = 'stoic_active_theme';
const GLOW_STORAGE_KEY = 'stoic_glow_intensity';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [currentTheme, setCurrentTheme] = useState<ThemeId>('theme-obsidian');
  const [glowIntensity, setGlowIntensity] = useState<number>(1.0);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<OpenLibraryDoc | null>(null);
  const [savedBooks, setSavedBooks] = useState<OpenLibraryDoc[]>([]);
  const [activeJournalPrompt, setActiveJournalPrompt] = useState<string | undefined>();

  // Initialize theme, glow, and saved books from localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as ThemeId;
      if (storedTheme) {
        setCurrentTheme(storedTheme);
      }

      const storedGlow = localStorage.getItem(GLOW_STORAGE_KEY);
      if (storedGlow) {
        setGlowIntensity(parseFloat(storedGlow));
      }

      const storedBooks = localStorage.getItem(SAVED_BOOKS_STORAGE_KEY);
      if (storedBooks) {
        setSavedBooks(JSON.parse(storedBooks));
      }
    } catch (e) {
      console.warn('LocalStorage retrieval error:', e);
    }
  }, []);

  // Synchronize dynamic theme classes on document.body
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(currentTheme);

    // Apply glow intensity factor to document root styles
    document.documentElement.style.setProperty('--glow-scale', glowIntensity.toString());
  }, [currentTheme, glowIntensity]);

  const handleSelectTheme = (theme: ThemeId) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  const handleGlowIntensityChange = (val: number) => {
    setGlowIntensity(val);
    try {
      localStorage.setItem(GLOW_STORAGE_KEY, val.toString());
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  };

  const handleToggleSaveBook = (book: OpenLibraryDoc) => {
    setSavedBooks((prev) => {
      const exists = prev.some((b) => b.key === book.key);
      let updated: OpenLibraryDoc[];
      if (exists) {
        updated = prev.filter((b) => b.key !== book.key);
      } else {
        updated = [book, ...prev];
      }
      try {
        localStorage.setItem(SAVED_BOOKS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Error saving book to storage:', e);
      }
      return updated;
    });
  };

  const handleOpenJournalWithPrompt = (promptText: string) => {
    setActiveJournalPrompt(promptText);
    setActiveTab('journal');
  };

  return (
    <div className={`min-h-screen ${currentTheme} transition-colors duration-300 font-sans`}>
      <MobileFrame
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        savedBooksCount={savedBooks.length}
      >
        {activeTab === 'today' && (
          <TodayTab
            onOpenJournal={handleOpenJournalWithPrompt}
            onOpenLibrary={() => setActiveTab('library')}
          />
        )}

        {activeTab === 'library' && (
          <LibraryTab
            onSelectBook={(book) => setSelectedBook(book)}
            savedBooks={savedBooks}
            onToggleSaveBook={handleToggleSaveBook}
          />
        )}

        {activeTab === 'practices' && <PracticesTab />}

        {activeTab === 'journal' && (
          <JournalTab
            initialPrompt={activeJournalPrompt}
            onClearInitialPrompt={() => setActiveJournalPrompt(undefined)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            currentTheme={currentTheme}
            onSelectTheme={handleSelectTheme}
            glowIntensity={glowIntensity}
            onGlowIntensityChange={handleGlowIntensityChange}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
          />
        )}
      </MobileFrame>

      {/* Dynamic Theme & Ambient Glow Modal */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        glowIntensity={glowIntensity}
        onGlowIntensityChange={handleGlowIntensityChange}
      />

      {/* Open Library Book Details Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        isSaved={selectedBook ? savedBooks.some((b) => b.key === selectedBook.key) : false}
        onToggleSave={handleToggleSaveBook}
      />
    </div>
  );
}

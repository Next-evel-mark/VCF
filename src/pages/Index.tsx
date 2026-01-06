import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { BookList } from '@/components/BookList';
import { ChapterSelector } from '@/components/ChapterSelector';
import { VerseReader } from '@/components/VerseReader';
import { SearchPanel } from '@/components/SearchPanel';
import { BookmarksPanel } from '@/components/BookmarksPanel';
import { HomePanel } from '@/components/HomePanel';
import { BibleProvider, useBible } from '@/contexts/BibleContext';
import { Book, Chapter, bibleData } from '@/data/bibleData';

type ViewState = 'home' | 'books' | 'chapters' | 'reading' | 'search' | 'bookmarks';

const BibleApp: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const { setCurrentBook, setCurrentChapter } = useBible();

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'home':
        setViewState('home');
        break;
        case 'books':
        if (selectedChapter) {
          setViewState('reading');
        } else if (selectedBook) {
          setViewState('chapters');
        } else {
          setViewState('books');
        }
        break;
      case 'search':
        setViewState('search');
        break;
      case 'bookmarks':
        setViewState('bookmarks');
        break;
    }
  };

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentBook(book);
    setViewState('chapters');
    setActiveTab('books');
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setCurrentChapter(chapter);
    setViewState('reading');
  };

  const handleBackFromChapters = () => {
    setSelectedBook(null);
    setViewState('books');
  };

  const handleBackFromReading = () => {
    setSelectedChapter(null);
    setViewState('chapters');
  };
  const handleNavigateChapter = (direction: 'prev' | 'next') => {
    if (!selectedBook || !selectedChapter) return;

    const currentIndex = selectedBook.chapters.findIndex(
      (c) => c.number === selectedChapter.number
    );

    if (direction === 'prev' && currentIndex > 0) {
      handleSelectChapter(selectedBook.chapters[currentIndex - 1]);
    } else if (direction === 'next' && currentIndex < selectedBook.chapters.length - 1) {
      handleSelectChapter(selectedBook.chapters[currentIndex + 1]);
    }
  };

  const handleSearchResult = (bookName: string, chapterNumber: number) => {
    // Find the book
    for (const testament of bibleData.testaments) {
      const book = testament.books.find((b) => b.name === bookName);
      if (book) {
        const chapter = book.chapters.find((c) => c.number === chapterNumber);
        if (chapter) {
          setSelectedBook(book);
          setCurrentBook(book);
          setSelectedChapter(chapter);
          setCurrentChapter(chapter);
          setViewState('reading');
          setActiveTab('books');
          return;
        }
      }
    }
  };

  const handleContinueReading = (book: Book, chapter: Chapter) => {
    setSelectedBook(book);
    setCurrentBook(book);
    setSelectedChapter(chapter);
    setCurrentChapter(chapter);
    setViewState('reading');
    setActiveTab('books');
  };
  const handleStartReading = () => {
    setActiveTab('books');
    setViewState('books');
  };

  const canNavigatePrev = selectedBook && selectedChapter 
    ? selectedBook.chapters.findIndex(c => c.number === selectedChapter.number) > 0
    : false;
  
  const canNavigateNext = selectedBook && selectedChapter
    ? selectedBook.chapters.findIndex(c => c.number === selectedChapter.number) < selectedBook.chapters.length - 1
    : false;

  const renderContent = () => {
    switch (viewState) {
      case 'home':
        return (
          <HomePanel
            onContinueReading={handleContinueReading}
            onStartReading={handleStartReading}
          />
        );
      case 'books':
        return (
          <BookList
            onSelectBook={handleSelectBook}
            selectedBook={selectedBook}
          />
        );
      case 'chapters':
        return selectedBook ? (
          <ChapterSelector
            book={selectedBook}
            onSelectChapter={handleSelectChapter}
            onBack={handleBackFromChapters}
            selectedChapter={selectedChapter}
          />
        ) : null;
        case 'reading':
        return selectedBook && selectedChapter ? (
          <VerseReader
            book={selectedBook}
            chapter={selectedChapter}
            onBack={handleBackFromReading}
            onNavigateChapter={handleNavigateChapter}
            canNavigatePrev={canNavigatePrev}
            canNavigateNext={canNavigateNext}
          />
        ) : null;
      case 'search':
        return <SearchPanel onSelectResult={handleSearchResult} />;
      case 'bookmarks':
        return <BookmarksPanel onSelectBookmark={handleSearchResult} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <BibleProvider>
      <BibleApp />
    </BibleProvider>
  );
};

export default Index;

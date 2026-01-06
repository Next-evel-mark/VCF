import React, { useState } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { bibleData, Book } from '@/data/bibleData';
import { cn } from '@/lib/utils';

interface BookListProps {
  onSelectBook: (book: Book) => void;
  selectedBook?: Book | null;
}

export const BookList: React.FC<BookListProps> = ({ onSelectBook, selectedBook }) => {
  const [expandedTestament, setExpandedTestament] = useState<string | null>('Old Testament');

  return (
    <div className="h-full overflow-y-auto">
      {bibleData.testaments.map((testament) => (
        <div key={testament.name} className="mb-2">
          <button
            onClick={() => setExpandedTestament(
              expandedTestament === testament.name ? null : testament.name
            )}
            className={cn(
              "flex w-full items-center justify-between px-4 py-3 text-left font-semibold transition-colors",
              "hover:bg-secondary/50",
              expandedTestament === testament.name && "bg-secondary"
            )}
          >
            <span className="text-sm uppercase tracking-wider text-muted-foreground">
              {testament.name}
            </span>
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                expandedTestament === testament.name && "rotate-90"
              )}
            />
          </button>

          {expandedTestament === testament.name && (
            <div className="animate-fade-in">
              {testament.books.map((book, index) => (
                <button
                  key={book.name}
                  onClick={() => onSelectBook(book)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-all",
                    "hover:bg-secondary/50 hover:pl-6",
                    selectedBook?.name === book.name && "bg-accent/20 border-l-2 border-accent pl-6"
                  )}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{book.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {book.chapters.length} ch
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>

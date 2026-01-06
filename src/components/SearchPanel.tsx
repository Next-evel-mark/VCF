import React, { useState, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { searchVerses, SearchResult } from '@/data/bibleData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchPanelProps {
  onSelectResult: (bookName: string, chapterNumber: number) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    
    if (searchQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      const searchResults = searchVerses(searchQuery);
      setResults(searchResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-accent/30 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search verses..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {query.trim().length > 0 && query.trim().length < 3 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Enter at least 3 characters to search
          </p>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : results.length > 0 ? (
          <div className="divide-y divide-border">
            {results.map((result, index) => (
              <button
                key={`${result.reference}-${index}`}
                onClick={() => onSelectResult(result.book, result.chapter)}
                className={cn(
                  "w-full px-4 py-4 text-left transition-colors hover:bg-secondary/50",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <p className="mb-1 text-sm font-medium text-accent">
                  {result.reference}
                </p>
                <p className="scripture-text text-sm text-foreground line-clamp-2">
                  {highlightMatch(result.verse.text, query)}
                </p>
              </button>
            ))}
          </div>
        ) : query.trim().length >= 3 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No verses found</p>
            <p className="text-xs text-muted-foreground">Try a different search term</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Search the Scriptures</p>
            <p className="text-xs text-muted-foreground">Find verses by keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

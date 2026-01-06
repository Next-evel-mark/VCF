import React from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { useBible } from '@/contexts/BibleContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BookmarksPanelProps {
  onSelectBookmark: (bookName: string, chapterNumber: number) => void;
}

export const BookmarksPanel: React.FC<BookmarksPanelProps> = ({ onSelectBookmark }) => {
  const { bookmarks, removeBookmark } = useBible();

  const sortedBookmarks = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt);

  if (bookmarks.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <Bookmark className="mb-3 h-12 w-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No bookmarks yet</p>
        <p className="text-xs text-muted-foreground">Tap the bookmark icon on any verse</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold">Bookmarks</h3>
        <p className="text-xs text-muted-foreground">{bookmarks.length} saved verses</p>
      </div>
      
      <div className="divide-y divide-border">
        {sortedBookmarks.map((bookmark, index) => (
          <div
            key={bookmark.id}
            className={cn(
              "group relative px-4 py-4 transition-colors hover:bg-secondary/50",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <button
              onClick={() => onSelectBookmark(bookmark.bookName, bookmark.chapter)}
              className="w-full text-left"
            >
              <p className="mb-1 text-sm font-medium text-accent">
                {bookmark.bookName} {bookmark.chapter}:{bookmark.verse}
              </p>
              <p className="scripture-text text-sm text-foreground line-clamp-2">
                {bookmark.text}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(bookmark.createdAt).toLocaleDateString()}
              </p>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBookmark(bookmark.id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};


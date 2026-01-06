import kjvRaw from './kjv-raw.json';

export interface Verse {
  number: number;
  text: string;
}

export interface Chapter {
  number: number;
  verses: Verse[];
}

export interface Book {
  name: string;
  abbrev: string;
  chapters: Chapter[];
}

export interface Testament {
  name: string;
  books: Book[];
}

export interface BibleData {
  testaments: Testament[];
}

// Book metadata with full names and abbreviations
const bookMetadata: { name: string; abbrev: string }[] = [
  // Old Testament (39 books)
  { name: "Genesis", abbrev: "Gen" },
  { name: "Exodus", abbrev: "Exod" },
  { name: "Leviticus", abbrev: "Lev" },
  { name: "Numbers", abbrev: "Num" },
  { name: "Deuteronomy", abbrev: "Deut" },
  { name: "Joshua", abbrev: "Josh" },
  { name: "Judges", abbrev: "Judg" },
  { name: "Ruth", abbrev: "Ruth" },
  { name: "1 Samuel", abbrev: "1Sam" },
  { name: "2 Samuel", abbrev: "2Sam" },
  { name: "1 Kings", abbrev: "1Kgs" },
  { name: "2 Kings", abbrev: "2Kgs" },
  { name: "1 Chronicles", abbrev: "1Chr" },
  { name: "2 Chronicles", abbrev: "2Chr" },
  { name: "Ezra", abbrev: "Ezra" },
  { name: "Nehemiah", abbrev: "Neh" },
  { name: "Esther", abbrev: "Esth" },
  { name: "Job", abbrev: "Job" },
  { name: "Psalms", abbrev: "Ps" },
  { name: "Proverbs", abbrev: "Prov" },
  { name: "Ecclesiastes", abbrev: "Eccl" },
  { name: "Song of Solomon", abbrev: "Song" },
  { name: "Isaiah", abbrev: "Isa" },
  { name: "Jeremiah", abbrev: "Jer" },
  { name: "Lamentations", abbrev: "Lam" },
  { name: "Ezekiel", abbrev: "Ezek" },
  { name: "Daniel", abbrev: "Dan" },
  { name: "Hosea", abbrev: "Hos" },
  { name: "Joel", abbrev: "Joel" },
  { name: "Amos", abbrev: "Amos" },
  { name: "Obadiah", abbrev: "Obad" },
  { name: "Jonah", abbrev: "Jonah" },
  { name: "Micah", abbrev: "Mic" },
  { name: "Nahum", abbrev: "Nah" },
  { name: "Habakkuk", abbrev: "Hab" },
  { name: "Zephaniah", abbrev: "Zeph" },
  { name: "Haggai", abbrev: "Hag" },
  { name: "Zechariah", abbrev: "Zech" },
  { name: "Malachi", abbrev: "Mal" },
  // New Testament (27 books)
  { name: "Matthew", abbrev: "Matt" },
  { name: "Mark", abbrev: "Mark" },
  { name: "Luke", abbrev: "Luke" },
  { name: "John", abbrev: "John" },
  { name: "Acts", abbrev: "Acts" },
  { name: "Romans", abbrev: "Rom" },
  { name: "1 Corinthians", abbrev: "1Cor" },
  { name: "2 Corinthians", abbrev: "2Cor" },
  { name: "Galatians", abbrev: "Gal" },
  { name: "Ephesians", abbrev: "Eph" },
  { name: "Philippians", abbrev: "Phil" },
  { name: "Colossians", abbrev: "Col" },
  { name: "1 Thessalonians", abbrev: "1Thess" },
  { name: "2 Thessalonians", abbrev: "2Thess" },
  { name: "1 Timothy", abbrev: "1Tim" },
  { name: "2 Timothy", abbrev: "2Tim" },
  { name: "Titus", abbrev: "Titus" },
  { name: "Philemon", abbrev: "Phlm" },
  { name: "Hebrews", abbrev: "Heb" },
  { name: "James", abbrev: "Jas" },
  { name: "1 Peter", abbrev: "1Pet" },
  { name: "2 Peter", abbrev: "2Pet" },
  { name: "1 John", abbrev: "1John" },
  { name: "2 John", abbrev: "2John" },
  { name: "3 John", abbrev: "3John" },
  { name: "Jude", abbrev: "Jude" },
  { name: "Revelation", abbrev: "Rev" }
];

// Clean verse text by removing Hebrew/Greek annotations in curly braces
function cleanVerseText(text: string): string {
  return text.replace(/\s*\{[^}]*\}\s*/g, ' ').replace(/\s+/g, ' ').trim();
}

// Transform raw KJV data into our structure
function transformBibleData(): BibleData {
  const rawData = kjvRaw as { abbrev: string; chapters: string[][] }[];
  
  const oldTestamentBooks: Book[] = [];
  const newTestamentBooks: Book[] = [];
  
  rawData.forEach((rawBook, index) => {
    const metadata = bookMetadata[index];
    if (!metadata) return;
    
    const book: Book = {
      name: metadata.name,
      abbrev: metadata.abbrev,
      chapters: rawBook.chapters.map((chapterVerses, chapterIndex) => ({
        number: chapterIndex + 1,
        verses: chapterVerses.map((verseText, verseIndex) => ({
          number: verseIndex + 1,
          text: cleanVerseText(verseText)
        }))
      }))
    };
    
    // First 39 books are Old Testament, remaining 27 are New Testament
    if (index < 39) {
      oldTestamentBooks.push(book);
    } else {
      newTestamentBooks.push(book);
    }
  });
  
  return {
    testaments: [
      { name: "Old Testament", books: oldTestamentBooks },
      { name: "New Testament", books: newTestamentBooks }
    ]
  };
}

// Export the transformed Bible data
export const bibleData: BibleData = transformBibleData();

// Helper function to get all books
export const getAllBooks = (): Book[] => {
  return bibleData.testaments.flatMap(testament => testament.books);
};

// Search result type
export interface SearchResult {
  book: string;
  chapter: number;
  verse: {
    number: number;
    text: string;
  };
  reference: string;
}

// Helper function to search verses
export const searchVerses = (query: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const lowerQuery = query.toLowerCase();
  
  bibleData.testaments.forEach(testament => {
    testament.books.forEach(book => {
      book.chapters.forEach(chapter => {
        chapter.verses.forEach(verse => {
          if (verse.text.toLowerCase().includes(lowerQuery)) {
            results.push({
              book: book.name,
              chapter: chapter.number,
              verse: {
                number: verse.number,
                text: verse.text
              },
              reference: `${book.name} ${chapter.number}:${verse.number}`
            });
          }
        });
      });
    });
  });
  
  return results.slice(0, 100); // Limit results for performance

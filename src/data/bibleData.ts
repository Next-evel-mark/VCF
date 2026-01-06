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

import axios from 'axios';
import { getCachedData, setCachedData } from '../utils/cache';

const BASE_URL = 'https://bible-api.com';

export const bibleApi = {
  // Get all books
  getAllBooks: async () => {
    try {
      const cachedData = await getCachedData('allBooks');
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${BASE_URL}/books`);
      await setCachedData('allBooks', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  },

  // Get specific book
  getBook: async (bookId) => {
    try {
      const cacheKey = `book_${bookId}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${BASE_URL}/${bookId}`);
      await setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching book ${bookId}:`, error);
      throw error;
    }
  },

  // Get specific chapter
  getChapter: async (bookId, chapter) => {
    try {
      const cacheKey = `chapter_${bookId}_${chapter}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${BASE_URL}/${bookId}+${chapter}`);
      await setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${bookId} ${chapter}:`, error);
      throw error;
    }
  },

  // Get specific verse(s)
  getVerses: async (bookId, chapter, verse = '') => {
    try {
      const cacheKey = `verses_${bookId}_${chapter}_${verse}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const url = verse 
        ? `${BASE_URL}/${bookId}+${chapter}:${verse}`
        : `${BASE_URL}/${bookId}+${chapter}`;
      
      const response = await axios.get(url);
      await setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching verses:`, error);
      throw error;
    }
  },

  // Search verses
  searchVerses: async (query) => {
    try {
      const cacheKey = `search_${query}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      const response = await axios.get(`${BASE_URL}/${query}`);
      await setCachedData(cacheKey, response.data);
      return response.data;
    } catch (error) {
      console.error(`Error searching for ${query}:`, error);
      throw error;
    }
  }
};

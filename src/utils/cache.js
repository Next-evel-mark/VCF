import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@BibleAppCache_';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const setCachedData = async (key, data) => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      `${CACHE_PREFIX}${key}`,
      JSON.stringify(cacheItem)
    );
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key) => {
  try {
    const cachedItem = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    
    if (!cachedItem) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cachedItem);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp > CACHE_DURATION) {
      // Cache expired, remove it
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
};

export const getCacheSize = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    
    let totalSize = 0;
    for (const key of cacheKeys) {
      const item = await AsyncStorage.getItem(key);
      totalSize += item ? item.length : 0;
    }
    
    return {
      count: cacheKeys.length,
      size: totalSize,
      sizeInKB: (totalSize / 1024).toFixed(2),
    };
  } catch (error) {
    console.error('Error getting cache size:', error);
    return null;
  }
};

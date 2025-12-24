import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

const IMAGE_CACHE_KEY = '@omdb_movie_explorer:image_cache';
const CACHE_EXPIRY_DAYS = 7; // Cache images for 7 days

interface CachedImage {
  uri: string;
  timestamp: number;
  prefetched: boolean;
}

/**
 * Image cache utility using AsyncStorage and Image.prefetch for persistence
 * 
 * Uses React Native's Image.prefetch() to cache images to disk, which persists
 * across app restarts. Tracks prefetched status in AsyncStorage.
 */
class ImageCacheManager {
  private memoryCache: Set<string> = new Set();
  private prefetchingCache: Set<string> = new Set(); // Track images currently being prefetched
  private initialized = false;

  /**
   * Initialize cache from AsyncStorage
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const cached = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
      if (cached) {
        const images: CachedImage[] = JSON.parse(cached);
        const now = Date.now();
        const expiryTime = CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

        // Filter out expired entries and add to memory cache
        const validImages = images.filter(img => {
          const isValid = now - img.timestamp < expiryTime;
          if (isValid && img.prefetched) {
            this.memoryCache.add(img.uri);
          }
          return isValid;
        });

        // Update storage with only valid entries
        if (validImages.length !== images.length) {
          await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(validImages));
        }
      }
      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize image cache:', error);
      this.initialized = true; // Continue even if initialization fails
    }
  }

  /**
   * Check if image URI is cached
   */
  isCached(uri: string): boolean {
    return this.memoryCache.has(uri);
  }

  /**
   * Prefetch and cache image to disk (persists across app restarts)
   */
  async prefetchImage(uri: string): Promise<boolean> {
    if (!uri || this.prefetchingCache.has(uri)) return false;
    if (this.memoryCache.has(uri)) return true; // Already cached

    try {
      await this.initialize();
      this.prefetchingCache.add(uri);

      // Use Image.prefetch to cache image to disk
      const success = await Image.prefetch(uri);
      
      if (success) {
        this.memoryCache.add(uri);
        this.prefetchingCache.delete(uri);

        // Persist to AsyncStorage
        const cached = await AsyncStorage.getItem(IMAGE_CACHE_KEY);
        const images: CachedImage[] = cached ? JSON.parse(cached) : [];
        
        // Remove if already exists (update timestamp)
        const filtered = images.filter(img => img.uri !== uri);
        filtered.push({ uri, timestamp: Date.now(), prefetched: true });

        await AsyncStorage.setItem(IMAGE_CACHE_KEY, JSON.stringify(filtered));
        return true;
      } else {
        this.prefetchingCache.delete(uri);
        return false;
      }
    } catch (error) {
      console.warn('Failed to prefetch image:', error);
      this.prefetchingCache.delete(uri);
      return false;
    }
  }

  /**
   * Add image URI to cache (for tracking purposes)
   * Note: This doesn't prefetch, use prefetchImage for disk caching
   */
  async addToCache(uri: string): Promise<void> {
    if (!uri || this.memoryCache.has(uri)) return;

    try {
      await this.initialize();

      // Try to prefetch if not already cached
      await this.prefetchImage(uri);
    } catch (error) {
      console.warn('Failed to cache image:', error);
    }
  }

  /**
   * Clear all cached images
   */
  async clearCache(): Promise<void> {
    try {
      this.memoryCache.clear();
      await AsyncStorage.removeItem(IMAGE_CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear image cache:', error);
    }
  }

  /**
   * Get cache size (number of cached images)
   */
  getCacheSize(): number {
    return this.memoryCache.size;
  }
}

// Singleton instance
export const imageCache = new ImageCacheManager();


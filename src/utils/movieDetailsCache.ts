import AsyncStorage from '@react-native-async-storage/async-storage';
import { MovieDetails } from '../api/omdb';

const STORAGE_KEY = '@movie_details_cache';
const CACHE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

type CachedMovieDetails = {
  movie: MovieDetails;
  timestamp: number;
};

export async function getCachedMovieDetails(imdbID: string): Promise<MovieDetails | null> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const cache: Record<string, CachedMovieDetails> = JSON.parse(stored);
    const cached = cache[imdbID];

    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > CACHE_EXPIRY_MS) {
      delete cache[imdbID];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      return null;
    }

    return cached.movie;
  } catch {
    return null;
  }
}

export async function setCachedMovieDetails(imdbID: string, movie: MovieDetails): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const cache: Record<string, CachedMovieDetails> = stored ? JSON.parse(stored) : {};

    cache[imdbID] = {
      movie,
      timestamp: Date.now(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore cache write errors
  }
}

export async function clearMovieDetailsCache(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}


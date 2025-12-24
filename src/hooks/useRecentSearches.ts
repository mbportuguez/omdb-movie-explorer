import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../constants/app';

const STORAGE_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const recentSearchesRef = useRef<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setRecentSearches(parsed);
          recentSearchesRef.current = parsed;
        }
      } catch (err) {
        // noop on read failure
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (searches: string[]) => {
    setRecentSearches(searches);
    recentSearchesRef.current = searches;
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch {
      // ignore write errors
    }
  };

  const addSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
      return;
    }

    const current = recentSearchesRef.current;
    const updated = [
      trimmed,
      ...current.filter(s => s.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);

    await persist(updated);
  }, []);

  const removeSearch = useCallback(async (query: string) => {
    const current = recentSearchesRef.current;
    const updated = current.filter(s => s !== query);
    await persist(updated);
  }, []);

  const clearAll = useCallback(async () => {
    await persist([]);
  }, []);

  const hasSearches = useMemo(() => recentSearches.length > 0, [recentSearches]);

  return {
    recentSearches,
    addSearch,
    removeSearch,
    clearAll,
    hasSearches,
    loading,
  };
}


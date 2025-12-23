import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FavoriteMovie = {
  imdbID: string;
  title: string;
  year?: string;
  type?: string;
  poster?: string;
};

type FavoritesContextValue = {
  favorites: Record<string, FavoriteMovie>;
  toggleFavorite: (movie: FavoriteMovie) => Promise<void>;
  isFavorite: (imdbID: string) => boolean;
  loading: boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

const STORAGE_KEY = '@favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, FavoriteMovie>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        // noop on read failure
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (next: Record<string, FavoriteMovie>) => {
    setFavorites(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore write errors for now
    }
  };

  const toggleFavorite = async (movie: FavoriteMovie) => {
    const exists = favorites[movie.imdbID];
    const next = { ...favorites };
    if (exists) {
      delete next[movie.imdbID];
    } else {
      next[movie.imdbID] = movie;
    }
    await persist(next);
  };

  const isFavorite = (imdbID: string) => Boolean(favorites[imdbID]);

  const value = useMemo(
    () => ({
      favorites,
      toggleFavorite,
      isFavorite,
      loading,
    }),
    [favorites, loading],
  );

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}



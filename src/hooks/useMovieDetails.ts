import { useEffect, useState } from 'react';
import { fetchMovieDetails, MovieDetails } from '../api/omdb';
import { ERROR_MESSAGES } from '../constants/app';
import { getCachedMovieDetails, setCachedMovieDetails } from '../utils/movieDetailsCache';

export function useMovieDetails(imdbID: string) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      setIsOffline(false);

      // Try to load from cache first
      const cached = await getCachedMovieDetails(imdbID);
      if (cached && isMounted) {
        setMovie(cached);
        setLoading(false);
      }

      // Try to fetch from API
      try {
        const details = await fetchMovieDetails(imdbID);
        if (isMounted) {
          if (details) {
            setMovie(details);
            setIsOffline(false);
            // Cache the fresh data
            await setCachedMovieDetails(imdbID, details);
          } else {
            if (!cached) {
              setError(ERROR_MESSAGES.FAILED_TO_LOAD);
            }
          }
        }
      } catch (e) {
        if (isMounted) {
          // If we have cached data, use it and mark as offline
          if (cached) {
            setIsOffline(true);
          } else {
            setError(ERROR_MESSAGES.FAILED_TO_LOAD);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [imdbID]);

  return { movie, loading, error, isOffline };
}


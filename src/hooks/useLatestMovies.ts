import { useEffect, useState } from 'react';
import { searchMovies, MovieSummary } from '../api/omdb';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';

export function useLatestMovies() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLatest = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchMovies({
          query: APP_CONSTANTS.MOVIES.DEFAULT_QUERY,
          page: APP_CONSTANTS.PAGINATION.INITIAL_PAGE,
          type: 'movie',
        });
        if (isMounted) {
          if (result.error) {
            setError(result.error);
          } else {
            setMovies(result.items.slice(0, APP_CONSTANTS.MOVIES.LATEST_COUNT));
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(ERROR_MESSAGES.FAILED_TO_LOAD);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadLatest();

    return () => {
      isMounted = false;
    };
  }, []);

  return { movies, loading, error };
}


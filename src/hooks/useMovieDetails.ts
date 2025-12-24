import { useEffect, useState } from 'react';
import { fetchMovieDetails, MovieDetails } from '../api/omdb';
import { ERROR_MESSAGES } from '../constants/app';

export function useMovieDetails(imdbID: string) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await fetchMovieDetails(imdbID);
        if (isMounted) {
          if (details) {
            setMovie(details);
          } else {
            setError(ERROR_MESSAGES.FAILED_TO_LOAD);
          }
        }
      } catch (e) {
        if (isMounted) {
          setError(ERROR_MESSAGES.FAILED_TO_LOAD);
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

  return { movie, loading, error };
}


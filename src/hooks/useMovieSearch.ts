import { useCallback, useEffect, useRef, useState } from 'react';
import FastImage from 'react-native-fast-image';
import { searchMovies, MovieSummary, MovieType } from '../api/omdb';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';

type UseMovieSearchOptions = {
  debouncedQuery: string;
  type?: MovieType;
  year: string;
  onError?: (error: string) => void;
};

const DEFAULT_ON_ERROR = () => {};

/**
 * Helper function to normalize year input
 */
const normalizeYear = (year: string): string | undefined => {
  const trimmed = year.trim();
  return trimmed.length === 4 ? trimmed : undefined;
};

/**
 * Helper function to prefetch movie posters
 */
const prefetchPosters = (movies: MovieSummary[]): void => {
  const posters = movies
    .map(m => m.poster)
    .filter(Boolean)
    .slice(0, 20) // Limit prefetch to avoid overwhelming
    .map(uri => ({ uri }));
  
  if (posters.length > 0) {
    FastImage.preload(posters);
  }
};

export function useMovieSearch({
  debouncedQuery,
  type,
  year,
  onError = DEFAULT_ON_ERROR,
}: UseMovieSearchOptions) {
  const [searchResults, setSearchResults] = useState<MovieSummary[]>([]);
  const [searchPage, setSearchPage] = useState<number>(APP_CONSTANTS.PAGINATION.INITIAL_PAGE);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSearchQueryRef = useRef('');
  const loadMoreLockRef = useRef(false);
  const onErrorRef = useRef(onError);

  // Keep onError ref up to date without causing re-renders
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    if (trimmed.length < APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH) {
      setSearchResults([]);
      setSearchPage(APP_CONSTANTS.PAGINATION.INITIAL_PAGE);
      setTotalPages(0);
      lastSearchQueryRef.current = '';
      setIsLoadingSearch(false);
      return;
    }

    const normalizedYear = normalizeYear(year);
    const searchKey = `${trimmed}|${type || ''}|${normalizedYear || ''}`;

    if (lastSearchQueryRef.current === searchKey) {
      return;
    }

    lastSearchQueryRef.current = searchKey;

    const controller = new AbortController();

    (async () => {
      setIsLoadingSearch(true);
      setError(null);
      loadMoreLockRef.current = false;
      try {
        const result = await searchMovies(
          {
            query: trimmed,
            page: APP_CONSTANTS.PAGINATION.INITIAL_PAGE,
            type,
            year: normalizedYear,
          },
          { signal: controller.signal },
        );
        if (result.error) {
          const errorMsg = result.error;
          setError(errorMsg);
          onErrorRef.current?.(errorMsg);
          setSearchResults([]);
          setTotalPages(0);
        } else {
          setSearchResults(result.items);
          setSearchPage(APP_CONSTANTS.PAGINATION.INITIAL_PAGE);
          setTotalPages(result.totalPages);
          
          // Prefetch posters for initial results
          if (result.items.length > 0) {
            prefetchPosters(result.items);
          }
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return;
        }
        const errorMsg = ERROR_MESSAGES.FAILED_TO_SEARCH;
        setError(errorMsg);
        onErrorRef.current?.(errorMsg);
        setSearchResults([]);
        setTotalPages(0);
      } finally {
        setIsLoadingSearch(false);
      }
    })();

    return () => controller.abort();
  }, [debouncedQuery, type, year]);

  const loadMore = useCallback(async () => {
    const trimmed = debouncedQuery.trim();
    if (
      trimmed.length < APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH ||
      isLoadingSearch ||
      loadMoreLockRef.current ||
      isFetchingMore ||
      searchPage >= totalPages
    ) {
      return;
    }

    loadMoreLockRef.current = true;
    setIsFetchingMore(true);

    try {
      const normalizedYear = normalizeYear(year);
      const nextPage = searchPage + 1;
      const result = await searchMovies({
        query: trimmed,
        page: nextPage,
        type,
        year: normalizedYear,
      });

      if (!result.error && result.items.length > 0) {
        setSearchResults(prev => {
          const existingIds = new Set(prev.map(item => item.imdbID));
          const newItems = result.items.filter(item => !existingIds.has(item.imdbID));
          
          // Prefetch posters for new items (non-blocking)
          if (newItems.length > 0) {
            prefetchPosters(newItems);
          }
          
          return [...prev, ...newItems];
        });
        setSearchPage(nextPage);
      }
    } catch (err) {
      // Silently fail for pagination
    } finally {
      setIsFetchingMore(false);
      loadMoreLockRef.current = false;
    }
  }, [debouncedQuery, isLoadingSearch, searchPage, totalPages, type, year, isFetchingMore]);

  return {
    searchResults,
    searchPage,
    totalPages,
    isLoadingSearch,
    isFetchingMore,
    error,
    loadMore,
  };
}


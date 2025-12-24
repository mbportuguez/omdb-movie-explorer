import { useCallback, useState } from 'react';
import { SortBy, LastYearSort, LastTitleSort } from '../types/sort';

export function useSortToggle() {
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [lastYearSort, setLastYearSort] = useState<LastYearSort>('year_desc');
  const [lastTitleSort, setLastTitleSort] = useState<LastTitleSort>('title_asc');

  const handleYearSortToggle = useCallback(() => {
    if (sortBy === 'year_desc' || sortBy === 'year_asc') {
      const next = sortBy === 'year_desc' ? 'year_asc' : 'year_desc';
      setSortBy(next);
      setLastYearSort(next);
    } else {
      setSortBy(lastYearSort);
    }
  }, [sortBy, lastYearSort]);

  const handleTitleSortToggle = useCallback(() => {
    if (sortBy === 'title_asc' || sortBy === 'title_desc') {
      const next = sortBy === 'title_asc' ? 'title_desc' : 'title_asc';
      setSortBy(next);
      setLastTitleSort(next);
    } else {
      setSortBy(lastTitleSort);
    }
  }, [sortBy, lastTitleSort]);

  return {
    sortBy,
    setSortBy,
    lastYearSort,
    lastTitleSort,
    handleYearSortToggle,
    handleTitleSortToggle,
  };
}



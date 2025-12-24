import { MovieSummary } from '../api/omdb';
import { SortBy } from '../types/sort';

export function sortMovies(movies: MovieSummary[], sortBy: SortBy): MovieSummary[] {
  if (sortBy === 'relevance') {
    return movies;
  }

  const cloned = [...movies];

  if (sortBy === 'year_desc' || sortBy === 'year_asc') {
    cloned.sort((a, b) => {
      const ay = parseInt(a.year, 10);
      const by = parseInt(b.year, 10);
      if (Number.isNaN(ay) || Number.isNaN(by)) {
        return 0;
      }
      return sortBy === 'year_desc' ? by - ay : ay - by;
    });
  } else if (sortBy === 'title_asc' || sortBy === 'title_desc') {
    cloned.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortBy === 'title_asc' ? comparison : -comparison;
    });
  }

  return cloned;
}



import { sortMovies } from '../../src/utils/sortMovies';
import { MovieSummary } from '../../src/api/omdb';

const mockMovies: MovieSummary[] = [
  {
    imdbID: '1',
    title: 'Zebra Movie',
    year: '2020',
    type: 'movie',
    poster: 'poster1.jpg',
  },
  {
    imdbID: '2',
    title: 'Alpha Movie',
    year: '2018',
    type: 'movie',
    poster: 'poster2.jpg',
  },
  {
    imdbID: '3',
    title: 'Beta Movie',
    year: '2022',
    type: 'movie',
    poster: 'poster3.jpg',
  },
];

describe('sortMovies', () => {
  it('should return movies unchanged for relevance sort', () => {
    const result = sortMovies(mockMovies, 'relevance');
    expect(result).toEqual(mockMovies);
  });

  it('should sort by year descending', () => {
    const result = sortMovies(mockMovies, 'year_desc');
    expect(result[0].year).toBe('2022');
    expect(result[1].year).toBe('2020');
    expect(result[2].year).toBe('2018');
  });

  it('should sort by year ascending', () => {
    const result = sortMovies(mockMovies, 'year_asc');
    expect(result[0].year).toBe('2018');
    expect(result[1].year).toBe('2020');
    expect(result[2].year).toBe('2022');
  });

  it('should sort by title ascending (A-Z)', () => {
    const result = sortMovies(mockMovies, 'title_asc');
    expect(result[0].title).toBe('Alpha Movie');
    expect(result[1].title).toBe('Beta Movie');
    expect(result[2].title).toBe('Zebra Movie');
  });

  it('should sort by title descending (Z-A)', () => {
    const result = sortMovies(mockMovies, 'title_desc');
    expect(result[0].title).toBe('Zebra Movie');
    expect(result[1].title).toBe('Beta Movie');
    expect(result[2].title).toBe('Alpha Movie');
  });

  it('should not mutate original array', () => {
    const original = [...mockMovies];
    sortMovies(mockMovies, 'year_desc');
    expect(mockMovies).toEqual(original);
  });

  it('should handle invalid year values', () => {
    const moviesWithInvalidYear: MovieSummary[] = [
      { ...mockMovies[0], year: 'invalid' },
      { ...mockMovies[1], year: '2018' },
    ];
    const result = sortMovies(moviesWithInvalidYear, 'year_desc');
    expect(result.length).toBe(2);
  });
});



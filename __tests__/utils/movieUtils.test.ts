import {
  extractImdbRating,
  parseCommaSeparated,
  parseActors,
  formatRatingWithReviews,
  formatReviewCount,
} from '../../src/utils/movieUtils';

describe('extractImdbRating', () => {
  it('should extract IMDB rating from ratings array', () => {
    const ratings = [
      { Source: 'Internet Movie Database', Value: '8.5/10' },
      { Source: 'Rotten Tomatoes', Value: '90%' },
    ];
    expect(extractImdbRating(ratings)).toBe(8.5);
  });

  it('should handle rating without decimal', () => {
    const ratings = [{ Source: 'Internet Movie Database', Value: '9/10' }];
    expect(extractImdbRating(ratings)).toBe(9);
  });

  it('should return null if no IMDB rating found', () => {
    const ratings = [{ Source: 'Rotten Tomatoes', Value: '90%' }];
    expect(extractImdbRating(ratings)).toBeNull();
  });

  it('should return null if ratings is undefined', () => {
    expect(extractImdbRating(undefined)).toBeNull();
  });

  it('should return null if ratings is empty', () => {
    expect(extractImdbRating([])).toBeNull();
  });
});

describe('parseCommaSeparated', () => {
  it('should parse comma-separated string into array', () => {
    expect(parseCommaSeparated('Action, Drama, Thriller')).toEqual([
      'Action',
      'Drama',
      'Thriller',
    ]);
  });

  it('should trim whitespace from values', () => {
    expect(parseCommaSeparated('Action , Drama , Thriller')).toEqual([
      'Action',
      'Drama',
      'Thriller',
    ]);
  });

  it('should filter out empty values', () => {
    expect(parseCommaSeparated('Action,, Drama')).toEqual(['Action', 'Drama']);
  });

  it('should return empty array for undefined', () => {
    expect(parseCommaSeparated(undefined)).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(parseCommaSeparated('')).toEqual([]);
  });
});

describe('parseActors', () => {
  it('should parse actors and limit to specified count', () => {
    const actors = 'John Doe, Jane Smith, Bob Johnson, Alice Brown';
    expect(parseActors(actors, 2)).toEqual(['John Doe', 'Jane Smith']);
  });

  it('should use default limit of 6', () => {
    const actors = 'Actor1, Actor2, Actor3, Actor4, Actor5, Actor6, Actor7';
    const result = parseActors(actors);
    expect(result.length).toBe(6);
  });

  it('should handle undefined actors', () => {
    expect(parseActors(undefined)).toEqual([]);
  });
});

describe('formatReviewCount', () => {
  it('should format millions correctly', () => {
    expect(formatReviewCount(1000000)).toBe('1M');
    expect(formatReviewCount(1500000)).toBe('1.5M');
    expect(formatReviewCount(2500000)).toBe('2.5M');
  });

  it('should format thousands correctly', () => {
    expect(formatReviewCount(1000)).toBe('1K');
    expect(formatReviewCount(1500)).toBe('1.5K');
    expect(formatReviewCount(25000)).toBe('25K');
  });

  it('should return number as string for values less than 1000', () => {
    expect(formatReviewCount(500)).toBe('500');
    expect(formatReviewCount(99)).toBe('99');
  });
});

describe('formatRatingWithReviews', () => {
  it('should format rating with review count', () => {
    const result = formatRatingWithReviews(8.5);
    expect(result).toContain('8.5');
    expect(result).toContain('reviews');
  });

  it('should calculate review count from rating', () => {
    const result = formatRatingWithReviews(8.5);
    const reviewCount = Math.floor(8.5 * 10000);
    const formattedCount = formatReviewCount(reviewCount);
    expect(result).toContain(formattedCount);
  });
});


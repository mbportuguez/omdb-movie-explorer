import { MovieDetails } from '../api/omdb';

/**
 * Extracts IMDB rating from movie ratings array
 */
export function extractImdbRating(ratings?: MovieDetails['ratings']): number | null {
  if (!ratings) return null;
  const imdb = ratings.find(r => r.Source === 'Internet Movie Database');
  if (!imdb) return null;
  // Parse "8.5/10" format
  const match = imdb.Value.match(/(\d+\.?\d*)/);
  return match ? parseFloat(match[1]) : null;
}

/**
 * Parses comma-separated string into array of trimmed values
 */
export function parseCommaSeparated(value?: string): string[] {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Parses actors string and limits to specified count
 */
export function parseActors(actors?: string, limit: number = 6): string[] {
  return parseCommaSeparated(actors).slice(0, limit);
}

/**
 * Formats rating with review count
 */
export function formatRatingWithReviews(rating: number): string {
  const reviewCount = Math.floor(rating * 10000);
  const formattedCount = formatReviewCount(reviewCount);
  return `${rating.toFixed(1)} (${formattedCount} reviews)`;
}

/**
 * Formats review count with K (thousands) and M (millions) notation
 */
export function formatReviewCount(count: number): string {
  if (count >= 1000000) {
    const millions = count / 1000000;
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`;
  }
  if (count >= 1000) {
    const thousands = count / 1000;
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`;
  }
  return count.toString();
}


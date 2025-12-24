export type MovieType = 'movie' | 'series' | 'episode';

export type MovieSummary = {
  imdbID: string;
  title: string;
  year: string;
  type: MovieType;
  poster?: string;
};

export type MovieDetails = MovieSummary & {
  genre?: string;
  plot?: string;
  director?: string;
  actors?: string;
  ratings?: { Source: string; Value: string }[];
  runtime?: string;
  released?: string;
};

import { API_CONFIG } from '../config/api';

const API_KEY = API_CONFIG.API_KEY;
const BASE_URL = API_CONFIG.BASE_URL;

type SearchParams = {
  query: string;
  page?: number;
  year?: string;
  type?: MovieType;
};

type OmdbSearchItem = {
  Title: string;
  Year: string;
  imdbID: string;
  Type: MovieType;
  Poster: string;
};

type OmdbSearchResponse = {
  Search?: OmdbSearchItem[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
};

type OmdbDetailsResponse = OmdbSearchResponse & {
  Title?: string;
  Year?: string;
  imdbID?: string;
  Type?: MovieType;
  Poster?: string;
  Genre?: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Ratings?: { Source: string; Value: string }[];
  Runtime?: string;
  Released?: string;
};

const toMovieSummary = (m: OmdbSearchItem): MovieSummary => ({
  imdbID: m.imdbID,
  title: m.Title,
  year: m.Year,
  type: m.Type,
  poster: m.Poster !== 'N/A' ? m.Poster : undefined,
});

export async function searchMovies(params: SearchParams, options?: { signal?: AbortSignal }) {
  const { query, page = 1, year, type } = params;
  const searchParams = new URLSearchParams();
  searchParams.append('apikey', API_KEY);
  searchParams.append('s', query);
  searchParams.append('page', String(page));
  if (type) searchParams.append('type', type);
  if (year) searchParams.append('y', year);

  const res = await fetch(`${BASE_URL}?${searchParams.toString()}`, {
    signal: options?.signal,
  });
  
  // Check for rate limit or authentication errors
  if (res.status === 401 || res.status === 403) {
    return {
      items: [] as MovieSummary[],
      totalResults: 0,
      totalPages: 0,
      error: 'API request limit reached. Please try again later or use a different API key.',
    };
  }

  const json: OmdbSearchResponse = await res.json();

  if (json.Response === 'False') {
    // Check for rate limit in error message
    const errorMsg = json.Error || 'No results';
    if (errorMsg.toLowerCase().includes('limit') || errorMsg.toLowerCase().includes('exceeded')) {
      return {
        items: [] as MovieSummary[],
        totalResults: 0,
        totalPages: 0,
        error: 'API request limit reached. Please try again later.',
      };
    }
    
    return {
      items: [] as MovieSummary[],
      totalResults: 0,
      totalPages: 0,
      error: errorMsg,
    };
  }

  const RESULTS_PER_PAGE = 10;
  const totalResults = Number(json.totalResults || 0);
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);

  return {
    items: (json.Search || []).map(toMovieSummary),
    totalResults,
    totalPages,
    error: undefined,
  };
}

export async function fetchMovieDetails(imdbID: string): Promise<MovieDetails | null> {
  const searchParams = new URLSearchParams();
  searchParams.append('apikey', API_KEY);
  searchParams.append('i', imdbID);
  searchParams.append('plot', 'full');

  const res = await fetch(`${BASE_URL}?${searchParams.toString()}`);
  
  // Check for rate limit or authentication errors
  if (res.status === 401 || res.status === 403) {
    throw new Error('API request limit reached. Please try again later.');
  }

  const json: OmdbDetailsResponse = await res.json();
  if (json.Response === 'False' || !json.imdbID || !json.Title || !json.Year || !json.Type) {
    // Check for rate limit in error message
    if (json.Error && (json.Error.toLowerCase().includes('limit') || json.Error.toLowerCase().includes('exceeded'))) {
      throw new Error('API request limit reached. Please try again later.');
    }
    return null;
  }

  return {
    imdbID: json.imdbID,
    title: json.Title,
    year: json.Year,
    type: json.Type,
    poster: json.Poster !== 'N/A' ? json.Poster : undefined,
    genre: json.Genre,
    plot: json.Plot,
    director: json.Director,
    actors: json.Actors,
    ratings: json.Ratings,
    runtime: json.Runtime,
    released: json.Released,
  };
}



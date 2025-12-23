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

const API_KEY = 'b9bd48a6';
const BASE_URL = 'https://www.omdbapi.com/';

type SearchParams = {
  query: string;
  page?: number;
  year?: string;
  type?: MovieType;
};

type OmdbSearchResponse = {
  Search?: { Title: string; Year: string; imdbID: string; Type: MovieType; Poster: string }[];
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

const toMovieSummary = (m: OmdbSearchResponse['Search'][number]): MovieSummary => ({
  imdbID: m.imdbID,
  title: m.Title,
  year: m.Year,
  type: m.Type,
  poster: m.Poster !== 'N/A' ? m.Poster : undefined,
});

export async function searchMovies(params: SearchParams) {
  const { query, page = 1, year, type } = params;
  const searchParams = new URLSearchParams();
  searchParams.append('apikey', API_KEY);
  searchParams.append('s', query);
  searchParams.append('page', String(page));
  if (type) searchParams.append('type', type);
  if (year) searchParams.append('y', year);

  const res = await fetch(`${BASE_URL}?${searchParams.toString()}`);
  const json: OmdbSearchResponse = await res.json();

  if (json.Response === 'False') {
    return {
      items: [] as MovieSummary[],
      totalResults: 0,
      totalPages: 0,
      error: json.Error || 'No results',
    };
  }

  const totalResults = Number(json.totalResults || 0);
  const totalPages = Math.ceil(totalResults / 10);

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
  const json: OmdbDetailsResponse = await res.json();
  if (json.Response === 'False' || !json.imdbID || !json.Title || !json.Year || !json.Type) {
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



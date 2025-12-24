const LIGHT_COLORS = {
  BACKGROUND: {
    PRIMARY: '#ffffff',
    SECONDARY: '#f5f5f5',
    TERTIARY: '#e0e0e0',
  },
  GRADIENT: {
    POSTER_START: 'rgba(255,255,255,0)',
    POSTER_END: 'rgba(245,245,245,1)',
    DETAILS_START: 'rgba(245,245,245,0)',
    DETAILS_END: 'rgba(245,245,245,1)',
  },
  TEXT: {
    PRIMARY: '#000000',
    SECONDARY: '#333333',
    TERTIARY: '#666666',
  },
} as const;

const DARK_COLORS = {
  BACKGROUND: {
    PRIMARY: '#1a1a1a',
    SECONDARY: '#2a2a2a',
    TERTIARY: '#3a3a3a',
  },
  GRADIENT: {
    POSTER_START: 'rgba(0,0,0,0)',
    POSTER_END: 'rgba(42,42,42,1)',
    DETAILS_START: 'rgba(42,42,42,0)',
    DETAILS_END: 'rgba(42,42,42,1)',
  },
  TEXT: {
    PRIMARY: '#ffffff',
    SECONDARY: '#cccccc',
    TERTIARY: '#888888',
  },
} as const;

export const getAppColors = (isDark: boolean) => ({
  BACKGROUND: isDark ? DARK_COLORS.BACKGROUND : LIGHT_COLORS.BACKGROUND,
  GRADIENT: isDark ? DARK_COLORS.GRADIENT : LIGHT_COLORS.GRADIENT,
  TEXT: isDark ? DARK_COLORS.TEXT : LIGHT_COLORS.TEXT,
  ACCENT: '#ff6b35',
  IMDB: '#FFD700',
});

export const APP_CONSTANTS = {
  SEARCH: {
    MIN_QUERY_LENGTH: 3,
    DEBOUNCE_DELAY_MS: 500,
    TYPING_INDICATOR_DELAY_MS: 500,
  },
  PAGINATION: {
    RESULTS_PER_PAGE: 10,
    INITIAL_PAGE: 1,
  },
  MOVIES: {
    LATEST_COUNT: 10,
    DEFAULT_QUERY: 'movie',
  },
  YEAR: {
    START_YEAR: 1900,
  },
  DETAILS: {
    POSTER_HEIGHT: 500,
    MAX_ACTORS_DISPLAY: 6,
    GRADIENT_HEIGHT: {
      POSTER: 80,
      DETAILS: 50,
    },
  },
  COLORS: DARK_COLORS,
} as const;

export const ERROR_MESSAGES = {
  API_LIMIT_REACHED: 'API request limit reached. Please try again later.',
  API_LIMIT_REACHED_WITH_KEY: 'API request limit reached. Please try again later or use a different API key.',
  FAILED_TO_LOAD: 'Failed to load movies',
  FAILED_TO_SEARCH: 'Failed to search',
  NO_RESULTS: 'No results found',
  NO_FAVORITES: 'No favorite movies yet',
  OFFLINE_MODE: 'You are offline. Showing cached data.',
} as const;


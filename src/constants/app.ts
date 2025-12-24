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
} as const;

export const ERROR_MESSAGES = {
  API_LIMIT_REACHED: 'API request limit reached. Please try again later.',
  API_LIMIT_REACHED_WITH_KEY: 'API request limit reached. Please try again later or use a different API key.',
  FAILED_TO_LOAD: 'Failed to load movies',
  FAILED_TO_SEARCH: 'Failed to search',
  NO_RESULTS: 'No results found',
  NO_FAVORITES: 'No favorite movies yet',
} as const;


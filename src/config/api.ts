/**
 * API Configuration
 * 
 * For production, set the API key via environment variables.
 * Create a .env file in the root directory with:
 * OMDB_API_KEY=your_api_key_here
 * 
 * The .env file should be added to .gitignore and never committed.
 */

import Config from 'react-native-config';

let cachedApiKey: string | null = null;

const getApiKey = (): string => {
  if (cachedApiKey !== null) {
    return cachedApiKey;
  }

  let envKey: string | undefined;
  try {
    envKey = Config.OMDB_API_KEY;
  } catch (error) {
    console.warn('Failed to read OMDB_API_KEY from react-native-config:', error);
  }
  
  // Debug logging in development
  if (__DEV__) {
    console.log('🔑 API Key loaded:', envKey ? `${envKey.substring(0, 4)}...` : 'NOT FOUND');
  }
  
  if (!envKey) {
    const errorMsg = 'OMDB_API_KEY environment variable is not set. ' +
      'Please create a .env file in the root directory with: OMDB_API_KEY=your_api_key_here';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  cachedApiKey = envKey;
  return envKey;
};

export const API_CONFIG = {
  get API_KEY() {
    return getApiKey();
  },
  BASE_URL: 'https://www.omdbapi.com/',
} as const;


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

const getApiKey = (): string => {
  const envKey = Config.OMDB_API_KEY;
  
  // Debug logging in development
  if (__DEV__) {
    console.log('🔑 API Key loaded:', envKey ? `${envKey.substring(0, 4)}...` : 'NOT FOUND');
  }
  
  if (!envKey) {
    throw new Error(
      'OMDB_API_KEY environment variable is not set. ' +
      'Please create a .env file in the root directory with: OMDB_API_KEY=your_api_key_here'
    );
  }
  
  return envKey;
};

export const API_CONFIG = {
  API_KEY: getApiKey(),
  BASE_URL: 'https://www.omdbapi.com/',
} as const;


# OMDB Movie Explorer

A React Native mobile application for exploring movies using the [OMDb API](http://www.omdbapi.com/). Search, browse, and save your favorite movies with a beautiful, modern UI featuring dark mode support.

## Features

### Core Functionality
- 🔍 **Movie Search**: Search movies by title with real-time results
- 📱 **Movie Details**: View comprehensive movie information including plot, ratings, cast, and more
- ⭐ **Favorites**: Save and manage your favorite movies with persistent storage
- 🎬 **Latest Movies**: Browse recently released movies
- 🔄 **Infinite Scroll**: Load more results as you scroll
- 🎨 **Dark Mode**: Toggle between light and dark themes with system preference support

### Advanced Features
- ⏱️ **Debounced Search**: Optimized search with 500ms debounce delay
- 🔖 **Recent Searches**: Quick access to your recent search queries
- 📥 **Offline Support**: View cached movie details and favorites offline
- 🎯 **Filters & Sorting**: Filter by type (Movie/Series/Episode) and year, sort by year or title
- 🖼️ **Image Caching**: Efficient image loading with disk caching
- ⚡ **Performance Optimized**: Lazy loading, memoization, and efficient list rendering

## 📱 Download APK

[➡️ Latest Release APK](https://github.com/mbportuguez/omdb-movie-explorer/releases/tag/v1.0.0)

## Prerequisites

- **Node.js** >= 20
- **React Native** development environment set up
  - Follow the [React Native Environment Setup Guide](https://reactnative.dev/docs/set-up-your-environment)
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **OMDb API Key** - Get a free API key from [OMDb API](http://www.omdbapi.com/apikey.aspx)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OmdbMovieExplorer
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   
   > **Note**: Using `--legacy-peer-deps` is required due to React 19 compatibility with some dependencies.

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

## API Key Configuration

The app requires an OMDb API key to function. Follow these steps:

1. **Get your API key**
   - Visit [OMDb API](http://www.omdbapi.com/apikey.aspx)
   - Sign up for a free API key

2. **Create `.env` file**
   - In the project root, create a `.env` file:
     ```bash
     touch .env
     ```

3. **Add your API key**
   - Open `.env` and add:
     ```
     OMDB_API_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key

4. **Verify `.env` is gitignored**
   - The `.env` file should already be in `.gitignore`
   - Never commit your API key to version control

> **Important**: The app will throw an error if the API key is not configured. Make sure your `.env` file is in the project root.

## Running the App

### Start Metro Bundler

In the project root, start the Metro bundler:

```bash
npm start
```

Keep this terminal running while developing.

### Run on Android

In a new terminal:

```bash
npm run android
```

### Run on iOS (macOS only)

```bash
npm run ios
```

## Project Structure

```
src/
├── api/              # API functions (OMDb integration)
├── components/       # Reusable UI components
├── config/           # Configuration files
├── constants/        # App-wide constants
├── context/          # React Context providers (Theme, Favorites)
├── hooks/            # Custom React hooks
├── navigation/       # Navigation setup
├── screens/          # Screen components
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

### Key Files

- **`src/api/omdb.ts`**: OMDb API integration
- **`src/config/api.ts`**: API configuration and key management
- **`src/constants/app.ts`**: App constants (delays, limits, error messages)
- **`src/context/ThemeContext.tsx`**: Theme management (light/dark mode)
- **`src/context/FavoritesContext.tsx`**: Favorites state management
- **`src/navigation/RootNavigator.tsx`**: Navigation setup

## Testing

The project includes comprehensive unit tests for utilities and hooks.

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suites
npm test -- utils      # Utility function tests
npm test -- hooks      # Hook tests
npm test -- components # Component tests
```

### Test Coverage

- ✅ **Utility Functions**: 100% coverage (`sortMovies`, `movieUtils`)
- ✅ **Custom Hooks**: Comprehensive tests (`useDebouncedValue`, `useSortToggle`, `useTypingIndicator`)
- ✅ **Component Tests**: Basic component validation tests

## Development Notes

### State Management
- Uses React Hooks and Context API (no Redux/MobX)
- Custom hooks for reusable logic
- Context providers for global state (Theme, Favorites)

### Performance Optimizations
- `React.memo` for component memoization
- `useCallback` for function memoization
- `FlatList` with optimized props for efficient rendering
- Image prefetching and disk caching
- Debounced API calls to reduce network requests

### API Key Security
- API key loaded from environment variables (`.env` file)
- No hardcoded keys in source code
- Error thrown if API key is missing (no fallback/default)
- `.env` file is gitignored

### Offline Support
- Favorites persist using `AsyncStorage`
- Movie details cached for 7 days
- Offline indicator shown when using cached data

## Assumptions Made

1. **API Key**: Users have access to an OMDb API key (free tier available)
2. **Network**: App requires internet connection for search and fetching movie details
3. **Platform**: Optimized for both Android and iOS
4. **React Native Version**: Built with React Native 0.83.1 and React 19.2.0
5. **Storage**: Uses `AsyncStorage` for local persistence (favorites, theme, cache)

## Troubleshooting

### API Key Issues
- **Error**: "OMDB_API_KEY environment variable is not set"
  - **Solution**: Create `.env` file in project root with `OMDB_API_KEY=your_key`

### Metro Bundler Issues
- **Error**: Port 8081 already in use
  - **Solution**: Kill the process using port 8081 or use a different port:
    ```bash
    npm start -- --port=8088
    ```

### Android Build Issues
- **Error**: Build fails
  - **Solution**: Clean and rebuild:
    ```bash
    cd android
    ./gradlew clean
    cd ..
    npm run android
    ```

### iOS Build Issues
- **Error**: Pod installation fails
  - **Solution**: Update CocoaPods and reinstall:
    ```bash
    cd ios
    pod deintegrate
    pod install
    cd ..
    ```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## Technologies Used

- **React Native** 0.83.1
- **React** 19.2.0
- **TypeScript**
- **React Navigation** 7.0
- **React Native Fast Image** - Image caching
- **React Native Linear Gradient** - Gradient effects
- **AsyncStorage** - Local persistence
- **Jest** - Testing framework
- **React Native Testing Library** - Component testing

## License

This project is private and proprietary.

## Contributing

This is a private project. For questions or issues, please contact the repository maintainer.

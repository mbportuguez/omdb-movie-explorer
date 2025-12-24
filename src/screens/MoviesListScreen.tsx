import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MovieType } from '../api/omdb';
import { useFavorites } from '../context/FavoritesContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useLatestMovies } from '../hooks/useLatestMovies';
import { useSortToggle } from '../hooks/useSortToggle';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { useRecentSearches } from '../hooks/useRecentSearches';
import { useAppColors } from '../hooks/useAppColors';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_CONSTANTS } from '../constants/app';
import { sortMovies } from '../utils/sortMovies';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import HomeContent from '../components/HomeContent';
import SearchResults from '../components/SearchResults';
import RecentSearches from '../components/RecentSearches';
import YearPickerModal from '../components/YearPickerModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MoviesList'>;

function MoviesListScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const colors = useAppColors();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [queryInput, setQueryInput] = useState('');
  const debouncedQuery = useDebouncedValue(queryInput, APP_CONSTANTS.SEARCH.DEBOUNCE_DELAY_MS);
  const [type, setType] = useState<MovieType | undefined>(undefined);
  const [year, setYear] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchBarLayout, setSearchBarLayout] = useState({ y: 0, height: 0 });
  const searchInputRef = useRef<TextInput>(null);

  const { isUserTyping, handleTyping } = useTypingIndicator();
  const { movies: latestMovies, loading: isLoadingLatest, error: latestError } = useLatestMovies();
  const {
    sortBy,
    setSortBy,
    lastYearSort,
    lastTitleSort,
    handleYearSortToggle,
    handleTitleSortToggle,
  } = useSortToggle();
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();

  const {
    searchResults,
    isLoadingSearch,
    isFetchingMore,
    error: searchError,
    loadMore: loadMoreSearchResults,
  } = useMovieSearch({
    debouncedQuery,
    type,
    year,
    onError: () => {},
  });

  const handleChangeQuery = useCallback(
    (text: string) => {
      setQueryInput(text);
      handleTyping();
    },
    [handleTyping],
  );

  const favoritesList = useMemo(() => Object.values(favorites), [favorites]);

  const sortedSearchResults = useMemo(
    () => sortMovies(searchResults, sortBy),
    [searchResults, sortBy],
  );

  const showSearchResults = useMemo(
    () => debouncedQuery.trim().length >= APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH,
    [debouncedQuery],
  );

  // Save search when results are successfully loaded
  const lastSavedQueryRef = useRef<string>('');
  useEffect(() => {
    if (
      showSearchResults &&
      searchResults.length > 0 &&
      !isLoadingSearch &&
      debouncedQuery.trim() !== lastSavedQueryRef.current
    ) {
      lastSavedQueryRef.current = debouncedQuery.trim();
      addSearch(debouncedQuery);
    }
  }, [showSearchResults, searchResults.length, isLoadingSearch, debouncedQuery, addSearch]);

  const handleMoviePress = useCallback(
    (imdbID: string) => {
      navigation.navigate('MovieDetails', { imdbID });
    },
    [navigation],
  );

  const handleViewAllLatest = useCallback(() => {
    navigation.navigate('LatestMovies');
  }, [navigation]);

  const handleViewAllFavorites = useCallback(() => {
    navigation.navigate('Favorites');
  }, [navigation]);

  const handleFavoritesPress = useCallback(() => {
    navigation.navigate('Profile');
  }, [navigation]);

  const handleSelectRecentSearch = useCallback(
    (query: string) => {
      setQueryInput(query);
      setIsSearchFocused(false);
    },
    [],
  );

  const filteredRecentSearches = useMemo(() => {
    if (!queryInput.trim()) {
      return recentSearches;
    }
    const query = queryInput.trim().toLowerCase();
    return recentSearches.filter(search => 
      search.toLowerCase().includes(query)
    );
  }, [recentSearches, queryInput]);

  const showRecentSearches = useMemo(
    () =>
      isSearchFocused &&
      !showSearchResults &&
      queryInput.trim().length < APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH &&
      filteredRecentSearches.length > 0,
    [isSearchFocused, showSearchResults, queryInput, filteredRecentSearches.length],
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.BACKGROUND.PRIMARY }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader onFavoritesPress={handleFavoritesPress} />

      <SearchBar
        queryInput={queryInput}
        onChangeQuery={handleChangeQuery}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(prev => !prev)}
        year={year}
        onYearPress={() => setShowYearPicker(true)}
        sortBy={sortBy}
        onSortChange={setSortBy}
        lastYearSort={lastYearSort}
        lastTitleSort={lastTitleSort}
        onYearSortToggle={handleYearSortToggle}
        onTitleSortToggle={handleTitleSortToggle}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        onLayout={(event) => {
          const { y, height } = event.nativeEvent.layout;
          setSearchBarLayout({ y, height });
        }}
        inputRef={searchInputRef}
      />

      {showRecentSearches && (
        <>
          <TouchableWithoutFeedback
            onPress={() => {
              searchInputRef.current?.blur();
              setIsSearchFocused(false);
            }}
          >
            <View style={[StyleSheet.absoluteFill, { zIndex: 1000 }]} />
          </TouchableWithoutFeedback>
          <RecentSearches
            searches={filteredRecentSearches}
            onSelectSearch={handleSelectRecentSearch}
            onRemoveSearch={removeSearch}
            onClearAll={clearAll}
            top={searchBarLayout.y + searchBarLayout.height + 140}
          />
        </>
      )}

      {showSearchResults && <CategoryChips type={type} onTypeChange={setType} />}

      {!showSearchResults ? (
        <HomeContent
          isLoadingLatest={isLoadingLatest}
          latestMovies={latestMovies}
          favoritesList={favoritesList}
          onMoviePress={handleMoviePress}
          onViewAllLatest={handleViewAllLatest}
          onViewAllFavorites={handleViewAllFavorites}
        />
      ) : (
        <SearchResults
          results={sortedSearchResults}
          isLoading={isLoadingSearch}
          isUserTyping={isUserTyping}
          error={searchError || latestError}
          isFetchingMore={isFetchingMore}
          onMoviePress={handleMoviePress}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          onEndReached={loadMoreSearchResults}
        />
      )}

      <YearPickerModal
        visible={showYearPicker}
        selectedYear={year}
        onClose={() => setShowYearPicker(false)}
        onSelectYear={(selectedYear) => {
          setYear(selectedYear);
          setShowYearPicker(false);
        }}
        onClearYear={() => {
          setYear('');
          setShowYearPicker(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MoviesListScreen;

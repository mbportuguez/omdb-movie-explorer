import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchMovies, MovieSummary, MovieType } from '../api/omdb';
import { useFavorites } from '../context/FavoritesContext';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useMovieSearch } from '../hooks/useMovieSearch';
import { useTypingIndicator } from '../hooks/useTypingIndicator';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import { SortBy, LastYearSort, LastTitleSort } from '../types/sort';
import { sortMovies } from '../utils/sortMovies';
import AppHeader from '../components/AppHeader';
import SearchBar from '../components/SearchBar';
import CategoryChips from '../components/CategoryChips';
import HomeContent from '../components/HomeContent';
import SearchResults from '../components/SearchResults';
import YearPickerModal from '../components/YearPickerModal';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MoviesList'>;

function MoviesListScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [queryInput, setQueryInput] = useState('');
  const debouncedQuery = useDebouncedValue(queryInput, APP_CONSTANTS.SEARCH.DEBOUNCE_DELAY_MS);
  const [type, setType] = useState<MovieType | undefined>(undefined);
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [lastYearSort, setLastYearSort] = useState<LastYearSort>('year_desc');
  const [lastTitleSort, setLastTitleSort] = useState<LastTitleSort>('title_asc');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { isUserTyping, handleTyping } = useTypingIndicator();

  const [latestMovies, setLatestMovies] = useState<MovieSummary[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    onError: setError,
  });

  const handleChangeQuery = useCallback(
    (text: string) => {
      setQueryInput(text);
      handleTyping();
    },
    [handleTyping],
  );

  const favoritesList = useMemo(() => Object.values(favorites), [favorites]);

  useEffect(() => {
    const loadLatest = async () => {
      setIsLoadingLatest(true);
      setError(null);
      try {
        const result = await searchMovies({
          query: APP_CONSTANTS.MOVIES.DEFAULT_QUERY,
          page: APP_CONSTANTS.PAGINATION.INITIAL_PAGE,
          type: 'movie',
        });
        if (result.error) {
          setError(result.error);
        } else {
          setLatestMovies(result.items.slice(0, APP_CONSTANTS.MOVIES.LATEST_COUNT));
        }
      } catch (err) {
        setError(ERROR_MESSAGES.FAILED_TO_LOAD);
      } finally {
        setIsLoadingLatest(false);
      }
    };
    loadLatest();
  }, []);

  const sortedSearchResults = useMemo(
    () => sortMovies(searchResults, sortBy),
    [searchResults, sortBy],
  );

  const handleYearSortToggle = useCallback(() => {
    if (sortBy === 'year_desc' || sortBy === 'year_asc') {
      const next = sortBy === 'year_desc' ? 'year_asc' : 'year_desc';
      setSortBy(next);
      setLastYearSort(next);
    } else {
      setSortBy(lastYearSort);
    }
  }, [sortBy, lastYearSort]);

  const handleTitleSortToggle = useCallback(() => {
    if (sortBy === 'title_asc' || sortBy === 'title_desc') {
      const next = sortBy === 'title_asc' ? 'title_desc' : 'title_asc';
      setSortBy(next);
      setLastTitleSort(next);
    } else {
      setSortBy(lastTitleSort);
    }
  }, [sortBy, lastTitleSort]);

  const showSearchResults =
    debouncedQuery.trim().length >= APP_CONSTANTS.SEARCH.MIN_QUERY_LENGTH;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader onFavoritesPress={() => navigation.navigate('Favorites')} />

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
      />

      {showSearchResults && <CategoryChips type={type} onTypeChange={setType} />}

      {!showSearchResults ? (
        <HomeContent
          isLoadingLatest={isLoadingLatest}
          latestMovies={latestMovies}
          favoritesList={favoritesList}
          onMoviePress={(imdbID) => navigation.navigate('MovieDetails', { imdbID })}
        />
      ) : (
        <SearchResults
          results={sortedSearchResults}
          isLoading={isLoadingSearch}
          isUserTyping={isUserTyping}
          error={searchError || error}
          isFetchingMore={isFetchingMore}
          onMoviePress={(imdbID) => navigation.navigate('MovieDetails', { imdbID })}
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

      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, styles.navItemActive]}>
          <View style={styles.navIconContainer}>
            <Icon name="film" size={24} color="#fff" />
          </View>
          <Text style={[styles.navLabel, styles.navLabelActive]}>Movie</Text>
        </Pressable>
        <Pressable style={styles.navItem}>
          <Icon name="pricetag" size={24} color="#888" />
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => navigation.navigate('Favorites')}
        >
          <Icon name="bookmark" size={24} color="#888" />
        </Pressable>
        <Pressable style={styles.navItem}>
          <Icon name="person" size={24} color="#888" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItemActive: {
    backgroundColor: '#ff6b35',
    borderRadius: 12,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default MoviesListScreen;

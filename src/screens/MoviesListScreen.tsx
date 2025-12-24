import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchMovies, MovieSummary, MovieType } from '../api/omdb';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import MovieCard from '../components/MovieCard';
import HorizontalMovieCard from '../components/HorizontalMovieCard';
import { useFavorites } from '../context/FavoritesContext';
import { useSearch } from '../context/SearchContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MoviesList'>;

function MoviesListScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { search, setSearch } = useSearch();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const [queryInput, setQueryInput] = useState('');
  const [type, setType] = useState<MovieType | undefined>(undefined);
  const [year, setYear] = useState('');
  const [sortBy, setSortBy] = useState<
    'relevance' | 'year_asc' | 'year_desc' | 'title_asc' | 'title_desc'
  >('relevance');
  const [lastYearSort, setLastYearSort] = useState<'year_asc' | 'year_desc'>('year_desc');
  const [lastTitleSort, setLastTitleSort] = useState<'title_asc' | 'title_desc'>('title_asc');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebouncedValue(queryInput, 600);

  const [latestMovies, setLatestMovies] = useState<MovieSummary[]>([]);
  const [searchResults, setSearchResults] = useState<MovieSummary[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favoritesList = useMemo(() => Object.values(favorites), [favorites]);

  useEffect(() => {
    const loadLatest = async () => {
      setIsLoadingLatest(true);
      setError(null);
      try {
        const result = await searchMovies({ query: 'movie', page: 1, type: 'movie' });
        if (result.error) {
          setError(result.error);
        } else {
          setLatestMovies(result.items.slice(0, 10));
        }
      } catch (err) {
        setError('Failed to load movies');
      } finally {
        setIsLoadingLatest(false);
      }
    };
    loadLatest();
  }, []);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed.length < 3) {
      setSearchResults([]);
      return;
    }

    const search = async () => {
      setIsLoadingSearch(true);
      setError(null);
      try {
        const normalizedYear = year.trim();
        const result = await searchMovies({
          query: trimmed,
          page: 1,
          type,
          year: normalizedYear.length === 4 ? normalizedYear : undefined,
        });
        if (result.error) {
          setError(result.error);
        } else {
          setSearchResults(result.items);
        }
      } catch (err) {
        setError('Failed to search');
      } finally {
        setIsLoadingSearch(false);
      }
    };
    search();
  }, [debouncedQuery, type, year]);

  const categoryChips = useMemo(
    () => [
      { label: 'Action', value: undefined },
      { label: 'Comedy', value: undefined },
      { label: 'Romance', value: undefined },
      { label: 'Drama', value: undefined },
      { label: 'Horror', value: undefined },
      { label: 'Thriller', value: undefined },
    ],
    [],
  );

  const typeChips = useMemo(
    () => [
      { label: 'All', value: undefined },
      { label: 'Movies', value: 'movie' as MovieType },
      { label: 'Series', value: 'series' as MovieType },
      { label: 'Episodes', value: 'episode' as MovieType },
    ],
    [],
  );

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = 1900;
    const yearList: string[] = [];
    for (let y = currentYear; y >= startYear; y--) {
      yearList.push(String(y));
    }
    return yearList;
  }, []);

  const sortedSearchResults = useMemo(() => {
    if (sortBy === 'relevance') {
      return searchResults;
    }
    const cloned = [...searchResults];
    if (sortBy === 'year_desc' || sortBy === 'year_asc') {
      cloned.sort((a, b) => {
        const ay = parseInt(a.year, 10);
        const by = parseInt(b.year, 10);
        if (Number.isNaN(ay) || Number.isNaN(by)) {
          return 0;
        }
        return sortBy === 'year_desc' ? by - ay : ay - by;
      });
    } else if (sortBy === 'title_asc' || sortBy === 'title_desc') {
      cloned.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortBy === 'title_asc' ? comparison : -comparison;
      });
    }
    return cloned;
  }, [searchResults, sortBy]);

  const renderHorizontalMovie = useCallback(
    (movie: MovieSummary) => (
      <HorizontalMovieCard
        movie={movie}
        onPress={() => navigation.navigate('MovieDetails', { imdbID: movie.imdbID })}
      />
    ),
    [navigation],
  );

  const renderSearchResult = useCallback(
    ({ item }: { item: MovieSummary }) => (
      <MovieCard
        movie={item}
        onPress={() => navigation.navigate('MovieDetails', { imdbID: item.imdbID })}
        onToggleFavorite={() => toggleFavorite(item)}
        isFavorite={isFavorite(item.imdbID)}
      />
    ),
    [navigation, isFavorite, toggleFavorite],
  );

  const showSearchResults = queryInput.trim().length >= 3;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeText}>Welcome Joko 👋</Text>
            <Text style={styles.subtitleText}>Let's relax and watch a movie !</Text>
          </View>
          <Pressable
            onPress={() => navigation.navigate('Favorites')}
            style={styles.profileButton}
          >
            <View style={styles.profileIcon}>
              <Icon name="person-circle" size={40} color="#ff6b35" />
            </View>
          </Pressable>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#888" />
            <TextInput
              value={queryInput}
              onChangeText={setQueryInput}
              placeholder="Search movie ...."
              placeholderTextColor="#888"
              style={styles.searchInput}
              returnKeyType="search"
            />
            <Pressable
              onPress={() => setShowFilters(prev => !prev)}
              style={styles.filterIconButton}
            >
              <Icon name="options" size={18} color="#fff" />
            </Pressable>
          </View>
          {showFilters && (
            <View style={styles.filtersRow}>
              <Pressable
                onPress={() => setShowYearPicker(true)}
                style={[styles.filterButton, year && styles.filterButtonActive]}
              >
                <Text style={[styles.filterButtonText, year && styles.filterButtonTextActive]}>
                  {year || 'Year'}
                </Text>
              </Pressable>
              <View style={styles.sortRow}>
                <Pressable
                  onPress={() => setSortBy('relevance')}
                  style={[styles.sortChip, sortBy === 'relevance' && styles.sortChipActive]}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      sortBy === 'relevance' && styles.sortChipTextActive,
                    ]}
                  >
                    Default
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (sortBy === 'year_desc' || sortBy === 'year_asc') {
                      const next = sortBy === 'year_desc' ? 'year_asc' : 'year_desc';
                      setSortBy(next);
                      setLastYearSort(next);
                    } else {
                      setSortBy(lastYearSort);
                    }
                  }}
                  style={[
                    styles.sortChip,
                    (sortBy === 'year_desc' || sortBy === 'year_asc') && styles.sortChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      (sortBy === 'year_desc' || sortBy === 'year_asc') &&
                        styles.sortChipTextActive,
                    ]}
                  >
                    Year {sortBy === 'year_desc' ? '↓' : sortBy === 'year_asc' ? '↑' : lastYearSort === 'year_desc' ? '↓' : '↑'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (sortBy === 'title_asc' || sortBy === 'title_desc') {
                      const next = sortBy === 'title_asc' ? 'title_desc' : 'title_asc';
                      setSortBy(next);
                      setLastTitleSort(next);
                    } else {
                      setSortBy(lastTitleSort);
                    }
                  }}
                  style={[
                    styles.sortChip,
                    (sortBy === 'title_asc' || sortBy === 'title_desc') && styles.sortChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sortChipText,
                      (sortBy === 'title_asc' || sortBy === 'title_desc') &&
                        styles.sortChipTextActive,
                    ]}
                  >
                    {sortBy === 'title_asc'
                      ? 'A–Z'
                      : sortBy === 'title_desc'
                        ? 'Z–A'
                        : lastTitleSort === 'title_asc'
                          ? 'A–Z'
                          : 'Z–A'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {typeChips.map((chip, index) => (
            <Pressable
              key={index}
              onPress={() => setType(chip.value)}
              style={[styles.categoryChip, type === chip.value && styles.categoryChipActive]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  type === chip.value && styles.categoryChipTextActive,
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {!showSearchResults ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Latest Movie</Text>
            </View>
            {isLoadingLatest ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ff6b35" />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moviesContainer}
              >
                {latestMovies.map(movie => (
                  <HorizontalMovieCard
                    key={movie.imdbID}
                    movie={movie}
                    onPress={() => navigation.navigate('MovieDetails', { imdbID: movie.imdbID })}
                  />
                ))}
              </ScrollView>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favorite Movie</Text>
            </View>
            {favoritesList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No favorite movies yet</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.moviesContainer}
              >
                {favoritesList.map(movie => (
                  <HorizontalMovieCard
                    key={movie.imdbID}
                    movie={{
                      imdbID: movie.imdbID,
                      title: movie.title,
                      year: movie.year || '',
                      type: (movie.type as MovieType) || 'movie',
                      poster: movie.poster,
                    }}
                    onPress={() => navigation.navigate('MovieDetails', { imdbID: movie.imdbID })}
                  />
                ))}
              </ScrollView>
            )}
          </>
        ) : (
          <View style={styles.searchResultsContainer}>
            {isLoadingSearch ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#ff6b35" />
              </View>
            ) : error ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{error}</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            ) : (
              <FlatList
                data={sortedSearchResults}
                keyExtractor={item => item.imdbID}
                renderItem={renderSearchResult}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.gridContainer}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showYearPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <Pressable onPress={() => setShowYearPicker(false)}>
                <Icon name="close" size={24} color="#888" />
              </Pressable>
            </View>
            <FlatList
              data={years}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    setYear(item);
                    setShowYearPicker(false);
                  }}
                  style={[styles.yearOption, year === item && styles.yearOptionSelected]}
                >
                  <Text
                    style={[
                      styles.yearOptionText,
                      year === item && styles.yearOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
              initialNumToRender={20}
              maxToRenderPerBatch={20}
            />
            <Pressable
              onPress={() => {
                setYear('');
                setShowYearPicker(false);
              }}
              style={styles.clearYearButton}
            >
              <Text style={styles.clearYearText}>Clear</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#aaa',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  filterIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#3a3a3a',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  viewAllText: {
    fontSize: 14,
    color: '#ff6b35',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  categoryChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  moviesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  searchResultsContainer: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  gridContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  filterButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  sortChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  sortChipText: {
    fontSize: 13,
    color: '#fff',
  },
  sortChipTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#2a2a2a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  yearOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  yearOptionSelected: {
    backgroundColor: '#3a3a3a',
  },
  yearOptionText: {
    fontSize: 16,
    color: '#fff',
  },
  yearOptionTextSelected: {
    fontWeight: '600',
    color: '#ff6b35',
  },
  clearYearButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    alignItems: 'center',
  },
  clearYearText: {
    fontSize: 16,
    color: '#ff6b35',
    fontWeight: '500',
  },
});

export default MoviesListScreen;

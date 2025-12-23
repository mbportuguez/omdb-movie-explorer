import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchMovies, MovieSummary, MovieType } from '../api/omdb';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import MovieCard from '../components/MovieCard';
import { useFavorites } from '../context/FavoritesContext';
import { useSearch } from '../context/SearchContext';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MoviesList'>;

function MoviesListScreen() {
  const navigation = useNavigation<Nav>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { search, setSearch } = useSearch();

  const [queryInput, setQueryInput] = useState(search.query);
  const [type, setType] = useState<MovieType | undefined>(search.type as MovieType | undefined);
  const [year, setYear] = useState(search.year ?? '');
  const [sortBy, setSortBy] = useState<
    'relevance' | 'year_asc' | 'year_desc' | 'title_asc' | 'title_desc'
  >('relevance');
  const [lastYearSort, setLastYearSort] = useState<'year_asc' | 'year_desc'>('year_desc');
  const [lastTitleSort, setLastTitleSort] = useState<'title_asc' | 'title_desc'>('title_asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const debouncedQuery = useDebouncedValue(queryInput, 600);

  const [items, setItems] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const lastFiltersRef = useRef<{ query: string; type?: MovieType; year?: string }>({
    query: '',
  });

  const hasMore = page < totalPages;
  const loadMoreLockRef = useRef(false);

  const fetchPageRaw = useCallback(
    async (query: string, pageToLoad: number) => {
      const trimmed = query.trim();
      const normalizedYear = year.trim();
      return searchMovies({
        query: trimmed,
        page: pageToLoad,
        type,
        year: normalizedYear.length === 4 ? normalizedYear : undefined,
      });
    },
    [type, year],
  );

  const loadFirstPage = useCallback(
    async (query: string) => {
      const q = query.trim();
      if (q.length < 3) {
        setItems([]);
        setPage(1);
        setTotalPages(0);
        setError(null);
        setLastQuery('');
        lastFiltersRef.current = { query: '' };
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchPageRaw(q, 1);
        setItems(result.items);
        setPage(1);
        setTotalPages(result.totalPages);
        setLastQuery(q);
        const normalizedYear = year.trim() || undefined;
        lastFiltersRef.current = { query: q, type, year: normalizedYear };
        setSearch({
          query: q,
          type,
          year: normalizedYear,
        });
      } catch (e) {
        setError('Failed to load movies');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPageRaw, setSearch, type, year],
  );

  const loadMore = useCallback(async () => {
    if (loadMoreLockRef.current) return;
    if (!hasMore || isLoading || isFetchingMore || !lastQuery) return;

    loadMoreLockRef.current = true;
    setIsFetchingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const result = await fetchPageRaw(lastQuery, nextPage);

      setItems(prev => {
        const seen = new Set(prev.map(m => m.imdbID));
        return [...prev, ...result.items.filter(m => !seen.has(m.imdbID))];
      });

      setPage(nextPage);
      setTotalPages(result.totalPages);
    } catch (e) {
      setError('Failed to load more');
    } finally {
      setIsFetchingMore(false);
      setTimeout(() => {
        loadMoreLockRef.current = false;
      }, 200);
    }
  }, [fetchPageRaw, hasMore, isFetchingMore, isLoading, lastQuery, page]);

  const onRefresh = useCallback(async () => {
    if (!lastQuery) return;
    setIsRefreshing(true);
    await loadFirstPage(lastQuery);
    setIsRefreshing(false);
  }, [lastQuery, loadFirstPage]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q.length < 3) {
      lastFiltersRef.current = { query: '' };
      // keep existing clearing logic in loadFirstPage for safety
      loadFirstPage('');
      return;
    }
    // Check if filters changed (query, type, or year)
    const normalizedYear = year.trim() || undefined;
    const currentFilters = { query: q, type, year: normalizedYear };
    const lastFilters = lastFiltersRef.current;
    if (
      lastFilters.query === currentFilters.query &&
      lastFilters.type === currentFilters.type &&
      lastFilters.year === currentFilters.year
    ) {
      return;
    }
    loadFirstPage(debouncedQuery);
  }, [debouncedQuery, type, year, lastQuery, loadFirstPage]);

  const onEndReached = () => {
    loadMore();
  };

  const renderItem = useCallback(
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

  const keyExtractor = useCallback((item: MovieSummary) => item.imdbID, []);

  const listEmpty = useMemo(() => {
    if (isLoading) return null;
    if (error) return <Text style={styles.stateText}>{error}</Text>;
    if (!debouncedQuery.trim()) return <Text style={styles.stateText}>Search for a movie</Text>;
    return <Text style={styles.stateText}>No results</Text>;
  }, [debouncedQuery, error, isLoading]);

  const typeChips = useMemo(
    () =>
      [
        { label: 'Movies', value: 'movie' as MovieType },
        { label: 'Series', value: 'series' as MovieType },
        { label: 'Episodes', value: 'episode' as MovieType },
      ] as const,
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

  const sortedItems = useMemo(() => {
    if (sortBy === 'relevance') {
      return items;
    }
    const cloned = [...items];
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
  }, [items, sortBy]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.searchSection}>
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={queryInput}
            onChangeText={setQueryInput}
            placeholder="Search"
            style={styles.input}
            returnKeyType="search"
          />
          <Pressable
            style={styles.filterButton}
            onPress={() => setShowFilters(prev => !prev)}
          >
            <Text style={styles.filterButtonText}>Filters</Text>
          </Pressable>
        </View>
        {showFilters && (
          <View style={styles.filtersRow}>
              <Pressable
                onPress={() => setShowYearPicker(true)}
                style={styles.yearInput}
              >
                <Text style={styles.yearInputText}>
                  {year || 'Year'}
                </Text>
              </Pressable>
              <View style={styles.sortRow}>
                <Pressable
                  onPress={() => setSortBy('relevance')}
                  style={[styles.sortChip, sortBy === 'relevance' && styles.sortChipActive]}
                >
                  <Text
                    style={[styles.sortChipText, sortBy === 'relevance' && styles.sortChipTextActive]}
                  >
                    Default
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (sortBy === 'year_desc' || sortBy === 'year_asc') {
                      // Toggle if already on year sort
                      const next = sortBy === 'year_desc' ? 'year_asc' : 'year_desc';
                      setSortBy(next);
                      setLastYearSort(next);
                    } else {
                      // Use remembered direction when switching from other sort
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
                      (sortBy === 'year_desc' || sortBy === 'year_asc') && styles.sortChipTextActive,
                    ]}
                  >
                    Year {sortBy === 'year_desc' ? '↓' : sortBy === 'year_asc' ? '↑' : lastYearSort === 'year_desc' ? '↓' : '↑'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (sortBy === 'title_asc' || sortBy === 'title_desc') {
                      // Toggle if already on title sort
                      const next = sortBy === 'title_asc' ? 'title_desc' : 'title_asc';
                      setSortBy(next);
                      setLastTitleSort(next);
                    } else {
                      // Use remembered direction when switching from other sort
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
                      (sortBy === 'title_asc' || sortBy === 'title_desc') && styles.sortChipTextActive,
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
        <View style={styles.filtersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            <Pressable
              key="all"
              onPress={() => setType(undefined)}
              style={[styles.chip, !type && styles.chipActive]}
            >
              <Text style={[styles.chipText, !type && styles.chipTextActive]}>
                All
              </Text>
            </Pressable>
            {typeChips.map(option => {
              const active = type === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setType(active ? undefined : option.value)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          isFetchingMore && items.length > 0 ? (
            <View style={styles.footer}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        contentContainerStyle={items.length === 0 ? styles.emptyContainer : undefined}
      />

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
                <Text style={styles.modalClose}>✕</Text>
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
                  style={[
                    styles.yearOption,
                    year === item && styles.yearOptionSelected,
                  ]}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    gap: 12,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    fontSize: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#777',
  },
  filterButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#111',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearInput: {
    flexBasis: 90,
    marginRight: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
  },
  yearInputText: {
    fontSize: 14,
    color: '#333',
  },
  categories: {
    gap: 12,
    paddingVertical: 8,
    paddingRight: 12,
  },
  typeChips: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  chipText: {
    color: '#333',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  chipTextActive: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fff',
  },
  sortChipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  sortChipText: {
    fontSize: 13,
    color: '#333',
  },
  sortChipTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  stateText: {
    fontSize: 16,
    color: '#555',
  },
  footer: {
    paddingVertical: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 24,
    color: '#666',
    paddingHorizontal: 8,
  },
  yearOption: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  yearOptionSelected: {
    backgroundColor: '#f0f0f0',
  },
  yearOptionText: {
    fontSize: 16,
    color: '#333',
  },
  yearOptionTextSelected: {
    fontWeight: '600',
    color: '#111',
  },
  clearYearButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  clearYearText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default MoviesListScreen;


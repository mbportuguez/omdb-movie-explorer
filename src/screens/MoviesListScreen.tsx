import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
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
  const debouncedQuery = useDebouncedValue(queryInput, 600);

  const [items, setItems] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');

  const hasMore = page < totalPages;
  const loadMoreLockRef = useRef(false);

  const fetchPageRaw = useCallback(
    async (query: string, pageToLoad: number) => {
      const trimmed = query.trim();
      return searchMovies({ query: trimmed, page: pageToLoad, type });
    },
    [type],
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
        setSearch({ query: q, type });
      } catch (e) {
        setError('Failed to load movies');
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPageRaw, setSearch, type],
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
      // keep existing clearing logic in loadFirstPage for safety
      loadFirstPage('');
      return;
    }
    // Avoid refetching the same first page for the same query
    if (q === lastQuery) {
      return;
    }
    loadFirstPage(debouncedQuery);
  }, [debouncedQuery, lastQuery, loadFirstPage]);

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
        </View>
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
        data={items}
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
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default MoviesListScreen;


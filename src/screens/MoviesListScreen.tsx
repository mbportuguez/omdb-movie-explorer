import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { searchMovies, MovieSummary } from '../api/omdb';
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
  const [category, setCategory] = useState<string | undefined>(undefined);
  const debouncedQuery = useDebouncedValue(queryInput, 400);

  const [items, setItems] = useState<MovieSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = page < totalPages;

  const fetchPage = useCallback(
    async (pageToLoad: number, append: boolean) => {
      const activeQuery = debouncedQuery.trim();
      const effectiveQuery = [activeQuery, category].filter(Boolean).join(' ');
      if (!effectiveQuery) {
        setItems([]);
        setTotalPages(0);
        setError(null);
        return;
      }
      if (append) setLoading(true);
      else setRefreshing(true);
      try {
        const result = await searchMovies({
          query: effectiveQuery,
          page: pageToLoad,
        });
        setError(result.error || null);
        setTotalPages(result.totalPages);
        setPage(pageToLoad);
        setItems(prev => (append ? [...prev, ...result.items] : result.items));
        setSearch({ query: activeQuery });
      } catch (e) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedQuery, category, setSearch],
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [debouncedQuery, category, fetchPage]);

  const onEndReached = () => {
    if (loading || refreshing || !hasMore) return;
    fetchPage(page + 1, true);
  };

  const onRefresh = () => fetchPage(1, false);

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
    if (refreshing || loading) return null;
    if (error) return <Text style={styles.stateText}>{error}</Text>;
    if (!debouncedQuery.trim()) return <Text style={styles.stateText}>Search for a movie</Text>;
    return <Text style={styles.stateText}>No results</Text>;
  }, [debouncedQuery, error, loading, refreshing]);

  const categories = useMemo(
    () => [
      'Action',
      'Adventure',
      'Comedy',
      'Drama',
      'Romance',
      'Horror',
      'Thriller',
      'Science Fiction',
      'Fantasy',
      'Mystery',
      'Crime',
      'Animation',
      'Documentary',
      'Family',
      'Musical',
      'War',
      'Western',
    ],
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.searchSection}>
        <TextInput
          value={queryInput}
          onChangeText={setQueryInput}
          placeholder="Search movies..."
          style={styles.input}
          returnKeyType="search"
        />
        <View style={styles.filtersRow}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}
          >
            <Pressable
              key="all"
              onPress={() => setCategory(undefined)}
              style={[styles.chip, !category && styles.chipActive]}
            >
              <Text style={[styles.chipText, !category && styles.chipTextActive]}>
                All
              </Text>
            </Pressable>
            {categories.map(cat => {
              const active = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(active ? undefined : cat)}
                  style={[styles.chip, active && styles.chipActive]}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {cat}
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={
          loading && items.length > 0 ? (
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
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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


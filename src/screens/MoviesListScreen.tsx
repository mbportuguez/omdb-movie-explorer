import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
  const [year, setYear] = useState(search.year ?? '');
  const [type, setType] = useState<MovieType | undefined>(search.type);
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
      if (!activeQuery) {
        setItems([]);
        setTotalPages(0);
        setError(null);
        return;
      }
      if (append) setLoading(true);
      else setRefreshing(true);
      try {
        const result = await searchMovies({
          query: activeQuery,
          page: pageToLoad,
          year: year.trim() || undefined,
          type,
        });
        setError(result.error || null);
        setTotalPages(result.totalPages);
        setPage(pageToLoad);
        setItems(prev => (append ? [...prev, ...result.items] : result.items));
        setSearch({ query: activeQuery, year: year.trim() || undefined, type });
      } catch (e) {
        setError('Failed to load movies');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedQuery, year, type, setSearch],
  );

  useEffect(() => {
    fetchPage(1, false);
  }, [debouncedQuery, year, type, fetchPage]);

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

  const typeOptions: (MovieType | undefined)[] = [undefined, 'movie', 'series', 'episode'];

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
          <TextInput
            value={year}
            onChangeText={setYear}
            placeholder="Year"
            keyboardType="numeric"
            style={[styles.input, styles.yearInput]}
            maxLength={4}
          />
          <View style={styles.typeChips}>
            {typeOptions.map(opt => (
              <Pressable
                key={opt ?? 'all'}
                onPress={() => setType(opt)}
                style={[
                  styles.chip,
                  opt === type && styles.chipActive,
                ]}
              >
                <Text style={[styles.chipText, opt === type && styles.chipTextActive]}>
                  {opt ? opt : 'all'}
                </Text>
              </Pressable>
            ))}
          </View>
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
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  yearInput: {
    width: 90,
  },
  typeChips: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
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
    fontSize: 14,
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


import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { searchMovies, MovieSummary } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import { useFavorites } from '../context/FavoritesContext';
import { useAppColors } from '../hooks/useAppColors';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LatestMovies'>;

function LatestMoviesScreen() {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const colors = useAppColors();

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const loadLatest = async () => {
      setLoading(true);
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
          setMovies(result.items);
        }
      } catch (err) {
        setError(ERROR_MESSAGES.FAILED_TO_LOAD);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MovieSummary }) => (
      <MovieCard
        movie={item}
        onPress={() => navigation.navigate('MovieDetails', { imdbID: item.imdbID })}
        onToggleFavorite={() => toggleFavorite(item)}
        isFavorite={isFavorite(item.imdbID)}
      />
    ),
    [navigation, toggleFavorite, isFavorite],
  );

  const keyExtractor = useCallback((item: MovieSummary) => item.imdbID, []);

  const listEmpty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.ACCENT} />
          <Text style={[styles.emptyText, { color: colors.TEXT.PRIMARY }]}>Loading movies...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.TEXT.PRIMARY }]}>{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.TEXT.PRIMARY }]}>{ERROR_MESSAGES.NO_RESULTS}</Text>
      </View>
    );
  }, [loading, error, colors]);

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <View style={styles.iconButton}>
            <Icon name="close" size={24} color={colors.TEXT.PRIMARY} />
          </View>
        </Pressable>
        <Text style={[styles.title, { color: colors.TEXT.PRIMARY }]}>Latest Movies</Text>
        <View style={styles.placeholder} />
      </View>
      <FlatList
        data={movies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={movies.length > 0 ? styles.row : undefined}
        contentContainerStyle={
          movies.length === 0
            ? styles.emptyListContainer
            : styles.gridContainer
        }
        ListEmptyComponent={listEmpty}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={8}
        windowSize={7}
        maxToRenderPerBatch={8}
        removeClippedSubviews
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  gridContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default LatestMoviesScreen;


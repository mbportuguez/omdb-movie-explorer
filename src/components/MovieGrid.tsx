import React, { useEffect, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { MovieSummary } from '../api/omdb';
import MovieCard from './MovieCard';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';

type MovieGridProps = {
  movies: MovieSummary[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptySubtext?: string;
  onMoviePress: (imdbID: string) => void;
  onToggleFavorite: (movie: MovieSummary) => void;
  isFavorite: (imdbID: string) => boolean;
};

export default function MovieGrid({
  movies,
  isLoading = false,
  error = null,
  emptyMessage,
  emptySubtext,
  onMoviePress,
  onToggleFavorite,
  isFavorite,
}: MovieGridProps) {
  useEffect(() => {
    if (movies.length > 0) {
      const urls = movies
        .map(m => m.poster)
        .filter(Boolean)
        .slice(0, 20)
        .map(uri => ({ uri }));

      if (urls.length > 0) {
        FastImage.preload(urls);
      }
    }
  }, [movies]);

  const renderItem = useCallback(
    ({ item }: { item: MovieSummary }) => (
      <MovieCard
        movie={item}
        onPress={() => onMoviePress(item.imdbID)}
        onToggleFavorite={() => onToggleFavorite(item)}
        isFavorite={isFavorite(item.imdbID)}
      />
    ),
    [onMoviePress, onToggleFavorite, isFavorite],
  );

  const keyExtractor = useCallback((item: MovieSummary) => item.imdbID, []);

  const listEmpty = (
    <View style={styles.emptyContainer}>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color={APP_CONSTANTS.COLORS.ACCENT} />
          <Text style={styles.emptyText}>Loading...</Text>
        </>
      ) : error ? (
        <Text style={styles.emptyText}>{error}</Text>
      ) : (
        <>
          <Text style={styles.emptyText}>{emptyMessage || ERROR_MESSAGES.NO_RESULTS}</Text>
          {emptySubtext && <Text style={styles.emptySubtext}>{emptySubtext}</Text>}
        </>
      )}
    </View>
  );

  return (
    <FlatList
      data={movies}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={2}
      columnWrapperStyle={movies.length > 0 ? styles.row : undefined}
      contentContainerStyle={
        movies.length === 0 ? styles.emptyListContainer : styles.gridContainer
      }
      ListEmptyComponent={listEmpty}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={8}
      windowSize={7}
      maxToRenderPerBatch={8}
      removeClippedSubviews
    />
  );
}

const styles = StyleSheet.create({
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
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: APP_CONSTANTS.COLORS.TEXT.SECONDARY,
    textAlign: 'center',
  },
});


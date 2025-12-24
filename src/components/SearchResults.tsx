import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import MovieCard from './MovieCard';
import { MovieSummary } from '../api/omdb';
import { ERROR_MESSAGES } from '../constants/app';
import { useAppColors } from '../hooks/useAppColors';

type SearchResultsProps = {
  results: MovieSummary[];
  isLoading: boolean;
  isUserTyping: boolean;
  error: string | null;
  isFetchingMore: boolean;
  onMoviePress: (imdbID: string) => void;
  onToggleFavorite: (movie: MovieSummary) => void;
  isFavorite: (imdbID: string) => boolean;
  onEndReached: () => void;
};

export default function SearchResults({
  results,
  isLoading,
  isUserTyping,
  error,
  isFetchingMore,
  onMoviePress,
  onToggleFavorite,
  isFavorite,
  onEndReached,
}: SearchResultsProps) {
  const colors = useAppColors();

  // Prefetch first batch of posters when results change
  useEffect(() => {
    if (results.length > 0) {
      const urls = results
        .map(m => m.poster)
        .filter(Boolean)
        .slice(0, 20) // Prefetch first 20
        .map(uri => ({ uri }));

      if (urls.length > 0) {
        FastImage.preload(urls);
      }
    }
  }, [results]);

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

          return (
            <FlatList
              testID="search-results"
              data={results}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.gridContainer}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={8}
              windowSize={7}
              maxToRenderPerBatch={8}
              removeClippedSubviews
      ListEmptyComponent={
        isLoading && !isUserTyping && results.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.ACCENT} />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.TEXT.TERTIARY }]}>{error}</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.TEXT.TERTIARY }]}>{ERROR_MESSAGES.NO_RESULTS}</Text>
          </View>
        )
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color={colors.ACCENT} />
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    padding: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 0,
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
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


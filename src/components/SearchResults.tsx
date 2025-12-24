import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import MovieCard from './MovieCard';
import { MovieSummary } from '../api/omdb';
import { ERROR_MESSAGES } from '../constants/app';

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
  return (
    <FlatList
      data={results}
      keyExtractor={item => item.imdbID}
      renderItem={({ item }) => (
        <MovieCard
          movie={item}
          onPress={() => onMoviePress(item.imdbID)}
          onToggleFavorite={() => onToggleFavorite(item)}
          isFavorite={isFavorite(item.imdbID)}
        />
      )}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.gridContainer}
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        isLoading && !isUserTyping && results.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#ff6b35" />
          </View>
        ) : error ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{ERROR_MESSAGES.NO_RESULTS}</Text>
          </View>
        )
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingMore ? (
          <View style={styles.footer}>
            <ActivityIndicator color="#ff6b35" />
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
    color: '#888',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});


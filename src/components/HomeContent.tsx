import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import HorizontalMovieCard from './HorizontalMovieCard';
import { MovieSummary, MovieType } from '../api/omdb';
import { ERROR_MESSAGES } from '../constants/app';

type HomeContentProps = {
  isLoadingLatest: boolean;
  latestMovies: MovieSummary[];
  favoritesList: Array<{
    imdbID: string;
    title: string;
    year?: string;
    type?: string;
    poster?: string;
  }>;
  onMoviePress: (imdbID: string) => void;
};

export default function HomeContent({
  isLoadingLatest,
  latestMovies,
  favoritesList,
  onMoviePress,
}: HomeContentProps) {
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
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
              onPress={() => onMoviePress(movie.imdbID)}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Favorite Movie</Text>
      </View>
      {favoritesList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{ERROR_MESSAGES.NO_FAVORITES}</Text>
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
              onPress={() => onMoviePress(movie.imdbID)}
            />
          ))}
        </ScrollView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
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
});


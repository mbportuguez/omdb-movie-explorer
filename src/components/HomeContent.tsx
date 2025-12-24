import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import HorizontalMovieCard from './HorizontalMovieCard';
import { MovieSummary, MovieType } from '../api/omdb';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import { useAppColors } from '../hooks/useAppColors';

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
  onViewAllLatest?: () => void;
  onViewAllFavorites?: () => void;
};

export default function HomeContent({
  isLoadingLatest,
  latestMovies,
  favoritesList,
  onMoviePress,
  onViewAllLatest,
  onViewAllFavorites,
}: HomeContentProps) {
  const colors = useAppColors();

  // Prefetch posters when movies change
  useEffect(() => {
    const allPosters = [
      ...latestMovies.map(m => m.poster),
      ...favoritesList.map(m => m.poster),
    ]
      .filter(Boolean)
      .slice(0, 20) // Prefetch first 20
      .map(uri => ({ uri }));

    if (allPosters.length > 0) {
      FastImage.preload(allPosters);
    }
  }, [latestMovies, favoritesList]);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT.PRIMARY }]}>Latest Movie</Text>
        {latestMovies.length > 0 && onViewAllLatest && (
          <Pressable onPress={onViewAllLatest}>
            <Text style={[styles.viewAllText, { color: colors.ACCENT }]}>View All</Text>
          </Pressable>
        )}
      </View>
      {isLoadingLatest ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.ACCENT} />
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
        <Text style={[styles.sectionTitle, { color: colors.TEXT.PRIMARY }]}>Favorite Movie</Text>
        {favoritesList.length > 0 && onViewAllFavorites && (
          <Pressable onPress={onViewAllFavorites}>
            <Text style={[styles.viewAllText, { color: colors.ACCENT }]}>View All</Text>
          </Pressable>
        )}
      </View>
      {favoritesList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.TEXT.TERTIARY }]}>{ERROR_MESSAGES.NO_FAVORITES}</Text>
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
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '500',
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
  },
});


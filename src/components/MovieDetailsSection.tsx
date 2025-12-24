import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MovieDetails } from '../api/omdb';
import { APP_CONSTANTS } from '../constants/app';
import RatingsSection from './RatingsSection';
import { extractImdbRating, parseCommaSeparated } from '../utils/movieUtils';

type MovieDetailsSectionProps = {
  movie: MovieDetails;
  rating: number | null;
  actors: string[];
};

function MovieDetailsSection({ movie, rating, actors }: MovieDetailsSectionProps) {
  const genres = parseCommaSeparated(movie.genre);

  const detailItems = [
    { label: 'Director:', value: movie.director },
    { label: 'Runtime:', value: movie.runtime },
    { label: 'Released:', value: movie.released },
    { label: 'Year:', value: movie.year },
  ].filter(item => item.value);

  return (
    <LinearGradient
      colors={['rgba(42,42,42,0.0)', 'rgba(42,42,42,1)']}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.infoContainer}
    >
      <View style={styles.contentContainer}>
        {/* Ratings */}
        <RatingsSection rating={rating} />

        {/* Title */}
        <Text style={styles.title}>{movie.title}</Text>

        {/* Genres */}
        {genres.length > 0 && (
          <View style={styles.genresContainer}>
            {genres.map((genre, idx) => (
              <View key={idx} style={styles.genreChip}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Cast Names */}
        {actors.length > 0 && (
          <View style={styles.castContainer}>
            {actors.map((actor, idx) => (
              <Text key={idx} style={styles.castText}>
                {actor.toUpperCase()}
              </Text>
            ))}
          </View>
        )}

        {/* Synopsis */}
        {movie.plot && (
          <View style={styles.synopsisSection}>
            <Text style={styles.synopsisText}>{movie.plot}</Text>
          </View>
        )}

        {/* Additional Info */}
        {detailItems.length > 0 && (
          <View style={styles.detailsSection}>
            {detailItems.map((item, idx) => (
              <View key={idx} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -100,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
    marginBottom: 16,
    lineHeight: 34,
  },
  castContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  castText: {
    fontSize: 12,
    color: APP_CONSTANTS.COLORS.TEXT.SECONDARY,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.TERTIARY,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a4a4a',
  },
  genreText: {
    fontSize: 13,
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
    fontWeight: '500',
  },
  synopsisSection: {
    marginBottom: 24,
  },
  synopsisText: {
    fontSize: 15,
    lineHeight: 24,
    color: APP_CONSTANTS.COLORS.TEXT.SECONDARY,
  },
  detailsSection: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: APP_CONSTANTS.COLORS.TEXT.TERTIARY,
    fontWeight: '600',
    minWidth: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
  },
});

export default MovieDetailsSection;


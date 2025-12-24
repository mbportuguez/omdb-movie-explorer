import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MovieSummary } from '../api/omdb';
import CachedImage from './CachedImage';
import { useAppColors } from '../hooks/useAppColors';

type Props = {
  movie: MovieSummary;
  onPress: () => void;
};

const HorizontalMovieCard = React.memo(function HorizontalMovieCard({ movie, onPress }: Props) {
  const colors = useAppColors();

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={[styles.posterWrapper, { backgroundColor: colors.BACKGROUND.SECONDARY }]}>
        {movie.poster ? (
          <CachedImage source={{ uri: movie.poster }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={[styles.posterPlaceholderText, { color: colors.TEXT.TERTIARY }]}>No image</Text>
          </View>
        )}
      </View>
      <Text style={[styles.title, { color: colors.TEXT.PRIMARY }]} numberOfLines={2}>
        {movie.title}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    width: 140,
    marginRight: 16,
  },
  posterWrapper: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  poster: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  posterPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  posterPlaceholderText: {
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default HorizontalMovieCard;


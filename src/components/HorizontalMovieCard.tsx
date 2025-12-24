import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MovieSummary } from '../api/omdb';
import CachedImage from './CachedImage';

type Props = {
  movie: MovieSummary;
  onPress: () => void;
};

function HorizontalMovieCard({ movie, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.posterWrapper}>
        {movie.poster ? (
          <CachedImage source={{ uri: movie.poster }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterPlaceholderText}>No image</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.title}
      </Text>
    </Pressable>
  );
}

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
    backgroundColor: '#2a2a2a',
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
    color: '#888',
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
});

export default HorizontalMovieCard;


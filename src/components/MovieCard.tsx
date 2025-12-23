import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MovieSummary } from '../api/omdb';

type Props = {
  movie: MovieSummary;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

function MovieCard({ movie, onPress, onToggleFavorite, isFavorite }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.posterWrapper}>
        {movie.poster ? (
          <Image source={{ uri: movie.poster }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterPlaceholderText}>No image</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.meta}>
          {movie.year} • {movie.type}
        </Text>
        <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
          <Text style={styles.favoriteText}>{isFavorite ? '★ Favorited' : '☆ Favorite'}</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
    gap: 12,
  },
  posterWrapper: {
    width: 64,
    height: 96,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#777',
    textAlign: 'center',
  },
  info: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  meta: {
    fontSize: 13,
    color: '#555',
  },
  favoriteButton: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d0d0d0',
    backgroundColor: '#fafafa',
  },
  favoriteText: {
    fontSize: 13,
    color: '#444',
  },
});

export default MovieCard;



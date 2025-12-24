import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MovieSummary } from '../api/omdb';
import CachedImage from './CachedImage';

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
          <CachedImage source={{ uri: movie.poster }} style={styles.poster} />
        ) : (
          <View style={styles.posterPlaceholder}>
            <Text style={styles.posterPlaceholderText}>No image</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {movie.title}
          </Text>
          <Pressable onPress={onToggleFavorite} style={styles.favoriteButton}>
            <Icon
              name={isFavorite ? 'star' : 'star-outline'}
              size={18}
              color="#ff6b35"
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  posterWrapper: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#1a1a1a',
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
    color: '#888',
    textAlign: 'center',
  },
  info: {
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  favoriteButton: {
    padding: 4,
  },
});

export default MovieCard;



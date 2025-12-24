import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchMovieDetails, MovieDetails } from '../api/omdb';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import CachedImage from '../components/CachedImage';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
type Route = RouteProp<RootStackParamList, 'MovieDetails'>;

function MovieDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { imdbID } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const details = await fetchMovieDetails(imdbID);
        if (details) {
          setMovie(details);
        } else {
          setError('Movie not found');
        }
      } catch (e) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    })();
  }, [imdbID]);

  const handleToggleFavorite = useCallback(async () => {
    if (!movie) return;
    await toggleFavorite({
      imdbID: movie.imdbID,
      title: movie.title,
      year: movie.year,
      type: movie.type,
      poster: movie.poster,
    });
  }, [movie, toggleFavorite]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
      </View>
    );
  }

  const favorite = isFavorite(movie.imdbID);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {movie.poster && (
        <CachedImage source={{ uri: movie.poster }} style={styles.poster} resizeMode="cover" />
      )}

      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{movie.title}</Text>
          <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>{favorite ? '❤️' : '🤍'}</Text>
          </Pressable>
        </View>
        <Text style={styles.year}>{movie.year}</Text>
        {movie.genre && <Text style={styles.genre}>{movie.genre}</Text>}
      </View>

      <View style={styles.section}>
        {movie.plot && (
          <View style={styles.plotSection}>
            <Text style={styles.sectionTitle}>Plot</Text>
            <Text style={styles.plotText}>{movie.plot}</Text>
          </View>
        )}

        {movie.director && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Director:</Text>
            <Text style={styles.infoValue}>{movie.director}</Text>
          </View>
        )}

        {movie.actors && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cast:</Text>
            <Text style={styles.infoValue}>{movie.actors}</Text>
          </View>
        )}

        {movie.runtime && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Runtime:</Text>
            <Text style={styles.infoValue}>{movie.runtime}</Text>
          </View>
        )}

        {movie.released && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Released:</Text>
            <Text style={styles.infoValue}>{movie.released}</Text>
          </View>
        )}

        {movie.ratings && movie.ratings.length > 0 && (
          <View style={styles.ratingsSection}>
            <Text style={styles.sectionTitle}>Ratings</Text>
            {movie.ratings.map((rating, idx) => (
              <View key={idx} style={styles.ratingRow}>
                <Text style={styles.ratingSource}>{rating.Source}:</Text>
                <Text style={styles.ratingValue}>{rating.Value}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  poster: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginRight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 28,
  },
  year: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  genre: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  section: {
    padding: 16,
  },
  plotSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  plotText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
    minWidth: 80,
  },
  infoValue: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  ratingsSection: {
    marginTop: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  ratingSource: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    minWidth: 100,
  },
  ratingValue: {
    fontSize: 15,
    color: '#333',
  },
});

export default MovieDetailsScreen;

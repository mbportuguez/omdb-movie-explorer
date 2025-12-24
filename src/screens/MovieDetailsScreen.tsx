import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useMovieDetails } from '../hooks/useMovieDetails';
import { extractImdbRating, parseActors } from '../utils/movieUtils';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import PosterSection from '../components/PosterSection';
import MovieDetailsSection from '../components/MovieDetailsSection';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
type Route = RouteProp<RootStackParamList, 'MovieDetails'>;

function MovieDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { imdbID } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { movie, loading, error } = useMovieDetails(imdbID);

  const imdbRating = useMemo(() => extractImdbRating(movie?.ratings), [movie?.ratings]);
  const actors = useMemo(
    () => parseActors(movie?.actors, APP_CONSTANTS.DETAILS.MAX_ACTORS_DISPLAY),
    [movie?.actors]
  );

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

  const renderOverlayButtons = useCallback(() => {
    const favorite = movie ? isFavorite(movie.imdbID) : false;
    return (
      <>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <View style={styles.iconButton}>
            <Icon name="close" size={24} color={APP_CONSTANTS.COLORS.TEXT.PRIMARY} />
          </View>
        </Pressable>
        <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <View style={styles.iconButton}>
            <Icon 
              name={favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={favorite ? APP_CONSTANTS.COLORS.ACCENT : APP_CONSTANTS.COLORS.TEXT.PRIMARY} 
            />
          </View>
        </Pressable>
      </>
    );
  }, [movie, isFavorite, handleToggleFavorite, navigation]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={APP_CONSTANTS.COLORS.ACCENT} />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || ERROR_MESSAGES.FAILED_TO_LOAD}</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <PosterSection
          poster={movie.poster}
          renderOverlayButtons={renderOverlayButtons}
        />
        <MovieDetailsSection movie={movie} rating={imdbRating} actors={actors} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.PRIMARY,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.PRIMARY,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
  },
  errorText: {
    fontSize: 16,
    color: APP_CONSTANTS.COLORS.ACCENT,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: APP_CONSTANTS.COLORS.ACCENT,
    borderRadius: 8,
  },
  backButtonText: {
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
    fontSize: 16,
    fontWeight: '600',
  },
  closeButton: {
    zIndex: 10,
  },
  favoriteButton: {
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MovieDetailsScreen;

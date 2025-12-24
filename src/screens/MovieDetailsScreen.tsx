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
import { useAppColors } from '../hooks/useAppColors';
import PosterSection from '../components/PosterSection';
import MovieDetailsSection from '../components/MovieDetailsSection';

type Nav = NativeStackNavigationProp<RootStackParamList, 'MovieDetails'>;
type Route = RouteProp<RootStackParamList, 'MovieDetails'>;

function MovieDetailsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { imdbID } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const { movie, loading, error, isOffline } = useMovieDetails(imdbID);
  const colors = useAppColors();

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
            <Icon name="close" size={24} color="#ffffff" />
          </View>
        </Pressable>
        <Pressable onPress={handleToggleFavorite} style={styles.favoriteButton}>
          <View style={styles.iconButton}>
            <Icon 
              name={favorite ? "heart" : "heart-outline"} 
              size={24} 
              color={favorite ? colors.ACCENT : "#ffffff"} 
            />
          </View>
        </Pressable>
      </>
    );
  }, [movie, isFavorite, handleToggleFavorite, navigation, colors]);

  if (loading && !movie) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
        <ActivityIndicator size="large" color={colors.ACCENT} />
        <Text style={[styles.loadingText, { color: colors.TEXT.PRIMARY }]}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
        <Text style={[styles.errorText, { color: colors.ACCENT }]}>{error || ERROR_MESSAGES.FAILED_TO_LOAD}</Text>
        <Pressable onPress={() => navigation.goBack()} style={[styles.backButton, { backgroundColor: colors.ACCENT }]}>
          <Text style={[styles.backButtonText, { color: colors.TEXT.PRIMARY }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      {isOffline && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.ACCENT }]}>
          <Text style={[styles.offlineText, { color: colors.TEXT.PRIMARY }]}>{ERROR_MESSAGES.OFFLINE_MODE}</Text>
        </View>
      )}
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
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
  offlineBanner: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  offlineText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default MovieDetailsScreen;

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchMovies, MovieSummary } from '../api/omdb';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import { useFavorites } from '../context/FavoritesContext';
import { useAppColors } from '../hooks/useAppColors';
import ScreenHeader from '../components/ScreenHeader';
import MovieGrid from '../components/MovieGrid';

type Nav = NativeStackNavigationProp<RootStackParamList, 'LatestMovies'>;

function LatestMoviesScreen() {
  const navigation = useNavigation<Nav>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const colors = useAppColors();

  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const loadLatest = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await searchMovies({
          query: APP_CONSTANTS.MOVIES.DEFAULT_QUERY,
          page: APP_CONSTANTS.PAGINATION.INITIAL_PAGE,
          type: 'movie',
        });
        if (result.error) {
          setError(result.error);
        } else {
          setMovies(result.items);
        }
      } catch (err) {
        setError(ERROR_MESSAGES.FAILED_TO_LOAD);
      } finally {
        setLoading(false);
      }
    };
    loadLatest();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
      <ScreenHeader title="Latest Movies" onClose={() => navigation.goBack()} />
      <MovieGrid
        movies={movies}
        isLoading={loading}
        error={error}
        emptyMessage={ERROR_MESSAGES.NO_RESULTS}
        onMoviePress={(imdbID) => navigation.navigate('MovieDetails', { imdbID })}
        onToggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LatestMoviesScreen;


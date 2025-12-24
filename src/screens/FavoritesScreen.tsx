import React, { useLayoutEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../constants/app';
import ScreenHeader from '../components/ScreenHeader';
import MovieGrid from '../components/MovieGrid';
import { MovieSummary } from '../api/omdb';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const favoritesList = useMemo(() => {
    return Object.values(favorites).map(
      (item): MovieSummary => ({
        imdbID: item.imdbID,
        title: item.title,
        year: item.year || '',
        type: (item.type as MovieSummary['type']) || 'movie',
        poster: item.poster,
      }),
    );
  }, [favorites]);

  return (
    <View style={styles.container}>
      <ScreenHeader title="Favorites" onClose={() => navigation.goBack()} />
      <MovieGrid
        movies={favoritesList}
        isLoading={loading}
        emptyMessage={ERROR_MESSAGES.NO_FAVORITES}
        emptySubtext="Mark movies as favorites to see them here"
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
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.PRIMARY,
  },
});

export default FavoritesScreen;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoviesListScreen from '../screens/MoviesListScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import LatestMoviesScreen from '../screens/LatestMoviesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { FavoritesProvider } from '../context/FavoritesContext';
import { ThemeProvider } from '../context/ThemeContext';

export type RootStackParamList = {
  MoviesList: undefined;
  MovieDetails: { imdbID: string };
  Favorites: undefined;
  LatestMovies: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MoviesList"
              component={MoviesListScreen}
              options={{ title: 'Movies' }}
            />
            <Stack.Screen
              name="MovieDetails"
              component={MovieDetailsScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Favorites"
              component={FavoritesScreen}
              options={{ title: 'Favorites' }}
            />
            <Stack.Screen
              name="LatestMovies"
              component={LatestMoviesScreen}
              options={{ title: 'Latest Movies' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default RootNavigator;



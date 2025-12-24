import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoviesListScreen from '../screens/MoviesListScreen';
import MovieDetailsScreen from '../screens/MovieDetailsScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { FavoritesProvider } from '../context/FavoritesContext';
import { SearchProvider } from '../context/SearchContext';

export type RootStackParamList = {
  MoviesList: undefined;
  MovieDetails: { imdbID: string };
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <FavoritesProvider>
      <SearchProvider>
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
          </Stack.Navigator>
        </NavigationContainer>
      </SearchProvider>
    </FavoritesProvider>
  );
}

export default RootNavigator;



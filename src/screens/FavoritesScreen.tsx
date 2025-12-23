import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFavorites } from '../context/FavoritesContext';
import MovieCard from '../components/MovieCard';
import { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite, isFavorite, loading } = useFavorites();

  const favoritesList = useMemo(() => Object.values(favorites), [favorites]);

  const renderItem = useCallback(
    ({ item }: { item: typeof favoritesList[number] }) => (
      <MovieCard
        movie={{
          imdbID: item.imdbID,
          title: item.title,
          year: item.year || '',
          type: (item.type as any) || 'movie',
          poster: item.poster,
        }}
        onPress={() => navigation.navigate('MovieDetails', { imdbID: item.imdbID })}
        onToggleFavorite={() => toggleFavorite(item)}
        isFavorite={isFavorite(item.imdbID)}
      />
    ),
    [navigation, toggleFavorite, isFavorite],
  );

  const keyExtractor = useCallback((item: typeof favoritesList[number]) => item.imdbID, []);

  const listEmpty = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading favorites...</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>Mark movies as favorites to see them here</Text>
      </View>
    );
  }, [loading]);

  return (
    <View style={styles.container}>
      <FlatList
        data={favoritesList}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
        contentContainerStyle={favoritesList.length === 0 ? styles.emptyListContainer : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});

export default FavoritesScreen;

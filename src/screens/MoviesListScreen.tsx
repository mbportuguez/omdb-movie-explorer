import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MoviesListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movies List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default MoviesListScreen;



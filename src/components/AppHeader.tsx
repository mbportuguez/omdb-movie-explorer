import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type AppHeaderProps = {
  onFavoritesPress: () => void;
};

export default function AppHeader({ onFavoritesPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.welcomeText}>Welcome Joko 👋</Text>
        <Text style={styles.subtitleText}>Let's relax and watch a movie !</Text>
      </View>
      <Pressable onPress={onFavoritesPress} style={styles.profileButton}>
        <View style={styles.profileIcon}>
          <Icon name="person-circle" size={40} color="#ff6b35" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#aaa',
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff6b35',
  },
});


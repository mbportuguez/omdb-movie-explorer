import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppColors } from '../hooks/useAppColors';

type AppHeaderProps = {
  onFavoritesPress: () => void;
};

const AppHeader = React.memo(function AppHeader({ onFavoritesPress }: AppHeaderProps) {
  const colors = useAppColors();

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={[styles.welcomeText, { color: colors.TEXT.PRIMARY }]}>Welcome MBP 👋</Text>
        <Text style={[styles.subtitleText, { color: colors.TEXT.SECONDARY }]}>Let's relax and watch a movie !</Text>
      </View>
              <Pressable testID="profile-button" onPress={onFavoritesPress} style={styles.profileButton}>
        <View style={[styles.profileIcon, { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.ACCENT }]}>
          <Icon name="person-circle" size={40} color={colors.ACCENT} />
        </View>
      </Pressable>
    </View>
  );
});

export default AppHeader;

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
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
  },
  profileButton: {
    padding: 4,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});


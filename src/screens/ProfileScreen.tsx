import React, { useLayoutEffect, useMemo } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/RootNavigator';
import { getAppColors } from '../constants/app';
import ScreenHeader from '../components/ScreenHeader';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

function ProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { theme, isDark, setTheme } = useTheme();
  const colors = useMemo(() => getAppColors(isDark), [isDark]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleThemeChange = async (value: boolean) => {
    await setTheme(value ? 'dark' : 'light');
  };

          return (
            <View testID="profile-screen" style={[styles.container, { backgroundColor: colors.BACKGROUND.PRIMARY }]}>
              <ScreenHeader title="Profile" onClose={() => navigation.goBack()} />

      <View style={styles.content}>
        <View style={[styles.profileSection, { borderBottomColor: colors.BACKGROUND.TERTIARY }]}>
          <View style={styles.avatarContainer}>
            <Icon name="person-circle" size={80} color={colors.ACCENT} />
          </View>
          <Text style={[styles.name, { color: colors.TEXT.PRIMARY }]}>MBP</Text>
          <Text style={[styles.email, { color: colors.TEXT.SECONDARY }]}>mbp@example.com</Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.TEXT.PRIMARY }]}>Settings</Text>

          <View style={[styles.settingItem, { borderBottomColor: colors.BACKGROUND.TERTIARY }]}>
            <View style={styles.settingLeft}>
              <Icon name="moon" size={24} color={colors.TEXT.PRIMARY} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingLabel, { color: colors.TEXT.PRIMARY }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: colors.TEXT.SECONDARY }]}>
                  {theme === 'system' ? 'Follow system' : theme === 'dark' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              testID="dark-mode-switch"
              value={isDark}
              onValueChange={handleThemeChange}
              trackColor={{ false: colors.BACKGROUND.TERTIARY, true: colors.ACCENT }}
              thumbColor={colors.TEXT.PRIMARY}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  settingsSection: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
  },
});

export default ProfileScreen;


import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppColors } from '../hooks/useAppColors';

type ScreenHeaderProps = {
  title: string;
  onClose: () => void;
};

export default function ScreenHeader({ title, onClose }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <Pressable onPress={onClose} style={styles.closeButton}>
        <View style={styles.iconButton}>
          <Icon name="close" size={24} color={colors.TEXT.PRIMARY} />
        </View>
      </Pressable>
      <Text style={[styles.title, { color: colors.TEXT.PRIMARY }]}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
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
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
});


import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MovieType } from '../api/omdb';
import { useAppColors } from '../hooks/useAppColors';

type CategoryChipsProps = {
  type: MovieType | undefined;
  onTypeChange: (type: MovieType | undefined) => void;
};

const typeChips = [
  { label: 'All', value: undefined },
  { label: 'Movies', value: 'movie' as MovieType },
  { label: 'Series', value: 'series' as MovieType },
  { label: 'Episodes', value: 'episode' as MovieType },
];

export default function CategoryChips({ type, onTypeChange }: CategoryChipsProps) {
  const colors = useAppColors();

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.TEXT.PRIMARY }]}>Categories</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {typeChips.map((chip, index) => (
          <Pressable
            key={index}
            onPress={() => onTypeChange(chip.value)}
            style={[
              styles.categoryChip,
              { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY },
              type === chip.value && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
            ]}
          >
            <Text style={[styles.categoryChipText, { color: colors.TEXT.PRIMARY }]}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});


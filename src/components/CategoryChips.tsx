import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MovieType } from '../api/omdb';

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
  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {typeChips.map((chip, index) => (
          <Pressable
            key={index}
            onPress={() => onTypeChange(chip.value)}
            style={[styles.categoryChip, type === chip.value && styles.categoryChipActive]}
          >
            <Text
              style={[
                styles.categoryChipText,
                type === chip.value && styles.categoryChipTextActive,
              ]}
            >
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
    color: '#fff',
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
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
});


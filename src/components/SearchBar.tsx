import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MovieType } from '../api/omdb';
import { SortBy } from '../types/sort';

type SearchBarProps = {
  queryInput: string;
  onChangeQuery: (text: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  year: string;
  onYearPress: () => void;
  sortBy: SortBy;
  onSortChange: (sort: SortBy) => void;
  lastYearSort: 'year_asc' | 'year_desc';
  lastTitleSort: 'title_asc' | 'title_desc';
  onYearSortToggle: () => void;
  onTitleSortToggle: () => void;
};

export default function SearchBar({
  queryInput,
  onChangeQuery,
  showFilters,
  onToggleFilters,
  year,
  onYearPress,
  sortBy,
  onSortChange,
  lastYearSort,
  lastTitleSort,
  onYearSortToggle,
  onTitleSortToggle,
}: SearchBarProps) {
  const searchInputRef = useRef<TextInput>(null);

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#888" />
        <TextInput
          ref={searchInputRef}
          value={queryInput}
          onChangeText={onChangeQuery}
          placeholder="Search movie ...."
          placeholderTextColor="#888"
          style={styles.searchInput}
          returnKeyType="search"
          blurOnSubmit={false}
          autoCorrect={false}
        />
        <Pressable onPress={onToggleFilters} style={styles.filterIconButton}>
          <Icon name="options" size={18} color="#fff" />
        </Pressable>
      </View>
      {showFilters && (
        <View style={styles.filtersRow}>
          <Pressable
            onPress={onYearPress}
            style={[styles.filterButton, year && styles.filterButtonActive]}
          >
            <Text style={[styles.filterButtonText, year && styles.filterButtonTextActive]}>
              {year || 'Year'}
            </Text>
          </Pressable>
          <View style={styles.sortRow}>
            <Pressable
              onPress={() => onSortChange('relevance')}
              style={[styles.sortChip, sortBy === 'relevance' && styles.sortChipActive]}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === 'relevance' && styles.sortChipTextActive,
                ]}
              >
                Default
              </Text>
            </Pressable>
            <Pressable
              onPress={onYearSortToggle}
              style={[
                styles.sortChip,
                (sortBy === 'year_desc' || sortBy === 'year_asc') && styles.sortChipActive,
              ]}
            >
              <Text
                style={[
                  styles.sortChipText,
                  (sortBy === 'year_desc' || sortBy === 'year_asc') &&
                    styles.sortChipTextActive,
                ]}
              >
                Year {sortBy === 'year_desc' ? '↓' : sortBy === 'year_asc' ? '↑' : lastYearSort === 'year_desc' ? '↓' : '↑'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onTitleSortToggle}
              style={[
                styles.sortChip,
                (sortBy === 'title_asc' || sortBy === 'title_desc') && styles.sortChipActive,
              ]}
            >
              <Text
                style={[
                  styles.sortChipText,
                  (sortBy === 'title_asc' || sortBy === 'title_desc') &&
                    styles.sortChipTextActive,
                ]}
              >
                {sortBy === 'title_asc'
                  ? 'A–Z'
                  : sortBy === 'title_desc'
                    ? 'Z–A'
                    : lastTitleSort === 'title_asc'
                      ? 'A–Z'
                      : 'Z–A'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  filterIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    backgroundColor: '#3a3a3a',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  filterButtonActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  sortRow: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#2a2a2a',
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  sortChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  sortChipText: {
    fontSize: 11,
    color: '#fff',
  },
  sortChipTextActive: {
    color: '#fff',
  },
});


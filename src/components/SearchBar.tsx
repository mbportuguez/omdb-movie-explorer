import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { MovieType } from '../api/omdb';
import { SortBy } from '../types/sort';
import { useAppColors } from '../hooks/useAppColors';

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
  onFocus?: () => void;
  onBlur?: () => void;
  onLayout?: (event: { nativeEvent: { layout: { y: number; height: number } } }) => void;
  inputRef?: React.RefObject<TextInput | null>;
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
  onFocus,
  onBlur,
  onLayout,
  inputRef,
}: SearchBarProps) {
  const searchInputRef = useRef<TextInput>(null);
  const actualInputRef = inputRef || searchInputRef;
  const colors = useAppColors();

  return (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: colors.BACKGROUND.SECONDARY }]} onLayout={onLayout}>
        <Icon name="search" size={20} color={colors.TEXT.TERTIARY} />
                <TextInput
                  testID="search-input"
                  ref={actualInputRef}
                  value={queryInput}
                  onChangeText={onChangeQuery}
                  placeholder="Search movie ...."
                  placeholderTextColor={colors.TEXT.TERTIARY}
                  style={[styles.searchInput, { color: colors.TEXT.PRIMARY }]}
                  returnKeyType="search"
                  blurOnSubmit={false}
                  autoCorrect={false}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
        <Pressable onPress={onToggleFilters} style={[styles.filterIconButton, { backgroundColor: colors.BACKGROUND.TERTIARY }]}>
          <Icon name="options" size={18} color={colors.TEXT.PRIMARY} />
        </Pressable>
      </View>
      {showFilters && (
        <View style={styles.filtersRow}>
          <Pressable
            onPress={onYearPress}
            style={[
              styles.filterButton,
              { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY },
              year && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
            ]}
          >
            <Text style={[styles.filterButtonText, { color: colors.TEXT.PRIMARY }]}>
              {year || 'Year'}
            </Text>
          </Pressable>
          <View style={styles.sortRow}>
            <Pressable
              onPress={() => onSortChange('relevance')}
              style={[
                styles.sortChip,
                { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY },
                sortBy === 'relevance' && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
              ]}
            >
              <Text style={[styles.sortChipText, { color: colors.TEXT.PRIMARY }]}>
                Default
              </Text>
            </Pressable>
            <Pressable
              onPress={onYearSortToggle}
              style={[
                styles.sortChip,
                { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY },
                (sortBy === 'year_desc' || sortBy === 'year_asc') && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
              ]}
            >
              <Text style={[styles.sortChipText, { color: colors.TEXT.PRIMARY }]}>
                Year {sortBy === 'year_desc' ? '↓' : sortBy === 'year_asc' ? '↑' : lastYearSort === 'year_desc' ? '↓' : '↑'}
              </Text>
            </Pressable>
            <Pressable
              onPress={onTitleSortToggle}
              style={[
                styles.sortChip,
                { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY },
                (sortBy === 'title_asc' || sortBy === 'title_desc') && { backgroundColor: colors.ACCENT, borderColor: colors.ACCENT },
              ]}
            >
              <Text style={[styles.sortChipText, { color: colors.TEXT.PRIMARY }]}>
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
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
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
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
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
    borderWidth: 1,
  },
  sortChipText: {
    fontSize: 11,
  },
});


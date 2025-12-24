import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppColors } from '../hooks/useAppColors';

type RecentSearchesProps = {
  searches: string[];
  onSelectSearch: (query: string) => void;
  onRemoveSearch: (query: string) => void;
  onClearAll: () => void;
  top: number;
};

export default function RecentSearches({
  searches,
  onSelectSearch,
  onRemoveSearch,
  onClearAll,
  top,
}: RecentSearchesProps) {
  const colors = useAppColors();

  if (searches.length === 0) {
    return null;
  }

  return (
    <View style={[styles.floatingContainer, { top }]} pointerEvents="box-none">
      <View style={[styles.dropdown, { backgroundColor: colors.BACKGROUND.SECONDARY, borderColor: colors.BACKGROUND.TERTIARY }]} pointerEvents="auto">
        <View style={[styles.header, { borderBottomColor: colors.BACKGROUND.TERTIARY }]}>
          <Text style={[styles.title, { color: colors.TEXT.PRIMARY }]}>Recent Searches</Text>
          <Pressable onPress={onClearAll} style={styles.clearButton}>
            <Text style={[styles.clearText, { color: colors.ACCENT }]}>Clear</Text>
          </Pressable>
        </View>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          {searches.map((search, index) => (
            <Pressable
              key={`${search}-${index}`}
              onPress={() => onSelectSearch(search)}
              style={[styles.searchItem, { borderBottomColor: colors.BACKGROUND.TERTIARY }]}
            >
              <Icon name="time-outline" size={18} color={colors.TEXT.SECONDARY} />
              <Text style={[styles.searchText, { color: colors.TEXT.PRIMARY }]} numberOfLines={1}>
                {search}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onRemoveSearch(search);
                }}
                style={styles.removeButton}
              >
                <Icon name="close" size={16} color={colors.TEXT.TERTIARY} />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1001,
    paddingHorizontal: 20,
  },
  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxHeight: 300,
    overflow: 'hidden',
    pointerEvents: 'auto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollView: {
    maxHeight: 250,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
  },
  removeButton: {
    padding: 4,
  },
});


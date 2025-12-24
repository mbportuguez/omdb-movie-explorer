import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../constants/app';

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
  if (searches.length === 0) {
    return null;
  }

  return (
    <View style={[styles.floatingContainer, { top }]} pointerEvents="box-none">
      <View style={styles.dropdown} pointerEvents="auto">
        <View style={styles.header}>
          <Text style={styles.title}>Recent Searches</Text>
          <Pressable onPress={onClearAll} style={styles.clearButton}>
            <Text style={styles.clearText}>Clear</Text>
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
              style={styles.searchItem}
            >
              <Icon name="time-outline" size={18} color={APP_CONSTANTS.COLORS.TEXT.SECONDARY} />
              <Text style={styles.searchText} numberOfLines={1}>
                {search}
              </Text>
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onRemoveSearch(search);
                }}
                style={styles.removeButton}
              >
                <Icon name="close" size={16} color={APP_CONSTANTS.COLORS.TEXT.TERTIARY} />
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
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.SECONDARY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: APP_CONSTANTS.COLORS.BACKGROUND.TERTIARY,
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
    borderBottomColor: APP_CONSTANTS.COLORS.BACKGROUND.TERTIARY,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
  },
  clearButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearText: {
    fontSize: 12,
    color: APP_CONSTANTS.COLORS.ACCENT,
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
    borderBottomColor: APP_CONSTANTS.COLORS.BACKGROUND.TERTIARY,
  },
  searchText: {
    flex: 1,
    fontSize: 14,
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
  },
  removeButton: {
    padding: 4,
  },
});


import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../constants/app';
import { formatRatingWithReviews } from '../utils/movieUtils';
import { useAppColors } from '../hooks/useAppColors';

type RatingsSectionProps = {
  rating: number | null;
};

function RatingsSection({ rating }: RatingsSectionProps) {
  const colors = useAppColors();
  if (!rating) return null;

  return (
    <View style={styles.ratingsRow}>
      <View style={[styles.imdbBadge, { backgroundColor: colors.IMDB }]}>
        <Text style={styles.imdbText}>IMDB</Text>
        <Text style={styles.imdbRating}>{rating.toFixed(1)}</Text>
      </View>
      <View style={styles.starRating}>
        <Icon name="star" size={16} color={colors.IMDB} />
        <Text style={[styles.starText, { color: colors.TEXT.PRIMARY }]}>
          {formatRatingWithReviews(rating)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ratingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  imdbBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 6,
  },
  imdbText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  imdbRating: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default RatingsSection;


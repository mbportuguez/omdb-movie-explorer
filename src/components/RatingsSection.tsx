import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { APP_CONSTANTS } from '../constants/app';
import { formatRatingWithReviews } from '../utils/movieUtils';

type RatingsSectionProps = {
  rating: number | null;
};

function RatingsSection({ rating }: RatingsSectionProps) {
  if (!rating) return null;

  return (
    <View style={styles.ratingsRow}>
      <View style={styles.imdbBadge}>
        <Text style={styles.imdbText}>IMDB</Text>
        <Text style={styles.imdbRating}>{rating.toFixed(1)}</Text>
      </View>
      <View style={styles.starRating}>
        <Icon name="star" size={16} color={APP_CONSTANTS.COLORS.IMDB} />
        <Text style={styles.starText}>
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
    backgroundColor: APP_CONSTANTS.COLORS.IMDB,
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
    color: APP_CONSTANTS.COLORS.TEXT.PRIMARY,
    fontWeight: '500',
  },
});

export default RatingsSection;


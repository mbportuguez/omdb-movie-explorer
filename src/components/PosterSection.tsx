import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CachedImage from './CachedImage';
import { APP_CONSTANTS } from '../constants/app';
import { useAppColors } from '../hooks/useAppColors';

type PosterSectionProps = {
  poster?: string;
  renderOverlayButtons: () => React.ReactNode;
};

function PosterSection({
  poster,
  renderOverlayButtons,
}: PosterSectionProps) {
  const insets = useSafeAreaInsets();
  const colors = useAppColors();

  return (
    <View style={styles.posterContainer}>
      {poster ? (
        <CachedImage 
          source={{ uri: poster }} 
          style={styles.poster} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder, { backgroundColor: colors.BACKGROUND.SECONDARY }]}>
          <Icon name="film-outline" size={60} color={colors.TEXT.TERTIARY} />
        </View>
      )}
      
      {/* Overlay with buttons */}
      <View style={[styles.posterOverlay, { paddingTop: insets.top + 10 }]}>
        {renderOverlayButtons()}
      </View>

      {/* Fade gradient at bottom of poster */}
      <LinearGradient
        colors={[colors.GRADIENT.POSTER_START, colors.GRADIENT.POSTER_END]}
        style={styles.posterFadeGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  posterContainer: {
    width: '100%',
    height: APP_CONSTANTS.DETAILS.POSTER_HEIGHT,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  posterFadeGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: APP_CONSTANTS.DETAILS.GRADIENT_HEIGHT.POSTER,
  },
});

export default PosterSection;


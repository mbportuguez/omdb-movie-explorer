import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CachedImage from './CachedImage';
import { APP_CONSTANTS } from '../constants/app';

type PosterSectionProps = {
  poster?: string;
  renderOverlayButtons: () => React.ReactNode;
};

function PosterSection({
  poster,
  renderOverlayButtons,
}: PosterSectionProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.posterContainer}>
      {poster ? (
        <CachedImage 
          source={{ uri: poster }} 
          style={styles.poster} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.poster, styles.posterPlaceholder]}>
          <Icon name="film-outline" size={60} color="#666" />
        </View>
      )}
      
      {/* Overlay with buttons */}
      <View style={[styles.posterOverlay, { paddingTop: insets.top + 10 }]}>
        {renderOverlayButtons()}
      </View>

      {/* Fade gradient at bottom of poster */}
      <LinearGradient
        colors={[APP_CONSTANTS.COLORS.GRADIENT.POSTER_START, APP_CONSTANTS.COLORS.GRADIENT.POSTER_END]}
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
    backgroundColor: APP_CONSTANTS.COLORS.BACKGROUND.SECONDARY,
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


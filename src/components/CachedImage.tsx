import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import FastImage, { FastImageProps, ResizeMode } from 'react-native-fast-image';

/**
 * CachedImage component with loading state and error handling
 * 
 * Uses react-native-fast-image for proper disk caching that persists across app restarts.
 */
type CachedImageProps = Omit<FastImageProps, 'source'> & {
  source: { uri: string };
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
  resizeMode?: ResizeMode;
};

function CachedImage({
  source,
  style,
  placeholder,
  fallback,
  resizeMode = FastImage.resizeMode.cover,
  ...props
}: CachedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!source?.uri) {
    return (
      <View style={[styles.container, style]}>
        {fallback || (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, style]}>
        {fallback || (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <FastImage
        {...props}
        style={[styles.image, style]}
        source={{
          uri: source.uri,
          cache: FastImage.cacheControl.immutable,
          priority: FastImage.priority.normal,
        }}
        resizeMode={resizeMode}
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoadEnd={() => {
          setLoading(false);
        }}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
      />
      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          {placeholder || <ActivityIndicator size="small" color="#666" />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
});

export default CachedImage;


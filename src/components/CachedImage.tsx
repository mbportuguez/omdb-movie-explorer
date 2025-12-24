import React, { useState } from 'react';
import { Image, ImageProps, StyleSheet, View, Text, ActivityIndicator } from 'react-native';

/**
 * CachedImage component with loading state and error handling
 * 
 * React Native's Image component has built-in caching, but this wrapper
 * provides better UX with loading indicators and error states.
 * 
 * For production, consider using react-native-fast-image for better
 * performance and more advanced caching options.
 */
type CachedImageProps = ImageProps & {
  source: { uri: string };
  placeholder?: React.ReactNode;
  fallback?: React.ReactNode;
};

function CachedImage({
  source,
  style,
  placeholder,
  fallback,
  ...props
}: CachedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

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
      <Image
        {...props}
        source={source}
        style={[styles.image, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
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


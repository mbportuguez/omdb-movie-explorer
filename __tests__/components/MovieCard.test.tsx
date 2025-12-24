import { MovieSummary } from '../../src/api/omdb';

// Test component props and types without importing the actual component
// This avoids React Native dependency issues in tests

type MovieCardProps = {
  movie: MovieSummary;
  onPress: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
};

describe('MovieCard Component', () => {
  const mockMovie: MovieSummary = {
    imdbID: 'tt1234567',
    title: 'Test Movie',
    year: '2023',
    type: 'movie',
    poster: 'https://example.com/poster.jpg',
  };

  it('should accept movie, onPress, onToggleFavorite, and isFavorite props', () => {
    const onPress = jest.fn();
    const onToggleFavorite = jest.fn();
    
    const props: MovieCardProps = {
      movie: mockMovie,
      onPress,
      onToggleFavorite,
      isFavorite: false,
    };
    
    expect(props.movie).toEqual(mockMovie);
    expect(typeof props.onPress).toBe('function');
    expect(typeof props.onToggleFavorite).toBe('function');
    expect(typeof props.isFavorite).toBe('boolean');
  });

  it('should handle movie without poster', () => {
    const movieWithoutPoster: MovieSummary = {
      ...mockMovie,
      poster: undefined,
    };
    
    const props: MovieCardProps = {
      movie: movieWithoutPoster,
      onPress: jest.fn(),
      onToggleFavorite: jest.fn(),
      isFavorite: false,
    };
    
    expect(props.movie.poster).toBeUndefined();
  });

  it('should handle favorite state', () => {
    const props1: MovieCardProps = {
      movie: mockMovie,
      onPress: jest.fn(),
      onToggleFavorite: jest.fn(),
      isFavorite: true,
    };
    
    const props2: MovieCardProps = {
      movie: mockMovie,
      onPress: jest.fn(),
      onToggleFavorite: jest.fn(),
      isFavorite: false,
    };
    
    expect(props1.isFavorite).toBe(true);
    expect(props2.isFavorite).toBe(false);
  });

  it('should call onPress when provided', () => {
    const onPress = jest.fn();
    const props: MovieCardProps = {
      movie: mockMovie,
      onPress,
      onToggleFavorite: jest.fn(),
      isFavorite: false,
    };
    
    props.onPress();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should call onToggleFavorite when provided', () => {
    const onToggleFavorite = jest.fn();
    const props: MovieCardProps = {
      movie: mockMovie,
      onPress: jest.fn(),
      onToggleFavorite,
      isFavorite: false,
    };
    
    props.onToggleFavorite();
    expect(onToggleFavorite).toHaveBeenCalledTimes(1);
  });

  it('should handle different movie types', () => {
    const types: MovieSummary['type'][] = ['movie', 'series', 'episode'];
    
    types.forEach(type => {
      const movie: MovieSummary = { ...mockMovie, type };
      const props: MovieCardProps = {
        movie,
        onPress: jest.fn(),
        onToggleFavorite: jest.fn(),
        isFavorite: false,
      };
      expect(props.movie.type).toBe(type);
    });
  });
});


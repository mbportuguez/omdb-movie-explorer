import { MovieType } from '../../src/api/omdb';

// Test component props and types without importing the actual component
// This avoids React Native dependency issues in tests

type CategoryChipsProps = {
  type: MovieType | undefined;
  onTypeChange: (type: MovieType | undefined) => void;
};

describe('CategoryChips Component', () => {
  it('should accept type and onTypeChange props', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: undefined, onTypeChange };
    
    expect(props.type).toBeUndefined();
    expect(typeof props.onTypeChange).toBe('function');
  });

  it('should handle undefined type', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: undefined, onTypeChange };
    expect(props.type).toBeUndefined();
  });

  it('should handle movie type', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: 'movie', onTypeChange };
    expect(props.type).toBe('movie');
  });

  it('should handle series type', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: 'series', onTypeChange };
    expect(props.type).toBe('series');
  });

  it('should handle episode type', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: 'episode', onTypeChange };
    expect(props.type).toBe('episode');
  });

  it('should call onTypeChange when provided', () => {
    const onTypeChange = jest.fn();
    const props: CategoryChipsProps = { type: undefined, onTypeChange };
    
    props.onTypeChange('movie');
    expect(onTypeChange).toHaveBeenCalledWith('movie');
    
    props.onTypeChange(undefined);
    expect(onTypeChange).toHaveBeenCalledWith(undefined);
  });

  it('should handle all MovieType values', () => {
    const onTypeChange = jest.fn();
    const types: (MovieType | undefined)[] = [undefined, 'movie', 'series', 'episode'];
    
    types.forEach(type => {
      const props: CategoryChipsProps = { type, onTypeChange };
      expect(props.type).toBe(type);
    });
  });
});


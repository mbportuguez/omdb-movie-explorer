import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useSortToggle } from '../../src/hooks/useSortToggle';

let hookResult: ReturnType<typeof useSortToggle> | null = null;

function TestComponent() {
  hookResult = useSortToggle();
  const { sortBy, lastYearSort, lastTitleSort, handleYearSortToggle, handleTitleSortToggle } = hookResult;
  return React.createElement('View', null, [
    React.createElement('Text', { key: 'sortBy', testID: 'sortBy' }, sortBy),
    React.createElement('Text', { key: 'lastYear', testID: 'lastYear' }, lastYearSort),
    React.createElement('Text', { key: 'lastTitle', testID: 'lastTitle' }, lastTitleSort),
    React.createElement('Button', { key: 'yearToggle', onPress: handleYearSortToggle, title: 'Toggle Year' }),
    React.createElement('Button', { key: 'titleToggle', onPress: handleTitleSortToggle, title: 'Toggle Title' }),
  ]);
}

describe('useSortToggle', () => {
  beforeEach(() => {
    hookResult = null;
  });

  it('should initialize with default values', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    
    expect(hookResult).toBeTruthy();
    expect(hookResult!.sortBy).toBe('relevance');
    expect(hookResult!.lastYearSort).toBe('year_desc');
    expect(hookResult!.lastTitleSort).toBe('title_asc');
  });

  it('should toggle year sort from relevance to last year sort', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const yearToggleButton = instance.findByProps({ title: 'Toggle Year' });
    
    ReactTestRenderer.act(() => {
      yearToggleButton.props.onPress();
    });

    expect(hookResult!.sortBy).toBe('year_desc');
  });

  it('should toggle year sort between asc and desc', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const yearToggleButton = instance.findByProps({ title: 'Toggle Year' });
    
    // First toggle to year_desc
    ReactTestRenderer.act(() => {
      yearToggleButton.props.onPress();
    });
    
    // Second toggle to year_asc
    ReactTestRenderer.act(() => {
      yearToggleButton.props.onPress();
    });

    expect(hookResult!.sortBy).toBe('year_asc');
  });

  it('should toggle title sort from relevance to last title sort', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const titleToggleButton = instance.findByProps({ title: 'Toggle Title' });
    
    ReactTestRenderer.act(() => {
      titleToggleButton.props.onPress();
    });

    expect(hookResult!.sortBy).toBe('title_asc');
  });

  it('should toggle title sort between asc and desc', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const titleToggleButton = instance.findByProps({ title: 'Toggle Title' });
    
    // First toggle to title_asc
    ReactTestRenderer.act(() => {
      titleToggleButton.props.onPress();
    });
    
    // Second toggle to title_desc
    ReactTestRenderer.act(() => {
      titleToggleButton.props.onPress();
    });

    expect(hookResult!.sortBy).toBe('title_desc');
  });

  it('should update lastYearSort when toggling year sort', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const yearToggleButton = instance.findByProps({ title: 'Toggle Year' });
    
    // Toggle to year_asc
    ReactTestRenderer.act(() => {
      yearToggleButton.props.onPress();
    });
    ReactTestRenderer.act(() => {
      yearToggleButton.props.onPress();
    });

    expect(hookResult!.lastYearSort).toBe('year_asc');
  });
});


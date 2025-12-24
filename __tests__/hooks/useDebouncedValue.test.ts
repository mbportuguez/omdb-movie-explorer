import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';

jest.useFakeTimers();

function TestComponent({ value, delay }: { value: string; delay: number }) {
  const debounced = useDebouncedValue(value, delay);
  return React.createElement('Text', null, debounced);
}

describe('useDebouncedValue', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial value immediately', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        React.createElement(TestComponent, { value: 'initial', delay: 500 }),
      );
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('initial');
  });

  it('should debounce value changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        React.createElement(TestComponent, { value: 'initial', delay: 500 }),
      );
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('initial');

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(TestComponent, { value: 'updated', delay: 500 }),
      );
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('initial');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('updated');
  });

  it('should cancel previous timeout on rapid changes', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        React.createElement(TestComponent, { value: 'initial', delay: 500 }),
      );
    });

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(TestComponent, { value: 'first', delay: 500 }),
      );
    });
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(200);
    });

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(TestComponent, { value: 'second', delay: 500 }),
      );
    });
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(200);
    });

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(TestComponent, { value: 'third', delay: 500 }),
      );
    });
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(tree!.toJSON()?.children?.[0]).toBe('third');
  });

  it('should work with different delay values', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        React.createElement(TestComponent, { value: 'initial', delay: 1000 }),
      );
    });

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(TestComponent, { value: 'updated', delay: 1000 }),
      );
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('initial');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('initial');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(tree!.toJSON()?.children?.[0]).toBe('updated');
  });

  it('should work with number values', () => {
    function NumberComponent({ value, delay }: { value: number; delay: number }) {
      const debounced = useDebouncedValue(value, delay);
      return React.createElement('Text', null, String(debounced));
    }

    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(
        React.createElement(NumberComponent, { value: 0, delay: 500 }),
      );
    });

    expect(tree!.toJSON()?.children?.[0]).toBe('0');

    ReactTestRenderer.act(() => {
      tree!.update(
        React.createElement(NumberComponent, { value: 100, delay: 500 }),
      );
    });
    
    expect(tree!.toJSON()?.children?.[0]).toBe('0');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(tree!.toJSON()?.children?.[0]).toBe('100');
  });
});


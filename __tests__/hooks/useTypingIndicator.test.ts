import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useTypingIndicator } from '../../src/hooks/useTypingIndicator';

jest.useFakeTimers();

function TestComponent() {
  const { isUserTyping, handleTyping } = useTypingIndicator();
  return React.createElement('View', null, [
    React.createElement('Text', { key: 'typing' }, String(isUserTyping)),
    React.createElement('Button', { key: 'button', onPress: handleTyping, title: 'Type' }),
  ]);
}

describe('useTypingIndicator', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should initialize with isUserTyping as false', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const json = tree!.toJSON();
    expect(json?.children?.[0]?.children?.[0]).toBe('false');
  });

  it('should set isUserTyping to true when handleTyping is called', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const button = instance.findByProps({ title: 'Type' });
    
    ReactTestRenderer.act(() => {
      button.props.onPress();
    });

    const updatedJson = tree!.toJSON();
    expect(updatedJson?.children?.[0]?.children?.[0]).toBe('true');
  });

  it('should set isUserTyping to false after delay', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const button = instance.findByProps({ title: 'Type' });
    
    ReactTestRenderer.act(() => {
      button.props.onPress();
    });

    expect(tree!.toJSON()?.children?.[0]?.children?.[0]).toBe('true');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(tree!.toJSON()?.children?.[0]?.children?.[0]).toBe('false');
  });

  it('should reset timer on multiple handleTyping calls', () => {
    let tree: ReactTestRenderer.ReactTestRenderer;
    ReactTestRenderer.act(() => {
      tree = ReactTestRenderer.create(React.createElement(TestComponent));
    });
    const instance = tree!.root;
    
    const button = instance.findByProps({ title: 'Type' });
    
    ReactTestRenderer.act(() => {
      button.props.onPress();
    });
    
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(400);
    });
    
    ReactTestRenderer.act(() => {
      button.props.onPress();
    });
    
    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(400);
    });

    expect(tree!.toJSON()?.children?.[0]?.children?.[0]).toBe('true');

    ReactTestRenderer.act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(tree!.toJSON()?.children?.[0]?.children?.[0]).toBe('false');
  });
});


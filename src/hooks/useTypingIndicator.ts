import { useCallback, useEffect, useRef, useState } from 'react';
import { APP_CONSTANTS } from '../constants/app';

export function useTypingIndicator() {
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTyping = useCallback(() => {
    setIsUserTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, APP_CONSTANTS.SEARCH.TYPING_INDICATOR_DELAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isUserTyping,
    handleTyping,
  };
}


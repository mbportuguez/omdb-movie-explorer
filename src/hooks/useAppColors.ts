import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getAppColors } from '../constants/app';

export function useAppColors() {
  const { isDark } = useTheme();
  return useMemo(() => getAppColors(isDark), [isDark]);
}


'use client';

import * as React from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent } = useThemeStore();
  const isFirstMount = React.useRef(true);

  React.useEffect(() => {
    const root = document.documentElement;

    const applyTheme = () => {
      root.setAttribute('data-theme', mode);
      root.setAttribute('data-accent', accent);
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (isFirstMount.current) {
      // On first mount, apply theme without any transition animation
      isFirstMount.current = false;
      applyTheme();
      return;
    }

    // User toggled theme
    if (
      typeof document !== 'undefined' &&
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      // Use native View Transitions API (Chrome 111+, Edge 111+, Safari 18+)
      // This performs a hardware-accelerated GPU screen cross-fade without DOM element thrashing
      (document as any).startViewTransition(() => {
        applyTheme();
      });
    } else {
      // Fallback for browsers without View Transitions: lightweight targeted CSS transition
      root.classList.add('theme-transitioning');
      applyTheme();
      const timer = setTimeout(() => {
        root.classList.remove('theme-transitioning');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [mode, accent]);

  return <>{children}</>;
}

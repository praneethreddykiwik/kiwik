'use client';

import * as React from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent } = useThemeStore();

  React.useEffect(() => {
    const root = document.documentElement;

    // Use native View Transitions API if available (Chrome 111+, Edge 111+)
    const applyTheme = () => {
      root.setAttribute('data-theme', mode);
      root.setAttribute('data-accent', accent);
      if (mode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    // Add the transitioning class to enable smooth CSS transitions
    root.classList.add('theme-transitioning');

    if ('startViewTransition' in document && typeof (document as any).startViewTransition === 'function') {
      // Use View Transitions API for browsers that support it
      (document as any).startViewTransition(() => {
        applyTheme();
      });
    } else {
      // Fallback: apply immediately — the CSS transition handles the animation
      applyTheme();
    }

    // Remove the guard class after the transition completes (350ms + small buffer)
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 400);

    return () => clearTimeout(timer);
  }, [mode, accent]);

  return <>{children}</>;
}

'use client';

import * as React from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode, accent } = useThemeStore();
  // Track whether this is the first mount — we skip the transition on initial
  // render since the blocking inline script in layout.tsx already set the correct
  // theme before first paint, so we don't want a spurious cross-fade on load.
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
      // On first mount, just ensure the DOM reflects the store state.
      // The blocking script already handled the initial paint — no animation needed.
      isFirstMount.current = false;
      applyTheme();
      return;
    }

    // Subsequent changes (user toggling) — animate smoothly.
    root.classList.add('theme-transitioning');

    if (
      'startViewTransition' in document &&
      typeof (document as any).startViewTransition === 'function'
    ) {
      // Use the native View Transitions API (Chrome/Edge 111+)
      (document as any).startViewTransition(() => {
        applyTheme();
      });
    } else {
      // Fallback: the CSS .theme-transitioning rule handles the animation
      applyTheme();
    }

    // Remove guard class after transition completes (350ms + small buffer)
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 420);

    return () => clearTimeout(timer);
  }, [mode, accent]);

  return <>{children}</>;
}

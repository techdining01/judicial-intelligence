'use client';

import { useEffect } from 'react';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Apply saved theme on initial load
    const savedSettings = localStorage.getItem('appearance-settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      applyTheme(parsed.theme);
    } else {
      // Check system preference if no saved settings
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    
    switch (theme) {
      case 'dark':
        root.classList.add('dark');
        break;
      case 'light':
        root.classList.remove('dark');
        break;
      case 'auto':
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
        break;
    }
  };

  return <>{children}</>;
}

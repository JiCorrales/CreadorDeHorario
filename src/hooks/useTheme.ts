import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      // Validate saved theme
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system') {
        return savedTheme;
      }
      return 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isSystemDark = mediaQuery.matches;
      const shouldBeDark = theme === 'dark' || (theme === 'system' && isSystemDark);

      // console.log(`[useTheme] Applying theme: ${theme}, System Dark: ${isSystemDark}, Result: ${shouldBeDark ? 'dark' : 'light'}`);

      if (shouldBeDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Save to local storage
    if (theme === 'system') {
        localStorage.removeItem('theme');
    } else {
        localStorage.setItem('theme', theme);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        let newTheme: Theme;

        if (prev === 'system') {
            newTheme = isSystemDark ? 'light' : 'dark';
        } else {
            newTheme = prev === 'dark' ? 'light' : 'dark';
        }
        return newTheme;
    });
  };

  return { theme, setTheme, toggleTheme };
}

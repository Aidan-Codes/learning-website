const THEME_KEY = 'powershell-learning-theme';

export type Theme = 'light' | 'dark';

export const getTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_KEY) as Theme;
    if (stored) return stored;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch {
    return 'light';
  }
};

export const setTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (error) {
    console.error('Failed to save theme:', error);
  }
};

export const initTheme = (): void => {
  const theme = getTheme();
  setTheme(theme);
};

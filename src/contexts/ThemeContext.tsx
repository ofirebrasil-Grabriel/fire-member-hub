import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem('fire-theme');
    return (stored as Theme) || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('fire-theme', theme);
    
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-dark', 'theme-light', 'theme-high-contrast');
    
    // Apply theme class
    root.classList.add(`theme-${theme}`);
    
    // Apply CSS variables based on theme
    if (theme === 'light') {
      root.style.setProperty('--background', '0 0% 98%');
      root.style.setProperty('--foreground', '220 30% 15%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '220 30% 15%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '220 30% 15%');
      root.style.setProperty('--secondary', '220 14% 96%');
      root.style.setProperty('--secondary-foreground', '220 30% 15%');
      root.style.setProperty('--muted', '220 14% 90%');
      root.style.setProperty('--muted-foreground', '220 12% 45%');
      root.style.setProperty('--border', '220 14% 85%');
      root.style.setProperty('--input', '220 14% 90%');
      root.style.setProperty('--surface', '220 14% 96%');
      root.style.setProperty('--surface-hover', '220 14% 92%');
      root.style.setProperty('--sidebar-background', '0 0% 98%');
      root.style.setProperty('--sidebar-foreground', '220 30% 15%');
      root.style.setProperty('--sidebar-border', '220 14% 85%');
      root.style.setProperty('--sidebar-accent', '220 14% 96%');
      root.style.setProperty('--sidebar-accent-foreground', '220 30% 15%');
    } else if (theme === 'high-contrast') {
      root.style.setProperty('--background', '0 0% 0%');
      root.style.setProperty('--foreground', '0 0% 100%');
      root.style.setProperty('--card', '0 0% 5%');
      root.style.setProperty('--card-foreground', '0 0% 100%');
      root.style.setProperty('--popover', '0 0% 5%');
      root.style.setProperty('--popover-foreground', '0 0% 100%');
      root.style.setProperty('--secondary', '0 0% 15%');
      root.style.setProperty('--secondary-foreground', '0 0% 100%');
      root.style.setProperty('--muted', '0 0% 20%');
      root.style.setProperty('--muted-foreground', '0 0% 70%');
      root.style.setProperty('--border', '0 0% 30%');
      root.style.setProperty('--input', '0 0% 15%');
      root.style.setProperty('--surface', '0 0% 10%');
      root.style.setProperty('--surface-hover', '0 0% 15%');
      root.style.setProperty('--sidebar-background', '0 0% 0%');
      root.style.setProperty('--sidebar-foreground', '0 0% 100%');
      root.style.setProperty('--sidebar-border', '0 0% 30%');
      root.style.setProperty('--sidebar-accent', '0 0% 15%');
      root.style.setProperty('--sidebar-accent-foreground', '0 0% 100%');
    } else {
      // Dark theme (default)
      root.style.setProperty('--background', '215 71% 8%');
      root.style.setProperty('--foreground', '240 19% 97%');
      root.style.setProperty('--card', '210 24% 20%');
      root.style.setProperty('--card-foreground', '240 19% 97%');
      root.style.setProperty('--popover', '210 24% 15%');
      root.style.setProperty('--popover-foreground', '240 19% 97%');
      root.style.setProperty('--secondary', '210 24% 25%');
      root.style.setProperty('--secondary-foreground', '240 19% 97%');
      root.style.setProperty('--muted', '210 20% 25%');
      root.style.setProperty('--muted-foreground', '220 12% 75%');
      root.style.setProperty('--border', '210 20% 30%');
      root.style.setProperty('--input', '210 20% 25%');
      root.style.setProperty('--surface', '210 24% 20%');
      root.style.setProperty('--surface-hover', '210 24% 25%');
      root.style.setProperty('--sidebar-background', '215 71% 6%');
      root.style.setProperty('--sidebar-foreground', '240 19% 97%');
      root.style.setProperty('--sidebar-border', '210 20% 25%');
      root.style.setProperty('--sidebar-accent', '210 24% 20%');
      root.style.setProperty('--sidebar-accent-foreground', '240 19% 97%');
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

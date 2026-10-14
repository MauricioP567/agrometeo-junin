import {
  createContext, useContext, useEffect, useMemo, useCallback, useState,
} from 'react';

const SettingsContext = createContext(null);
const STORAGE_KEY = 'agrometeo:settings';

export const DEFAULT_STATION = {
  id: 3691175,
  name: 'Huancayo',
  latitude: -12.0651,
  longitude: -75.2049,
  admin1: 'Junín',
  country: 'Perú',
};

// ← Agregamos theme:'dark' al estado inicial
const defaults = {
  station: DEFAULT_STATION,
  unit: 'C',
  favorites: [DEFAULT_STATION],
  theme: 'dark',
};

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadInitial);

  // Aplicamos el tema al <html> para que las CSS variables funcionen global
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const setStation = useCallback((station) => {
    setSettings((s) => ({ ...s, station }));
  }, []);

  const setUnit = useCallback((unit) => {
    setSettings((s) => ({ ...s, unit }));
  }, []);

  const setTheme = useCallback((theme) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((s) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const toggleFavorite = useCallback((station) => {
    setSettings((s) => {
      const exists = s.favorites.some((f) => f.id === station.id);
      return {
        ...s,
        favorites: exists
          ? s.favorites.filter((f) => f.id !== station.id)
          : [...s.favorites, station],
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      setStation, setUnit, setTheme, toggleTheme, toggleFavorite,
    }),
    [settings, setStation, setUnit, setTheme, toggleTheme, toggleFavorite]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings debe usarse dentro de <SettingsProvider>');
  return ctx;
}
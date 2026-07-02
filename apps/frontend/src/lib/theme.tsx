import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';

export type ColorScheme = 'light' | 'dark' | 'auto';

const STORAGE_KEY = 'color-scheme';

interface ThemeContextValue {
  scheme: ColorScheme;
  /** 'auto' resolved to the effective scheme via prefers-color-scheme. */
  resolved: 'light' | 'dark';
  setScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemScheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStored(): ColorScheme {
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto';
}

/** Toggles .dark on <html> synchronously — matters for View Transitions (see ThemeToggle). */
function applyScheme(resolved: 'light' | 'dark') {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>(readStored);
  const [system, setSystem] = useState<'light' | 'dark'>(systemScheme);

  const resolved = scheme === 'auto' ? system : scheme;

  // useLayoutEffect runs synchronously during commit: flushSync(setScheme) inside
  // startViewTransition swaps the class before the new frame is snapshotted, and on
  // first render the class lands before paint (no flash of the light theme).
  useLayoutEffect(() => applyScheme(resolved), [resolved]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setSystem(systemScheme());
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setScheme = useCallback((next: ColorScheme) => {
    localStorage.setItem(STORAGE_KEY, next);
    setSchemeState(next);
  }, []);

  const value = useMemo(() => ({ scheme, resolved, setScheme }), [scheme, resolved, setScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

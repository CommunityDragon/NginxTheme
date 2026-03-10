import { createContext, useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type State = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: State = {
  theme: import.meta.env.VITE_THEME_DEFAULT,
  setTheme: () => null,
};

export const ThemeContext = createContext<State>(initialState);

export const ThemeProvider: React.FC<Props> = ({
  children,
  defaultTheme = import.meta.env.VITE_THEME_DEFAULT,
  storageKey = import.meta.env.VITE_THEME_STORAGE_KEY,
  ...props
}) => {
  // Initialize from the pre‑hydration value if available (client‑side only)
  const [theme, setTheme] = useState<Theme>((): Theme => {
    if (typeof window !== "undefined" && window.__INITIAL_THEME__) {
      return window.__INITIAL_THEME__;
    }
    return defaultTheme;
  });

  // Sync the DOM class and localStorage whenever the theme state changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both possible classes
    root.classList.remove("light", "dark");

    // Determine which class to add
    let appliedTheme = theme;
    if (theme === "system") {
      appliedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    root.classList.add(appliedTheme);

    // Persist the raw theme value to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Optional: listen for system theme changes if theme is "system"
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      // Re-run the effect by forcing a state update (theme is still "system")
      setTheme((prev) => prev); // this re-triggers the effect above
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Update state (will trigger the effect that updates class and localStorage)
      setTheme(newTheme);
    },
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

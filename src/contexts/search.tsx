import type { SearchMode } from "@typings/search";
import type React from "react";
import { createContext, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  debounceMs?: number;
  initialMode?: SearchMode;
}

export interface ContextValue {
  query: string;
  setQuery: (query: string) => void;
  mode: SearchMode;
  setMode: (mode: SearchMode) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const SearchContext = createContext<ContextValue | undefined>(undefined);

export const SearchProvider: React.FC<Props> = ({
  children,
  debounceMs = 500,
  initialMode = "local",
}) => {
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [externalLoading, setExternalLoading] = useState(false); // renamed for clarity
  const [debouncing, setDebouncing] = useState(false);
  const [mode, setMode] = useState<SearchMode>(initialMode);
  const [effectiveLoading, setEffectiveLoading] = useState(false); // new internal state

  // Debounce query → search
  useEffect(() => {
    setDebouncing(true);
    const handler = setTimeout(() => {
      setSearch(query);
      setDebouncing(false);
    }, debounceMs);
    return () => {
      clearTimeout(handler);
      setDebouncing(false);
    };
  }, [query, debounceMs]);

  // Smoothly combine debouncing and external loading to avoid flicker
  useEffect(() => {
    if (debouncing || externalLoading) {
      setEffectiveLoading(true);
    } else {
      // Small delay before turning off to allow external loading to start
      const timeout = setTimeout(() => {
        setEffectiveLoading(false);
      }, 50); // 50ms is usually enough to catch subsequent API calls
      return () => clearTimeout(timeout);
    }
  }, [debouncing, externalLoading]);

  const value = {
    query: search,
    loading: effectiveLoading, // use the smooth state
    mode,
    setQuery,
    setLoading: setExternalLoading, // expose setter for external loading
    setMode,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

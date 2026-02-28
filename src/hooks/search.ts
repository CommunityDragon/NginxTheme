import { type ContextValue, SearchContext } from "@contexts/search";
import { useContext } from "react";

export const useSearch = (): ContextValue => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

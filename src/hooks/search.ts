import { useContext } from "react";
import { type ContextValue, SearchContext } from "@/contexts/search";

export const useSearch = (): ContextValue => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

import { useContext } from "react";
import { type ContextValue, IndexContext } from "@/contexts/nginx-index";

export const useIndex = (): ContextValue => {
  const context = useContext(IndexContext);
  if (!context) {
    throw new Error("useIndex must be used within an IndexProvider");
  }
  return context;
};

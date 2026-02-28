import type { FileEntry } from "@typings/files";
import type React from "react";
import { createContext } from "react";

interface Props {
  children: React.ReactNode;
  path: string;
  files: FileEntry[];
}

export interface ContextValue {
  path: string;
  files: FileEntry[];
}

export const IndexContext = createContext<ContextValue | undefined>(undefined);

export const IndexProvider: React.FC<Props> = ({ children, path, files }) => (
  <IndexContext.Provider value={{ path, files }}>
    {children}
  </IndexContext.Provider>
);

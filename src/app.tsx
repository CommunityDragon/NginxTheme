import type { FunctionalComponent } from 'preact';
import type { FileEntry } from '@typings/files';

import { FileTable } from '@components/file-table';

import './style.css';
import { ThemeProvider } from '@components/theme-provider';
import { NavBar } from '@components/nav-bar';

interface AppProps {
  currentPath: string;
  files: FileEntry[];
}

export const App: FunctionalComponent<AppProps> = ({ currentPath, files }) => (
  <ThemeProvider storageKey="ui-theme">
    <NavBar />
    <div className="relative">
      <div className="flex flex-col gap-4 max-w-4xl m-auto p-4 pb-12">
        {currentPath && (
          <div className="current-path">
            <strong>Current directory:</strong> {currentPath}
          </div>
        )}

        <FileTable files={files} />
      </div>
    </div>
  </ThemeProvider>
);
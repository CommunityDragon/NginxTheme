import type { FunctionalComponent } from 'preact';
import type { FileEntry } from '@typings/files';

import { FileTable } from '@components/file-table';

import './style.css';
import { ThemeProvider } from '@components/theme-provider';
import { NavBar } from '@components/nav-bar';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { PathBreadcrumbs } from '@components/path-breadcrumbs';

interface AppProps {
  path: string;
  files: FileEntry[];
}

export const App: FunctionalComponent<AppProps> = ({ path, files }) => (
  <ThemeProvider storageKey="ui-theme">
    <NavBar />
    <div className="relative">
      <div className="flex flex-col gap-4 max-w-5xl m-auto p-4 pb-12">
        <Card>
          <CardHeader>
            <PathBreadcrumbs path={path ?? '/'} />
          </CardHeader>
          <CardContent>
            <FileTable files={files} />
          </CardContent>
        </Card>
      </div>
    </div>
  </ThemeProvider>
);
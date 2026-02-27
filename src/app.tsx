import type { FunctionalComponent } from 'preact';
import type { FileEntry } from '@typings/files';

import { FileTable } from '@components/file-table';

import './style.css';
import whiteLogo from '@assets/logo-white.png';
import logo from '@assets/logo.png';
import { ThemeProvider } from '@components/theme-provider';
import { NavBar } from '@components/nav-bar';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { PathBreadcrumbs } from '@components/path-breadcrumbs';
import { Separator } from '@components/ui/separator';

interface AppProps {
  path: string;
  files: FileEntry[];
}

export const App: FunctionalComponent<AppProps> = ({ path, files }) => (
  <ThemeProvider storageKey="ui-theme">
    <NavBar />
    <div>
      <div class="relative py-8">
        <div className="flex gap-4 w-min m-auto items-center align-middle">
          <div className="grow">
            <h1 className="scroll-m-20 text-right text-4xl font-extrabold tracking-tight text-nowrap">
              Hoarding data from <br />Riot Games since 2017
            </h1>
          </div>
          <div>
              <picture className="h-auto w-20 block">
                  <source srcset={whiteLogo} media="(prefers-color-scheme: dark)" />
                  <img alt="CommunityDragon" src={logo} height="128" width="128" />
              </picture>
          </div>
        </div>
      </div>
    </div>
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
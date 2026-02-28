import { Hero } from "@components/global/hero";
import { Main } from "@components/global/main";
import { NavBar } from "@components/global/navbar";
import { Card, CardContent } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { SearchProvider } from "@contexts/search";
import { ThemeProvider } from "@contexts/theme";
import type { FileEntry } from "@typings/files";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import type { FunctionalComponent } from "preact";

import "./style.css";
import { FileExplorer } from "@components/features/file-explorer/file-explorer";
import { IndexProvider } from "@contexts/nginx-index";

interface AppProps {
  path: string;
  files: FileEntry[];
}

export const App: FunctionalComponent<AppProps> = ({ path, files }) => (
  <IndexProvider path={path} files={files}>
    <ThemeProvider storageKey="ui-theme">
      <SearchProvider debounceMs={500} initialMode="local">
        <NavBar />
        <Hero />
        <Main path={path}>
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="explorer">
                <AppWindowIcon />
                File Explorer
              </TabsTrigger>
              <TabsTrigger value="binviewer">
                <CodeIcon />
                .BIN Viewer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="explorer">
              <Card className="py-2">
                <CardContent className="px-2">
                  <FileExplorer path={path} files={files} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="binviewer">
              <div className="p-4">
                <h2 className="text-xl font-bold">.BIN Viewer</h2>
                <p className="text-muted-foreground">
                  View and analyze .BIN files from League of Legends.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </Main>
      </SearchProvider>
    </ThemeProvider>
  </IndexProvider>
);

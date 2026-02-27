import heroImage from "@assets/hero.jpg";
import { FileTable } from "@components/features/file-explorer/file-table";
import { Hero } from "@components/global/hero";
import { NavBar } from "@components/global/navbar";
import { ThemeProvider } from "@components/providers/theme-provider";
import { Card, CardContent } from "@components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import type { FileEntry } from "@typings/files";
import { AppWindowIcon, CodeIcon } from "lucide-react";
import type { FunctionalComponent } from "preact";

import "./style.css";
import { Main } from "@components/global/main";

interface AppProps {
  path: string;
  files: FileEntry[];
}

export const App: FunctionalComponent<AppProps> = ({ path, files }) => {
  console.log(heroImage);
  return (
    <ThemeProvider storageKey="ui-theme">
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
                <FileTable files={files} />
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
    </ThemeProvider>
  );
};

import { AppWindowIcon, CodeIcon } from "lucide-react";
import React, { Suspense } from "react";
import { FileExplorer } from "@/components/features/file-explorer/file-explorer";
import { Hero } from "@/components/global/hero";
import { Main } from "@/components/global/main";
import { NavBar } from "@/components/global/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndexProvider } from "@/contexts/nginx-index";
import { SearchProvider } from "@/contexts/search";
import { SettingsProvider } from "@/contexts/settings";
import { ThemeProvider } from "@/contexts/theme";
import { parseTemplate } from "@/lib/client/nginx";

const SettingsMenu = React.lazy(
  () => import("./components/global/settings-menu"),
);

const App: React.FC = () => {
  const { path, files } = parseTemplate();

  return (
    <IndexProvider path={path} files={files}>
      <SettingsProvider>
        <ThemeProvider storageKey={import.meta.env.VITE_THEME_STORAGE_KEY}>
          <SearchProvider debounceMs={500} initialMode="local">
            <Suspense>
              <SettingsMenu />
            </Suspense>
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
                      <FileExplorer />
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
      </SettingsProvider>
    </IndexProvider>
  );
};

export default App;

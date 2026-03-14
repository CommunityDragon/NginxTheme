import { AppWindowIcon, CodeIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FileExplorer } from "@/components/features/file-explorer";
import { Hero } from "@/components/global/hero";
import { Main } from "@/components/global/main";
import { NavBar } from "@/components/global/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LangProvider } from "@/contexts/lang";
import { IndexProvider } from "@/contexts/nginx-index";
import { SearchProvider } from "@/contexts/search";
import { SettingsProvider } from "@/contexts/settings";
import { ThemeProvider } from "@/contexts/theme";
import { parseTemplate } from "@/lib/client/nginx";
import { Settings } from "./components/global/settings";

const AppTabs: React.FC<{ path: string }> = ({ path }) => {
  const { t } = useTranslation();

  return (
    <Main path={path}>
      <Tabs defaultValue="preview">
        <TabsList>
          <TabsTrigger value="explorer">
            <AppWindowIcon />
            {t("tabs.fileExplorer")}
          </TabsTrigger>
          <TabsTrigger value="binviewer">
            <CodeIcon />
            {t("tabs.binViewer")}
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
            <h2 className="text-xl font-bold">{t("tabs.binViewer")}</h2>
            <p className="text-muted-foreground">
              {t("binViewer.description")}
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Main>
  );
};

const App: React.FC = () => {
  const { path, files } = parseTemplate();

  return (
    <LangProvider>
      <IndexProvider path={path} files={files}>
        <SettingsProvider>
          <ThemeProvider storageKey={import.meta.env.VITE_THEME_STORAGE_KEY}>
            <SearchProvider debounceMs={500} initialMode="local">
              <Settings />
              <NavBar />
              <Hero />
              <AppTabs path={path} />
            </SearchProvider>
          </ThemeProvider>
        </SettingsProvider>
      </IndexProvider>
    </LangProvider>
  );
};

export default App;

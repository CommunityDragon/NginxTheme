import { Content } from "@/components/features/content";
import { Hero } from "@/components/global/hero";
import { NavBar } from "@/components/global/navbar";
import { Settings } from "@/components/global/settings";
import { LangProvider } from "@/contexts/lang";
import { IndexProvider } from "@/contexts/nginx";
import { SearchProvider } from "@/contexts/search";
import { SettingsProvider } from "@/contexts/settings";
import { ThemeProvider } from "@/contexts/theme";
import { parseTemplate } from "@/lib/client/nginx";

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
              <Content />
            </SearchProvider>
          </ThemeProvider>
        </SettingsProvider>
      </IndexProvider>
    </LangProvider>
  );
};

export default App;

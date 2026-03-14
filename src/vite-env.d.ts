/** biome-ignore-all lint/correctness/noUnusedVariables: vite */

declare type Theme = "light" | "dark" | "system";

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_THEME_DEFAULT: Theme;
  readonly VITE_THEME_STORAGE_KEY: string;
  readonly VITE_LOCALE_STORAGE_KEY: string;
  readonly VITE_SETTINGS_STORAGE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __INITIAL_THEME__?: Theme;
  __INITIAL_SETTINGS__?: unknown;
  __INITIAL_LOCALE__?: string;
}

declare const __THEME_DEFAULT__: Theme;
declare const __THEME_STORAGE_KEY__: string;
declare const __LOCALE_OPTIONS__: string[];
declare const __LOCALE_STORAGE_KEY__: string;
declare const __SETTINGS_STORAGE_KEY__: string;
declare const __RENDER_SSG__: string;

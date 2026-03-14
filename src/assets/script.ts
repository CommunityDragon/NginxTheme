(() => {
  /**
   * Resolves the effective display theme.
   * When the stored preference is "system", defers to the OS color scheme.
   */
  const resolveTheme = (preference: Theme): string =>
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;

  /**
   * Reads the stored theme preference, falling back to the build-time default.
   */
  const loadTheme = (): Theme =>
    (localStorage.getItem(__THEME_STORAGE_KEY__) ?? __THEME_DEFAULT__) as Theme;

  /**
   * Applies the resolved theme class to the document root
   * and exposes the raw preference (not the resolved value) on `window`.
   */
  const applyTheme = (preference: Theme): void => {
    document.documentElement.classList.add(resolveTheme(preference));
    window.__INITIAL_THEME__ = preference;
  };

  /**
   * Detects the most appropriate locale to use, in priority order:
   *   1. Previously stored user preference (if still valid)
   *   2. Exact browser locale match  (e.g. "en-US" → "en-US")
   *   3. Base locale match         (e.g. "nl-NL" → "nl")
   *   4. Fallback: "en"
   */
  const resolveLocale = (
    stored: string | null,
    supported: string[],
  ): string => {
    if (stored && supported.includes(stored)) return stored;

    try {
      // @ts-expect-error-next-line — navigator.userLocale is IE-only but harmless
      const browserLocale = navigator.language || navigator.userLanguage;
      const baseLocale = browserLocale.split("-")[0];

      return (
        supported.find((l) => l === browserLocale || l === baseLocale) ?? "en"
      );
    } catch {
      return "en";
    }
  };

  /**
   * Reads and resolves the stored locale preference against supported locales.
   */
  const loadLocale = (): string =>
    resolveLocale(
      localStorage.getItem(__LOCALE_STORAGE_KEY__),
      __LOCALE_OPTIONS__,
    );

  /**
   * Applies the resolved locale to the document root,
   * persists it to localStorage, and exposes it on `window`.
   */
  const applyLocale = (locale: string): void => {
    localStorage.setItem(__LOCALE_STORAGE_KEY__, locale);
    document.documentElement.lang = locale;
    window.__INITIAL_LOCALE__ = locale;
  };

  /**
   * Reads and deserializes the stored settings object, or returns null if absent.
   */
  const loadSettings = (): unknown =>
    JSON.parse(localStorage.getItem(__SETTINGS_STORAGE_KEY__) ?? "null");

  /**
   * Exposes the deserialize`d settings object on `window` for use during hydration.
   */
  const applySettings = (settings: unknown): void => {
    window.__INITIAL_SETTINGS__ = settings;
  };

  /**
   * Last-resort fallback applied when anything above throws.
   * Derives theme from the OS preference and defaults locale to "en".
   */
  const applyFallback = (): void => {
    applyTheme("system");
    applyLocale("en");
    applySettings(null);
  };

  try {
    applyTheme(loadTheme());
    applyLocale(loadLocale());
    applySettings(loadSettings());
  } catch {
    applyFallback();
  }
})();

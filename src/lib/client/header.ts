/**
 * The header script to load
 * @param locales
 * @returns
 */
export const headerScript = (locales: string[]): string => /* js */ `
(function() {
  try {
    var settingsStorageKey = '${import.meta.env.VITE_SETTINGS_STORAGE_KEY}';
    var themeStorageKey = '${import.meta.env.VITE_THEME_STORAGE_KEY}';
    var themeDefault = '${import.meta.env.VITE_THEME_DEFAULT}';
    var languageStorageKey = '${import.meta.env.VITE_LOCALE_STORAGE_KEY}';
    var availableLanguages = ${JSON.stringify(locales)};

    var storedSettings = localStorage.getItem(settingsStorageKey) ?? "null";
    var storedTheme = localStorage.getItem(themeStorageKey);
    var storedLanguage = localStorage.getItem(languageStorageKey);
    var theme = storedTheme || themeDefault;
    var root = document.documentElement;
    var appliedTheme = theme;

    if (theme === 'system') {
      appliedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Determine language to use
    var finalLanguage = 'en';
    try {
      // If language is already stored, use it
      if (storedLanguage && availableLanguages.indexOf(storedLanguage) !== -1) {
        finalLanguage = storedLanguage;
      } else {
        // Try to detect browser language
        var browserLanguage = navigator.language || navigator.userLanguage;

        // Try exact match first (e.g., 'en-US' if 'en-US' exists)
        if (availableLanguages.indexOf(browserLanguage) !== -1) {
          finalLanguage = browserLanguage;
        } else {
          // Try partial match (e.g., 'nl-NL' -> 'nl')
          var languageBase = browserLanguage.split('-')[0];
          if (availableLanguages.indexOf(languageBase) !== -1) {
            finalLanguage = languageBase;
          }
        }
      }
    } catch (langError) {
      finalLanguage = 'en';
    }

    // Apply language settings
    localStorage.setItem(languageStorageKey, finalLanguage);
    root.lang = finalLanguage;

    root.classList.add(appliedTheme);
    window.__INITIAL_THEME__ = theme;
    window.__INITIAL_LOCALE__ = finalLanguage;
    var settings = JSON.parse(storedSettings);
    window.__INITIAL_SETTINGS__ = settings;
  } catch (e) {
    var fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.add(fallback);
    document.documentElement.lang = 'en';
    window.__INITIAL_THEME__ = 'system';
    window.__INITIAL_LOCALE__ = 'en';
    window.__INITIAL_SETTINGS__ = null;
  }
})();
`;

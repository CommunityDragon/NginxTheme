
(function() {
    try {
        const storageKey = 'ui-theme';
        const defaultTheme = 'system';

        const storedTheme = localStorage.getItem(storageKey);
        let theme = storedTheme || defaultTheme;

        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
    } catch (e) {
        const fallback = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.add(fallback);
    }
})();
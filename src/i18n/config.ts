import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import de from "./locales/de.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import ko from "./locales/ko.json";
import nl from "./locales/nl.json";
import zh from "./locales/zh.json";

const resources = {
  de: { translation: de },
  en: { translation: en },
  es: { translation: es },
  fr: { translation: fr },
  ko: { translation: ko },
  nl: { translation: nl },
  zh: { translation: zh },
};

i18next.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
  showSupportNotice: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;

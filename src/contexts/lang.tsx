import { useEffect } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18next from "@/i18n/config";

interface Props {
  children: React.ReactNode;
}

const LangSwitcher: React.FC<Props> = ({ children }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const cb = (lng: string) =>
      localStorage.setItem(import.meta.env.VITE_LOCALE_STORAGE_KEY, lng);
    i18n.on("languageChanged", cb);
    return () => i18n.off("languageChanged", cb);
  }, [i18n]);

  return children;
};

export const LangProvider: React.FC<Props> = ({ children }) => {
  if (typeof window !== "undefined" && window.__INITIAL_LOCALE__) {
    i18next.changeLanguage(window.__INITIAL_LOCALE__);
  }

  return (
    <I18nextProvider i18n={i18next}>
      <LangSwitcher>{children}</LangSwitcher>
    </I18nextProvider>
  );
};

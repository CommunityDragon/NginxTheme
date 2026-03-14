import i18next from "@/i18n/config";

export async function getLocales(): Promise<string[]> {
  const locales = Object.keys(i18next.store.data);
  return locales.length > 0 ? locales : ["en"];
}

import polyglotI18nProvider from "ra-i18n-polyglot";
import customEnglishMessages from "../i18n/en";
import customFrenchMessages from "../i18n/fr";

export const i18nProvider = (panels) => polyglotI18nProvider(locale => {
  let messages: any = customEnglishMessages;
  if (locale === 'fr') {
    messages = customFrenchMessages;
  }
  for (const panel of panels) {
    if (panel.i18n) {
      messages.resources[panel.name] = panel.i18n[locale];
    }
  }
  return messages;
}, 'en', 'fr');
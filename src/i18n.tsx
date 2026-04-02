import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { messagesByLocale, type Locale, type Messages } from "./locales";

const STORAGE_KEY = "portfolio-locale";

interface I18nContextValue {
  locale: Locale;
  messages: Messages;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem(STORAGE_KEY);
  if (storedLocale === "en" || storedLocale === "zh") {
    return storedLocale;
  }

  return window.navigator.language.toLowerCase().startsWith("zh")
    ? "zh"
    : "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      messages: messagesByLocale[locale],
      setLocale,
      toggleLocale: () => setLocale((prev) => (prev === "en" ? "zh" : "en")),
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useLocale() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useLocale must be used within an I18nProvider");
  }

  return context;
}

export function useMessages() {
  return useLocale().messages;
}

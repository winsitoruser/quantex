"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, localeNames, localeFlags, type Locale, type TranslationType } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationType;
  isRTL: boolean;
  localeNames: typeof localeNames;
  localeFlags: typeof localeFlags;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("qx-locale") as Locale | null;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("qx-locale", newLocale);
  };

  const isRTL = locale === "ar";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale, isRTL]);

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: translations[locale],
        isRTL,
        localeNames,
        localeFlags,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

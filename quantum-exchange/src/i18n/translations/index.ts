import en from "./en";
import id from "./id";
import ja from "./ja";
import zh from "./zh";
import ar from "./ar";
import type { TranslationType } from "./en";

export type Locale = "en" | "id" | "ja" | "zh" | "ar";

export const translations: Record<Locale, TranslationType> = {
  en,
  id,
  ja,
  zh,
  ar,
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  ja: "日本語",
  zh: "中文",
  ar: "العربية",
};

export const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  id: "🇮🇩",
  ja: "🇯🇵",
  zh: "🇨🇳",
  ar: "🇸🇦",
};

export type { TranslationType };

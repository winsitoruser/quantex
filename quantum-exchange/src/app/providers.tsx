"use client";

import { ReactNode } from "react";
import { LanguageProvider, CurrencyProvider } from "@/i18n";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </LanguageProvider>
  );
}

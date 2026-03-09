"use client";

import { ReactNode } from "react";
import { LanguageProvider, CurrencyProvider } from "@/i18n";
import { ThemeProvider } from "./ThemeContext";
import { ToastProvider } from "@/hooks/useToast";
import { Toaster } from "@/hooks/useToast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <ToastProvider>
            {children}
            <Toaster />
          </ToastProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

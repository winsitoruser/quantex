"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export type CurrencyCode = "USD" | "IDR";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  formatCurrency: (amountInUSD: number, opts?: { compact?: boolean; decimals?: number }) => string;
  currencySymbol: string;
  convertFromUSD: (amountInUSD: number) => number;
}

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  IDR: 15850,
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  USD: "$",
  IDR: "Rp",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const saved = localStorage.getItem("qx-currency") as CurrencyCode | null;
    if (saved && EXCHANGE_RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("qx-currency", newCurrency);
  };

  const convertFromUSD = useCallback(
    (amountInUSD: number) => amountInUSD * EXCHANGE_RATES[currency],
    [currency]
  );

  const formatCurrency = useCallback(
    (amountInUSD: number, opts?: { compact?: boolean; decimals?: number }) => {
      const converted = convertFromUSD(amountInUSD);
      const symbol = CURRENCY_SYMBOLS[currency];

      if (opts?.compact) {
        if (currency === "IDR") {
          if (converted >= 1e12) return `${symbol}${(converted / 1e12).toFixed(opts.decimals ?? 2)}T`;
          if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(opts.decimals ?? 2)}M`;
          if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(opts.decimals ?? 2)}Jt`;
          if (converted >= 1e3) return `${symbol}${(converted / 1e3).toFixed(opts.decimals ?? 2)}Rb`;
          return `${symbol}${converted.toFixed(opts.decimals ?? 0)}`;
        }
        if (converted >= 1e9) return `${symbol}${(converted / 1e9).toFixed(opts.decimals ?? 2)}B`;
        if (converted >= 1e6) return `${symbol}${(converted / 1e6).toFixed(opts.decimals ?? 2)}M`;
        if (converted >= 1e3) return `${symbol}${(converted / 1e3).toFixed(opts.decimals ?? 2)}K`;
        return `${symbol}${converted.toFixed(opts.decimals ?? 2)}`;
      }

      if (currency === "IDR") {
        return `${symbol}${converted.toLocaleString("id-ID", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`;
      }

      const decimals = opts?.decimals ?? (amountInUSD >= 1 ? 2 : amountInUSD >= 0.01 ? 4 : 6);
      return `${symbol}${converted.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    },
    [currency, convertFromUSD]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatCurrency,
        currencySymbol: CURRENCY_SYMBOLS[currency],
        convertFromUSD,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

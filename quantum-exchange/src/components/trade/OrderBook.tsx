"use client";

import { useMemo } from "react";
import { generateOrderBook } from "@/data/mockData";
import { useCurrency } from "@/i18n";

interface OrderBookProps {
  basePrice: number;
}

export default function OrderBook({ basePrice }: OrderBookProps) {
  const { formatCurrency, currency } = useCurrency();
  const { asks, bids } = useMemo(() => generateOrderBook(basePrice), [basePrice]);

  const maxTotal = Math.max(
    asks[asks.length - 1]?.total || 0,
    bids[bids.length - 1]?.total || 0
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground">Order Book</h3>
        <div className="flex items-center gap-1">
          <button className="px-2 py-0.5 text-[10px] font-medium rounded bg-accent/10 text-accent">
            0.01
          </button>
          <button className="px-2 py-0.5 text-[10px] font-medium rounded text-muted hover:text-foreground">
            0.1
          </button>
          <button className="px-2 py-0.5 text-[10px] font-medium rounded text-muted hover:text-foreground">
            1
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] font-medium text-muted uppercase tracking-wider">
        <span>Price ({currency === "USD" ? "USDT" : currency})</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (Sells) */}
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {asks.map((entry, i) => (
          <div
            key={`ask-${i}`}
            className="relative grid grid-cols-3 gap-2 px-3 py-[3px] text-xs hover:bg-card-hover cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-danger/8"
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            />
            <span className="relative text-danger font-mono">
              {formatCurrency(entry.price)}
            </span>
            <span className="relative text-right text-foreground font-mono">
              {entry.amount.toFixed(4)}
            </span>
            <span className="relative text-right text-muted font-mono">
              {entry.total.toFixed(4)}
            </span>
          </div>
        ))}
      </div>

      {/* Spread / Current Price */}
      <div className="px-3 py-2 border-y border-border bg-card/50">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-accent font-mono">
            {formatCurrency(basePrice)}
          </span>
          <span className="text-[10px] text-muted">
            ≈ {formatCurrency(basePrice)}
          </span>
        </div>
      </div>

      {/* Bids (Buys) */}
      <div className="flex-1 overflow-hidden">
        {bids.map((entry, i) => (
          <div
            key={`bid-${i}`}
            className="relative grid grid-cols-3 gap-2 px-3 py-[3px] text-xs hover:bg-card-hover cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-accent/8"
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            />
            <span className="relative text-accent font-mono">
              {formatCurrency(entry.price)}
            </span>
            <span className="relative text-right text-foreground font-mono">
              {entry.amount.toFixed(4)}
            </span>
            <span className="relative text-right text-muted font-mono">
              {entry.total.toFixed(4)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

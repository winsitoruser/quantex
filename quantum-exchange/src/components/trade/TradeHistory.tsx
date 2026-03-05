"use client";

import { useMemo } from "react";
import { generateTradeHistory } from "@/data/mockData";
import { useCurrency } from "@/i18n";

interface TradeHistoryProps {
  basePrice: number;
}

export default function TradeHistory({ basePrice }: TradeHistoryProps) {
  const { formatCurrency, currency } = useCurrency();
  const trades = useMemo(() => generateTradeHistory(basePrice), [basePrice]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground">Recent Trades</h3>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 gap-2 px-3 py-1.5 text-[10px] font-medium text-muted uppercase tracking-wider">
        <span>Price ({currency === "USD" ? "USDT" : currency})</span>
        <span className="text-right">Amount</span>
        <span className="text-right">Time</span>
      </div>

      {/* Trades */}
      <div className="flex-1 overflow-y-auto">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="grid grid-cols-3 gap-2 px-3 py-[3px] text-xs hover:bg-card-hover"
          >
            <span
              className={`font-mono ${
                trade.side === "buy" ? "text-accent" : "text-danger"
              }`}
            >
              {formatCurrency(trade.price)}
            </span>
            <span className="text-right text-foreground font-mono">
              {trade.amount.toFixed(4)}
            </span>
            <span className="text-right text-muted font-mono">{trade.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

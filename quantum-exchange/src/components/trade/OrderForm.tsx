"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/i18n";

interface OrderFormProps {
  basePrice: number;
  symbol: string;
}

const orderTypes = ["Limit", "Market", "Stop-Limit"];
const percentages = [25, 50, 75, 100];

export default function OrderForm({ basePrice, symbol }: OrderFormProps) {
  const { convertFromUSD, currencySymbol, currency } = useCurrency();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [orderType, setOrderType] = useState("Limit");
  const [price, setPrice] = useState(convertFromUSD(basePrice).toFixed(2));
  const [amount, setAmount] = useState("");
  const [selectedPercent, setSelectedPercent] = useState<number | null>(null);

  const base = symbol.split("/")[0];
  const quote = currency === "USD" ? (symbol.split("/")[1] || "USDT") : currency;

  const total = price && amount ? (parseFloat(price) * parseFloat(amount)).toFixed(2) : "0.00";

  return (
    <div className="flex flex-col">
      <div className="px-3 py-2 border-b border-border">
        <h3 className="text-xs font-semibold text-foreground">Place Order</h3>
      </div>

      <div className="p-3 space-y-3">
        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-background rounded-lg overflow-hidden">
          {/* BUY BUTTON */}
          <button
            onClick={() => setSide("buy")}
            className={cn(
              "py-2 text-sm font-semibold transition-all transform",
              // Tambahkan skew-x untuk memiringkan tombol
              side === "buy"
                ? "bg-accent text-background shadow-sm skew-x-[-10deg]"
                : "text-muted hover:text-foreground skew-x-[-10deg] hover:-skew-x-12"
            )}
          >
            {/* Counter-skew teks agar tetap lurus dan mudah dibaca */}
            <span className="inline-block skew-x-10">
              Buy
            </span>
          </button>

          {/* SELL BUTTON */}
          <button
            onClick={() => setSide("sell")}
            className={cn(
              "py-2 text-sm font-semibold transition-all transform",
              // Tambahkan skew-x untuk memiringkan tombol
              side === "sell"
                ? "bg-danger text-white shadow-sm skew-x-[-10deg]"
                : "text-muted hover:text-foreground skew-x-[-10deg] hover:-skew-x-12"
            )}
          >
            {/* Counter-skew teks agar tetap lurus */}
            <span className="inline-block skew-x-10">
              Sell
            </span>
          </button>
        </div>

        {/* Order Type */}
        <div className="flex items-center gap-1">
          {orderTypes.map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                orderType === type
                  ? "bg-card text-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Price Input */}
        {orderType !== "Market" && (
          <div>
            <label className="text-[10px] font-medium text-muted uppercase tracking-wider mb-1 block">
              Price
            </label>
            <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden focus-within:border-border-light transition-colors">
              <button
                onClick={() => setPrice((p) => (parseFloat(p) - basePrice * 0.001).toFixed(2))}
                className="px-3 py-2.5 text-muted hover:text-foreground hover:bg-card transition-colors text-sm font-bold"
              >
                −
              </button>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-center text-sm font-mono text-foreground outline-none py-2.5"
              />
              <button
                onClick={() => setPrice((p) => (parseFloat(p) + basePrice * 0.001).toFixed(2))}
                className="px-3 py-2.5 text-muted hover:text-foreground hover:bg-card transition-colors text-sm font-bold"
              >
                +
              </button>
              <span className="px-3 text-xs text-muted border-l border-border">{quote}</span>
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div>
          <label className="text-[10px] font-medium text-muted uppercase tracking-wider mb-1 block">
            Amount
          </label>
          <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden focus-within:border-border-light transition-colors">
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1 bg-transparent px-3 text-sm font-mono text-foreground outline-none py-2.5 placeholder:text-muted/50"
            />
            <span className="px-3 text-xs text-muted border-l border-border">{base}</span>
          </div>
        </div>

        {/* Percentage Buttons */}
        <div className="grid grid-cols-4 gap-1">
          {percentages.map((pct) => (
            <button
              key={pct}
              onClick={() => setSelectedPercent(pct)}
              className={cn(
                "py-1.5 text-xs font-medium rounded-md transition-colors",
                selectedPercent === pct
                  ? side === "buy"
                    ? "bg-accent/10 text-accent"
                    : "bg-danger/10 text-danger"
                  : "bg-background text-muted hover:text-foreground border border-border"
              )}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Total */}
        <div>
          <label className="text-[10px] font-medium text-muted uppercase tracking-wider mb-1 block">
            Total
          </label>
          <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden">
            <input
              type="text"
              value={total}
              readOnly
              className="flex-1 bg-transparent px-3 text-sm font-mono text-foreground outline-none py-2.5"
            />
            <span className="px-3 text-xs text-muted border-l border-border">{quote}</span>
          </div>
        </div>

        {/* Available Balance */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Available</span>
          <span className="font-mono">0.00 {side === "buy" ? quote : base}</span>
        </div>

        {/* Submit Button */}
        <button
          className={cn(
            "w-full py-3 text-sm font-bold transition-all -skew-x-12",
            side === "buy"
              ? "bg-accent hover:bg-accent-hover text-background"
              : "bg-danger hover:bg-danger-hover text-white"
          )}
        >
          {side === "buy" ? `Buy ${base}` : `Sell ${base}`}
        </button>
      </div>
    </div>
  );
}

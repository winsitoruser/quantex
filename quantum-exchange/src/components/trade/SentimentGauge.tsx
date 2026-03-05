"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Users, BarChart3, Flame } from "lucide-react";

interface SentimentGaugeProps {
  symbol: string;
}

// SVG Bull icon
function BullIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Horns */}
      <path
        d="M25 35C20 20 10 12 5 10C12 18 18 28 22 40"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M95 35C100 20 110 12 115 10C108 18 102 28 98 40"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Head */}
      <ellipse cx="60" cy="58" rx="32" ry="28" fill="currentColor" opacity="0.15" />
      <ellipse cx="60" cy="58" rx="32" ry="28" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Eyes */}
      <circle cx="45" cy="50" r="4" fill="currentColor" />
      <circle cx="75" cy="50" r="4" fill="currentColor" />
      <circle cx="46.5" cy="48.5" r="1.5" fill="white" />
      <circle cx="76.5" cy="48.5" r="1.5" fill="white" />
      {/* Nostrils */}
      <ellipse cx="50" cy="70" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="70" cy="70" rx="5" ry="4" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Nose ring */}
      <path
        d="M55 74C57 80 63 80 65 74"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ears */}
      <path d="M30 40C24 36 22 42 28 45" fill="currentColor" opacity="0.3" />
      <path d="M90 40C96 36 98 42 92 45" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

// SVG Bear icon
function BearIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Ears */}
      <circle cx="30" cy="25" r="14" fill="currentColor" opacity="0.15" />
      <circle cx="30" cy="25" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="30" cy="25" r="7" fill="currentColor" opacity="0.2" />
      <circle cx="90" cy="25" r="14" fill="currentColor" opacity="0.15" />
      <circle cx="90" cy="25" r="14" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <circle cx="90" cy="25" r="7" fill="currentColor" opacity="0.2" />
      {/* Head */}
      <ellipse cx="60" cy="58" rx="35" ry="32" fill="currentColor" opacity="0.15" />
      <ellipse cx="60" cy="58" rx="35" ry="32" stroke="currentColor" strokeWidth="2.5" fill="none" />
      {/* Eyes */}
      <circle cx="43" cy="50" r="4.5" fill="currentColor" />
      <circle cx="77" cy="50" r="4.5" fill="currentColor" />
      <circle cx="44.5" cy="48.5" r="1.5" fill="white" />
      <circle cx="78.5" cy="48.5" r="1.5" fill="white" />
      {/* Angry eyebrows */}
      <path d="M34 42L50 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 42L70 44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Muzzle */}
      <ellipse cx="60" cy="70" rx="14" ry="10" fill="currentColor" opacity="0.1" />
      <ellipse cx="60" cy="70" rx="14" ry="10" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Nose */}
      <ellipse cx="60" cy="66" rx="5" ry="3.5" fill="currentColor" />
      {/* Mouth */}
      <path d="M54 74C57 78 63 78 66 74" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// Generate realistic mock sentiment data
function generateSentiment(symbol: string) {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = ((seed * 7 + 13) % 40) + 30; // 30-70 range
  return base;
}

interface MetricData {
  label: string;
  buyPct: number;
  icon: React.ReactNode;
}

export default function SentimentGauge({ symbol }: SentimentGaugeProps) {
  const [buyPercent, setBuyPercent] = useState(50);

  // Simulate live sentiment changes
  useEffect(() => {
    const base = generateSentiment(symbol);
    setBuyPercent(base);

    const interval = setInterval(() => {
      setBuyPercent((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        return Math.min(85, Math.max(15, prev + delta));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [symbol]);

  const sellPercent = 100 - buyPercent;
  const isBullish = buyPercent >= 50;
  const strength = Math.abs(buyPercent - 50);

  const sentimentLabel = useMemo(() => {
    if (strength > 25) return isBullish ? "Strong Buy" : "Strong Sell";
    if (strength > 15) return isBullish ? "Buy" : "Sell";
    if (strength > 5) return isBullish ? "Lean Buy" : "Lean Sell";
    return "Neutral";
  }, [strength, isBullish]);

  const metrics: MetricData[] = useMemo(() => {
    const s = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return [
      { label: "Long/Short", buyPct: ((s * 3 + 7) % 30) + 40, icon: <BarChart3 className="h-3 w-3" /> },
      { label: "Volume", buyPct: ((s * 11 + 3) % 35) + 35, icon: <Flame className="h-3 w-3" /> },
      { label: "OI", buyPct: ((s * 5 + 17) % 30) + 38, icon: <Users className="h-3 w-3" /> },
    ];
  }, [symbol]);

  const fearGreedValue = Math.round(Math.min(buyPercent * 1.2, 100));

  return (
    <div className="px-3 py-2.5 space-y-3">
      {/* Bull vs Bear - Compact Row */}
      <div className="flex items-center gap-2">
        {/* Bull */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className={`shrink-0 ${isBullish ? "text-accent" : "text-muted/30"}`}>
            <BullIcon className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold font-mono leading-tight ${isBullish ? "text-accent" : "text-muted/40"}`}>
              {buyPercent.toFixed(1)}%
            </p>
            <p className="text-[9px] text-muted leading-tight">Buy</p>
          </div>
        </div>

        {/* Label */}
        <motion.div
          key={sentimentLabel}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="shrink-0"
        >
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
            isBullish
              ? "bg-accent/10 text-accent border-accent/20"
              : "bg-danger/10 text-danger border-danger/20"
          }`}>
            {sentimentLabel}
          </span>
        </motion.div>

        {/* Bear */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className={`text-sm font-bold font-mono leading-tight ${!isBullish ? "text-danger" : "text-muted/40"}`}>
              {sellPercent.toFixed(1)}%
            </p>
            <p className="text-[9px] text-muted leading-tight">Sell</p>
          </div>
          <div className={`shrink-0 ${!isBullish ? "text-danger" : "text-muted/30"}`}>
            <BearIcon className="h-7 w-7" />
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div>
        <div className="relative h-2 rounded-full bg-background overflow-hidden border border-border/50">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #00c26f, #00e68a)" }}
            animate={{ width: `${buyPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 rounded-full"
            style={{ background: "linear-gradient(270deg, #ef4444, #f87171)" }}
            animate={{ width: `${sellPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/20 -translate-x-1/2 z-10" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-accent flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" /> Long
          </span>
          <span className="text-[9px] text-danger flex items-center gap-0.5">
            Short <TrendingDown className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>

      {/* Breakdown Metrics - Compact */}
      <div className="space-y-1.5">
        {metrics.map((metric, idx) => {
          const mBull = metric.buyPct >= 50;
          return (
            <div key={metric.label} className="flex items-center gap-2">
              <span className="text-[10px] text-muted flex items-center gap-1 w-[70px] shrink-0">
                {metric.icon}
                {metric.label}
              </span>
              <div className="relative h-1.5 rounded-full bg-background overflow-hidden flex-1">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  animate={{ width: `${metric.buyPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
                <motion.div
                  className="absolute inset-y-0 right-0 rounded-full bg-danger"
                  animate={{ width: `${100 - metric.buyPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              </div>
              <span className={`text-[10px] font-mono font-medium w-[38px] text-right shrink-0 ${mBull ? "text-accent" : "text-danger"}`}>
                {metric.buyPct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Long/Short Positions - Inline */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded border border-accent/15 bg-accent/5 px-2 py-1.5 text-center">
          <BullIcon className="h-4 w-4 mx-auto text-accent mb-0.5" />
          <p className="text-xs font-bold text-accent font-mono">{buyPercent.toFixed(1)}%</p>
          <p className="text-[8px] text-accent/60 font-medium uppercase">Long</p>
        </div>
        <div className="rounded border border-danger/15 bg-danger/5 px-2 py-1.5 text-center">
          <BearIcon className="h-4 w-4 mx-auto text-danger mb-0.5" />
          <p className="text-xs font-bold text-danger font-mono">{sellPercent.toFixed(1)}%</p>
          <p className="text-[8px] text-danger/60 font-medium uppercase">Short</p>
        </div>
      </div>

      {/* Fear & Greed - Compact */}
      <div className="rounded border border-border bg-background/50 px-2.5 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-medium text-muted uppercase tracking-wider">Fear & Greed</span>
          <span className={`text-[11px] font-bold font-mono ${
            fearGreedValue > 60 ? "text-accent" : fearGreedValue < 40 ? "text-danger" : "text-yellow-500"
          }`}>
            {fearGreedValue}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: "linear-gradient(90deg, #ef4444, #f59e0b, #00c26f)" }}
        >
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-background shadow-md"
            animate={{ left: `calc(${fearGreedValue}% - 5px)` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[8px] text-danger/60">Fear</span>
          <span className="text-[8px] text-yellow-500/60">Neutral</span>
          <span className="text-[8px] text-accent/60">Greed</span>
        </div>
      </div>
    </div>
  );
}

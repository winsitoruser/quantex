"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cryptoPairs } from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import MiniChart from "@/components/ui/MiniChart";
import { useLanguage, useCurrency } from "@/i18n";
import { cn } from "@/lib/utils";

export default function MarketOverview() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "🔥 " + t.home.market.tabs.hot },
    { label: t.home.market.tabs.topGainers },
    { label: t.home.market.tabs.topVolume },
    { label: t.home.market.tabs.newListings },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-foreground tracking-tight">{t.home.market.title}</h2>
          <Link
            href="/markets"
            className="text-[13px] font-medium text-accent hover:text-accent-hover transition-colors"
          >
            {t.home.market.viewAllMarkets} →
          </Link>
        </div>
        <p className="text-[13px] text-text-secondary mb-5">{t.home.market.subtitle}</p>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-5">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => setActiveTab(i)}
              className={cn(
                "px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors",
                activeTab === i
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-foreground hover:bg-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/60 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_100px_1fr_1fr_80px] gap-3 px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider bg-surface/50 border-b border-border/60">
            <span>{t.common.name}</span>
            <span className="text-right">{t.common.price}</span>
            <span className="text-right">24h %</span>
            <span className="text-right">Volume</span>
            <span className="text-right">Market Cap</span>
            <span className="text-center">{t.common.chart}</span>
          </div>

          {/* Table Rows */}
          {cryptoPairs.slice(0, 8).map((pair, i) => {
            const up = pair.change24h >= 0;
            return (
              <motion.div
                key={pair.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/trade/${pair.id}`}
                  className="grid grid-cols-[2fr_1fr_100px_1fr_1fr_80px] gap-3 items-center px-4 py-3 hover:bg-card-hover/50 transition-colors border-b border-border/30 last:border-0"
                >
                  {/* Name */}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={pair.icon}
                      alt={pair.name}
                      className="h-8 w-8 shrink-0 object-contain rounded-lg bg-surface border border-border/60"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-[13px] font-semibold text-foreground">{pair.symbol.split("/")[0]}</p>
                        <span className="text-[10px] text-muted">/USDT</span>
                      </div>
                      <p className="text-[10px] text-muted">{pair.name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <p className="text-[13px] font-medium text-foreground font-mono text-right tracking-tight">
                    {formatCurrency(pair.price)}
                  </p>

                  {/* 24h Change - colored pill */}
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "inline-flex items-center justify-center min-w-[68px] px-2 py-1 rounded text-[11px] font-bold",
                        up ? "text-white bg-accent" : "text-white bg-danger"
                      )}
                    >
                      {up ? "+" : ""}{formatPercent(pair.change24h)}
                    </span>
                  </div>

                  {/* Volume */}
                  <p className="text-[13px] text-text-secondary font-mono text-right">
                    {formatCurrency(pair.volume24h, { compact: true })}
                  </p>

                  {/* Market Cap */}
                  <p className="text-[13px] text-text-secondary font-mono text-right">
                    {formatCurrency(pair.marketCap, { compact: true })}
                  </p>

                  {/* Mini Chart */}
                  <div className="flex justify-center">
                    <MiniChart
                      data={pair.sparkline}
                      color={up ? "#00d47e" : "#f6465d"}
                      width={64}
                      height={24}
                    />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View More */}
        <div className="text-center mt-5">
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-border/60 text-[13px] font-medium text-text-secondary hover:text-foreground hover:border-accent/40 transition-colors"
          >
            {t.home.market.viewAllMarkets} →
          </Link>
        </div>
      </div>
    </section>
  );
}

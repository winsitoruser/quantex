"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Ban,
  BarChart3,
  TrendingUp,
  ArrowRightLeft,
  Shield,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Settings,
} from "lucide-react";
import { otcTrades, otcQuotes, otcStats, otcCryptos } from "@/data/otcData";
import { cn } from "@/lib/utils";

type Tab = "trades" | "quotes" | "assets" | "settings";

const tradeStatusConfig: Record<string, { label: string; color: string }> = {
  pending_settlement: { label: "Pending", color: "text-warning bg-warning/10" },
  settled: { label: "Settled", color: "text-accent bg-accent/10" },
  failed: { label: "Failed", color: "text-danger bg-danger/10" },
};

const quoteStatusConfig: Record<string, { label: string; color: string }> = {
  quoted: { label: "Active", color: "text-info bg-info/10" },
  accepted: { label: "Accepted", color: "text-accent bg-accent/10" },
  expired: { label: "Expired", color: "text-muted bg-background" },
  settled: { label: "Settled", color: "text-accent bg-accent/10" },
  cancelled: { label: "Cancelled", color: "text-danger bg-danger/10" },
};

export default function BackofficeOTCPage() {
  const [activeTab, setActiveTab] = useState<Tab>("trades");
  const [search, setSearch] = useState("");

  const tabs: { key: Tab; label: string; icon: typeof ArrowRightLeft }[] = [
    { key: "trades", label: "Trades", icon: ArrowRightLeft },
    { key: "quotes", label: "Quotes", icon: BarChart3 },
    { key: "assets", label: "OTC Assets", icon: DollarSign },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  const stats = {
    totalTrades: otcTrades.length,
    pendingSettlement: otcTrades.filter((t) => t.status === "pending_settlement").length,
    totalVolume: otcTrades.reduce((sum, t) => sum + t.totalFiat, 0),
    totalFees: otcTrades.reduce((sum, t) => sum + t.fee, 0),
    activeQuotes: otcQuotes.filter((q) => q.status === "quoted").length,
    avgSpread: 0.25,
  };

  const formatUSD = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-foreground">OTC Management</h1>
          <span className="px-2 py-0.5 rounded-md bg-purple/10 text-purple text-[10px] font-semibold">PRO</span>
        </div>
        <p className="text-sm text-muted">Monitor and manage OTC trading desk operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Trades", value: stats.totalTrades.toString(), icon: ArrowRightLeft },
          { label: "Pending Settlement", value: stats.pendingSettlement.toString(), icon: Clock, highlight: stats.pendingSettlement > 0 },
          { label: "Total Volume", value: formatUSD(stats.totalVolume), icon: TrendingUp },
          { label: "Total Fees", value: formatUSD(stats.totalFees), icon: DollarSign },
          { label: "Active Quotes", value: stats.activeQuotes.toString(), icon: BarChart3 },
          { label: "Avg Spread", value: `${stats.avgSpread}%`, icon: Shield },
        ].map(({ label, value, icon: Icon, highlight }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "rounded-2xl bg-card border p-4",
              highlight ? "border-warning/30" : "border-border"
            )}
          >
            <Icon className={cn("h-4 w-4 mb-2", highlight ? "text-warning" : "text-accent")} />
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "text-accent border-accent"
                  : "text-muted border-transparent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-sm">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
      </div>

      {/* Trades Tab */}
      {activeTab === "trades" && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Trade ID</div>
            <div className="col-span-1">Side</div>
            <div className="col-span-2">Asset / Amount</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1">Fee</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {otcTrades.map((trade, i) => {
            const config = tradeStatusConfig[trade.status] || tradeStatusConfig.settled;
            return (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-xs font-mono text-foreground">{trade.id}</p>
                  <p className="text-[9px] text-muted">{trade.accountManager}</p>
                </div>
                <div className="col-span-1">
                  <span className={cn(
                    "inline-flex items-center gap-0.5 text-[10px] font-bold uppercase",
                    trade.side === "buy" ? "text-accent" : "text-danger"
                  )}>
                    {trade.side === "buy" ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
                    {trade.side}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{trade.cryptoIcon}</span>
                    <div>
                      <p className="text-xs text-foreground font-semibold">{trade.crypto}</p>
                      <p className="text-[10px] text-muted font-mono">{trade.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs text-foreground font-mono">${trade.price.toLocaleString()}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-semibold text-foreground font-mono">${trade.totalFiat.toLocaleString()}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-[10px] text-muted font-mono">${trade.fee.toLocaleString()}</p>
                </div>
                <div className="col-span-1">
                  <span className={cn("text-[10px] px-2 py-1 rounded-full font-medium", config.color)}>
                    {config.label}
                  </span>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="View">
                    <Eye className="h-3 w-3" />
                  </button>
                  {trade.txHash && (
                    <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="View Tx">
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Quotes Tab */}
      {activeTab === "quotes" && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Quote ID</div>
            <div className="col-span-1">Side</div>
            <div className="col-span-2">Asset / Amount</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1">Spread</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">Manager</div>
          </div>

          {otcQuotes.map((quote, i) => {
            const config = quoteStatusConfig[quote.status] || quoteStatusConfig.quoted;
            return (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                <div className="col-span-2">
                  <p className="text-xs font-mono text-foreground">{quote.id}</p>
                </div>
                <div className="col-span-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    quote.side === "buy" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"
                  )}>
                    {quote.side}
                  </span>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{quote.cryptoIcon}</span>
                    <div>
                      <p className="text-xs text-foreground font-semibold">{quote.crypto}</p>
                      <p className="text-[10px] text-muted font-mono">{quote.amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs text-foreground font-mono">${quote.price.toLocaleString()}</p>
                  <p className="text-[9px] text-muted">Mkt: ${quote.marketPrice.toLocaleString()}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-semibold text-foreground font-mono">${quote.totalFiat.toLocaleString()}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-[10px] text-warning font-mono">{quote.premium.toFixed(2)}%</p>
                </div>
                <div className="col-span-1">
                  <span className={cn("text-[10px] px-2 py-1 rounded-full font-medium", config.color)}>
                    {config.label}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <p className="text-[10px] text-muted">{quote.accountManager}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Assets Tab */}
      {activeTab === "assets" && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-3">Asset</div>
            <div className="col-span-2 text-right">Market Price</div>
            <div className="col-span-2 text-right">Min OTC Amount</div>
            <div className="col-span-2 text-right">Min OTC Value</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {otcCryptos.map((crypto, i) => (
            <motion.div
              key={crypto.symbol}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="grid grid-cols-12 gap-3 items-center px-5 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
            >
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center text-base">
                    {crypto.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{crypto.symbol}</p>
                    <p className="text-[10px] text-muted">{crypto.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-sm text-foreground font-mono">${crypto.marketPrice.toLocaleString()}</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-sm text-foreground font-mono">{crypto.minOtc.toLocaleString()} {crypto.symbol}</p>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-sm text-muted font-mono">${(crypto.minOtc * crypto.marketPrice).toLocaleString()}</p>
              </div>
              <div className="col-span-3 flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-background border border-border text-[10px] font-medium text-muted hover:text-foreground transition-colors">
                  Edit Limits
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-background border border-border text-[10px] font-medium text-muted hover:text-foreground transition-colors">
                  Configure Spread
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted mb-1.5 block">Default Spread (%)</label>
                <input
                  type="number"
                  defaultValue="0.30"
                  step="0.01"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Quote Validity (seconds)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Max Settlement Time (minutes)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
                Save Settings
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Fee Structure</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted mb-1.5 block">Standard Tier Fee (%)</label>
                <input
                  type="number"
                  defaultValue="0.10"
                  step="0.01"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Premium Tier Fee (%)</label>
                <input
                  type="number"
                  defaultValue="0.08"
                  step="0.01"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-muted mb-1.5 block">Institutional Tier Fee (%)</label>
                <input
                  type="number"
                  defaultValue="0.05"
                  step="0.01"
                  className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
                Save Fee Structure
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Account Managers</h3>
            <div className="space-y-3">
              {["Sarah Chen", "Mike Johnson", "David Kim"].map((manager) => (
                <div key={manager} className="flex items-center justify-between p-3 bg-background rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-[10px] font-bold text-foreground">
                      {manager.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="text-sm text-foreground">{manager}</span>
                  </div>
                  <span className="text-[10px] text-accent px-2 py-0.5 rounded bg-accent/10">Active</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Settlement Methods</h3>
            <div className="space-y-3">
              {[
                { method: "Wire Transfer", enabled: true },
                { method: "Wise", enabled: true },
                { method: "Zelle", enabled: true },
                { method: "SWIFT", enabled: false },
                { method: "SEPA", enabled: false },
              ].map((item) => (
                <div key={item.method} className="flex items-center justify-between p-3 bg-background rounded-xl">
                  <span className="text-sm text-foreground">{item.method}</span>
                  <button className={cn(
                    "text-[10px] px-3 py-1 rounded-full font-medium transition-colors",
                    item.enabled
                      ? "bg-accent/10 text-accent hover:bg-accent/20"
                      : "bg-background text-muted border border-border hover:text-foreground"
                  )}>
                    {item.enabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

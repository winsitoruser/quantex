"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Search,
  Plus,
  Settings,
  Eye,
  Pause,
  Play,
  ArrowUpDown,
  Activity,
} from "lucide-react";
import { tradingPairStats } from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function PairsPage() {
  const [search, setSearch] = useState("");

  const filteredPairs = tradingPairStats.filter(p =>
    p.pair.toLowerCase().includes(search.toLowerCase())
  );

  const totalVolume = tradingPairStats.reduce((s, p) => s + p.volume24h, 0);
  const totalTrades = tradingPairStats.reduce((s, p) => s + p.trades24h, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trading Pairs</h1>
          <p className="text-sm text-muted mt-1">Manage trading pair configurations and monitoring</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
          <Plus className="h-4 w-4" />
          Add New Pair
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Active Pairs", value: tradingPairStats.length.toString(), color: "text-accent" },
          { label: "Total Volume (24h)", value: `$${formatNumber(totalVolume)}`, color: "text-info" },
          { label: "Total Trades (24h)", value: totalTrades.toLocaleString(), color: "text-purple" },
          { label: "Avg Spread", value: `${(tradingPairStats.reduce((s, p) => s + p.spread, 0) / tradingPairStats.length).toFixed(3)}%`, color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-4 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 max-w-md focus-within:border-border-light transition-colors">
        <Search className="h-4 w-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search trading pairs..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
        />
      </div>

      {/* Pairs Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredPairs.map((pair, i) => (
          <motion.div
            key={pair.pair}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-2xl bg-card border border-border p-5 hover:border-border-light transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-background border border-border flex items-center justify-center text-xs font-bold text-foreground">
                  {pair.pair.split("/")[0].charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{pair.pair}</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                    pair.status === "active" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                  }`}>
                    {pair.status}
                  </span>
                </div>
              </div>
              <Activity className="h-4 w-4 text-accent animate-pulse" />
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Volume (24h)</p>
                <p className="text-xs font-bold text-foreground font-mono">${formatNumber(pair.volume24h)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Trades (24h)</p>
                <p className="text-xs font-medium text-foreground font-mono">{pair.trades24h.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">Spread</p>
                <p className="text-xs font-medium text-warning font-mono">{pair.spread.toFixed(2)}%</p>
              </div>
            </div>

            {/* Volume bar (relative to max) */}
            <div className="mb-4">
              <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/60"
                  style={{ width: `${(pair.volume24h / tradingPairStats[0].volume24h) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-border">
              <button className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-info bg-info/10 hover:bg-info/20 transition-colors">
                <Settings className="h-3 w-3" />
                Configure
              </button>
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-warning bg-warning/10 hover:bg-warning/20 transition-colors" title="Pause Trading">
                <Pause className="h-3.5 w-3.5" />
              </button>
              <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted bg-card-hover hover:bg-background transition-colors" title="View Details">
                <Eye className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

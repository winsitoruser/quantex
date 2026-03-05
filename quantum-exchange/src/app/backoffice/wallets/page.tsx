"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Shield,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { hotWalletBalances } from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

const COLORS = ["#00c26f", "#06b6d4", "#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444"];

export default function WalletsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const totalUsd = hotWalletBalances.reduce((s, w) => s + w.usdValue, 0);

  const chartData = hotWalletBalances.map((w, i) => ({
    asset: w.asset,
    value: w.usdValue,
    fill: COLORS[i % COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Wallet Management</h1>
          <p className="text-sm text-muted mt-1">Monitor hot wallet balances and thresholds</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          <RefreshCw className="h-4 w-4" />
          Refresh Balances
        </button>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6"
      >
        <p className="text-sm text-muted mb-1">Total Hot Wallet Value</p>
        <p className="text-3xl font-bold text-foreground font-mono">${totalUsd.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className="flex items-center gap-0.5 text-sm text-accent font-medium">
            <ArrowUpRight className="h-4 w-4" />
            +2.1%
          </span>
          <span className="text-sm text-muted">vs yesterday</span>
        </div>
      </motion.div>

      {/* Chart */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          Wallet Distribution (USD)
        </h3>
        <div className="h-[250px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" vertical={false} />
                <XAxis dataKey="asset" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#1e2333" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${formatNumber(v)}`} width={65} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl">
                          <p className="text-xs font-semibold text-foreground">{payload[0].payload.asset}</p>
                          <p className="text-xs text-muted font-mono">${payload[0].payload.value.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Wallet Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotWalletBalances.map((wallet, i) => {
          const utilizationPercent = (wallet.balance / (wallet.threshold * 10)) * 100;
          const isLow = wallet.balance < wallet.threshold * 2;
          return (
            <motion.div
              key={wallet.asset}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-2xl bg-card border p-5",
                isLow ? "border-warning/30" : "border-border"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-foreground" style={{ backgroundColor: `${COLORS[i % COLORS.length]}20`, color: COLORS[i % COLORS.length] }}>
                    {wallet.asset.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{wallet.asset}</p>
                    <p className="text-[10px] text-muted">Hot Wallet</p>
                  </div>
                </div>
                {isLow && (
                  <div className="flex items-center gap-1 text-warning">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Balance */}
              <div className="mb-4">
                <p className="text-xs text-muted mb-0.5">Balance</p>
                <p className="text-lg font-bold text-foreground font-mono">{wallet.balance.toLocaleString()} {wallet.asset}</p>
                <p className="text-xs text-muted font-mono">${wallet.usdValue.toLocaleString()}</p>
              </div>

              {/* Threshold Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-muted">Threshold: {wallet.threshold.toLocaleString()} {wallet.asset}</p>
                  <p className="text-[10px] font-medium text-foreground">{Math.min(utilizationPercent, 100).toFixed(0)}%</p>
                </div>
                <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      isLow ? "bg-warning" : "bg-accent"
                    )}
                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-info bg-info/10 hover:bg-info/20 transition-colors">
                  <ExternalLink className="h-3 w-3" />
                  Explorer
                </button>
                <button className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors">
                  <Shield className="h-3 w-3" />
                  Replenish
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

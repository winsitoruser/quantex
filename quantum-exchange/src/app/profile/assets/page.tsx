"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Eye,
  EyeOff,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Send,
  ArrowRightLeft,
  PieChart,
  TrendingUp,
  Filter,
  BarChart3,
} from "lucide-react";
import { userAssets } from "@/data/userData";
import { cn } from "@/lib/utils";
import { formatPrice, formatPercent } from "@/lib/utils";

const walletTabs = ["All", "Spot", "Futures", "Earn"];

export default function AssetsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [hideSmall, setHideSmall] = useState(false);

  const totalValue = userAssets.reduce((sum, a) => sum + a.usdValue, 0);
  const spotValue = userAssets.reduce(
    (sum, a) => sum + a.spotBalance * a.price,
    0
  );
  const futuresValue = userAssets.reduce(
    (sum, a) => sum + a.futuresBalance * a.price,
    0
  );
  const earnValue = userAssets.reduce(
    (sum, a) => sum + a.earnBalance * a.price,
    0
  );
  const totalChange = 2.87;

  const filteredAssets = userAssets
    .filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.symbol.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Spot" && a.spotBalance > 0) ||
        (activeTab === "Futures" && a.futuresBalance > 0) ||
        (activeTab === "Earn" && a.earnBalance > 0);
      const matchHide = !hideSmall || a.usdValue >= 1;
      return matchSearch && matchTab && matchHide;
    })
    .sort((a, b) => b.usdValue - a.usdValue);

  const getBalanceForTab = (asset: (typeof userAssets)[0]) => {
    switch (activeTab) {
      case "Spot":
        return asset.spotBalance;
      case "Futures":
        return asset.futuresBalance;
      case "Earn":
        return asset.earnBalance;
      default:
        return asset.totalBalance;
    }
  };

  const getValueForTab = (asset: (typeof userAssets)[0]) => {
    const balance = getBalanceForTab(asset);
    return balance * asset.price;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Assets</h1>
          <p className="text-sm text-muted">
            Overview of all your crypto holdings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-medium transition-colors">
            <Download className="h-4 w-4" />
            Deposit
          </button>
          <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
            <Send className="h-4 w-4" />
            Withdraw
          </button>
          <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-muted">Estimated Total Value</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-muted hover:text-foreground transition-colors"
              >
                {balanceVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-foreground mb-2 font-mono">
              {balanceVisible
                ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "••••••••"}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "flex items-center gap-0.5 text-sm font-medium",
                  totalChange >= 0 ? "text-accent" : "text-danger"
                )}
              >
                {totalChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {formatPercent(totalChange)}
              </span>
              <span className="text-sm text-muted">24h</span>
            </div>
          </div>

          {/* Balance Distribution */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Spot",
                value: spotValue,
                icon: Wallet,
                color: "text-accent",
              },
              {
                label: "Futures",
                value: futuresValue,
                icon: BarChart3,
                color: "text-info",
              },
              {
                label: "Earn",
                value: earnValue,
                icon: TrendingUp,
                color: "text-purple",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="text-center p-3 rounded-xl bg-background/50 border border-border/50"
                >
                  <Icon
                    className={cn("h-4 w-4 mx-auto mb-1.5", item.color)}
                  />
                  <p className="text-xs text-muted mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {balanceVisible
                      ? `$${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "••••"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Portfolio Distribution */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-accent" />
          Portfolio Distribution
        </h3>
        <div className="space-y-3">
          {userAssets.slice(0, 6).map((asset) => {
            const percentage = (asset.usdValue / totalValue) * 100;
            return (
              <div key={asset.symbol}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-lg bg-background border border-border flex items-center justify-center text-xs">
                      {asset.icon}
                    </span>
                    <span className="font-medium text-foreground">
                      {asset.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted font-mono">
                      {balanceVisible
                        ? `$${asset.usdValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "••••"}
                    </span>
                    <span className="text-muted w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-accent to-cyan rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wallet Tabs & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {walletTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === tab
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={hideSmall}
              onChange={(e) => setHideSmall(e.target.checked)}
              className="accent-accent"
            />
            Hide small balances
          </label>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 focus-within:border-border-light transition-colors">
            <Search className="h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none w-40"
            />
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider border-b border-border">
          <div className="col-span-3">Asset</div>
          <div className="col-span-2 text-right">Balance</div>
          <div className="col-span-2 text-right">Available</div>
          <div className="col-span-2 text-right">USD Value</div>
          <div className="col-span-1 text-right">24h</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Filter className="h-8 w-8 mb-3" />
            <p className="text-sm">No assets found</p>
          </div>
        ) : (
          filteredAssets.map((asset, i) => {
            const balance = getBalanceForTab(asset);
            const value = getValueForTab(asset);
            return (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                {/* Asset */}
                <div className="col-span-5 md:col-span-3 flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-background border border-border text-base shrink-0">
                    {asset.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {asset.symbol}
                    </p>
                    <p className="text-xs text-muted">{asset.name}</p>
                  </div>
                </div>

                {/* Balance */}
                <div className="col-span-3 md:col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? balance < 1
                        ? balance.toFixed(6)
                        : balance.toLocaleString("en-US", {
                            maximumFractionDigits: 4,
                          })
                      : "••••"}
                  </p>
                </div>

                {/* Available */}
                <div className="hidden md:block col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? asset.availableBalance < 1
                        ? asset.availableBalance.toFixed(6)
                        : asset.availableBalance.toLocaleString("en-US", {
                            maximumFractionDigits: 4,
                          })
                      : "••••"}
                  </p>
                  {asset.inOrder > 0 && (
                    <p className="text-[10px] text-muted">
                      In order:{" "}
                      {balanceVisible
                        ? asset.inOrder.toLocaleString()
                        : "••••"}
                    </p>
                  )}
                </div>

                {/* USD Value */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "••••"}
                  </p>
                </div>

                {/* 24h Change */}
                <div className="hidden md:block col-span-1 text-right">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      asset.change24h >= 0 ? "text-accent" : "text-danger"
                    )}
                  >
                    {formatPercent(asset.change24h)}
                  </span>
                </div>

                {/* Actions */}
                <div className="hidden md:flex col-span-2 items-center justify-end gap-1.5">
                  <button className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                    Deposit
                  </button>
                  <button className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-card-hover text-foreground hover:bg-background transition-colors border border-border">
                    Withdraw
                  </button>
                  <button className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-muted hover:text-foreground transition-colors">
                    Trade
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

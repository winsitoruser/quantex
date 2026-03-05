"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Download,
} from "lucide-react";
import { otcTrades, type OTCTrade } from "@/data/otcData";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "pending_settlement" | "settled" | "failed";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending_settlement: { label: "Pending", color: "text-warning bg-warning/10", icon: Clock },
  settled: { label: "Settled", color: "text-accent bg-accent/10", icon: CheckCircle2 },
  failed: { label: "Failed", color: "text-danger bg-danger/10", icon: XCircle },
};

export default function OTCHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [sideFilter, setSideFilter] = useState<"all" | "buy" | "sell">("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredTrades = useMemo(() => {
    return otcTrades.filter((trade) => {
      if (statusFilter !== "all" && trade.status !== statusFilter) return false;
      if (sideFilter !== "all" && trade.side !== sideFilter) return false;
      if (search && !trade.id.toLowerCase().includes(search.toLowerCase()) && !trade.crypto.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [statusFilter, search, sideFilter]);

  const stats = useMemo(() => ({
    totalTrades: otcTrades.length,
    settled: otcTrades.filter((t) => t.status === "settled").length,
    totalVolume: otcTrades.filter((t) => t.status === "settled").reduce((sum, t) => sum + t.totalFiat, 0),
    totalFees: otcTrades.reduce((sum, t) => sum + t.fee, 0),
  }), []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatUSD = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/otc"
              className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">OTC Trade History</h1>
              <p className="text-sm text-muted">Your OTC trading records</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-muted hover:text-foreground transition-colors">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Trades", value: stats.totalTrades.toString() },
            { label: "Settled", value: stats.settled.toString() },
            { label: "Total Volume", value: formatUSD(stats.totalVolume) },
            { label: "Total Fees", value: formatUSD(stats.totalFees) },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-sm">
            <Search className="h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by trade ID or asset..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {(["all", "buy", "sell"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSideFilter(type)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize",
                  sideFilter === type
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-foreground bg-card border border-border"
                )}
              >
                {type === "all" ? "All Sides" : type}
              </button>
            ))}
            <div className="w-px h-6 bg-border" />
            {(["all", "settled", "pending_settlement"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  statusFilter === status
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-foreground bg-card border border-border"
                )}
              >
                {status === "all" ? "All Status" : status === "pending_settlement" ? "Pending" : "Settled"}
              </button>
            ))}
          </div>
        </div>

        {/* Trades Table */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Trade ID</div>
            <div className="col-span-1">Side</div>
            <div className="col-span-2">Asset / Amount</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right hidden md:block">Total</div>
            <div className="col-span-1 text-right hidden lg:block">Fee</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right hidden lg:block">Date</div>
          </div>

          {/* Rows */}
          {filteredTrades.length === 0 ? (
            <div className="py-12 text-center text-muted text-sm">No trades found</div>
          ) : (
            filteredTrades.map((trade, i) => {
              const config = statusConfig[trade.status] || statusConfig.settled;
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={trade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
                >
                  {/* Trade ID */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-foreground">{trade.id}</span>
                      <button
                        onClick={() => handleCopy(trade.id, trade.id)}
                        className="text-muted hover:text-foreground transition-colors"
                      >
                        {copied === trade.id ? (
                          <Check className="h-3 w-3 text-accent" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    {trade.txHash && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-muted font-mono">{trade.txHash.slice(0, 12)}...</span>
                        <ExternalLink className="h-2.5 w-2.5 text-muted" />
                      </div>
                    )}
                  </div>

                  {/* Side */}
                  <div className="col-span-1">
                    <span className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-bold uppercase",
                      trade.side === "buy" ? "text-accent" : "text-danger"
                    )}>
                      {trade.side === "buy" ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {trade.side}
                    </span>
                  </div>

                  {/* Asset / Amount */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{trade.cryptoIcon}</span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{trade.crypto}</p>
                        <p className="text-[10px] text-muted font-mono">{trade.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-right">
                    <p className="text-sm text-foreground font-mono">${trade.price.toLocaleString()}</p>
                  </div>

                  {/* Total */}
                  <div className="col-span-2 text-right hidden md:block">
                    <p className="text-sm font-semibold text-foreground font-mono">
                      ${trade.totalFiat.toLocaleString()}
                    </p>
                  </div>

                  {/* Fee */}
                  <div className="col-span-1 text-right hidden lg:block">
                    <p className="text-xs text-muted font-mono">${trade.fee.toLocaleString()}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium",
                      config.color
                    )}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-1 text-right hidden lg:block">
                    <p className="text-[10px] text-muted">
                      {new Date(trade.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-[10px] text-muted">
                      {new Date(trade.createdAt).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

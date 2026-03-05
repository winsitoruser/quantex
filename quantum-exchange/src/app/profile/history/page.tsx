"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  History,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRightLeft,
  Send,
  TrendingUp,
  Zap,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { transactionHistory, type TransactionHistory } from "@/data/userData";
import { cn } from "@/lib/utils";

const typeTabs = ["All", "Trade", "Deposit", "Withdraw", "Transfer", "Earn"];
const statusFilters = ["All", "Completed", "Pending", "Failed"];

const typeConfig: Record<
  TransactionHistory["type"],
  { icon: typeof History; label: string; color: string; bg: string }
> = {
  trade: {
    icon: TrendingUp,
    label: "Trade",
    color: "text-info",
    bg: "bg-info/10",
  },
  deposit: {
    icon: Download,
    label: "Deposit",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  withdraw: {
    icon: Send,
    label: "Withdraw",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  transfer: {
    icon: ArrowRightLeft,
    label: "Transfer",
    color: "text-purple",
    bg: "bg-purple/10",
  },
  earn: {
    icon: Zap,
    label: "Earn",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  fee: {
    icon: AlertCircle,
    label: "Fee",
    color: "text-muted",
    bg: "bg-card-hover",
  },
};

const statusConfig: Record<
  TransactionHistory["status"],
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-accent",
  },
  pending: { icon: Clock, label: "Pending", color: "text-warning" },
  failed: { icon: XCircle, label: "Failed", color: "text-danger" },
  cancelled: {
    icon: XCircle,
    label: "Cancelled",
    color: "text-muted",
  },
};

const ITEMS_PER_PAGE = 10;

export default function HistoryPage() {
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = transactionHistory.filter((tx) => {
    const matchType =
      activeType === "All" ||
      tx.type === activeType.toLowerCase();
    const matchStatus =
      activeStatus === "All" ||
      tx.status === activeStatus.toLowerCase();
    const matchSearch =
      search === "" ||
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      (tx.pair && tx.pair.toLowerCase().includes(search.toLowerCase()));
    return matchType && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalVolume = transactionHistory
    .filter((tx) => tx.type === "trade")
    .reduce((sum, tx) => sum + tx.usdValue, 0);
  const totalDeposits = transactionHistory
    .filter((tx) => tx.type === "deposit")
    .reduce((sum, tx) => sum + tx.usdValue, 0);
  const totalWithdrawals = transactionHistory
    .filter((tx) => tx.type === "withdraw" && tx.status === "completed")
    .reduce((sum, tx) => sum + tx.usdValue, 0);
  const totalEarnings = transactionHistory
    .filter((tx) => tx.type === "earn")
    .reduce((sum, tx) => sum + tx.usdValue, 0);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Transaction History
          </h1>
          <p className="text-sm text-muted">
            View all your transactions and activities
          </p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Trade Volume",
            value: `$${totalVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
            icon: TrendingUp,
            color: "text-info",
            bg: "bg-info/10",
          },
          {
            label: "Total Deposits",
            value: `$${totalDeposits.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
            icon: Download,
            color: "text-accent",
            bg: "bg-accent/10",
          },
          {
            label: "Total Withdrawals",
            value: `$${totalWithdrawals.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
            icon: Send,
            color: "text-warning",
            bg: "bg-warning/10",
          },
          {
            label: "Earn Rewards",
            value: `$${totalEarnings.toLocaleString("en-US", { maximumFractionDigits: 2 })}`,
            icon: Zap,
            color: "text-cyan",
            bg: "bg-cyan/10",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center mb-3",
                  stat.bg
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", stat.color)} />
              </div>
              <p className="text-xs text-muted mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-foreground font-mono">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {typeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveType(tab);
                setPage(1);
              }}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap",
                activeType === tab
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Status + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted" />
            {statusFilters.map((status) => (
              <button
                key={status}
                onClick={() => {
                  setActiveStatus(status);
                  setPage(1);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  activeStatus === status
                    ? "bg-card-hover text-foreground border border-border"
                    : "text-muted hover:text-foreground"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 focus-within:border-border-light transition-colors">
            <Search className="h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by asset, pair, or ID..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none w-52"
            />
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider border-b border-border">
          <div className="col-span-2">Type</div>
          <div className="col-span-2">Asset</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2 text-right">USD Value</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Details</div>
        </div>

        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <History className="h-8 w-8 mb-3" />
            <p className="text-sm">No transactions found</p>
            <p className="text-xs mt-1">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          paginated.map((tx, i) => {
            const config = typeConfig[tx.type];
            const status = statusConfig[tx.status];
            const TypeIcon = config.icon;
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                {/* Type */}
                <div className="col-span-6 lg:col-span-2 flex items-center gap-2.5">
                  <div
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                      config.bg
                    )}
                  >
                    <TypeIcon className={cn("h-4 w-4", config.color)} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {config.label}
                    </p>
                    {tx.type === "trade" && tx.side && (
                      <span
                        className={cn(
                          "text-[10px] font-semibold uppercase",
                          tx.side === "buy" ? "text-accent" : "text-danger"
                        )}
                      >
                        {tx.side}
                      </span>
                    )}
                    {tx.type === "transfer" && (
                      <span className="text-[10px] text-muted">
                        {tx.from} → {tx.to}
                      </span>
                    )}
                  </div>
                </div>

                {/* Asset */}
                <div className="col-span-6 lg:col-span-2 text-right lg:text-left">
                  <p className="text-sm font-semibold text-foreground">
                    {tx.asset}
                  </p>
                  {tx.pair && (
                    <p className="text-[10px] text-muted">{tx.pair}</p>
                  )}
                  {tx.network && (
                    <p className="text-[10px] text-muted">{tx.network}</p>
                  )}
                </div>

                {/* Amount */}
                <div className="col-span-4 lg:col-span-2 text-right">
                  <p
                    className={cn(
                      "text-sm font-medium font-mono",
                      tx.type === "deposit" || tx.type === "earn"
                        ? "text-accent"
                        : tx.type === "withdraw"
                          ? "text-danger"
                          : "text-foreground"
                    )}
                  >
                    {tx.type === "deposit" || tx.type === "earn"
                      ? "+"
                      : tx.type === "withdraw"
                        ? "-"
                        : ""}
                    {tx.amount < 1
                      ? tx.amount.toFixed(6)
                      : tx.amount.toLocaleString("en-US", {
                          maximumFractionDigits: 4,
                        })}
                  </p>
                  {tx.price && (
                    <p className="text-[10px] text-muted font-mono">
                      @ ${tx.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                {/* USD Value */}
                <div className="col-span-4 lg:col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    ${tx.usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  {tx.fee !== undefined && (
                    <p className="text-[10px] text-muted font-mono">
                      Fee: ${tx.fee.toFixed(2)}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="col-span-4 lg:col-span-2">
                  <p className="text-xs text-foreground">
                    {formatDate(tx.timestamp)}
                  </p>
                  <p className="text-[10px] text-muted">
                    {formatTime(tx.timestamp)}
                  </p>
                </div>

                {/* Status */}
                <div className="hidden lg:flex col-span-1 items-center">
                  <span
                    className={cn(
                      "flex items-center gap-1 text-xs font-medium",
                      status.color
                    )}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                  </span>
                </div>

                {/* Details */}
                <div className="hidden lg:flex col-span-1 justify-end">
                  {tx.txHash && (
                    <button
                      className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
                      title={tx.txHash}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {(page - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of{" "}
            {filtered.length} transactions
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
                page === 1
                  ? "text-muted/30 cursor-not-allowed"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                  page === p
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-card"
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={cn(
                "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
                page === totalPages
                  ? "text-muted/30 cursor-not-allowed"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

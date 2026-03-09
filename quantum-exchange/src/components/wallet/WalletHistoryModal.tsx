"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
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
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletHistoryItem {
  id: string;
  type: "deposit" | "withdraw" | "transfer" | "buy" | "sell";
  asset: string;
  amount: number;
  value: number;
  status: "completed" | "pending" | "failed";
  timestamp: string;
  txHash?: string;
  from?: string;
  to?: string;
  fee?: number;
}

const mockWalletHistory: WalletHistoryItem[] = [
  {
    id: "wh-001",
    type: "deposit",
    asset: "USDT",
    amount: 10000,
    value: 10000,
    status: "completed",
    timestamp: "2026-03-09T08:30:00Z",
    txHash: "0x1a2b3c...7d8e9f",
    from: "External Wallet",
  },
  {
    id: "wh-002",
    type: "withdraw",
    asset: "BTC",
    amount: 0.05,
    value: 3361.73,
    status: "completed",
    timestamp: "2026-03-08T14:20:00Z",
    txHash: "0x4e5f6g...1h2i3j",
    to: "bc1qxy2...w93gg",
    fee: 0.0005,
  },
  {
    id: "wh-003",
    type: "transfer",
    asset: "ETH",
    amount: 2.5,
    value: 8641.95,
    status: "completed",
    timestamp: "2026-03-07T16:00:00Z",
    from: "Spot",
    to: "Earn",
  },
  {
    id: "wh-004",
    type: "buy",
    asset: "BTC",
    amount: 0.1,
    value: 6723.45,
    status: "completed",
    timestamp: "2026-03-06T10:15:00Z",
    fee: 12.10,
  },
  {
    id: "wh-005",
    type: "deposit",
    asset: "SOL",
    amount: 50,
    value: 9922.50,
    status: "pending",
    timestamp: "2026-03-09T09:45:00Z",
    txHash: "5Vph7z...8Rqk",
    from: "External Wallet",
  },
  {
    id: "wh-006",
    type: "withdraw",
    asset: "USDT",
    amount: 5000,
    value: 5000,
    status: "pending",
    timestamp: "2026-03-09T07:30:00Z",
    txHash: "0x9a8b7c...6d5e4f",
    to: "0x742d...F8a1",
    fee: 1,
  },
  {
    id: "wh-007",
    type: "transfer",
    asset: "BNB",
    amount: 5,
    value: 3171.05,
    status: "completed",
    timestamp: "2026-03-05T18:20:00Z",
    from: "Spot",
    to: "Futures",
  },
  {
    id: "wh-008",
    type: "sell",
    asset: "ETH",
    amount: 1.5,
    value: 5185.17,
    status: "completed",
    timestamp: "2026-03-04T22:45:00Z",
    fee: 9.33,
  },
  {
    id: "wh-009",
    type: "deposit",
    asset: "BTC",
    amount: 0.25,
    value: 16808.63,
    status: "completed",
    timestamp: "2026-03-03T10:00:00Z",
    txHash: "bc1qxy2...w93gg",
    from: "External Wallet",
  },
  {
    id: "wh-010",
    type: "withdraw",
    asset: "SOL",
    amount: 20,
    value: 3969,
    status: "failed",
    timestamp: "2026-03-02T15:30:00Z",
    to: "7xKX...mN2p",
  },
];

interface WalletHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const typeTabs = ["All", "Deposit", "Withdraw", "Transfer", "Buy", "Sell"];
const statusFilters = ["All", "Completed", "Pending", "Failed"];

const typeConfig: Record<
  WalletHistoryItem["type"],
  { icon: typeof TrendingUp; label: string; color: string; bg: string }
> = {
  deposit: {
    icon: ArrowDownRight,
    label: "Deposit",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  withdraw: {
    icon: ArrowUpRight,
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
  buy: {
    icon: TrendingUp,
    label: "Buy",
    color: "text-info",
    bg: "bg-info/10",
  },
  sell: {
    icon: TrendingUp,
    label: "Sell",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
};

const statusConfig: Record<
  WalletHistoryItem["status"],
  { icon: typeof CheckCircle2; label: string; color: string }
> = {
  completed: {
    icon: CheckCircle2,
    label: "Completed",
    color: "text-accent",
  },
  pending: { icon: Clock, label: "Pending", color: "text-warning" },
  failed: { icon: XCircle, label: "Failed", color: "text-danger" },
};

const ITEMS_PER_PAGE = 7;

export default function WalletHistoryModal({ isOpen, onClose }: WalletHistoryModalProps) {
  const [activeType, setActiveType] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return mockWalletHistory.filter((item) => {
      const matchType =
        activeType === "All" || item.type === activeType.toLowerCase();
      const matchStatus =
        activeStatus === "All" ||
        item.status === activeStatus.toLowerCase();
      const matchSearch =
        search === "" ||
        item.asset.toLowerCase().includes(search.toLowerCase()) ||
        item.txHash?.toLowerCase().includes(search.toLowerCase());

      return matchType && matchStatus && matchSearch;
    });
  }, [activeType, activeStatus, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalValue = filtered
    .filter((item) => item.status === "completed")
    .reduce((sum, item) => sum + item.value, 0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Wallet History
                </h2>
                <p className="text-[11px] text-muted">
                  {filtered.length} transactions • Total: ${totalValue.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-border space-y-4 shrink-0">
            {/* Search */}
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by asset or TX hash..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
              />
            </div>

            {/* Type Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {typeTabs.map((type) => (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setPage(1); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors",
                    activeType === type
                      ? "bg-accent/10 text-accent"
                      : "text-text-secondary hover:text-foreground hover:bg-surface"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted uppercase tracking-wider">Status:</span>
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => { setActiveStatus(status); setPage(1); }}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors border",
                    activeStatus === status
                      ? "bg-accent/10 text-accent border-accent/30"
                      : "text-muted border-border hover:border-accent/30"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction List */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {paginatedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted">
                <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm font-medium">No transactions found</p>
                <p className="text-xs mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedItems.map((item, i) => {
                  const TypeIcon = typeConfig[item.type].icon;
                  const StatusIcon = statusConfig[item.status].icon;
                  const isIncoming = item.type === "deposit" || item.type === "buy" || item.type === "transfer";

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 rounded-xl bg-background border border-border hover:bg-card-hover transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            typeConfig[item.type].bg,
                            typeConfig[item.type].color
                          )}>
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {item.type === "transfer" ? `${item.from} → ${item.to}` : `${item.type === "deposit" ? "Received" : item.type === "withdraw" ? "Sent" : item.type === "buy" ? "Purchased" : "Sold"} ${item.asset}`}
                              </p>
                              <StatusIcon className={cn("h-3.5 w-3.5", statusConfig[item.status].color)} />
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted">
                              <span>{new Date(item.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                              {item.txHash && (
                                <>
                                  <span>•</span>
                                  <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                                    <span className="font-mono">{item.txHash.slice(0, 6)}...{item.txHash.slice(-4)}</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "text-sm font-bold font-mono",
                            isIncoming ? "text-accent" : "text-foreground"
                          )}>
                            {isIncoming ? "+" : "-"}{item.amount} {item.asset}
                          </p>
                          <p className="text-xs text-muted font-mono">
                            ≈ ${item.value.toLocaleString()}
                          </p>
                          {item.fee && (
                            <p className="text-[10px] text-muted mt-0.5">
                              Fee: {item.fee} {item.asset}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-border shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  Page {page} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:bg-card-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:bg-card-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="px-6 py-4 border-t border-border bg-surface/50 shrink-0">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors">
              <Download className="h-4 w-4" />
              Export Transaction History
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

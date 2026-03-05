"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { adminTransactions } from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type TypeFilter = "all" | "deposit" | "withdrawal" | "trade" | "transfer" | "fee";
type StatusFilter = "all" | "completed" | "pending" | "failed" | "reviewing";
type SortField = "timestamp" | "usdValue" | "amount";
type SortDir = "asc" | "desc";

const typeColors: Record<string, string> = {
  deposit: "bg-accent/10 text-accent",
  withdrawal: "bg-danger/10 text-danger",
  trade: "bg-info/10 text-info",
  transfer: "bg-purple/10 text-purple",
  fee: "bg-warning/10 text-warning",
};

const statusColors: Record<string, string> = {
  completed: "bg-accent/10 text-accent",
  pending: "bg-warning/10 text-warning",
  failed: "bg-danger/10 text-danger",
  reviewing: "bg-info/10 text-info",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle,
  reviewing: Eye,
};

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("timestamp");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filteredTxs = useMemo(() => {
    let txs = adminTransactions.filter(tx =>
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.username.toLowerCase().includes(search.toLowerCase()) ||
      tx.asset.toLowerCase().includes(search.toLowerCase()) ||
      (tx.txHash && tx.txHash.toLowerCase().includes(search.toLowerCase()))
    );
    if (typeFilter !== "all") txs = txs.filter(tx => tx.type === typeFilter);
    if (statusFilter !== "all") txs = txs.filter(tx => tx.status === statusFilter);

    txs.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case "usdValue": aVal = a.usdValue; bVal = b.usdValue; break;
        case "amount": aVal = a.amount; bVal = b.amount; break;
        default: aVal = a.timestamp; bVal = b.timestamp;
      }
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return txs;
  }, [search, typeFilter, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredTxs.length / perPage);
  const paginatedTxs = filteredTxs.slice((page - 1) * perPage, page * perPage);

  const summaryStats = {
    total: adminTransactions.length,
    totalVolume: adminTransactions.reduce((s, tx) => s + tx.usdValue, 0),
    deposits: adminTransactions.filter(tx => tx.type === "deposit").length,
    withdrawals: adminTransactions.filter(tx => tx.type === "withdrawal").length,
    pending: adminTransactions.filter(tx => tx.status === "pending" || tx.status === "reviewing").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-sm text-muted mt-1">Monitor all platform transactions</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Transactions", value: summaryStats.total.toString(), color: "text-foreground" },
          { label: "Total Volume", value: `$${formatNumber(summaryStats.totalVolume)}`, color: "text-accent" },
          { label: "Deposits", value: summaryStats.deposits.toString(), color: "text-info" },
          { label: "Withdrawals", value: summaryStats.withdrawals.toString(), color: "text-danger" },
          { label: "Pending/Review", value: summaryStats.pending.toString(), color: "text-warning" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-md focus-within:border-border-light transition-colors">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by ID, user, asset, or tx hash..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as TypeFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="trade">Trades</option>
            <option value="transfer">Transfers</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
              <th className="text-left px-5 py-3">TX ID</th>
              <th className="text-left px-3 py-3">User</th>
              <th className="text-left px-3 py-3">Type</th>
              <th className="text-left px-3 py-3">Asset</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("amount")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Amount <ArrowUpDown className={`h-3 w-3 ${sortField === "amount" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("usdValue")} className="inline-flex items-center gap-1 hover:text-foreground">
                  USD Value <ArrowUpDown className={`h-3 w-3 ${sortField === "usdValue" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-left px-3 py-3">Status</th>
              <th className="text-left px-3 py-3">Network</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("timestamp")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Time <ArrowUpDown className={`h-3 w-3 ${sortField === "timestamp" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-center px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginatedTxs.map((tx, i) => {
              const StatusIcon = statusIcons[tx.status] || Clock;
              return (
                <motion.tr
                  key={tx.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-card-hover transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-mono font-medium text-foreground">{tx.id}</p>
                    {tx.txHash && (
                      <p className="text-[10px] text-muted font-mono flex items-center gap-1">
                        {tx.txHash} <ExternalLink className="h-2.5 w-2.5" />
                      </p>
                    )}
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs font-semibold text-foreground">{tx.username}</p>
                    <p className="text-[10px] text-muted">{tx.userId}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-medium capitalize ${typeColors[tx.type]}`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs font-medium text-foreground">{tx.asset}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs font-medium text-foreground font-mono">
                      {tx.amount.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs font-bold text-foreground font-mono">
                      ${tx.usdValue.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg font-medium ${statusColors[tx.status]}`}>
                      <StatusIcon className="h-3 w-3" />
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs text-muted">{tx.network || "—"}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs text-muted">{tx.timestamp}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="View Details">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {(tx.status === "pending" || tx.status === "reviewing") && (
                        <>
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors" title="Approve">
                            <CheckCircle className="h-3.5 w-3.5" />
                          </button>
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Reject">
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredTxs.length)} of {filteredTxs.length} transactions
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

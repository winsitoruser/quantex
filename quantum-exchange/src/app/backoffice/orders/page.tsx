"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ClipboardList,
  ArrowUpDown,
  Eye,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Download,
} from "lucide-react";
import { adminOrders } from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "open" | "filled" | "partially_filled" | "cancelled";
type SideFilter = "all" | "buy" | "sell";
type SortField = "createdAt" | "total" | "amount" | "price";
type SortDir = "asc" | "desc";

const statusColors: Record<string, string> = {
  open: "bg-info/10 text-info",
  filled: "bg-accent/10 text-accent",
  partially_filled: "bg-warning/10 text-warning",
  cancelled: "bg-muted/10 text-muted",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  filled: "Filled",
  partially_filled: "Partial",
  cancelled: "Cancelled",
};

const typeLabels: Record<string, string> = {
  limit: "Limit",
  market: "Market",
  stop_limit: "Stop Limit",
  stop_market: "Stop Market",
};

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sideFilter, setSideFilter] = useState<SideFilter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filteredOrders = useMemo(() => {
    let orders = adminOrders.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.username.toLowerCase().includes(search.toLowerCase()) ||
      o.pair.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "all") orders = orders.filter(o => o.status === statusFilter);
    if (sideFilter !== "all") orders = orders.filter(o => o.side === sideFilter);

    orders.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case "total": aVal = a.total; bVal = b.total; break;
        case "amount": aVal = a.amount; bVal = b.amount; break;
        case "price": aVal = a.price; bVal = b.price; break;
        default: aVal = a.createdAt; bVal = b.createdAt;
      }
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return orders;
  }, [search, statusFilter, sideFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredOrders.length / perPage);
  const paginatedOrders = filteredOrders.slice((page - 1) * perPage, page * perPage);

  const statCounts = {
    total: adminOrders.length,
    open: adminOrders.filter(o => o.status === "open").length,
    filled: adminOrders.filter(o => o.status === "filled").length,
    partial: adminOrders.filter(o => o.status === "partially_filled").length,
    cancelled: adminOrders.filter(o => o.status === "cancelled").length,
    totalVolume: adminOrders.reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Management</h1>
          <p className="text-sm text-muted mt-1">Monitor and manage all trading orders</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Total Orders", value: statCounts.total.toString(), color: "text-foreground" },
          { label: "Open", value: statCounts.open.toString(), color: "text-info" },
          { label: "Filled", value: statCounts.filled.toString(), color: "text-accent" },
          { label: "Partial Fill", value: statCounts.partial.toString(), color: "text-warning" },
          { label: "Cancelled", value: statCounts.cancelled.toString(), color: "text-muted" },
          { label: "Total Volume", value: `$${formatNumber(statCounts.totalVolume)}`, color: "text-purple" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <p className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
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
            placeholder="Search by order ID, user, or pair..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="filled">Filled</option>
            <option value="partially_filled">Partial Fill</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={sideFilter}
            onChange={(e) => { setSideFilter(e.target.value as SideFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Sides</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
              <th className="text-left px-5 py-3">Order ID</th>
              <th className="text-left px-3 py-3">User</th>
              <th className="text-left px-3 py-3">Pair</th>
              <th className="text-center px-3 py-3">Side</th>
              <th className="text-left px-3 py-3">Type</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("price")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Price <ArrowUpDown className={`h-3 w-3 ${sortField === "price" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-right px-3 py-3">Amount / Filled</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("total")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Total <ArrowUpDown className={`h-3 w-3 ${sortField === "total" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-left px-3 py-3">Status</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("createdAt")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Created <ArrowUpDown className={`h-3 w-3 ${sortField === "createdAt" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-center px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginatedOrders.map((order, i) => {
              const fillPercent = order.amount > 0 ? (order.filled / order.amount) * 100 : 0;
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-card-hover transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-mono font-medium text-foreground">{order.id}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs font-semibold text-foreground">{order.username}</p>
                    <p className="text-[10px] text-muted">{order.userId}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs font-semibold text-foreground">{order.pair}</p>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${
                      order.side === "buy" ? "text-accent" : "text-danger"
                    }`}>
                      {order.side === "buy" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {order.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className="text-[10px] px-2 py-1 rounded-lg font-medium bg-card-hover text-foreground">
                      {typeLabels[order.type]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs font-medium text-foreground font-mono">
                      ${order.price.toLocaleString()}
                    </p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs font-medium text-foreground font-mono">
                      {order.filled.toLocaleString()} / {order.amount.toLocaleString()}
                    </p>
                    {/* Fill bar */}
                    <div className="mt-1 h-1 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          fillPercent === 100 ? "bg-accent" : fillPercent > 0 ? "bg-warning" : "bg-border-light"
                        }`}
                        style={{ width: `${fillPercent}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs font-bold text-foreground font-mono">${order.total.toLocaleString()}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs text-muted">{order.createdAt}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {order.status === "open" && (
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Cancel">
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
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
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredOrders.length)} of {filteredOrders.length} orders
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card"
              )}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

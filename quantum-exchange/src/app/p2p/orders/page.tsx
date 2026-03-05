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
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  MessageSquare,
  Filter,
} from "lucide-react";
import { p2pOrders } from "@/data/p2pData";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "pending" | "paid" | "completed" | "cancelled" | "disputed";

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: { label: "Pending Payment", color: "text-warning bg-warning/10", icon: Clock },
  paid: { label: "Paid", color: "text-info bg-info/10", icon: Clock },
  releasing: { label: "Releasing", color: "text-info bg-info/10", icon: Clock },
  completed: { label: "Completed", color: "text-accent bg-accent/10", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-muted bg-background", icon: XCircle },
  disputed: { label: "Disputed", color: "text-danger bg-danger/10", icon: AlertTriangle },
  appealed: { label: "Appealed", color: "text-warning bg-warning/10", icon: AlertTriangle },
};

export default function P2POrdersPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "buy" | "sell">("all");

  const filteredOrders = useMemo(() => {
    return p2pOrders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (typeFilter !== "all" && order.type !== typeFilter) return false;
      if (search && !order.id.toLowerCase().includes(search.toLowerCase()) && !order.crypto.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [statusFilter, search, typeFilter]);

  const stats = useMemo(() => ({
    total: p2pOrders.length,
    completed: p2pOrders.filter((o) => o.status === "completed").length,
    pending: p2pOrders.filter((o) => ["pending", "paid", "releasing"].includes(o.status)).length,
    totalVolume: p2pOrders
      .filter((o) => o.status === "completed")
      .reduce((sum, o) => sum + o.fiatAmount, 0),
  }), []);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/p2p"
            className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">P2P Orders</h1>
            <p className="text-sm text-muted">Your P2P trading history</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Orders", value: stats.total.toString() },
            { label: "Completed", value: stats.completed.toString() },
            { label: "Active", value: stats.pending.toString() },
            { label: "Volume (Completed)", value: `Rp ${(stats.totalVolume / 1000000).toFixed(1)}M` },
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
              placeholder="Search by order ID..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {(["all", "buy", "sell"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize",
                  typeFilter === type
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-foreground bg-card border border-border"
                )}
              >
                {type === "all" ? "All Types" : type}
              </button>
            ))}
            <div className="w-px h-6 bg-border" />
            {(["all", "pending", "completed", "cancelled"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors capitalize",
                  statusFilter === status
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-muted hover:text-foreground bg-card border border-border"
                )}
              >
                {status === "all" ? "All Status" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl bg-card border border-border p-12 text-center">
              <p className="text-muted text-sm">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order, i) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = config.icon;
              const fiatSymbol = order.fiat === "IDR" ? "Rp" : order.fiat === "USD" ? "$" : order.fiat;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/p2p/order/${order.id}`}
                    className="block rounded-2xl bg-card border border-border p-5 hover:border-border-light transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Type + Crypto */}
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          order.type === "buy" ? "bg-accent/10" : "bg-danger/10"
                        )}>
                          {order.type === "buy" ? (
                            <ArrowDownRight className="h-5 w-5 text-accent" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-danger" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-xs font-bold uppercase",
                              order.type === "buy" ? "text-accent" : "text-danger"
                            )}>
                              {order.type}
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {order.amount} {order.crypto}
                            </span>
                          </div>
                          <p className="text-[10px] text-muted">{order.id}</p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted">Price</p>
                          <p className="text-foreground font-mono">
                            {fiatSymbol} {order.price.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Total</p>
                          <p className="text-foreground font-mono">
                            {fiatSymbol} {order.fiatAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted">Counterparty</p>
                          <div className="flex items-center gap-1">
                            <span className="text-foreground">{order.counterparty.name}</span>
                            {order.counterparty.isVerified && (
                              <CheckCircle2 className="h-3 w-3 text-accent" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status + Date */}
                      <div className="flex items-center gap-3">
                        <div>
                          <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium", config.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {config.label}
                          </span>
                          <p className="text-[10px] text-muted mt-1 text-right">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        {order.chatMessages.length > 0 && (
                          <div className="flex items-center gap-1 text-muted">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span className="text-[10px]">{order.chatMessages.length}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

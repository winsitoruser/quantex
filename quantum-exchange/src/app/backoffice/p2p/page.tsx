"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Eye,
  Ban,
  MessageSquare,
  Users,
  ArrowRightLeft,
  Shield,
  TrendingUp,
  Filter,
  ChevronDown,
  Flag,
} from "lucide-react";
import { p2pAds, p2pOrders, p2pMerchants } from "@/data/p2pData";
import { cn } from "@/lib/utils";

type Tab = "orders" | "ads" | "merchants" | "disputes";

const orderStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-warning bg-warning/10" },
  paid: { label: "Paid", color: "text-info bg-info/10" },
  releasing: { label: "Releasing", color: "text-info bg-info/10" },
  completed: { label: "Completed", color: "text-accent bg-accent/10" },
  cancelled: { label: "Cancelled", color: "text-muted bg-background" },
  disputed: { label: "Disputed", color: "text-danger bg-danger/10" },
  appealed: { label: "Appealed", color: "text-warning bg-warning/10" },
};

export default function BackofficeP2PPage() {
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const tabs: { key: Tab; label: string; icon: typeof ArrowRightLeft; count?: number }[] = [
    { key: "orders", label: "Orders", icon: ArrowRightLeft, count: p2pOrders.length },
    { key: "ads", label: "Advertisements", icon: TrendingUp, count: p2pAds.length },
    { key: "merchants", label: "Merchants", icon: Users, count: p2pMerchants.length },
    { key: "disputes", label: "Disputes", icon: Flag, count: 2 },
  ];

  // Stats
  const stats = {
    totalOrders: p2pOrders.length,
    activeOrders: p2pOrders.filter((o) => ["pending", "paid", "releasing"].includes(o.status)).length,
    totalVolume: p2pOrders.reduce((sum, o) => sum + o.fiatAmount, 0),
    totalAds: p2pAds.length,
    activeMerchants: p2pMerchants.filter((m) => m.onlineStatus === "online").length,
    disputes: 2,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">P2P Management</h1>
        <p className="text-sm text-muted">Monitor and manage P2P trading activities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Orders", value: stats.totalOrders, icon: ArrowRightLeft },
          { label: "Active Orders", value: stats.activeOrders, icon: Clock },
          { label: "Total Volume", value: `Rp ${(stats.totalVolume / 1000000).toFixed(1)}M`, icon: TrendingUp },
          { label: "Active Ads", value: stats.totalAds, icon: TrendingUp },
          { label: "Online Merchants", value: stats.activeMerchants, icon: Users },
          { label: "Open Disputes", value: stats.disputes, icon: Flag, highlight: true },
        ].map(({ label, value, icon: Icon, highlight }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "rounded-2xl bg-card border p-4",
              highlight ? "border-danger/30" : "border-border"
            )}
          >
            <Icon className={cn("h-4 w-4 mb-2", highlight ? "text-danger" : "text-accent")} />
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
              {tab.count !== undefined && (
                <span className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded-full",
                  activeTab === tab.key ? "bg-accent/10 text-accent" : "bg-background text-muted"
                )}>
                  {tab.count}
                </span>
              )}
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

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Asset / Amount</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-2">Counterparty</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 hidden lg:block">Date</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {p2pOrders.map((order, i) => {
            const config = orderStatusConfig[order.status] || orderStatusConfig.pending;
            const fiatSymbol = order.fiat === "IDR" ? "Rp " : "$";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors text-sm"
              >
                <div className="col-span-2">
                  <p className="text-xs font-mono text-foreground">{order.id}</p>
                </div>
                <div className="col-span-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    order.type === "buy" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"
                  )}>
                    {order.type}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-foreground">{order.amount} {order.crypto}</p>
                  <p className="text-[10px] text-muted">@ {fiatSymbol}{order.price.toLocaleString()}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs font-semibold text-foreground font-mono">{fiatSymbol}{order.fiatAmount.toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-[8px] font-bold text-foreground">
                      {order.counterparty.avatar}
                    </div>
                    <span className="text-xs text-foreground">{order.counterparty.name}</span>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className={cn("text-[10px] px-2 py-1 rounded-full font-medium", config.color)}>
                    {config.label}
                  </span>
                </div>
                <div className="col-span-1 hidden lg:block">
                  <p className="text-[10px] text-muted">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="View">
                    <Eye className="h-3 w-3" />
                  </button>
                  {["pending", "paid"].includes(order.status) && (
                    <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-danger transition-colors" title="Cancel">
                      <Ban className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Ads Tab */}
      {activeTab === "ads" && (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-5 py-3 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-2">Merchant</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Asset / Price</div>
            <div className="col-span-2 text-right">Available</div>
            <div className="col-span-2">Limit</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {p2pAds.map((ad, i) => {
            const fiatSymbol = ad.fiat === "IDR" ? "Rp " : "$";
            return (
              <motion.div
                key={ad.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-[8px] font-bold text-foreground">
                      {ad.merchant.avatar}
                    </div>
                    <div>
                      <span className="text-xs text-foreground block">{ad.merchant.name}</span>
                      {ad.merchant.isMerchant && (
                        <span className="text-[8px] text-accent">Merchant</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded",
                    ad.type === "sell" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"
                  )}>
                    {ad.type}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-foreground">{ad.crypto}/{ad.fiat}</p>
                  <p className="text-[10px] text-muted font-mono">{fiatSymbol}{ad.price.toLocaleString()}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="text-xs text-foreground font-mono">{ad.available.toLocaleString()} {ad.crypto}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] text-muted font-mono">
                    {fiatSymbol}{ad.minLimit.toLocaleString()} - {fiatSymbol}{ad.maxLimit.toLocaleString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-1">
                    {ad.paymentMethods.slice(0, 2).map((pm) => (
                      <span key={pm} className="text-[9px] px-1.5 py-0.5 rounded bg-background border border-border text-muted">
                        {pm}
                      </span>
                    ))}
                    {ad.paymentMethods.length > 2 && (
                      <span className="text-[9px] text-muted">+{ad.paymentMethods.length - 2}</span>
                    )}
                  </div>
                </div>
                <div className="col-span-1 flex items-center justify-end gap-1">
                  <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors" title="View">
                    <Eye className="h-3 w-3" />
                  </button>
                  <button className="h-7 w-7 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-danger transition-colors" title="Suspend">
                    <Ban className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Merchants Tab */}
      {activeTab === "merchants" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {p2pMerchants.map((merchant, i) => (
            <motion.div
              key={merchant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-sm font-bold text-foreground">
                    {merchant.avatar}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
                    merchant.onlineStatus === "online" ? "bg-accent" : merchant.onlineStatus === "away" ? "bg-warning" : "bg-muted"
                  )} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground text-sm">{merchant.name}</span>
                    {merchant.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {merchant.isMerchant && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">Merchant</span>
                    )}
                    <span className="text-[10px] text-muted">{merchant.registeredDays}d</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2 bg-background rounded-lg text-center">
                  <p className="text-xs font-bold text-foreground">{merchant.totalTrades.toLocaleString()}</p>
                  <p className="text-[9px] text-muted">Trades</p>
                </div>
                <div className="p-2 bg-background rounded-lg text-center">
                  <p className="text-xs font-bold text-accent">{merchant.completionRate}%</p>
                  <p className="text-[9px] text-muted">Completion</p>
                </div>
                <div className="p-2 bg-background rounded-lg text-center">
                  <p className="text-xs font-bold text-foreground">{merchant.avgReleaseTime}</p>
                  <p className="text-[9px] text-muted">Avg Release</p>
                </div>
                <div className="p-2 bg-background rounded-lg text-center">
                  <p className="text-xs font-bold text-foreground">{merchant.positiveRate}%</p>
                  <p className="text-[9px] text-muted">Positive</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-background border border-border text-xs font-medium text-muted hover:text-foreground transition-colors">
                  View Details
                </button>
                <button className="py-2 px-3 rounded-lg bg-background border border-border text-xs text-muted hover:text-danger transition-colors">
                  <Ban className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Disputes Tab */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          {[
            {
              id: "DSP-001",
              orderId: "P2P-20250305-001",
              buyer: "User_XYZ",
              seller: "CryptoKing88",
              amount: "500 USDT",
              total: "Rp 7,925,000",
              reason: "Buyer claims payment sent but seller disputes receipt",
              status: "open",
              createdAt: "2025-03-05T14:00:00Z",
            },
            {
              id: "DSP-002",
              orderId: "P2P-20250304-010",
              buyer: "TraderJoe",
              seller: "FastTrade_ID",
              amount: "1,000 USDT",
              total: "Rp 15,870,000",
              reason: "Seller did not release crypto after payment confirmation",
              status: "investigating",
              createdAt: "2025-03-04T18:00:00Z",
            },
          ].map((dispute, i) => (
            <motion.div
              key={dispute.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-danger/20 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-danger/10 flex items-center justify-center">
                    <Flag className="h-5 w-5 text-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{dispute.id}</p>
                    <p className="text-[10px] text-muted">Order: {dispute.orderId}</p>
                  </div>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <p className="text-muted">Buyer</p>
                      <p className="text-foreground">{dispute.buyer}</p>
                    </div>
                    <div>
                      <p className="text-muted">Seller</p>
                      <p className="text-foreground">{dispute.seller}</p>
                    </div>
                    <div>
                      <p className="text-muted">Amount</p>
                      <p className="text-foreground">{dispute.amount}</p>
                    </div>
                    <div>
                      <p className="text-muted">Total</p>
                      <p className="text-foreground">{dispute.total}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-background rounded-xl">
                    <p className="text-[10px] text-muted mb-0.5">Reason</p>
                    <p className="text-xs text-foreground">{dispute.reason}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <span className={cn(
                    "text-[10px] px-2 py-1 rounded-full font-medium",
                    dispute.status === "open" ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
                  )}>
                    {dispute.status === "open" ? "Open" : "Investigating"}
                  </span>
                  <div className="flex gap-1">
                    <button className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-[10px] font-medium hover:bg-accent/20 transition-colors">
                      Release to Buyer
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-[10px] font-medium hover:bg-danger/20 transition-colors">
                      Refund Seller
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

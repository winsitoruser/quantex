"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  ArrowRightLeft,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Activity,
  Wallet,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from "recharts";
import {
  platformStats,
  revenueHistory,
  volumeByAsset,
  systemAlerts,
  adminTransactions,
  hotWalletBalances,
} from "@/data/adminData";
import { formatNumber } from "@/lib/utils";

const COLORS = ["#00c26f", "#06b6d4", "#8b5cf6", "#f59e0b", "#3b82f6", "#ef4444"];

export default function BackofficeDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const stats = [
    { label: "Total Users", value: platformStats.totalUsers.toLocaleString(), change: "+1,247 today", positive: true, icon: Users, color: "text-info" },
    { label: "Active Users (24h)", value: platformStats.activeUsers24h.toLocaleString(), change: "14.9% of total", positive: true, icon: Activity, color: "text-accent" },
    { label: "Volume (24h)", value: `$${formatNumber(platformStats.totalVolume24h)}`, change: "+12.3%", positive: true, icon: BarChart3, color: "text-purple" },
    { label: "Revenue (24h)", value: `$${formatNumber(platformStats.revenue24h)}`, change: "+8.7%", positive: true, icon: DollarSign, color: "text-warning" },
    { label: "Trades (24h)", value: platformStats.totalTrades24h.toLocaleString(), change: "+15.2%", positive: true, icon: ArrowRightLeft, color: "text-cyan" },
    { label: "System Uptime", value: `${platformStats.systemUptime}%`, change: "All systems normal", positive: true, icon: TrendingUp, color: "text-accent" },
  ];

  const pendingActions = [
    { label: "Pending KYC Reviews", value: platformStats.pendingKYC, icon: ShieldCheck, color: "text-warning", href: "/backoffice/kyc" },
    { label: "Pending Withdrawals", value: platformStats.pendingWithdrawals, icon: Clock, color: "text-info", href: "/backoffice/transactions" },
    { label: "Active Alerts", value: systemAlerts.filter(a => !a.resolved).length, icon: AlertTriangle, color: "text-danger", href: "/backoffice/alerts" },
  ];

  const unresolvedAlerts = systemAlerts.filter(a => !a.resolved);
  const recentTxs = adminTransactions.slice(0, 6);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl">
          <p className="text-[10px] text-muted mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-xs font-bold text-foreground font-mono">
              {p.dataKey === "revenue" ? `$${formatNumber(p.value)}` : p.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Platform overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-lg font-bold text-foreground font-mono">{stat.value}</p>
              <p className="text-[10px] text-muted mt-1">{stat.label}</p>
              <p className={`text-[10px] mt-0.5 ${stat.positive ? "text-accent" : "text-danger"}`}>
                {stat.change}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Pending Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {pendingActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.a
              key={action.label}
              href={action.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 rounded-2xl bg-card border border-border p-4 hover:border-border-light transition-all group"
            >
              <div className={`h-12 w-12 rounded-xl bg-background border border-border flex items-center justify-center ${action.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground font-mono">{action.value}</p>
                <p className="text-xs text-muted">{action.label}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.a>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            Monthly Revenue & User Growth
          </h3>
          <div className="h-[280px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00c26f" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#00c26f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#1e2333" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1e6).toFixed(0)}M`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" stroke="#00c26f" strokeWidth={2} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Volume by Asset */}
        <div className="rounded-2xl bg-card border border-border p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple" />
            Volume by Asset
          </h3>
          <div className="h-[200px]">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={volumeByAsset}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="volume"
                    stroke="none"
                  >
                    {volumeByAsset.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl">
                            <p className="text-xs font-semibold text-foreground">{data.asset}</p>
                            <p className="text-[10px] text-muted">${formatNumber(data.volume)} ({data.percentage}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-2 mt-3">
            {volumeByAsset.map((item, i) => (
              <div key={item.asset} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs text-muted">{item.asset}</span>
                <span className="text-xs font-medium text-foreground ml-auto font-mono">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-cyan" />
              Recent Transactions
            </h3>
            <a href="/backoffice/transactions" className="text-xs text-accent hover:text-accent-hover transition-colors">
              View All
            </a>
          </div>
          <div className="divide-y divide-border/50">
            {recentTxs.map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-card-hover transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  tx.type === "deposit" ? "bg-accent/10 text-accent" :
                  tx.type === "withdrawal" ? "bg-danger/10 text-danger" :
                  tx.type === "trade" ? "bg-info/10 text-info" :
                  "bg-purple/10 text-purple"
                }`}>
                  {tx.type === "deposit" ? <ArrowDownRight className="h-4 w-4" /> :
                   tx.type === "withdrawal" ? <ArrowUpRight className="h-4 w-4" /> :
                   <ArrowRightLeft className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground">{tx.username}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                      tx.status === "completed" ? "bg-accent/10 text-accent" :
                      tx.status === "pending" ? "bg-warning/10 text-warning" :
                      tx.status === "reviewing" ? "bg-info/10 text-info" :
                      "bg-danger/10 text-danger"
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted truncate">
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} · {tx.asset} · {tx.timestamp}
                  </p>
                </div>
                <p className="text-xs font-bold text-foreground font-mono shrink-0">
                  ${tx.usdValue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts + Hot Wallets */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-danger" />
                Active Alerts
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-danger/10 text-danger font-medium">
                {unresolvedAlerts.length} unresolved
              </span>
            </div>
            <div className="divide-y divide-border/50">
              {unresolvedAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="px-5 py-3 hover:bg-card-hover transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`h-2 w-2 rounded-full ${
                      alert.type === "critical" ? "bg-danger" :
                      alert.type === "warning" ? "bg-warning" : "bg-info"
                    }`} />
                    <p className="text-xs font-semibold text-foreground">{alert.title}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ml-auto ${
                      alert.type === "critical" ? "bg-danger/10 text-danger" :
                      alert.type === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted line-clamp-1">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hot Wallet Balances */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Wallet className="h-4 w-4 text-warning" />
                Hot Wallet Balances
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {hotWalletBalances.slice(0, 4).map((w) => (
                <div key={w.asset} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-xs font-bold text-foreground">
                    {w.asset.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{w.asset}</p>
                    <p className="text-[10px] text-muted font-mono">{w.balance.toLocaleString()} {w.asset}</p>
                  </div>
                  <p className="text-xs font-bold text-foreground font-mono">${formatNumber(w.usdValue)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Activity,
  PieChart,
  Users,
  Percent,
  Eye,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
  Legend,
} from "recharts";
import {
  monthlyPnL,
  assetPnL,
  dailyPnL,
  topTradersPnL,
  platformStats,
  adminTransactions,
} from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Tab = "overview" | "assets" | "traders" | "transactions";
type Period = "7d" | "14d" | "30d" | "all";

const COLORS = ["#00C087", "#3B82F6", "#A855F7", "#F59E0B", "#EF4444", "#06B6D4", "#EC4899", "#84CC16"];

export default function BackofficePnLPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [period, setPeriod] = useState<Period>("all");
  const [traderSort, setTraderSort] = useState<"volume" | "pnl" | "fees" | "winRate">("volume");
  const [traderSortDir, setTraderSortDir] = useState<"desc" | "asc">("desc");

  // Computed stats
  const totalRevenue = dailyPnL.reduce((s, d) => s + d.revenue, 0);
  const totalCosts = dailyPnL.reduce((s, d) => s + d.costs, 0);
  const totalProfit = dailyPnL.reduce((s, d) => s + d.profit, 0);
  const totalVolume = dailyPnL.reduce((s, d) => s + d.volume, 0);
  const totalTrades = dailyPnL.reduce((s, d) => s + d.trades, 0);
  const avgDailyProfit = totalProfit / dailyPnL.length;
  const profitMargin = (totalProfit / totalRevenue) * 100;
  const latestMonth = monthlyPnL[monthlyPnL.length - 1];
  const prevMonth = monthlyPnL[monthlyPnL.length - 2];
  const profitGrowth = ((latestMonth.netProfit - prevMonth.netProfit) / prevMonth.netProfit) * 100;

  // Period filter for daily chart
  const filteredDaily = useMemo(() => {
    if (period === "7d") return dailyPnL.slice(-7);
    if (period === "14d") return dailyPnL.slice(-14);
    if (period === "30d") return dailyPnL.slice(-30);
    return dailyPnL;
  }, [period]);

  // Sorted traders
  const sortedTraders = useMemo(() => {
    const t = [...topTradersPnL];
    t.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (traderSort) {
        case "pnl": aVal = a.pnl; bVal = b.pnl; break;
        case "fees": aVal = a.totalFees; bVal = b.totalFees; break;
        case "winRate": aVal = a.winRate; bVal = b.winRate; break;
        default: aVal = a.totalVolume; bVal = b.totalVolume;
      }
      return traderSortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
    return t;
  }, [traderSort, traderSortDir]);

  const handleTraderSort = (field: typeof traderSort) => {
    if (traderSort === field) setTraderSortDir(d => d === "desc" ? "asc" : "desc");
    else { setTraderSort(field); setTraderSortDir("desc"); }
  };

  // Revenue breakdown pie data
  const revenuePie = [
    { name: "Trading Fees", value: latestMonth.tradingFees },
    { name: "Withdrawal Fees", value: latestMonth.withdrawalFees },
    { name: "Listing Fees", value: latestMonth.listingFees },
    { name: "Staking Revenue", value: latestMonth.stakingRevenue },
  ];

  // Fee by asset pie
  const assetFeePie = assetPnL.map(a => ({ name: a.asset, value: a.totalFees }));

  // Transaction summary by type
  const txSummary = {
    deposits: adminTransactions.filter(t => t.type === "deposit"),
    withdrawals: adminTransactions.filter(t => t.type === "withdrawal"),
    trades: adminTransactions.filter(t => t.type === "trade"),
    transfers: adminTransactions.filter(t => t.type === "transfer"),
    fees: adminTransactions.filter(t => t.type === "fee"),
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "P&L Overview" },
    { id: "assets", label: "Asset Breakdown" },
    { id: "traders", label: "Top Traders" },
    { id: "transactions", label: "Transaction Info" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profit & Loss Analytics</h1>
          <p className="text-sm text-muted mt-1">Platform revenue, costs, and performance analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden">
            {(["7d", "14d", "30d", "all"] as Period[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  period === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                )}
              >
                {p === "all" ? "All" : p}
              </button>
            ))}
          </div>
          <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Total Revenue", value: `$${formatNumber(totalRevenue)}`, icon: DollarSign, color: "text-accent", sub: `${period === "all" ? "16 days" : period}` },
          { label: "Total Costs", value: `$${formatNumber(totalCosts)}`, icon: TrendingDown, color: "text-danger", sub: "Operating expenses" },
          { label: "Net Profit", value: `$${formatNumber(totalProfit)}`, icon: TrendingUp, color: "text-accent", sub: `Margin ${profitMargin.toFixed(1)}%` },
          { label: "Avg Daily Profit", value: `$${formatNumber(avgDailyProfit)}`, icon: Activity, color: "text-info", sub: "Per day" },
          { label: "Total Volume", value: `$${formatNumber(totalVolume)}`, icon: BarChart3, color: "text-purple", sub: `${formatNumber(totalTrades)} trades` },
          { label: "Profit Growth", value: `${profitGrowth > 0 ? "+" : ""}${profitGrowth.toFixed(1)}%`, icon: profitGrowth > 0 ? ArrowUpRight : ArrowDownRight, color: profitGrowth > 0 ? "text-accent" : "text-danger", sub: "vs prev month" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-card border border-border p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-[10px] text-muted uppercase tracking-wider">{s.label}</span>
              </div>
              <p className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-muted mt-1">{s.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 px-4 py-2 text-xs font-medium rounded-lg transition-colors",
              activeTab === tab.id ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW TAB ============ */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Daily P&L Chart */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              Daily Revenue vs Costs vs Profit
            </h3>
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={filteredDaily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [`$${formatNumber(value)}`, undefined]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#00C087" opacity={0.3} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costs" name="Costs" fill="#EF4444" opacity={0.3} radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="profit" name="Net Profit" stroke="#00C087" strokeWidth={2.5} dot={{ fill: "#00C087", r: 3 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Revenue Breakdown Pie */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-info" />
                Revenue Sources (Latest Month)
              </h3>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={revenuePie}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {revenuePie.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      formatter={(value: any) => [`$${formatNumber(value)}`, undefined]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly P&L Table */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple" />
                Monthly P&L Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-medium text-muted uppercase tracking-wider">
                      <th className="text-left py-2.5 px-2">Month</th>
                      <th className="text-right py-2.5 px-2">Trading Fees</th>
                      <th className="text-right py-2.5 px-2">Other Rev</th>
                      <th className="text-right py-2.5 px-2">Costs</th>
                      <th className="text-right py-2.5 px-2">Net Profit</th>
                      <th className="text-right py-2.5 px-2">Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {monthlyPnL.map((m, i) => {
                      const otherRev = m.withdrawalFees + m.listingFees + m.stakingRevenue;
                      const totalRev = m.tradingFees + otherRev;
                      const margin = ((m.netProfit / totalRev) * 100).toFixed(1);
                      return (
                        <motion.tr key={m.month} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="hover:bg-card-hover transition-colors">
                          <td className="py-3 px-2">
                            <p className="text-xs font-semibold text-foreground">{m.month}</p>
                            <p className="text-[10px] text-muted">{formatNumber(m.trades)} trades</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="text-xs font-mono font-medium text-foreground">${formatNumber(m.tradingFees)}</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="text-xs font-mono text-muted">${formatNumber(otherRev)}</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="text-xs font-mono text-danger">${formatNumber(m.operatingCosts)}</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="text-xs font-mono font-bold text-accent">${formatNumber(m.netProfit)}</p>
                            <p className="text-[10px] text-muted">{margin}% margin</p>
                          </td>
                          <td className="py-3 px-2 text-right">
                            <p className="text-xs font-mono text-muted">${formatNumber(m.volume)}</p>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple" />
              Daily Trading Volume
            </h3>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredDaily}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(1)}B`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [`$${formatNumber(value)}`, undefined]}
                  />
                  <Area type="monotone" dataKey="volume" name="Volume" stroke="#A855F7" fill="#A855F7" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============ ASSETS TAB ============ */}
      {activeTab === "assets" && (
        <div className="space-y-6">
          {/* Fee by Asset Pie + Asset Table */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4 text-info" />
                Fee Revenue by Asset
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={assetFeePie} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value">
                      {assetFeePie.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                      formatter={(value: any) => [`$${formatNumber(value)}`, undefined]}
                    />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-card border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  Asset P&L Breakdown
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-medium text-muted uppercase tracking-wider">
                      <th className="text-left px-4 py-2.5">Asset</th>
                      <th className="text-right px-3 py-2.5">Total Volume</th>
                      <th className="text-right px-3 py-2.5">Fee Revenue</th>
                      <th className="text-right px-3 py-2.5">Buy Vol</th>
                      <th className="text-right px-3 py-2.5">Sell Vol</th>
                      <th className="text-right px-3 py-2.5">Net Flow</th>
                      <th className="text-right px-3 py-2.5">Spread</th>
                      <th className="text-right px-3 py-2.5">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {assetPnL.map((a, i) => (
                      <motion.tr key={a.asset} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-card-hover transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-foreground">{a.asset}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-foreground">${formatNumber(a.totalVolume)}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono font-bold text-accent">${formatNumber(a.totalFees)}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-info">${formatNumber(a.buyVolume)}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-danger">${formatNumber(a.sellVolume)}</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className={cn("text-xs font-mono font-medium", a.netFlow > 0 ? "text-accent" : "text-danger")}>
                            {a.netFlow > 0 ? "+" : ""}${formatNumber(a.netFlow)}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-muted">{(a.avgSpread * 100).toFixed(2)}%</span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <span className="text-xs font-mono text-warning">{(a.profitMargin * 100).toFixed(2)}%</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-border bg-card-hover">
                      <td className="px-4 py-3"><span className="text-xs font-bold text-foreground">TOTAL</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-foreground">${formatNumber(assetPnL.reduce((s, a) => s + a.totalVolume, 0))}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-accent">${formatNumber(assetPnL.reduce((s, a) => s + a.totalFees, 0))}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-info">${formatNumber(assetPnL.reduce((s, a) => s + a.buyVolume, 0))}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-danger">${formatNumber(assetPnL.reduce((s, a) => s + a.sellVolume, 0))}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-accent">+${formatNumber(assetPnL.reduce((s, a) => s + a.netFlow, 0))}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs text-muted">—</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs text-muted">—</span></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          {/* Asset Volume Bar Chart */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple" />
              Buy vs Sell Volume by Asset
            </h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetPnL} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="asset" tick={{ fontSize: 11, fill: "#888" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#888" }} tickFormatter={(v) => `$${(v / 1_000_000_000).toFixed(0)}B`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }}
                    formatter={(value: any) => [`$${formatNumber(value)}`, undefined]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="buyVolume" name="Buy Volume" fill="#3B82F6" radius={[4, 4, 0, 0]} opacity={0.8} />
                  <Bar dataKey="sellVolume" name="Sell Volume" fill="#EF4444" radius={[4, 4, 0, 0]} opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ============ TRADERS TAB ============ */}
      {activeTab === "traders" && (
        <div className="space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Traders", value: topTradersPnL.length, color: "text-foreground" },
              { label: "Profitable", value: topTradersPnL.filter(t => t.pnl > 0).length, color: "text-accent" },
              { label: "In Loss", value: topTradersPnL.filter(t => t.pnl < 0).length, color: "text-danger" },
              { label: "Total Fees Collected", value: `$${formatNumber(topTradersPnL.reduce((s, t) => s + t.totalFees, 0))}`, color: "text-warning" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center">
                <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Traders Table */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-[10px] font-medium text-muted uppercase tracking-wider">
                  <th className="text-left px-5 py-3">#</th>
                  <th className="text-left px-3 py-3">Trader</th>
                  <th className="text-right px-3 py-3">
                    <button onClick={() => handleTraderSort("volume")} className="inline-flex items-center gap-1 hover:text-foreground">
                      30d Volume <ArrowUpDown className={`h-3 w-3 ${traderSort === "volume" ? "text-accent" : ""}`} />
                    </button>
                  </th>
                  <th className="text-right px-3 py-3">
                    <button onClick={() => handleTraderSort("fees")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Fees Paid <ArrowUpDown className={`h-3 w-3 ${traderSort === "fees" ? "text-accent" : ""}`} />
                    </button>
                  </th>
                  <th className="text-right px-3 py-3">Trades</th>
                  <th className="text-right px-3 py-3">
                    <button onClick={() => handleTraderSort("pnl")} className="inline-flex items-center gap-1 hover:text-foreground">
                      P&L <ArrowUpDown className={`h-3 w-3 ${traderSort === "pnl" ? "text-accent" : ""}`} />
                    </button>
                  </th>
                  <th className="text-right px-3 py-3">
                    <button onClick={() => handleTraderSort("winRate")} className="inline-flex items-center gap-1 hover:text-foreground">
                      Win Rate <ArrowUpDown className={`h-3 w-3 ${traderSort === "winRate" ? "text-accent" : ""}`} />
                    </button>
                  </th>
                  <th className="text-left px-3 py-3">Last Active</th>
                  <th className="text-center px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {sortedTraders.map((t, i) => (
                  <motion.tr key={t.userId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-card-hover transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-muted">{i + 1}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <p className="text-xs font-semibold text-foreground">{t.username}</p>
                      <p className="text-[10px] text-muted font-mono">{t.userId}</p>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-mono font-medium text-foreground">${formatNumber(t.totalVolume)}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-mono text-warning">${formatNumber(t.totalFees)}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className="text-xs font-mono text-muted">{t.tradesCount.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <span className={cn("text-xs font-mono font-bold", t.pnl >= 0 ? "text-accent" : "text-danger")}>
                        {t.pnl >= 0 ? "+" : ""}${formatNumber(Math.abs(t.pnl))}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", t.winRate >= 50 ? "bg-accent" : "bg-danger")} style={{ width: `${t.winRate}%` }} />
                        </div>
                        <span className={cn("text-xs font-mono", t.winRate >= 50 ? "text-accent" : "text-danger")}>{t.winRate}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5">
                      <span className="text-[10px] text-muted">{t.lastActive}</span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center justify-center">
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="View Profile">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ TRANSACTIONS TAB ============ */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          {/* Transaction Type Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Deposits", count: txSummary.deposits.length, volume: txSummary.deposits.reduce((s, t) => s + t.usdValue, 0), color: "text-accent", bg: "bg-accent/10" },
              { label: "Withdrawals", count: txSummary.withdrawals.length, volume: txSummary.withdrawals.reduce((s, t) => s + t.usdValue, 0), color: "text-danger", bg: "bg-danger/10" },
              { label: "Trades", count: txSummary.trades.length, volume: txSummary.trades.reduce((s, t) => s + t.usdValue, 0), color: "text-info", bg: "bg-info/10" },
              { label: "Transfers", count: txSummary.transfers.length, volume: txSummary.transfers.reduce((s, t) => s + t.usdValue, 0), color: "text-purple", bg: "bg-purple/10" },
              { label: "Fees", count: txSummary.fees.length, volume: txSummary.fees.reduce((s, t) => s + t.usdValue, 0), color: "text-warning", bg: "bg-warning/10" },
            ].map(s => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${s.color} ${s.bg}`}>{s.label}</span>
                </div>
                <p className={`text-xl font-bold font-mono ${s.color}`}>{s.count}</p>
                <p className="text-[10px] text-muted mt-1">${formatNumber(s.volume)} total</p>
              </motion.div>
            ))}
          </div>

          {/* Deposit vs Withdrawal Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowUpRight className="h-4 w-4 text-accent" />
                Deposit Summary
              </h3>
              <div className="space-y-3">
                {txSummary.deposits.map((tx, i) => (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{tx.username}</p>
                        <p className="text-[10px] text-muted">{tx.id} · {tx.network || "Internal"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-accent">{tx.amount.toLocaleString()} {tx.asset}</p>
                      <p className="text-[10px] text-muted">${formatNumber(tx.usdValue)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <ArrowDownRight className="h-4 w-4 text-danger" />
                Withdrawal Summary
              </h3>
              <div className="space-y-3">
                {txSummary.withdrawals.map((tx, i) => (
                  <motion.div key={tx.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-danger/10 flex items-center justify-center">
                        <ArrowDownRight className="h-4 w-4 text-danger" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{tx.username}</p>
                        <p className="text-[10px] text-muted">{tx.id} · {tx.network || "Internal"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono font-bold text-danger">{tx.amount.toLocaleString()} {tx.asset}</p>
                      <div className="flex items-center justify-end gap-1.5 mt-0.5">
                        <p className="text-[10px] text-muted">${formatNumber(tx.usdValue)}</p>
                        <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium",
                          tx.status === "completed" ? "bg-accent/10 text-accent" :
                          tx.status === "pending" ? "bg-warning/10 text-warning" :
                          tx.status === "reviewing" ? "bg-info/10 text-info" :
                          "bg-danger/10 text-danger"
                        )}>{tx.status}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Net Flow & Trade Info */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-info" />
              Recent Trade Transactions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border text-[10px] font-medium text-muted uppercase tracking-wider">
                    <th className="text-left px-4 py-2.5">TX ID</th>
                    <th className="text-left px-3 py-2.5">User</th>
                    <th className="text-left px-3 py-2.5">Pair</th>
                    <th className="text-right px-3 py-2.5">Amount</th>
                    <th className="text-right px-3 py-2.5">USD Value</th>
                    <th className="text-left px-3 py-2.5">Status</th>
                    <th className="text-left px-3 py-2.5">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {txSummary.trades.map((tx, i) => (
                    <motion.tr key={tx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="hover:bg-card-hover transition-colors">
                      <td className="px-4 py-3"><span className="text-xs font-mono font-medium text-foreground">{tx.id}</span></td>
                      <td className="px-3 py-3"><span className="text-xs font-semibold text-foreground">{tx.username}</span></td>
                      <td className="px-3 py-3"><span className="text-xs font-medium text-info">{tx.asset}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono text-foreground">{tx.amount.toLocaleString()}</span></td>
                      <td className="px-3 py-3 text-right"><span className="text-xs font-mono font-bold text-foreground">${formatNumber(tx.usdValue)}</span></td>
                      <td className="px-3 py-3">
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium",
                          tx.status === "completed" ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                        )}>{tx.status}</span>
                      </td>
                      <td className="px-3 py-3"><span className="text-[10px] text-muted">{tx.timestamp}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Flow Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(() => {
              const totalDeposits = txSummary.deposits.reduce((s, t) => s + t.usdValue, 0);
              const totalWithdrawals = txSummary.withdrawals.reduce((s, t) => s + t.usdValue, 0);
              const netFlow = totalDeposits - totalWithdrawals;
              return [
                { label: "Total Deposits", value: `$${formatNumber(totalDeposits)}`, color: "text-accent", icon: ArrowUpRight },
                { label: "Total Withdrawals", value: `$${formatNumber(totalWithdrawals)}`, color: "text-danger", icon: ArrowDownRight },
                { label: "Net Flow", value: `${netFlow >= 0 ? "+" : "-"}$${formatNumber(Math.abs(netFlow))}`, color: netFlow >= 0 ? "text-accent" : "text-danger", icon: Activity },
              ];
            })().map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-xl bg-card border border-border p-5 text-center">
                  <Icon className={`h-6 w-6 mx-auto mb-2 ${s.color}`} />
                  <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

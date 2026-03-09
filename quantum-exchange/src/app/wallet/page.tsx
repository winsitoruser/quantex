"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Download,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Search,
  Plus,
  History,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { walletAssets } from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";
import DepositModal from "@/components/wallet/DepositModal";
import WithdrawModal from "@/components/wallet/WithdrawModal";
import TransferModal from "@/components/wallet/TransferModal";
import BuyCryptoModal from "@/components/wallet/BuyCryptoModal";
import WalletHistoryModal from "@/components/wallet/WalletHistoryModal";
import { useLanguage, useCurrency } from "@/i18n";
import Footer from "@/components/layout/Footer";

const balanceTimeframes = ["1W", "1M", "3M", "6M", "1Y", "All"];

const PORTFOLIO_COLORS = ["#f7931a", "#627eea", "#26a17b", "#9945ff", "#f3ba2f", "#00aae4", "#0033ad", "#c2a634"];

function generateBalanceHistory(days: number) {
  const data = [];
  let value = 45000;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    value += (Math.random() - 0.42) * value * 0.012;
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
}

export default function WalletPage() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const tabs = [t.wallet.tabs.overview, t.wallet.tabs.spot, t.wallet.tabs.futures, t.wallet.tabs.earn, t.wallet.tabs.funding];
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [balanceTf, setBalanceTf] = useState("1M");
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [buyCryptoOpen, setBuyCryptoOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof walletAssets[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const totalValue = walletAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalChange = 3.24;

  const filteredAssets = walletAssets.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol.toLowerCase().includes(search.toLowerCase())
  );

  // Portfolio distribution data for pie chart
  const portfolioData = useMemo(() => {
    const sorted = [...walletAssets].sort((a, b) => b.value - a.value);
    const top7 = sorted.slice(0, 7);
    const othersValue = sorted.slice(7).reduce((s, a) => s + a.value, 0);
    const items = top7.map((a) => ({
      name: a.symbol,
      value: a.value,
      percent: ((a.value / totalValue) * 100).toFixed(1),
    }));
    if (othersValue > 0) {
      items.push({ name: "Others", value: othersValue, percent: ((othersValue / totalValue) * 100).toFixed(1) });
    }
    return items;
  }, [totalValue]);

  // Area chart data
  const tfDays: Record<string, number> = { "1W": 7, "1M": 30, "3M": 90, "6M": 180, "1Y": 365, All: 730 };
  const balanceHistory = useMemo(() => generateBalanceHistory(tfDays[balanceTf] || 30), [balanceTf]);

  const handleDeposit = (asset?: typeof walletAssets[0]) => {
    setSelectedAsset(asset || null);
    setDepositOpen(true);
  };

  const handleWithdraw = (asset?: typeof walletAssets[0]) => {
    setSelectedAsset(asset || null);
    setWithdrawOpen(true);
  };

  const CustomTooltipArea = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-elevated border border-border rounded-lg px-2.5 py-1.5 shadow-xl">
          <p className="text-[10px] text-muted">{label}</p>
          <p className="text-[11px] font-bold text-foreground font-mono">${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Assets</h1>
              <p className="text-[12px] text-text-secondary mt-0.5">Manage your crypto portfolio</p>
            </div>
            <button 
              onClick={() => setHistoryOpen(true)}
              className="h-8 px-4 rounded-lg border border-border/60 text-[12px] font-medium text-text-secondary hover:text-foreground hover:bg-surface transition-colors inline-flex items-center gap-1.5"
            >
              <History className="h-3.5 w-3.5" /> History
            </button>
          </div>
        </div>
      </section>

      {/* Total Balance Card */}
      <section className="py-5">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl bg-surface/60 border border-border/50 p-5 lg:p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-[12px] text-text-secondary">{t.wallet.totalBalance}</p>
                  <button
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    {balanceVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <p className="text-3xl lg:text-[36px] font-bold text-foreground font-mono mb-1.5 tracking-tight leading-none">
                  {balanceVisible ? formatCurrency(totalValue) : "••••••••"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-bold",
                    totalChange >= 0 ? "text-accent bg-accent/10" : "text-danger bg-danger/10"
                  )}>
                    {totalChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {totalChange >= 0 ? "+" : ""}{formatPercent(totalChange)}
                  </span>
                  <span className="text-[11px] text-muted">24h</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {[
                  { icon: Download, label: t.common.deposit, primary: true, action: () => handleDeposit() },
                  { icon: Send, label: t.common.withdraw, primary: false, action: () => handleWithdraw() },
                  { icon: ArrowRightLeft, label: t.common.transfer, primary: false, action: () => setTransferOpen(true) },
                  { icon: Plus, label: t.common.buyCrypto, primary: false, action: () => setBuyCryptoOpen(true) },
                ].map(({ icon: Icon, label, primary, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className={cn(
                      "h-10 w-10 flex items-center justify-center rounded-xl transition-all",
                      primary
                        ? "bg-accent text-background hover:shadow-lg hover:shadow-accent/20"
                        : "bg-surface border border-border/60 text-foreground hover:border-accent/30"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-[10px] font-medium text-muted">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Distribution + Balance History */}
      <section className="pb-5">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {/* Portfolio Distribution */}
            <div className="rounded-xl bg-surface/60 border border-border/50 p-4 lg:p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <PieChartIcon className="h-3.5 w-3.5 text-muted" />
                <h3 className="text-[13px] font-semibold text-foreground">Portfolio Distribution</h3>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-[180px] h-[180px] lg:w-[200px] lg:h-[200px]">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                          stroke="none"
                        >
                          {portfolioData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PORTFOLIO_COLORS[index % PORTFOLIO_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload;
                              return (
                                <div className="bg-elevated border border-border rounded-lg px-2.5 py-1.5 shadow-xl">
                                  <p className="text-[11px] font-bold text-foreground">{d.name}</p>
                                  <p className="text-[10px] text-muted">{d.percent}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-1 mt-3 w-full max-w-xs">
                  {portfolioData.map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded shrink-0" style={{ backgroundColor: PORTFOLIO_COLORS[i % PORTFOLIO_COLORS.length] }} />
                        <span className="text-[11px] text-text-secondary">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-foreground">{item.percent}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Balance History */}
            <div className="rounded-xl bg-surface/60 border border-border/50 p-4 lg:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="h-3.5 w-3.5 text-muted" />
                  <h3 className="text-[13px] font-semibold text-foreground">{t.wallet.balanceHistory}</h3>
                </div>
                <div className="flex items-center gap-0.5">
                  {balanceTimeframes.map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setBalanceTf(tf)}
                      className={cn(
                        "px-2 py-0.5 text-[11px] font-semibold rounded transition-colors",
                        balanceTf === tf ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
                      )}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <div className="w-full h-[200px] lg:h-[240px]">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceHistory} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00d47e" stopOpacity={0.2} />
                          <stop offset="100%" stopColor="#00d47e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#5e6673" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 9, fill: "#5e6673" }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} width={40} />
                      <Tooltip content={<CustomTooltipArea />} />
                      <Area type="monotone" dataKey="value" stroke="#00d47e" strokeWidth={1.5} fill="url(#balanceGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="pb-5">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[
              { label: t.wallet.todayPnl, value: formatCurrency(1234.56), positive: true },
              { label: "Total PnL", value: formatCurrency(12456.78), positive: true },
              { label: t.wallet.availableBalance, value: formatCurrency(25000), neutral: true },
              { label: t.wallet.inOrders, value: formatCurrency(0), neutral: true },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-surface/60 border border-border/50 p-4">
                <p className="text-[10px] text-muted mb-1">{stat.label}</p>
                <p className={cn("text-base font-bold font-mono tracking-tight", stat.neutral ? "text-foreground" : stat.positive ? "text-accent" : "text-danger")}>
                  {balanceVisible ? stat.value : "••••"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Search + Assets Table */}
      <section className="py-5 border-t border-border/40">
        <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-medium whitespace-nowrap transition-colors",
                  activeTab === tab
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:text-foreground hover:bg-surface"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-4 max-w-sm">
            <div className="flex items-center gap-2 bg-surface border border-border/60 rounded-xl px-3 py-2 focus-within:border-accent/40 transition-colors">
              <Search className="h-3.5 w-3.5 text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.wallet.searchAssets}
                className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted outline-none"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block rounded-xl border border-border/50 overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_100px_160px] gap-3 px-4 py-2.5 text-[10px] font-semibold text-muted uppercase tracking-wider bg-surface/50 border-b border-border/50">
              <span>Asset</span>
              <span className="text-right">Balance</span>
              <span className="text-right">Value</span>
              <span className="text-right">24h %</span>
              <span className="text-center">Actions</span>
            </div>
            {filteredAssets.map((asset, i) => {
              const up = asset.change24h >= 0;
              return (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-[2fr_1fr_1fr_100px_160px] gap-3 items-center px-4 py-3 hover:bg-card-hover/40 transition-colors border-b border-border/30 last:border-0"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={asset.icon}
                      alt={asset.name}
                      className="h-8 w-8 shrink-0 object-contain rounded-lg bg-surface border border-border/60"
                      loading="lazy"
                    />
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{asset.symbol}</p>
                      <p className="text-[10px] text-muted">{asset.name}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-foreground font-mono text-right tracking-tight">
                    {balanceVisible ? asset.balance.toFixed(4) : "••••"}
                  </p>
                  <p className="text-[13px] text-foreground font-mono text-right tracking-tight">
                    {balanceVisible ? formatCurrency(asset.value) : "••••"}
                  </p>
                  <div className="flex justify-end">
                    <span className={cn(
                      "inline-flex items-center justify-center min-w-[60px] px-1.5 py-0.5 rounded text-[11px] font-bold",
                      up ? "text-white bg-accent" : "text-white bg-danger"
                    )}>
                      {up ? "+" : ""}{formatPercent(asset.change24h)}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleDeposit(asset)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                    >
                      {t.common.deposit}
                    </button>
                    <button
                      onClick={() => handleWithdraw(asset)}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border/60 text-foreground hover:bg-surface transition-colors"
                    >
                      {t.common.withdraw}
                    </button>
                    <button className="px-2.5 py-1 text-[11px] font-semibold rounded-md text-text-secondary hover:text-foreground transition-colors">
                      {t.common.trade}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-2">
            {filteredAssets.map((asset, i) => {
              const up = asset.change24h >= 0;
              return (
                <motion.div
                  key={asset.symbol}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-xl bg-surface/60 border border-border/50 p-3.5 active:bg-card-hover transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={asset.icon}
                      alt={asset.name}
                      className="h-9 w-9 shrink-0 object-contain rounded-lg bg-background border border-border/60"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-[13px] font-bold text-foreground">{asset.symbol}</p>
                        <span className={cn(
                          "px-1 py-0.5 rounded text-[9px] font-bold",
                          up ? "text-accent bg-accent/10" : "text-danger bg-danger/10"
                        )}>
                          {up ? "+" : ""}{formatPercent(asset.change24h)}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted">{asset.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-bold text-foreground font-mono tracking-tight">
                        {balanceVisible ? formatCurrency(asset.value) : "••••"}
                      </p>
                      <p className="text-[10px] text-muted font-mono">
                        {balanceVisible ? asset.balance.toFixed(4) : "••••"} {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 pl-[46px]">
                    <button
                      onClick={() => handleDeposit(asset)}
                      className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-accent/10 text-accent active:bg-accent/20 transition-colors"
                    >
                      {t.common.deposit}
                    </button>
                    <button
                      onClick={() => handleWithdraw(asset)}
                      className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-surface border border-border/60 text-foreground active:bg-card-hover transition-colors"
                    >
                      {t.common.withdraw}
                    </button>
                    <button className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-surface border border-border/60 text-text-secondary active:text-foreground transition-colors">
                      {t.common.trade}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <DepositModal
        isOpen={depositOpen}
        onClose={() => setDepositOpen(false)}
        asset={selectedAsset ? { symbol: selectedAsset.symbol, name: selectedAsset.name, icon: selectedAsset.icon } : undefined}
      />
      <WithdrawModal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        asset={selectedAsset ? { symbol: selectedAsset.symbol, name: selectedAsset.name, icon: selectedAsset.icon, balance: selectedAsset.balance, value: selectedAsset.value } : undefined}
      />
      <TransferModal
        isOpen={transferOpen}
        onClose={() => setTransferOpen(false)}
        asset={selectedAsset ? { symbol: selectedAsset.symbol, name: selectedAsset.name, icon: selectedAsset.icon, balance: selectedAsset.balance } : undefined}
      />
      <BuyCryptoModal
        isOpen={buyCryptoOpen}
        onClose={() => setBuyCryptoOpen(false)}
        asset={selectedAsset ? { symbol: selectedAsset.symbol, name: selectedAsset.name, icon: selectedAsset.icon } : undefined}
      />
      <WalletHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </div>
  );
}

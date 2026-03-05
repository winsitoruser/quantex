"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Play,
  Pause,
  Settings,
  Activity,
  Plus,
  CheckCircle,
} from "lucide-react";
import { botStrategies, activeBots } from "@/data/botData";
import { formatPercent, cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";
import Footer from "@/components/layout/Footer";

const riskColor = (risk: string) => {
  switch (risk) {
    case "low": return "bg-accent/10 text-accent";
    case "medium": return "bg-warning/10 text-warning";
    case "high": return "bg-danger/10 text-danger";
    default: return "bg-muted/10 text-muted";
  }
};

export default function BotsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"strategies" | "my-bots">("strategies");
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);

  const totalInvested = activeBots.reduce((s, b) => s + b.investment, 0);
  const totalValue = activeBots.reduce((s, b) => s + b.currentValue, 0);
  const totalPnl = totalValue - totalInvested;
  const totalPnlPercent = (totalPnl / totalInvested) * 100;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.05] via-transparent to-accent/[0.03]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-xs font-semibold mb-6">
                <Bot className="h-3.5 w-3.5" />
                {t.bots.badge}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
                {t.bots.title} <span className="text-cyan">{t.bots.titleHighlight}</span>
              </h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mb-8 max-w-lg">{t.bots.subtitle}</p>
              <button className="h-12 px-8 flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-colors">
                {t.bots.createBot} <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t.bots.stats.totalBotUsers, value: "128K+", icon: Bot },
                  { label: t.bots.stats.totalVolumeTraded, value: "$4.2B", icon: BarChart3 },
                  { label: t.bots.stats.avgBotReturn, value: "23.4%", icon: TrendingUp },
                  { label: t.bots.stats.activeBots, value: "45K+", icon: Activity },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl bg-card border border-border p-4 lg:p-5">
                    <Icon className="h-4 w-4 text-cyan mb-2" />
                    <p className="text-xl font-bold text-foreground font-mono">{value}</p>
                    <p className="text-[11px] text-muted mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t.bots.howItWorks}</h2>
            <p className="text-sm text-muted">Get started in three simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step: "1", title: t.bots.steps.chooseStrategy, desc: t.bots.steps.chooseStrategyDesc },
              { step: "2", title: t.bots.steps.configureBacktest, desc: t.bots.steps.configureBacktestDesc },
              { step: "3", title: t.bots.steps.launchMonitor, desc: t.bots.steps.launchMonitorDesc },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-card border border-border p-6 hover:border-accent/30 transition-colors">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Content */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setActiveTab("strategies")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "strategies"
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {t.bots.tabs.botStrategies}
            </button>
            <button
              onClick={() => setActiveTab("my-bots")}
              className={cn(
                "px-5 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "my-bots"
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {t.bots.tabs.myBots} ({activeBots.length})
            </button>
          </div>

          {/* Strategies Tab */}
          {activeTab === "strategies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {botStrategies.map((strategy, i) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "relative rounded-xl bg-card border p-5 transition-all cursor-pointer hover:border-accent/40",
                    selectedStrategy === strategy.id
                      ? "border-accent/40"
                      : "border-border"
                  )}
                  onClick={() => setSelectedStrategy(selectedStrategy === strategy.id ? null : strategy.id)}
                >
                  {strategy.recommended && (
                    <span className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-accent text-background text-[10px] font-bold">
                      {t.bots.recommended}
                    </span>
                  )}

                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-background border border-border text-xl">
                      {strategy.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{strategy.name}</h3>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${riskColor(strategy.risk)}`}>
                        {strategy.risk} risk
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted">{t.bots.estReturn}</p>
                    <p className="text-sm font-bold text-accent">{strategy.avgReturn}</p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed mb-3">{strategy.description}</p>

                  {selectedStrategy === strategy.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-border pt-3 mt-1"
                    >
                      <p className="text-xs text-muted leading-relaxed mb-3">{strategy.longDescription}</p>
                      <div className="space-y-2 mb-4">
                        {strategy.features.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                            <span className="text-foreground">{f}</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-bold transition-colors">
                        <Plus className="h-4 w-4" /> Create {strategy.name}
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* My Bots Tab */}
          {activeTab === "my-bots" && (
            <div>
              {/* Portfolio Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                {[
                  { label: t.bots.portfolio.totalInvested, value: `$${totalInvested.toLocaleString()}` },
                  { label: t.bots.portfolio.currentValue, value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
                  { label: t.bots.portfolio.totalPnl, value: `${totalPnl >= 0 ? "+" : ""}$${totalPnl.toFixed(2)}`, positive: totalPnl >= 0 },
                  { label: t.bots.portfolio.roi, value: formatPercent(totalPnlPercent), positive: totalPnlPercent >= 0 },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-card border border-border p-4 lg:p-5">
                    <p className="text-[11px] text-muted mb-1">{stat.label}</p>
                    <p className={cn("text-lg font-bold font-mono", stat.positive === undefined ? "text-foreground" : stat.positive ? "text-accent" : "text-danger")}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bot Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider bg-card/50 border-b border-border">
                  <span>Bot / Pair</span>
                  <span className="text-right">Status</span>
                  <span className="text-right">{t.bots.botTable.investment}</span>
                  <span className="text-right">Current Value</span>
                  <span className="text-right">PnL</span>
                  <span className="text-center">Actions</span>
                </div>
                {activeBots.map((bot, i) => (
                  <motion.div
                    key={bot.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="p-4 lg:p-5 hover:bg-card-hover transition-colors border-b border-border/50 last:border-0"
                  >
                    {/* Desktop row */}
                    <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 items-center">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{bot.strategyName}</p>
                        <p className="text-xs text-muted">{bot.pair}</p>
                      </div>
                      <div className="flex justify-end">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                          bot.status === "running" ? "bg-accent/10 text-accent" :
                          bot.status === "paused" ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", bot.status === "running" ? "bg-accent animate-pulse-green" : bot.status === "paused" ? "bg-warning" : "bg-muted")} />
                          {bot.status}
                        </span>
                      </div>
                      <p className="text-sm text-foreground font-mono text-right">${bot.investment.toLocaleString()}</p>
                      <p className="text-sm text-foreground font-mono text-right">${bot.currentValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                      <p className={cn("text-sm font-bold font-mono text-right", bot.pnl >= 0 ? "text-accent" : "text-danger")}>
                        {bot.pnl >= 0 ? "+" : ""}${bot.pnl.toFixed(2)} ({formatPercent(bot.pnlPercent)})
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        {bot.status === "running" ? (
                          <button className="h-8 px-3 flex items-center gap-1 rounded-lg bg-warning/10 text-warning text-xs font-semibold hover:bg-warning/20 transition-colors">
                            <Pause className="h-3.5 w-3.5" /> Pause
                          </button>
                        ) : (
                          <button className="h-8 px-3 flex items-center gap-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors">
                            <Play className="h-3.5 w-3.5" /> Resume
                          </button>
                        )}
                        <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-background border border-border text-muted hover:text-foreground transition-colors">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {/* Mobile card */}
                    <div className="lg:hidden">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm font-bold text-foreground">{bot.strategyName}</p>
                          <p className="text-xs text-muted">{bot.pair}</p>
                        </div>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full",
                          bot.status === "running" ? "bg-accent/10 text-accent" :
                          bot.status === "paused" ? "bg-warning/10 text-warning" : "bg-muted/10 text-muted"
                        )}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", bot.status === "running" ? "bg-accent animate-pulse-green" : bot.status === "paused" ? "bg-warning" : "bg-muted")} />
                          {bot.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted">{t.bots.botTable.investment}</p>
                          <p className="text-xs font-semibold text-foreground font-mono">${bot.investment.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted">PnL</p>
                          <p className={cn("text-xs font-bold font-mono", bot.pnl >= 0 ? "text-accent" : "text-danger")}>
                            {bot.pnl >= 0 ? "+" : ""}${bot.pnl.toFixed(2)} ({formatPercent(bot.pnlPercent)})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5">
                        {bot.status === "running" ? (
                          <button className="flex-1 h-9 flex items-center justify-center gap-1 rounded-lg bg-warning/10 text-warning text-[11px] font-semibold">
                            <Pause className="h-3.5 w-3.5" /> Pause
                          </button>
                        ) : (
                          <button className="flex-1 h-9 flex items-center justify-center gap-1 rounded-lg bg-accent/10 text-accent text-[11px] font-semibold">
                            <Play className="h-3.5 w-3.5" /> Resume
                          </button>
                        )}
                        <button className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border text-muted">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={() => setActiveTab("strategies")}
                className="w-full mt-6 h-11 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-colors"
              >
                <Plus className="h-4 w-4" /> {t.bots.createNewBot}
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

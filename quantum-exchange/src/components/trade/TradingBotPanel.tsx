"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Zap,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Settings,
  Info,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { botStrategies } from "@/data/botData";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface TradingBotPanelProps {
  pair: string;
  basePrice: number;
}

type BotMode = "grid" | "dca" | "signal" | "martingale";

export default function TradingBotPanel({ pair, basePrice }: TradingBotPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedBot, setSelectedBot] = useState<BotMode>("grid");
  const [isRunning, setIsRunning] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Grid bot params
  const [gridUpper, setGridUpper] = useState((basePrice * 1.05).toFixed(2));
  const [gridLower, setGridLower] = useState((basePrice * 0.95).toFixed(2));
  const [gridCount, setGridCount] = useState("10");
  const [investment, setInvestment] = useState("500");

  // DCA params
  const [dcaAmount, setDcaAmount] = useState("50");
  const [dcaInterval, setDcaInterval] = useState("4h");

  // Signal params
  const [signalIndicator, setSignalIndicator] = useState("RSI");

  const base = pair.split("/")[0];
  const quote = pair.split("/")[1] || "USDT";

  const botOptions: { id: BotMode; name: string; icon: string; desc: string }[] = [
    { id: "grid", name: "Grid", icon: "⊞", desc: "Range trading" },
    { id: "dca", name: "DCA", icon: "📅", desc: "Auto-invest" },
    { id: "signal", name: "Signal", icon: "📡", desc: "Indicator-based" },
    { id: "martingale", name: "Martingale", icon: "🎯", desc: "Recovery strategy" },
  ];

  const dcaIntervals = ["1h", "4h", "12h", "1d", "1w"];
  const signalIndicators = ["RSI", "MACD", "EMA Cross", "Bollinger", "Volume"];

  return (
    <div className="border-t border-border">
      {/* Toggle Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-card-hover transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-cyan" />
          <span className="text-xs font-semibold text-foreground">Trading Bot</span>
          {isRunning && (
            <span className="flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-accent/10 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-green" />
              Active
            </span>
          )}
        </div>
        {expanded ? <ChevronUp className="h-3.5 w-3.5 text-muted" /> : <ChevronDown className="h-3.5 w-3.5 text-muted" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-3">
              {/* Bot Type Selector */}
              <div className="grid grid-cols-4 gap-1">
                {botOptions.map((bot) => (
                  <button
                    key={bot.id}
                    onClick={() => setSelectedBot(bot.id)}
                    className={cn(
                      "flex flex-col items-center gap-0.5 py-2 rounded-lg text-center transition-all",
                      selectedBot === bot.id
                        ? "bg-cyan/10 border border-cyan/30"
                        : "bg-background border border-border hover:border-border-light"
                    )}
                  >
                    <span className="text-sm">{bot.icon}</span>
                    <span className="text-[10px] font-semibold text-foreground">{bot.name}</span>
                  </button>
                ))}
              </div>

              {/* Grid Bot Config */}
              {selectedBot === "grid" && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan font-medium">
                    <Info className="h-3 w-3" />
                    Auto buy low, sell high within a price range
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Upper Price</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input
                          type="text"
                          value={gridUpper}
                          onChange={(e) => setGridUpper(e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full"
                        />
                        <span className="text-[10px] text-muted ml-1">{quote}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Lower Price</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input
                          type="text"
                          value={gridLower}
                          onChange={(e) => setGridLower(e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full"
                        />
                        <span className="text-[10px] text-muted ml-1">{quote}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Grid Count</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input
                          type="text"
                          value={gridCount}
                          onChange={(e) => setGridCount(e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full"
                        />
                        <span className="text-[10px] text-muted ml-1">grids</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Investment</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input
                          type="text"
                          value={investment}
                          onChange={(e) => setInvestment(e.target.value)}
                          className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full"
                        />
                        <span className="text-[10px] text-muted ml-1">{quote}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan/5 border border-cyan/20 text-[11px] font-medium text-cyan hover:bg-cyan/10 transition-colors">
                    <Zap className="h-3 w-3" />
                    Use AI-Optimized Parameters
                  </button>

                  {/* Estimated Profit */}
                  <div className="rounded-lg bg-background border border-border p-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted mb-0.5">Grid Profit/Grid</p>
                        <p className="text-xs font-semibold text-accent">~1.05%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted mb-0.5">Est. APY</p>
                        <p className="text-xs font-semibold text-accent">~38.2%</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted mb-0.5">Min. Profit</p>
                        <p className="text-xs font-semibold text-foreground">$5.25</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* DCA Bot Config */}
              {selectedBot === "dca" && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan font-medium">
                    <Info className="h-3 w-3" />
                    Invest fixed amount at regular intervals
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-muted mb-1 block">Amount per Order</label>
                    <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                      <input
                        type="text"
                        value={dcaAmount}
                        onChange={(e) => setDcaAmount(e.target.value)}
                        className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none"
                      />
                      <span className="text-[10px] text-muted ml-1">{quote}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-muted mb-1 block">Interval</label>
                    <div className="grid grid-cols-5 gap-1">
                      {dcaIntervals.map((interval) => (
                        <button
                          key={interval}
                          onClick={() => setDcaInterval(interval)}
                          className={cn(
                            "py-1.5 text-[10px] font-medium rounded-md transition-colors",
                            dcaInterval === interval
                              ? "bg-cyan/10 text-cyan border border-cyan/30"
                              : "bg-background border border-border text-muted hover:text-foreground"
                          )}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-background border border-border p-3">
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted mb-0.5">Monthly Investment</p>
                        <p className="text-xs font-semibold text-foreground">
                          ${dcaInterval === "1h" ? "36,000" : dcaInterval === "4h" ? "9,000" : dcaInterval === "12h" ? "3,000" : dcaInterval === "1d" ? "1,500" : "200"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted mb-0.5">Historical Avg. Return</p>
                        <p className="text-xs font-semibold text-accent">+18.5% APY</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Signal Bot Config */}
              {selectedBot === "signal" && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan font-medium">
                    <Info className="h-3 w-3" />
                    Trade based on technical indicator signals
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-muted mb-1 block">Primary Indicator</label>
                    <div className="grid grid-cols-5 gap-1">
                      {signalIndicators.map((ind) => (
                        <button
                          key={ind}
                          onClick={() => setSignalIndicator(ind)}
                          className={cn(
                            "py-1.5 text-[10px] font-medium rounded-md transition-colors",
                            signalIndicator === ind
                              ? "bg-cyan/10 text-cyan border border-cyan/30"
                              : "bg-background border border-border text-muted hover:text-foreground"
                          )}
                        >
                          {ind}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-medium text-muted mb-1 block">Investment</label>
                    <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                      <input
                        type="text"
                        value={investment}
                        onChange={(e) => setInvestment(e.target.value)}
                        className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none"
                      />
                      <span className="text-[10px] text-muted ml-1">{quote}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-warning/5 border border-warning/20">
                    <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />
                    <p className="text-[10px] text-warning leading-relaxed">
                      Signal bots carry higher risk. Recommended for experienced traders.
                    </p>
                  </div>
                </div>
              )}

              {/* Martingale Config */}
              {selectedBot === "martingale" && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-cyan font-medium">
                    <Info className="h-3 w-3" />
                    Increase position size to recover from losses
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Initial Order</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input type="text" defaultValue="100" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                        <span className="text-[10px] text-muted ml-1">{quote}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Multiplier</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input type="text" defaultValue="2.0" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                        <span className="text-[10px] text-muted ml-1">x</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Max Safety Orders</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input type="text" defaultValue="5" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Take Profit</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2 focus-within:border-border-light transition-colors">
                        <input type="text" defaultValue="1.5" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                        <span className="text-[10px] text-muted ml-1">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-danger/5 border border-danger/20">
                    <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" />
                    <p className="text-[10px] text-danger leading-relaxed">
                      High risk strategy. Max loss: ${(100 * (Math.pow(2, 6) - 1)).toLocaleString()}. Use with caution.
                    </p>
                  </div>
                </div>
              )}

              {/* Advanced Settings Toggle */}
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-[10px] text-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-3 w-3" />
                Advanced Settings
                {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>

              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Stop Loss</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2">
                        <input type="text" defaultValue="10" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                        <span className="text-[10px] text-muted ml-1">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-muted mb-1 block">Take Profit</label>
                      <div className="flex items-center bg-background border border-border rounded-lg px-2.5 py-2">
                        <input type="text" defaultValue="50" className="flex-1 bg-transparent text-xs font-mono text-foreground outline-none w-full" />
                        <span className="text-[10px] text-muted ml-1">%</span>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-cyan" defaultChecked />
                    <span className="text-[10px] text-muted">Trailing take profit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-cyan" />
                    <span className="text-[10px] text-muted">Paper trading mode (no real funds)</span>
                  </label>
                </motion.div>
              )}

              {/* Start/Stop Button */}
              {isRunning ? (
                <button
                  onClick={() => setIsRunning(false)}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-danger/10 border border-danger/30 text-danger text-sm font-semibold hover:bg-danger/20 transition-colors"
                >
                  <Pause className="h-4 w-4" />
                  Stop Bot
                </button>
              ) : (
                <button
                  onClick={() => setIsRunning(true)}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-cyan hover:bg-cyan/90 text-background text-sm font-semibold transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Start Bot
                </button>
              )}

              {/* Bot Running Status */}
              {isRunning && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-accent/5 border border-accent/20 p-3 space-y-2"
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-green" />
                    Bot is running on {pair}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted">Trades</p>
                      <p className="text-xs font-semibold text-foreground">12</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted">PnL</p>
                      <p className="text-xs font-semibold text-accent">+$24.50</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted">Runtime</p>
                      <p className="text-xs font-semibold text-foreground">2h 15m</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Link to Bot Page */}
              <Link
                href="/bots"
                className="flex items-center justify-center gap-1 text-[10px] text-cyan hover:text-cyan/80 transition-colors"
              >
                View all bots & strategies <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

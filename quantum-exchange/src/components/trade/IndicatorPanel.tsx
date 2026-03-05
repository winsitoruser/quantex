"use client";

import { useState } from "react";
import { X, Search, TrendingUp, BarChart3, Activity, Waves, Target, Layers } from "lucide-react";

export interface IndicatorConfig {
  id: string;
  name: string;
  shortName: string;
  category: "overlay" | "oscillator";
  enabled: boolean;
  params: Record<string, number>;
  color: string;
  description: string;
  icon: React.ReactNode;
}

export const defaultIndicators: IndicatorConfig[] = [
  {
    id: "sma",
    name: "Simple Moving Average",
    shortName: "SMA",
    category: "overlay",
    enabled: false,
    params: { period: 20 },
    color: "#f59e0b",
    description: "Average closing price over N periods",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "ema",
    name: "Exponential Moving Average",
    shortName: "EMA",
    category: "overlay",
    enabled: false,
    params: { period: 21 },
    color: "#8b5cf6",
    description: "Weighted average giving more importance to recent prices",
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    id: "bb",
    name: "Bollinger Bands",
    shortName: "BB",
    category: "overlay",
    enabled: false,
    params: { period: 20, stdDev: 2 },
    color: "#06b6d4",
    description: "Volatility bands placed above and below a moving average",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    id: "vwap",
    name: "Volume Weighted Avg Price",
    shortName: "VWAP",
    category: "overlay",
    enabled: false,
    params: {},
    color: "#ec4899",
    description: "Average price weighted by volume",
    icon: <Target className="h-4 w-4" />,
  },
  {
    id: "volume",
    name: "Volume",
    shortName: "VOL",
    category: "overlay",
    enabled: true,
    params: {},
    color: "#6b7280",
    description: "Trading volume bars",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: "rsi",
    name: "Relative Strength Index",
    shortName: "RSI",
    category: "oscillator",
    enabled: false,
    params: { period: 14 },
    color: "#f97316",
    description: "Momentum oscillator measuring speed of price changes",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "macd",
    name: "MACD",
    shortName: "MACD",
    category: "oscillator",
    enabled: false,
    params: { fast: 12, slow: 26, signal: 9 },
    color: "#3b82f6",
    description: "Trend-following momentum indicator",
    icon: <Waves className="h-4 w-4" />,
  },
  {
    id: "stochastic",
    name: "Stochastic Oscillator",
    shortName: "STOCH",
    category: "oscillator",
    enabled: false,
    params: { kPeriod: 14, dPeriod: 3 },
    color: "#10b981",
    description: "Momentum indicator comparing closing price to price range",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "atr",
    name: "Average True Range",
    shortName: "ATR",
    category: "oscillator",
    enabled: false,
    params: { period: 14 },
    color: "#a855f7",
    description: "Volatility indicator showing degree of price movement",
    icon: <BarChart3 className="h-4 w-4" />,
  },
];

interface IndicatorPanelProps {
  indicators: IndicatorConfig[];
  onToggle: (id: string) => void;
  onParamChange: (id: string, param: string, value: number) => void;
  onClose: () => void;
}

export default function IndicatorPanel({
  indicators,
  onToggle,
  onParamChange,
  onClose,
}: IndicatorPanelProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "overlay" | "oscillator">("all");

  const filtered = indicators.filter((ind) => {
    const matchSearch =
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.shortName.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "all" || ind.category === activeTab;
    return matchSearch && matchTab;
  });

  const tabs = [
    { id: "all" as const, label: "All" },
    { id: "overlay" as const, label: "Overlays" },
    { id: "oscillator" as const, label: "Oscillators" },
  ];

  return (
    <div className="w-[380px] bg-[#0d1117] border border-border rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Technical Indicators</h3>
        <button
          onClick={onClose}
          className="h-6 w-6 flex items-center justify-center rounded hover:bg-card text-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            placeholder="Search indicators..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-md text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-accent/10 text-accent"
                : "text-muted hover:text-foreground hover:bg-card"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Indicator List */}
      <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
        {filtered.map((ind) => (
          <div
            key={ind.id}
            className={`px-4 py-2.5 border-b border-border/50 hover:bg-card/50 transition-colors ${
              ind.enabled ? "bg-card/30" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: ind.color + "15", color: ind.color }}
                >
                  {ind.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{ind.shortName}</span>
                    <span className="text-[10px] text-muted">{ind.name}</span>
                  </div>
                  <p className="text-[10px] text-muted/70 mt-0.5">{ind.description}</p>
                </div>
              </div>
              <button
                onClick={() => onToggle(ind.id)}
                className={`relative w-9 h-5 rounded-full transition-colors ${
                  ind.enabled ? "bg-accent" : "bg-card border border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                    ind.enabled ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {/* Params (shown when enabled) */}
            {ind.enabled && Object.keys(ind.params).length > 0 && (
              <div className="mt-2 ml-11 flex items-center gap-3 flex-wrap">
                {Object.entries(ind.params).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <label className="text-[10px] text-muted capitalize">{key}:</label>
                    <input
                      type="number"
                      value={val}
                      onChange={(e) => onParamChange(ind.id, key, Number(e.target.value))}
                      className="w-14 px-1.5 py-0.5 text-[10px] bg-[#0d1117] border border-border rounded text-foreground text-center focus:outline-none focus:border-accent/50"
                    />
                  </div>
                ))}
                <div
                  className="w-3 h-3 rounded-full border border-border/50"
                  style={{ backgroundColor: ind.color }}
                  title={`Color: ${ind.color}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active count */}
      <div className="px-4 py-2 border-t border-border bg-card/30">
        <p className="text-[10px] text-muted">
          {indicators.filter((i) => i.enabled).length} indicator(s) active
        </p>
      </div>
    </div>
  );
}

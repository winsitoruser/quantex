export interface BotStrategy {
  id: string;
  name: string;
  type: "grid" | "dca" | "arbitrage" | "smart-rebalance" | "signal" | "martingale";
  description: string;
  longDescription: string;
  risk: "low" | "medium" | "high";
  avgReturn: string;
  minInvestment: string;
  recommended: boolean;
  features: string[];
  icon: string;
}

export interface ActiveBot {
  id: string;
  strategyId: string;
  strategyName: string;
  pair: string;
  status: "running" | "paused" | "stopped";
  investment: number;
  currentValue: number;
  pnl: number;
  pnlPercent: number;
  trades: number;
  runtime: string;
  createdAt: string;
}

export interface BotPerformance {
  date: string;
  value: number;
}

export const botStrategies: BotStrategy[] = [
  {
    id: "grid",
    name: "Grid Trading Bot",
    type: "grid",
    description: "Automatically places buy and sell orders within a defined price range to profit from market oscillations.",
    longDescription: "Grid trading works by placing a series of buy and sell orders at predetermined price levels above and below a set price. As the price moves up and down, the bot captures small profits on each grid level. Ideal for sideways/range-bound markets where prices oscillate between support and resistance levels.",
    risk: "medium",
    avgReturn: "15-45% APY",
    minInvestment: "100 USDT",
    recommended: true,
    features: [
      "Auto grid level calculation",
      "Geometric & arithmetic modes",
      "Trailing up & trailing down",
      "Take profit & stop loss",
      "AI-optimized grid parameters",
      "Backtesting with historical data",
    ],
    icon: "⊞",
  },
  {
    id: "dca",
    name: "DCA (Dollar-Cost Average)",
    type: "dca",
    description: "Automatically invests a fixed amount at regular intervals, reducing the impact of volatility on purchases.",
    longDescription: "Dollar-Cost Averaging is a time-tested investment strategy that involves buying a fixed amount of an asset at regular intervals, regardless of the price. This reduces the average cost per unit over time and minimizes the impact of short-term volatility. The bot automates this process with customizable intervals and amounts.",
    risk: "low",
    avgReturn: "8-25% APY",
    minInvestment: "50 USDT",
    recommended: true,
    features: [
      "Customizable intervals (hourly to monthly)",
      "Multiple asset DCA",
      "Smart timing with volatility detection",
      "Auto-compound profits",
      "Price deviation triggers",
      "Portfolio rebalancing integration",
    ],
    icon: "📅",
  },
  {
    id: "arbitrage",
    name: "Arbitrage Bot",
    type: "arbitrage",
    description: "Exploits price differences between trading pairs or markets for low-risk profits.",
    longDescription: "Arbitrage bots detect and exploit price discrepancies across different trading pairs (triangular arbitrage) or between spot and futures markets (funding rate arbitrage). These opportunities exist for milliseconds, making automated execution essential. The bot continuously scans for profitable opportunities and executes trades instantly.",
    risk: "low",
    avgReturn: "5-18% APY",
    minInvestment: "500 USDT",
    recommended: false,
    features: [
      "Triangular arbitrage detection",
      "Cross-pair arbitrage",
      "Funding rate arbitrage",
      "Sub-millisecond execution",
      "Real-time opportunity scanner",
      "Risk-free profit calculation",
    ],
    icon: "🔄",
  },
  {
    id: "smart-rebalance",
    name: "Smart Rebalance",
    type: "smart-rebalance",
    description: "Maintains target portfolio allocation by automatically buying low and selling high across multiple assets.",
    longDescription: "Smart Rebalance maintains your desired portfolio allocation automatically. When one asset outperforms, the bot sells a portion and buys underperforming assets, effectively buying low and selling high. Uses AI to determine optimal rebalancing thresholds and timing to maximize returns while maintaining your risk profile.",
    risk: "low",
    avgReturn: "10-30% APY",
    minInvestment: "200 USDT",
    recommended: true,
    features: [
      "Custom portfolio allocation",
      "Threshold-based rebalancing",
      "Time-based rebalancing",
      "AI-optimized timing",
      "Tax-loss harvesting",
      "Multi-asset support (up to 20)",
    ],
    icon: "⚖️",
  },
  {
    id: "signal",
    name: "Signal Bot",
    type: "signal",
    description: "Executes trades automatically based on technical indicator signals like RSI, MACD, and Bollinger Bands.",
    longDescription: "Signal bots analyze technical indicators in real-time and execute trades when specific conditions are met. Combine multiple indicators to create sophisticated strategies. Supports RSI, MACD, Bollinger Bands, EMA crossovers, volume analysis, and custom indicator combinations.",
    risk: "high",
    avgReturn: "20-80% APY",
    minInvestment: "200 USDT",
    recommended: false,
    features: [
      "20+ technical indicators",
      "Custom signal combinations",
      "Multi-timeframe analysis",
      "Backtesting engine",
      "Paper trading mode",
      "Community signal sharing",
    ],
    icon: "📡",
  },
  {
    id: "martingale",
    name: "Martingale Bot",
    type: "martingale",
    description: "Progressively increases position size after losses to recover and profit when the market reverses.",
    longDescription: "The Martingale strategy increases the investment amount after each losing trade, based on the premise that a winning trade will eventually recover all previous losses plus generate a profit. Our enhanced version includes safety limits, maximum step controls, and AI-driven entry optimization to reduce risk.",
    risk: "high",
    avgReturn: "25-100% APY",
    minInvestment: "300 USDT",
    recommended: false,
    features: [
      "Configurable multiplier (1.5x-3x)",
      "Maximum safety orders",
      "Price deviation triggers",
      "Take profit per step",
      "Trailing take profit",
      "Emergency stop-loss protection",
    ],
    icon: "🎯",
  },
];

export const activeBots: ActiveBot[] = [
  {
    id: "bot-001",
    strategyId: "grid",
    strategyName: "Grid Trading Bot",
    pair: "BTC/USDT",
    status: "running",
    investment: 5000,
    currentValue: 5842.50,
    pnl: 842.50,
    pnlPercent: 16.85,
    trades: 234,
    runtime: "14d 6h",
    createdAt: "2026-02-19",
  },
  {
    id: "bot-002",
    strategyId: "dca",
    strategyName: "DCA Bot",
    pair: "ETH/USDT",
    status: "running",
    investment: 2000,
    currentValue: 2186.40,
    pnl: 186.40,
    pnlPercent: 9.32,
    trades: 28,
    runtime: "30d 12h",
    createdAt: "2026-02-03",
  },
  {
    id: "bot-003",
    strategyId: "grid",
    strategyName: "Grid Trading Bot",
    pair: "SOL/USDT",
    status: "running",
    investment: 1500,
    currentValue: 1734.25,
    pnl: 234.25,
    pnlPercent: 15.62,
    trades: 156,
    runtime: "7d 18h",
    createdAt: "2026-02-26",
  },
  {
    id: "bot-004",
    strategyId: "signal",
    strategyName: "Signal Bot",
    pair: "BNB/USDT",
    status: "paused",
    investment: 1000,
    currentValue: 968.30,
    pnl: -31.70,
    pnlPercent: -3.17,
    trades: 42,
    runtime: "5d 3h",
    createdAt: "2026-02-28",
  },
];

export function generateBotPerformance(days: number = 30): BotPerformance[] {
  const data: BotPerformance[] = [];
  let value = 10000;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000);
    value += (Math.random() - 0.35) * value * 0.015;
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}

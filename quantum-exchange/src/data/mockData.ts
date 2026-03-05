export interface CryptoPair {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  icon: string;
  sparkline: number[];
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface TradeEntry {
  id: string;
  price: number;
  amount: number;
  time: string;
  side: "buy" | "sell";
}

export interface WalletAsset {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
}

function generateSparkline(base: number, volatility: number): number[] {
  const points: number[] = [];
  let current = base;
  for (let i = 0; i < 24; i++) {
    current += (Math.random() - 0.48) * volatility;
    points.push(current);
  }
  return points;
}

export const cryptoPairs: CryptoPair[] = [
  {
    id: "btc-usdt",
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: 97842.53,
    change24h: 2.34,
    volume24h: 28_540_000_000,
    marketCap: 1_920_000_000_000,
    high24h: 98500.0,
    low24h: 95200.0,
    icon: "₿",
    sparkline: generateSparkline(97000, 500),
  },
  {
    id: "eth-usdt",
    symbol: "ETH/USDT",
    name: "Ethereum",
    price: 3456.78,
    change24h: 1.87,
    volume24h: 15_230_000_000,
    marketCap: 415_000_000_000,
    high24h: 3520.0,
    low24h: 3380.0,
    icon: "Ξ",
    sparkline: generateSparkline(3400, 30),
  },
  {
    id: "bnb-usdt",
    symbol: "BNB/USDT",
    name: "BNB",
    price: 634.21,
    change24h: -0.54,
    volume24h: 1_850_000_000,
    marketCap: 94_000_000_000,
    high24h: 642.0,
    low24h: 628.0,
    icon: "⬡",
    sparkline: generateSparkline(634, 5),
  },
  {
    id: "sol-usdt",
    symbol: "SOL/USDT",
    name: "Solana",
    price: 198.45,
    change24h: 5.67,
    volume24h: 4_120_000_000,
    marketCap: 87_000_000_000,
    high24h: 203.0,
    low24h: 186.5,
    icon: "◎",
    sparkline: generateSparkline(195, 4),
  },
  {
    id: "xrp-usdt",
    symbol: "XRP/USDT",
    name: "XRP",
    price: 2.34,
    change24h: -1.23,
    volume24h: 3_450_000_000,
    marketCap: 134_000_000_000,
    high24h: 2.42,
    low24h: 2.28,
    icon: "✕",
    sparkline: generateSparkline(2.3, 0.05),
  },
  {
    id: "ada-usdt",
    symbol: "ADA/USDT",
    name: "Cardano",
    price: 0.98,
    change24h: 3.45,
    volume24h: 890_000_000,
    marketCap: 34_500_000_000,
    high24h: 1.02,
    low24h: 0.94,
    icon: "₳",
    sparkline: generateSparkline(0.96, 0.02),
  },
  {
    id: "avax-usdt",
    symbol: "AVAX/USDT",
    name: "Avalanche",
    price: 38.92,
    change24h: -2.14,
    volume24h: 620_000_000,
    marketCap: 14_200_000_000,
    high24h: 40.5,
    low24h: 37.8,
    icon: "▲",
    sparkline: generateSparkline(39, 0.8),
  },
  {
    id: "doge-usdt",
    symbol: "DOGE/USDT",
    name: "Dogecoin",
    price: 0.324,
    change24h: 8.92,
    volume24h: 2_340_000_000,
    marketCap: 47_000_000_000,
    high24h: 0.338,
    low24h: 0.295,
    icon: "Ð",
    sparkline: generateSparkline(0.31, 0.01),
  },
  {
    id: "dot-usdt",
    symbol: "DOT/USDT",
    name: "Polkadot",
    price: 7.82,
    change24h: 1.56,
    volume24h: 340_000_000,
    marketCap: 10_800_000_000,
    high24h: 8.05,
    low24h: 7.62,
    icon: "●",
    sparkline: generateSparkline(7.8, 0.15),
  },
  {
    id: "link-usdt",
    symbol: "LINK/USDT",
    name: "Chainlink",
    price: 18.45,
    change24h: -0.89,
    volume24h: 560_000_000,
    marketCap: 10_900_000_000,
    high24h: 19.1,
    low24h: 18.0,
    icon: "⬡",
    sparkline: generateSparkline(18.4, 0.3),
  },
  {
    id: "matic-usdt",
    symbol: "MATIC/USDT",
    name: "Polygon",
    price: 0.89,
    change24h: 4.21,
    volume24h: 420_000_000,
    marketCap: 8_300_000_000,
    high24h: 0.92,
    low24h: 0.85,
    icon: "⬡",
    sparkline: generateSparkline(0.88, 0.02),
  },
  {
    id: "uni-usdt",
    symbol: "UNI/USDT",
    name: "Uniswap",
    price: 12.34,
    change24h: -3.21,
    volume24h: 280_000_000,
    marketCap: 7_400_000_000,
    high24h: 13.0,
    low24h: 12.1,
    icon: "🦄",
    sparkline: generateSparkline(12.3, 0.25),
  },
];

export function generateOrderBook(basePrice: number): { asks: OrderBookEntry[]; bids: OrderBookEntry[] } {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];

  let askTotal = 0;
  let bidTotal = 0;

  for (let i = 0; i < 15; i++) {
    const askPrice = basePrice + (i + 1) * basePrice * 0.0002;
    const askAmount = Math.random() * 2 + 0.01;
    askTotal += askAmount;
    asks.push({ price: askPrice, amount: askAmount, total: askTotal });

    const bidPrice = basePrice - (i + 1) * basePrice * 0.0002;
    const bidAmount = Math.random() * 2 + 0.01;
    bidTotal += bidAmount;
    bids.push({ price: bidPrice, amount: bidAmount, total: bidTotal });
  }

  return { asks: asks.reverse(), bids };
}

export function generateTradeHistory(basePrice: number): TradeEntry[] {
  const trades: TradeEntry[] = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const time = new Date(now.getTime() - i * 15000);
    const side: "buy" | "sell" = Math.random() > 0.5 ? "buy" : "sell";
    const price = basePrice + (Math.random() - 0.5) * basePrice * 0.002;
    const amount = Math.random() * 1.5 + 0.001;

    trades.push({
      id: `trade-${i}`,
      price,
      amount,
      time: time.toLocaleTimeString("en-US", { hour12: false }),
      side,
    });
  }

  return trades;
}

export const walletAssets: WalletAsset[] = [
  { symbol: "BTC", name: "Bitcoin", balance: 0.5432, value: 53139.42, change24h: 2.34, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", balance: 12.845, value: 44391.74, change24h: 1.87, icon: "Ξ" },
  { symbol: "USDT", name: "Tether", balance: 25000.0, value: 25000.0, change24h: 0.01, icon: "$" },
  { symbol: "SOL", name: "Solana", balance: 45.23, value: 8975.91, change24h: 5.67, icon: "◎" },
  { symbol: "BNB", name: "BNB", balance: 8.5, value: 5390.79, change24h: -0.54, icon: "⬡" },
  { symbol: "XRP", name: "XRP", balance: 5000.0, value: 11700.0, change24h: -1.23, icon: "✕" },
  { symbol: "ADA", name: "Cardano", balance: 10000.0, value: 9800.0, change24h: 3.45, icon: "₳" },
  { symbol: "DOGE", name: "Dogecoin", balance: 15000.0, value: 4860.0, change24h: 8.92, icon: "Ð" },
];

export const announcements = [
  "🔥 Quantum Exchange launches Perpetual Futures trading — Up to 100x leverage",
  "🎁 New user bonus: Deposit & get up to 5,000 USDT in rewards",
  "📢 SOL/USDT trading competition — $50,000 prize pool",
  "🚀 List new tokens: PEPE, WIF, JUP now available for spot trading",
];

export function generateCandlestickData(basePrice: number, count: number = 100) {
  const data = [];
  let current = basePrice * 0.85;
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < count; i++) {
    const open = current;
    const volatility = current * 0.02;
    const close = open + (Math.random() - 0.45) * volatility;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      time: now - (count - i) * 3600,
      open,
      high,
      low,
      close,
    });

    current = close;
  }

  return data;
}

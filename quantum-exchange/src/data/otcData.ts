// OTC Trading Mock Data

export interface OTCQuote {
  id: string;
  side: "buy" | "sell";
  crypto: string;
  cryptoIcon: string;
  fiat: string;
  amount: number;
  price: number;
  totalFiat: number;
  marketPrice: number;
  premium: number; // percentage premium/discount vs market
  status: "quoted" | "accepted" | "expired" | "settled" | "cancelled";
  expiresAt: string;
  createdAt: string;
  settledAt?: string;
  settlementMethod: string;
  accountManager?: string;
}

export interface OTCTrade {
  id: string;
  side: "buy" | "sell";
  crypto: string;
  cryptoIcon: string;
  fiat: string;
  amount: number;
  price: number;
  totalFiat: number;
  fee: number;
  netAmount: number;
  status: "pending_settlement" | "settled" | "failed";
  settlementMethod: string;
  createdAt: string;
  settledAt?: string;
  txHash?: string;
  accountManager: string;
}

export interface OTCPriceLevel {
  tier: string;
  minAmount: string;
  spread: string;
  settlement: string;
  dedicated: boolean;
}

// OTC Price tiers
export const otcPriceTiers: OTCPriceLevel[] = [
  { tier: "Standard", minAmount: "$10,000", spread: "0.5%", settlement: "T+0", dedicated: false },
  { tier: "Premium", minAmount: "$50,000", spread: "0.3%", settlement: "T+0", dedicated: true },
  { tier: "Institutional", minAmount: "$250,000", spread: "0.1%", settlement: "T+0", dedicated: true },
  { tier: "Whale", minAmount: "$1,000,000", spread: "Negotiable", settlement: "T+0", dedicated: true },
];

// Active OTC Quotes
export const otcQuotes: OTCQuote[] = [
  {
    id: "OTC-Q-001",
    side: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "USD",
    amount: 10,
    price: 94150,
    totalFiat: 941500,
    marketPrice: 93800,
    premium: 0.37,
    status: "quoted",
    expiresAt: "2025-03-05T14:00:00Z",
    createdAt: "2025-03-05T13:55:00Z",
    settlementMethod: "Wire Transfer",
    accountManager: "Sarah Chen",
  },
  {
    id: "OTC-Q-002",
    side: "sell",
    crypto: "ETH",
    cryptoIcon: "Ξ",
    fiat: "USD",
    amount: 100,
    price: 3320,
    totalFiat: 332000,
    marketPrice: 3310,
    premium: 0.30,
    status: "quoted",
    expiresAt: "2025-03-05T14:10:00Z",
    createdAt: "2025-03-05T14:05:00Z",
    settlementMethod: "Wire Transfer",
    accountManager: "Sarah Chen",
  },
  {
    id: "OTC-Q-003",
    side: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "USD",
    amount: 500000,
    price: 1.0005,
    totalFiat: 500250,
    marketPrice: 1.0000,
    premium: 0.05,
    status: "expired",
    expiresAt: "2025-03-05T10:00:00Z",
    createdAt: "2025-03-05T09:55:00Z",
    settlementMethod: "Wire Transfer",
    accountManager: "Mike Johnson",
  },
];

// OTC Trade History
export const otcTrades: OTCTrade[] = [
  {
    id: "OTC-T-001",
    side: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "USD",
    amount: 5,
    price: 93500,
    totalFiat: 467500,
    fee: 467.50,
    netAmount: 4.995,
    status: "settled",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-03-04T10:00:00Z",
    settledAt: "2025-03-04T10:15:00Z",
    txHash: "0x1a2b3c4d5e6f...a1b2c3",
    accountManager: "Sarah Chen",
  },
  {
    id: "OTC-T-002",
    side: "sell",
    crypto: "ETH",
    cryptoIcon: "Ξ",
    fiat: "USD",
    amount: 200,
    price: 3280,
    totalFiat: 656000,
    fee: 656.00,
    netAmount: 655344,
    status: "settled",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-03-03T14:30:00Z",
    settledAt: "2025-03-03T14:45:00Z",
    txHash: "0x7g8h9i0j1k2l...d4e5f6",
    accountManager: "Sarah Chen",
  },
  {
    id: "OTC-T-003",
    side: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "USD",
    amount: 20,
    price: 92800,
    totalFiat: 1856000,
    fee: 1856.00,
    netAmount: 19.98,
    status: "settled",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-03-02T09:00:00Z",
    settledAt: "2025-03-02T09:20:00Z",
    txHash: "0x3m4n5o6p7q8r...g7h8i9",
    accountManager: "Mike Johnson",
  },
  {
    id: "OTC-T-004",
    side: "buy",
    crypto: "SOL",
    cryptoIcon: "◎",
    fiat: "USD",
    amount: 5000,
    price: 142.50,
    totalFiat: 712500,
    fee: 712.50,
    netAmount: 4995,
    status: "settled",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-03-01T11:00:00Z",
    settledAt: "2025-03-01T11:30:00Z",
    txHash: "0x9s0t1u2v3w4x...j0k1l2",
    accountManager: "Sarah Chen",
  },
  {
    id: "OTC-T-005",
    side: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "USD",
    amount: 1000000,
    price: 0.9998,
    totalFiat: 999800,
    fee: 999.80,
    netAmount: 998800.20,
    status: "settled",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-02-28T16:00:00Z",
    settledAt: "2025-02-28T16:10:00Z",
    txHash: "0x5y6z7a8b9c0d...m3n4o5",
    accountManager: "Mike Johnson",
  },
  {
    id: "OTC-T-006",
    side: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "USD",
    amount: 50,
    price: 91200,
    totalFiat: 4560000,
    fee: 4560.00,
    netAmount: 49.95,
    status: "pending_settlement",
    settlementMethod: "Wire Transfer",
    createdAt: "2025-03-05T12:00:00Z",
    accountManager: "Sarah Chen",
  },
];

// OTC stats
export const otcStats = {
  totalVolume30d: "$45.2M",
  totalTrades30d: 128,
  avgTradeSize: "$353K",
  avgSpread: "0.25%",
  availablePairs: 35,
  settlementTime: "< 15 min",
};

// Supported OTC cryptos
export const otcCryptos = [
  { symbol: "BTC", name: "Bitcoin", icon: "₿", marketPrice: 93800, minOtc: 0.5 },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ", marketPrice: 3310, minOtc: 5 },
  { symbol: "USDT", name: "Tether", icon: "₮", marketPrice: 1.0000, minOtc: 10000 },
  { symbol: "USDC", name: "USD Coin", icon: "$", marketPrice: 1.0000, minOtc: 10000 },
  { symbol: "SOL", name: "Solana", icon: "◎", marketPrice: 142.50, minOtc: 100 },
  { symbol: "BNB", name: "BNB", icon: "⬡", marketPrice: 612, minOtc: 20 },
  { symbol: "XRP", name: "Ripple", icon: "✕", marketPrice: 2.45, minOtc: 5000 },
  { symbol: "ADA", name: "Cardano", icon: "₳", marketPrice: 0.72, minOtc: 10000 },
];

// P2P Trading Mock Data

export interface P2PMerchant {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  isMerchant: boolean;
  totalTrades: number;
  completionRate: number;
  avgReleaseTime: string;
  positiveRate: number;
  registeredDays: number;
  onlineStatus: "online" | "offline" | "away";
}

export interface P2PAd {
  id: string;
  merchant: P2PMerchant;
  type: "buy" | "sell";
  crypto: string;
  cryptoIcon: string;
  fiat: string;
  price: number;
  available: number;
  minLimit: number;
  maxLimit: number;
  paymentMethods: string[];
  remarks?: string;
  autoReply?: string;
  createdAt: string;
}

export interface P2POrder {
  id: string;
  adId: string;
  type: "buy" | "sell";
  crypto: string;
  cryptoIcon: string;
  amount: number;
  price: number;
  fiatAmount: number;
  fiat: string;
  status: "pending" | "paid" | "releasing" | "completed" | "cancelled" | "disputed" | "appealed";
  counterparty: P2PMerchant;
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
  completedAt?: string;
  timeLimit: number; // in minutes
  chatMessages: P2PChatMessage[];
}

export interface P2PChatMessage {
  id: string;
  sender: "me" | "counterparty" | "system";
  message: string;
  timestamp: string;
  type: "text" | "image" | "system";
}

export interface P2PPaymentMethod {
  id: string;
  name: string;
  icon: string;
  fields: { label: string; value: string }[];
}

// Merchants
export const p2pMerchants: P2PMerchant[] = [
  {
    id: "m1",
    name: "CryptoKing88",
    avatar: "CK",
    isVerified: true,
    isMerchant: true,
    totalTrades: 12847,
    completionRate: 99.2,
    avgReleaseTime: "2 min",
    positiveRate: 98.5,
    registeredDays: 1245,
    onlineStatus: "online",
  },
  {
    id: "m2",
    name: "FastTrade_ID",
    avatar: "FT",
    isVerified: true,
    isMerchant: true,
    totalTrades: 8432,
    completionRate: 98.8,
    avgReleaseTime: "3 min",
    positiveRate: 97.2,
    registeredDays: 890,
    onlineStatus: "online",
  },
  {
    id: "m3",
    name: "SatoshiDealer",
    avatar: "SD",
    isVerified: true,
    isMerchant: true,
    totalTrades: 5621,
    completionRate: 99.5,
    avgReleaseTime: "1 min",
    positiveRate: 99.1,
    registeredDays: 654,
    onlineStatus: "online",
  },
  {
    id: "m4",
    name: "BitMaster_Pro",
    avatar: "BM",
    isVerified: true,
    isMerchant: false,
    totalTrades: 2314,
    completionRate: 97.6,
    avgReleaseTime: "5 min",
    positiveRate: 96.3,
    registeredDays: 432,
    onlineStatus: "away",
  },
  {
    id: "m5",
    name: "TokenSwap24",
    avatar: "TS",
    isVerified: true,
    isMerchant: true,
    totalTrades: 15890,
    completionRate: 99.7,
    avgReleaseTime: "1 min",
    positiveRate: 99.4,
    registeredDays: 1567,
    onlineStatus: "online",
  },
  {
    id: "m6",
    name: "QuickCrypto",
    avatar: "QC",
    isVerified: false,
    isMerchant: false,
    totalTrades: 342,
    completionRate: 95.2,
    avgReleaseTime: "8 min",
    positiveRate: 93.1,
    registeredDays: 87,
    onlineStatus: "offline",
  },
  {
    id: "m7",
    name: "WhaleTrader99",
    avatar: "WT",
    isVerified: true,
    isMerchant: true,
    totalTrades: 21043,
    completionRate: 99.8,
    avgReleaseTime: "1 min",
    positiveRate: 99.6,
    registeredDays: 2100,
    onlineStatus: "online",
  },
  {
    id: "m8",
    name: "CoinExpress",
    avatar: "CE",
    isVerified: true,
    isMerchant: true,
    totalTrades: 7890,
    completionRate: 98.9,
    avgReleaseTime: "2 min",
    positiveRate: 97.8,
    registeredDays: 745,
    onlineStatus: "online",
  },
];

// P2P Ads - Buy (user wants to buy crypto from merchant)
export const p2pAds: P2PAd[] = [
  {
    id: "ad1",
    merchant: p2pMerchants[0],
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "IDR",
    price: 15850,
    available: 45000,
    minLimit: 100000,
    maxLimit: 50000000,
    paymentMethods: ["Bank Transfer", "DANA", "OVO"],
    remarks: "Fast release! Send exact amount. Include order number in transfer note.",
    createdAt: "2025-03-05T10:00:00Z",
  },
  {
    id: "ad2",
    merchant: p2pMerchants[1],
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "IDR",
    price: 15870,
    available: 28000,
    minLimit: 500000,
    maxLimit: 30000000,
    paymentMethods: ["Bank Transfer", "GoPay"],
    remarks: "BCA & Mandiri only. Release within 3 minutes.",
    createdAt: "2025-03-05T09:30:00Z",
  },
  {
    id: "ad3",
    merchant: p2pMerchants[2],
    type: "sell",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "IDR",
    price: 1485000000,
    available: 0.85,
    minLimit: 1000000,
    maxLimit: 100000000,
    paymentMethods: ["Bank Transfer"],
    remarks: "Large orders welcome. Instant release for verified users.",
    createdAt: "2025-03-05T08:00:00Z",
  },
  {
    id: "ad4",
    merchant: p2pMerchants[4],
    type: "sell",
    crypto: "ETH",
    cryptoIcon: "Ξ",
    fiat: "IDR",
    price: 52350000,
    available: 12.5,
    minLimit: 500000,
    maxLimit: 200000000,
    paymentMethods: ["Bank Transfer", "DANA", "ShopeePay"],
    createdAt: "2025-03-05T11:00:00Z",
  },
  {
    id: "ad5",
    merchant: p2pMerchants[3],
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "IDR",
    price: 15830,
    available: 15000,
    minLimit: 200000,
    maxLimit: 20000000,
    paymentMethods: ["DANA", "OVO", "GoPay"],
    remarks: "E-wallet only. Fast release!",
    createdAt: "2025-03-05T07:00:00Z",
  },
  {
    id: "ad6",
    merchant: p2pMerchants[6],
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "USD",
    price: 1.002,
    available: 250000,
    minLimit: 100,
    maxLimit: 50000,
    paymentMethods: ["Wire Transfer", "Zelle", "Wise"],
    remarks: "US bank transfers only. KYC verified accounts.",
    createdAt: "2025-03-05T06:00:00Z",
  },
  {
    id: "ad7",
    merchant: p2pMerchants[7],
    type: "sell",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "USD",
    price: 94250,
    available: 2.5,
    minLimit: 500,
    maxLimit: 100000,
    paymentMethods: ["Wire Transfer", "Wise"],
    createdAt: "2025-03-05T05:00:00Z",
  },
  // Buy ads (merchant wants to buy crypto from user)
  {
    id: "ad8",
    merchant: p2pMerchants[0],
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "IDR",
    price: 15750,
    available: 60000,
    minLimit: 100000,
    maxLimit: 50000000,
    paymentMethods: ["Bank Transfer", "DANA"],
    remarks: "Buying USDT. Payment within 5 minutes.",
    createdAt: "2025-03-05T10:30:00Z",
  },
  {
    id: "ad9",
    merchant: p2pMerchants[4],
    type: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "IDR",
    price: 1478000000,
    available: 1.2,
    minLimit: 5000000,
    maxLimit: 500000000,
    paymentMethods: ["Bank Transfer"],
    createdAt: "2025-03-05T09:00:00Z",
  },
  {
    id: "ad10",
    merchant: p2pMerchants[2],
    type: "buy",
    crypto: "ETH",
    cryptoIcon: "Ξ",
    fiat: "IDR",
    price: 52100000,
    available: 8.0,
    minLimit: 1000000,
    maxLimit: 100000000,
    paymentMethods: ["Bank Transfer", "GoPay"],
    createdAt: "2025-03-05T08:30:00Z",
  },
  {
    id: "ad11",
    merchant: p2pMerchants[6],
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "USD",
    price: 0.998,
    available: 500000,
    minLimit: 1000,
    maxLimit: 100000,
    paymentMethods: ["Wire Transfer", "Zelle"],
    createdAt: "2025-03-05T07:30:00Z",
  },
];

// P2P Orders
export const p2pOrders: P2POrder[] = [
  {
    id: "P2P-20250305-001",
    adId: "ad1",
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    amount: 500,
    price: 15850,
    fiatAmount: 7925000,
    fiat: "IDR",
    status: "paid",
    counterparty: p2pMerchants[0],
    paymentMethod: "Bank Transfer",
    createdAt: "2025-03-05T12:00:00Z",
    paidAt: "2025-03-05T12:05:00Z",
    timeLimit: 15,
    chatMessages: [
      { id: "c1", sender: "system", message: "Order created. Please complete payment within 15 minutes.", timestamp: "2025-03-05T12:00:00Z", type: "system" },
      { id: "c2", sender: "me", message: "Hi, I've placed the order. Transferring now via BCA.", timestamp: "2025-03-05T12:01:00Z", type: "text" },
      { id: "c3", sender: "counterparty", message: "OK, please send to BCA 1234567890 a/n CryptoKing. Include order number.", timestamp: "2025-03-05T12:02:00Z", type: "text" },
      { id: "c4", sender: "me", message: "Done! I've transferred Rp 7,925,000. Please check.", timestamp: "2025-03-05T12:05:00Z", type: "text" },
      { id: "c5", sender: "system", message: "Buyer has marked order as paid.", timestamp: "2025-03-05T12:05:00Z", type: "system" },
      { id: "c6", sender: "counterparty", message: "Received! Releasing USDT now.", timestamp: "2025-03-05T12:06:00Z", type: "text" },
    ],
  },
  {
    id: "P2P-20250305-002",
    adId: "ad3",
    type: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    amount: 0.05,
    price: 1485000000,
    fiatAmount: 74250000,
    fiat: "IDR",
    status: "completed",
    counterparty: p2pMerchants[2],
    paymentMethod: "Bank Transfer",
    createdAt: "2025-03-05T08:30:00Z",
    paidAt: "2025-03-05T08:35:00Z",
    completedAt: "2025-03-05T08:37:00Z",
    timeLimit: 15,
    chatMessages: [
      { id: "c7", sender: "system", message: "Order created.", timestamp: "2025-03-05T08:30:00Z", type: "system" },
      { id: "c8", sender: "system", message: "Order completed. BTC released to buyer.", timestamp: "2025-03-05T08:37:00Z", type: "system" },
    ],
  },
  {
    id: "P2P-20250304-003",
    adId: "ad5",
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    amount: 1000,
    price: 15830,
    fiatAmount: 15830000,
    fiat: "IDR",
    status: "completed",
    counterparty: p2pMerchants[3],
    paymentMethod: "DANA",
    createdAt: "2025-03-04T14:00:00Z",
    paidAt: "2025-03-04T14:03:00Z",
    completedAt: "2025-03-04T14:08:00Z",
    timeLimit: 15,
    chatMessages: [],
  },
  {
    id: "P2P-20250304-004",
    adId: "ad8",
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    amount: 2000,
    price: 15750,
    fiatAmount: 31500000,
    fiat: "IDR",
    status: "completed",
    counterparty: p2pMerchants[0],
    paymentMethod: "Bank Transfer",
    createdAt: "2025-03-04T10:00:00Z",
    paidAt: "2025-03-04T10:02:00Z",
    completedAt: "2025-03-04T10:05:00Z",
    timeLimit: 15,
    chatMessages: [],
  },
  {
    id: "P2P-20250303-005",
    adId: "ad2",
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    amount: 300,
    price: 15870,
    fiatAmount: 4761000,
    fiat: "IDR",
    status: "cancelled",
    counterparty: p2pMerchants[1],
    paymentMethod: "Bank Transfer",
    createdAt: "2025-03-03T16:00:00Z",
    timeLimit: 15,
    chatMessages: [
      { id: "c9", sender: "system", message: "Order cancelled due to timeout.", timestamp: "2025-03-03T16:15:00Z", type: "system" },
    ],
  },
  {
    id: "P2P-20250305-006",
    adId: "ad1",
    type: "buy",
    crypto: "USDT",
    cryptoIcon: "₮",
    amount: 200,
    price: 15850,
    fiatAmount: 3170000,
    fiat: "IDR",
    status: "pending",
    counterparty: p2pMerchants[0],
    paymentMethod: "DANA",
    createdAt: "2025-03-05T13:00:00Z",
    timeLimit: 15,
    chatMessages: [
      { id: "c10", sender: "system", message: "Order created. Please complete payment within 15 minutes.", timestamp: "2025-03-05T13:00:00Z", type: "system" },
    ],
  },
];

// User's own ads
export const myAds: P2PAd[] = [
  {
    id: "myad1",
    merchant: {
      id: "me",
      name: "AlexQuantum",
      avatar: "AQ",
      isVerified: true,
      isMerchant: false,
      totalTrades: 156,
      completionRate: 98.1,
      avgReleaseTime: "3 min",
      positiveRate: 97.5,
      registeredDays: 210,
      onlineStatus: "online",
    },
    type: "sell",
    crypto: "USDT",
    cryptoIcon: "₮",
    fiat: "IDR",
    price: 15860,
    available: 5000,
    minLimit: 100000,
    maxLimit: 10000000,
    paymentMethods: ["Bank Transfer", "DANA"],
    remarks: "BCA only. Fast release for verified users.",
    createdAt: "2025-03-05T09:00:00Z",
  },
  {
    id: "myad2",
    merchant: {
      id: "me",
      name: "AlexQuantum",
      avatar: "AQ",
      isVerified: true,
      isMerchant: false,
      totalTrades: 156,
      completionRate: 98.1,
      avgReleaseTime: "3 min",
      positiveRate: 97.5,
      registeredDays: 210,
      onlineStatus: "online",
    },
    type: "buy",
    crypto: "BTC",
    cryptoIcon: "₿",
    fiat: "IDR",
    price: 1480000000,
    available: 0.1,
    minLimit: 5000000,
    maxLimit: 50000000,
    paymentMethods: ["Bank Transfer"],
    remarks: "Looking to buy BTC. Mandiri transfer.",
    createdAt: "2025-03-04T15:00:00Z",
  },
];

// Payment methods available
export const paymentMethods: P2PPaymentMethod[] = [
  { id: "pm1", name: "Bank Transfer", icon: "🏦", fields: [{ label: "Bank", value: "BCA" }, { label: "Account", value: "1234567890" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm2", name: "DANA", icon: "💳", fields: [{ label: "Phone", value: "08123456789" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm3", name: "OVO", icon: "💜", fields: [{ label: "Phone", value: "08123456789" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm4", name: "GoPay", icon: "💚", fields: [{ label: "Phone", value: "08123456789" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm5", name: "ShopeePay", icon: "🧡", fields: [{ label: "Phone", value: "08123456789" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm6", name: "Wire Transfer", icon: "🏛️", fields: [{ label: "Bank", value: "Chase" }, { label: "Account", value: "9876543210" }, { label: "Name", value: "Alex Quantum" }] },
  { id: "pm7", name: "Wise", icon: "🌍", fields: [{ label: "Email", value: "alex@email.com" }] },
  { id: "pm8", name: "Zelle", icon: "⚡", fields: [{ label: "Email", value: "alex@email.com" }] },
];

export const cryptoOptions = [
  { symbol: "USDT", name: "Tether", icon: "₮" },
  { symbol: "BTC", name: "Bitcoin", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", icon: "Ξ" },
  { symbol: "BNB", name: "BNB", icon: "⬡" },
  { symbol: "SOL", name: "Solana", icon: "◎" },
  { symbol: "USDC", name: "USD Coin", icon: "$" },
];

export const fiatOptions = [
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
];

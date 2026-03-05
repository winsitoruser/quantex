export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  avatar: string;
  level: "Standard" | "VIP 1" | "VIP 2" | "VIP 3";
  kycStatus: "Unverified" | "Basic" | "Advanced";
  joinDate: string;
  lastLogin: string;
  twoFA: boolean;
  phone: string;
  referralCode: string;
  tradingFee: { maker: number; taker: number };
  totalTrades: number;
  totalVolume: number;
}

export interface UserAsset {
  symbol: string;
  name: string;
  icon: string;
  spotBalance: number;
  futuresBalance: number;
  earnBalance: number;
  totalBalance: number;
  availableBalance: number;
  inOrder: number;
  usdValue: number;
  price: number;
  change24h: number;
}

export interface TransactionHistory {
  id: string;
  type: "deposit" | "withdraw" | "trade" | "transfer" | "earn" | "fee";
  asset: string;
  amount: number;
  usdValue: number;
  status: "completed" | "pending" | "failed" | "cancelled";
  timestamp: string;
  txHash?: string;
  from?: string;
  to?: string;
  pair?: string;
  side?: "buy" | "sell";
  price?: number;
  fee?: number;
  network?: string;
}

export const userProfile: UserProfile = {
  uid: "QX-78291034",
  email: "alex.quantum@email.com",
  username: "AlexQuantum",
  avatar: "AQ",
  level: "VIP 1",
  kycStatus: "Advanced",
  joinDate: "2024-03-15",
  lastLogin: "2025-03-05T10:32:00Z",
  twoFA: true,
  phone: "+1 •••• ••56",
  referralCode: "QXREF2024",
  tradingFee: { maker: 0.08, taker: 0.1 },
  totalTrades: 1247,
  totalVolume: 2_450_000,
};

export const userAssets: UserAsset[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    icon: "₿",
    spotBalance: 0.5432,
    futuresBalance: 0.12,
    earnBalance: 0.05,
    totalBalance: 0.7132,
    availableBalance: 0.5432,
    inOrder: 0.0,
    usdValue: 69_842.58,
    price: 97_942.53,
    change24h: 2.34,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    icon: "Ξ",
    spotBalance: 12.845,
    futuresBalance: 5.0,
    earnBalance: 2.5,
    totalBalance: 20.345,
    availableBalance: 12.845,
    inOrder: 0.0,
    usdValue: 70_312.41,
    price: 3_456.78,
    change24h: 1.87,
  },
  {
    symbol: "USDT",
    name: "Tether",
    icon: "$",
    spotBalance: 25_000.0,
    futuresBalance: 10_000.0,
    earnBalance: 15_000.0,
    totalBalance: 50_000.0,
    availableBalance: 25_000.0,
    inOrder: 3_500.0,
    usdValue: 50_000.0,
    price: 1.0,
    change24h: 0.01,
  },
  {
    symbol: "SOL",
    name: "Solana",
    icon: "◎",
    spotBalance: 45.23,
    futuresBalance: 20.0,
    earnBalance: 10.0,
    totalBalance: 75.23,
    availableBalance: 45.23,
    inOrder: 0.0,
    usdValue: 14_928.14,
    price: 198.45,
    change24h: 5.67,
  },
  {
    symbol: "BNB",
    name: "BNB",
    icon: "⬡",
    spotBalance: 8.5,
    futuresBalance: 0.0,
    earnBalance: 5.0,
    totalBalance: 13.5,
    availableBalance: 8.5,
    inOrder: 0.0,
    usdValue: 8_561.84,
    price: 634.21,
    change24h: -0.54,
  },
  {
    symbol: "XRP",
    name: "XRP",
    icon: "✕",
    spotBalance: 5_000.0,
    futuresBalance: 0.0,
    earnBalance: 2_000.0,
    totalBalance: 7_000.0,
    availableBalance: 5_000.0,
    inOrder: 1_000.0,
    usdValue: 16_380.0,
    price: 2.34,
    change24h: -1.23,
  },
  {
    symbol: "ADA",
    name: "Cardano",
    icon: "₳",
    spotBalance: 10_000.0,
    futuresBalance: 0.0,
    earnBalance: 5_000.0,
    totalBalance: 15_000.0,
    availableBalance: 10_000.0,
    inOrder: 0.0,
    usdValue: 14_700.0,
    price: 0.98,
    change24h: 3.45,
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    icon: "Ð",
    spotBalance: 15_000.0,
    futuresBalance: 0.0,
    earnBalance: 0.0,
    totalBalance: 15_000.0,
    availableBalance: 15_000.0,
    inOrder: 0.0,
    usdValue: 4_860.0,
    price: 0.324,
    change24h: 8.92,
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    icon: "▲",
    spotBalance: 50.0,
    futuresBalance: 25.0,
    earnBalance: 0.0,
    totalBalance: 75.0,
    availableBalance: 50.0,
    inOrder: 0.0,
    usdValue: 2_919.0,
    price: 38.92,
    change24h: -2.14,
  },
  {
    symbol: "DOT",
    name: "Polkadot",
    icon: "●",
    spotBalance: 200.0,
    futuresBalance: 0.0,
    earnBalance: 100.0,
    totalBalance: 300.0,
    availableBalance: 200.0,
    inOrder: 0.0,
    usdValue: 2_346.0,
    price: 7.82,
    change24h: 1.56,
  },
];

export const transactionHistory: TransactionHistory[] = [
  {
    id: "tx-001",
    type: "trade",
    asset: "BTC",
    amount: 0.125,
    usdValue: 12_242.82,
    status: "completed",
    timestamp: "2025-03-05T09:15:00Z",
    pair: "BTC/USDT",
    side: "buy",
    price: 97_942.53,
    fee: 12.24,
  },
  {
    id: "tx-002",
    type: "deposit",
    asset: "USDT",
    amount: 10_000.0,
    usdValue: 10_000.0,
    status: "completed",
    timestamp: "2025-03-05T08:30:00Z",
    network: "TRC-20",
    txHash: "0x1a2b3c...7d8e9f",
  },
  {
    id: "tx-003",
    type: "trade",
    asset: "ETH",
    amount: 2.5,
    usdValue: 8_641.95,
    status: "completed",
    timestamp: "2025-03-04T22:45:00Z",
    pair: "ETH/USDT",
    side: "sell",
    price: 3_456.78,
    fee: 8.64,
  },
  {
    id: "tx-004",
    type: "withdraw",
    asset: "USDT",
    amount: 5_000.0,
    usdValue: 5_000.0,
    status: "completed",
    timestamp: "2025-03-04T18:20:00Z",
    network: "ERC-20",
    txHash: "0x4e5f6g...1h2i3j",
    to: "0x742d...F8a1",
  },
  {
    id: "tx-005",
    type: "earn",
    asset: "ETH",
    amount: 0.0234,
    usdValue: 80.89,
    status: "completed",
    timestamp: "2025-03-04T12:00:00Z",
  },
  {
    id: "tx-006",
    type: "trade",
    asset: "SOL",
    amount: 15.0,
    usdValue: 2_976.75,
    status: "completed",
    timestamp: "2025-03-04T10:30:00Z",
    pair: "SOL/USDT",
    side: "buy",
    price: 198.45,
    fee: 2.98,
  },
  {
    id: "tx-007",
    type: "transfer",
    asset: "USDT",
    amount: 10_000.0,
    usdValue: 10_000.0,
    status: "completed",
    timestamp: "2025-03-03T16:00:00Z",
    from: "Spot",
    to: "Futures",
  },
  {
    id: "tx-008",
    type: "trade",
    asset: "BTC",
    amount: 0.05,
    usdValue: 4_897.13,
    status: "completed",
    timestamp: "2025-03-03T14:22:00Z",
    pair: "BTC/USDT",
    side: "sell",
    price: 97_942.53,
    fee: 4.9,
  },
  {
    id: "tx-009",
    type: "deposit",
    asset: "BTC",
    amount: 0.25,
    usdValue: 24_485.63,
    status: "completed",
    timestamp: "2025-03-03T10:00:00Z",
    network: "Bitcoin",
    txHash: "bc1qxy2...w93gg",
  },
  {
    id: "tx-010",
    type: "withdraw",
    asset: "SOL",
    amount: 20.0,
    usdValue: 3_969.0,
    status: "pending",
    timestamp: "2025-03-05T10:00:00Z",
    network: "Solana",
    txHash: "5Vph7z...8Rqk",
    to: "7xKX...mN2p",
  },
  {
    id: "tx-011",
    type: "trade",
    asset: "XRP",
    amount: 2_000.0,
    usdValue: 4_680.0,
    status: "completed",
    timestamp: "2025-03-02T20:15:00Z",
    pair: "XRP/USDT",
    side: "buy",
    price: 2.34,
    fee: 4.68,
  },
  {
    id: "tx-012",
    type: "earn",
    asset: "USDT",
    amount: 45.21,
    usdValue: 45.21,
    status: "completed",
    timestamp: "2025-03-02T12:00:00Z",
  },
  {
    id: "tx-013",
    type: "trade",
    asset: "DOGE",
    amount: 5_000.0,
    usdValue: 1_620.0,
    status: "completed",
    timestamp: "2025-03-02T08:45:00Z",
    pair: "DOGE/USDT",
    side: "buy",
    price: 0.324,
    fee: 1.62,
  },
  {
    id: "tx-014",
    type: "withdraw",
    asset: "ETH",
    amount: 1.0,
    usdValue: 3_456.78,
    status: "failed",
    timestamp: "2025-03-01T15:30:00Z",
    network: "ERC-20",
    to: "0x9f8e...B2c3",
  },
  {
    id: "tx-015",
    type: "deposit",
    asset: "ETH",
    amount: 5.0,
    usdValue: 17_283.9,
    status: "completed",
    timestamp: "2025-03-01T09:00:00Z",
    network: "ERC-20",
    txHash: "0x7k8l9m...4n5o6p",
  },
  {
    id: "tx-016",
    type: "trade",
    asset: "ADA",
    amount: 10_000.0,
    usdValue: 9_800.0,
    status: "completed",
    timestamp: "2025-02-28T21:00:00Z",
    pair: "ADA/USDT",
    side: "buy",
    price: 0.98,
    fee: 9.8,
  },
  {
    id: "tx-017",
    type: "transfer",
    asset: "ETH",
    amount: 2.5,
    usdValue: 8_641.95,
    status: "completed",
    timestamp: "2025-02-28T14:00:00Z",
    from: "Spot",
    to: "Earn",
  },
  {
    id: "tx-018",
    type: "fee",
    asset: "BNB",
    amount: 0.02,
    usdValue: 12.68,
    status: "completed",
    timestamp: "2025-02-28T10:00:00Z",
  },
  {
    id: "tx-019",
    type: "trade",
    asset: "AVAX",
    amount: 50.0,
    usdValue: 1_946.0,
    status: "completed",
    timestamp: "2025-02-27T16:30:00Z",
    pair: "AVAX/USDT",
    side: "buy",
    price: 38.92,
    fee: 1.95,
  },
  {
    id: "tx-020",
    type: "deposit",
    asset: "USDT",
    amount: 50_000.0,
    usdValue: 50_000.0,
    status: "completed",
    timestamp: "2025-02-27T08:00:00Z",
    network: "TRC-20",
    txHash: "0xqr5s6t...9u0v1w",
  },
];

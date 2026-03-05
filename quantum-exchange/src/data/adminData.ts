export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "user" | "vip" | "market_maker" | "admin";
  status: "active" | "suspended" | "pending" | "banned";
  kycLevel: 0 | 1 | 2 | 3;
  totalBalance: number;
  tradingVolume30d: number;
  registeredAt: string;
  lastLogin: string;
  country: string;
}

export interface AdminTransaction {
  id: string;
  userId: string;
  username: string;
  type: "deposit" | "withdrawal" | "trade" | "transfer" | "fee";
  asset: string;
  amount: number;
  usdValue: number;
  status: "completed" | "pending" | "failed" | "reviewing";
  timestamp: string;
  txHash?: string;
  network?: string;
}

export interface KYCRequest {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  country: string;
  documentType: "passport" | "national_id" | "drivers_license";
  level: 1 | 2 | 3;
  status: "pending" | "approved" | "rejected" | "under_review";
  submittedAt: string;
  reviewedAt?: string;
  reviewer?: string;
  notes?: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  username: string;
  pair: string;
  side: "buy" | "sell";
  type: "limit" | "market" | "stop_limit" | "stop_market";
  price: number;
  amount: number;
  filled: number;
  total: number;
  status: "open" | "filled" | "partially_filled" | "cancelled";
  createdAt: string;
}

export interface SystemAlert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers24h: number;
  newUsersToday: number;
  totalVolume24h: number;
  totalTrades24h: number;
  totalDeposits24h: number;
  totalWithdrawals24h: number;
  pendingKYC: number;
  pendingWithdrawals: number;
  systemUptime: number;
  revenue24h: number;
  revenue30d: number;
}

export const platformStats: PlatformStats = {
  totalUsers: 284_592,
  activeUsers24h: 42_318,
  newUsersToday: 1_247,
  totalVolume24h: 2_840_000_000,
  totalTrades24h: 1_892_456,
  totalDeposits24h: 156_000_000,
  totalWithdrawals24h: 98_000_000,
  pendingKYC: 342,
  pendingWithdrawals: 87,
  systemUptime: 99.98,
  revenue24h: 2_840_000,
  revenue30d: 78_500_000,
};

export const revenueHistory = [
  { date: "Jan", revenue: 52_000_000, users: 198_000 },
  { date: "Feb", revenue: 58_000_000, users: 215_000 },
  { date: "Mar", revenue: 61_000_000, users: 228_000 },
  { date: "Apr", revenue: 55_000_000, users: 235_000 },
  { date: "May", revenue: 67_000_000, users: 248_000 },
  { date: "Jun", revenue: 72_000_000, users: 256_000 },
  { date: "Jul", revenue: 68_000_000, users: 261_000 },
  { date: "Aug", revenue: 74_000_000, users: 268_000 },
  { date: "Sep", revenue: 71_000_000, users: 274_000 },
  { date: "Oct", revenue: 76_000_000, users: 278_000 },
  { date: "Nov", revenue: 78_500_000, users: 282_000 },
  { date: "Dec", revenue: 82_000_000, users: 284_592 },
];

export const volumeByAsset = [
  { asset: "BTC", volume: 1_240_000_000, percentage: 43.7 },
  { asset: "ETH", volume: 680_000_000, percentage: 23.9 },
  { asset: "SOL", volume: 320_000_000, percentage: 11.3 },
  { asset: "BNB", volume: 185_000_000, percentage: 6.5 },
  { asset: "XRP", volume: 156_000_000, percentage: 5.5 },
  { asset: "Others", volume: 259_000_000, percentage: 9.1 },
];

export const adminUsers: AdminUser[] = [
  { id: "USR-001", username: "crypto_whale", email: "whale@proton.me", fullName: "Marcus Chen", role: "vip", status: "active", kycLevel: 3, totalBalance: 2_450_000, tradingVolume30d: 45_000_000, registeredAt: "2024-01-15", lastLogin: "2025-03-05 14:23", country: "Singapore" },
  { id: "USR-002", username: "alex_trader", email: "alex@gmail.com", fullName: "Alex Johnson", role: "user", status: "active", kycLevel: 2, totalBalance: 125_000, tradingVolume30d: 890_000, registeredAt: "2024-03-22", lastLogin: "2025-03-05 12:45", country: "United States" },
  { id: "USR-003", username: "tokyo_btc", email: "yuki@yahoo.co.jp", fullName: "Yuki Tanaka", role: "market_maker", status: "active", kycLevel: 3, totalBalance: 8_900_000, tradingVolume30d: 120_000_000, registeredAt: "2023-11-08", lastLogin: "2025-03-05 15:00", country: "Japan" },
  { id: "USR-004", username: "defi_master", email: "defi@outlook.com", fullName: "Sarah Williams", role: "user", status: "suspended", kycLevel: 1, totalBalance: 45_000, tradingVolume30d: 230_000, registeredAt: "2024-06-10", lastLogin: "2025-02-28 09:12", country: "United Kingdom" },
  { id: "USR-005", username: "moon_hodler", email: "moon@proton.me", fullName: "David Kim", role: "user", status: "active", kycLevel: 2, totalBalance: 78_000, tradingVolume30d: 456_000, registeredAt: "2024-02-14", lastLogin: "2025-03-04 22:33", country: "South Korea" },
  { id: "USR-006", username: "eth_maxi", email: "ethmax@gmail.com", fullName: "Elena Volkov", role: "vip", status: "active", kycLevel: 3, totalBalance: 1_200_000, tradingVolume30d: 28_000_000, registeredAt: "2023-09-20", lastLogin: "2025-03-05 13:15", country: "Russia" },
  { id: "USR-007", username: "new_user_42", email: "newbie42@mail.com", fullName: "Ahmad Hassan", role: "user", status: "pending", kycLevel: 0, totalBalance: 500, tradingVolume30d: 0, registeredAt: "2025-03-05", lastLogin: "2025-03-05 10:00", country: "UAE" },
  { id: "USR-008", username: "scam_alert", email: "fake@temp.com", fullName: "John Doe", role: "user", status: "banned", kycLevel: 0, totalBalance: 0, tradingVolume30d: 0, registeredAt: "2025-02-20", lastLogin: "2025-02-22 03:45", country: "Unknown" },
  { id: "USR-009", username: "sol_queen", email: "sol@proton.me", fullName: "Maria Santos", role: "user", status: "active", kycLevel: 2, totalBalance: 234_000, tradingVolume30d: 1_200_000, registeredAt: "2024-04-18", lastLogin: "2025-03-05 11:30", country: "Brazil" },
  { id: "USR-010", username: "quant_algo", email: "quant@hedge.com", fullName: "James Wright", role: "market_maker", status: "active", kycLevel: 3, totalBalance: 15_600_000, tradingVolume30d: 250_000_000, registeredAt: "2023-07-05", lastLogin: "2025-03-05 15:10", country: "Switzerland" },
  { id: "USR-011", username: "btc_rookie", email: "rookie@mail.com", fullName: "Lucas Meyer", role: "user", status: "active", kycLevel: 1, totalBalance: 2_300, tradingVolume30d: 12_000, registeredAt: "2025-01-10", lastLogin: "2025-03-03 18:20", country: "Germany" },
  { id: "USR-012", username: "ada_fan", email: "ada@proton.me", fullName: "Priya Sharma", role: "user", status: "active", kycLevel: 2, totalBalance: 56_000, tradingVolume30d: 340_000, registeredAt: "2024-08-12", lastLogin: "2025-03-05 09:45", country: "India" },
];

export const adminTransactions: AdminTransaction[] = [
  { id: "TX-90001", userId: "USR-001", username: "crypto_whale", type: "deposit", asset: "BTC", amount: 5.0, usdValue: 489_212.50, status: "completed", timestamp: "2025-03-05 14:20", txHash: "0xabc1...def1", network: "Bitcoin" },
  { id: "TX-90002", userId: "USR-003", username: "tokyo_btc", type: "withdrawal", asset: "USDT", amount: 500_000, usdValue: 500_000, status: "pending", timestamp: "2025-03-05 14:15", network: "Ethereum" },
  { id: "TX-90003", userId: "USR-002", username: "alex_trader", type: "trade", asset: "ETH/USDT", amount: 12.5, usdValue: 43_209.75, status: "completed", timestamp: "2025-03-05 14:10" },
  { id: "TX-90004", userId: "USR-006", username: "eth_maxi", type: "deposit", asset: "ETH", amount: 100, usdValue: 345_678.00, status: "completed", timestamp: "2025-03-05 13:58", txHash: "0xabc2...def2", network: "Ethereum" },
  { id: "TX-90005", userId: "USR-004", username: "defi_master", type: "withdrawal", asset: "USDT", amount: 45_000, usdValue: 45_000, status: "reviewing", timestamp: "2025-03-05 13:45", network: "Tron" },
  { id: "TX-90006", userId: "USR-005", username: "moon_hodler", type: "trade", asset: "SOL/USDT", amount: 250, usdValue: 49_612.50, status: "completed", timestamp: "2025-03-05 13:30" },
  { id: "TX-90007", userId: "USR-010", username: "quant_algo", type: "trade", asset: "BTC/USDT", amount: 2.5, usdValue: 244_606.25, status: "completed", timestamp: "2025-03-05 13:22" },
  { id: "TX-90008", userId: "USR-009", username: "sol_queen", type: "deposit", asset: "SOL", amount: 500, usdValue: 99_225.00, status: "completed", timestamp: "2025-03-05 13:10", txHash: "0xabc3...def3", network: "Solana" },
  { id: "TX-90009", userId: "USR-001", username: "crypto_whale", type: "withdrawal", asset: "BTC", amount: 2.0, usdValue: 195_685.06, status: "pending", timestamp: "2025-03-05 12:58", network: "Bitcoin" },
  { id: "TX-90010", userId: "USR-007", username: "new_user_42", type: "deposit", asset: "USDT", amount: 500, usdValue: 500, status: "completed", timestamp: "2025-03-05 12:45", txHash: "0xabc4...def4", network: "Tron" },
  { id: "TX-90011", userId: "USR-011", username: "btc_rookie", type: "trade", asset: "BTC/USDT", amount: 0.02, usdValue: 1_956.85, status: "completed", timestamp: "2025-03-05 12:30" },
  { id: "TX-90012", userId: "USR-003", username: "tokyo_btc", type: "trade", asset: "ETH/USDT", amount: 50, usdValue: 172_839.00, status: "completed", timestamp: "2025-03-05 12:15" },
  { id: "TX-90013", userId: "USR-008", username: "scam_alert", type: "withdrawal", asset: "USDT", amount: 25_000, usdValue: 25_000, status: "failed", timestamp: "2025-02-22 03:40", network: "Tron" },
  { id: "TX-90014", userId: "USR-012", username: "ada_fan", type: "deposit", asset: "ADA", amount: 50_000, usdValue: 49_000, status: "completed", timestamp: "2025-03-05 11:20", txHash: "0xabc5...def5", network: "Cardano" },
  { id: "TX-90015", userId: "USR-006", username: "eth_maxi", type: "transfer", asset: "USDT", amount: 100_000, usdValue: 100_000, status: "completed", timestamp: "2025-03-05 10:50" },
];

export const kycRequests: KYCRequest[] = [
  { id: "KYC-001", userId: "USR-007", username: "new_user_42", fullName: "Ahmad Hassan", email: "newbie42@mail.com", country: "UAE", documentType: "passport", level: 1, status: "pending", submittedAt: "2025-03-05 10:05" },
  { id: "KYC-002", userId: "USR-011", username: "btc_rookie", fullName: "Lucas Meyer", email: "rookie@mail.com", country: "Germany", documentType: "national_id", level: 2, status: "pending", submittedAt: "2025-03-04 16:30" },
  { id: "KYC-003", userId: "USR-009", username: "sol_queen", fullName: "Maria Santos", email: "sol@proton.me", country: "Brazil", documentType: "drivers_license", level: 2, status: "under_review", submittedAt: "2025-03-03 09:15", reviewer: "Admin-01" },
  { id: "KYC-004", userId: "USR-002", username: "alex_trader", fullName: "Alex Johnson", email: "alex@gmail.com", country: "United States", documentType: "passport", level: 2, status: "approved", submittedAt: "2025-02-28 14:20", reviewedAt: "2025-03-01 10:00", reviewer: "Admin-02" },
  { id: "KYC-005", userId: "USR-005", username: "moon_hodler", fullName: "David Kim", email: "moon@proton.me", country: "South Korea", documentType: "national_id", level: 2, status: "approved", submittedAt: "2025-02-25 11:00", reviewedAt: "2025-02-26 09:30", reviewer: "Admin-01" },
  { id: "KYC-006", userId: "USR-008", username: "scam_alert", fullName: "John Doe", email: "fake@temp.com", country: "Unknown", documentType: "passport", level: 1, status: "rejected", submittedAt: "2025-02-21 08:00", reviewedAt: "2025-02-21 15:00", reviewer: "Admin-02", notes: "Fraudulent document detected" },
  { id: "KYC-007", userId: "USR-012", username: "ada_fan", fullName: "Priya Sharma", email: "ada@proton.me", country: "India", documentType: "passport", level: 3, status: "pending", submittedAt: "2025-03-05 08:45" },
  { id: "KYC-008", userId: "USR-004", username: "defi_master", fullName: "Sarah Williams", email: "defi@outlook.com", country: "United Kingdom", documentType: "drivers_license", level: 2, status: "under_review", submittedAt: "2025-03-04 14:00", reviewer: "Admin-01" },
];

export const adminOrders: AdminOrder[] = [
  { id: "ORD-50001", userId: "USR-001", username: "crypto_whale", pair: "BTC/USDT", side: "buy", type: "limit", price: 96_000, amount: 3.0, filled: 0, total: 288_000, status: "open", createdAt: "2025-03-05 14:25" },
  { id: "ORD-50002", userId: "USR-003", username: "tokyo_btc", pair: "ETH/USDT", side: "sell", type: "limit", price: 3_600, amount: 50, filled: 32, total: 180_000, status: "partially_filled", createdAt: "2025-03-05 14:10" },
  { id: "ORD-50003", userId: "USR-010", username: "quant_algo", pair: "BTC/USDT", side: "buy", type: "market", price: 97_842, amount: 2.5, filled: 2.5, total: 244_606, status: "filled", createdAt: "2025-03-05 13:22" },
  { id: "ORD-50004", userId: "USR-006", username: "eth_maxi", pair: "ETH/USDT", side: "buy", type: "stop_limit", price: 3_200, amount: 100, filled: 0, total: 320_000, status: "open", createdAt: "2025-03-05 13:00" },
  { id: "ORD-50005", userId: "USR-005", username: "moon_hodler", pair: "SOL/USDT", side: "buy", type: "limit", price: 185, amount: 250, filled: 250, total: 46_250, status: "filled", createdAt: "2025-03-05 12:45" },
  { id: "ORD-50006", userId: "USR-002", username: "alex_trader", pair: "BNB/USDT", side: "sell", type: "limit", price: 650, amount: 20, filled: 0, total: 13_000, status: "cancelled", createdAt: "2025-03-05 11:30" },
  { id: "ORD-50007", userId: "USR-009", username: "sol_queen", pair: "SOL/USDT", side: "sell", type: "stop_market", price: 180, amount: 100, filled: 0, total: 18_000, status: "open", createdAt: "2025-03-05 11:00" },
  { id: "ORD-50008", userId: "USR-012", username: "ada_fan", pair: "ADA/USDT", side: "buy", type: "limit", price: 0.95, amount: 25_000, filled: 12_500, total: 23_750, status: "partially_filled", createdAt: "2025-03-05 10:30" },
  { id: "ORD-50009", userId: "USR-001", username: "crypto_whale", pair: "XRP/USDT", side: "buy", type: "market", price: 2.34, amount: 100_000, filled: 100_000, total: 234_000, status: "filled", createdAt: "2025-03-05 10:00" },
  { id: "ORD-50010", userId: "USR-011", username: "btc_rookie", pair: "BTC/USDT", side: "buy", type: "market", price: 97_800, amount: 0.02, filled: 0.02, total: 1_956, status: "filled", createdAt: "2025-03-05 09:45" },
];

export const systemAlerts: SystemAlert[] = [
  { id: "ALT-001", type: "critical", title: "High Withdrawal Volume", message: "Withdrawal volume exceeded $50M threshold in the last hour. Manual review required.", timestamp: "2025-03-05 14:30", resolved: false },
  { id: "ALT-002", type: "warning", title: "API Latency Spike", message: "Trading API response time increased to 450ms (threshold: 200ms). Monitoring.", timestamp: "2025-03-05 13:45", resolved: false },
  { id: "ALT-003", type: "info", title: "Scheduled Maintenance", message: "System maintenance scheduled for March 7, 2025 02:00-04:00 UTC.", timestamp: "2025-03-05 10:00", resolved: false },
  { id: "ALT-004", type: "warning", title: "Suspicious Login Pattern", message: "User scam_alert (USR-008) flagged for multiple failed login attempts from different IPs.", timestamp: "2025-02-22 03:30", resolved: true },
  { id: "ALT-005", type: "critical", title: "Hot Wallet Balance Low", message: "ETH hot wallet balance below 500 ETH. Replenishment needed.", timestamp: "2025-03-05 12:00", resolved: false },
  { id: "ALT-006", type: "info", title: "New Token Listing", message: "PEPE/USDT pair successfully listed. Trading is now active.", timestamp: "2025-03-04 18:00", resolved: true },
];

export const hotWalletBalances = [
  { asset: "BTC", balance: 245.8, usdValue: 24_050_000, threshold: 100 },
  { asset: "ETH", balance: 4_820, usdValue: 16_660_000, threshold: 500 },
  { asset: "USDT", balance: 85_000_000, usdValue: 85_000_000, threshold: 10_000_000 },
  { asset: "SOL", balance: 125_000, usdValue: 24_806_250, threshold: 10_000 },
  { asset: "BNB", balance: 18_500, usdValue: 11_732_885, threshold: 1_000 },
  { asset: "XRP", balance: 45_000_000, usdValue: 105_300_000, threshold: 5_000_000 },
];

// ====== P&L Analytics Data ======

export interface PnLMonthly {
  month: string;
  tradingFees: number;
  withdrawalFees: number;
  listingFees: number;
  stakingRevenue: number;
  operatingCosts: number;
  netProfit: number;
  trades: number;
  volume: number;
}

export interface AssetPnL {
  asset: string;
  totalVolume: number;
  totalFees: number;
  buyVolume: number;
  sellVolume: number;
  netFlow: number;
  avgSpread: number;
  profitMargin: number;
}

export interface DailyPnL {
  date: string;
  revenue: number;
  costs: number;
  profit: number;
  volume: number;
  trades: number;
}

export interface TopTraderPnL {
  userId: string;
  username: string;
  totalVolume: number;
  totalFees: number;
  tradesCount: number;
  pnl: number;
  winRate: number;
  lastActive: string;
}

export const monthlyPnL: PnLMonthly[] = [
  { month: "Jan 2025", tradingFees: 3_120_000, withdrawalFees: 480_000, listingFees: 250_000, stakingRevenue: 180_000, operatingCosts: 1_850_000, netProfit: 2_180_000, trades: 12_400_000, volume: 62_000_000_000 },
  { month: "Feb 2025", tradingFees: 3_450_000, withdrawalFees: 520_000, listingFees: 150_000, stakingRevenue: 195_000, operatingCosts: 1_920_000, netProfit: 2_395_000, trades: 13_800_000, volume: 69_000_000_000 },
  { month: "Mar 2025", tradingFees: 3_890_000, withdrawalFees: 610_000, listingFees: 350_000, stakingRevenue: 210_000, operatingCosts: 2_050_000, netProfit: 3_010_000, trades: 15_200_000, volume: 78_000_000_000 },
];

export const assetPnL: AssetPnL[] = [
  { asset: "BTC", totalVolume: 38_400_000_000, totalFees: 3_840_000, buyVolume: 20_100_000_000, sellVolume: 18_300_000_000, netFlow: 1_800_000_000, avgSpread: 0.01, profitMargin: 0.010 },
  { asset: "ETH", totalVolume: 21_200_000_000, totalFees: 2_120_000, buyVolume: 11_400_000_000, sellVolume: 9_800_000_000, netFlow: 1_600_000_000, avgSpread: 0.02, profitMargin: 0.010 },
  { asset: "SOL", totalVolume: 9_600_000_000, totalFees: 1_152_000, buyVolume: 5_200_000_000, sellVolume: 4_400_000_000, netFlow: 800_000_000, avgSpread: 0.03, profitMargin: 0.012 },
  { asset: "BNB", totalVolume: 5_550_000_000, totalFees: 555_000, buyVolume: 2_800_000_000, sellVolume: 2_750_000_000, netFlow: 50_000_000, avgSpread: 0.02, profitMargin: 0.010 },
  { asset: "XRP", totalVolume: 4_680_000_000, totalFees: 468_000, buyVolume: 2_600_000_000, sellVolume: 2_080_000_000, netFlow: 520_000_000, avgSpread: 0.04, profitMargin: 0.010 },
  { asset: "ADA", totalVolume: 2_670_000_000, totalFees: 320_400, buyVolume: 1_500_000_000, sellVolume: 1_170_000_000, netFlow: 330_000_000, avgSpread: 0.05, profitMargin: 0.012 },
  { asset: "DOGE", totalVolume: 2_340_000_000, totalFees: 280_800, buyVolume: 1_400_000_000, sellVolume: 940_000_000, netFlow: 460_000_000, avgSpread: 0.06, profitMargin: 0.012 },
  { asset: "PEPE", totalVolume: 1_350_000_000, totalFees: 202_500, buyVolume: 900_000_000, sellVolume: 450_000_000, netFlow: 450_000_000, avgSpread: 0.12, profitMargin: 0.015 },
];

export const dailyPnL: DailyPnL[] = [
  { date: "Feb 18", revenue: 142_000, costs: 62_000, profit: 80_000, volume: 2_840_000_000, trades: 1_650_000 },
  { date: "Feb 19", revenue: 156_000, costs: 64_000, profit: 92_000, volume: 3_120_000_000, trades: 1_780_000 },
  { date: "Feb 20", revenue: 134_000, costs: 61_000, profit: 73_000, volume: 2_680_000_000, trades: 1_520_000 },
  { date: "Feb 21", revenue: 168_000, costs: 67_000, profit: 101_000, volume: 3_360_000_000, trades: 1_920_000 },
  { date: "Feb 22", revenue: 145_000, costs: 63_000, profit: 82_000, volume: 2_900_000_000, trades: 1_680_000 },
  { date: "Feb 23", revenue: 112_000, costs: 58_000, profit: 54_000, volume: 2_240_000_000, trades: 1_280_000 },
  { date: "Feb 24", revenue: 98_000, costs: 55_000, profit: 43_000, volume: 1_960_000_000, trades: 1_120_000 },
  { date: "Feb 25", revenue: 158_000, costs: 65_000, profit: 93_000, volume: 3_160_000_000, trades: 1_800_000 },
  { date: "Feb 26", revenue: 172_000, costs: 68_000, profit: 104_000, volume: 3_440_000_000, trades: 1_960_000 },
  { date: "Feb 27", revenue: 148_000, costs: 63_000, profit: 85_000, volume: 2_960_000_000, trades: 1_690_000 },
  { date: "Feb 28", revenue: 165_000, costs: 66_000, profit: 99_000, volume: 3_300_000_000, trades: 1_880_000 },
  { date: "Mar 01", revenue: 178_000, costs: 69_000, profit: 109_000, volume: 3_560_000_000, trades: 2_030_000 },
  { date: "Mar 02", revenue: 125_000, costs: 59_000, profit: 66_000, volume: 2_500_000_000, trades: 1_430_000 },
  { date: "Mar 03", revenue: 189_000, costs: 72_000, profit: 117_000, volume: 3_780_000_000, trades: 2_160_000 },
  { date: "Mar 04", revenue: 195_000, costs: 74_000, profit: 121_000, volume: 3_900_000_000, trades: 2_230_000 },
  { date: "Mar 05", revenue: 142_000, costs: 62_000, profit: 80_000, volume: 2_840_000_000, trades: 1_892_456 },
];

export const topTradersPnL: TopTraderPnL[] = [
  { userId: "USR-010", username: "quant_algo", totalVolume: 250_000_000, totalFees: 250_000, tradesCount: 48_200, pnl: 1_250_000, winRate: 68.5, lastActive: "2025-03-05 15:10" },
  { userId: "USR-003", username: "tokyo_btc", totalVolume: 120_000_000, totalFees: 120_000, tradesCount: 22_400, pnl: 890_000, winRate: 62.3, lastActive: "2025-03-05 15:00" },
  { userId: "USR-001", username: "crypto_whale", totalVolume: 45_000_000, totalFees: 45_000, tradesCount: 3_200, pnl: 420_000, winRate: 71.2, lastActive: "2025-03-05 14:23" },
  { userId: "USR-006", username: "eth_maxi", totalVolume: 28_000_000, totalFees: 28_000, tradesCount: 8_900, pnl: 185_000, winRate: 58.9, lastActive: "2025-03-05 13:15" },
  { userId: "USR-009", username: "sol_queen", totalVolume: 1_200_000, totalFees: 1_200, tradesCount: 890, pnl: 34_000, winRate: 55.2, lastActive: "2025-03-05 11:30" },
  { userId: "USR-002", username: "alex_trader", totalVolume: 890_000, totalFees: 890, tradesCount: 456, pnl: -12_500, winRate: 42.1, lastActive: "2025-03-05 12:45" },
  { userId: "USR-005", username: "moon_hodler", totalVolume: 456_000, totalFees: 456, tradesCount: 234, pnl: 8_200, winRate: 51.7, lastActive: "2025-03-04 22:33" },
  { userId: "USR-012", username: "ada_fan", totalVolume: 340_000, totalFees: 340, tradesCount: 178, pnl: -4_300, winRate: 44.9, lastActive: "2025-03-05 09:45" },
  { userId: "USR-011", username: "btc_rookie", totalVolume: 12_000, totalFees: 12, tradesCount: 15, pnl: -800, winRate: 33.3, lastActive: "2025-03-03 18:20" },
];

export const tradingPairStats = [
  { pair: "BTC/USDT", volume24h: 1_240_000_000, trades24h: 542_000, spread: 0.01, status: "active" as const },
  { pair: "ETH/USDT", volume24h: 680_000_000, trades24h: 389_000, spread: 0.02, status: "active" as const },
  { pair: "SOL/USDT", volume24h: 320_000_000, trades24h: 215_000, spread: 0.03, status: "active" as const },
  { pair: "BNB/USDT", volume24h: 185_000_000, trades24h: 128_000, spread: 0.02, status: "active" as const },
  { pair: "XRP/USDT", volume24h: 156_000_000, trades24h: 98_000, spread: 0.04, status: "active" as const },
  { pair: "ADA/USDT", volume24h: 89_000_000, trades24h: 76_000, spread: 0.05, status: "active" as const },
  { pair: "DOGE/USDT", volume24h: 78_000_000, trades24h: 145_000, spread: 0.06, status: "active" as const },
  { pair: "PEPE/USDT", volume24h: 45_000_000, trades24h: 234_000, spread: 0.12, status: "active" as const },
];

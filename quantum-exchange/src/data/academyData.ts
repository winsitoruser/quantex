export interface AcademyArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  readTime: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
  content?: string;
}

export interface AcademyCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articleCount: number;
  color: string;
}

export const academyCategories: AcademyCategory[] = [
  { id: "getting-started", name: "Getting Started", icon: "🚀", description: "Learn the basics of crypto trading", articleCount: 24, color: "from-accent to-emerald-400" },
  { id: "trading-basics", name: "Trading Basics", icon: "📊", description: "Spot, margin, and futures trading fundamentals", articleCount: 32, color: "from-blue-500 to-cyan" },
  { id: "technical-analysis", name: "Technical Analysis", icon: "📈", description: "Charts, indicators, and pattern recognition", articleCount: 28, color: "from-purple to-violet-400" },
  { id: "defi", name: "DeFi & Web3", icon: "🌐", description: "Decentralized finance, NFTs, and DAOs", articleCount: 18, color: "from-pink-500 to-rose-400" },
  { id: "security", name: "Security", icon: "🔒", description: "Protect your assets and stay safe", articleCount: 15, color: "from-warning to-amber-400" },
  { id: "trading-bots", name: "Trading Bots", icon: "🤖", description: "Automated trading strategies and tools", articleCount: 12, color: "from-cyan to-sky-400" },
  { id: "blockchain", name: "Blockchain", icon: "⛓️", description: "How blockchain technology works", articleCount: 20, color: "from-indigo-500 to-blue-400" },
  { id: "risk-management", name: "Risk Management", icon: "🛡️", description: "Portfolio management and risk strategies", articleCount: 16, color: "from-red-500 to-orange-400" },
];

export const academyArticles: AcademyArticle[] = [
  {
    id: "what-is-bitcoin",
    title: "What is Bitcoin? A Complete Beginner's Guide",
    excerpt: "Learn everything about Bitcoin — the world's first cryptocurrency, how it works, and why it matters for the future of finance.",
    category: "getting-started",
    level: "beginner",
    readTime: "8 min",
    image: "https://picsum.photos/seed/academy1/800/450",
    author: "Quantum Academy",
    date: "2026-02-28",
    tags: ["Bitcoin", "Cryptocurrency", "Beginner"],
  },
  {
    id: "how-to-read-candlestick",
    title: "How to Read Candlestick Charts Like a Pro",
    excerpt: "Master the art of reading candlestick charts. Understand patterns, wicks, and body formations for better trading decisions.",
    category: "technical-analysis",
    level: "beginner",
    readTime: "12 min",
    image: "https://picsum.photos/seed/academy2/800/450",
    author: "Quantum Academy",
    date: "2026-02-25",
    tags: ["Charts", "Technical Analysis", "Candlestick"],
  },
  {
    id: "grid-trading-bot",
    title: "Grid Trading Bot: How It Works & Setup Guide",
    excerpt: "Discover how grid trading bots automate your buy/sell orders in a range-bound market to capture profits 24/7.",
    category: "trading-bots",
    level: "intermediate",
    readTime: "15 min",
    image: "https://picsum.photos/seed/academy3/800/450",
    author: "Quantum Academy",
    date: "2026-02-20",
    tags: ["Trading Bot", "Grid Trading", "Automation"],
  },
  {
    id: "defi-yield-farming",
    title: "DeFi Yield Farming Explained: Risks & Rewards",
    excerpt: "Understanding yield farming in DeFi — liquidity pools, APY calculations, impermanent loss, and strategies to maximize returns.",
    category: "defi",
    level: "intermediate",
    readTime: "10 min",
    image: "https://picsum.photos/seed/academy4/800/450",
    author: "Quantum Academy",
    date: "2026-02-18",
    tags: ["DeFi", "Yield Farming", "Liquidity"],
  },
  {
    id: "rsi-macd-indicators",
    title: "RSI and MACD: The Ultimate Indicator Guide",
    excerpt: "Deep dive into RSI and MACD indicators. Learn how to combine them for powerful trading signals and entry/exit points.",
    category: "technical-analysis",
    level: "advanced",
    readTime: "18 min",
    image: "https://picsum.photos/seed/academy5/800/450",
    author: "Quantum Academy",
    date: "2026-02-15",
    tags: ["RSI", "MACD", "Indicators", "Technical Analysis"],
  },
  {
    id: "crypto-wallet-security",
    title: "Securing Your Crypto: Complete Security Checklist",
    excerpt: "Essential security practices for protecting your digital assets — from 2FA setup to hardware wallets and phishing prevention.",
    category: "security",
    level: "beginner",
    readTime: "7 min",
    image: "https://picsum.photos/seed/academy6/800/450",
    author: "Quantum Academy",
    date: "2026-02-12",
    tags: ["Security", "Wallet", "2FA"],
  },
  {
    id: "dca-bot-strategy",
    title: "DCA Bot Strategy: Dollar-Cost Averaging Automation",
    excerpt: "How to set up a DCA bot to automatically invest in crypto at regular intervals, reducing the impact of volatility.",
    category: "trading-bots",
    level: "beginner",
    readTime: "10 min",
    image: "https://picsum.photos/seed/academy7/800/450",
    author: "Quantum Academy",
    date: "2026-02-10",
    tags: ["DCA", "Trading Bot", "Strategy"],
  },
  {
    id: "leverage-trading-guide",
    title: "Leverage Trading: Complete Guide with Risk Management",
    excerpt: "Everything you need to know about trading with leverage — margin requirements, liquidation, and position sizing.",
    category: "trading-basics",
    level: "advanced",
    readTime: "20 min",
    image: "https://picsum.photos/seed/academy8/800/450",
    author: "Quantum Academy",
    date: "2026-02-08",
    tags: ["Leverage", "Futures", "Risk Management"],
  },
  {
    id: "smart-contract-basics",
    title: "Smart Contracts 101: How They Power DeFi",
    excerpt: "Understanding smart contracts — what they are, how they work on Ethereum, and their role in decentralized applications.",
    category: "blockchain",
    level: "intermediate",
    readTime: "13 min",
    image: "https://picsum.photos/seed/academy9/800/450",
    author: "Quantum Academy",
    date: "2026-02-05",
    tags: ["Smart Contracts", "Ethereum", "DeFi"],
  },
  {
    id: "portfolio-diversification",
    title: "Crypto Portfolio Diversification Strategies",
    excerpt: "Build a balanced portfolio across different crypto sectors — large caps, DeFi tokens, layer-2 solutions, and stablecoins.",
    category: "risk-management",
    level: "intermediate",
    readTime: "11 min",
    image: "https://picsum.photos/seed/academy10/800/450",
    author: "Quantum Academy",
    date: "2026-02-02",
    tags: ["Portfolio", "Diversification", "Strategy"],
  },
  {
    id: "arbitrage-bot-guide",
    title: "Arbitrage Trading Bots: Profit from Price Differences",
    excerpt: "Learn how arbitrage bots exploit price differences across exchanges and trading pairs for low-risk profits.",
    category: "trading-bots",
    level: "advanced",
    readTime: "16 min",
    image: "https://picsum.photos/seed/academy11/800/450",
    author: "Quantum Academy",
    date: "2026-01-28",
    tags: ["Arbitrage", "Trading Bot", "Advanced"],
  },
  {
    id: "order-types-explained",
    title: "Order Types Explained: Limit, Market, Stop-Loss & More",
    excerpt: "Master all order types available on Quantum Exchange — when to use each one and how they affect your trades.",
    category: "trading-basics",
    level: "beginner",
    readTime: "9 min",
    image: "https://picsum.photos/seed/academy12/800/450",
    author: "Quantum Academy",
    date: "2026-01-25",
    tags: ["Orders", "Trading", "Basics"],
  },
];

export const featuredCourses = [
  { id: "crypto-101", title: "Crypto Trading 101", lessons: 12, duration: "3 hours", level: "beginner" as const, enrolled: 45200, rating: 4.8 },
  { id: "ta-masterclass", title: "Technical Analysis Masterclass", lessons: 24, duration: "8 hours", level: "intermediate" as const, enrolled: 23800, rating: 4.9 },
  { id: "bot-trading", title: "Trading Bot Mastery", lessons: 16, duration: "5 hours", level: "advanced" as const, enrolled: 12400, rating: 4.7 },
  { id: "defi-deep-dive", title: "DeFi Deep Dive", lessons: 18, duration: "6 hours", level: "intermediate" as const, enrolled: 18600, rating: 4.8 },
];

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Shield,
  Clock,
  Star,
  ChevronDown,
  ArrowUpDown,
  Users,
  TrendingUp,
  Zap,
  Filter,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { p2pAds, cryptoOptions, fiatOptions, type P2PAd } from "@/data/p2pData";
import { cn } from "@/lib/utils";

type TradeType = "buy" | "sell";

export default function P2PPage() {
  const [tradeType, setTradeType] = useState<TradeType>("buy");
  const [selectedCrypto, setSelectedCrypto] = useState("USDT");
  const [selectedFiat, setSelectedFiat] = useState("IDR");
  const [amount, setAmount] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const paymentOptions = useMemo(() => {
    const methods = new Set<string>();
    p2pAds.forEach((ad) => ad.paymentMethods.forEach((m) => methods.add(m)));
    return ["All", ...Array.from(methods)];
  }, []);

  const filteredAds = useMemo(() => {
    return p2pAds.filter((ad) => {
      // When user wants to buy, show sell ads (and vice versa)
      if (tradeType === "buy" && ad.type !== "sell") return false;
      if (tradeType === "sell" && ad.type !== "buy") return false;
      if (ad.crypto !== selectedCrypto) return false;
      if (ad.fiat !== selectedFiat) return false;
      if (selectedPayment !== "All" && !ad.paymentMethods.includes(selectedPayment)) return false;
      if (amount) {
        const numAmount = parseFloat(amount);
        if (numAmount < ad.minLimit || numAmount > ad.maxLimit) return false;
      }
      return true;
    });
  }, [tradeType, selectedCrypto, selectedFiat, amount, selectedPayment]);

  const formatNumber = (n: number) => {
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(2)}B`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return n.toLocaleString();
    return n.toString();
  };

  const fiatSymbol = fiatOptions.find((f) => f.code === selectedFiat)?.symbol || "";

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">P2P Trading</h1>
            <p className="text-muted">Buy and sell crypto directly with other users. Zero trading fees.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/p2p/orders"
              className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-muted hover:text-foreground hover:border-border-light transition-colors"
            >
              My Orders
            </Link>
            <Link
              href="/p2p/my-ads"
              className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-muted hover:text-foreground hover:border-border-light transition-colors"
            >
              My Ads
            </Link>
            <Link
              href="/p2p/create-ad"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Post Ad
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {[
            { icon: Users, label: "Active Merchants", value: "2,847" },
            { icon: TrendingUp, label: "24h Volume", value: "$12.5M" },
            { icon: Shield, label: "Escrow Protected", value: "100%" },
            { icon: Zap, label: "Avg. Release Time", value: "< 3 min" },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <Icon className="h-4.5 w-4.5 text-accent mb-2" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Buy/Sell Toggle + Crypto Selector */}
        <div className="rounded-2xl bg-card border border-border p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Buy/Sell Toggle */}
            <div className="flex bg-background rounded-xl p-1">
              <button
                onClick={() => setTradeType("buy")}
                className={cn(
                  "flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  tradeType === "buy"
                    ? "bg-accent text-background"
                    : "text-muted hover:text-foreground"
                )}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType("sell")}
                className={cn(
                  "flex-1 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all",
                  tradeType === "sell"
                    ? "bg-danger text-white"
                    : "text-muted hover:text-foreground"
                )}
              >
                Sell
              </button>
            </div>

            {/* Crypto Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {cryptoOptions.map((c) => (
                <button
                  key={c.symbol}
                  onClick={() => setSelectedCrypto(c.symbol)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCrypto === c.symbol
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-muted hover:text-foreground hover:bg-background"
                  )}
                >
                  <span className="mr-1.5">{c.icon}</span>
                  {c.symbol}
                </button>
              ))}
            </div>

            {/* Fiat + Amount */}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-32 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                />
                <select
                  value={selectedFiat}
                  onChange={(e) => setSelectedFiat(e.target.value)}
                  className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer"
                >
                  {fiatOptions.map((f) => (
                    <option key={f.code} value={f.code} className="bg-card">{f.code}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors",
                  showFilters
                    ? "bg-accent/10 border-accent/20 text-accent"
                    : "bg-background border-border text-muted hover:text-foreground"
                )}
              >
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Payment Filter */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-border"
            >
              <p className="text-xs text-muted mb-2 font-medium">Payment Method</p>
              <div className="flex flex-wrap gap-2">
                {paymentOptions.map((pm) => (
                  <button
                    key={pm}
                    onClick={() => setSelectedPayment(pm)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      selectedPayment === pm
                        ? "bg-accent/10 text-accent border border-accent/20"
                        : "bg-background text-muted border border-border hover:text-foreground"
                    )}
                  >
                    {pm}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Ads List */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider border-b border-border">
            <div className="col-span-3">Merchant</div>
            <div className="col-span-2 text-right">Price</div>
            <div className="col-span-2 text-right hidden md:block">Available / Limit</div>
            <div className="col-span-3 hidden lg:block">Payment</div>
            <div className="col-span-2 text-right">Trade</div>
          </div>

          {/* Ads */}
          {filteredAds.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <AlertCircle className="h-10 w-10 mb-3 text-border" />
              <p className="text-sm font-medium">No ads found</p>
              <p className="text-xs mt-1">Try adjusting your filters or amount</p>
            </div>
          ) : (
            filteredAds.map((ad, i) => (
              <AdRow key={ad.id} ad={ad} index={i} fiatSymbol={fiatSymbol} tradeType={tradeType} formatNumber={formatNumber} />
            ))
          )}
        </div>

        {/* How P2P Works */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-foreground mb-6">How P2P Trading Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Place Order", desc: "Choose an ad and enter the amount you want to trade." },
              { step: "2", title: "Make Payment", desc: "Transfer fiat to the seller using the specified payment method." },
              { step: "3", title: "Mark as Paid", desc: "Confirm payment and notify the seller. Crypto is held in escrow." },
              { step: "4", title: "Receive Crypto", desc: "Seller releases crypto from escrow to your wallet." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-5 relative"
              >
                <div className="h-8 w-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm font-bold mb-3">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdRow({
  ad,
  index,
  fiatSymbol,
  tradeType,
  formatNumber,
}: {
  ad: P2PAd;
  index: number;
  fiatSymbol: string;
  tradeType: TradeType;
  formatNumber: (n: number) => string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
    >
      {/* Merchant */}
      <div className="col-span-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-xs font-bold text-foreground">
              {ad.merchant.avatar}
            </div>
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                ad.merchant.onlineStatus === "online"
                  ? "bg-accent"
                  : ad.merchant.onlineStatus === "away"
                    ? "bg-warning"
                    : "bg-muted"
              )}
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{ad.merchant.name}</span>
              {ad.merchant.isVerified && <CheckCircle2 className="h-3.5 w-3.5 text-accent" />}
              {ad.merchant.isMerchant && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-accent/10 text-accent font-medium">
                  Merchant
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted">{ad.merchant.totalTrades} trades</span>
              <span className="text-[10px] text-muted">|</span>
              <span className="text-[10px] text-accent">{ad.merchant.completionRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-right">
        <p className="text-sm font-bold text-foreground font-mono">
          {fiatSymbol} {ad.price.toLocaleString()}
        </p>
      </div>

      {/* Available / Limit */}
      <div className="col-span-2 text-right hidden md:block">
        <p className="text-xs text-foreground">
          {ad.available.toLocaleString()} {ad.crypto}
        </p>
        <p className="text-[10px] text-muted mt-0.5">
          {fiatSymbol}{formatNumber(ad.minLimit)} - {fiatSymbol}{formatNumber(ad.maxLimit)}
        </p>
      </div>

      {/* Payment Methods */}
      <div className="col-span-3 hidden lg:block">
        <div className="flex flex-wrap gap-1">
          {ad.paymentMethods.map((pm) => (
            <span
              key={pm}
              className="text-[10px] px-2 py-1 rounded-md bg-background border border-border text-muted"
            >
              {pm}
            </span>
          ))}
        </div>
      </div>

      {/* Trade Button */}
      <div className="col-span-2 text-right">
        <Link
          href={`/p2p/order/${ad.id}`}
          className={cn(
            "inline-flex px-5 py-2 rounded-lg text-sm font-semibold transition-colors",
            tradeType === "buy"
              ? "bg-accent text-background hover:bg-accent-hover"
              : "bg-danger text-white hover:bg-danger-hover"
          )}
        >
          {tradeType === "buy" ? "Buy" : "Sell"} {ad.crypto}
        </Link>
      </div>
    </motion.div>
  );
}

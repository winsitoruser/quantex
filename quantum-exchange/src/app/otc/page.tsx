"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRightLeft,
  Shield,
  Clock,
  TrendingUp,
  Zap,
  Users,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Building2,
  Headphones,
  Lock,
  BarChart3,
  History,
  Info,
} from "lucide-react";
import { otcCryptos, otcStats, otcPriceTiers, otcQuotes, type OTCQuote } from "@/data/otcData";
import { cn } from "@/lib/utils";

type Side = "buy" | "sell";

export default function OTCPage() {
  const [side, setSide] = useState<Side>("buy");
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [amount, setAmount] = useState("");
  const [quoteRequested, setQuoteRequested] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteResult, setQuoteResult] = useState<{
    price: number;
    total: number;
    premium: number;
    expiresIn: number;
  } | null>(null);
  const [quoteTimer, setQuoteTimer] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const cryptoInfo = otcCryptos.find((c) => c.symbol === selectedCrypto);
  const numAmount = parseFloat(amount) || 0;

  // Quote countdown timer
  useEffect(() => {
    if (!quoteResult || quoteTimer <= 0) return;
    const interval = setInterval(() => {
      setQuoteTimer((prev) => {
        if (prev <= 1) {
          setQuoteResult(null);
          setQuoteRequested(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quoteResult, quoteTimer]);

  const handleRequestQuote = () => {
    if (!numAmount || !cryptoInfo) return;
    setQuoteLoading(true);
    setQuoteRequested(true);

    // Simulate API delay
    setTimeout(() => {
      const spread = side === "buy" ? 1.003 : 0.997;
      const price = cryptoInfo.marketPrice * spread;
      const total = price * numAmount;
      const premium = ((price - cryptoInfo.marketPrice) / cryptoInfo.marketPrice) * 100;

      setQuoteResult({ price, total, premium: Math.abs(premium), expiresIn: 30 });
      setQuoteTimer(30);
      setQuoteLoading(false);
    }, 1500);
  };

  const handleAcceptQuote = () => {
    setShowConfirm(true);
  };

  const handleConfirmTrade = () => {
    setShowConfirm(false);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setQuoteResult(null);
      setQuoteRequested(false);
      setAmount("");
    }, 3000);
  };

  const formatUSD = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(2)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(2)}K`;
    return `$${n.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-foreground">OTC Trading Desk</h1>
              <span className="px-2 py-0.5 rounded-md bg-purple/10 text-purple text-[10px] font-semibold">PRO</span>
            </div>
            <p className="text-muted">Institutional-grade OTC trading for large orders. Competitive pricing with dedicated support.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/otc/history"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-muted hover:text-foreground hover:border-border-light transition-colors"
            >
              <History className="h-4 w-4" />
              Trade History
            </Link>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium text-muted hover:text-foreground hover:border-border-light transition-colors">
              <Headphones className="h-4 w-4" />
              Contact Desk
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          {[
            { icon: BarChart3, label: "30d Volume", value: otcStats.totalVolume30d },
            { icon: ArrowRightLeft, label: "30d Trades", value: otcStats.totalTrades30d.toString() },
            { icon: TrendingUp, label: "Avg Trade Size", value: otcStats.avgTradeSize },
            { icon: Zap, label: "Avg Spread", value: otcStats.avgSpread },
            { icon: Shield, label: "Available Pairs", value: otcStats.availablePairs.toString() },
            { icon: Clock, label: "Settlement", value: otcStats.settlementTime },
          ].map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <Icon className="h-4 w-4 text-accent mb-2" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-[10px] text-muted">{label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: RFQ Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Request for Quote (RFQ)</h2>
                <div className="flex items-center gap-1.5 text-[10px] text-muted">
                  <Lock className="h-3 w-3" />
                  Encrypted & Secure
                </div>
              </div>

              <div className="p-6">
                {/* Buy/Sell Toggle */}
                <div className="flex bg-background rounded-xl p-1 mb-6">
                  <button
                    onClick={() => { setSide("buy"); setQuoteResult(null); setQuoteRequested(false); }}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all",
                      side === "buy" ? "bg-accent text-background" : "text-muted hover:text-foreground"
                    )}
                  >
                    Buy Crypto
                  </button>
                  <button
                    onClick={() => { setSide("sell"); setQuoteResult(null); setQuoteRequested(false); }}
                    className={cn(
                      "flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all",
                      side === "sell" ? "bg-danger text-white" : "text-muted hover:text-foreground"
                    )}
                  >
                    Sell Crypto
                  </button>
                </div>

                {/* Crypto Selection */}
                <div className="mb-6">
                  <label className="text-xs text-muted mb-2 block">Select Asset</label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {otcCryptos.map((c) => (
                      <button
                        key={c.symbol}
                        onClick={() => { setSelectedCrypto(c.symbol); setQuoteResult(null); setQuoteRequested(false); }}
                        className={cn(
                          "p-2.5 rounded-xl border-2 text-center transition-all",
                          selectedCrypto === c.symbol
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-border-light"
                        )}
                      >
                        <span className="text-sm block">{c.icon}</span>
                        <p className="text-[10px] font-semibold text-foreground mt-0.5">{c.symbol}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="text-xs text-muted mb-2 block">
                    Amount ({selectedCrypto})
                  </label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3.5">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => { setAmount(e.target.value); setQuoteResult(null); setQuoteRequested(false); }}
                      placeholder={`Min: ${cryptoInfo?.minOtc || 0} ${selectedCrypto}`}
                      className="flex-1 bg-transparent text-foreground text-lg font-mono outline-none"
                    />
                    <span className="text-sm font-medium text-muted">{selectedCrypto}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-[10px] text-muted">
                      Min OTC: {cryptoInfo?.minOtc} {selectedCrypto}
                    </p>
                    <p className="text-[10px] text-muted">
                      ≈ {formatUSD(numAmount * (cryptoInfo?.marketPrice || 0))} at market price
                    </p>
                  </div>
                  {/* Quick amounts */}
                  <div className="flex gap-2 mt-3">
                    {cryptoInfo && [cryptoInfo.minOtc, cryptoInfo.minOtc * 5, cryptoInfo.minOtc * 10, cryptoInfo.minOtc * 50].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => { setAmount(qty.toString()); setQuoteResult(null); }}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-medium bg-background border border-border text-muted hover:text-foreground hover:border-border-light transition-colors"
                      >
                        {qty.toLocaleString()} {selectedCrypto}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Market Price Reference */}
                <div className="bg-background rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-muted">Market Price</p>
                      <p className="text-lg font-bold text-foreground font-mono">
                        ${cryptoInfo?.marketPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted">Estimated Value</p>
                      <p className="text-lg font-bold text-foreground font-mono">
                        {formatUSD(numAmount * (cryptoInfo?.marketPrice || 0))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quote Result */}
                <AnimatePresence mode="wait">
                  {quoteLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-background rounded-xl p-6 mb-6 text-center"
                    >
                      <RefreshCw className="h-6 w-6 text-accent animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted">Fetching best quote...</p>
                    </motion.div>
                  )}

                  {quoteResult && !quoteLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-accent/5 border border-accent/20 rounded-xl p-5 mb-6"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-accent">Quote Ready</span>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="h-3.5 w-3.5 text-warning" />
                          <span className={cn(
                            "font-mono font-bold",
                            quoteTimer <= 10 ? "text-danger" : "text-warning"
                          )}>
                            {quoteTimer}s
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-[10px] text-muted">Price per {selectedCrypto}</p>
                          <p className="text-lg font-bold text-foreground font-mono">
                            ${quoteResult.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted">Total (USD)</p>
                          <p className="text-lg font-bold text-foreground font-mono">
                            {formatUSD(quoteResult.total)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted">Spread</p>
                          <p className="text-lg font-bold text-warning font-mono">
                            {quoteResult.premium.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {orderSuccess && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-accent/10 border border-accent/30 rounded-xl p-6 mb-6 text-center"
                    >
                      <CheckCircle2 className="h-10 w-10 text-accent mx-auto mb-2" />
                      <p className="text-lg font-bold text-foreground">Trade Submitted!</p>
                      <p className="text-xs text-muted mt-1">Your OTC trade is being processed. Settlement typically completes within 15 minutes.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                {!quoteResult && !quoteLoading && !orderSuccess && (
                  <button
                    onClick={handleRequestQuote}
                    disabled={!numAmount || (cryptoInfo && numAmount < cryptoInfo.minOtc)}
                    className="w-full py-3.5 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Quote
                  </button>
                )}

                {quoteResult && !orderSuccess && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setQuoteResult(null); setQuoteRequested(false); }}
                      className="flex-1 py-3.5 rounded-xl bg-background border border-border text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAcceptQuote}
                      className={cn(
                        "flex-1 py-3.5 rounded-xl font-semibold text-sm transition-colors",
                        side === "buy"
                          ? "bg-accent text-background hover:bg-accent-hover"
                          : "bg-danger text-white hover:bg-danger-hover"
                      )}
                    >
                      Accept & {side === "buy" ? "Buy" : "Sell"}
                    </button>
                  </div>
                )}

                {numAmount > 0 && cryptoInfo && numAmount < cryptoInfo.minOtc && (
                  <div className="flex items-center gap-2 mt-3 text-xs text-danger">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Minimum OTC amount is {cryptoInfo.minOtc} {selectedCrypto}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Active Quotes */}
            {otcQuotes.filter((q) => q.status === "quoted").length > 0 && (
              <div className="rounded-2xl bg-card border border-border overflow-hidden mt-6">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-semibold text-foreground">Active Quotes</h2>
                </div>
                {otcQuotes
                  .filter((q) => q.status === "quoted")
                  .map((quote) => (
                    <div key={quote.id} className="px-6 py-4 border-b border-border/50 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "text-xs font-bold uppercase px-2 py-1 rounded",
                            quote.side === "buy" ? "bg-accent/10 text-accent" : "bg-danger/10 text-danger"
                          )}>
                            {quote.side}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {quote.amount.toLocaleString()} {quote.crypto}
                            </p>
                            <p className="text-[10px] text-muted">@ ${quote.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-foreground font-mono">
                            ${quote.totalFiat.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-warning">{quote.premium.toFixed(2)}% spread</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Right: Info Panels */}
          <div className="space-y-6">
            {/* Price Tiers */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">OTC Price Tiers</h3>
              </div>
              <div className="p-4 space-y-2">
                {otcPriceTiers.map((tier) => (
                  <div key={tier.tier} className="p-3 bg-background rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-foreground">{tier.tier}</span>
                      <span className="text-[10px] text-accent font-mono">{tier.spread}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-muted">
                      <span>Min: {tier.minAmount}</span>
                      <span>{tier.settlement}</span>
                    </div>
                    {tier.dedicated && (
                      <span className="inline-flex items-center gap-1 text-[9px] text-purple mt-1">
                        <Headphones className="h-2.5 w-2.5" />
                        Dedicated manager
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Why OTC */}
            <div className="rounded-2xl bg-card border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Why OTC?</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, title: "Zero Slippage", desc: "Guaranteed price for your entire order" },
                  { icon: Lock, title: "Deep Liquidity", desc: "Access institutional liquidity pools" },
                  { icon: Clock, title: "Fast Settlement", desc: "T+0 settlement within 15 minutes" },
                  { icon: Headphones, title: "Dedicated Support", desc: "Personal account manager for large trades" },
                  { icon: Building2, title: "Institutional Grade", desc: "Custody, compliance, and audit trails" },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{title}</p>
                      <p className="text-[10px] text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-cyan/10 border border-accent/20 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Need a Custom Quote?</h3>
              <p className="text-xs text-muted mb-4">
                For orders above $1M or special settlement requirements, contact our OTC desk directly.
              </p>
              <button className="w-full py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
                Contact OTC Desk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && quoteResult && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            >
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Confirm OTC Trade</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Side</span>
                    <span className={cn("font-semibold", side === "buy" ? "text-accent" : "text-danger")}>
                      {side.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Asset</span>
                    <span className="text-foreground font-medium">{selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Amount</span>
                    <span className="text-foreground font-mono">{numAmount.toLocaleString()} {selectedCrypto}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Price</span>
                    <span className="text-foreground font-mono">${quoteResult.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <hr className="border-border" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted font-semibold">Total</span>
                    <span className="text-foreground font-bold font-mono">{formatUSD(quoteResult.total)}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-background border border-border text-sm font-medium text-muted hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmTrade}
                    className="flex-1 py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors"
                  >
                    Confirm Trade
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

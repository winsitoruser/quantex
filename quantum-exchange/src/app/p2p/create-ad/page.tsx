"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Minus,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { cryptoOptions, fiatOptions, paymentMethods } from "@/data/p2pData";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

export default function CreateAdPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Step 1: Type & Asset
  const [adType, setAdType] = useState<"buy" | "sell">("sell");
  const [crypto, setCrypto] = useState("USDT");
  const [fiat, setFiat] = useState("IDR");

  // Step 2: Pricing & Amount
  const [priceType, setPriceType] = useState<"fixed" | "floating">("fixed");
  const [fixedPrice, setFixedPrice] = useState("");
  const [floatingMargin, setFloatingMargin] = useState("100");
  const [totalAmount, setTotalAmount] = useState("");
  const [minLimit, setMinLimit] = useState("");
  const [maxLimit, setMaxLimit] = useState("");

  // Step 3: Payment & Details
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [timeLimit, setTimeLimit] = useState("15");
  const [remarks, setRemarks] = useState("");
  const [autoReply, setAutoReply] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const fiatSymbol = fiatOptions.find((f) => f.code === fiat)?.symbol || "";
  const cryptoInfo = cryptoOptions.find((c) => c.symbol === crypto);

  const marketPrices: Record<string, Record<string, number>> = {
    USDT: { IDR: 15850, USD: 1.0005, EUR: 0.92, GBP: 0.79, JPY: 150.2 },
    BTC: { IDR: 1485000000, USD: 93800, EUR: 86500, GBP: 74200, JPY: 14090000 },
    ETH: { IDR: 52350000, USD: 3310, EUR: 3050, GBP: 2620, JPY: 497000 },
    BNB: { IDR: 9690000, USD: 612, EUR: 564, GBP: 484, JPY: 91900 },
    SOL: { IDR: 2254000, USD: 142.5, EUR: 131, GBP: 112.5, JPY: 21400 },
    USDC: { IDR: 15840, USD: 1.0000, EUR: 0.92, GBP: 0.79, JPY: 150.1 },
  };

  const currentMarketPrice = marketPrices[crypto]?.[fiat] || 0;

  const togglePayment = (pmName: string) => {
    setSelectedPayments((prev) =>
      prev.includes(pmName) ? prev.filter((p) => p !== pmName) : [...prev, pmName]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const canProceedStep1 = crypto && fiat;
  const canProceedStep2 = (priceType === "fixed" ? fixedPrice : floatingMargin) && totalAmount && minLimit && maxLimit;
  const canProceedStep3 = selectedPayments.length > 0;

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4"
        >
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Ad Published!</h2>
            <p className="text-sm text-muted mb-6">
              Your {adType} ad for {crypto}/{fiat} is now live on the P2P marketplace.
            </p>
            <div className="flex gap-3">
              <Link
                href="/p2p/my-ads"
                className="flex-1 py-3 rounded-xl bg-background border border-border text-sm font-medium text-center text-muted hover:text-foreground transition-colors"
              >
                View My Ads
              </Link>
              <Link
                href="/p2p"
                className="flex-1 py-3 rounded-xl bg-accent text-background font-semibold text-sm text-center hover:bg-accent-hover transition-colors"
              >
                Go to P2P
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => (step > 1 ? setStep((step - 1) as Step) : router.back())}
            className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create P2P Ad</h1>
            <p className="text-sm text-muted">Step {step} of 3</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold",
                    s <= step
                      ? "bg-accent text-background"
                      : "bg-background text-muted border border-border"
                  )}
                >
                  {s}
                </div>
                <span className={cn(
                  "text-xs font-medium hidden sm:block",
                  s <= step ? "text-foreground" : "text-muted"
                )}>
                  {s === 1 ? "Type & Asset" : s === 2 ? "Price & Amount" : "Payment & Details"}
                </span>
              </div>
              {s < 3 && (
                <div className={cn("flex-1 h-0.5 mx-3", s < step ? "bg-accent" : "bg-border")} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Type & Asset */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Ad Type</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAdType("sell")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    adType === "sell"
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-border-light"
                  )}
                >
                  <p className="text-sm font-bold text-accent mb-1">Sell Crypto</p>
                  <p className="text-xs text-muted">Users will buy crypto from you</p>
                </button>
                <button
                  onClick={() => setAdType("buy")}
                  className={cn(
                    "p-4 rounded-xl border-2 text-center transition-all",
                    adType === "buy"
                      ? "border-danger bg-danger/5"
                      : "border-border hover:border-border-light"
                  )}
                >
                  <p className="text-sm font-bold text-danger mb-1">Buy Crypto</p>
                  <p className="text-xs text-muted">Users will sell crypto to you</p>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Select Crypto</h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {cryptoOptions.map((c) => (
                  <button
                    key={c.symbol}
                    onClick={() => setCrypto(c.symbol)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center transition-all",
                      crypto === c.symbol
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-border-light"
                    )}
                  >
                    <span className="text-lg block mb-1">{c.icon}</span>
                    <p className="text-xs font-semibold text-foreground">{c.symbol}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Fiat Currency</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {fiatOptions.map((f) => (
                  <button
                    key={f.code}
                    onClick={() => setFiat(f.code)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center transition-all",
                      fiat === f.code
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-border-light"
                    )}
                  >
                    <span className="text-sm font-bold text-foreground">{f.symbol}</span>
                    <p className="text-xs text-muted">{f.code}</p>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Step 2: Pricing & Amount */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Price Setting</h2>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setPriceType("fixed")}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    priceType === "fixed"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-muted hover:text-foreground bg-background border border-border"
                  )}
                >
                  Fixed Price
                </button>
                <button
                  onClick={() => setPriceType("floating")}
                  className={cn(
                    "flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    priceType === "floating"
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "text-muted hover:text-foreground bg-background border border-border"
                  )}
                >
                  Floating Price
                </button>
              </div>

              {priceType === "fixed" ? (
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Your Price ({fiat})</label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                    <span className="text-sm text-muted">{fiatSymbol}</span>
                    <input
                      type="number"
                      value={fixedPrice}
                      onChange={(e) => setFixedPrice(e.target.value)}
                      placeholder={currentMarketPrice.toLocaleString()}
                      className="flex-1 bg-transparent text-foreground font-mono outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted mt-1.5">
                    Market price: {fiatSymbol} {currentMarketPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Floating Margin (%)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFloatingMargin(Math.max(90, parseFloat(floatingMargin) - 0.5).toString())}
                      className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex-1 flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                      <input
                        type="number"
                        value={floatingMargin}
                        onChange={(e) => setFloatingMargin(e.target.value)}
                        className="flex-1 bg-transparent text-foreground font-mono outline-none text-center"
                      />
                      <span className="text-sm text-muted">%</span>
                    </div>
                    <button
                      onClick={() => setFloatingMargin(Math.min(110, parseFloat(floatingMargin) + 0.5).toString())}
                      className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted mt-1.5">
                    Your price: ≈ {fiatSymbol} {(currentMarketPrice * parseFloat(floatingMargin || "100") / 100).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Amount & Limits</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Total Amount ({crypto})</label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                    <input
                      type="number"
                      value={totalAmount}
                      onChange={(e) => setTotalAmount(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 bg-transparent text-foreground font-mono outline-none"
                    />
                    <span className="text-sm font-medium text-muted">{crypto}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted mb-1.5 block">Min Order ({fiat})</label>
                    <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                      <span className="text-sm text-muted">{fiatSymbol}</span>
                      <input
                        type="number"
                        value={minLimit}
                        onChange={(e) => setMinLimit(e.target.value)}
                        placeholder="100,000"
                        className="flex-1 bg-transparent text-foreground font-mono outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted mb-1.5 block">Max Order ({fiat})</label>
                    <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                      <span className="text-sm text-muted">{fiatSymbol}</span>
                      <input
                        type="number"
                        value={maxLimit}
                        onChange={(e) => setMaxLimit(e.target.value)}
                        placeholder="50,000,000"
                        className="flex-1 bg-transparent text-foreground font-mono outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!canProceedStep2}
              className="w-full py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* Step 3: Payment & Details */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Payment Methods</h2>
              <p className="text-xs text-muted mb-3">Select at least one payment method</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => togglePayment(pm.name)}
                    className={cn(
                      "p-3 rounded-xl border-2 text-center transition-all",
                      selectedPayments.includes(pm.name)
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-border-light"
                    )}
                  >
                    <span className="text-lg block mb-1">{pm.icon}</span>
                    <p className="text-xs font-medium text-foreground">{pm.name}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Payment Time Limit</label>
                  <select
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none"
                  >
                    <option value="15" className="bg-card">15 minutes</option>
                    <option value="30" className="bg-card">30 minutes</option>
                    <option value="45" className="bg-card">45 minutes</option>
                    <option value="60" className="bg-card">60 minutes</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Remarks (optional)</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add notes visible to buyers, e.g., 'BCA only, include order number in transfer.'"
                    rows={3}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted mb-1.5 block">Auto-Reply Message (optional)</label>
                  <textarea
                    value={autoReply}
                    onChange={(e) => setAutoReply(e.target.value)}
                    placeholder="Automatically sent when someone places an order"
                    rows={2}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="rounded-2xl bg-card border border-accent/20 p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Type</span>
                  <span className={cn("font-semibold", adType === "sell" ? "text-accent" : "text-danger")}>
                    {adType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Asset</span>
                  <span className="text-foreground font-medium">{crypto}/{fiat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Price</span>
                  <span className="text-foreground font-mono">
                    {priceType === "fixed"
                      ? `${fiatSymbol} ${parseFloat(fixedPrice || "0").toLocaleString()}`
                      : `${floatingMargin}% of market`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Amount</span>
                  <span className="text-foreground font-mono">{totalAmount} {crypto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Limit</span>
                  <span className="text-foreground font-mono">
                    {fiatSymbol}{parseFloat(minLimit || "0").toLocaleString()} - {fiatSymbol}{parseFloat(maxLimit || "0").toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment</span>
                  <span className="text-foreground">{selectedPayments.join(", ") || "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Time Limit</span>
                  <span className="text-foreground">{timeLimit} min</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canProceedStep3}
              className="w-full py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
            >
              Publish Ad
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

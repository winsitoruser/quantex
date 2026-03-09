"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CreditCard,
  AlertCircle,
  Info,
  Check,
  ArrowDown,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: { symbol: string; name: string; icon: string };
}

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", icon: CreditCard, processing: "Instant", fee: "1.8%" },
  { id: "bank", name: "Bank Transfer", icon: Shield, processing: "1-3 business days", fee: "0.5%" },
  { id: "p2p", name: "P2P Trading", icon: Shield, processing: "Varies", fee: "0%" },
];

const presetAmounts = [50, 100, 250, 500, 1000];

export default function BuyCryptoModal({ isOpen, onClose, asset }: BuyCryptoModalProps) {
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [fiatAmount, setFiatAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [step, setStep] = useState(1);
  const [purchased, setPurchased] = useState(false);

  const cryptoPrice = asset?.symbol === "BTC" ? 67234.50 : asset?.symbol === "ETH" ? 3456.78 : 100;
  const exchangeRate = cryptoPrice;

  const handlePresetClick = (amount: number) => {
    setFiatAmount(amount.toString());
    setCryptoAmount((amount / exchangeRate).toFixed(6));
  };

  const handleFiatChange = (value: string) => {
    setFiatAmount(value);
    if (value) {
      setCryptoAmount((parseFloat(value) / exchangeRate).toFixed(6));
    } else {
      setCryptoAmount("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setPurchased(true);
      setTimeout(() => {
        onClose();
        setStep(1);
        setFiatAmount("");
        setCryptoAmount("");
        setPurchased(false);
      }, 2500);
    }
  };

  if (!isOpen) return null;

  if (purchased) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden p-8 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Purchase Successful!</h3>
            <p className="text-sm text-muted mb-1">
              {cryptoAmount} {asset?.symbol} has been added to your wallet
            </p>
            <div className="mt-4 p-3 rounded-xl bg-background border border-border">
              <p className="text-xs text-muted">Transaction ID</p>
              <p className="text-xs font-mono text-foreground mt-0.5">0x7a3F...8B2c4D</p>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (step === 2) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-bold text-foreground">Confirm Purchase</h2>
              <button
                onClick={() => setStep(1)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div className="text-[11px] text-warning leading-relaxed">
                    <p className="font-semibold mb-0.5">Review your order</p>
                    <p>Please verify all details before confirming your purchase.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">Asset</span>
                  <div className="flex items-center gap-2">
                    {asset && (
                      <img src={asset.icon} alt={asset.name} className="h-5 w-5 rounded" />
                    )}
                    <span className="text-sm font-semibold text-foreground">{asset?.symbol}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">You Pay</span>
                  <span className="text-sm font-semibold text-foreground">${fiatAmount} USD</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">You Receive</span>
                  <span className="text-sm font-semibold text-accent">{cryptoAmount} {asset?.symbol}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">Payment Method</span>
                  <span className="text-sm font-semibold text-foreground">{paymentMethod.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">Processing Fee ({paymentMethod.fee})</span>
                  <span className="text-sm font-semibold text-foreground">${(parseFloat(fiatAmount || "0") * parseFloat(paymentMethod.fee) / 100).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-xs text-muted">Total</span>
                  <span className="text-sm font-bold text-accent">${(parseFloat(fiatAmount || "0") * 1.018).toFixed(2)} USD</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-info/5 border border-info/20">
                <Clock className="h-4 w-4 text-info shrink-0" />
                <div className="text-xs text-info">
                  <p className="font-semibold">Processing Time</p>
                  <p className="text-[10px] text-info/80">{paymentMethod.processing}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                >
                  Confirm Purchase
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              {asset && (
                <img
                  src={asset.icon}
                  alt={asset.name}
                  className="h-8 w-8 object-contain rounded-xl bg-background border border-border"
                />
              )}
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Buy {asset?.symbol}
                </h2>
                <p className="text-[11px] text-muted">Instant purchase with card</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Payment Method */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Payment Method</label>
              <div className="space-y-2">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl border transition-colors",
                        paymentMethod.id === method.id
                          ? "bg-accent/5 border-accent/30"
                          : "bg-background border-border hover:border-accent/30"
                      )}
                    >
                      <div className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center",
                        paymentMethod.id === method.id ? "bg-accent/10 text-accent" : "bg-surface text-muted"
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-foreground">{method.name}</p>
                        <p className="text-[10px] text-muted">{method.processing}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-foreground">{method.fee} fee</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted">$</span>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => handleFiatChange(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-accent/40 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Preset Amounts */}
            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handlePresetClick(amount)}
                  className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  ${amount}
                </button>
              ))}
            </div>

            {/* Exchange Rate */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">1 {asset?.symbol} ≈</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">${exchangeRate.toLocaleString()}</span>
                <ArrowDown className="h-3.5 w-3.5 text-muted" />
              </div>
            </div>

            {/* You Receive */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">You Receive</label>
              <div className="p-3 rounded-xl bg-accent/5 border border-accent/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Estimated {asset?.symbol}</span>
                  <span className="text-base font-bold text-accent">
                    {cryptoAmount || "0.000000"} {asset?.symbol}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-info/5 border border-info/20">
              <Info className="h-4 w-4 text-info shrink-0" />
              <div className="text-xs text-info">
                <p className="font-semibold">Instant Delivery</p>
                <p className="text-[10px] text-info/80">Your {asset?.symbol} will be credited immediately after payment</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!fiatAmount || parseFloat(fiatAmount) <= 0}
              className="w-full px-4 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

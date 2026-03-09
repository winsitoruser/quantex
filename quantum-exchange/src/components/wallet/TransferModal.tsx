"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRightLeft,
  AlertCircle,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: { symbol: string; name: string; icon: string; balance?: number };
}

const wallets = [
  { id: "spot", name: "Spot Wallet", balance: "$25,432.50" },
  { id: "futures", name: "Futures Wallet", balance: "$12,500.00" },
  { id: "earn", name: "Earn Wallet", balance: "$8,750.25" },
  { id: "funding", name: "Funding Wallet", balance: "$1,200.00" },
];

export default function TransferModal({ isOpen, onClose, asset }: TransferModalProps) {
  const [fromWallet, setFromWallet] = useState(wallets[0]);
  const [toWallet, setToWallet] = useState(wallets[1]);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState(1);
  const [transferred, setTransferred] = useState(false);

  const availableBalance = asset?.balance || 1.5432;

  const handleMax = () => {
    setAmount(availableBalance.toFixed(6));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setTransferred(true);
      setTimeout(() => {
        onClose();
        setStep(1);
        setAmount("");
        setTransferred(false);
      }, 2000);
    }
  };

  const handleSwapWallets = () => {
    const temp = fromWallet;
    setFromWallet(toWallet);
    setToWallet(temp);
  };

  if (!isOpen) return null;

  if (transferred) {
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
            <h3 className="text-lg font-bold text-foreground mb-2">Transfer Successful!</h3>
            <p className="text-sm text-muted">
              {amount} {asset?.symbol} has been transferred
            </p>
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
              <h2 className="text-base font-bold text-foreground">Confirm Transfer</h2>
              <button
                onClick={() => setStep(1)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
              <div className="p-4 rounded-xl bg-warning/5 border border-warning/20">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                  <div className="text-[11px] text-warning leading-relaxed">
                    <p className="font-semibold mb-0.5">Please verify transfer details</p>
                    <p>Make sure all information is correct before confirming.</p>
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
                  <span className="text-xs text-muted">Amount</span>
                  <span className="text-sm font-semibold text-foreground">{amount} {asset?.symbol}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">From</span>
                  <span className="text-sm font-semibold text-foreground">{fromWallet.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                  <span className="text-xs text-muted">To</span>
                  <span className="text-sm font-semibold text-foreground">{toWallet.name}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                  <span className="text-xs text-muted">Transfer Fee</span>
                  <span className="text-sm font-bold text-accent">Free</span>
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
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
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
                  Transfer {asset?.symbol}
                </h2>
                <p className="text-[11px] text-muted">Between your wallets</p>
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
            {/* From Wallet */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">From Wallet</label>
              <div className="relative">
                <select
                  value={fromWallet.id}
                  onChange={(e) => {
                    const wallet = wallets.find((w) => w.id === e.target.value);
                    if (wallet && wallet.id !== toWallet.id) setFromWallet(wallet);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/40 transition-colors appearance-none"
                >
                  {wallets.filter((w) => w.id !== toWallet.id).map((w) => (
                    <option key={w.id} value={w.id}>{w.name} - {w.balance}</option>
                  ))}
                </select>
                <ArrowRightLeft className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center -my-2">
              <button
                type="button"
                onClick={handleSwapWallets}
                className="h-8 w-8 flex items-center justify-center rounded-full bg-surface border border-border text-muted hover:text-accent hover:border-accent/30 transition-colors"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </button>
            </div>

            {/* To Wallet */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">To Wallet</label>
              <div className="relative">
                <select
                  value={toWallet.id}
                  onChange={(e) => {
                    const wallet = wallets.find((w) => w.id === e.target.value);
                    if (wallet && wallet.id !== fromWallet.id) setToWallet(wallet);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/40 transition-colors appearance-none"
                >
                  {wallets.filter((w) => w.id !== fromWallet.id).map((w) => (
                    <option key={w.id} value={w.id}>{w.name} - {w.balance}</option>
                  ))}
                </select>
                <ArrowRightLeft className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.000001"
                  className="w-full px-4 py-3 pr-20 rounded-xl bg-background border border-border text-foreground text-sm outline-none focus:border-accent/40 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={handleMax}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
                >
                  MAX
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-xs">
                <span className="text-muted">Available: {availableBalance} {asset?.symbol}</span>
                <span className="text-muted">≈ ${(parseFloat(amount || "0") * 67000).toFixed(2)}</span>
              </div>
            </div>

            {/* Fee Info */}
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-accent/5 border border-accent/20">
              <Info className="h-4 w-4 text-accent shrink-0" />
              <div className="text-xs text-accent">
                <p className="font-semibold">Internal Transfer</p>
                <p className="text-[10px] text-accent/80">No fees for transfers between your wallets</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full px-4 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

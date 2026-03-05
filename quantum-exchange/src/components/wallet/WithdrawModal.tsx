"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  Shield,
  AlertTriangle,
  Info,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: { symbol: string; name: string; icon: string; balance: number; value: number };
}

const networks = [
  { id: "erc20", name: "Ethereum (ERC20)", fee: "0.0005", feeUsd: "~$1.20", time: "~5 min" },
  { id: "trc20", name: "Tron (TRC20)", fee: "1.00", feeUsd: "~$0.10", time: "~3 min" },
  { id: "bep20", name: "BNB Smart Chain (BEP20)", fee: "0.0002", feeUsd: "~$0.50", time: "~3 min" },
  { id: "sol", name: "Solana (SPL)", fee: "0.01", feeUsd: "~$0.02", time: "~1 min" },
  { id: "arb", name: "Arbitrum One", fee: "0.0001", feeUsd: "~$0.25", time: "~2 min" },
];

export default function WithdrawModal({ isOpen, onClose, asset }: WithdrawModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [networkDropdown, setNetworkDropdown] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"form" | "confirm">("form");

  const availableBalance = asset?.balance ?? 0;
  const receiveAmount = amount ? Math.max(0, parseFloat(amount) - parseFloat(selectedNetwork.fee)) : 0;

  const handleMax = () => {
    setAmount(availableBalance.toString());
  };

  const handleConfirm = () => {
    if (step === "form") {
      setStep("confirm");
    } else {
      onClose();
      setStep("form");
      setAddress("");
      setAmount("");
    }
  };

  const handleBack = () => {
    setStep("form");
  };

  if (!isOpen) return null;

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
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              {asset && (
                <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-background border border-border text-base">
                  {asset.icon}
                </div>
              )}
              <div>
                <h2 className="text-base font-bold text-foreground">
                  Withdraw {asset?.symbol || "Crypto"}
                </h2>
                <p className="text-[11px] text-muted">
                  {step === "form" ? "Enter withdrawal details" : "Confirm your withdrawal"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form Step */}
          {step === "form" && (
            <div className="px-6 py-5 space-y-4">
              {/* Available Balance */}
              <div className="flex items-center justify-between rounded-xl bg-background border border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted">Available</span>
                </div>
                <span className="text-sm font-semibold font-mono text-foreground">
                  {availableBalance.toFixed(4)} {asset?.symbol}
                </span>
              </div>

              {/* Network Selection */}
              <div>
                <label className="text-xs font-medium text-muted mb-2 block">Network</label>
                <div className="relative">
                  <button
                    onClick={() => setNetworkDropdown(!networkDropdown)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground hover:border-border-light transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>{selectedNetwork.name}</span>
                      <span className="text-[10px] text-muted px-1.5 py-0.5 rounded bg-card">Fee: {selectedNetwork.fee} {asset?.symbol}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-muted transition-transform", networkDropdown && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {networkDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-10 overflow-hidden"
                      >
                        {networks.map((net) => (
                          <button
                            key={net.id}
                            onClick={() => {
                              setSelectedNetwork(net);
                              setNetworkDropdown(false);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 text-sm transition-colors",
                              selectedNetwork.id === net.id
                                ? "bg-accent/5 text-accent"
                                : "text-foreground hover:bg-card-hover"
                            )}
                          >
                            <span>{net.name}</span>
                            <div className="text-right">
                              <span className="text-[10px] text-muted">Fee: {net.fee}</span>
                              <span className="text-[10px] text-muted ml-2">{net.feeUsd}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="text-xs font-medium text-muted mb-2 block">Withdrawal Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter or paste address..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-mono text-foreground placeholder:text-muted outline-none focus:border-border-light transition-colors"
                />
              </div>

              {/* Amount */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-muted">Amount</label>
                  <button
                    onClick={handleMax}
                    className="text-[10px] font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    MAX
                  </button>
                </div>
                <div className="flex items-center bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-sm font-mono text-foreground placeholder:text-muted outline-none"
                  />
                  <span className="text-xs font-medium text-muted ml-2">{asset?.symbol}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-background border border-border p-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Network Fee</span>
                  <span className="font-medium text-foreground font-mono">
                    {selectedNetwork.fee} {asset?.symbol} <span className="text-muted">{selectedNetwork.feeUsd}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Est. Arrival</span>
                  <span className="font-medium text-foreground">{selectedNetwork.time}</span>
                </div>
                <div className="border-t border-border pt-2.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted">You will receive</span>
                  <span className="text-sm font-bold text-accent font-mono">
                    {receiveAmount > 0 ? receiveAmount.toFixed(6) : "0.00"} {asset?.symbol}
                  </span>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/5 border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-[11px] text-warning leading-relaxed">
                  Ensure the address and network are correct. Withdrawals to wrong addresses cannot be recovered.
                </p>
              </div>

              {/* Submit */}
              <button
                onClick={handleConfirm}
                disabled={!address || !amount || parseFloat(amount) <= 0}
                className={cn(
                  "w-full h-12 rounded-xl text-sm font-bold transition-all",
                  address && amount && parseFloat(amount) > 0
                    ? "bg-accent hover:bg-accent-hover text-background"
                    : "bg-card-hover text-muted cursor-not-allowed"
                )}
              >
                Review Withdrawal
              </button>
            </div>
          )}

          {/* Confirmation Step */}
          {step === "confirm" && (
            <div className="px-6 py-5 space-y-4">
              <div className="rounded-xl bg-background border border-border p-5 space-y-4">
                <div className="text-center mb-2">
                  <p className="text-2xl font-bold text-foreground font-mono mb-1">
                    {amount} {asset?.symbol}
                  </p>
                  <p className="text-xs text-muted">Withdrawal Amount</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "To Address", value: address.length > 20 ? `${address.slice(0, 10)}...${address.slice(-8)}` : address },
                    { label: "Network", value: selectedNetwork.name },
                    { label: "Network Fee", value: `${selectedNetwork.fee} ${asset?.symbol}` },
                    { label: "You Receive", value: `${receiveAmount.toFixed(6)} ${asset?.symbol}`, highlight: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-xs text-muted">{item.label}</span>
                      <span className={cn(
                        "text-xs font-medium font-mono",
                        item.highlight ? "text-accent" : "text-foreground"
                      )}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-info/5 border border-info/20">
                <Info className="h-4 w-4 text-info shrink-0" />
                <p className="text-[11px] text-info leading-relaxed">
                  A verification code will be sent to your email for security confirmation.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 h-12 rounded-xl border border-border text-sm font-bold text-foreground hover:bg-card-hover transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 h-12 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-bold transition-colors"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

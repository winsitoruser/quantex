"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Check,
  ChevronDown,
  QrCode,
  Shield,
  AlertTriangle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: { symbol: string; name: string; icon: string };
}

const networks = [
  { id: "erc20", name: "Ethereum (ERC20)", fee: "0.00", confirmations: 12, time: "~5 min" },
  { id: "trc20", name: "Tron (TRC20)", fee: "0.00", confirmations: 20, time: "~3 min" },
  { id: "bep20", name: "BNB Smart Chain (BEP20)", fee: "0.00", confirmations: 15, time: "~3 min" },
  { id: "sol", name: "Solana (SPL)", fee: "0.00", confirmations: 1, time: "~1 min" },
  { id: "arb", name: "Arbitrum One", fee: "0.00", confirmations: 12, time: "~2 min" },
];

export default function DepositModal({ isOpen, onClose, asset }: DepositModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const [networkDropdown, setNetworkDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const depositAddress = "0x7a3F...8B2c4D9E1f5A6b7C8d9E0f1A2B3c4D5e6F7a8B";
  const fullAddress = "0x7a3F2E1d4C5b6A8B2c4D9E1f5A6b7C8d9E0f1A2B3c4D5e6F7a8B";

  const handleCopy = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
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
                  Deposit {asset?.symbol || "Crypto"}
                </h2>
                <p className="text-[11px] text-muted">{asset?.name || "Select asset to deposit"}</p>
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
          <div className="px-6 py-5 space-y-5">
            {/* Network Selection */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Network</label>
              <div className="relative">
                <button
                  onClick={() => setNetworkDropdown(!networkDropdown)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background border border-border text-sm text-foreground hover:border-border-light transition-colors"
                >
                  <span>{selectedNetwork.name}</span>
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
                          <span className="text-[10px] text-muted">{net.time}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center py-4">
              <div className="h-44 w-44 rounded-2xl bg-white flex items-center justify-center mb-4 p-3">
                <div className="h-full w-full rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                  <QrCode className="h-24 w-24 text-gray-800" strokeWidth={1} />
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-[2px] p-2 opacity-20">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "rounded-[1px]",
                          Math.random() > 0.4 ? "bg-gray-900" : "bg-transparent"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-muted text-center">
                Scan QR code or copy the address below
              </p>
            </div>

            {/* Deposit Address */}
            <div>
              <label className="text-xs font-medium text-muted mb-2 block">Deposit Address</label>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                <p className="flex-1 text-xs font-mono text-foreground truncate">
                  {fullAddress}
                </p>
                <button
                  onClick={handleCopy}
                  className={cn(
                    "h-8 w-8 flex items-center justify-center rounded-lg shrink-0 transition-colors",
                    copied
                      ? "bg-accent/10 text-accent"
                      : "bg-card-hover text-muted hover:text-foreground"
                  )}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Network Info */}
            <div className="rounded-xl bg-background border border-border p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-muted mb-0.5">Min. Deposit</p>
                  <p className="text-xs font-semibold text-foreground">0.0001 {asset?.symbol}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted mb-0.5">Confirmations</p>
                  <p className="text-xs font-semibold text-foreground">{selectedNetwork.confirmations}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted mb-0.5">Est. Time</p>
                  <p className="text-xs font-semibold text-foreground">{selectedNetwork.time}</p>
                </div>
              </div>
            </div>

            {/* Warnings */}
            <div className="space-y-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-warning/5 border border-warning/20">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <div className="text-[11px] text-warning leading-relaxed">
                  <p className="font-semibold mb-0.5">Important</p>
                  <p>Only send <strong>{asset?.symbol}</strong> to this address on the <strong>{selectedNetwork.name}</strong> network. Sending any other coin or using a different network may result in permanent loss.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-accent/5 border border-accent/20">
                <Shield className="h-3.5 w-3.5 text-accent shrink-0" />
                <p className="text-[10px] text-accent">Deposits are secured with multi-signature wallets and cold storage.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

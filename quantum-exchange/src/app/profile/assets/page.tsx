"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Eye,
  EyeOff,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Send,
  ArrowRightLeft,
  PieChart,
  TrendingUp,
  Filter,
  BarChart3,
  X,
  Copy,
  Check,
  AlertCircle,
  Clock,
  Info,
} from "lucide-react";
import { userAssets } from "@/data/userData";
import { cn } from "@/lib/utils";
import { formatPrice, formatPercent } from "@/lib/utils";
import Modal from "@/components/ui/Modal";

const walletTabs = ["All", "Spot", "Futures", "Earn"];

export default function AssetsPage() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [hideSmall, setHideSmall] = useState(false);
  
  // Modal states
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<(typeof userAssets)[0] | null>(null);

  const totalValue = userAssets.reduce((sum, a) => sum + a.usdValue, 0);
  const spotValue = userAssets.reduce(
    (sum, a) => sum + a.spotBalance * a.price,
    0
  );
  const futuresValue = userAssets.reduce(
    (sum, a) => sum + a.futuresBalance * a.price,
    0
  );
  const earnValue = userAssets.reduce(
    (sum, a) => sum + a.earnBalance * a.price,
    0
  );
  const totalChange = 2.87;

  const filteredAssets = userAssets
    .filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.symbol.toLowerCase().includes(search.toLowerCase());
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Spot" && a.spotBalance > 0) ||
        (activeTab === "Futures" && a.futuresBalance > 0) ||
        (activeTab === "Earn" && a.earnBalance > 0);
      const matchHide = !hideSmall || a.usdValue >= 1;
      return matchSearch && matchTab && matchHide;
    })
    .sort((a, b) => b.usdValue - a.usdValue);

  const getBalanceForTab = (asset: (typeof userAssets)[0]) => {
    switch (activeTab) {
      case "Spot":
        return asset.spotBalance;
      case "Futures":
        return asset.futuresBalance;
      case "Earn":
        return asset.earnBalance;
      default:
        return asset.totalBalance;
    }
  };

  const getValueForTab = (asset: (typeof userAssets)[0]) => {
    const balance = getBalanceForTab(asset);
    return balance * asset.price;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Assets</h1>
          <p className="text-sm text-muted">
            Overview of all your crypto holdings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedAsset(userAssets[0]); setShowDepositModal(true); }}
            className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" />
            Deposit
          </button>
          <button 
            onClick={() => { setSelectedAsset(userAssets[0]); setShowWithdrawModal(true); }}
            className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            <Send className="h-4 w-4" />
            Withdraw
          </button>
          <button 
            onClick={() => { setSelectedAsset(userAssets[0]); setShowTransferModal(true); }}
            className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-muted">Estimated Total Value</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-muted hover:text-foreground transition-colors"
              >
                {balanceVisible ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-3xl lg:text-4xl font-bold text-foreground mb-2 font-mono">
              {balanceVisible
                ? `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "••••••••"}
            </p>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  "flex items-center gap-0.5 text-sm font-medium",
                  totalChange >= 0 ? "text-accent" : "text-danger"
                )}
              >
                {totalChange >= 0 ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {formatPercent(totalChange)}
              </span>
              <span className="text-sm text-muted">24h</span>
            </div>
          </div>

          {/* Balance Distribution */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Spot",
                value: spotValue,
                icon: Wallet,
                color: "text-accent",
              },
              {
                label: "Futures",
                value: futuresValue,
                icon: BarChart3,
                color: "text-info",
              },
              {
                label: "Earn",
                value: earnValue,
                icon: TrendingUp,
                color: "text-purple",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="text-center p-3 rounded-xl bg-background/50 border border-border/50"
                >
                  <Icon
                    className={cn("h-4 w-4 mx-auto mb-1.5", item.color)}
                  />
                  <p className="text-xs text-muted mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground font-mono">
                    {balanceVisible
                      ? `$${item.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "••••"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Portfolio Distribution */}
      <div className="rounded-2xl bg-card border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
          <PieChart className="h-4 w-4 text-accent" />
          Portfolio Distribution
        </h3>
        <div className="space-y-3">
          {userAssets.slice(0, 6).map((asset) => {
            const percentage = (asset.usdValue / totalValue) * 100;
            return (
              <div key={asset.symbol}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <img
                      src={asset.icon}
                      alt={asset.name}
                      className="h-6 w-6 rounded-lg bg-background border border-border object-contain"
                    />
                    <span className="font-medium text-foreground">
                      {asset.symbol}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-muted font-mono">
                      {balanceVisible
                        ? `$${asset.usdValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                        : "••••"}
                    </span>
                    <span className="text-muted w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-accent to-cyan rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wallet Tabs & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {walletTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeTab === tab
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={hideSmall}
              onChange={(e) => setHideSmall(e.target.checked)}
              className="accent-accent"
            />
            Hide small balances
          </label>
          <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 focus-within:border-border-light transition-colors">
            <Search className="h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted outline-none w-40"
            />
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-muted uppercase tracking-wider border-b border-border">
          <div className="col-span-3">Asset</div>
          <div className="col-span-2 text-right">Balance</div>
          <div className="col-span-2 text-right">Available</div>
          <div className="col-span-2 text-right">USD Value</div>
          <div className="col-span-1 text-right">24h</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Filter className="h-8 w-8 mb-3" />
            <p className="text-sm">No assets found</p>
          </div>
        ) : (
          filteredAssets.map((asset, i) => {
            const balance = getBalanceForTab(asset);
            const value = getValueForTab(asset);
            return (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-border/50 last:border-0 hover:bg-card-hover transition-colors"
              >
                {/* Asset */}
                <div className="col-span-5 md:col-span-3 flex items-center gap-3">
                  <img
                    src={asset.icon}
                    alt={asset.name}
                    className="h-9 w-9 object-contain rounded-xl bg-background border border-border shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {asset.symbol}
                    </p>
                    <p className="text-xs text-muted">{asset.name}</p>
                  </div>
                </div>

                {/* Balance */}
                <div className="col-span-3 md:col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? balance < 1
                        ? balance.toFixed(6)
                        : balance.toLocaleString("en-US", {
                            maximumFractionDigits: 4,
                          })
                      : "••••"}
                  </p>
                </div>

                {/* Available */}
                <div className="hidden md:block col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? asset.availableBalance < 1
                        ? asset.availableBalance.toFixed(6)
                        : asset.availableBalance.toLocaleString("en-US", {
                            maximumFractionDigits: 4,
                          })
                      : "••••"}
                  </p>
                  {asset.inOrder > 0 && (
                    <p className="text-[10px] text-muted">
                      In order:{" "}
                      {balanceVisible
                        ? asset.inOrder.toLocaleString()
                        : "••••"}
                    </p>
                  )}
                </div>

                {/* USD Value */}
                <div className="col-span-4 md:col-span-2 text-right">
                  <p className="text-sm font-medium text-foreground font-mono">
                    {balanceVisible
                      ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "••••"}
                  </p>
                </div>

                {/* 24h Change */}
                <div className="hidden md:block col-span-1 text-right">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      asset.change24h >= 0 ? "text-accent" : "text-danger"
                    )}
                  >
                    {formatPercent(asset.change24h)}
                  </span>
                </div>

                {/* Actions */}
                <div className="hidden md:flex col-span-2 items-center justify-end gap-1.5">
                  <button 
                    onClick={() => { setSelectedAsset(asset); setShowDepositModal(true); }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => { setSelectedAsset(asset); setShowWithdrawModal(true); }}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-card-hover text-foreground hover:bg-background transition-colors border border-border"
                  >
                    Withdraw
                  </button>
                  <button className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-muted hover:text-foreground transition-colors">
                    Trade
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Deposit Modal */}
      {selectedAsset && (
        <Modal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          title="Deposit"
          description={`Deposit ${selectedAsset.name} to your wallet`}
          size="md"
        >
          <DepositModalContent 
            asset={selectedAsset} 
            onClose={() => setShowDepositModal(false)} 
          />
        </Modal>
      )}

      {/* Withdraw Modal */}
      {selectedAsset && (
        <Modal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          title="Withdraw"
          description={`Withdraw ${selectedAsset.name} from your wallet`}
          size="md"
        >
          <WithdrawModalContent 
            asset={selectedAsset} 
            onClose={() => setShowWithdrawModal(false)} 
          />
        </Modal>
      )}

      {/* Transfer Modal */}
      {selectedAsset && (
        <Modal
          isOpen={showTransferModal}
          onClose={() => setShowTransferModal(false)}
          title="Transfer"
          description={`Transfer ${selectedAsset.name} between wallets`}
          size="md"
        >
          <TransferModalContent 
            asset={selectedAsset} 
            onClose={() => setShowTransferModal(false)} 
          />
        </Modal>
      )}
    </div>
  );
}

// Deposit Modal Component
function DepositModalContent({ 
  asset, 
  onClose 
}: { 
  asset: (typeof userAssets)[0]; 
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const depositAddress = "0x742d35Cc6C6C0532B3c8F3b8E8F8A8B8C8D8E8F8";
  const network = asset.symbol === "BTC" ? "Bitcoin" : asset.symbol === "ETH" ? "ERC-20" : "TRC-20";

  const handleCopy = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-warning/5 border border-warning/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Important</p>
            <p className="text-xs text-muted mt-1">
              Only send {asset.symbol} via {network} network. Sending other assets may result in permanent loss.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center py-4">
        <div className="inline-flex p-4 rounded-xl bg-white mb-4">
          <div className="w-32 h-32 bg-gradient-to-br from-accent/20 to-cyan/20 rounded-lg flex items-center justify-center">
            <img 
              src={asset.icon} 
              alt={asset.name}
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
        <p className="text-sm text-muted mb-2">Scan QR code or copy address below</p>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          {asset.symbol} Deposit Address
        </label>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-surface border border-border">
          <code className="flex-1 text-xs font-mono text-foreground break-all">
            {depositAddress}
          </code>
          <button
            onClick={handleCopy}
            className={cn(
              "h-8 w-8 flex items-center justify-center rounded-lg transition-colors",
              copied ? "bg-accent/10 text-accent" : "bg-card-hover text-muted hover:text-foreground"
            )}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-info/5 border border-info/30">
        <Info className="h-4 w-4 text-info shrink-0" />
        <div>
          <p className="text-xs text-muted">Network</p>
          <p className="text-sm font-medium text-foreground">{network}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Withdraw Modal Component
function WithdrawModalContent({ 
  asset, 
  onClose 
}: { 
  asset: (typeof userAssets)[0]; 
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [step, setStep] = useState(1);

  const availableBalance = asset.availableBalance;
  const usdValue = amount ? (parseFloat(amount) * asset.price).toFixed(2) : "0.00";
  const fee = asset.symbol === "BTC" ? 0.0005 : asset.symbol === "ETH" ? 0.005 : 1;

  const handleMax = () => {
    setAmount((availableBalance - fee).toFixed(6));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Submit withdrawal
      console.log("Withdrawal:", { asset: asset.symbol, amount, address });
      onClose();
    }
  };

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-xl bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Confirm Withdrawal</p>
              <p className="text-xs text-muted mt-1">
                Please verify all details before confirming
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Asset</span>
            <div className="flex items-center gap-2">
              <img src={asset.icon} alt={asset.name} className="h-5 w-5 rounded" />
              <span className="text-sm font-semibold text-foreground">{asset.symbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Amount</span>
            <span className="text-sm font-semibold text-foreground">{amount} {asset.symbol}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Network Fee</span>
            <span className="text-sm font-semibold text-foreground">{fee} {asset.symbol}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">USD Value</span>
            <span className="text-sm font-semibold text-accent">${usdValue}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Destination</span>
            <code className="text-xs font-mono text-muted max-w-[200px] truncate">{address}</code>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
          >
            Confirm Withdraw
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-muted mb-1.5">
          Withdrawal Address
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
          placeholder={`Enter ${asset.symbol} address`}
          required
        />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 pr-20 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
            placeholder="0.00"
            step="0.000001"
            required
          />
          <button
            type="button"
            onClick={handleMax}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
          >
            MAX
          </button>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs">
          <span className="text-muted">Available: {availableBalance} {asset.symbol}</span>
          <span className="text-muted">≈ ${usdValue}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-info/5 border border-info/30">
        <Info className="h-4 w-4 text-info shrink-0" />
        <div>
          <p className="text-xs text-muted">Network Fee</p>
          <p className="text-sm font-medium text-foreground">{fee} {asset.symbol}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

// Transfer Modal Component
function TransferModalContent({ 
  asset, 
  onClose 
}: { 
  asset: (typeof userAssets)[0]; 
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [fromWallet, setFromWallet] = useState("Spot");
  const [toWallet, setToWallet] = useState("Futures");
  const [step, setStep] = useState(1);

  const wallets = ["Spot", "Futures", "Earn"];
  const availableBalance = asset.availableBalance;

  const handleMax = () => {
    setAmount(availableBalance.toFixed(6));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Submit transfer
      console.log("Transfer:", { asset: asset.symbol, amount, fromWallet, toWallet });
      onClose();
    }
  };

  if (step === 2) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-4 rounded-xl bg-warning/5 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Confirm Transfer</p>
              <p className="text-xs text-muted mt-1">
                Please verify all details before confirming
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Asset</span>
            <div className="flex items-center gap-2">
              <img src={asset.icon} alt={asset.name} className="h-5 w-5 rounded" />
              <span className="text-sm font-semibold text-foreground">{asset.symbol}</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">Amount</span>
            <span className="text-sm font-semibold text-foreground">{amount} {asset.symbol}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">From</span>
            <span className="text-sm font-semibold text-foreground">{fromWallet}</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
            <span className="text-sm text-muted">To</span>
            <span className="text-sm font-semibold text-foreground">{toWallet}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
          >
            Confirm Transfer
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-muted mb-1.5">
          From Wallet
        </label>
        <select
          value={fromWallet}
          onChange={(e) => setFromWallet(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
        >
          {wallets.filter(w => w !== toWallet).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-center py-2">
        <ArrowRightLeft className="h-5 w-5 text-muted" />
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          To Wallet
        </label>
        <select
          value={toWallet}
          onChange={(e) => setToWallet(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
        >
          {wallets.filter(w => w !== fromWallet).map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          Amount
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2.5 pr-20 rounded-xl bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
            placeholder="0.00"
            step="0.000001"
            required
          />
          <button
            type="button"
            onClick={handleMax}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors"
          >
            MAX
          </button>
        </div>
        <div className="flex items-center justify-between mt-1.5 text-xs">
          <span className="text-muted">Available: {availableBalance} {asset.symbol}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-info/5 border border-info/30">
        <Info className="h-4 w-4 text-info shrink-0" />
        <div>
          <p className="text-xs text-muted">Transfer Fee</p>
          <p className="text-sm font-medium text-accent">Free</p>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}

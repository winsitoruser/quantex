"use client";

import { motion } from "framer-motion";
import { Coins, TrendingUp, Lock, Clock, Percent, ArrowRight, Shield, Wallet } from "lucide-react";
import { useLanguage } from "@/i18n";
import Footer from "@/components/layout/Footer";

const earnProducts = [
  { name: "BTC Flexible Savings", apy: "4.5%", minAmount: "0.001 BTC", lockPeriod: "Flexible", tvl: "$1.2B" },
  { name: "ETH Staking", apy: "5.8%", minAmount: "0.01 ETH", lockPeriod: "30 Days", tvl: "$890M" },
  { name: "USDT Fixed Deposit", apy: "8.2%", minAmount: "100 USDT", lockPeriod: "90 Days", tvl: "$2.1B" },
  { name: "SOL Staking", apy: "7.1%", minAmount: "1 SOL", lockPeriod: "60 Days", tvl: "$340M" },
  { name: "DOT Liquid Staking", apy: "12.5%", minAmount: "10 DOT", lockPeriod: "120 Days", tvl: "$180M" },
  { name: "AVAX DeFi Vault", apy: "9.8%", minAmount: "5 AVAX", lockPeriod: "30 Days", tvl: "$95M" },
];

export default function EarnPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-purple/[0.03]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
                <Coins className="h-3.5 w-3.5" />
                Earn Crypto
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">{t.earn.title}</h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mb-8 max-w-lg">{t.earn.subtitle}</p>
              <div className="flex items-center gap-6 text-xs text-muted">
                <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-accent" /> Insured Assets</span>
                <span className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-accent" /> Auto-compounding</span>
                <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-accent" /> Flexible & Fixed</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Coins, label: t.earn.stats.totalValueLocked, value: "$4.8B" },
                  { icon: Percent, label: t.earn.stats.avgApy, value: "7.98%" },
                  { icon: TrendingUp, label: t.earn.stats.totalDistributed, value: "$120M+" },
                  { icon: Clock, label: t.earn.stats.productsAvailable, value: "45+" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="rounded-xl bg-card border border-border p-4 lg:p-5">
                    <Icon className="h-4 w-4 text-accent mb-2" />
                    <p className="text-xl font-bold text-foreground font-mono">{value}</p>
                    <p className="text-[11px] text-muted mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{t.earn.earnProducts}</h2>
              <p className="text-sm text-muted">Choose from flexible and fixed-term earning options</p>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider bg-card/50 border-b border-border">
              <span>Product</span>
              <span className="text-right">APY</span>
              <span className="text-right">Min Amount</span>
              <span className="text-right">Lock Period</span>
              <span className="text-right">TVL</span>
              <span className="text-center">Action</span>
            </div>
            {earnProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_120px] gap-3 items-center px-5 py-4 hover:bg-card-hover transition-colors border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-accent/10">
                    <Coins className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{product.name}</p>
                </div>
                <p className="text-sm font-bold text-accent text-right">{product.apy}</p>
                <p className="text-sm text-muted font-mono text-right">{product.minAmount}</p>
                <p className="text-sm text-muted text-right flex items-center justify-end gap-1">
                  <Lock className="h-3 w-3" /> {product.lockPeriod}
                </p>
                <p className="text-sm text-muted font-mono text-right">{product.tvl}</p>
                <div className="flex justify-center">
                  <button className="h-8 px-4 rounded-lg bg-accent/10 text-accent text-xs font-semibold hover:bg-accent/20 transition-colors inline-flex items-center gap-1">
                    {t.earn.subscribe} <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-3">
            {earnProducts.map((product, i) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-card border border-border p-4 active:bg-card-hover transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-foreground">{product.name}</p>
                  <span className="text-sm font-bold text-accent">{product.apy} APY</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted mb-3">
                  <span>Min: {product.minAmount}</span>
                  <span className="flex items-center gap-0.5">
                    <Lock className="h-3 w-3" /> {product.lockPeriod}
                  </span>
                  <span>TVL: {product.tvl}</span>
                </div>
                <button className="w-full h-9 rounded-xl bg-accent/10 text-accent text-xs font-semibold active:bg-accent/20 transition-colors">
                  {t.earn.subscribe}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

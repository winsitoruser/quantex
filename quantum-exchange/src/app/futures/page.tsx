"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Shield, BarChart3, ArrowRight, Rocket, Lock, LineChart } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n";
import Footer from "@/components/layout/Footer";

export default function FuturesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple/[0.06] via-transparent to-cyan/[0.04]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8 py-16 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-semibold mb-6">
                <Rocket className="h-3.5 w-3.5" />
                {t.futures.comingSoon}
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">{t.futures.title}</h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mb-8 max-w-lg">
                {t.futures.subtitle}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/trade/btc-usdt"
                  className="h-12 px-8 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  {t.futures.tradeSpotNow} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/markets"
                  className="h-12 px-8 rounded-xl border border-border hover:border-accent/50 text-foreground font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  View Markets
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: TrendingUp, label: t.futures.upTo100x, desc: t.futures.leverage },
                  { icon: Shield, label: t.futures.insuranceFund, desc: t.futures.protection },
                  { icon: BarChart3, label: t.futures.pairsCount, desc: t.futures.available },
                  { icon: Zap, label: "Sub-ms", desc: "Execution Speed" },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="rounded-xl bg-card border border-border p-4 lg:p-5 hover:border-accent/30 transition-colors">
                    <Icon className="h-4 w-4 text-accent mb-2" />
                    <p className="text-xl font-bold text-foreground font-mono">{label}</p>
                    <p className="text-[11px] text-muted mt-0.5">{desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Why Trade Futures on Quantum Exchange?</h2>
            <p className="text-sm text-muted max-w-md mx-auto">Industry-leading features for professional derivatives trading</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: TrendingUp, label: "Up to 100x Leverage", desc: "Maximize your trading positions with flexible leverage options from 1x to 100x on all major pairs." },
              { icon: Shield, label: "Insurance Fund", desc: "Our robust insurance fund protects traders from auto-deleveraging and ensures fair liquidation." },
              { icon: LineChart, label: "Advanced Order Types", desc: "Stop-limit, trailing stop, take profit, and conditional orders for precise trade management." },
              { icon: Lock, label: "Risk Management", desc: "Built-in margin calculator, position size optimizer, and real-time PnL tracking." },
              { icon: Zap, label: "Ultra-Fast Engine", desc: "Sub-millisecond matching engine capable of processing 100,000+ orders per second." },
              { icon: BarChart3, label: "Deep Liquidity", desc: "Aggregated liquidity from multiple sources ensuring minimal slippage on large orders." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl bg-card border border-border p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent/10 mb-4">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{item.label}</h3>
                  <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

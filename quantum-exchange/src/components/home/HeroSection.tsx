"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  BarChart3,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { useCurrency } from "@/i18n";
import { cryptoPairs } from "@/data/mockData";
import { cn, formatPercent } from "@/lib/utils";

export default function HeroSection() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  const hotCoins = cryptoPairs.slice(0, 6);

  return (
    <section className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-cyan/[0.03] rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-4 lg:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/8 border border-accent/15 text-accent text-[11px] font-semibold mb-5">
              <Zap className="h-3 w-3" />
              {t.home.hero.title}
            </div>
            <h1 className="text-3xl lg:text-[44px] font-bold text-foreground leading-[1.15] mb-4 tracking-tight">
              Trade Crypto with
              <span className="text-gradient"> Quantum Speed</span>
            </h1>
            <p className="text-sm text-text-secondary leading-relaxed mb-7 max-w-md">
              Trade 500+ crypto pairs with advanced tools, AI-powered bots, and institutional-grade security. Join millions of traders worldwide.
            </p>
            <div className="flex items-center gap-3 mb-8">
              <Link
                href="/register"
                className="h-11 px-7 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-[13px] inline-flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/markets"
                className="h-11 px-7 rounded-xl border border-border hover:border-accent/40 text-foreground font-medium text-[13px] inline-flex items-center gap-2 transition-colors"
              >
                View Markets
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 text-[11px] text-text-secondary">
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-accent" /> Bank-grade security</span>
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-accent" /> Sub-ms execution</span>
              <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-accent" /> 500+ pairs</span>
            </div>
          </motion.div>

          {/* Right - Stats + Hot Coins */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="space-y-5"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "24h Trading Volume", value: formatCurrency(48200000000, { compact: true }), icon: BarChart3 },
                { label: "Registered Users", value: "12M+", icon: Globe },
                { label: "Avg. Bot Return", value: "23.4%", icon: Zap },
                { label: "Active Bots", value: "45K+", icon: Zap },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-surface/80 border border-border/60 p-4 hover:border-border transition-colors"
                  >
                    <Icon className="h-4 w-4 text-accent mb-2" />
                    <p className="text-lg font-bold text-foreground font-mono tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-muted mt-0.5">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Hot Coins scroll */}
            <div>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2.5">🔥 Hot Coins</p>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {hotCoins.map((coin) => {
                  const up = coin.change24h >= 0;
                  return (
                    <Link
                      key={coin.id}
                      href={`/trade/${coin.id}`}
                      className="shrink-0 rounded-xl bg-surface/80 border border-border/60 p-3 min-w-[130px] hover:border-accent/30 transition-all group"
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <img
                          src={coin.icon}
                          alt={coin.name}
                          className="h-5 w-5 object-contain"
                        />
                        <span className="text-[13px] font-semibold text-foreground">{coin.symbol.split("/")[0]}</span>
                        <span className="text-[9px] text-muted">/USDT</span>
                      </div>
                      <p className="text-[13px] font-mono font-medium text-foreground mb-1">{formatCurrency(coin.price)}</p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold",
                          up ? "text-accent bg-accent/10" : "text-danger bg-danger/10"
                        )}
                      >
                        {up ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                        {up ? "+" : ""}{formatPercent(coin.change24h)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

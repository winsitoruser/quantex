"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Users, BarChart3, Zap, Shield } from "lucide-react";
import { useLanguage, useCurrency } from "@/i18n";

export default function StatsSection() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  const stats = [
    { icon: BarChart3, label: t.home.stats.tradingVolume, value: formatCurrency(48200000000, { compact: true }) },
    { icon: Users, label: t.home.stats.registeredUsers, value: "12M+" },
    { icon: Shield, label: t.home.stats.countriesSupported, value: "180+" },
    { icon: Zap, label: t.home.stats.tradingPairs, value: "500+" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl bg-surface/60 border border-border/50 p-5 text-center hover:border-border transition-colors"
              >
                <Icon className="h-4 w-4 text-accent mx-auto mb-2.5" />
                <p className="text-xl font-bold text-foreground font-mono mb-0.5 tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-text-secondary">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-border/50 animate-glow"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/[0.06] via-surface to-cyan/[0.06]" />
          <div className="absolute top-0 left-1/3 w-[300px] h-[200px] bg-accent/[0.05] rounded-full blur-[80px]" />
          <div className="relative px-6 py-10 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">
              {t.home.stats.ctaTitle}
            </h2>
            <p className="text-[13px] text-text-secondary mb-5 max-w-md mx-auto leading-relaxed">
              {t.home.stats.ctaSubtitle}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 h-10 px-7 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-[13px] transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              {t.home.stats.createAccount}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

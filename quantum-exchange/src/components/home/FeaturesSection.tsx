"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Globe,
  Layers,
  BarChart3,
  Bot,
} from "lucide-react";
import { useLanguage } from "@/i18n";

export default function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    { icon: Shield, label: t.home.features.bankGrade, desc: t.home.features.bankGradeDesc },
    { icon: Zap, label: t.home.features.ultraFast, desc: t.home.features.ultraFastDesc },
    { icon: Globe, label: t.home.features.globalLiquidity, desc: t.home.features.globalLiquidityDesc },
    { icon: Layers, label: t.home.features.defiIntegration, desc: t.home.features.defiIntegrationDesc },
    { icon: BarChart3, label: "Advanced Charts", desc: "Professional TradingView charts with 100+ indicators and drawing tools" },
    { icon: Bot, label: "AI Trading Bots", desc: "Automated strategies that trade 24/7 — Grid, DCA, Arbitrage, and more" },
  ];

  return (
    <section className="py-10">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-foreground mb-1.5 tracking-tight">{t.home.features.title}</h2>
          <p className="text-[13px] text-text-secondary max-w-md mx-auto">{t.home.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-surface/60 border border-border/50 p-5 hover:border-accent/25 hover:bg-surface transition-all group"
              >
                <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-accent/8 mb-3 group-hover:bg-accent/12 transition-colors">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
                <h3 className="text-[13px] font-semibold text-foreground mb-1">{item.label}</h3>
                <p className="text-[11px] text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

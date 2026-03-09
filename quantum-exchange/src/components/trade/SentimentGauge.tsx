"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Users, BarChart3, Flame } from "lucide-react";

interface SentimentGaugeProps {
  symbol: string;
}

// SVG Bull icon
function BullIcon({ className, fill }: { className?: string, fill?: string }) {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 120 120">
      <path d="M0 0 C11.42717449 7.81154506 18.96481346 22.34983091 23 35.3671875 C23.35546875 38 23.35546875 38 23 40.3671875 C21.42578125 42.10546875 21.42578125 42.10546875 19.3125 43.6796875 C12.81036319 48.9734626 9.08854836 55.37508484 7.58203125 63.66796875 C7.43121094 64.47621094 7.28039062 65.28445312 7.125 66.1171875 C6.94324219 67.25414063 6.94324219 67.25414063 6.7578125 68.4140625 C6 70.3671875 6 70.3671875 3.9296875 71.6328125 C3.29289062 71.87515625 2.65609375 72.1175 2 72.3671875 C2.1546875 73.9140625 2.1546875 73.9140625 2.3125 75.4921875 C1.90324992 80.56688851 0.53727317 81.82991433 -3 85.3671875 C-6.72466849 87.22952175 -10.94495313 86.93849579 -15 86.3671875 C-18.12578143 84.6951128 -20.39281175 82.581564 -22 79.3671875 C-22.04022391 77.0342009 -22.04320247 74.70012084 -22 72.3671875 C-22.93392578 72.08875 -22.93392578 72.08875 -23.88671875 71.8046875 C-27.10501724 69.61553067 -27.04755748 67.10523171 -27.8125 63.3671875 C-29.7764243 54.89738395 -33.21886518 47.88978049 -40.5 42.7421875 C-41.325 41.9584375 -42.15 41.1746875 -43 40.3671875 C-42.80051872 34.20321595 -41.05972257 29.42286986 -38.375 23.9296875 C-38.01599609 23.18541504 -37.65699219 22.44114258 -37.28710938 21.67431641 C-32.4925073 12.00689343 -26.00743417 3.39646215 -16.5 -2.0703125 C-10.27897197 -3.47004381 -5.52162994 -3.12748571 0 0 Z M-29 32.3671875 C-29.35882213 35.59658669 -29.27258004 36.97928513 -27.375 39.6796875 C-24.35379564 41.8263327 -22.63272373 41.84102103 -19 41.3671875 C-18.34 40.7071875 -17.68 40.0471875 -17 39.3671875 C-18.81075018 38.19780683 -20.62364743 37.03175017 -22.4375 35.8671875 C-23.44683594 35.2175 -24.45617187 34.5678125 -25.49609375 33.8984375 C-27.65301818 32.28023431 -27.65301818 32.28023431 -29 32.3671875 Z M2.4375 35.8671875 C1.42558594 36.516875 0.41367187 37.1665625 -0.62890625 37.8359375 C-1.41136719 38.34125 -2.19382813 38.8465625 -3 39.3671875 C-1.12575284 41.6479085 -1.12575284 41.6479085 1.875 41.7421875 C5.05449961 41.6131679 5.05449961 41.6131679 7.375 39.6796875 C9.27258004 36.97928513 9.35882213 35.59658669 9 32.3671875 C6.76223705 32.3671875 4.21768222 34.72132308 2.4375 35.8671875 Z M-19 65.3671875 C-19.66 67.6771875 -20.32 69.9871875 -21 72.3671875 C-20.01 72.6971875 -19.02 73.0271875 -18 73.3671875 C-17.67 72.3771875 -17.34 71.3871875 -17 70.3671875 C-16.34 70.0371875 -15.68 69.7071875 -15 69.3671875 C-15 68.0471875 -15 66.7271875 -15 65.3671875 C-16.32 65.3671875 -17.64 65.3671875 -19 65.3671875 Z M-5 65.3671875 C-5 66.6871875 -5 68.0071875 -5 69.3671875 C-4.01 69.8621875 -4.01 69.8621875 -3 70.3671875 C-2.67 71.3571875 -2.34 72.3471875 -2 73.3671875 C-1.01 73.0371875 -0.02 72.7071875 1 72.3671875 C0.34 70.0571875 -0.32 67.7471875 -1 65.3671875 C-2.32 65.3671875 -3.64 65.3671875 -5 65.3671875 Z M-17 75.3671875 C-15.66436384 80.31182385 -15.66436384 80.31182385 -13 81.3671875 C-10.0842309 81.78420872 -10.0842309 81.78420872 -7 81.3671875 C-4.62280307 79.49216819 -4.62280307 79.49216819 -3 77.3671875 C-3.33 76.7071875 -3.66 76.0471875 -4 75.3671875 C-8.29 75.3671875 -12.58 75.3671875 -17 75.3671875 Z " fill={fill} transform="translate(60,13.6328125)" />
      <path d="M0 0 C3.28241941 -0.5744234 5.31513357 -0.46038244 8.109375 1.41796875 C12.33659439 5.03578972 15.5931425 7.86814342 16.3359375 13.5859375 C16.41944775 19.54856963 16.30771383 23.47137776 12 28 C9.07086911 30.21420084 6.1972381 31.76932196 2.546875 32.47265625 C0 32 0 32 -2.23828125 29.41015625 C-2.92277344 28.30542969 -3.60726562 27.20070313 -4.3125 26.0625 C-5.00988281 24.96035156 -5.70726563 23.85820312 -6.42578125 22.72265625 C-8 20 -8 20 -8 19 C-7.28972656 18.79503906 -6.57945313 18.59007813 -5.84765625 18.37890625 C-4.92855469 18.10949219 -4.00945312 17.84007813 -3.0625 17.5625 C-2.14597656 17.29566406 -1.22945313 17.02882813 -0.28515625 16.75390625 C1.9402493 16.20973949 1.9402493 16.20973949 3 15 C3.37248788 10.06453561 3.12937239 7.78132497 0 4 C0 2.68 0 1.36 0 0 Z " fill={fill} transform="translate(78,0)" />
      <path d="M0 0 C-0.54723683 3.37462715 -1.0549 5.08235 -3 8 C-3.33338596 11.54187831 -3.33338596 11.54187831 -3 15 C-0.6870518 17.3129482 0.47904875 17.49580975 3.625 18.125 C4.44226563 18.29257812 5.25953125 18.46015625 6.1015625 18.6328125 C6.72804688 18.75398438 7.35453125 18.87515625 8 19 C6.85605098 20.98025639 5.70978896 22.95917678 4.5625 24.9375 C3.92441406 26.03964844 3.28632813 27.14179688 2.62890625 28.27734375 C1 31 1 31 0 32 C-5.8254629 31.76698148 -9.87544084 30.03749722 -14 26 C-16.96018956 21.38761162 -16.61455041 16.28513348 -16 11 C-12.79910272 4.35198257 -7.76670339 -0.92460755 0 0 Z " fill={fill} transform="translate(22,0)" />
      <path d="M0 0 C0.33 1.65 0.66 3.3 1 5 C-2.29878452 7.57466109 -4.51348905 8.92578647 -8.6875 9.5625 C-12 9 -12 9 -13.9375 6.625 C-15 4 -15 4 -15 2 C-5.77448747 -2.96127563 -5.77448747 -2.96127563 0 0 Z " fill={fill} transform="translate(95,33)" />
      <path d="M0 0 C0.94875 0.37125 1.8975 0.7425 2.875 1.125 C3.57625 1.41375 4.2775 1.7025 5 2 C3.125 7.875 3.125 7.875 2 9 C-3.70320894 9.55913813 -6.50812136 8.5058565 -11 5 C-10.52034261 0.44325482 -10.52034261 0.44325482 -8.3125 -1.4375 C-5.02065475 -2.23821911 -3.10049942 -1.26550997 0 0 Z " fill={fill} transform="translate(15,33)" />
    </svg>
  );
}

// SVG Bear icon
function BearIcon({ className, fill }: { className?: string, fill?: string }) {
  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className}>
      <path d="M0 0 C3.125 2.3125 3.125 2.3125 5 5 C5 5.99 5 6.98 5 8 C5.95261719 7.98839844 6.90523437 7.97679687 7.88671875 7.96484375 C9.14097656 7.95582031 10.39523438 7.94679688 11.6875 7.9375 C12.92886719 7.92589844 14.17023437 7.91429687 15.44921875 7.90234375 C19 8 19 8 21.76953125 8.56640625 C24.15809155 9.22032952 24.15809155 9.22032952 27 8 C29.39490986 7.93029948 31.79167691 7.91551997 34.1875 7.9375 C35.45980469 7.94652344 36.73210938 7.95554687 38.04296875 7.96484375 C39.50669922 7.98224609 39.50669922 7.98224609 41 8 C41.13535156 7.38640625 41.27070312 6.7728125 41.41015625 6.140625 C42.28878189 2.95197035 43.24826063 1.87923664 46 0 C50.56296812 -1.02565832 54.37020778 -1.02360523 58.39453125 1.50390625 C64.84046335 7.06715215 64.84046335 7.06715215 65.203125 11.4609375 C65.22632812 12.90339844 65.22632812 12.90339844 65.25 14.375 C65.27578125 15.33148438 65.3015625 16.28796875 65.328125 17.2734375 C64.95439914 20.37892147 64.06626291 21.70536066 62 24 C57.6452395 23.27263219 55.97019665 21.23330953 53.265625 17.9140625 C51.54139771 15.30643481 51.07220444 13.10479106 51 10 C51.33 9.34 51.66 8.68 52 8 C51.34 8 50.68 8 50 8 C48.97583328 11.58458352 48.68190624 13.36381249 50.375 16.75 C51.8104164 18.67713343 53.36024106 20.37481729 55.02734375 22.109375 C66.75365962 34.37690545 72.51161309 49.74982349 73.75 66.5625 C73.55137924 70.65077736 72.93457291 72.86087401 70 75.75 C53.94317325 87.37343742 32.85010293 94.80340928 12.98535156 91.68359375 C-0.57915942 88.87949012 -17.93458253 83.14634284 -27 72 C-29.96066665 58.32868637 -23.13723519 41.45556236 -16 30 C-14.33646109 28.04714998 -12.62101748 26.35229121 -10.71484375 24.640625 C-7.49927306 21.56422479 -4.90855256 18.02107256 -3 14 C-2.93940503 10.56531141 -2.93940503 10.56531141 -4 8 C-4.99 8.495 -4.99 8.495 -6 9 C-5.71125 9.66 -5.4225 10.32 -5.125 11 C-4.92637173 15.76707844 -7.97251312 18.52797075 -11 22 C-11.66 22.66 -12.32 23.32 -13 24 C-15 23.8125 -15 23.8125 -17 23 C-19.99335474 18.50996789 -19.96483164 14.25297225 -19 9 C-14.23853468 1.15539264 -9.0167528 -1.28810754 0 0 Z M4 33 C3.66666667 36 3.66666667 36 4 39 C5.83883881 41.28728734 5.83883881 41.28728734 8.625 41.125 C9.40875 41.08375 10.1925 41.0425 11 41 C7 57 7 57 6.45410156 59.04760742 C5.79283398 61.8907025 5.75049799 64.6480142 5.6875 67.5625 C5.65011719 68.69816406 5.61273438 69.83382812 5.57421875 71.00390625 C5.71580771 74.04439918 5.71580771 74.04439918 7.70703125 75.83984375 C12.5634477 78.29700846 17.52880494 78.18250356 22.875 78.1875 C23.55691406 78.19974609 24.23882812 78.21199219 24.94140625 78.22460938 C29.60004659 78.23791978 33.56447645 77.58411555 38 76 C40.6662358 73.3337642 40.32955254 71.97669154 40.375 68.25 C40.29656328 61.82531935 38.94133886 56.28091554 36.97265625 50.19140625 C36.03902959 47.12806094 35.45368202 44.16622292 35 41 C35.78375 41.04125 36.5675 41.0825 37.375 41.125 C40.16116119 41.28728734 40.16116119 41.28728734 42 39 C42.33333333 36 42.33333333 36 42 33 C40.11499729 30.68436913 40.11499729 30.68436913 37 30.75 C33.88500271 30.68436913 33.88500271 30.68436913 32 33 C30.41065193 44.24254632 33.64012099 54.41638111 37 65 C36.175 64.67515625 35.35 64.3503125 34.5 64.015625 C30.5952029 62.88253656 27.02489262 62.70460647 23 62.75 C22.31421875 62.74226563 21.6284375 62.73453125 20.921875 62.7265625 C16.57469165 62.7431548 13.03886007 63.40969885 9 65 C9.3609375 63.86304688 9.721875 62.72609375 10.09375 61.5546875 C12.99972455 52.03029637 15.42175826 43.05706895 14 33 C12.11499729 30.68436913 12.11499729 30.68436913 9 30.75 C5.88500271 30.68436913 5.88500271 30.68436913 4 33 Z " fill={fill} transform="translate(27,4)" />
      <path d="M0 0 C0.7940625 -0.01160156 1.588125 -0.02320312 2.40625 -0.03515625 C7.11307097 -0.01162215 10.12389321 0.42103152 14 3.375 C13.67 5.025 13.34 6.675 13 8.375 C4.42 8.375 -4.16 8.375 -13 8.375 C-13.33 6.725 -13.66 5.075 -14 3.375 C-9.41948887 -0.11579276 -5.51811981 -0.08062188 0 0 Z " fill={fill} transform="translate(50,69.625)" />
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.68 4 1.36 4 0 4 C0 2.68 0 1.36 0 0 Z " fill={fill} transform="translate(62,38)" />
      <path d="M0 0 C1.32 0 2.64 0 4 0 C4 1.32 4 2.64 4 4 C2.68 4 1.36 4 0 4 C0 2.68 0 1.36 0 0 Z " fill={fill} transform="translate(34,38)" />
    </svg>
  );
}

// Generate realistic mock sentiment data
function generateSentiment(symbol: string) {
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = ((seed * 7 + 13) % 40) + 30; // 30-70 range
  return base;
}

interface MetricData {
  label: string;
  buyPct: number;
  icon: React.ReactNode;
}

export default function SentimentGauge({ symbol }: SentimentGaugeProps) {
  const [buyPercent, setBuyPercent] = useState(50);

  // Simulate live sentiment changes
  useEffect(() => {
    const base = generateSentiment(symbol);
    setBuyPercent(base);

    const interval = setInterval(() => {
      setBuyPercent((prev) => {
        const delta = (Math.random() - 0.48) * 3;
        return Math.min(85, Math.max(15, prev + delta));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [symbol]);

  const sellPercent = 100 - buyPercent;
  const isBullish = buyPercent >= 50;
  const strength = Math.abs(buyPercent - 50);

  const sentimentLabel = useMemo(() => {
    if (strength > 25) return isBullish ? "Strong Buy" : "Strong Sell";
    if (strength > 15) return isBullish ? "Buy" : "Sell";
    if (strength > 5) return isBullish ? "Lean Buy" : "Lean Sell";
    return "Neutral";
  }, [strength, isBullish]);

  const metrics: MetricData[] = useMemo(() => {
    const s = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return [
      { label: "Long/Short", buyPct: ((s * 3 + 7) % 30) + 40, icon: <BarChart3 className="h-3 w-3" /> },
      { label: "Volume", buyPct: ((s * 11 + 3) % 35) + 35, icon: <Flame className="h-3 w-3" /> },
      { label: "OI", buyPct: ((s * 5 + 17) % 30) + 38, icon: <Users className="h-3 w-3" /> },
    ];
  }, [symbol]);

  const fearGreedValue = Math.round(Math.min(buyPercent * 1.2, 100));

  return (
    <div className="px-3 py-2.5 space-y-3">
      {/* Bull vs Bear - Compact Row */}
      <div className="flex items-center gap-2">
        {/* Bull */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <div className={`shrink-0 ${isBullish ? "text-accent" : "text-muted/30"}`}>
            <BullIcon className="h-7 w-7" fill={isBullish ? "#00d47e" : "#000000"} />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold font-mono leading-tight ${isBullish ? "text-accent" : "text-muted/40"}`}>
              {buyPercent.toFixed(1)}%
            </p>
            <p className="text-[9px] text-muted leading-tight">Buy</p>
          </div>
        </div>

        {/* Label */}
        <motion.div
          key={sentimentLabel}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="shrink-0"
        >
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isBullish
            ? "bg-accent/10 text-accent border-accent/20"
            : "bg-danger/10 text-danger border-danger/20"
            }`}>
            {sentimentLabel}
          </span>
        </motion.div>

        {/* Bear */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
          <div className="min-w-0 text-right">
            <p className={`text-sm font-bold font-mono leading-tight ${!isBullish ? "text-danger" : "text-muted/40"}`}>
              {sellPercent.toFixed(1)}%
            </p>
            <p className="text-[9px] text-muted leading-tight">Sell</p>
          </div>
          <div className={`shrink-0 ${!isBullish ? "text-danger" : "text-muted/30"}`}>
            <BearIcon className="h-7 w-7" fill={isBullish ? "#f6465d" : "#000000"} />
          </div>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div>
        <div className="relative h-2 rounded-full bg-background overflow-hidden border border-border/50">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ background: "linear-gradient(90deg, #00c26f, #00e68a)" }}
            animate={{ width: `${buyPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-y-0 right-0 rounded-full"
            style={{ background: "linear-gradient(270deg, #ef4444, #f87171)" }}
            animate={{ width: `${sellPercent}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <div className="absolute inset-y-0 left-1/2 w-px bg-foreground/20 -translate-x-1/2 z-10" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[9px] text-accent flex items-center gap-0.5">
            <TrendingUp className="h-2.5 w-2.5" /> Long
          </span>
          <span className="text-[9px] text-danger flex items-center gap-0.5">
            Short <TrendingDown className="h-2.5 w-2.5" />
          </span>
        </div>
      </div>

      {/* Breakdown Metrics - Compact */}
      <div className="space-y-1.5">
        {metrics.map((metric, idx) => {
          const mBull = metric.buyPct >= 50;
          return (
            <div key={metric.label} className="flex items-center gap-2">
              <span className="text-[10px] text-muted flex items-center gap-1 w-[70px] shrink-0">
                {metric.icon}
                {metric.label}
              </span>
              <div className="relative h-1.5 rounded-full bg-background overflow-hidden flex-1">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  animate={{ width: `${metric.buyPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
                <motion.div
                  className="absolute inset-y-0 right-0 rounded-full bg-danger"
                  animate={{ width: `${100 - metric.buyPct}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              </div>
              <span className={`text-[10px] font-mono font-medium w-[38px] text-right shrink-0 ${mBull ? "text-accent" : "text-danger"}`}>
                {metric.buyPct.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Long/Short Positions - Inline */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded border border-accent/15 bg-accent/5 px-2 py-1.5 text-center">
          <BullIcon className="h-4 w-4 mx-auto mb-0.5" fill="#00d47e"  />
          <p className="text-xs font-bold text-accent font-mono">{buyPercent.toFixed(1)}%</p>
          <p className="text-[8px] text-accent/60 font-medium uppercase">Long</p>
        </div>
        <div className="rounded border border-danger/15 bg-danger/5 px-2 py-1.5 text-center">
          <BearIcon className="h-4 w-4 mx-auto mb-0.5" fill="#f6465d" />
          <p className="text-xs font-bold text-danger font-mono">{sellPercent.toFixed(1)}%</p>
          <p className="text-[8px] text-danger/60 font-medium uppercase">Short</p>
        </div>
      </div>

      {/* Fear & Greed - Compact */}
      <div className="rounded border border-border bg-background/50 px-2.5 py-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-medium text-muted uppercase tracking-wider">Fear & Greed</span>
          <span className={`text-[11px] font-bold font-mono ${fearGreedValue > 60 ? "text-accent" : fearGreedValue < 40 ? "text-danger" : "text-yellow-500"
            }`}>
            {fearGreedValue}
          </span>
        </div>
        <div className="relative h-1.5 rounded-full overflow-hidden"
          style={{ background: "linear-gradient(90deg, #ef4444, #f59e0b, #00c26f)" }}
        >
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white border-2 border-background shadow-md"
            animate={{ left: `calc(${fearGreedValue}% - 5px)` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[8px] text-danger/60">Fear</span>
          <span className="text-[8px] text-yellow-500/60">Neutral</span>
          <span className="text-[8px] text-accent/60">Greed</span>
        </div>
      </div>
    </div>
  );
}

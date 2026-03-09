"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Star, ArrowUpRight, ArrowDownRight, ChevronDown, Search } from "lucide-react";
import { formatPercent } from "@/lib/utils";
import { CryptoPair, cryptoPairs } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/i18n";
import { AnimatePresence, motion } from "framer-motion";

interface PairInfoProps {
  pair: CryptoPair;
}

export default function PairInfo({ pair }: PairInfoProps) {
  const { formatCurrency } = useCurrency();
  const isPositive = pair.change24h >= 0;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dropdownOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [dropdownOpen]);

  const filteredPairs = cryptoPairs.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative z-[100] flex items-center gap-6 px-4 py-2.5 border-b border-border">
      {/* Pair Name - Clickable with dropdown */}
      <div ref={dropdownRef} className="relative shrink-0">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 hover:bg-card rounded-lg px-2 py-1.5 -mx-2 -my-1.5 transition-colors"
        >
          <img
            src={pair.icon}
            alt={pair.name}
            className="h-8 w-8 object-contain rounded-lg bg-card border border-border"
          />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-foreground">{pair.symbol}</h2>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted transition-transform", dropdownOpen && "rotate-180")} />
            </div>
            <p className="text-[10px] text-muted">{pair.name}</p>
          </div>
        </button>

        <button className="absolute -right-5 top-1/2 -translate-y-1/2 text-muted hover:text-warning transition-colors">
          <Star className="h-3.5 w-3.5" />
        </button>

        {/* Pair Selector Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.12 }}
              className="absolute top-full left-0 mt-2 w-[360px] rounded-xl bg-card border border-border shadow-2xl overflow-hidden z-[200]"
            >
              {/* Search */}
              <div className="px-3 py-2.5 border-b border-border">
                <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
                  <Search className="h-4 w-4 text-muted shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search pairs..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                  />
                </div>
              </div>

              {/* Column Headers */}
              <div className="grid grid-cols-[1.5fr_1fr_80px_70px] gap-2 px-4 py-2 text-[10px] font-medium text-muted uppercase tracking-wider border-b border-border">
                <span>Pair</span>
                <span className="text-right">Price</span>
                <span className="text-right">24h %</span>
                <span className="text-right">Volume</span>
              </div>

              {/* Pairs List */}
              <div className="max-h-[320px] overflow-y-auto">
                {filteredPairs.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-muted">No pairs found</div>
                ) : (
                  filteredPairs.map((p) => {
                    const isActive = p.id === pair.id;
                    const pPositive = p.change24h >= 0;
                    return (
                      <Link
                        key={p.id}
                        href={`/trade/${p.id}`}
                        onClick={() => { setDropdownOpen(false); setSearch(""); }}
                        className={cn(
                          "grid grid-cols-[1.5fr_1fr_80px_70px] gap-2 items-center px-4 py-2.5 text-xs transition-colors",
                          isActive ? "bg-accent/5" : "hover:bg-card-hover"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{p.icon}</span>
                          <div>
                            <span className={cn("font-semibold", isActive ? "text-accent" : "text-foreground")}>
                              {p.symbol}
                            </span>
                            <p className="text-[10px] text-muted">{p.name}</p>
                          </div>
                        </div>
                        <span className="text-right font-mono text-foreground">{formatCurrency(p.price)}</span>
                        <span className={cn(
                          "text-right font-semibold",
                          pPositive ? "text-accent" : "text-danger"
                        )}>
                          {pPositive ? "+" : ""}{formatPercent(p.change24h)}
                        </span>
                        <span className="text-right font-mono text-muted">{formatCurrency(p.volume24h, { compact: true })}</span>
                      </Link>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Price */}
      <div className="shrink-0 ml-4">
        <p className={`text-xl font-bold font-mono ${isPositive ? "text-accent" : "text-danger"}`}>
          {formatCurrency(pair.price)}
        </p>
        <div className="flex items-center gap-1">
          <span className={`flex items-center gap-0.5 text-xs font-medium ${isPositive ? "text-accent" : "text-danger"}`}>
            {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {formatPercent(pair.change24h)}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden lg:flex items-center gap-6">
        {[
          { label: "24h High", value: formatCurrency(pair.high24h) },
          { label: "24h Low", value: formatCurrency(pair.low24h) },
          { label: "24h Volume", value: formatCurrency(pair.volume24h, { compact: true }) },
          { label: "Market Cap", value: formatCurrency(pair.marketCap, { compact: true }) },
        ].map((stat) => (
          <div key={stat.label} className="shrink-0">
            <p className="text-[10px] text-muted mb-0.5">{stat.label}</p>
            <p className="text-xs font-medium text-foreground font-mono">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

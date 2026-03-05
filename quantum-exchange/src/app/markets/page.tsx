"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ChevronUp,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { cryptoPairs } from "@/data/mockData";
import { formatPercent, formatNumber, cn } from "@/lib/utils";
import MiniChart from "@/components/ui/MiniChart";
import { useLanguage, useCurrency } from "@/i18n";

type SortField = "name" | "price" | "change" | "volume" | "marketCap";
type SortDir = "asc" | "desc";

export default function MarketsPage() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();

  const categories = [
    t.markets.categories.all, t.markets.categories.favorites, t.markets.categories.spot,
    t.markets.categories.futures, t.markets.categories.new, t.markets.categories.defi,
    t.markets.categories.layer1, t.markets.categories.meme,
  ];
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(t.markets.categories.all);
  const [sortField, setSortField] = useState<SortField>("volume");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1 -space-y-1">
      <ChevronUp
        className={cn(
          "h-3 w-3",
          sortField === field && sortDir === "asc" ? "text-accent" : "text-muted/40"
        )}
      />
      <ChevronDown
        className={cn(
          "h-3 w-3",
          sortField === field && sortDir === "desc" ? "text-accent" : "text-muted/40"
        )}
      />
    </span>
  );

  const filteredPairs = useMemo(() => {
    let filtered = cryptoPairs.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.symbol.toLowerCase().includes(search.toLowerCase())
    );

    if (activeCategory === t.markets.categories.favorites) {
      filtered = filtered.filter((p) => favorites.has(p.id));
    }

    filtered.sort((a, b) => {
      let aVal: number, bVal: number;
      switch (sortField) {
        case "price": aVal = a.price; bVal = b.price; break;
        case "change": aVal = a.change24h; bVal = b.change24h; break;
        case "volume": aVal = a.volume24h; bVal = b.volume24h; break;
        case "marketCap": aVal = a.marketCap; bVal = b.marketCap; break;
        default: aVal = a.name.localeCompare(b.name); bVal = 0;
      }
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [search, sortField, sortDir, activeCategory, favorites, t.markets.categories.favorites]);

  const topMovers = useMemo(
    () => [...cryptoPairs].sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h)).slice(0, 4),
    []
  );

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="w-full border-b border-border bg-background">
        <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 pt-8 pb-6">
          <h1 className="text-3xl font-bold text-foreground">{t.markets.title}</h1>
          <p className="text-muted mt-1">{t.markets.subtitle}</p>
        </div>
      </div>

      <div className="w-full max-w-[1800px] mx-auto px-6 lg:px-10 py-6">
        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2.5 flex-1 max-w-md bg-card border border-border rounded-xl px-4 py-2.5 focus-within:border-accent/50 transition-colors">
            <Search className="h-4 w-4 text-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.markets.searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted hover:text-foreground hover:border-border-light transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeCategory === cat
                  ? "bg-accent text-white"
                  : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top Movers Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {topMovers.map((pair) => (
            <Link
              key={pair.id}
              href={`/trade/${pair.id}`}
              className="group rounded-2xl bg-card border border-border p-5 hover:border-accent/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 flex items-center justify-center rounded-lg bg-background border border-border text-lg">
                    {pair.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{pair.symbol}</p>
                    <p className="text-xs text-muted">{pair.name}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => toggleFavorite(pair.id, e)}
                  className="text-muted hover:text-yellow-400 transition-colors"
                >
                  <Star
                    className={cn(
                      "h-4 w-4",
                      favorites.has(pair.id) && "fill-yellow-400 text-yellow-400"
                    )}
                  />
                </button>
              </div>
              <p className="text-xl font-bold text-foreground font-mono mb-1">
                {formatCurrency(pair.price)}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex items-center gap-0.5 text-sm font-semibold",
                    pair.change24h >= 0 ? "text-accent" : "text-danger"
                  )}
                >
                  {pair.change24h >= 0 ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {formatPercent(pair.change24h)}
                </span>
                <div className="w-[80px]">
                  <MiniChart
                    data={pair.sparkline}
                    color={pair.change24h >= 0 ? "#00c26f" : "#ef4444"}
                    width={80}
                    height={32}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Market Table */}
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_100px] gap-2 px-5 py-3.5 border-b border-border text-xs font-semibold text-muted uppercase tracking-wider">
            <span className="text-center">#</span>
            <button
              onClick={() => handleSort("name")}
              className="flex items-center hover:text-foreground transition-colors text-left"
            >
              {t.markets.name}
              <SortIcon field="name" />
            </button>
            <button
              onClick={() => handleSort("price")}
              className="flex items-center justify-end hover:text-foreground transition-colors"
            >
              {t.markets.price}
              <SortIcon field="price" />
            </button>
            <button
              onClick={() => handleSort("change")}
              className="flex items-center justify-end hover:text-foreground transition-colors"
            >
              {t.markets.change24h}
              <SortIcon field="change" />
            </button>
            <button
              onClick={() => handleSort("volume")}
              className="flex items-center justify-end hover:text-foreground transition-colors"
            >
              {t.markets.volume24h}
              <SortIcon field="volume" />
            </button>
            <button
              onClick={() => handleSort("marketCap")}
              className="flex items-center justify-end hover:text-foreground transition-colors"
            >
              {t.markets.marketCap}
              <SortIcon field="marketCap" />
            </button>
            <span className="text-right">{t.markets.chart}</span>
          </div>

          {/* Table Body */}
          {filteredPairs.map((pair, i) => (
            <motion.div
              key={pair.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.015 }}
            >
              <Link
                href={`/trade/${pair.id}`}
                className="grid grid-cols-[60px_minmax(200px,2fr)_minmax(120px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_minmax(130px,1fr)_100px] gap-2 items-center px-5 py-4 border-b border-border/50 hover:bg-card-hover transition-colors group"
              >
                {/* Rank */}
                <span className="text-sm text-muted text-center">{i + 1}</span>

                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={(e) => toggleFavorite(pair.id, e)}
                    className="shrink-0 text-muted hover:text-yellow-400 transition-colors"
                  >
                    <Star
                      className={cn(
                        "h-3.5 w-3.5",
                        favorites.has(pair.id) && "fill-yellow-400 text-yellow-400"
                      )}
                    />
                  </button>
                  <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg bg-background border border-border text-base">
                    {pair.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">
                      {pair.symbol}
                    </p>
                    <p className="text-xs text-muted truncate">{pair.name}</p>
                  </div>
                </div>

                {/* Price */}
                <p className="text-sm font-semibold text-foreground font-mono text-right">
                  {formatCurrency(pair.price)}
                </p>

                {/* 24h Change */}
                <div className="flex items-center justify-end">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-sm font-semibold",
                      pair.change24h >= 0 ? "text-accent" : "text-danger"
                    )}
                  >
                    {pair.change24h >= 0 ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDownRight className="h-3.5 w-3.5" />
                    )}
                    {formatPercent(pair.change24h)}
                  </span>
                </div>

                {/* 24h Volume */}
                <p className="text-sm text-foreground font-mono text-right">
                  ${formatNumber(pair.volume24h)}
                </p>

                {/* Market Cap */}
                <p className="text-sm text-foreground font-mono text-right">
                  ${formatNumber(pair.marketCap)}
                </p>

                {/* Chart */}
                <div className="flex justify-end">
                  <MiniChart
                    data={pair.sparkline}
                    color={pair.change24h >= 0 ? "#00c26f" : "#ef4444"}
                    width={70}
                    height={28}
                  />
                </div>
              </Link>
            </motion.div>
          ))}

          {filteredPairs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted">
              <Search className="h-10 w-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs mt-1">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

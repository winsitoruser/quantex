"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Newspaper,
  Bookmark,
  Share2,
  Rss,
} from "lucide-react";
import { newsArticles, newsCategories } from "@/data/newsData";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = newsArticles.filter((a) => a.featured);
  const filteredArticles = useMemo(() => {
    return newsArticles.filter((article) => {
      const matchSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = activeCategory === "All" || article.category === activeCategory;
      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-cyan/[0.03]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
                <Rss className="h-3.5 w-3.5" />
                Crypto News
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">Latest Crypto News</h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mb-8 max-w-lg">
                Stay informed with breaking news, market analysis, and expert insights from the cryptocurrency world.
              </p>

              {/* Search */}
              <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-accent/40 transition-colors max-w-xl">
                <Search className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search news..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                />
              </div>
            </motion.div>

            {/* Market Pulse */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Fear & Greed", value: "76", status: "Greed" },
                  { label: "BTC Dom.", value: "52.4%", status: "Rising" },
                  { label: "Market Cap", value: "$3.45T", status: "+2.1%" },
                  { label: "24h Volume", value: "$148B", status: "+8.5%" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl bg-card border border-border p-4 lg:p-5">
                    <p className="text-[11px] text-muted mb-1">{item.label}</p>
                    <p className="text-xl font-bold text-foreground font-mono">{item.value}</p>
                    <p className="text-xs text-accent font-medium mt-0.5">{item.status}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Story */}
      {search === "" && activeCategory === "All" && featured[0] && (
        <section className="py-12 border-t border-border">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Featured Story</h2>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-card border border-border overflow-hidden hover:border-accent/30 transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-48 lg:h-auto bg-gradient-to-br from-accent/10 via-card-hover to-purple/10 flex items-center justify-center relative">
                  <Newspaper className="h-16 w-16 text-muted/20" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/90 text-background text-xs font-bold">
                    Featured
                  </span>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-3 text-xs text-muted">
                    <span className="px-2 py-0.5 rounded-full bg-background border border-border">{featured[0].category}</span>
                    <span>{formatDate(featured[0].date)}</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {featured[0].readTime}</span>
                  </div>
                  <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2">{featured[0].title}</h3>
                  <p className="text-sm text-muted leading-relaxed mb-4">{featured[0].excerpt}</p>
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted hover:text-foreground transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted hover:text-foreground transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* News Feed */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">All News</h2>
          </div>

          {/* Category + Tag Filters */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {newsCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-card"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {["Bitcoin", "ETF", "DeFi", "Layer 2", "AI Tokens", "Regulation", "Solana"].map((tag) => (
              <button
                key={tag}
                className="px-3 py-1.5 rounded-full bg-background border border-border text-xs text-muted whitespace-nowrap hover:text-accent hover:border-accent/30 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-xl bg-card border border-border overflow-hidden hover:border-accent/30 transition-colors"
              >
                <div className="h-36 bg-gradient-to-br from-card-hover to-border flex items-center justify-center">
                  <Newspaper className="h-8 w-8 text-muted/20" />
                </div>
                <div className="p-4 lg:p-5">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted">
                    <span className="px-2 py-0.5 rounded-full bg-background border border-border">{article.category}</span>
                    <span>{article.source}</span>
                  </div>
                  <h3 className="text-sm font-bold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-xs text-muted line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {article.readTime} · {formatDate(article.date)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground transition-colors">
                        <Bookmark className="h-3.5 w-3.5" />
                      </button>
                      <button className="h-7 w-7 flex items-center justify-center rounded-lg text-muted hover:text-foreground transition-colors">
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <Newspaper className="h-12 w-12 text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted">No news found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

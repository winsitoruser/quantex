"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  BookOpen,
  Clock,
  ChevronRight,
  Star,
  Users,
  Play,
  GraduationCap,
} from "lucide-react";
import { academyCategories, academyArticles, featuredCourses } from "@/data/academyData";
import { cn } from "@/lib/utils";
import Footer from "@/components/layout/Footer";

const levels = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function AcademyPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevel, setActiveLevel] = useState("All Levels");

  const filteredArticles = useMemo(() => {
    return academyArticles.filter((article) => {
      const matchSearch =
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCategory = activeCategory === "all" || article.category === activeCategory;
      const matchLevel = activeLevel === "All Levels" || article.level === activeLevel.toLowerCase();
      return matchSearch && matchCategory && matchLevel;
    });
  }, [search, activeCategory, activeLevel]);

  const levelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-accent/10 text-accent";
      case "intermediate": return "bg-info/10 text-info";
      case "advanced": return "bg-purple/10 text-purple";
      default: return "bg-muted/10 text-muted";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.05] via-transparent to-purple/[0.03]" />
        <div className="relative mx-auto max-w-[1440px] px-6 lg:px-8 py-12 lg:py-20">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
                <GraduationCap className="h-3.5 w-3.5" />
                Learn & Earn
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground leading-tight mb-4">Crypto Academy</h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mb-8 max-w-lg">
                Master cryptocurrency trading with expert-led courses, in-depth articles, and hands-on tutorials for all skill levels.
              </p>
            </motion.div>

            {/* Search */}
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 focus-within:border-accent/40 transition-colors max-w-xl">
              <Search className="h-4 w-4 text-muted shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles, topics..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {academyCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? "all" : cat.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-colors hover:border-accent/30",
                  activeCategory === cat.id
                    ? "bg-accent/10 border-accent/30"
                    : "bg-card border-border"
                )}
              >
                <div className="text-2xl mb-2">{cat.icon}</div>
                <p className="text-xs font-bold text-foreground">{cat.name}</p>
                <p className="text-[11px] text-accent font-medium">{cat.articleCount} articles</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Featured Courses</h2>
            <button className="text-sm text-accent hover:text-accent-hover flex items-center gap-0.5 font-medium transition-colors">
              View All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCourses.map((course, i) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-card border border-border p-5 hover:border-accent/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelColor(course.level)}`}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-0.5 text-xs text-warning">
                    <Star className="h-3.5 w-3.5" fill="currentColor" />
                    {course.rating}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-3 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Play className="h-3.5 w-3.5" /> {course.lessons}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {(course.enrolled / 1000).toFixed(0)}K</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Articles</h2>
          </div>

          {/* Level Filter */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                  activeLevel === level
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:text-foreground hover:bg-card"
                )}
              >
                {level}
              </button>
            ))}
          </div>

          {/* Desktop grid / Mobile list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  href={`/academy/${article.id}`}
                  className="flex lg:flex-col gap-3 rounded-xl bg-card border border-border p-4 hover:border-accent/30 transition-colors h-full"
                >
                  <div className="h-20 w-20 lg:h-32 lg:w-full shrink-0 rounded-xl bg-gradient-to-br from-card-hover to-border flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${levelColor(article.level)}`}>
                        {article.level}
                      </span>
                      <span className="text-xs text-muted">{article.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5 line-clamp-2">{article.title}</h3>
                    <p className="text-xs text-muted line-clamp-2">{article.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-12 w-12 text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-muted">No articles found.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

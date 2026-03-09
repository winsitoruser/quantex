"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Newspaper,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Clock,
  Tag,
  Star,
  StarOff,
  ExternalLink,
  ArrowUpDown,
  Globe,
  Calendar,
  FileText,
  Image,
  Video,
  XCircle,
} from "lucide-react";
import { newsArticles, newsCategories, type NewsArticle } from "@/data/newsData";
import { cn } from "@/lib/utils";

type ModalMode = "add" | "edit";
type FeaturedFilter = "all" | "featured" | "regular";

export default function BackofficeNewsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Article modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    category: "Bitcoin",
    source: "Quantum News",
    date: new Date().toISOString().split("T")[0],
    readTime: "",
    image: "",
    featured: false,
    tags: "",
  });

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "" });

  // File uploads
  const [newsImagePreview, setNewsImagePreview] = useState<string | null>(null);
  const [newsImageName, setNewsImageName] = useState<string>("");
  const [newsVideoPreview, setNewsVideoPreview] = useState<string | null>(null);
  const [newsVideoName, setNewsVideoName] = useState<string>("");
  const newsImageRef = useRef<HTMLInputElement>(null);
  const newsVideoRef = useRef<HTMLInputElement>(null);

  const handleNewsImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setNewsImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNewsVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewsVideoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setNewsVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearNewsImage = () => { setNewsImagePreview(null); setNewsImageName(""); if (newsImageRef.current) newsImageRef.current.value = ""; };
  const clearNewsVideo = () => { setNewsVideoPreview(null); setNewsVideoName(""); if (newsVideoRef.current) newsVideoRef.current.value = ""; };

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string; type: string } | null>(null);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let arts = newsArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        a.source.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase())
    );
    if (categoryFilter !== "All") arts = arts.filter((a) => a.category === categoryFilter);
    if (featuredFilter === "featured") arts = arts.filter((a) => a.featured);
    if (featuredFilter === "regular") arts = arts.filter((a) => !a.featured);
    return arts;
  }, [search, categoryFilter, featuredFilter]);

  const totalPages = Math.ceil(filteredArticles.length / perPage);
  const paginatedArticles = filteredArticles.slice((page - 1) * perPage, page * perPage);

  // Handlers
  const openAdd = () => {
    setForm({ title: "", excerpt: "", category: "Bitcoin", source: "Quantum News", date: new Date().toISOString().split("T")[0], readTime: "", image: "", featured: false, tags: "" });
    setEditingArticle(null);
    clearNewsImage();
    clearNewsVideo();
    setModalMode("add");
    setModalOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setForm({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      source: article.source,
      date: article.date,
      readTime: article.readTime,
      image: article.image,
      featured: article.featured,
      tags: article.tags.join(", "),
    });
    setEditingArticle(article);
    setModalMode("edit");
    setModalOpen(true);
  };

  // Stats
  const stats = {
    total: newsArticles.length,
    featured: newsArticles.filter((a) => a.featured).length,
    categories: newsCategories.length - 1, // exclude "All"
    sources: [...new Set(newsArticles.map((a) => a.source))].length,
    thisWeek: newsArticles.filter((a) => {
      const d = new Date(a.date);
      const now = new Date();
      return (now.getTime() - d.getTime()) / 86400000 < 7;
    }).length,
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">News Management</h1>
          <p className="text-sm text-muted mt-1">Manage news articles, categories, and featured content</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCatModalOpen(true)}
            className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
          >
            <Tag className="h-4 w-4" />
            Categories
          </button>
          <button
            onClick={openAdd}
            className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Articles", value: stats.total, icon: FileText, color: "text-accent" },
          { label: "Featured", value: stats.featured, icon: Star, color: "text-warning" },
          { label: "Categories", value: stats.categories, icon: Tag, color: "text-info" },
          { label: "Sources", value: stats.sources, icon: Globe, color: "text-purple" },
          { label: "This Week", value: stats.thisWeek, icon: Calendar, color: "text-cyan" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-[10px] text-muted">{s.label}</span>
              </div>
              <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Categories Overview */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Tag className="h-4 w-4 text-info" />
          Category Distribution
        </h3>
        <div className="flex flex-wrap gap-2">
          {newsCategories.filter((c) => c !== "All").map((cat) => {
            const count = newsArticles.filter((a) => a.category === cat).length;
            return (
              <div key={cat} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border">
                <span className="text-xs font-medium text-foreground">{cat}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-md focus-within:border-border-light transition-colors">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by title, tag, source..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            {newsCategories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={featuredFilter}
            onChange={(e) => { setFeaturedFilter(e.target.value as FeaturedFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Articles</option>
            <option value="featured">Featured Only</option>
            <option value="regular">Regular Only</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
              <th className="text-center px-3 py-3 w-10">
                <Star className="h-3.5 w-3.5 mx-auto" />
              </th>
              <th className="text-left px-3 py-3">Article</th>
              <th className="text-left px-3 py-3">Category</th>
              <th className="text-left px-3 py-3">Source</th>
              <th className="text-left px-3 py-3">Date</th>
              <th className="text-left px-3 py-3">Read Time</th>
              <th className="text-left px-3 py-3">Tags</th>
              <th className="text-center px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginatedArticles.map((article, i) => (
              <motion.tr
                key={article.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="hover:bg-card-hover transition-colors"
              >
                <td className="px-3 py-3.5 text-center">
                  <button className={`h-7 w-7 rounded-lg flex items-center justify-center mx-auto transition-colors ${
                    article.featured
                      ? "text-warning bg-warning/10"
                      : "text-muted hover:text-warning hover:bg-warning/10"
                  }`} title={article.featured ? "Remove from Featured" : "Set as Featured"}>
                    {article.featured ? (
                      <Star className="h-3.5 w-3.5" fill="currentColor" />
                    ) : (
                      <StarOff className="h-3.5 w-3.5" />
                    )}
                  </button>
                </td>
                <td className="px-3 py-3.5">
                  <div className="max-w-[300px]">
                    <p className="text-sm font-semibold text-foreground line-clamp-1">{article.title}</p>
                    <p className="text-[10px] text-muted line-clamp-1">{article.excerpt}</p>
                    <p className="text-[9px] text-muted font-mono mt-0.5">{article.id}</p>
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <span className="text-[10px] px-2 py-1 rounded-lg font-medium bg-info/10 text-info">
                    {article.category}
                  </span>
                </td>
                <td className="px-3 py-3.5">
                  <p className="text-xs text-muted">{article.source}</p>
                </td>
                <td className="px-3 py-3.5">
                  <p className="text-xs text-muted">{formatDate(article.date)}</p>
                </td>
                <td className="px-3 py-3.5">
                  <p className="text-xs text-muted flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {article.readTime}
                  </p>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-background border border-border text-muted">
                        {tag}
                      </span>
                    ))}
                    {article.tags.length > 2 && (
                      <span className="text-[9px] text-muted">+{article.tags.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3.5">
                  <div className="flex items-center justify-center gap-1">
                    <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="Preview">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => openEdit(article)}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors" title="Edit"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: article.id, title: article.title, type: "article" })}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredArticles.length)} of {filteredArticles.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                  page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card"
                )}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============ ARTICLE MODAL ============ */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={() => setModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {modalMode === "add" ? "Add News Article" : "Edit News Article"}
                  </h3>
                  <button onClick={() => setModalOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Title *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Article title..." />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Excerpt *</label>
                    <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors resize-none" placeholder="Short description..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none cursor-pointer">
                        {newsCategories.filter((c) => c !== "All").map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Source</label>
                      <input type="text" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="e.g. Quantum News" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Date</label>
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Read Time</label>
                      <input type="text" value={form.readTime} onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="e.g. 4 min" />
                    </div>
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Cover Image *</label>
                    <input type="file" ref={newsImageRef} accept="image/*" onChange={handleNewsImageUpload} className="hidden" />
                    {newsImagePreview ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <img src={newsImagePreview} alt="Preview" className="w-full h-44 object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-[10px] text-white/80 truncate">{newsImageName}</p>
                        </div>
                        <button onClick={clearNewsImage} className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-danger transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => newsImageRef.current?.click()}
                        className="w-full h-44 rounded-xl border-2 border-dashed border-border hover:border-accent/40 bg-background flex flex-col items-center justify-center gap-2 transition-colors group cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                          <Image className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-medium text-foreground">Click to upload cover image</p>
                          <p className="text-[10px] text-muted mt-0.5">PNG, JPG, WebP up to 5MB</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Video (optional)</label>
                    <input type="file" ref={newsVideoRef} accept="video/mp4,video/webm,video/ogg" onChange={handleNewsVideoUpload} className="hidden" />
                    {newsVideoPreview ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <video src={newsVideoPreview} className="w-full h-44 object-cover bg-black" controls />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md truncate max-w-[160px]">{newsVideoName}</span>
                          <button onClick={clearNewsVideo} className="h-7 w-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-danger transition-colors">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => newsVideoRef.current?.click()}
                        className="w-full h-28 rounded-xl border-2 border-dashed border-border hover:border-accent/40 bg-background flex items-center justify-center gap-3 transition-colors group cursor-pointer"
                      >
                        <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                          <Video className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-medium text-foreground">Upload video</p>
                          <p className="text-[10px] text-muted mt-0.5">MP4, WebM, OGG up to 100MB</p>
                        </div>
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Tags (comma separated)</label>
                    <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Bitcoin, ETF, Institutional" />
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border">
                    <button
                      onClick={() => setForm({ ...form, featured: !form.featured })}
                      className="relative"
                    >
                      {form.featured ? (
                        <Star className="h-5 w-5 text-warning" fill="currentColor" />
                      ) : (
                        <StarOff className="h-5 w-5 text-muted" />
                      )}
                    </button>
                    <div>
                      <p className="text-xs font-medium text-foreground">Featured Article</p>
                      <p className="text-[10px] text-muted">Featured articles appear prominently on the news page</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-border">
                  <button onClick={() => setModalOpen(false)} className="flex-1 h-10 rounded-xl bg-card-hover text-foreground text-sm font-medium hover:bg-background transition-colors border border-border">
                    Cancel
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" />
                    {modalMode === "add" ? "Publish Article" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ CATEGORY MANAGEMENT MODAL ============ */}
      <AnimatePresence>
        {catModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={() => setCatModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Manage Categories</h3>
                  <button onClick={() => setCatModalOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Existing Categories */}
                <div className="space-y-2 mb-6">
                  {newsCategories.filter((c) => c !== "All").map((cat) => {
                    const count = newsArticles.filter((a) => a.category === cat).length;
                    return (
                      <div key={cat} className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{cat}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-mono">{count} articles</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors">
                            <Edit3 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => { setCatModalOpen(false); setDeleteTarget({ id: cat, title: cat, type: "category" }); }}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Category */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted mb-2">Add New Category</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={catForm.name}
                      onChange={(e) => setCatForm({ name: e.target.value })}
                      className="flex-1 h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors"
                      placeholder="Category name..."
                    />
                    <button className="h-10 px-4 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-1.5">
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ DELETE CONFIRMATION ============ */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={() => setDeleteTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl p-6"
            >
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-5 w-5 text-danger" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">Delete {deleteTarget.type}?</h3>
                <p className="text-xs text-muted mb-1">Are you sure you want to delete:</p>
                <p className="text-xs font-semibold text-foreground mb-4 line-clamp-2">&quot;{deleteTarget.title}&quot;</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 h-10 rounded-xl bg-card-hover text-foreground text-sm font-medium hover:bg-background transition-colors border border-border">
                    Cancel
                  </button>
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 h-10 rounded-xl bg-danger text-background text-sm font-medium hover:bg-danger-hover transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

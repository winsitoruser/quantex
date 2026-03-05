"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
  Clock,
  Users,
  Star,
  Tag,
  FileText,
  FolderOpen,
  Play,
  ArrowUpDown,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image,
  Video,
  XCircle,
} from "lucide-react";
import {
  academyCategories,
  academyArticles,
  featuredCourses,
  type AcademyArticle,
  type AcademyCategory,
} from "@/data/academyData";
import { cn } from "@/lib/utils";

type Tab = "articles" | "categories" | "courses";
type ModalMode = "add" | "edit";

const levelColors: Record<string, string> = {
  beginner: "bg-accent/10 text-accent",
  intermediate: "bg-info/10 text-info",
  advanced: "bg-purple/10 text-purple",
};

export default function BackofficeAcademyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("articles");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [page, setPage] = useState(1);
  const perPage = 8;

  // Article modal
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [articleModalMode, setArticleModalMode] = useState<ModalMode>("add");
  const [editingArticle, setEditingArticle] = useState<AcademyArticle | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    category: "getting-started",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    readTime: "",
    author: "Quantum Academy",
    tags: "",
    content: "",
    image: "",
  });

  // Category modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [catModalMode, setCatModalMode] = useState<ModalMode>("add");
  const [editingCat, setEditingCat] = useState<AcademyCategory | null>(null);
  const [catForm, setCatForm] = useState({
    name: "",
    icon: "",
    description: "",
    articleCount: 0,
    color: "from-accent to-emerald-400",
  });

  // Course modal
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseModalMode, setCourseModalMode] = useState<ModalMode>("add");
  const [courseForm, setCourseForm] = useState({
    title: "",
    lessons: 0,
    duration: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    enrolled: 0,
    rating: 4.5,
  });

  // File uploads
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setVideoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => { setImagePreview(null); setImageName(""); if (imageInputRef.current) imageInputRef.current.value = ""; };
  const clearVideo = () => { setVideoPreview(null); setVideoName(""); if (videoInputRef.current) videoInputRef.current.value = ""; };

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; title: string } | null>(null);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let arts = academyArticles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        a.id.toLowerCase().includes(search.toLowerCase())
    );
    if (categoryFilter !== "all") arts = arts.filter((a) => a.category === categoryFilter);
    if (levelFilter !== "all") arts = arts.filter((a) => a.level === levelFilter);
    return arts;
  }, [search, categoryFilter, levelFilter]);

  const totalPages = Math.ceil(filteredArticles.length / perPage);
  const paginatedArticles = filteredArticles.slice((page - 1) * perPage, page * perPage);

  // Handlers
  const openAddArticle = () => {
    setArticleForm({ title: "", excerpt: "", category: "getting-started", level: "beginner", readTime: "", author: "Quantum Academy", tags: "", content: "", image: "" });
    setEditingArticle(null);
    clearImage();
    clearVideo();
    setArticleModalMode("add");
    setArticleModalOpen(true);
  };

  const openEditArticle = (article: AcademyArticle) => {
    setArticleForm({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      level: article.level,
      readTime: article.readTime,
      author: article.author,
      tags: article.tags.join(", "),
      content: article.content || "",
      image: article.image,
    });
    setEditingArticle(article);
    setArticleModalMode("edit");
    setArticleModalOpen(true);
  };

  const openAddCategory = () => {
    setCatForm({ name: "", icon: "", description: "", articleCount: 0, color: "from-accent to-emerald-400" });
    setEditingCat(null);
    setCatModalMode("add");
    setCatModalOpen(true);
  };

  const openEditCategory = (cat: AcademyCategory) => {
    setCatForm({ name: cat.name, icon: cat.icon, description: cat.description, articleCount: cat.articleCount, color: cat.color });
    setEditingCat(cat);
    setCatModalMode("edit");
    setCatModalOpen(true);
  };

  const openAddCourse = () => {
    setCourseForm({ title: "", lessons: 0, duration: "", level: "beginner", enrolled: 0, rating: 4.5 });
    setCourseModalMode("add");
    setCourseModalOpen(true);
  };

  // Stats
  const stats = {
    totalArticles: academyArticles.length,
    totalCategories: academyCategories.length,
    totalCourses: featuredCourses.length,
    totalEnrolled: featuredCourses.reduce((s, c) => s + c.enrolled, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Academy Management</h1>
          <p className="text-sm text-muted mt-1">Manage articles, categories, and courses</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Articles", value: stats.totalArticles, icon: FileText, color: "text-accent" },
          { label: "Categories", value: stats.totalCategories, icon: FolderOpen, color: "text-info" },
          { label: "Courses", value: stats.totalCourses, icon: GraduationCap, color: "text-purple" },
          { label: "Total Enrolled", value: stats.totalEnrolled.toLocaleString(), icon: Users, color: "text-warning" },
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

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {([
          { id: "articles" as const, label: "Articles", icon: FileText, count: academyArticles.length },
          { id: "categories" as const, label: "Categories", icon: FolderOpen, count: academyCategories.length },
          { id: "courses" as const, label: "Courses", icon: GraduationCap, count: featuredCourses.length },
        ]).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-card border border-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-background">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* ============ ARTICLES TAB ============ */}
      {activeTab === "articles" && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-md focus-within:border-border-light transition-colors">
              <Search className="h-4 w-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search articles..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Categories</option>
                {academyCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={levelFilter}
                onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
                className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <button
                onClick={openAddArticle}
                className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Article
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Article</th>
                  <th className="text-left px-3 py-3">Category</th>
                  <th className="text-left px-3 py-3">Level</th>
                  <th className="text-left px-3 py-3">Author</th>
                  <th className="text-left px-3 py-3">Read Time</th>
                  <th className="text-left px-3 py-3">Date</th>
                  <th className="text-left px-3 py-3">Tags</th>
                  <th className="text-center px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {paginatedArticles.map((article, i) => {
                  const cat = academyCategories.find((c) => c.id === article.category);
                  return (
                    <motion.tr
                      key={article.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="hover:bg-card-hover transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="max-w-[280px]">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{article.title}</p>
                          <p className="text-[10px] text-muted line-clamp-1">{article.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className="text-xs text-muted flex items-center gap-1">
                          {cat?.icon} {cat?.name || article.category}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${levelColors[article.level]}`}>
                          {article.level}
                        </span>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs text-muted">{article.author}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs text-muted flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <p className="text-xs text-muted">{article.date}</p>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-background border border-border text-muted">{tag}</span>
                          ))}
                          {article.tags.length > 2 && <span className="text-[9px] text-muted">+{article.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3.5">
                        <div className="flex items-center justify-center gap-1">
                          <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="Preview">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditArticle(article)}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors" title="Edit"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ type: "article", id: article.id, title: article.title })}
                            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
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
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors", page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card")}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ CATEGORIES TAB ============ */}
      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{academyCategories.length} categories configured</p>
            <button
              onClick={openAddCategory}
              className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Category
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {academyCategories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-card border border-border p-5 hover:border-border-light transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl">{cat.icon}</div>
                  <span className="text-[10px] font-mono text-muted">{cat.id}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{cat.name}</h3>
                <p className="text-xs text-muted mb-3 line-clamp-2">{cat.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-accent font-medium">{cat.articleCount} articles</span>
                  <div className={`h-4 w-16 rounded-full bg-gradient-to-r ${cat.color} opacity-50`} />
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => openEditCategory(cat)}
                    className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-warning bg-warning/10 hover:bg-warning/20 transition-colors"
                  >
                    <Edit3 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget({ type: "category", id: cat.id, title: cat.name })}
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-danger bg-danger/10 hover:bg-danger/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* ============ COURSES TAB ============ */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{featuredCourses.length} courses available</p>
            <button
              onClick={openAddCourse}
              className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Course
            </button>
          </div>

          <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Course</th>
                  <th className="text-left px-3 py-3">Level</th>
                  <th className="text-center px-3 py-3">Lessons</th>
                  <th className="text-left px-3 py-3">Duration</th>
                  <th className="text-right px-3 py-3">Enrolled</th>
                  <th className="text-center px-3 py-3">Rating</th>
                  <th className="text-center px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {featuredCourses.map((course, i) => (
                  <motion.tr
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-card-hover transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent/20 to-purple/20 flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{course.title}</p>
                          <p className="text-[10px] text-muted font-mono">{course.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${levelColors[course.level]}`}>
                        {course.level}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="text-sm font-medium text-foreground flex items-center justify-center gap-1">
                        <Play className="h-3 w-3 text-muted" /> {course.lessons}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <span className="text-xs text-muted flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                    </td>
                    <td className="px-3 py-4 text-right">
                      <span className="text-sm font-medium text-foreground font-mono">{course.enrolled.toLocaleString()}</span>
                    </td>
                    <td className="px-3 py-4 text-center">
                      <span className="text-xs font-medium text-warning flex items-center justify-center gap-1">
                        <Star className="h-3 w-3" fill="currentColor" /> {course.rating}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="Preview">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors" title="Edit">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget({ type: "course", id: course.id, title: course.title })}
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
        </div>
      )}

      {/* ============ ARTICLE MODAL ============ */}
      <AnimatePresence>
        {articleModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={() => setArticleModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {articleModalMode === "add" ? "Add New Article" : "Edit Article"}
                  </h3>
                  <button onClick={() => setArticleModalOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Title *</label>
                    <input type="text" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Article title..." />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Excerpt *</label>
                    <textarea value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} rows={3}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors resize-none" placeholder="Short description..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Category</label>
                      <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none cursor-pointer">
                        {academyCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Level</label>
                      <select value={articleForm.level} onChange={(e) => setArticleForm({ ...articleForm, level: e.target.value as "beginner" | "intermediate" | "advanced" })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none cursor-pointer">
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Read Time</label>
                      <input type="text" value={articleForm.readTime} onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="e.g. 8 min" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Author</label>
                      <input type="text" value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Author name" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Tags (comma separated)</label>
                    <input type="text" value={articleForm.tags} onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Bitcoin, Trading, Beginner" />
                  </div>

                  {/* Cover Image Upload */}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Cover Image *</label>
                    <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="hidden" />
                    {imagePreview ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-44 object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <p className="text-[10px] text-white/80 truncate">{imageName}</p>
                        </div>
                        <button onClick={clearImage} className="absolute top-2 right-2 h-7 w-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-danger transition-colors">
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => imageInputRef.current?.click()}
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
                    <input type="file" ref={videoInputRef} accept="video/mp4,video/webm,video/ogg" onChange={handleVideoUpload} className="hidden" />
                    {videoPreview ? (
                      <div className="relative rounded-xl border border-border overflow-hidden">
                        <video src={videoPreview} className="w-full h-44 object-cover bg-black" controls />
                        <div className="absolute top-2 right-2 flex items-center gap-1">
                          <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md truncate max-w-[160px]">{videoName}</span>
                          <button onClick={clearVideo} className="h-7 w-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-danger transition-colors">
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => videoInputRef.current?.click()}
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
                    <label className="text-xs font-medium text-muted mb-1.5 block">Content (Markdown)</label>
                    <textarea value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} rows={6}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors resize-none font-mono" placeholder="Write article content in Markdown..." />
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-border">
                  <button onClick={() => setArticleModalOpen(false)} className="flex-1 h-10 rounded-xl bg-card-hover text-foreground text-sm font-medium hover:bg-background transition-colors border border-border">
                    Cancel
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" />
                    {articleModalMode === "add" ? "Create Article" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ CATEGORY MODAL ============ */}
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
                  <h3 className="text-lg font-bold text-foreground">
                    {catModalMode === "add" ? "Add Category" : "Edit Category"}
                  </h3>
                  <button onClick={() => setCatModalOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Name *</label>
                    <input type="text" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Category name" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Icon (emoji)</label>
                      <input type="text" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors text-center text-lg" placeholder="🚀" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Article Count</label>
                      <input type="number" value={catForm.articleCount} onChange={(e) => setCatForm({ ...catForm, articleCount: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors text-center font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Description</label>
                    <input type="text" value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Short description" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Gradient Color</label>
                    <select value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none cursor-pointer">
                      <option value="from-accent to-emerald-400">Green</option>
                      <option value="from-blue-500 to-cyan">Blue</option>
                      <option value="from-purple to-violet-400">Purple</option>
                      <option value="from-pink-500 to-rose-400">Pink</option>
                      <option value="from-warning to-amber-400">Orange</option>
                      <option value="from-cyan to-sky-400">Cyan</option>
                      <option value="from-indigo-500 to-blue-400">Indigo</option>
                      <option value="from-red-500 to-orange-400">Red</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-border">
                  <button onClick={() => setCatModalOpen(false)} className="flex-1 h-10 rounded-xl bg-card-hover text-foreground text-sm font-medium hover:bg-background transition-colors border border-border">
                    Cancel
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" />
                    {catModalMode === "add" ? "Create Category" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ COURSE MODAL ============ */}
      <AnimatePresence>
        {courseModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/60" onClick={() => setCourseModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">
                    {courseModalMode === "add" ? "Add New Course" : "Edit Course"}
                  </h3>
                  <button onClick={() => setCourseModalOpen(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Title *</label>
                    <input type="text" value={courseForm.title} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="Course title" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Level</label>
                    <select value={courseForm.level} onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value as "beginner" | "intermediate" | "advanced" })}
                      className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none cursor-pointer">
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Lessons</label>
                      <input type="number" value={courseForm.lessons} onChange={(e) => setCourseForm({ ...courseForm, lessons: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors text-center font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Duration</label>
                      <input type="text" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors" placeholder="e.g. 3 hours" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Enrolled</label>
                      <input type="number" value={courseForm.enrolled} onChange={(e) => setCourseForm({ ...courseForm, enrolled: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors text-center font-mono" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Rating</label>
                      <input type="number" step="0.1" min="0" max="5" value={courseForm.rating} onChange={(e) => setCourseForm({ ...courseForm, rating: parseFloat(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm text-foreground outline-none focus:border-accent/30 transition-colors text-center font-mono" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-5 mt-5 border-t border-border">
                  <button onClick={() => setCourseModalOpen(false)} className="flex-1 h-10 rounded-xl bg-card-hover text-foreground text-sm font-medium hover:bg-background transition-colors border border-border">
                    Cancel
                  </button>
                  <button className="flex-1 h-10 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" />
                    {courseModalMode === "add" ? "Create Course" : "Save Changes"}
                  </button>
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Bookmark,
  Share2,
  Clock,
  Users,
  Play,
  Check,
  Copy,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  BookOpen,
  Star,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AcademyArticle } from "@/data/academyData";

interface AcademyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: AcademyArticle | null;
}

export default function AcademyDetailModal({ isOpen, onClose, article }: AcademyDetailModalProps) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !article) return null;

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(article.title);
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    console.log(bookmarked ? "Removed bookmark" : "Added bookmark", article.id);
  };

  const levelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-accent/10 text-accent border-accent/30";
      case "intermediate": return "bg-info/10 text-info border-info/30";
      case "advanced": return "bg-purple/10 text-purple border-purple/30";
      default: return "bg-muted/10 text-muted border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric"
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Image */}
          <div className="h-56 lg:h-72 relative overflow-hidden shrink-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-70" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-lg bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors z-10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Meta */}
            <div className="flex items-center gap-3 mb-4 text-xs flex-wrap">
              <span className={cn("px-2.5 py-1 rounded-full border font-medium", levelColor(article.level))}>
                {article.level.charAt(0).toUpperCase() + article.level.slice(1)}
              </span>
              <span className="flex items-center gap-1 text-muted">
                <Clock className="h-3.5 w-3.5" /> {article.readTime}
              </span>
              <span className="text-muted">•</span>
              <span className="text-muted">{formatDate(article.date)}</span>
              <span className="text-muted">•</span>
              <span className="text-muted">{article.author}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl lg:text-2xl font-bold text-foreground mb-4 leading-tight">
              {article.title}
            </h2>

            {/* Tags */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-background border border-border text-xs text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Excerpt */}
            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-sm text-muted leading-relaxed mb-4">
                {article.excerpt}
              </p>
              <h3 className="text-base font-bold text-foreground mt-6 mb-3">What You'll Learn</h3>
              <ul className="text-sm text-muted space-y-2 list-disc list-inside">
                <li>Comprehensive understanding of the topic</li>
                <li>Practical strategies and techniques</li>
                <li>Real-world examples and case studies</li>
                <li>Expert tips and best practices</li>
                <li>Common mistakes to avoid</li>
              </ul>
              <h3 className="text-base font-bold text-foreground mt-6 mb-3">Key Takeaways</h3>
              <p className="text-sm text-muted leading-relaxed">
                By the end of this article, you'll have a solid foundation in the subject matter 
                and be able to apply the concepts to your trading journey. Whether you're a beginner 
                or experienced trader, these insights will help you make more informed decisions.
              </p>
            </div>

            {/* Related Course */}
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 mb-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-accent mb-1">Related Course</p>
                  <p className="text-sm font-medium text-foreground">Complete Trading Masterclass</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted">
                    <span className="flex items-center gap-1"><Play className="h-3 w-3" /> 24 lessons</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 8 hours</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-warning" fill="currentColor" /> 4.9</span>
                  </div>
                </div>
                <button className="h-8 w-8 flex items-center justify-center rounded-lg text-accent hover:bg-accent/10 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="px-6 py-4 border-t border-border bg-surface/50 shrink-0">
            <div className="flex items-center justify-between">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-full left-0 mb-2 bg-elevated border border-border rounded-xl shadow-xl overflow-hidden z-10"
                    >
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors border-t border-border/60"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Copy Link
                        {copied && <Check className="h-3.5 w-3.5 text-accent ml-auto" />}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleBookmark}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                  bookmarked
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "border-border text-text-secondary hover:text-foreground hover:bg-card-hover"
                )}
              >
                <Bookmark className={cn("h-4 w-4", bookmarked && "fill-current")} />
                {bookmarked ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

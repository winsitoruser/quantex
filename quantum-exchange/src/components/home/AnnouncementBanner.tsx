"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronRight, X } from "lucide-react";
import { announcements } from "@/data/mockData";
import { useLanguage } from "@/i18n";

export default function AnnouncementBanner() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-surface/60 border-b border-border/40">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden flex-1">
          <Volume2 className="h-3.5 w-3.5 text-accent shrink-0" />
          <AnimatePresence mode="wait">
            <motion.p
              key={current}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-muted truncate"
            >
              {announcements[current]}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button className="text-xs text-accent hover:text-accent-hover flex items-center gap-0.5 transition-colors">
            {t.home.announcement.more} <ChevronRight className="h-3 w-3" />
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-muted hover:text-foreground transition-colors ml-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

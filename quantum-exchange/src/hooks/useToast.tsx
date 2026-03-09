"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => string;
  removeToast: (id: string) => void;
  success: (message: string, options?: { title?: string; duration?: number }) => string;
  error: (message: string, options?: { title?: string; duration?: number }) => string;
  info: (message: string, options?: { title?: string; duration?: number }) => string;
  warning: (message: string, options?: { title?: string; duration?: number }) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration !== 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      addToast({ type: "success", message, ...options }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      addToast({ type: "error", message, ...options }),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      addToast({ type: "info", message, ...options }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: { title?: string; duration?: number }) =>
      addToast({ type: "warning", message, ...options }),
    [addToast]
  );

  return <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[400px] w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: "bg-accent/10 border-accent/30 text-foreground",
    error: "bg-danger/10 border-danger/30 text-foreground",
    info: "bg-info/10 border-info/30 text-foreground",
    warning: "bg-warning/10 border-warning/30 text-foreground",
  };

  const iconColors = {
    success: "text-accent",
    error: "text-danger",
    info: "text-info",
    warning: "text-warning",
  };

  const Icon = icons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-sm",
        colors[toast.type]
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColors[toast.type])} />
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-foreground mb-0.5">
            {toast.title}
          </p>
        )}
        <p className="text-sm text-muted">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="shrink-0 h-5 w-5 flex items-center justify-center rounded-md text-muted hover:text-foreground hover:bg-background/50 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export default useToast;

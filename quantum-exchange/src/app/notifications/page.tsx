"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Check,
  Trash2,
  Settings,
  TrendingUp,
  Shield,
  Wallet,
  Zap,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";

type NotificationType = "all" | "unread" | "trading" | "security" | "system";
type NotificationPriority = "high" | "medium" | "low";

interface Notification {
  id: string;
  type: "trading" | "security" | "system" | "wallet";
  priority: NotificationPriority;
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "security",
    priority: "high",
    title: "New Login Detected",
    message: "A new login was detected from Chrome on Windows. Location: Jakarta, Indonesia.",
    time: "5 minutes ago",
    read: false,
    icon: Shield,
  },
  {
    id: "2",
    type: "trading",
    priority: "high",
    title: "Order Filled",
    message: "Your BTC/USDT buy order has been filled at $67,234.50. Amount: 0.015 BTC.",
    time: "12 minutes ago",
    read: false,
    icon: TrendingUp,
  },
  {
    id: "3",
    type: "wallet",
    priority: "medium",
    title: "Deposit Confirmed",
    message: "Your USDT deposit of 5,000 USDT has been confirmed and credited to your wallet.",
    time: "1 hour ago",
    read: false,
    icon: Wallet,
  },
  {
    id: "4",
    type: "trading",
    priority: "medium",
    title: "Price Alert: ETH",
    message: "ETH has reached your target price of $3,500. Current price: $3,512.45 (+2.34%).",
    time: "2 hours ago",
    read: true,
    icon: Zap,
  },
  {
    id: "5",
    type: "system",
    priority: "low",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance on March 15, 2026 from 02:00-04:00 UTC. Trading will be temporarily unavailable.",
    time: "3 hours ago",
    read: true,
    icon: Info,
  },
  {
    id: "6",
    type: "trading",
    priority: "medium",
    title: "Stop-Loss Triggered",
    message: "Your SOL/USDT stop-loss order has been triggered at $142.30.",
    time: "5 hours ago",
    read: true,
    icon: TrendingUp,
  },
  {
    id: "7",
    type: "security",
    priority: "high",
    title: "2FA Enabled",
    message: "Two-factor authentication has been successfully enabled on your account.",
    time: "1 day ago",
    read: true,
    icon: Shield,
  },
  {
    id: "8",
    type: "wallet",
    priority: "low",
    title: "Withdrawal Processed",
    message: "Your BTC withdrawal of 0.05 BTC has been processed. Transaction ID: 8f7d2a1b...",
    time: "2 days ago",
    read: true,
    icon: Wallet,
  },
];

const typeColors = {
  trading: "bg-accent/10 text-accent border-accent/20",
  security: "bg-warning/10 text-warning border-warning/20",
  system: "bg-info/10 text-info border-info/20",
  wallet: "bg-purple/10 text-purple border-purple/20",
};

const typeLabels = {
  trading: "Trading",
  security: "Security",
  system: "System",
  wallet: "Wallet",
};

const priorityColors = {
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-muted",
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [activeType, setActiveType] = useState<NotificationType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      const matchesType =
        activeType === "all" ||
        (activeType === "unread" && !notif.read) ||
        notif.type === activeType;

      const matchesSearch =
        searchQuery === "" ||
        notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [notifications, activeType, searchQuery]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const tabs: { id: NotificationType; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "trading", label: "Trading" },
    { id: "security", label: "Security" },
    { id: "system", label: "System" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-accent" />
              Notifications
            </h1>
            <p className="text-sm text-muted mt-1">
              Stay updated with your account activity and market alerts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="h-4 w-4" />
              Mark all read
            </button>
            <button
              onClick={deleteAllRead}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Clear read
            </button>
            <Link
              href="/profile/settings"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border overflow-hidden"
              >
                <Search className="h-4 w-4 text-muted ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center gap-2 p-3 rounded-xl bg-card border border-border text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search notifications...</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveType(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2",
                activeType === tab.id
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-foreground hover:bg-card-hover"
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                    activeType === tab.id
                      ? "bg-accent text-background"
                      : "bg-surface text-muted"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">Total</span>
              <Bell className="h-4 w-4 text-muted" />
            </div>
            <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">Unread</span>
              <AlertCircle className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold text-accent">{unreadCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">High Priority</span>
              <Zap className="h-4 w-4 text-warning" />
            </div>
            <p className="text-2xl font-bold text-warning">
              {notifications.filter((n) => n.priority === "high" && !n.read).length}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted">This Week</span>
              <Clock className="h-4 w-4 text-info" />
            </div>
            <p className="text-2xl font-bold text-info">
              {notifications.filter((n) => {
                const time = n.time.toLowerCase();
                return time.includes("minute") || time.includes("hour") || time.includes("day");
              }).length}
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-muted" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {searchQuery ? "No notifications found" : "No notifications"}
              </h3>
              <p className="text-sm text-muted max-w-sm">
                {searchQuery
                  ? "Try adjusting your search query or filter"
                  : "You're all caught up! Check back later for updates."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-medium transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            filteredNotifications.map((notification, index) => {
              const Icon = notification.icon;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                  className={cn(
                    "group relative p-4 rounded-xl border transition-all duration-200",
                    notification.read
                      ? "bg-card border-border hover:bg-card-hover"
                      : "bg-surface border-accent/30 hover:border-accent/50"
                  )}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        "shrink-0 h-10 w-10 rounded-lg border flex items-center justify-center",
                        typeColors[notification.type]
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4
                              className={cn(
                                "text-sm font-semibold",
                                notification.read ? "text-foreground" : "text-foreground"
                              )}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                            )}
                          </div>
                          <p
                            className={cn(
                              "text-sm line-clamp-2",
                              notification.read ? "text-muted" : "text-text-secondary"
                            )}
                          >
                            {notification.message}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-accent hover:bg-accent/5 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-2">
                        <span
                          className={cn(
                            "text-xs",
                            notification.read ? "text-muted" : "text-accent"
                          )}
                        >
                          {notification.time}
                        </span>
                        <span className="text-xs text-muted">•</span>
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                            typeColors[notification.type]
                          )}
                        >
                          {typeLabels[notification.type]}
                        </span>
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full shrink-0",
                            priorityColors[notification.priority]
                          )}
                          title={`Priority: ${notification.priority}`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

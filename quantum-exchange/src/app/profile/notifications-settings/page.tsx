"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  TrendingUp,
  Shield,
  Info,
  Wallet,
  Clock,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type NotificationChannel = "inApp" | "email" | "push" | "sms";
type NotificationCategory = "trading" | "security" | "wallet" | "system" | "marketing";

interface NotificationPreference {
  category: NotificationCategory;
  enabled: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface QuietHours {
  enabled: boolean;
  startTime: string;
  endTime: string;
}

const defaultPreferences: NotificationPreference[] = [
  {
    category: "trading",
    enabled: true,
    channels: { inApp: true, email: true, push: true, sms: false },
  },
  {
    category: "security",
    enabled: true,
    channels: { inApp: true, email: true, push: true, sms: true },
  },
  {
    category: "wallet",
    enabled: true,
    channels: { inApp: true, email: true, push: true, sms: false },
  },
  {
    category: "system",
    enabled: true,
    channels: { inApp: true, email: true, push: false, sms: false },
  },
  {
    category: "marketing",
    enabled: false,
    channels: { inApp: false, email: false, push: false, sms: false },
  },
];

const categoryInfo = {
  trading: {
    icon: TrendingUp,
    label: "Trading Notifications",
    description: "Order fills, price alerts, trade executions",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  security: {
    icon: Shield,
    label: "Security Alerts",
    description: "Login attempts, 2FA changes, withdrawals",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  wallet: {
    icon: Wallet,
    label: "Wallet Activity",
    description: "Deposits, withdrawals, balance updates",
    color: "text-purple",
    bgColor: "bg-purple/10",
    borderColor: "border-purple/30",
  },
  system: {
    icon: Info,
    label: "System Updates",
    description: "Maintenance, new features, announcements",
    color: "text-info",
    bgColor: "bg-info/10",
    borderColor: "border-info/30",
  },
  marketing: {
    icon: Gift,
    label: "Promotions & Marketing",
    description: "Special offers, new listings, campaigns",
    color: "text-danger",
    bgColor: "bg-danger/10",
    borderColor: "border-danger/30",
  },
};

const channelInfo = {
  inApp: { icon: Bell, label: "In-App", description: "Browser notifications" },
  email: { icon: Mail, label: "Email", description: "Email notifications" },
  push: { icon: Smartphone, label: "Push", description: "Mobile push notifications" },
  sms: { icon: MessageSquare, label: "SMS", description: "Text message notifications" },
};

import { Gift } from "lucide-react";

export default function NotificationSettingsPage() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<NotificationPreference[]>(defaultPreferences);
  const [quietHours, setQuietHours] = useState<QuietHours>({
    enabled: false,
    startTime: "22:00",
    endTime: "08:00",
  });
  const [priceAlertThreshold, setPriceAlertThreshold] = useState<string>("5");
  const [hasChanges, setHasChanges] = useState(false);

  const toggleCategory = (category: NotificationCategory) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.category === category
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
    setHasChanges(true);
  };

  const toggleChannel = (
    category: NotificationCategory,
    channel: NotificationChannel
  ) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.category === category
          ? { ...pref, channels: { ...pref.channels, [channel]: !pref.channels[channel] } }
          : pref
      )
    );
    setHasChanges(true);
  };

  const toggleAllChannels = (category: NotificationCategory, enabled: boolean) => {
    setPreferences((prev) =>
      prev.map((pref) =>
        pref.category === category
          ? { ...pref, channels: { inApp: enabled, email: enabled, push: enabled, sms: enabled } }
          : pref
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving preferences:", { preferences, quietHours, priceAlertThreshold });
    setHasChanges(false);
  };

  const handleReset = () => {
    setPreferences(defaultPreferences);
    setQuietHours({ enabled: false, startTime: "22:00", endTime: "08:00" });
    setPriceAlertThreshold("5");
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1024px] px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/notifications"
            className="h-9 w-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="h-6 w-6 text-accent" />
              Notification Settings
            </h1>
            <p className="text-sm text-muted mt-1">
              Customize how and when you receive notifications
            </p>
          </div>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-accent">
                You have unsaved changes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Notification Categories */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Notification Categories
            </h2>
            <div className="space-y-4">
              {preferences.map((pref) => {
                const info = categoryInfo[pref.category];
                const Icon = info.icon;

                return (
                  <motion.div
                    key={pref.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "rounded-xl border transition-all duration-200",
                      pref.enabled
                        ? cn("bg-card", info.borderColor)
                        : "bg-card border-border opacity-70"
                    )}
                  >
                    {/* Category Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border/40">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            info.bgColor,
                            info.color
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {info.label}
                          </h3>
                          <p className="text-xs text-muted mt-0.5">
                            {info.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleAllChannels(pref.category, !pref.enabled)}
                          disabled={!pref.enabled}
                          className="text-xs text-accent hover:text-accent-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Enable all
                        </button>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pref.enabled}
                            onChange={() => toggleCategory(pref.category)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                        </label>
                      </div>
                    </div>

                    {/* Channel Toggles */}
                    {pref.enabled && (
                      <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                        {(Object.keys(pref.channels) as NotificationChannel[]).map((channel) => {
                          const channelData = channelInfo[channel];
                          const ChannelIcon = channelData.icon;

                          return (
                            <label
                              key={channel}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                                pref.channels[channel]
                                  ? cn("bg-accent/5", info.borderColor, info.color)
                                  : "bg-surface border-border hover:border-accent/30"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={pref.channels[channel]}
                                onChange={() => toggleChannel(pref.category, channel)}
                                className="sr-only"
                              />
                              <div
                                className={cn(
                                  "h-8 w-8 rounded-md flex items-center justify-center",
                                  pref.channels[channel]
                                    ? cn("bg-accent/10", info.color)
                                    : "bg-background"
                                )}
                              >
                                <ChannelIcon className="h-4 w-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-xs font-medium",
                                    pref.channels[channel] ? "text-foreground" : "text-muted"
                                  )}
                                >
                                  {channelData.label}
                                </p>
                                <p className="text-[10px] text-muted">
                                  {channelData.description}
                                </p>
                              </div>
                              {pref.channels[channel] && (
                                <Check className="h-4 w-4 text-accent shrink-0" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Quiet Hours */}
          <section className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Quiet Hours
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    Schedule when you don't want to receive notifications
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={quietHours.enabled}
                  onChange={(e) => {
                    setQuietHours((prev) => ({ ...prev, enabled: e.target.checked }));
                    setHasChanges(true);
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
              </label>
            </div>

            {quietHours.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center gap-4 pt-4 border-t border-border/40"
              >
                <div className="flex-1">
                  <label className="block text-xs text-muted mb-1.5">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={quietHours.startTime}
                    onChange={(e) => {
                      setQuietHours((prev) => ({ ...prev, startTime: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-muted mb-1.5">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={quietHours.endTime}
                    onChange={(e) => {
                      setQuietHours((prev) => ({ ...prev, endTime: e.target.value }));
                      setHasChanges(true);
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </section>

          {/* Price Alert Threshold */}
          <section className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Price Alert Threshold
                </h3>
                <p className="text-xs text-muted mb-3">
                  Get notified when price changes by this percentage
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={priceAlertThreshold}
                    onChange={(e) => {
                      setPriceAlertThreshold(e.target.value);
                      setHasChanges(true);
                    }}
                    className="flex-1 h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                  />
                  <div className="w-16 px-3 py-2 rounded-lg bg-surface border border-border text-center">
                    <span className="text-sm font-semibold text-foreground">
                      {priceAlertThreshold}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          {!hasChanges && (
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

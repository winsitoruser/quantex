"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  Smartphone,
  Mail,
  Phone,
  Globe,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  Copy,
  Check,
  X,
  LogOut,
  Laptop,
  MapPin,
  Calendar,
  Bell,
  ShieldCheck,
  Fingerprint,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";
import Link from "next/link";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";

type SecurityTab = "overview" | "authentication" | "devices" | "activity";

interface SecurityItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  status: "enabled" | "disabled" | "pending" | "verified";
  action?: () => void;
}

interface DeviceSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  current: boolean;
}

interface LoginHistory {
  id: string;
  timestamp: string;
  device: string;
  browser: string;
  location: string;
  ip: string;
  status: "success" | "failed" | "blocked";
}

const mockSecurityItems: SecurityItem[] = [
  {
    id: "email",
    icon: Mail,
    label: "Email Verification",
    description: "Verify your email address for account security",
    status: "verified",
  },
  {
    id: "phone",
    icon: Phone,
    label: "Phone Verification",
    description: "Add phone number for 2FA and recovery",
    status: "verified",
  },
  {
    id: "2fa",
    icon: Smartphone,
    label: "Two-Factor Authentication",
    description: "Add an extra layer of security to your account",
    status: "enabled",
  },
  {
    id: "password",
    icon: Lock,
    label: "Login Password",
    description: "Keep your password strong and unique",
    status: "verified",
  },
  {
    id: "fund",
    icon: Key,
    label: "Fund Password",
    description: "Required for withdrawals and transfers",
    status: "enabled",
  },
  {
    id: "anti-phishing",
    icon: Shield,
    label: "Anti-Phishing Code",
    description: "Unique code in all official emails",
    status: "disabled",
  },
  {
    id: "whitelist",
    icon: ShieldCheck,
    label: "Withdrawal Whitelist",
    description: "Only withdraw to trusted addresses",
    status: "disabled",
  },
  {
    id: "biometric",
    icon: Fingerprint,
    label: "Biometric Authentication",
    description: "Use fingerprint or face recognition",
    status: "disabled",
  },
];

const mockDevices: DeviceSession[] = [
  {
    id: "1",
    device: "Windows PC",
    browser: "Chrome 121.0",
    location: "Jakarta, Indonesia",
    ip: "182.23.45.67",
    lastActive: "Now",
    current: true,
  },
  {
    id: "2",
    device: "iPhone 15 Pro",
    browser: "Safari 17.0",
    location: "Jakarta, Indonesia",
    ip: "182.23.45.68",
    lastActive: "2 hours ago",
    current: false,
  },
  {
    id: "3",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    location: "Singapore",
    ip: "103.45.67.89",
    lastActive: "3 days ago",
    current: false,
  },
];

const mockLoginHistory: LoginHistory[] = [
  {
    id: "1",
    timestamp: "2026-03-09T10:30:00Z",
    device: "Windows PC",
    browser: "Chrome 121.0",
    location: "Jakarta, Indonesia",
    ip: "182.23.45.67",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2026-03-09T08:15:00Z",
    device: "iPhone 15 Pro",
    browser: "Safari 17.0",
    location: "Jakarta, Indonesia",
    ip: "182.23.45.68",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2026-03-08T22:45:00Z",
    device: "Unknown Device",
    browser: "Firefox 122.0",
    location: "Moscow, Russia",
    ip: "45.67.89.123",
    status: "blocked",
  },
  {
    id: "4",
    timestamp: "2026-03-08T14:20:00Z",
    device: "Windows PC",
    browser: "Chrome 121.0",
    location: "Jakarta, Indonesia",
    ip: "182.23.45.67",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2026-03-07T19:30:00Z",
    device: "MacBook Pro",
    browser: "Safari 17.0",
    location: "Singapore",
    ip: "103.45.67.89",
    status: "failed",
  },
];

export default function SecurityPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SecurityTab>("overview");
  const [securityItems, setSecurityItems] = useState<SecurityItem[]>(mockSecurityItems);
  const [devices, setDevices] = useState<DeviceSession[]>(mockDevices);
  
  // Modal states
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAntiPhishingModal, setShowAntiPhishingModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);

  const handleToggle2FA = () => {
    const item = securityItems.find((i) => i.id === "2fa");
    if (item) {
      setSecurityItems((prev) =>
        prev.map((i) =>
          i.id === "2fa"
            ? { ...i, status: i.status === "enabled" ? "disabled" : "enabled" }
            : i
        )
      );
    }
    setShow2FAModal(false);
  };

  const handleRevokeDevice = (deviceId: string) => {
    setConfirmAction({
      title: "Revoke Device Access",
      description: "This will log out the device and require re-authentication.",
      onConfirm: () => {
        setDevices((prev) => prev.filter((d) => d.id !== deviceId));
        setShowConfirmDialog(false);
      },
    });
    setShowConfirmDialog(true);
  };

  const handleEnableAntiPhishing = (code: string) => {
    setSecurityItems((prev) =>
      prev.map((i) =>
        i.id === "anti-phishing"
          ? { ...i, status: "enabled" as const }
          : i
      )
    );
    setShowAntiPhishingModal(false);
  };

  const tabs = [
    { id: "overview" as SecurityTab, label: "Overview", icon: Shield },
    { id: "authentication" as SecurityTab, label: "Authentication", icon: Lock },
    { id: "devices" as SecurityTab, label: "Devices", icon: Laptop },
    { id: "activity" as SecurityTab, label: "Activity", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1024px] px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/profile"
            className="h-9 w-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6 text-accent" />
              Security Center
            </h1>
            <p className="text-sm text-muted mt-1">
              Manage your account security settings and monitor activity
            </p>
          </div>
        </div>

        {/* Security Score */}
        <div className="rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/30 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <svg className="h-20 w-20 -rotate-90">
                  <circle
                    className="text-surface"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                  />
                  <circle
                    className="text-accent"
                    strokeWidth="8"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * 75) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="32"
                    cx="40"
                    cy="40"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-foreground">75%</span>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Security Score</h3>
                <p className="text-sm text-muted mt-1">
                  Complete more security tasks to improve your score
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-accent flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    6 of 8 completed
                  </span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors">
              Improve Score
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-card border border-border overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                  activeTab === tab.id
                    ? "bg-accent text-background shadow-sm"
                    : "text-text-secondary hover:text-foreground hover:bg-surface"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {securityItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-card border border-border p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center",
                            item.status === "enabled" || item.status === "verified"
                              ? "bg-accent/10 text-accent"
                              : item.status === "disabled"
                              ? "bg-surface text-muted"
                              : "bg-warning/10 text-warning"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            {item.label}
                          </h4>
                          <p className="text-xs text-muted mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-xs font-semibold",
                            item.status === "enabled" || item.status === "verified"
                              ? "bg-accent/10 text-accent"
                              : item.status === "disabled"
                              ? "bg-surface text-muted border border-border"
                              : "bg-warning/10 text-warning"
                          )}
                        >
                          {item.status === "enabled" || item.status === "verified"
                            ? item.status === "verified"
                              ? "Verified"
                              : "Enabled"
                            : item.status === "disabled"
                            ? "Disabled"
                            : "Pending"}
                        </span>
                        <button
                          onClick={() => {
                            if (item.id === "2fa") setShow2FAModal(true);
                            if (item.id === "password") setShowPasswordModal(true);
                            if (item.id === "anti-phishing") setShowAntiPhishingModal(true);
                          }}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            item.status === "enabled" || item.status === "verified"
                              ? "bg-surface border border-border text-text-secondary hover:text-foreground hover:bg-card-hover"
                              : "bg-accent hover:bg-accent-hover text-background"
                          )}
                        >
                          {item.status === "enabled" || item.status === "verified"
                            ? "Manage"
                            : "Enable"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Authentication Tab */}
          {activeTab === "authentication" && (
            <motion.div
              key="authentication"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Password Section */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" />
                  Password Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <Lock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Login Password
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Last changed 30 days ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Fund Password
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Required for withdrawals
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors">
                      Manage
                    </button>
                  </div>
                </div>
              </section>

              {/* 2FA Section */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-warning" />
                  Two-Factor Authentication
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Google Authenticator
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Generate 2FA codes on your phone
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={true}
                        onChange={() => setShow2FAModal(true)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Email Verification
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Receive verification codes via email
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={true}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          SMS Verification
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Receive verification codes via SMS
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={false}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Anti-Phishing */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-info" />
                  Anti-Phishing Protection
                </h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Anti-Phishing Code
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Personal code shown in all official emails
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAntiPhishingModal(true)}
                    className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                  >
                    Set Up
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {/* Devices Tab */}
          {activeTab === "devices" && (
            <motion.div
              key="devices"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-accent" />
                    Active Devices & Sessions
                  </h3>
                  <button className="text-xs text-accent hover:text-accent-hover font-medium">
                    Refresh
                  </button>
                </div>
                <div className="space-y-3">
                  {devices.map((device, index) => (
                    <motion.div
                      key={device.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 rounded-lg border flex items-center justify-between",
                        device.current
                          ? "bg-accent/5 border-accent/30"
                          : "bg-surface border-border"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            device.current
                              ? "bg-accent/10 text-accent"
                              : "bg-background text-muted"
                          )}
                        >
                          <Laptop className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">
                              {device.device}
                            </p>
                            {device.current && (
                              <span className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[10px] font-semibold">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {device.browser}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {device.location}
                            </span>
                          </div>
                          <p className="text-xs text-muted mt-1 font-mono">
                            IP: {device.ip}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs text-muted">Last active</p>
                          <p className="text-sm font-medium text-foreground">
                            {device.lastActive}
                          </p>
                        </div>
                        {!device.current && (
                          <button
                            onClick={() => handleRevokeDevice(device.id)}
                            className="h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-danger hover:bg-danger/5 transition-colors"
                            title="Revoke access"
                          >
                            <LogOut className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl bg-warning/5 border border-warning/30 p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Security Tip
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      If you see any devices you don't recognize, revoke their access immediately and change your password.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tab */}
          {activeTab === "activity" && (
            <motion.div
              key="activity"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-info" />
                    Recent Login Activity
                  </h3>
                  <button className="text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Refresh
                  </button>
                </div>
                <div className="space-y-3">
                  {mockLoginHistory.map((activity, index) => {
                    const statusColors = {
                      success: { bg: "bg-accent/10", text: "text-accent", label: "Success" },
                      failed: { bg: "bg-warning/10", text: "text-warning", label: "Failed" },
                      blocked: { bg: "bg-danger/10", text: "text-danger", label: "Blocked" },
                    };
                    const status = statusColors[activity.status];

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-lg bg-surface border border-border"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "h-10 w-10 rounded-lg flex items-center justify-center",
                                activity.status === "success"
                                  ? "bg-accent/10 text-accent"
                                  : activity.status === "failed"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-danger/10 text-danger"
                              )}
                            >
                              {activity.status === "success" ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : activity.status === "failed" ? (
                                <AlertCircle className="h-5 w-5" />
                              ) : (
                                <Shield className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-foreground">
                                  {activity.device} • {activity.browser}
                                </p>
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-md text-[10px] font-semibold",
                                    status.bg,
                                    status.text
                                  )}
                                >
                                  {status.label}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {activity.location}
                                </span>
                                <span className="font-mono">IP: {activity.ip}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-foreground">
                              {new Date(activity.timestamp).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-muted">
                              {new Date(activity.timestamp).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl bg-info/5 border border-info/30 p-5">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-info shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">
                      Login Notifications
                    </h4>
                    <p className="text-xs text-muted mt-1">
                      You will receive email and SMS notifications for all login attempts. 
                      Contact support if you see any suspicious activity.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2FA Modal */}
      <Modal
        isOpen={show2FAModal}
        onClose={() => setShow2FAModal(false)}
        title="Two-Factor Authentication"
        description="Secure your account with Google Authenticator"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-warning/5 border border-warning/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Important Security Feature
                </p>
                <p className="text-xs text-muted mt-1">
                  2FA adds an extra layer of security to your account. You'll need to enter a code from your authenticator app when logging in.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center py-6">
            <div className="inline-flex h-32 w-32 rounded-xl bg-white p-2 mb-4">
              <div className="w-full h-full bg-gradient-to-br from-accent/20 to-cyan/20 rounded-lg flex items-center justify-center">
                <Smartphone className="h-16 w-16 text-accent" />
              </div>
            </div>
            <p className="text-sm text-muted mb-4">
              Scan this QR code with Google Authenticator app
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted">
              <span>Or enter manually:</span>
              <code className="px-2 py-1 rounded bg-surface border border-border font-mono">
                QXAB CDEF GHIJ KLMN
              </code>
              <button className="h-6 w-6 flex items-center justify-center rounded hover:bg-card-hover transition-colors">
                <Copy className="h-3 w-3" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShow2FAModal(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleToggle2FA}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
            >
              Enable 2FA
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
        description="Create a strong password for your account"
        size="md"
      >
        <ChangePasswordForm onClose={() => setShowPasswordModal(false)} />
      </Modal>

      {/* Anti-Phishing Modal */}
      <Modal
        isOpen={showAntiPhishingModal}
        onClose={() => setShowAntiPhishingModal(false)}
        title="Set Anti-Phishing Code"
        description="Choose a unique code to identify official emails"
        size="sm"
      >
        <AntiPhishingForm 
          onClose={() => setShowAntiPhishingModal(false)}
          onSetCode={handleEnableAntiPhishing}
        />
      </Modal>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmAction?.onConfirm || (() => {})}
        title={confirmAction?.title || "Confirm"}
        description={confirmAction?.description || "Are you sure?"}
        variant="danger"
        confirmText="Revoke"
      />
    </div>
  );
}

// Change Password Form Component
function ChangePasswordForm({ onClose }: { onClose: () => void }) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-muted mb-1.5">
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-muted">Strength:</span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-8 rounded-full bg-accent"></div>
            <div className="h-1.5 w-8 rounded-full bg-accent"></div>
            <div className="h-1.5 w-8 rounded-full bg-accent"></div>
            <div className="h-1.5 w-8 rounded-full bg-surface border border-border"></div>
          </div>
          <span className="text-accent">Strong</span>
        </div>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
            placeholder="Confirm new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
        >
          Change Password
        </button>
      </div>
    </form>
  );
}

// Anti-Phishing Form Component
function AntiPhishingForm({ 
  onClose, 
  onSetCode 
}: { 
  onClose: () => void;
  onSetCode: (code: string) => void;
}) {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetCode(code);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 rounded-xl bg-info/5 border border-info/30">
        <p className="text-xs text-muted">
          Your anti-phishing code will appear in all official emails from Quantum Exchange. This helps you verify that emails are truly from us.
        </p>
      </div>

      <div>
        <label className="block text-xs text-muted mb-1.5">
          Your Anti-Phishing Code
        </label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors text-center tracking-widest font-semibold"
          placeholder="e.g., QUANTUM2024"
          maxLength={16}
          required
        />
        <p className="text-xs text-muted mt-1.5">
          4-16 characters, letters and numbers only
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
        >
          Save Code
        </button>
      </div>
    </form>
  );
}

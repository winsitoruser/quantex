"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Globe,
  Lock,
  Shield,
  Bell,
  Palette,
  CreditCard,
  FileText,
  Key,
  Smartphone,
  Camera,
  Check,
  Save,
  RotateCcw,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowLeft,
  Upload,
  Trash2,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n";
import Link from "next/link";
import { useTheme } from "@/app/ThemeContext";

type SettingsTab = "profile" | "security" | "preferences" | "billing";

export default function ProfileSettingsPage() {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [hasChanges, setHasChanges] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    displayName: "AlexQuantum",
    email: "alex@quantum.exchange",
    phone: "+1 234 567 8900",
    country: "United States",
    timezone: "UTC-5 (Eastern Time)",
    language: "English",
  });

  // Security State
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFA: true,
    antiPhishing: false,
    withdrawalWhitelist: true,
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    theme: theme,
    language: "en",
    currency: "USD",
    decimalPlaces: "2",
    soundEffects: true,
    animations: true,
  });

  const tabs = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "security" as SettingsTab, label: "Security", icon: Shield },
    { id: "preferences" as SettingsTab, label: "Preferences", icon: Globe },
  ];

  const handleSave = () => {
    console.log("Saving settings...", { profile, security, preferences });
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to defaults
    setHasChanges(false);
  };

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
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-sm text-muted mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        {/* Save Bar */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
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
                Discard
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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-card border border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-accent text-background shadow-sm"
                    : "text-text-secondary hover:text-foreground hover:bg-surface"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Profile Picture
                </h3>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-background font-bold text-2xl">
                    AQ
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors">
                      <Camera className="h-4 w-4" />
                      Change
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:text-danger hover:bg-danger/5 transition-colors">
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              </section>

              {/* Personal Info */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Display Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => {
                          setProfile({ ...profile, displayName: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => {
                          setProfile({ ...profile, email: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => {
                          setProfile({ ...profile, phone: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Country
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <select
                        value={profile.country}
                        onChange={(e) => {
                          setProfile({ ...profile, country: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
                      >
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Indonesia</option>
                        <option>Japan</option>
                        <option>Singapore</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => {
                        setProfile({ ...profile, timezone: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
                    >
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC+7 (Jakarta)</option>
                      <option>UTC+9 (Tokyo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Language
                    </label>
                    <select
                      value={profile.language}
                      onChange={(e) => {
                        setProfile({ ...profile, language: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
                    >
                      <option>English</option>
                      <option>Indonesia</option>
                      <option>Japanese</option>
                      <option>Chinese</option>
                    </select>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Change Password */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-accent" />
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={security.currentPassword}
                      onChange={(e) => {
                        setSecurity({ ...security, currentPassword: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={security.newPassword}
                      onChange={(e) => {
                        setSecurity({ ...security, newPassword: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={security.confirmPassword}
                      onChange={(e) => {
                        setSecurity({ ...security, confirmPassword: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                </div>
              </section>

              {/* Security Options */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-warning" />
                  Security Options
                </h3>
                <div className="space-y-4">
                  {/* 2FA */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
                        <Smartphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={security.twoFA}
                        onChange={(e) => {
                          setSecurity({ ...security, twoFA: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  {/* Anti-Phishing */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-info/10 text-info flex items-center justify-center">
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Anti-Phishing Code
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Unique code in all official emails
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={security.antiPhishing}
                        onChange={(e) => {
                          setSecurity({ ...security, antiPhishing: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  {/* Withdrawal Whitelist */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                        <Key className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Withdrawal Address Whitelist
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          Only allow withdrawals to trusted addresses
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={security.withdrawalWhitelist}
                        onChange={(e) => {
                          setSecurity({ ...security, withdrawalWhitelist: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Theme */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-purple" />
                  Theme
                </h3>
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple/10 text-purple flex items-center justify-center">
                      {theme === "dark" ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {theme === "dark" ? "Dark Mode" : "Light Mode"}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Toggle application theme
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                  >
                    Toggle Theme
                  </button>
                </div>
              </section>

              {/* Trading Preferences */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-info" />
                  Trading Preferences
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Display Currency
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => {
                        setPreferences({ ...preferences, currency: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
                    >
                      <option>USD</option>
                      <option>IDR</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-muted mb-1.5">
                      Decimal Places
                    </label>
                    <select
                      value={preferences.decimalPlaces}
                      onChange={(e) => {
                        setPreferences({ ...preferences, decimalPlaces: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-surface border border-border text-foreground text-sm outline-none focus:border-accent/50 transition-colors appearance-none"
                    >
                      <option value="2">2 decimals</option>
                      <option value="4">4 decimals</option>
                      <option value="6">6 decimals</option>
                      <option value="8">8 decimals</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* UI Preferences */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  UI Preferences
                </h3>
                <div className="space-y-4">
                  {/* Sound Effects */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Sound Effects
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Play sounds for order fills and alerts
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.soundEffects}
                        onChange={(e) => {
                          setPreferences({ ...preferences, soundEffects: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>

                  {/* Animations */}
                  <div className="flex items-center justify-between p-4 rounded-lg bg-surface border border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Animations
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Enable smooth animations and transitions
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={preferences.animations}
                        onChange={(e) => {
                          setPreferences({ ...preferences, animations: e.target.checked });
                          setHasChanges(true);
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-background peer-focus:outline-none rounded-full peer border border-border peer-checked:bg-accent transition-colors"></div>
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-foreground rounded-full transition-transform peer-checked:translate-x-5"></div>
                    </label>
                  </div>
                </div>
              </section>

              {/* Quick Links */}
              <section className="rounded-xl bg-card border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/profile/notifications-settings"
                    className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors" />
                      <span className="text-sm text-foreground">Notification Settings</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted rotate-180 group-hover:text-accent transition-colors" />
                  </Link>
                  <Link
                    href="/kyc"
                    className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border hover:border-accent/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors" />
                      <span className="text-sm text-foreground">KYC Verification</span>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted rotate-180 group-hover:text-accent transition-colors" />
                  </Link>
                </div>
              </section>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        {!hasChanges && (
          <div className="flex items-center justify-end gap-3 pt-6">
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
  );
}

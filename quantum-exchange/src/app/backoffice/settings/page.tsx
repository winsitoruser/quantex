"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Database,
  Zap,
  Lock,
  Mail,
  ToggleLeft,
  ToggleRight,
  Save,
  RefreshCw,
  AlertTriangle,
  Server,
  Clock,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsTab = "general" | "security" | "trading" | "notifications" | "maintenance";

const tabs = [
  { id: "general" as const, label: "General", icon: Settings },
  { id: "security" as const, label: "Security", icon: Shield },
  { id: "trading" as const, label: "Trading", icon: Zap },
  { id: "notifications" as const, label: "Notifications", icon: Bell },
  { id: "maintenance" as const, label: "Maintenance", icon: Server },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative">
      {enabled ? (
        <ToggleRight className="h-6 w-6 text-accent" />
      ) : (
        <ToggleLeft className="h-6 w-6 text-muted" />
      )}
    </button>
  );
}

function SettingRow({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [settings, setSettings] = useState({
    siteName: "Quantum Exchange",
    siteUrl: "https://quantum.exchange",
    supportEmail: "support@quantum.exchange",
    maintenanceMode: false,
    registrationEnabled: true,
    kycRequired: true,
    twoFactorRequired: false,
    ipWhitelist: true,
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    tradingEnabled: true,
    newListingsPaused: false,
    maxLeverage: 100,
    defaultMakerFee: 0.1,
    defaultTakerFee: 0.15,
    minWithdrawal: 10,
    maxDailyWithdrawal: 1000000,
    withdrawalReviewThreshold: 50000,
    emailAlerts: true,
    slackIntegration: true,
    discordIntegration: false,
    alertHighVolume: true,
    alertSuspiciousLogin: true,
    alertSystemErrors: true,
    autoBackup: true,
    backupFrequency: "6h",
    logRetention: 90,
  });

  const update = (key: string, value: unknown) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-sm text-muted mt-1">Configure platform settings and preferences</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-card border border-transparent"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-border p-6"
      >
        {activeTab === "general" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Globe className="h-4 w-4 text-accent" />
              General Settings
            </h3>
            <p className="text-xs text-muted mb-4">Basic platform configuration</p>

            <SettingRow label="Platform Name" description="Display name of the exchange">
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => update("siteName", e.target.value)}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-64 focus:border-accent/30 transition-colors"
              />
            </SettingRow>
            <SettingRow label="Platform URL" description="Public URL of the exchange">
              <input
                type="text"
                value={settings.siteUrl}
                onChange={(e) => update("siteUrl", e.target.value)}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-64 focus:border-accent/30 transition-colors"
              />
            </SettingRow>
            <SettingRow label="Support Email" description="Customer support email address">
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-64 focus:border-accent/30 transition-colors"
              />
            </SettingRow>
            <SettingRow label="User Registration" description="Allow new user registrations">
              <Toggle enabled={settings.registrationEnabled} onChange={() => update("registrationEnabled", !settings.registrationEnabled)} />
            </SettingRow>
            <SettingRow label="KYC Required" description="Require KYC verification for trading">
              <Toggle enabled={settings.kycRequired} onChange={() => update("kycRequired", !settings.kycRequired)} />
            </SettingRow>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Lock className="h-4 w-4 text-danger" />
              Security Settings
            </h3>
            <p className="text-xs text-muted mb-4">Security and authentication configuration</p>

            <SettingRow label="Mandatory 2FA" description="Require two-factor authentication for all admin accounts">
              <Toggle enabled={settings.twoFactorRequired} onChange={() => update("twoFactorRequired", !settings.twoFactorRequired)} />
            </SettingRow>
            <SettingRow label="IP Whitelist" description="Restrict admin access to whitelisted IPs only">
              <Toggle enabled={settings.ipWhitelist} onChange={() => update("ipWhitelist", !settings.ipWhitelist)} />
            </SettingRow>
            <SettingRow label="Max Login Attempts" description="Lock account after N failed login attempts">
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => update("maxLoginAttempts", parseInt(e.target.value))}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
              />
            </SettingRow>
            <SettingRow label="Session Timeout (min)" description="Auto-logout after minutes of inactivity">
              <input
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => update("sessionTimeout", parseInt(e.target.value))}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
              />
            </SettingRow>
            <SettingRow label="Withdrawal Review Threshold" description="Manual review for withdrawals exceeding this USD amount">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted">$</span>
                <input
                  type="number"
                  value={settings.withdrawalReviewThreshold}
                  onChange={(e) => update("withdrawalReviewThreshold", parseInt(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-32 text-right font-mono focus:border-accent/30 transition-colors"
                />
              </div>
            </SettingRow>
          </div>
        )}

        {activeTab === "trading" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Trading Settings
            </h3>
            <p className="text-xs text-muted mb-4">Configure trading engine parameters</p>

            <SettingRow label="Trading Enabled" description="Enable/disable all trading activities">
              <Toggle enabled={settings.tradingEnabled} onChange={() => update("tradingEnabled", !settings.tradingEnabled)} />
            </SettingRow>
            <SettingRow label="New Listings Paused" description="Pause new token listing activities">
              <Toggle enabled={settings.newListingsPaused} onChange={() => update("newListingsPaused", !settings.newListingsPaused)} />
            </SettingRow>
            <SettingRow label="Max Leverage" description="Maximum leverage for futures trading">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={settings.maxLeverage}
                  onChange={(e) => update("maxLeverage", parseInt(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
                />
                <span className="text-xs text-muted">x</span>
              </div>
            </SettingRow>
            <SettingRow label="Default Maker Fee" description="Default maker fee rate for spot trading">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.01"
                  value={settings.defaultMakerFee}
                  onChange={(e) => update("defaultMakerFee", parseFloat(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
                />
                <Percent className="h-3.5 w-3.5 text-muted" />
              </div>
            </SettingRow>
            <SettingRow label="Default Taker Fee" description="Default taker fee rate for spot trading">
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.01"
                  value={settings.defaultTakerFee}
                  onChange={(e) => update("defaultTakerFee", parseFloat(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
                />
                <Percent className="h-3.5 w-3.5 text-muted" />
              </div>
            </SettingRow>
            <SettingRow label="Min Withdrawal (USD)" description="Minimum withdrawal amount in USD equivalent">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted">$</span>
                <input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => update("minWithdrawal", parseInt(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-right font-mono focus:border-accent/30 transition-colors"
                />
              </div>
            </SettingRow>
            <SettingRow label="Max Daily Withdrawal" description="Maximum daily withdrawal per user in USD">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted">$</span>
                <input
                  type="number"
                  value={settings.maxDailyWithdrawal}
                  onChange={(e) => update("maxDailyWithdrawal", parseInt(e.target.value))}
                  className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-32 text-right font-mono focus:border-accent/30 transition-colors"
                />
              </div>
            </SettingRow>
          </div>
        )}

        {activeTab === "notifications" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Bell className="h-4 w-4 text-info" />
              Notification Settings
            </h3>
            <p className="text-xs text-muted mb-4">Configure alert channels and triggers</p>

            <SettingRow label="Email Alerts" description="Send alerts via email to admin team">
              <Toggle enabled={settings.emailAlerts} onChange={() => update("emailAlerts", !settings.emailAlerts)} />
            </SettingRow>
            <SettingRow label="Slack Integration" description="Send alerts to Slack channel">
              <Toggle enabled={settings.slackIntegration} onChange={() => update("slackIntegration", !settings.slackIntegration)} />
            </SettingRow>
            <SettingRow label="Discord Integration" description="Send alerts to Discord channel">
              <Toggle enabled={settings.discordIntegration} onChange={() => update("discordIntegration", !settings.discordIntegration)} />
            </SettingRow>
            <SettingRow label="High Volume Alerts" description="Alert when withdrawal volume exceeds threshold">
              <Toggle enabled={settings.alertHighVolume} onChange={() => update("alertHighVolume", !settings.alertHighVolume)} />
            </SettingRow>
            <SettingRow label="Suspicious Login Alerts" description="Alert on suspicious login patterns detected">
              <Toggle enabled={settings.alertSuspiciousLogin} onChange={() => update("alertSuspiciousLogin", !settings.alertSuspiciousLogin)} />
            </SettingRow>
            <SettingRow label="System Error Alerts" description="Alert on critical system errors">
              <Toggle enabled={settings.alertSystemErrors} onChange={() => update("alertSystemErrors", !settings.alertSystemErrors)} />
            </SettingRow>
          </div>
        )}

        {activeTab === "maintenance" && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
              <Server className="h-4 w-4 text-purple" />
              Maintenance & System
            </h3>
            <p className="text-xs text-muted mb-4">System maintenance and backup configuration</p>

            <SettingRow label="Maintenance Mode" description="Put the platform in maintenance mode. Users cannot trade.">
              <Toggle enabled={settings.maintenanceMode} onChange={() => update("maintenanceMode", !settings.maintenanceMode)} />
            </SettingRow>
            {settings.maintenanceMode && (
              <div className="py-3 px-4 mb-2 rounded-xl bg-warning/10 border border-warning/20 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
                <p className="text-xs text-warning">Maintenance mode is ON. Users cannot access the platform.</p>
              </div>
            )}
            <SettingRow label="Automatic Backups" description="Enable automatic database backups">
              <Toggle enabled={settings.autoBackup} onChange={() => update("autoBackup", !settings.autoBackup)} />
            </SettingRow>
            <SettingRow label="Backup Frequency" description="How often to run automatic backups">
              <select
                value={settings.backupFrequency}
                onChange={(e) => update("backupFrequency", e.target.value)}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none cursor-pointer"
              >
                <option value="1h">Every 1 hour</option>
                <option value="6h">Every 6 hours</option>
                <option value="12h">Every 12 hours</option>
                <option value="24h">Every 24 hours</option>
              </select>
            </SettingRow>
            <SettingRow label="Log Retention (days)" description="Number of days to retain system logs">
              <input
                type="number"
                value={settings.logRetention}
                onChange={(e) => update("logRetention", parseInt(e.target.value))}
                className="h-9 px-3 rounded-lg bg-background border border-border text-sm text-foreground outline-none w-24 text-center font-mono focus:border-accent/30 transition-colors"
              />
            </SettingRow>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3">Quick Actions</p>
              <div className="flex flex-wrap gap-3">
                <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card-hover border border-border text-sm font-medium text-foreground hover:bg-background transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Clear Cache
                </button>
                <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card-hover border border-border text-sm font-medium text-foreground hover:bg-background transition-colors">
                  <Database className="h-4 w-4" />
                  Manual Backup
                </button>
                <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-card-hover border border-border text-sm font-medium text-foreground hover:bg-background transition-colors">
                  <RefreshCw className="h-4 w-4" />
                  Restart Services
                </button>
                <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-danger/10 border border-danger/20 text-sm font-medium text-danger hover:bg-danger/20 transition-colors">
                  <AlertTriangle className="h-4 w-4" />
                  Emergency Stop
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

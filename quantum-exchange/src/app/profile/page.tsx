"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Globe,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Copy,
  BarChart3,
  TrendingUp,
  Award,
  Smartphone,
  Gift,
} from "lucide-react";
import { userProfile } from "@/data/userData";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(userProfile.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const securityItems = [
    {
      icon: Mail,
      label: "Email Verification",
      value: userProfile.email,
      status: "verified" as const,
    },
    {
      icon: Phone,
      label: "Phone Verification",
      value: userProfile.phone,
      status: "verified" as const,
    },
    {
      icon: Key,
      label: "Two-Factor Auth (2FA)",
      value: userProfile.twoFA ? "Enabled" : "Disabled",
      status: userProfile.twoFA ? ("verified" as const) : ("unverified" as const),
    },
    {
      icon: Shield,
      label: "KYC Verification",
      value: userProfile.kycStatus,
      status: userProfile.kycStatus === "Advanced" ? ("verified" as const) : ("pending" as const),
    },
    {
      icon: Smartphone,
      label: "Anti-Phishing Code",
      value: "Not Set",
      status: "unverified" as const,
    },
  ];

  const statsCards = [
    {
      icon: BarChart3,
      label: "Total Trades",
      value: userProfile.totalTrades.toLocaleString(),
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: TrendingUp,
      label: "Total Volume",
      value: `$${formatNumber(userProfile.totalVolume)}`,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      icon: Award,
      label: "VIP Level",
      value: userProfile.level,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: new Date(userProfile.joinDate).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      color: "text-purple",
      bg: "bg-purple/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
        <p className="text-sm text-muted">
          Manage your account information and security settings
        </p>
      </div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-background font-bold text-2xl shrink-0">
            {userProfile.avatar}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h2 className="text-xl font-bold text-foreground">
                {userProfile.username}
              </h2>
              <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                {userProfile.level}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-info/10 text-info text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                KYC {userProfile.kycStatus}
              </span>
            </div>
            <p className="text-sm text-muted mb-1">{userProfile.email}</p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Clock className="h-3.5 w-3.5" />
              Last login:{" "}
              {new Date(userProfile.lastLogin).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </div>
          </div>
          <button className="px-4 py-2 rounded-xl bg-card-hover border border-border text-sm font-medium text-foreground hover:bg-background transition-colors">
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <div
                className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center mb-3",
                  stat.bg
                )}
              >
                <Icon className={cn("h-4.5 w-4.5", stat.color)} />
              </div>
              <p className="text-xs text-muted mb-1">{stat.label}</p>
              <p className="text-lg font-bold text-foreground">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Security Overview */}
      <div className="rounded-2xl bg-card border border-border">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            Security Overview
          </h3>
        </div>
        <div className="divide-y divide-border/50">
          {securityItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between px-6 py-4 hover:bg-card-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted">{item.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {item.status === "verified" ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-accent">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Verified
                    </span>
                  ) : item.status === "pending" ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-warning">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-muted">
                      <AlertCircle className="h-3.5 w-3.5" />
                      Not Set
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-muted" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trading Fees & Referral */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trading Fees */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            Trading Fees
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <p className="text-xs text-muted">Maker Fee</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {userProfile.tradingFee.maker}%
                </p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                {userProfile.level} Rate
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border">
              <div>
                <p className="text-xs text-muted">Taker Fee</p>
                <p className="text-lg font-bold text-foreground font-mono">
                  {userProfile.tradingFee.taker}%
                </p>
              </div>
              <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs font-medium">
                {userProfile.level} Rate
              </span>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className="rounded-2xl bg-card border border-border p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Gift className="h-4 w-4 text-accent" />
            Referral Program
          </h3>
          <p className="text-xs text-muted mb-4">
            Invite friends and earn up to 40% commission on their trading fees.
          </p>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-background border border-border">
            <Globe className="h-4 w-4 text-muted" />
            <span className="flex-1 text-sm font-mono text-foreground">
              {userProfile.referralCode}
            </span>
            <button
              onClick={handleCopyReferral}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                copied
                  ? "bg-accent/10 text-accent"
                  : "bg-card-hover text-foreground hover:bg-border"
              )}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Referrals", value: "12" },
              { label: "Earnings", value: "$234.56" },
              { label: "Commission", value: "30%" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-lg font-bold text-foreground">
                  {item.value}
                </p>
                <p className="text-xs text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

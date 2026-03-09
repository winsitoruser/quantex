"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gift,
  Trophy,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Check,
  Lock,
  ArrowRight,
  Copy,
  Share2,
  Medal,
  Zap,
  Target,
  Calendar,
  ChevronRight,
  Award,
  Sparkles,
  Flame,
  BarChart3,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { useLanguage, useCurrency } from "@/i18n";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type RewardTab = "overview" | "tasks" | "referral" | "history";
type TaskStatus = "completed" | "in_progress" | "locked";
type TaskDifficulty = "easy" | "medium" | "hard";

interface RewardTask {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: "USDT" | "BTC" | "points";
  status: TaskStatus;
  difficulty: TaskDifficulty;
  progress?: { current: number; target: number };
  icon: React.ComponentType<{ className?: string }>;
  expiryDate?: string;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface RewardHistoryItem {
  id: string;
  type: "task" | "referral" | "trading" | "bonus";
  title: string;
  reward: number;
  rewardType: "USDT" | "BTC" | "points";
  date: string;
  status: "claimed" | "pending";
}

const mockTasks: RewardTask[] = [
  {
    id: "1",
    title: "Complete KYC Verification",
    description: "Verify your identity to unlock full trading features",
    reward: 50,
    rewardType: "USDT",
    status: "completed",
    difficulty: "easy",
    icon: Check,
  },
  {
    id: "2",
    title: "First Deposit Bonus",
    description: "Deposit at least 100 USDT to your spot wallet",
    reward: 20,
    rewardType: "USDT",
    status: "completed",
    difficulty: "easy",
    icon: DollarSign,
  },
  {
    id: "3",
    title: "Trading Volume Challenge",
    description: "Achieve $10,000 in trading volume this month",
    reward: 100,
    rewardType: "USDT",
    status: "in_progress",
    difficulty: "medium",
    progress: { current: 7500, target: 10000 },
    icon: TrendingUp,
    expiryDate: "2026-03-31",
  },
  {
    id: "4",
    title: "Invite 5 Friends",
    description: "Refer 5 friends who complete KYC verification",
    reward: 250,
    rewardType: "USDT",
    status: "in_progress",
    difficulty: "hard",
    progress: { current: 3, target: 5 },
    icon: Users,
  },
  {
    id: "5",
    title: "30-Day Login Streak",
    description: "Log in for 30 consecutive days",
    reward: 0.001,
    rewardType: "BTC",
    status: "in_progress",
    difficulty: "medium",
    progress: { current: 18, target: 30 },
    icon: Calendar,
  },
  {
    id: "6",
    title: "Futures Trading Master",
    description: "Complete 100 futures trades",
    reward: 500,
    rewardType: "USDT",
    status: "locked",
    difficulty: "hard",
    icon: Zap,
  },
  {
    id: "7",
    title: "Enable 2FA Security",
    description: "Secure your account with two-factor authentication",
    reward: 10,
    rewardType: "USDT",
    status: "completed",
    difficulty: "easy",
    icon: Lock,
  },
  {
    id: "8",
    title: "Join Discord Community",
    description: "Join our official Discord server",
    reward: 5,
    rewardType: "USDT",
    status: "locked",
    difficulty: "easy",
    icon: Users,
  },
];

const mockReferralStats: ReferralStats = {
  totalReferrals: 12,
  activeReferrals: 8,
  totalEarnings: 1250.50,
  pendingEarnings: 85.25,
  tier: "Gold",
};

const mockRewardHistory: RewardHistoryItem[] = [
  {
    id: "rh-001",
    type: "task",
    title: "KYC Verification Completed",
    reward: 50,
    rewardType: "USDT",
    date: "2026-03-01",
    status: "claimed",
  },
  {
    id: "rh-002",
    type: "referral",
    title: "Referral: Alex_T signed up",
    reward: 25,
    rewardType: "USDT",
    date: "2026-02-28",
    status: "claimed",
  },
  {
    id: "rh-003",
    type: "trading",
    title: "Monthly Trading Competition - 3rd Place",
    reward: 500,
    rewardType: "USDT",
    date: "2026-02-15",
    status: "claimed",
  },
  {
    id: "rh-004",
    type: "bonus",
    title: "Welcome Bonus",
    reward: 20,
    rewardType: "USDT",
    date: "2026-02-10",
    status: "claimed",
  },
  {
    id: "rh-005",
    type: "referral",
    title: "Referral: Maria_K completed KYC",
    reward: 50,
    rewardType: "USDT",
    date: "2026-02-05",
    status: "pending",
  },
];

const difficultyColors = {
  easy: { bg: "bg-accent/10", border: "border-accent/30", text: "text-accent" },
  medium: { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning" },
  hard: { bg: "bg-danger/10", border: "border-danger/30", text: "text-danger" },
};

const tierColors = {
  Bronze: { bg: "bg-amber-700/20", border: "border-amber-700/50", text: "text-amber-600" },
  Silver: { bg: "bg-gray-400/20", border: "border-gray-400/50", text: "text-gray-400" },
  Gold: { bg: "bg-yellow-500/20", border: "border-yellow-500/50", text: "text-yellow-500" },
  Platinum: { bg: "bg-cyan-400/20", border: "border-cyan-400/50", text: "text-cyan-400" },
};

export default function RewardsPage() {
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState<RewardTab>("overview");
  const [copied, setCopied] = useState(false);
  const [tasks, setTasks] = useState<RewardTask[]>(mockTasks);

  const referralCode = "QXREF2024";
  const referralLink = `https://quantum.exchange/register?ref=${referralCode}`;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const totalRewards = tasks
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.reward, 0);

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimReward = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: "completed" } : t))
    );
  };

  const tabs = [
    { id: "overview" as RewardTab, label: "Overview", icon: BarChart3 },
    { id: "tasks" as RewardTab, label: "Tasks", icon: Target },
    { id: "referral" as RewardTab, label: "Referral", icon: Users },
    { id: "history" as RewardTab, label: "History", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-6 py-6">
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
              <Gift className="h-6 w-6 text-accent" />
              Rewards Center
            </h1>
            <p className="text-sm text-muted mt-1">
              Complete tasks and earn rewards
            </p>
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
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-accent" />
                    <span className="text-xs text-muted">Total Earned</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${formatNumber(totalRewards)}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-warning" />
                    <span className="text-xs text-muted">In Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {inProgressTasks}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-info/10 to-info/5 border border-info/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="h-5 w-5 text-info" />
                    <span className="text-xs text-muted">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {completedTasks}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-gradient-to-br from-purple/10 to-purple/5 border border-purple/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple" />
                    <span className="text-xs text-muted">Referrals</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockReferralStats.totalReferrals}
                  </p>
                </div>
              </div>

              {/* Featured Rewards */}
              <div className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-accent" />
                    Featured Rewards
                  </h3>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className="text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.slice(0, 3).map((task) => {
                    const Icon = task.icon;
                    const colors = difficultyColors[task.difficulty];

                    return (
                      <div
                        key={task.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all hover:scale-[1.02]",
                          task.status === "completed"
                            ? "bg-surface border-border opacity-70"
                            : cn("bg-card", colors.border)
                        )}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div
                            className={cn(
                              "h-10 w-10 rounded-lg flex items-center justify-center",
                              colors.bg,
                              colors.text
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {task.status === "completed" && (
                            <Check className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <h4 className="text-sm font-semibold text-foreground mb-1">
                          {task.title}
                        </h4>
                        <p className="text-xs text-muted mb-3 line-clamp-2">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span
                            className={cn(
                              "text-xs font-bold",
                              task.rewardType === "BTC"
                                ? "text-warning"
                                : "text-accent"
                            )}
                          >
                            +{task.reward} {task.rewardType}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] px-1.5 py-0.5 rounded",
                              colors.bg,
                              colors.text
                            )}
                          >
                            {task.difficulty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Referral Quick Stats */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple" />
                    Referral Program
                  </h3>
                  <button
                    onClick={() => setActiveTab("referral")}
                    className="text-sm text-accent hover:text-accent-hover font-medium flex items-center gap-1"
                  >
                    Manage <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs text-muted mb-1">Total Referrals</p>
                    <p className="text-xl font-bold text-foreground">
                      {mockReferralStats.totalReferrals}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs text-muted mb-1">Active</p>
                    <p className="text-xl font-bold text-accent">
                      {mockReferralStats.activeReferrals}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs text-muted mb-1">Total Earnings</p>
                    <p className="text-xl font-bold text-foreground">
                      ${formatNumber(mockReferralStats.totalEarnings)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-surface border border-border">
                    <p className="text-xs text-muted mb-1">Pending</p>
                    <p className="text-xl font-bold text-warning">
                      ${formatNumber(mockReferralStats.pendingEarnings)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Medal className="h-5 w-5 text-warning" />
                  Your Achievements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Flame, label: "7-Day Streak", unlocked: true },
                    { icon: Star, label: "First Trade", unlocked: true },
                    { icon: Award, label: "VIP Member", unlocked: true },
                    { icon: Zap, label: "Speed Trader", unlocked: false },
                  ].map((achievement, idx) => {
                    const Icon = achievement.icon;
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "p-4 rounded-xl border flex flex-col items-center text-center",
                          achievement.unlocked
                            ? "bg-warning/5 border-warning/30"
                            : "bg-surface border-border opacity-50"
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-8 w-8 mb-2",
                            achievement.unlocked ? "text-warning" : "text-muted"
                          )}
                        />
                        <p
                          className={cn(
                            "text-xs font-medium",
                            achievement.unlocked ? "text-foreground" : "text-muted"
                          )}
                        >
                          {achievement.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Tasks Tab */}
          {activeTab === "tasks" && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {tasks.map((task, index) => {
                const Icon = task.icon;
                const colors = difficultyColors[task.difficulty];

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "rounded-xl border p-5 transition-all",
                      task.status === "completed"
                        ? "bg-surface border-border opacity-70"
                        : cn("bg-card", colors.border)
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                          colors.bg,
                          colors.text
                        )}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-base font-semibold text-foreground">
                              {task.title}
                            </h4>
                            <p className="text-sm text-muted mt-0.5">
                              {task.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p
                              className={cn(
                                "text-lg font-bold",
                                task.rewardType === "BTC"
                                  ? "text-warning"
                                  : "text-accent"
                              )}
                            >
                              +{task.reward} {task.rewardType}
                            </p>
                            <span
                              className={cn(
                                "text-[10px] px-2 py-0.5 rounded",
                                colors.bg,
                                colors.text
                              )}
                            >
                              {task.difficulty}
                            </span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {task.progress && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted">Progress</span>
                              <span className="text-foreground font-medium">
                                {task.progress.current} / {task.progress.target}
                              </span>
                            </div>
                            <div className="h-2 bg-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-accent to-cyan rounded-full transition-all duration-500"
                                style={{
                                  width: `${(task.progress.current / task.progress.target) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted">
                            {task.expiryDate && (
                              <>
                                <Clock className="h-3.5 w-3.5" />
                                Expires: {new Date(task.expiryDate).toLocaleDateString()}
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {task.status === "completed" ? (
                              <button
                                disabled
                                className="px-4 py-2 rounded-lg bg-accent/20 text-accent text-sm font-semibold flex items-center gap-1"
                              >
                                <Check className="h-4 w-4" />
                                Claimed
                              </button>
                            ) : task.status === "in_progress" ? (
                              <button
                                onClick={() => handleClaimReward(task.id)}
                                className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                              >
                                Claim Reward
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-4 py-2 rounded-lg bg-surface border border-border text-muted text-sm font-semibold flex items-center gap-1 cursor-not-allowed"
                              >
                                <Lock className="h-4 w-4" />
                                Locked
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Referral Tab */}
          {activeTab === "referral" && (
            <motion.div
              key="referral"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Tier Card */}
              <div
                className={cn(
                  "rounded-2xl border p-6",
                  tierColors[mockReferralStats.tier].bg,
                  tierColors[mockReferralStats.tier].border
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-16 w-16 rounded-2xl flex items-center justify-center",
                        tierColors[mockReferralStats.tier].bg
                      )}
                    >
                      <Medal
                        className={cn(
                          "h-8 w-8",
                          tierColors[mockReferralStats.tier].text
                        )}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted">Your Tier</p>
                      <h3
                        className={cn(
                          "text-2xl font-bold",
                          tierColors[mockReferralStats.tier].text
                        )}
                      >
                        {mockReferralStats.tier} Referrer
                      </h3>
                      <p className="text-sm text-muted mt-1">
                        {mockReferralStats.totalReferrals} referrals • $
                        {formatNumber(mockReferralStats.totalEarnings)} earned
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="text-right">
                      <p className="text-sm text-muted">Next Tier</p>
                      <p className="text-lg font-semibold text-foreground">
                        {mockReferralStats.tier === "Gold"
                          ? "Platinum"
                          : mockReferralStats.tier === "Silver"
                          ? "Gold"
                          : "Silver"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Referral Link */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Your Referral Link
                </h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 px-4 py-3 rounded-xl bg-surface border border-border text-sm text-muted break-all">
                    {referralLink}
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold flex items-center gap-2 shrink-0 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </button>
                  <div className="text-xs text-muted">
                    Earn up to 50% commission on trading fees
                  </div>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-card border border-border">
                  <p className="text-xs text-muted mb-2">Total Referrals</p>
                  <p className="text-2xl font-bold text-foreground">
                      {mockReferralStats.totalReferrals}
                    </p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <p className="text-xs text-muted mb-2">Active Referrals</p>
                  <p className="text-2xl font-bold text-accent">
                    {mockReferralStats.activeReferrals}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <p className="text-xs text-muted mb-2">Total Earnings</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${formatNumber(mockReferralStats.totalEarnings)}
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-card border border-border">
                  <p className="text-xs text-muted mb-2">Pending</p>
                  <p className="text-2xl font-bold text-warning">
                    ${formatNumber(mockReferralStats.pendingEarnings)}
                  </p>
                </div>
              </div>

              {/* Tier Benefits */}
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Tier Benefits
                </h3>
                <div className="space-y-3">
                  {[
                    { tier: "Bronze", minReferrals: 0, commission: "10%" },
                    { tier: "Silver", minReferrals: 5, commission: "20%" },
                    { tier: "Gold", minReferrals: 10, commission: "30%" },
                    { tier: "Platinum", minReferrals: 25, commission: "50%" },
                  ].map((tier, idx) => (
                    <div
                      key={tier.tier}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-xl border",
                        tier.tier === mockReferralStats.tier
                          ? cn(
                              tierColors[tier.tier as keyof typeof tierColors].bg,
                              tierColors[tier.tier as keyof typeof tierColors].border
                            )
                          : "bg-surface border-border"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center",
                            tierColors[tier.tier as keyof typeof tierColors].bg,
                            tierColors[tier.tier as keyof typeof tierColors].text
                          )}
                        >
                          <Award className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {tier.tier}
                          </p>
                          <p className="text-xs text-muted">
                            {tier.minReferrals}+ referrals
                          </p>
                        </div>
                      </div>
                      <p
                        className={cn(
                          "text-sm font-bold",
                          tier.tier === mockReferralStats.tier
                            ? tierColors[tier.tier as keyof typeof tierColors].text
                            : "text-foreground"
                        )}
                      >
                        {tier.commission} Commission
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {mockRewardHistory.map((item, index) => {
                const typeIcons = {
                  task: Target,
                  referral: Users,
                  trading: TrendingUp,
                  bonus: Gift,
                };
                const Icon = typeIcons[item.type];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-xl bg-card border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted mt-0.5">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-sm font-bold",
                            item.rewardType === "BTC"
                              ? "text-warning"
                              : "text-accent"
                          )}
                        >
                          +{item.reward} {item.rewardType}
                        </p>
                        <p
                          className={cn(
                            "text-[10px]",
                            item.status === "claimed"
                              ? "text-accent"
                              : "text-warning"
                          )}
                        >
                          {item.status === "claimed" ? "Claimed" : "Pending"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

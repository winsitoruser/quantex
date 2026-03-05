"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Wallet,
  History,
  Shield,
  ShieldCheck,
  Settings,
  Gift,
  LogOut,
  ChevronRight,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { userProfile } from "@/data/userData";

const sidebarLinks = [
  { label: "Profile", href: "/profile", icon: User },
  { label: "Assets", href: "/profile/assets", icon: Wallet },
  { label: "History", href: "/profile/history", icon: History },
  { label: "KYC Verification", href: "/kyc", icon: ShieldCheck },
  { label: "Security", href: "/profile/security", icon: Shield },
  { label: "Settings", href: "/profile/settings", icon: Settings },
  { label: "Rewards", href: "/profile/rewards", icon: Gift },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleCopyUID = () => {
    navigator.clipboard.writeText(userProfile.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="rounded-2xl bg-card border border-border p-5 mb-4">
              {/* User Avatar & Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent to-cyan flex items-center justify-center text-background font-bold text-lg">
                  {userProfile.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {userProfile.username}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted font-mono">
                      {userProfile.uid}
                    </span>
                    <button
                      onClick={handleCopyUID}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {copied ? (
                        <CheckCircle2 className="h-3 w-3 text-accent" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Level Badge */}
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold">
                  {userProfile.level}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-info/10 text-info text-xs font-semibold">
                  KYC {userProfile.kycStatus}
                </span>
              </div>

              <div className="h-px bg-border mb-3" />

              {/* Navigation */}
              <nav className="flex flex-col gap-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive
                          ? "bg-accent/10 text-accent"
                          : "text-muted hover:text-foreground hover:bg-card-hover"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                      {isActive && (
                        <ChevronRight className="h-3.5 w-3.5 ml-auto" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-px bg-border my-3" />

              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors w-full">
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}

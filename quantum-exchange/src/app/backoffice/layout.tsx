"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  ShieldCheck,
  ClipboardList,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  Wallet,
  BarChart3,
  AlertTriangle,
  Menu,
  X,
  BookOpen,
  Newspaper,
  TrendingUp,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/backoffice", icon: LayoutDashboard },
  { label: "Users", href: "/backoffice/users", icon: Users },
  { label: "Transactions", href: "/backoffice/transactions", icon: ArrowRightLeft },
  { label: "KYC Verification", href: "/backoffice/kyc", icon: ShieldCheck },
  { label: "Orders", href: "/backoffice/orders", icon: ClipboardList },
  { label: "Wallets", href: "/backoffice/wallets", icon: Wallet },
  { label: "Trading Pairs", href: "/backoffice/pairs", icon: BarChart3 },
  { label: "P2P Trading", href: "/backoffice/p2p", icon: Users },
  { label: "OTC Desk", href: "/backoffice/otc", icon: Building2 },
  { label: "P&L Analytics", href: "/backoffice/pnl", icon: TrendingUp },
  { label: "Academy", href: "/backoffice/academy", icon: BookOpen },
  { label: "News", href: "/backoffice/news", icon: Newspaper },
  { label: "Alerts", href: "/backoffice/alerts", icon: AlertTriangle },
  { label: "Settings", href: "/backoffice/settings", icon: Settings },
];

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/backoffice") return pathname === "/backoffice";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-border">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-cyan shrink-0">
          <Zap className="h-5 w-5 text-background" fill="currentColor" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold leading-tight text-foreground">
              Quantum
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-accent">
              Backoffice
            </span>
          </motion.div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                collapsed && "justify-center px-2",
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted hover:text-foreground hover:bg-card-hover"
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{link.label}</span>}
              {active && !collapsed && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border p-3 space-y-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Back to Exchange" : undefined}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Back to Exchange</span>}
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-300 shrink-0",
          collapsed ? "w-[68px]" : "w-[250px]"
        )}
      >
        <SidebarContent />
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-20 -right-3 z-10 h-6 w-6 flex items-center justify-center rounded-full bg-card border border-border text-muted hover:text-foreground transition-colors hidden lg:flex"
          style={{ left: collapsed ? "55px" : "237px" }}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[250px] flex flex-col border-r border-border bg-card lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 w-72">
              <Search className="h-3.5 w-3.5 text-muted" />
              <input
                type="text"
                placeholder="Search users, transactions, orders..."
                className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative h-9 w-9 flex items-center justify-center rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger animate-pulse" />
            </button>
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple to-info text-background font-bold text-[10px]">
                SA
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-foreground leading-tight">Super Admin</p>
                <p className="text-[10px] text-muted">admin@quantum.exchange</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

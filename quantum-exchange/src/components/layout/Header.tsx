"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Bell,
  User,
  Wallet,
  LayoutDashboard,
  Zap,
  ShieldCheck,
  Settings,
  ChevronDown,
  LogOut,
  Download,
  Globe,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage, useCurrency } from "@/i18n";
import { type Locale, localeFlags, localeNames } from "@/i18n/translations";
import type { CurrencyCode } from "@/i18n/CurrencyContext";

export default function Header() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { locale, setLocale, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();

  const profileRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);

  const locales: Locale[] = ["en", "id", "ja", "zh", "ar"];
  const currencies: CurrencyCode[] = ["USD", "IDR"];

  const navLinks = [
    { label: t.nav.trade, href: "/trade/btc-usdt" },
    { label: t.nav.markets, href: "/markets" },
    { label: t.nav.bots, href: "/bots" },
    { label: t.nav.futures, href: "/futures" },
    { label: t.nav.earn, href: "/earn" },
    { label: t.nav.academy, href: "/academy" },
    { label: t.nav.news, href: "/news" },
    { label: t.nav.wallet, href: "/wallet" },
  ];

  const moreLinks = [
    { label: t.nav.p2p || "P2P Trading", href: "/p2p" },
    { label: t.nav.otc || "OTC Desk", href: "/otc" },
    { label: "Compliance", href: "/compliance" },
  ];

  const closeAll = useCallback(() => {
    setProfileOpen(false);
    setSearchOpen(false);
    setMoreOpen(false);
    setLangOpen(false);
    setMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const isActiveLink = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("/").slice(0, 2).join("/"));
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="mx-auto max-w-[1440px] flex h-14 items-center px-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 mr-6">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-cyan">
            <Zap className="h-4 w-4 text-background" fill="currentColor" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-foreground">Quantum</span>
            <span className="text-[7.5px] font-semibold uppercase tracking-[0.2em] text-accent">Exchange</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-0.5 flex-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded transition-all duration-150",
                isActiveLink(item.href)
                  ? "text-foreground"
                  : "text-text-secondary hover:text-foreground"
              )}
            >
              {item.label}
              {isActiveLink(item.href) && (
                <span className="block h-[2px] bg-accent rounded-full mt-0.5 mx-auto w-4" />
              )}
            </Link>
          ))}

          {/* More dropdown */}
          <div ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded transition-colors",
                moreOpen ? "text-foreground" : "text-text-secondary hover:text-foreground"
              )}
            >
              More
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", moreOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-1.5 w-44 rounded-xl bg-elevated border border-border shadow-2xl shadow-black/40 overflow-hidden py-1"
                >
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-0.5">
          {/* Search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface transition-colors"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="h-9 w-9 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface transition-colors relative"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute top-1 right-1 h-[6px] w-[6px] rounded-full bg-accent ring-2 ring-background" />
          </Link>

          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 h-9 px-2 rounded-lg text-text-secondary hover:text-foreground hover:bg-surface transition-colors"
            >
              <Globe className="h-[18px] w-[18px]" />
              <span className="text-xs font-semibold">{locale.toUpperCase()}</span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1.5 w-48 rounded-xl bg-elevated border border-border shadow-2xl shadow-black/40 overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider">Language</p>
                  </div>
                  <div className="py-0.5">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => { setLocale(loc); setLangOpen(false); }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 text-[13px] transition-colors",
                          locale === loc ? "text-accent bg-accent/5" : "text-text-secondary hover:text-foreground hover:bg-card-hover"
                        )}
                      >
                        {localeFlags[loc]} {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2 border-t border-border/60">
                    <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Currency</p>
                    <div className="flex gap-1">
                      {currencies.map((cur) => (
                        <button
                          key={cur}
                          onClick={() => { setCurrency(cur); setLangOpen(false); }}
                          className={cn(
                            "flex-1 py-1 rounded-md text-[11px] font-semibold text-center transition-colors",
                            currency === cur
                              ? "bg-accent/10 text-accent"
                              : "text-muted bg-surface hover:bg-card-hover"
                          )}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Avatar */}
          <div ref={profileRef} className="relative ml-1">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-accent to-cyan text-background font-bold text-[10px] ring-2 ring-transparent hover:ring-accent/30 transition-all"
            >
              AQ
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-1.5 w-60 rounded-xl bg-elevated border border-border shadow-2xl shadow-black/40 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-border/60">
                    <p className="text-sm font-semibold text-foreground">AlexQuantum</p>
                    <p className="text-[11px] text-muted mt-0.5">QX-78291034</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-1.5 py-0.5 rounded-md bg-accent/10 text-accent text-[9px] font-bold">VIP 1</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-info/10 text-info text-[9px] font-bold">KYC ✓</span>
                    </div>
                  </div>
                  <div className="py-0.5">
                    {[
                      { icon: User, label: t.userMenu.profile, href: "/profile" },
                      { icon: ShieldCheck, label: t.userMenu.kycVerification, href: "/kyc" },
                      { icon: Wallet, label: t.userMenu.assets, href: "/wallet" },
                      { icon: LayoutDashboard, label: t.userMenu.history, href: "/profile/history" },
                      { icon: Settings, label: "Settings", href: "/settings" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-text-secondary hover:text-foreground hover:bg-card-hover transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-border/60 py-0.5">
                    <button className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-danger hover:bg-danger/5 w-full transition-colors">
                      <LogOut className="h-4 w-4" />
                      {t.userMenu.logOut}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* App Download */}
          <Link
            href="#"
            className="ml-2 flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-xs font-bold transition-colors"
          >
            <Download className="h-3 w-3" />
            App
          </Link>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[55] bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[56] w-[280px] bg-elevated border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-[52px] border-b border-border/60 shrink-0">
                <span className="text-sm font-semibold text-foreground">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-foreground hover:bg-surface transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                <div className="px-3">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
                        isActiveLink(item.href)
                          ? "text-accent bg-accent/5"
                          : "text-text-secondary hover:text-foreground hover:bg-surface"
                      )}
                    >
                      {item.label}
                      {isActiveLink(item.href) && (
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      )}
                    </Link>
                  ))}
                </div>

                <div className="px-3 mt-4">
                  <p className="px-3 mb-2 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    {t.nav.more || "More"}
                  </p>
                  {moreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5",
                        isActiveLink(link.href)
                          ? "text-accent bg-accent/5"
                          : "text-text-secondary hover:text-foreground hover:bg-surface"
                      )}
                    >
                      {link.label}
                      <ArrowRight className="h-3.5 w-3.5 opacity-40" />
                    </Link>
                  ))}
                </div>

                <div className="px-3 mt-4">
                  <p className="px-3 mb-2 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    Language &amp; Currency
                  </p>
                  <div className="px-3 py-2">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {locales.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocale(loc)}
                          className={cn(
                            "px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
                            locale === loc
                              ? "bg-accent/10 text-accent border border-accent/20"
                              : "text-muted bg-surface hover:text-foreground border border-transparent"
                          )}
                        >
                          {localeFlags[loc]} {loc.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-1.5">
                      {currencies.map((cur) => (
                        <button
                          key={cur}
                          onClick={() => setCurrency(cur)}
                          className={cn(
                            "flex-1 py-2 rounded-md text-xs font-semibold text-center transition-colors",
                            currency === cur
                              ? "bg-accent/10 text-accent border border-accent/20"
                              : "text-muted bg-surface border border-transparent"
                          )}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-border/60 p-4">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full h-10 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
                >
                  {t.login?.logIn || "Log In"}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full h-10 mt-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-surface transition-colors"
                >
                  {t.register?.createAccount || "Sign Up"}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[10%] sm:top-[12%] left-1/2 -translate-x-1/2 z-[61] w-[calc(100%-2rem)] sm:w-full max-w-[500px] rounded-2xl bg-elevated border border-border shadow-2xl shadow-black/50 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 h-12 border-b border-border/60">
                <Search className="h-4 w-4 text-muted shrink-0" />
                <input
                  type="text"
                  placeholder={t.searchOverlay?.placeholder || "Search coins, pairs, features..."}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
                  autoFocus
                />
                <kbd className="hidden sm:inline text-[9px] text-muted bg-background px-1.5 py-0.5 rounded-md border border-border font-mono">ESC</kbd>
                <button onClick={() => setSearchOpen(false)} className="sm:hidden h-8 w-8 flex items-center justify-center rounded-lg text-muted hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">Popular</p>
                <div className="flex flex-wrap gap-2">
                  {["BTC", "ETH", "SOL", "XRP", "DOGE", "ADA"].map((s) => (
                    <Link
                      key={s}
                      href={`/trade/${s.toLowerCase()}-usdt`}
                      onClick={() => setSearchOpen(false)}
                      className="px-3.5 py-1.5 rounded-lg bg-surface border border-border text-[13px] font-medium text-foreground hover:border-accent/40 hover:bg-card-hover transition-colors"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

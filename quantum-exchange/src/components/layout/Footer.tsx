"use client";

import Link from "next/link";
import { Zap, Twitter, Github, MessageCircle, Send } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    Products: [
      { label: "Spot Trading", href: "/trade/btc-usdt" },
      { label: "Futures", href: "/futures" },
      { label: "Trading Bots", href: "/bots" },
      { label: "Earn", href: "/earn" },
      { label: "P2P Trading", href: "/p2p" },
      { label: "OTC Desk", href: "/otc" },
    ],
    Resources: [
      { label: "Academy", href: "/academy" },
      { label: "News", href: "/news" },
      { label: "Markets", href: "/markets" },
      { label: "API Documentation", href: "#" },
      { label: "Fees", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Compliance", href: "/compliance" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    Support: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-border/40 bg-surface/30">
      <div className="mx-auto max-w-[1440px] px-4 lg:px-6 py-10">
        <div className="grid grid-cols-6 gap-6">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-cyan">
                <Zap className="h-3.5 w-3.5 text-background" fill="currentColor" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[15px] font-bold tracking-tight text-foreground">Quantum</span>
                <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-accent">Exchange</span>
              </div>
            </div>
            <p className="text-[12px] text-text-secondary leading-relaxed mb-5 max-w-[260px]">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-1.5">
              {[Twitter, Github, MessageCircle, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-8 w-8 flex items-center justify-center rounded-lg bg-surface border border-border/60 text-muted hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[10px] font-semibold text-foreground uppercase tracking-wider mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[12px] text-text-secondary hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-5 border-t border-border/40 flex items-center justify-between">
          <p className="text-[11px] text-muted">
            © 2026 Quantum Exchange. {t.footer.allRightsReserved}
          </p>
          <div className="flex items-center gap-5 text-[11px] text-muted">
            <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Cookies</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Fees</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

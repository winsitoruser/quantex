import Link from "next/link";
import { Home, Search, Zap, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full" />
          <h1 className="relative text-[120px] font-black text-foreground leading-none tracking-tighter">
            4<span className="text-accent">0</span>4
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          The page you&apos;re looking for seems to have vanished into the quantum realm. 
          It might have been moved, deleted, or never existed.
        </p>

        {/* Quick actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-card-hover text-foreground font-medium text-sm transition-colors"
          >
            <Search className="h-4 w-4" />
            Browse Markets
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border hover:bg-card-hover text-foreground font-medium text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
            Popular Pages
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Trade", href: "/trade/btc-usdt", icon: Zap },
              { label: "Markets", href: "/markets", icon: Search },
              { label: "Wallet", href: "/wallet", icon: Home },
              { label: "Earn", href: "/earn", icon: Zap },
              { label: "Bots", href: "/bots", icon: Zap },
              { label: "Academy", href: "/academy", icon: Home },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface/50 hover:bg-card-hover transition-colors group"
                >
                  <Icon className="h-5 w-5 text-muted group-hover:text-accent transition-colors" />
                  <span className="text-xs font-medium text-foreground">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quantum decoration */}
        <div className="mt-8 flex items-center justify-center gap-1 text-[10px] text-muted">
          <Zap className="h-3 w-3 text-accent" />
          <span>Powered by Quantum Exchange</span>
        </div>
      </div>
    </div>
  );
}

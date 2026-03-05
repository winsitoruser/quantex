"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  Edit3,
  Trash2,
  Pause,
  Play,
  Eye,
  ArrowLeft,
  CheckCircle2,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { myAds, type P2PAd } from "@/data/p2pData";
import { cn } from "@/lib/utils";

export default function MyAdsPage() {
  const [ads, setAds] = useState(myAds);
  const [activeTab, setActiveTab] = useState<"all" | "buy" | "sell">("all");
  const [pausedAds, setPausedAds] = useState<Set<string>>(new Set());

  const filteredAds = ads.filter((ad) => {
    if (activeTab === "all") return true;
    return ad.type === activeTab;
  });

  const togglePause = (adId: string) => {
    setPausedAds((prev) => {
      const next = new Set(prev);
      if (next.has(adId)) next.delete(adId);
      else next.add(adId);
      return next;
    });
  };

  const deleteAd = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  };

  const fiatSymbol = (fiat: string) => (fiat === "IDR" ? "Rp" : fiat === "USD" ? "$" : fiat);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/p2p"
            className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">My Advertisements</h1>
            <p className="text-sm text-muted">Manage your P2P trading ads</p>
          </div>
          <Link
            href="/p2p/create-ad"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create New Ad
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Ads", value: ads.length.toString() },
            { label: "Active", value: ads.filter((a) => !pausedAds.has(a.id)).length.toString() },
            { label: "Buy Ads", value: ads.filter((a) => a.type === "buy").length.toString() },
            { label: "Sell Ads", value: ads.filter((a) => a.type === "sell").length.toString() },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-4"
            >
              <p className="text-xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(["all", "buy", "sell"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize",
                activeTab === tab
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-card border border-transparent"
              )}
            >
              {tab === "all" ? "All Ads" : `${tab} Ads`}
            </button>
          ))}
        </div>

        {/* Ads List */}
        {filteredAds.length === 0 ? (
          <div className="rounded-2xl bg-card border border-border p-12 text-center">
            <p className="text-muted text-sm mb-4">No advertisements found</p>
            <Link
              href="/p2p/create-ad"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Your First Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAds.map((ad, i) => {
              const isPaused = pausedAds.has(ad.id);
              return (
                <motion.div
                  key={ad.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "rounded-2xl bg-card border border-border p-5 transition-colors",
                    isPaused && "opacity-60"
                  )}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Type Badge + Crypto */}
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold uppercase",
                          ad.type === "sell"
                            ? "bg-accent/10 text-accent"
                            : "bg-danger/10 text-danger"
                        )}
                      >
                        {ad.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ad.cryptoIcon}</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{ad.crypto}/{ad.fiat}</p>
                          <p className="text-[10px] text-muted">
                            Price: {fiatSymbol(ad.fiat)} {ad.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-muted">Available</p>
                        <p className="text-foreground font-mono">{ad.available.toLocaleString()} {ad.crypto}</p>
                      </div>
                      <div>
                        <p className="text-muted">Limit</p>
                        <p className="text-foreground font-mono">
                          {fiatSymbol(ad.fiat)}{ad.minLimit.toLocaleString()} - {fiatSymbol(ad.fiat)}{ad.maxLimit.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted">Payment</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {ad.paymentMethods.map((pm) => (
                            <span key={pm} className="text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted">
                              {pm}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[10px] px-2 py-1 rounded-full font-medium",
                          isPaused
                            ? "bg-warning/10 text-warning"
                            : "bg-accent/10 text-accent"
                        )}
                      >
                        {isPaused ? "Paused" : "Active"}
                      </span>
                      <button
                        onClick={() => togglePause(ad.id)}
                        className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
                        title={isPaused ? "Resume" : "Pause"}
                      >
                        {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                      </button>
                      <Link
                        href={`/p2p/create-ad?edit=${ad.id}`}
                        className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => deleteAd(ad.id)}
                        className="h-8 w-8 rounded-lg bg-background border border-border flex items-center justify-center text-muted hover:text-danger transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {ad.remarks && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-[10px] text-muted">Note: {ad.remarks}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

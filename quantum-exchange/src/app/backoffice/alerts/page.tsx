"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  CheckCircle,
  Clock,
  Info,
  ShieldAlert,
  XCircle,
  Filter,
} from "lucide-react";
import { systemAlerts } from "@/data/adminData";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "unresolved" | "resolved";
type TypeFilter = "all" | "critical" | "warning" | "info";

const typeConfig: Record<string, { color: string; bg: string; icon: typeof AlertTriangle }> = {
  critical: { color: "text-danger", bg: "bg-danger/10", icon: ShieldAlert },
  warning: { color: "text-warning", bg: "bg-warning/10", icon: AlertTriangle },
  info: { color: "text-info", bg: "bg-info/10", icon: Info },
};

export default function AlertsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const filteredAlerts = systemAlerts.filter(a => {
    if (statusFilter === "unresolved" && a.resolved) return false;
    if (statusFilter === "resolved" && !a.resolved) return false;
    if (typeFilter !== "all" && a.type !== typeFilter) return false;
    return true;
  });

  const counts = {
    total: systemAlerts.length,
    unresolved: systemAlerts.filter(a => !a.resolved).length,
    critical: systemAlerts.filter(a => a.type === "critical" && !a.resolved).length,
    warning: systemAlerts.filter(a => a.type === "warning" && !a.resolved).length,
    info: systemAlerts.filter(a => a.type === "info" && !a.resolved).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Alerts</h1>
          <p className="text-sm text-muted mt-1">Monitor and manage platform alerts</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
          <CheckCircle className="h-4 w-4" />
          Resolve All
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Alerts", value: counts.total, color: "text-foreground" },
          { label: "Unresolved", value: counts.unresolved, color: "text-danger" },
          { label: "Critical", value: counts.critical, color: "text-danger", icon: ShieldAlert },
          { label: "Warnings", value: counts.warning, color: "text-warning", icon: AlertTriangle },
          { label: "Info", value: counts.info, color: "text-info", icon: Info },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center">
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
          {(["all", "unresolved", "resolved"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                statusFilter === s ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
              )}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
          {(["all", "critical", "warning", "info"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                typeFilter === t ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground"
              )}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.map((alert, i) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-2xl bg-card border p-5 transition-all",
                alert.resolved ? "border-border opacity-60" : "border-border hover:border-border-light",
                !alert.resolved && alert.type === "critical" && "border-danger/20"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", config.bg, config.color)}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-foreground">{alert.title}</h3>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-medium", config.bg, config.color)}>
                      {alert.type}
                    </span>
                    {alert.resolved && (
                      <span className="text-[10px] px-2 py-0.5 rounded-lg font-medium bg-accent/10 text-accent">
                        resolved
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mb-2">{alert.message}</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted" />
                    <p className="text-[10px] text-muted">{alert.timestamp}</p>
                    <span className="text-[10px] text-muted">·</span>
                    <p className="text-[10px] text-muted font-mono">{alert.id}</p>
                  </div>
                </div>

                {/* Actions */}
                {!alert.resolved && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium text-accent bg-accent/10 hover:bg-accent/20 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Dismiss">
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-16">
            <Bell className="h-10 w-10 text-muted mx-auto mb-3" />
            <p className="text-sm text-muted">No alerts matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

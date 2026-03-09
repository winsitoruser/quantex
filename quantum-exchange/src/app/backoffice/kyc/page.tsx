"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShieldCheck,
  ArrowUpDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Globe,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  MessageSquare,
} from "lucide-react";
import { kycRequests, type KYCRequest } from "@/data/adminData";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "pending" | "under_review" | "approved" | "rejected";

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  under_review: "bg-info/10 text-info",
  approved: "bg-accent/10 text-accent",
  rejected: "bg-danger/10 text-danger",
};

const statusIcons: Record<string, typeof CheckCircle> = {
  pending: Clock,
  under_review: Eye,
  approved: CheckCircle,
  rejected: XCircle,
};

const docTypeLabels: Record<string, string> = {
  passport: "Passport",
  national_id: "National ID",
  drivers_license: "Driver's License",
};

export default function KYCPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedKYC, setSelectedKYC] = useState<KYCRequest | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filteredRequests = useMemo(() => {
    let reqs = kycRequests.filter(r =>
      r.username.toLowerCase().includes(search.toLowerCase()) ||
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter !== "all") reqs = reqs.filter(r => r.status === statusFilter);
    return reqs;
  }, [search, statusFilter]);

  const totalPages = Math.ceil(filteredRequests.length / perPage);
  const paginatedRequests = filteredRequests.slice((page - 1) * perPage, page * perPage);

  const statCounts = {
    total: kycRequests.length,
    pending: kycRequests.filter(r => r.status === "pending").length,
    underReview: kycRequests.filter(r => r.status === "under_review").length,
    approved: kycRequests.filter(r => r.status === "approved").length,
    rejected: kycRequests.filter(r => r.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">KYC Verification</h1>
        <p className="text-sm text-muted mt-1">Review and manage identity verification requests</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Requests", value: statCounts.total, color: "text-foreground", bg: "" },
          { label: "Pending", value: statCounts.pending, color: "text-warning", bg: "border-warning/20" },
          { label: "Under Review", value: statCounts.underReview, color: "text-info", bg: "border-info/20" },
          { label: "Approved", value: statCounts.approved, color: "text-accent", bg: "border-accent/20" },
          { label: "Rejected", value: statCounts.rejected, color: "text-danger", bg: "border-danger/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl bg-card border border-border p-3 text-center ${s.bg}`}>
            <p className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-3 py-2 flex-1 max-w-md focus-within:border-border-light transition-colors">
          <Search className="h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, username, email, or KYC ID..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          {(["all", "pending", "under_review", "approved", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                statusFilter === s
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-muted hover:text-foreground hover:bg-card border border-transparent"
              )}
            >
              {s === "all" ? "All" : s === "under_review" ? "Under Review" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginatedRequests.map((req, i) => {
          const StatusIcon = statusIcons[req.status] || Clock;
          return (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-card border border-border p-5 hover:border-border-light transition-all group"
            >
              {/* Top */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] px-2 py-1 rounded-lg font-medium inline-flex items-center gap-1 ${statusColors[req.status]}`}>
                  <StatusIcon className="h-3 w-3" />
                  {req.status === "under_review" ? "Under Review" : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
                <span className="text-[10px] text-muted font-mono">{req.id}</span>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple/30 to-info/30 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                  {req.fullName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{req.fullName}</p>
                  <p className="text-[10px] text-muted">@{req.username}</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Globe className="h-3 w-3 shrink-0" />
                  <span>{req.country}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <FileText className="h-3 w-3 shrink-0" />
                  <span>{docTypeLabels[req.documentType]}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  <span>Level {req.level}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3 w-3 shrink-0" />
                  <span>{req.submittedAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setSelectedKYC(req)}
                  className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium text-info bg-info/10 hover:bg-info/20 transition-colors"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Review
                </button>
                {(req.status === "pending" || req.status === "under_review") && (
                  <>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-accent bg-accent/10 hover:bg-accent/20 transition-colors" title="Approve">
                      <CheckCircle className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-danger bg-danger/10 hover:bg-danger/20 transition-colors" title="Reject">
                      <XCircle className="h-3.5 w-3.5" />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted">
            Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredRequests.length)} of {filteredRequests.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={cn("h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                  page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card"
                )}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* KYC Detail Modal */}
      <AnimatePresence>
        {selectedKYC && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60"
              onClick={() => setSelectedKYC(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">KYC Review</h3>
                  <button onClick={() => setSelectedKYC(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6">
                  {(() => {
                    const StatusIcon = statusIcons[selectedKYC.status] || Clock;
                    return (
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-medium inline-flex items-center gap-1.5 ${statusColors[selectedKYC.status]}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {selectedKYC.status === "under_review" ? "Under Review" : selectedKYC.status.charAt(0).toUpperCase() + selectedKYC.status.slice(1)}
                      </span>
                    );
                  })()}
                </div>

                {/* User Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-background border border-border">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple/30 to-info/30 flex items-center justify-center text-sm font-bold text-foreground">
                      {selectedKYC.fullName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedKYC.fullName}</p>
                      <p className="text-xs text-muted">@{selectedKYC.username} · {selectedKYC.userId}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Mail, label: "Email", value: selectedKYC.email },
                      { icon: Globe, label: "Country", value: selectedKYC.country },
                      { icon: FileText, label: "Document", value: docTypeLabels[selectedKYC.documentType] },
                      { icon: ShieldCheck, label: "KYC Level", value: `Level ${selectedKYC.level}` },
                      { icon: Calendar, label: "Submitted", value: selectedKYC.submittedAt },
                      { icon: Calendar, label: "Reviewed", value: selectedKYC.reviewedAt || "Not yet" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.label} className="p-3 rounded-xl bg-background border border-border">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon className="h-3 w-3 text-muted" />
                            <p className="text-[10px] text-muted">{item.label}</p>
                          </div>
                          <p className="text-xs font-medium text-foreground">{item.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  {selectedKYC.reviewer && (
                    <div className="p-3 rounded-xl bg-background border border-border">
                      <p className="text-[10px] text-muted mb-1">Reviewer</p>
                      <p className="text-xs font-medium text-foreground">{selectedKYC.reviewer}</p>
                    </div>
                  )}

                  {selectedKYC.notes && (
                    <div className="p-3 rounded-xl bg-danger/5 border border-danger/20">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MessageSquare className="h-3 w-3 text-danger" />
                        <p className="text-[10px] text-danger font-medium">Notes</p>
                      </div>
                      <p className="text-xs text-foreground">{selectedKYC.notes}</p>
                    </div>
                  )}

                  {/* Document Preview Placeholder */}
                  <div className="rounded-xl border-2 border-dashed border-border p-8 text-center">
                    <FileText className="h-8 w-8 text-muted mx-auto mb-2" />
                    <p className="text-xs text-muted">Document preview would appear here</p>
                    <p className="text-[10px] text-muted mt-1">{docTypeLabels[selectedKYC.documentType]} · {selectedKYC.country}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {(selectedKYC.status === "pending" || selectedKYC.status === "under_review") && (
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button className="flex-1 h-10 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button className="flex-1 h-10 rounded-xl bg-danger/10 text-danger text-sm font-medium hover:bg-danger/20 transition-colors flex items-center justify-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";
export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Users,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Shield,
  Ban,
  Eye,
  UserCheck,
  UserX,
  Crown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { adminUsers } from "@/data/adminData";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/utils";

type SortField = "username" | "totalBalance" | "tradingVolume30d" | "registeredAt" | "lastLogin";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "suspended" | "pending" | "banned";
type RoleFilter = "all" | "user" | "vip" | "market_maker" | "admin";

const statusColors: Record<string, string> = {
  active: "bg-accent/10 text-accent",
  suspended: "bg-warning/10 text-warning",
  pending: "bg-info/10 text-info",
  banned: "bg-danger/10 text-danger",
};

const roleIcons: Record<string, typeof Users> = {
  user: Users,
  vip: Crown,
  market_maker: Shield,
  admin: Shield,
};

const roleColors: Record<string, string> = {
  user: "text-muted",
  vip: "text-warning",
  market_maker: "text-purple",
  admin: "text-danger",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [sortField, setSortField] = useState<SortField>("totalBalance");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  };

  const filteredUsers = useMemo(() => {
    let users = adminUsers.filter(u =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") users = users.filter(u => u.status === statusFilter);
    if (roleFilter !== "all") users = users.filter(u => u.role === roleFilter);

    users.sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      switch (sortField) {
        case "totalBalance": aVal = a.totalBalance; bVal = b.totalBalance; break;
        case "tradingVolume30d": aVal = a.tradingVolume30d; bVal = b.tradingVolume30d; break;
        case "registeredAt": aVal = a.registeredAt; bVal = b.registeredAt; break;
        case "lastLogin": aVal = a.lastLogin; bVal = b.lastLogin; break;
        default: aVal = a.username; bVal = b.username;
      }
      if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return users;
  }, [search, statusFilter, roleFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * perPage, page * perPage);

  const statCounts = {
    total: adminUsers.length,
    active: adminUsers.filter(u => u.status === "active").length,
    suspended: adminUsers.filter(u => u.status === "suspended").length,
    pending: adminUsers.filter(u => u.status === "pending").length,
    banned: adminUsers.filter(u => u.status === "banned").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted mt-1">Manage and monitor platform users</p>
        </div>
        <button className="h-9 px-4 flex items-center gap-2 rounded-xl bg-accent text-background text-sm font-medium hover:bg-accent-hover transition-colors">
          <Users className="h-4 w-4" />
          Export Users
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: statCounts.total, color: "text-foreground" },
          { label: "Active", value: statCounts.active, color: "text-accent" },
          { label: "Suspended", value: statCounts.suspended, color: "text-warning" },
          { label: "Pending", value: statCounts.pending, color: "text-info" },
          { label: "Banned", value: statCounts.banned, color: "text-danger" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl bg-card border border-border p-3 text-center">
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
            placeholder="Search by username, name, email, or ID..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
            <option value="banned">Banned</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value as RoleFilter); setPage(1); }}
            className="h-9 px-3 rounded-xl bg-card border border-border text-sm text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="vip">VIP</option>
            <option value="market_maker">Market Maker</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border text-xs font-medium text-muted uppercase tracking-wider">
              <th className="text-left px-5 py-3">User</th>
              <th className="text-left px-3 py-3">Role</th>
              <th className="text-left px-3 py-3">Status</th>
              <th className="text-center px-3 py-3">KYC</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("totalBalance")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Balance <ArrowUpDown className={`h-3 w-3 ${sortField === "totalBalance" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("tradingVolume30d")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Volume (30d) <ArrowUpDown className={`h-3 w-3 ${sortField === "tradingVolume30d" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-left px-3 py-3">Country</th>
              <th className="text-right px-3 py-3">
                <button onClick={() => handleSort("lastLogin")} className="inline-flex items-center gap-1 hover:text-foreground">
                  Last Login <ArrowUpDown className={`h-3 w-3 ${sortField === "lastLogin" ? "text-accent" : ""}`} />
                </button>
              </th>
              <th className="text-center px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {paginatedUsers.map((user, i) => {
              const RoleIcon = roleIcons[user.role] || Users;
              return (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-card-hover transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent/30 to-cyan/30 flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                        {user.fullName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.username}</p>
                        <p className="text-[10px] text-muted">{user.email}</p>
                        <p className="text-[10px] text-muted">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${roleColors[user.role]}`}>
                      <RoleIcon className="h-3 w-3" />
                      {user.role === "market_maker" ? "MM" : user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-medium ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3].map(level => (
                        <div
                          key={level}
                          className={cn(
                            "h-2 w-5 rounded-sm",
                            level <= user.kycLevel ? "bg-accent" : "bg-border"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-[9px] text-muted mt-0.5">Lv.{user.kycLevel}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-sm font-medium text-foreground font-mono">${formatNumber(user.totalBalance)}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-sm text-muted font-mono">${formatNumber(user.tradingVolume30d)}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <p className="text-xs text-muted">{user.country}</p>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <p className="text-xs text-muted">{user.lastLogin}</p>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-info hover:bg-info/10 transition-colors" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      {user.status === "active" ? (
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-warning hover:bg-warning/10 transition-colors" title="Suspend">
                          <UserX className="h-3.5 w-3.5" />
                        </button>
                      ) : user.status === "suspended" ? (
                        <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-colors" title="Activate">
                          <UserCheck className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                      <button className="h-7 w-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors" title="Ban">
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">
          Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filteredUsers.length)} of {filteredUsers.length} users
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
                page === p ? "bg-accent/10 text-accent" : "text-muted hover:text-foreground hover:bg-card"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-card disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

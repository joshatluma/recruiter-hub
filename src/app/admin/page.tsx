"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Users,
  BarChart3,
  Settings,
  Shield,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  video: Video,
  checklist: CheckSquare,
  playbook: BookOpen,
  wizard: BookOpen,
};

interface PendingContent {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  authorName: string;
  authorImage: string | null;
  createdAt: string;
  status: string;
}

interface AdminStats {
  totalUsers: number;
  totalContent: number;
  pendingApprovals: number;
  questionsThisWeek: number;
}

// Demo data
const demoPendingContent: PendingContent[] = [
  {
    id: "p1",
    title: "Remote Interview Best Practices",
    description: "Guide for conducting effective remote interviews with candidates across different time zones.",
    type: "document",
    category: "Interviews",
    authorName: "Emily Davis",
    authorImage: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "p2",
    title: "Offer Letter Template Checklist",
    description: "Comprehensive checklist for preparing and sending offer letters to candidates.",
    type: "checklist",
    category: "Offers",
    authorName: "Lisa Park",
    authorImage: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "p3",
    title: "Engineering Levels Explained",
    description: "Video walkthrough of our engineering ladder and what to look for at each level.",
    type: "video",
    category: "Screening",
    authorName: "Mike Johnson",
    authorImage: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
];

const demoStats: AdminStats = {
  totalUsers: 8,
  totalContent: 47,
  pendingApprovals: 3,
  questionsThisWeek: 12,
};

export default function AdminPage() {
  const [pendingContent, setPendingContent] = useState<PendingContent[]>([]);
  const [stats, setStats] = useState<AdminStats>(demoStats);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"approvals" | "users" | "analytics">("approvals");

  const user = { name: "Admin User", email: "admin@lumalabs.ai", role: "admin" };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await fetch("/api/content?status=pending");
      if (res.ok) {
        const data = await res.json();
        setPendingContent(data.length > 0 ? data : demoPendingContent);
      } else {
        setPendingContent(demoPendingContent);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setPendingContent(demoPendingContent);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(contentId: string) {
    setProcessing(contentId);
    try {
      const res = await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" }),
      });

      if (res.ok) {
        setPendingContent((prev) => prev.filter((c) => c.id !== contentId));
        setStats((prev) => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
          totalContent: prev.totalContent + 1,
        }));
      }
    } catch (error) {
      console.error("Error approving content:", error);
    } finally {
      setProcessing(null);
    }
  }

  async function handleReject(contentId: string) {
    setProcessing(contentId);
    try {
      const res = await fetch(`/api/content/${contentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "draft" }),
      });

      if (res.ok) {
        setPendingContent((prev) => prev.filter((c) => c.id !== contentId));
        setStats((prev) => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
        }));
      }
    } catch (error) {
      console.error("Error rejecting content:", error);
    } finally {
      setProcessing(null);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Admin Dashboard
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Manage content, users, and platform settings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 stagger-children">
          <div className="surface rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-muted)]">Total Users</span>
              <Users className="w-5 h-5 text-[var(--accent-primary)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalUsers}</p>
          </div>
          <div className="surface rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-muted)]">Published Content</span>
              <BookOpen className="w-5 h-5 text-[var(--accent-success)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalContent}</p>
          </div>
          <div className="surface rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-muted)]">Pending Approvals</span>
              <Clock className="w-5 h-5 text-[var(--accent-warning)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--accent-warning)]">{stats.pendingApprovals}</p>
          </div>
          <div className="surface rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[var(--text-muted)]">Questions This Week</span>
              <BarChart3 className="w-5 h-5 text-[var(--accent-secondary)]" />
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.questionsThisWeek}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "approvals"
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Content Approvals
            {stats.pendingApprovals > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[var(--accent-warning)]/20 text-[var(--accent-warning)]">
                {stats.pendingApprovals}
              </span>
            )}
            {activeTab === "approvals" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "users"
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Users
            {activeTab === "users" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === "analytics"
                ? "text-[var(--accent-primary)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            Analytics
            {activeTab === "analytics" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]" />
            )}
          </button>
        </div>

        {/* Content Approvals Tab */}
        {activeTab === "approvals" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
              </div>
            ) : pendingContent.length === 0 ? (
              <div className="surface rounded-xl p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-success)]/10 mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[var(--accent-success)]" />
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                  All caught up!
                </h3>
                <p className="text-[var(--text-secondary)]">
                  No content pending approval.
                </p>
              </div>
            ) : (
              pendingContent.map((content, index) => {
                const TypeIcon = typeIcons[content.type] || FileText;
                return (
                  <div
                    key={content.id}
                    className="surface rounded-xl p-5 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent-warning)]/10 flex items-center justify-center flex-shrink-0">
                        <TypeIcon className="w-6 h-6 text-[var(--accent-warning)]" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="badge-warning">{content.status}</span>
                          <span className="text-xs text-[var(--text-muted)]">{content.type}</span>
                        </div>
                        <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                          {content.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">
                          {content.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {content.authorName}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(content.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Link
                          href={`/content/${content.id}`}
                          className="btn-ghost p-2 rounded-lg"
                          title="Preview"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleReject(content.id)}
                          disabled={processing === content.id}
                          className="btn-ghost p-2 rounded-lg text-[var(--accent-danger)] hover:bg-[var(--accent-danger)]/10"
                          title="Reject"
                        >
                          {processing === content.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleApprove(content.id)}
                          disabled={processing === content.id}
                          className="btn-primary py-2 px-4 flex items-center gap-2"
                        >
                          {processing === content.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="surface rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-[var(--text-primary)]">Team Members</h2>
              <button className="btn-secondary text-sm">Invite User</button>
            </div>
            <div className="space-y-3">
              {[
                { name: "Mike Johnson", email: "mike@lumalabs.ai", role: "admin", points: 3120 },
                { name: "Sarah Chen", email: "sarah@lumalabs.ai", role: "user", points: 2450 },
                { name: "James Wilson", email: "james@lumalabs.ai", role: "user", points: 2780 },
                { name: "Emily Davis", email: "emily@lumalabs.ai", role: "user", points: 1890 },
                { name: "David Kim", email: "david@lumalabs.ai", role: "user", points: 2100 },
                { name: "Lisa Park", email: "lisa@lumalabs.ai", role: "user", points: 1650 },
              ].map((member) => (
                <div
                  key={member.email}
                  className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-tertiary)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{member.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[var(--text-muted)]">{member.points} pts</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      member.role === "admin"
                        ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"
                        : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                    }`}>
                      {member.role}
                    </span>
                    <button className="btn-ghost text-sm">Edit</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="surface rounded-xl p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Content by Type</h3>
              <div className="space-y-3">
                {[
                  { type: "Documents", count: 24, color: "var(--accent-primary)" },
                  { type: "Videos", count: 8, color: "var(--accent-secondary)" },
                  { type: "Checklists", count: 10, color: "var(--accent-success)" },
                  { type: "Playbooks", count: 5, color: "var(--accent-warning)" },
                ].map((item) => (
                  <div key={item.type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">{item.type}</span>
                      <span className="text-[var(--text-primary)]">{item.count}</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(item.count / 47) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface rounded-xl p-6">
              <h3 className="font-semibold text-[var(--text-primary)] mb-4">Weekly Activity</h3>
              <div className="space-y-3">
                {[
                  { metric: "Content Completed", value: 45, change: "+12%" },
                  { metric: "Questions Asked", value: 12, change: "+8%" },
                  { metric: "Answers Given", value: 28, change: "+15%" },
                  { metric: "Points Awarded", value: 2340, change: "+22%" },
                ].map((item) => (
                  <div key={item.metric} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                    <span className="text-[var(--text-secondary)]">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[var(--text-primary)]">{item.value}</span>
                      <span className="text-xs text-[var(--accent-success)]">{item.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

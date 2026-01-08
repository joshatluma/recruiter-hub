"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  BookOpen,
  GraduationCap,
  Trophy,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "admin" | "user";
  points: number;
  stats: {
    contentCreated: number;
    contentCompleted: number;
    questionsAsked: number;
    questionsAnswered: number;
  };
}

interface ContentItem {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [recentContent, setRecentContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, contentRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/content?limit=5"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        if (contentRes.ok) {
          const contentData = await contentRes.json();
          setRecentContent(contentData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Demo user for when not logged in
  const displayUser = user || {
    name: "Demo User",
    email: "demo@lumalabs.ai",
    image: null,
    role: "user" as const,
    points: 1250,
    stats: {
      contentCreated: 3,
      contentCompleted: 12,
      questionsAsked: 2,
      questionsAnswered: 5,
    },
  };

  const stats = [
    { name: "Content Completed", value: displayUser.stats?.contentCompleted || 0, icon: CheckCircle2 },
    { name: "Points Earned", value: displayUser.points?.toLocaleString() || "0", icon: Trophy },
    { name: "Questions Answered", value: displayUser.stats?.questionsAnswered || 0, icon: TrendingUp },
    { name: "Content Created", value: displayUser.stats?.contentCreated || 0, icon: BookOpen },
  ];

  // Demo content for when no content exists
  const displayContent = recentContent.length > 0 ? recentContent : [
    { id: "1", title: "Technical Sourcing Best Practices", type: "document", category: "Sourcing", description: "Learn effective strategies for sourcing technical candidates." },
    { id: "2", title: "Interview Evaluation Framework", type: "checklist", category: "Interviews", description: "Standardized rubric for evaluating candidates." },
    { id: "3", title: "Offer Negotiation Guide", type: "playbook", category: "Offers", description: "Complete guide to handling offer negotiations." },
  ];

  if (loading) {
    return (
      <AppLayout user={{ name: "Loading...", email: "", role: "user" }}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={displayUser}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Welcome back, {displayUser.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Here&apos;s what&apos;s happening with your learning journey.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="surface rounded-xl p-5 card-hover"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[var(--text-muted)] text-sm font-medium">
                  {stat.name}
                </span>
                <stat.icon className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent content */}
          <div className="lg:col-span-2 surface rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Recent Content
              </h2>
              <Link href="/content" className="btn-ghost text-sm flex items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {displayContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/content/${content.id}`}
                  className="block p-4 rounded-lg bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] transition-colors border border-[var(--border-subtle)] hover:border-[var(--border-default)]"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">
                        {content.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {content.category} · {content.type}
                      </p>
                    </div>
                    <span className="badge">{content.type}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">
                    {content.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="surface rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--accent-secondary)]" />
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-3">
              <Link
                href="/ai"
                className="block p-4 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20 hover:border-[var(--accent-primary)]/40 transition-colors"
              >
                <h3 className="font-medium text-[var(--text-primary)] mb-1">
                  Create Content with AI
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Generate training materials with Gemini
                </p>
              </Link>

              <Link
                href="/qa/ask"
                className="block p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
              >
                <h3 className="font-medium text-[var(--text-primary)] mb-1">
                  Ask a Question
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Get help from AI or the team
                </p>
              </Link>

              <Link
                href="/learn"
                className="block p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] hover:border-[var(--border-default)] transition-colors"
              >
                <h3 className="font-medium text-[var(--text-primary)] mb-1">
                  Continue Learning
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Pick up where you left off
                </p>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <Link
            href="/content"
            className="surface rounded-xl p-6 card-hover flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[var(--accent-primary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Browse Content</h3>
              <p className="text-sm text-[var(--text-secondary)]">Explore the library</p>
            </div>
          </Link>

          <Link
            href="/learn"
            className="surface rounded-xl p-6 card-hover flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-secondary)]/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-[var(--accent-secondary)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Learning Paths</h3>
              <p className="text-sm text-[var(--text-secondary)]">Structured training</p>
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="surface rounded-xl p-6 card-hover flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-success)]/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-[var(--accent-success)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Leaderboard</h3>
              <p className="text-sm text-[var(--text-secondary)]">See rankings</p>
            </div>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}

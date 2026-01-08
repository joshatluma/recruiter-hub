"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  Search,
  Filter,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  Plus,
  Clock,
  User,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const contentTypes = [
  { value: "all", label: "All Types" },
  { value: "document", label: "Documents", icon: FileText },
  { value: "video", label: "Videos", icon: Video },
  { value: "checklist", label: "Checklists", icon: CheckSquare },
  { value: "playbook", label: "Playbooks", icon: BookOpen },
];

const categories = [
  "All Categories",
  "Sourcing",
  "Screening",
  "Interviews",
  "Offers",
  "Onboarding",
  "DEI",
  "Tools",
];

const typeIcons: Record<string, typeof FileText> = {
  document: FileText,
  video: Video,
  checklist: CheckSquare,
  playbook: BookOpen,
  wizard: BookOpen,
};

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  tags: string[];
  authorName: string;
  updatedAt: string;
}

// Demo content for when no data exists
const demoContent: ContentItem[] = [
  {
    id: "demo-1",
    title: "Technical Sourcing Best Practices",
    description: "Learn effective strategies for sourcing technical candidates including Boolean search techniques and platform optimization.",
    type: "document",
    category: "Sourcing",
    tags: ["technical", "sourcing", "linkedin", "boolean"],
    authorName: "Sarah Chen",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Interview Evaluation Framework",
    description: "Standardized rubric for evaluating candidates across different competencies with scoring guidelines.",
    type: "checklist",
    category: "Interviews",
    tags: ["interviews", "evaluation", "rubric"],
    authorName: "Mike Johnson",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-3",
    title: "Candidate Experience Training",
    description: "Video walkthrough of our candidate experience best practices and communication templates.",
    type: "video",
    category: "Screening",
    tags: ["candidate-experience", "communication"],
    authorName: "Emily Davis",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-4",
    title: "Offer Negotiation Playbook",
    description: "Complete guide to handling offer negotiations including scripts, scenarios, and escalation paths.",
    type: "playbook",
    category: "Offers",
    tags: ["offers", "negotiation", "compensation"],
    authorName: "James Wilson",
    updatedAt: new Date().toISOString(),
  },
];

export default function ContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  useEffect(() => {
    loadContent();
  }, [typeFilter, categoryFilter]);

  async function loadContent() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (categoryFilter !== "All Categories") params.set("category", categoryFilter);

      const res = await fetch(`/api/content?${params}`);
      if (res.ok) {
        const data = await res.json();
        setContentItems(data.length > 0 ? data : demoContent);
      } else {
        setContentItems(demoContent);
      }
    } catch (error) {
      console.error("Error loading content:", error);
      setContentItems(demoContent);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) {
      loadContent();
      return;
    }

    setSearching(true);
    try {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: search }),
      });

      if (res.ok) {
        const data = await res.json();
        setContentItems(data.results.length > 0 ? data.results : demoContent);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Content Library
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Browse training materials, playbooks, and resources
            </p>
          </div>
          <Link href="/ai" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Content
          </Link>
        </div>

        {/* Search and filters */}
        <form onSubmit={handleSearch} className="surface rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content with AI... (e.g., 'how to source engineers')"
                className="input pl-10 pr-24"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Search
              </button>
            </div>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input w-auto min-w-[160px]"
            >
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input w-auto min-w-[180px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </form>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
          </div>
        ) : (
          /* Content grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {contentItems.map((item) => {
              const TypeIcon = typeIcons[item.type] || FileText;
              return (
                <Link
                  key={item.id}
                  href={`/content/${item.id}`}
                  className="surface rounded-xl p-5 card-hover group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                      <TypeIcon className="w-5 h-5 text-[var(--accent-primary)]" />
                    </div>
                    <span className="badge">{item.category}</span>
                  </div>

                  <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent-primary)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(item.tags || []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {(item.tags || []).length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {item.authorName || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(item.updatedAt)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && contentItems.length === 0 && (
          <div className="surface rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-primary)]/10 mb-4">
              <BookOpen className="w-8 h-8 text-[var(--accent-primary)]" />
            </div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">
              No content found
            </h3>
            <p className="text-[var(--text-secondary)] max-w-sm mx-auto mb-4">
              Try adjusting your search or filters, or create new content with AI.
            </p>
            <Link href="/ai" className="btn-primary inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Create Content
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

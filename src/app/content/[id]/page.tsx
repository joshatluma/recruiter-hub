"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import {
  ArrowLeft,
  FileText,
  Video,
  CheckSquare,
  BookOpen,
  Clock,
  User,
  Tag,
  CheckCircle2,
  Circle,
  Loader2,
  Play,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

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
  body: string | null;
  videoUrl: string | null;
  category: string;
  tags: string[];
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorImage: string | null;
  progress: {
    completed: boolean;
    completedAt: string | null;
    checklistState: Record<string, boolean> | null;
  } | null;
}

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [checklistState, setChecklistState] = useState<Record<string, boolean>>({});

  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  useEffect(() => {
    loadContent();
  }, [params.id]);

  async function loadContent() {
    try {
      const res = await fetch(`/api/content/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        if (data.progress?.checklistState) {
          setChecklistState(data.progress.checklistState);
        }
      } else {
        // Demo fallback
        setContent({
          id: params.id as string,
          title: "Technical Sourcing Best Practices",
          description: "Learn effective strategies for sourcing technical candidates including Boolean search techniques and platform optimization.",
          type: "document",
          body: `# Technical Sourcing Best Practices

## Overview
This guide covers the essential techniques for sourcing technical candidates effectively at Luma Labs.

## Key Strategies

### 1. Boolean Search Mastery
Master Boolean search operators to find the right candidates:
- Use AND to combine requirements: \`"software engineer" AND Python AND React\`
- Use OR for alternatives: \`"senior developer" OR "staff engineer"\`
- Use NOT to exclude: \`engineer NOT "support engineer"\`
- Use quotes for exact phrases: \`"machine learning"\`

### 2. Platform-Specific Techniques

#### LinkedIn
- Use LinkedIn Recruiter's advanced filters
- Search by current and past companies
- Look at "People also viewed" sections
- Check who's engaging with relevant content

#### GitHub
- Search by language and location
- Look at contributors to popular repos
- Check starred repositories for interests
- Review commit history for consistency

### 3. Outreach Best Practices
- Personalize every message
- Reference specific work or projects
- Keep messages concise (under 150 words)
- Include a clear call to action

## Common Mistakes to Avoid
- Sending generic templates
- Not researching the candidate first
- Overselling the role
- Being too pushy in follow-ups

## Key Takeaways
1. Quality over quantity in sourcing
2. Personalization is essential
3. Build relationships, not transactions
4. Track your metrics to improve`,
          videoUrl: null,
          category: "Sourcing",
          tags: ["sourcing", "technical", "linkedin", "boolean-search"],
          status: "published",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorName: "Sarah Chen",
          authorImage: null,
          progress: null,
        });
      }
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleComplete() {
    if (!content) return;
    setCompleting(true);

    try {
      const res = await fetch(`/api/content/${content.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: true, checklistState }),
      });

      if (res.ok) {
        setContent({
          ...content,
          progress: {
            completed: true,
            completedAt: new Date().toISOString(),
            checklistState,
          },
        });
      }
    } catch (error) {
      console.error("Error marking complete:", error);
    } finally {
      setCompleting(false);
    }
  }

  async function handleChecklistToggle(itemId: string) {
    const newState = { ...checklistState, [itemId]: !checklistState[itemId] };
    setChecklistState(newState);

    // Save progress
    try {
      await fetch(`/api/content/${params.id}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checklistState: newState }),
      });
    } catch (error) {
      console.error("Error saving checklist state:", error);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderMarkdown(text: string) {
    // Simple markdown rendering for demo
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: string[] = [];

    lines.forEach((line, index) => {
      if (line.startsWith("# ")) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h1 key={index} className="text-2xl font-bold text-[var(--text-primary)] mb-4 mt-6" style={{ fontFamily: "var(--font-playfair)" }}>{line.slice(2)}</h1>);
      } else if (line.startsWith("## ")) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h2 key={index} className="text-xl font-semibold text-[var(--text-primary)] mb-3 mt-5">{line.slice(3)}</h2>);
      } else if (line.startsWith("### ")) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h3 key={index} className="text-lg font-medium text-[var(--text-primary)] mb-2 mt-4">{line.slice(4)}</h3>);
      } else if (line.startsWith("#### ")) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
        elements.push(<h4 key={index} className="text-base font-medium text-[var(--accent-primary)] mb-2 mt-3">{line.slice(5)}</h4>);
      } else if (line.startsWith("- ")) {
        inList = true;
        listItems.push(line.slice(2));
      } else if (line.match(/^\d+\./)) {
        inList = true;
        listItems.push(line.replace(/^\d+\.\s*/, ""));
      } else if (line.trim() === "") {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-[var(--text-secondary)]">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
      } else if (line.trim()) {
        if (inList) {
          elements.push(<ul key={`list-${index}`} className="list-disc list-inside space-y-1 mb-4 text-[var(--text-secondary)]">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
          listItems = [];
          inList = false;
        }
        // Handle inline code
        const processedLine = line.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--accent-primary)] text-sm font-mono">$1</code>');
        elements.push(<p key={index} className="text-[var(--text-secondary)] mb-3" dangerouslySetInnerHTML={{ __html: processedLine }} />);
      }
    });

    if (inList) {
      elements.push(<ul key="final-list" className="list-disc list-inside space-y-1 mb-4 text-[var(--text-secondary)]">{listItems.map((item, i) => <li key={i}>{item}</li>)}</ul>);
    }

    return elements;
  }

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </AppLayout>
    );
  }

  if (!content) {
    return (
      <AppLayout user={user}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Content Not Found</h1>
          <Link href="/content" className="btn-primary">
            Back to Library
          </Link>
        </div>
      </AppLayout>
    );
  }

  const TypeIcon = typeIcons[content.type] || FileText;
  const isCompleted = content.progress?.completed;

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Header */}
        <div className="surface rounded-2xl p-6 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center flex-shrink-0">
              <TypeIcon className="w-7 h-7 text-[var(--accent-primary)]" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge">{content.category}</span>
                <span className="text-xs text-[var(--text-muted)]">{content.type}</span>
                {isCompleted && (
                  <span className="badge-success flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                {content.title}
              </h1>

              <p className="text-[var(--text-secondary)] mb-4">
                {content.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {content.authorName || "Unknown Author"}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Updated {formatDate(content.updatedAt)}
                </span>
              </div>

              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Video embed */}
        {content.type === "video" && content.videoUrl && (
          <div className="surface rounded-xl overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="aspect-video bg-[var(--bg-tertiary)] flex items-center justify-center">
              {content.videoUrl.includes("youtube") || content.videoUrl.includes("youtu.be") ? (
                <iframe
                  src={content.videoUrl.replace("watch?v=", "embed/")}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : content.videoUrl.includes("loom") ? (
                <iframe
                  src={content.videoUrl.replace("share", "embed")}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <a
                  href={content.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Watch Video
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Content body */}
        {content.body && (
          <div className="surface rounded-xl p-8 mb-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="prose prose-invert max-w-none">
              {renderMarkdown(content.body)}
            </div>
          </div>
        )}

        {/* Completion action */}
        {!isCompleted && (
          <div className="surface rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Ready to mark as complete?</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  You&apos;ll earn 50 points for completing this content.
                </p>
              </div>
              <button
                onClick={handleComplete}
                disabled={completing}
                className="btn-primary flex items-center gap-2"
              >
                {completing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                Mark Complete
              </button>
            </div>
          </div>
        )}

        {/* Completion celebration */}
        {isCompleted && (
          <div className="surface rounded-xl p-6 bg-gradient-to-r from-[var(--accent-success)]/10 to-[var(--accent-primary)]/10 border border-[var(--accent-success)]/20 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--accent-success)]/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[var(--accent-success)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">Completed!</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  You completed this on {content.progress?.completedAt ? formatDate(content.progress.completedAt) : "recently"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

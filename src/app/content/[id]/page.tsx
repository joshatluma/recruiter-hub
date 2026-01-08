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

// Demo content matching real Luma Notion content
const demoContentMap: Record<string, Partial<ContentItem>> = {
  "demo-1": {
    title: "Our North Star: Luma's Mission & Values",
    description: "Understand Luma's mission to build multimodal general intelligence and our 7 core values that guide every hiring decision.",
    type: "document",
    category: "Foundational",
    tags: ["values", "culture", "mission", "onboarding"],
    body: `# Our North Star

## Mission Statement
**Luma's mission is to build multimodal general intelligence for everyone—making the creation and consumption of visual content limitless.**

We believe intelligent systems should understand and generate the world as humans experience it: through sight, sound, and interaction.

---

## Our 7 Core Values

### 1. Bias for Speed
We move fast and ship. We'd rather be directionally correct and learn quickly than wait for perfect certainty. Speed is a competitive advantage and a cultural habit.

### 2. High Standards
We hold ourselves to exceptional quality. "Good enough" isn't good enough. We push for excellence in our work, our products, and our team.

### 3. First Principles Thinking
We question assumptions and reason from fundamentals. We don't copy playbooks—we understand why things work and build from there.

### 4. Intellectual Honesty
We tell the truth, especially when it's hard. We give and receive direct feedback. We admit mistakes and change our minds when evidence demands it.

### 5. Low Ego, High Impact
The best idea wins, regardless of who proposed it. We care about outcomes, not credit. We collaborate without politics.

### 6. Ownership & Accountability
We take full ownership of our work and its outcomes. We don't wait for permission or blame others. We see problems and fix them.

### 7. Curiosity & Continuous Learning
We're students first. We stay hungry to learn, grow, and understand. The best team members are always improving.

---

## Hiring Philosophy

### Builder Over Optimizer
We look for **builders**—people who create from scratch, thrive in ambiguity, and ship fast. Early-stage startups need people who build, not optimize existing systems.

### Intellectual Horsepower + Drive
We hire for raw intelligence combined with relentless work ethic. Smart and lazy doesn't work here. Neither does hardworking and slow.

### Culture Add, Not Culture Fit
We want people who share our values but bring diverse perspectives, experiences, and thinking styles.

### High Bar, Fast Process
We're selective but decisive. We know great talent doesn't wait. When we find someone exceptional, we move fast.`,
  },
  "demo-2": {
    title: "The Recruiting Process Playbook",
    description: "Our complete standard operating procedure for hiring at Luma—from intake to offer.",
    type: "playbook",
    category: "Process",
    tags: ["process", "playbook", "hiring", "gem"],
    body: `# The Recruiting Process Playbook

## Our Philosophy: Structured Process, High-Signal Outcomes

This playbook details our standard operating procedure for hiring at Luma. Following this process ensures consistency, fairness, and efficiency, allowing us to make high-quality hiring decisions quickly while providing an excellent candidate experience. **Gem is our single source of truth** for tracking all stages and activities.

---

## Overview: The Standard Hiring Funnel

1. **Prep & Kickoff** — Aligning on the role and strategy
2. **Sourcing & Application** — Building the candidate pool
3. **Recruiter Screen** — Initial assessment of alignment and motivation
4. **Hiring Manager Screen** — Deeper dive into domain expertise
5. **Technical / Domain Assessment** — Role-specific skills evaluation
6. **Core Interview Loop** — Cross-functional assessment
7. **Luma & You** — Final alignment with leadership
8. **Debrief & Final Decision** — Making the hire/no-hire call
9. **Closing & Offer** — Extending and securing the offer

---

## Stage 1: Prep & Kickoff

**Goal:** Ensure full alignment between Recruiter and Hiring Manager on the role, profile, process, and sourcing strategy *before* engaging candidates.

**Key Activities:**
- Hiring Manager submits headcount request
- Recruiter and HM hold a formal intake meeting
- Recruiter generates the RAD (Recruiter Alignment Document)
- HM reviews and approves the RAD
- Recruiter creates Job in Gem and configures stages

**SLA:** RAD finalized & Gem job live within 48 hours of intake meeting

---

## Stage 2: Sourcing & Application

**Goal:** Build a diverse and qualified pool of candidates aligned with the RAD.

**Key Activities:**
- Execute sourcing strategy from RAD
- Use LinkedIn Recruiter, Gem AI, Juicebox, SeekOut
- Post job to relevant channels
- Review inbound applications

**SLA:** New applications reviewed within 48 business hours

---

## Stage 3: Recruiter Screen

**Goal:** Assess core alignment, motivations, logistics, and sell the Luma opportunity.

**Key Activities:**
- Schedule 30-minute screen
- Use RAD screening questions
- Log notes and scorecard in Gem
- Advance qualified candidates

**SLA:** Schedule within 24 hours. Notes within 24 hours of screen.

---

## Stage 4-9: See Full Documentation

For detailed guidance on all remaining stages, please refer to the complete Recruiting Process Playbook in Notion.`,
  },
  "demo-3": {
    title: "Interviewer Training 101",
    description: "The 5-stage certification program for becoming a calibrated interviewer at Luma.",
    type: "document",
    category: "Training",
    tags: ["interviewing", "training", "certification", "calibration"],
    body: `# Interviewer Training 101

## The 5-Stage Certification Program

Becoming a certified interviewer at Luma involves a structured program to ensure calibration, consistency, and quality.

---

## Stage 1: Nomination

**Who nominates:** Hiring Manager or Recruiting

**Criteria for nomination:**
- Has been at Luma for at least 90 days
- Demonstrates Luma values
- Has capacity for interview load
- Relevant domain expertise for the role type

---

## Stage 2: Training

**Format:** Self-paced + live session

**Curriculum:**
- Watch: "Calibrated Interviewing at Luma" (45 min video)
- Read: Interview question bank for your domain
- Complete: Bias awareness training
- Attend: Live calibration session (1 hour)

**Key Topics:**
- Structured interviewing methodology
- Evidence-based assessment
- Avoiding common biases
- Using scorecards effectively
- Legal considerations

---

## Stage 3: Shadow

**What you do:** Observe 2-3 interviews with a certified interviewer

**Focus areas:**
- How questions are asked
- How follow-ups probe for depth
- How evidence is captured
- How scorecards are completed

---

## Stage 4: Reverse Shadow

**What you do:** Lead 2-3 interviews while a certified interviewer observes

**Graduation criteria:**
- Consistent assessment quality
- Proper interview technique
- Accurate scorecard completion
- Aligned with hiring bar

---

## Stage 5: Graduate

**You're now certified to:**
- Conduct interviews independently
- Submit scorecards that inform hiring decisions
- Shadow new interviewer trainees

**Ongoing expectations:**
- Maintain feedback SLA (24 hours)
- Attend quarterly calibration sessions
- Flag any concerns about process or candidates`,
  },
  "demo-4": {
    title: "The Offer Playbook",
    description: "A 5-stage process for extending compelling offers that close candidates.",
    type: "playbook",
    category: "Closing",
    tags: ["offers", "closing", "compensation", "negotiation"],
    body: `# The Offer Playbook

## 5 Stages to Close

### Stage 1: Pre-Offer Alignment
Before building an offer, ensure alignment on:
- Compensation expectations
- Competing offers
- Timeline for decision
- Outstanding concerns

### Stage 2: Building in Complete.so
1. Copy application_id from Gem
2. Search in Complete.so
3. Create Offer (imports Gem data)
4. Review all details
5. Request team messages
6. Add competing offers (optional)
7. Save & Publish

### Stage 3: Verbal Offer
- Call the candidate
- Walk through key terms
- Gauge enthusiasm
- Address concerns
- Confirm timeline

### Stage 4: Written Offer & Negotiation
The package includes:
- Base salary
- Equity
- Sign-on bonus
- Start date
- Title and level

### Stage 5: Acceptance & Handoff
1. Update Gem status
2. Trigger pre-boarding workflows
3. Schedule welcome call
4. Hand off to People Ops
5. Celebrate! 🎉`,
  },
  "demo-5": {
    title: "SLAs & Communication Standards",
    description: "Our service level agreements and communication standards for candidate experience.",
    type: "document",
    category: "Standards",
    tags: ["sla", "communication", "candidate-experience", "standards"],
    body: `# SLAs & Communication Standards

## Our Philosophy: Speed, Clarity & Respect

Our SLAs uphold our core philosophy: **Fast, Friendly, and Fair**.

---

## Core Recruiting SLAs

| Stage | SLA Target | Owner |
|-------|------------|-------|
| Application Review | 48 Business Hours | Recruiter |
| Recruiter Screen Scheduling | 24 Business Hours | Recruiter |
| Interview Feedback | 24 Business Hours | Interviewer |
| HM Review | 48 Business Hours | Hiring Manager |
| Post-Loop Decision | 48 Business Hours | HM & Recruiter |
| Offer Approval | 24 Business Hours | Biz Ops |
| Rejection Notice | 48 Business Hours | Recruiter |
| Response to Inquiries | 24 Business Hours | Recruiter |

---

## Communication Standards

### Tone
**Luma AI Hiring Voice:**
- Aspirational
- Direct
- Inviting
- Human & Authentic

### Primary Channel
Use **Gem** for all candidate communication.

### Transparency
Be clear about process, timelines, and next steps.

### Personalization
Use templates efficiently, but personalize for high-priority candidates and later-stage rejections.`,
  },
  "demo-6": {
    title: "New Hire Onboarding Plan Template",
    description: "The 5-day structured onboarding template for new team members.",
    type: "checklist",
    category: "Onboarding",
    tags: ["onboarding", "new-hire", "template", "checklist"],
    body: `# New Hire Onboarding Plan

## Pre-Start
- Laptop ordered and configured
- Accounts created (Google, Slack, Notion, Gem)
- Calendar invites sent
- Welcome email sent
- Buddy assigned

## Day 1: Welcome & Orientation
- Welcome meeting with manager
- IT setup
- Security credentials
- Workspace tour
- HR paperwork
- Meet your buddy

## Day 2: Culture & Values
- Deep dive: Our North Star
- Team structure review
- Communication norms
- Meet key stakeholders
- Shadow a team meeting

## Day 3: Role Deep-Dive
- Role-specific training
- Review expectations
- Introduction to tools
- First small task

## Day 4: Cross-Functional Exposure
- Meet cross-functional partners
- Understand intersections
- Continue training
- Work on tasks

## Day 5: Integration & Feedback
- Complete training
- Set 30/60/90 day goals
- Team welcome lunch
- Submit feedback
- Week 1 retro with manager`,
  },
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
    const contentId = params.id as string;

    try {
      const res = await fetch(`/api/content/${contentId}`);
      if (res.ok) {
        const data = await res.json();
        setContent(data);
        if (data.progress?.checklistState) {
          setChecklistState(data.progress.checklistState);
        }
      } else {
        // Check for demo content
        const demoContent = demoContentMap[contentId];
        if (demoContent) {
          setContent({
            id: contentId,
            title: demoContent.title || "Content",
            description: demoContent.description || "",
            type: demoContent.type || "document",
            body: demoContent.body || "",
            videoUrl: null,
            category: demoContent.category || "General",
            tags: demoContent.tags || [],
            status: "published",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            authorName: "Luma Recruiting",
            authorImage: null,
            progress: null,
          });
        } else {
          // Generic fallback
          setContent({
            id: contentId,
            title: "Content Not Found",
            description: "This content could not be loaded.",
            type: "document",
            body: "The requested content is not available. Please try browsing the content library.",
            videoUrl: null,
            category: "General",
            tags: [],
            status: "published",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            authorName: "Unknown",
            authorImage: null,
            progress: null,
          });
        }
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

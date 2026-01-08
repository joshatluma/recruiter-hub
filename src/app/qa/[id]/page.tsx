"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import {
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  CheckCircle2,
  Clock,
  User,
  Tag,
  Send,
  Loader2,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface Answer {
  id: string;
  body: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  authorTitle: string;
  isAccepted: boolean;
  upvotes: number;
  createdAt: string;
}

interface Question {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorImage: string | null;
  tags: string[];
  resolved: boolean;
  createdAt: string;
  answers: Answer[];
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userVotes, setUserVotes] = useState<Record<string, boolean>>({});

  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user", id: "demo" };

  useEffect(() => {
    loadQuestion();
  }, [params.id]);

  async function loadQuestion() {
    try {
      const res = await fetch(`/api/questions/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setQuestion(data);
      } else {
        // Demo fallback
        setQuestion({
          id: params.id as string,
          title: "What's the best way to source senior ML engineers?",
          body: `I'm struggling to find qualified ML engineers with 5+ years of experience. What platforms and techniques have worked best for the team?

I've tried:
- LinkedIn Recruiter with various boolean searches
- GitHub looking at ML project contributors
- Machine learning communities on Discord

But I'm getting low response rates (under 5%). Any tips for improving outreach or finding better sourcing channels?`,
          authorId: "1",
          authorName: "Emily Davis",
          authorImage: null,
          tags: ["sourcing", "ml-engineering", "technical"],
          resolved: true,
          createdAt: "2024-01-15T10:30:00Z",
          answers: [
            {
              id: "a1",
              body: `Great question! Here are some strategies that have worked well for me:

**1. Academic Connections**
- Look at authors of recent ML papers on arXiv
- Check conference attendees (NeurIPS, ICML, etc.)
- Connect with PhD students nearing graduation

**2. Specialized Platforms**
- Kaggle (look at competition winners and top contributors)
- Hugging Face (active contributors to popular models)
- AI-specific job boards like ai-jobs.net

**3. Outreach Tips**
- Reference their specific work or papers
- Mention our ML stack and interesting problems
- Keep initial messages under 100 words
- Offer a technical conversation, not just a job pitch

The key is showing you understand their work. Generic ML outreach has terrible response rates.`,
              authorId: "2",
              authorName: "Sarah Chen",
              authorImage: null,
              authorTitle: "Senior Technical Recruiter",
              isAccepted: true,
              upvotes: 12,
              createdAt: "2024-01-15T14:20:00Z",
            },
            {
              id: "a2",
              body: `Adding to Sarah's great points - I've also had success with:

**Twitter/X Mining**
Many ML engineers are active on Twitter. Search for discussions about specific technologies we use and engage authentically before reaching out.

**Open Source Contributions**
Look at who's actively contributing to ML libraries like PyTorch, TensorFlow, scikit-learn. These folks often have strong fundamentals.

**Referral Campaigns**
Our current ML team knows other ML engineers. I've found that targeted referral campaigns with good incentives work better than cold outreach for senior roles.`,
              authorId: "3",
              authorName: "Mike Johnson",
              authorImage: null,
              authorTitle: "Recruiting Manager",
              isAccepted: false,
              upvotes: 8,
              createdAt: "2024-01-15T16:45:00Z",
            },
            {
              id: "a3",
              body: `One more tip: timing matters!

ML engineers often get approached right after big layoffs or company announcements. But the best time is often 6-12 months after they've joined a company - they've learned what they wanted, and may be ready for the next challenge.

I track company news for our target companies and reach out strategically.`,
              authorId: "4",
              authorName: "James Wilson",
              authorImage: null,
              authorTitle: "Senior Recruiter",
              isAccepted: false,
              upvotes: 5,
              createdAt: "2024-01-16T09:10:00Z",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error loading question:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitAnswer() {
    if (!newAnswer.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/questions/${params.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: newAnswer }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestion((prev) =>
          prev ? { ...prev, answers: [...prev.answers, data] } : prev
        );
        setNewAnswer("");
      } else {
        // Demo fallback - add locally
        if (question) {
          setQuestion({
            ...question,
            answers: [
              ...question.answers,
              {
                id: `demo-${Date.now()}`,
                body: newAnswer,
                authorId: user.id,
                authorName: user.name,
                authorImage: null,
                authorTitle: "Recruiter",
                isAccepted: false,
                upvotes: 0,
                createdAt: new Date().toISOString(),
              },
            ],
          });
          setNewAnswer("");
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpvote(answerId: string) {
    if (userVotes[answerId]) return;

    setUserVotes({ ...userVotes, [answerId]: true });
    setQuestion((prev) =>
      prev
        ? {
            ...prev,
            answers: prev.answers.map((a) =>
              a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
            ),
          }
        : prev
    );

    // API call would go here
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `${hours} hours ago`;
    }
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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

  if (!question) {
    return (
      <AppLayout user={user}>
        <div className="max-w-4xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Question Not Found</h1>
          <Link href="/qa" className="btn-primary">
            Back to Q&A
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/qa"
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Q&A
        </Link>

        {/* Question */}
        <div className="surface rounded-xl p-6 mb-6 animate-fade-in-up">
          <div className="flex items-start gap-4">
            {/* Vote column */}
            <div className="flex flex-col items-center gap-1 min-w-[50px]">
              <span className="text-2xl font-bold text-[var(--text-primary)]">
                {question.answers.reduce((sum, a) => sum + a.upvotes, 0)}
              </span>
              <span className="text-xs text-[var(--text-muted)]">votes</span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {question.title}
                </h1>
                {question.resolved && (
                  <span className="badge-success flex items-center gap-1 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Resolved
                  </span>
                )}
              </div>

              <div className="whitespace-pre-wrap text-[var(--text-secondary)] mb-4">
                {question.body}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Clock className="w-4 h-4" />
                  Asked {formatDate(question.createdAt)}
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)]">
                  {question.authorImage ? (
                    <img src={question.authorImage} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-[var(--accent-primary)]" />
                    </div>
                  )}
                  <span className="text-[var(--text-secondary)]">{question.authorName}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
          </h2>
          <select className="input w-auto text-sm py-2">
            <option>Highest voted</option>
            <option>Newest first</option>
            <option>Oldest first</option>
          </select>
        </div>

        {/* Answers */}
        <div className="space-y-4 mb-8">
          {question.answers
            .sort((a, b) => {
              if (a.isAccepted) return -1;
              if (b.isAccepted) return 1;
              return b.upvotes - a.upvotes;
            })
            .map((answer, index) => (
              <div
                key={answer.id}
                className={`surface rounded-xl p-6 animate-fade-in-up ${
                  answer.isAccepted ? "ring-2 ring-[var(--accent-success)]/30" : ""
                }`}
                style={{ animationDelay: `${0.1 * (index + 1)}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-2 min-w-[50px]">
                    <button
                      onClick={() => handleUpvote(answer.id)}
                      disabled={userVotes[answer.id]}
                      className={`p-2 rounded-lg transition-colors ${
                        userVotes[answer.id]
                          ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]"
                          : "hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
                      }`}
                    >
                      <ThumbsUp className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-[var(--text-primary)]">{answer.upvotes}</span>
                    {answer.isAccepted && (
                      <div className="w-8 h-8 rounded-full bg-[var(--accent-success)] flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {answer.isAccepted && (
                      <div className="flex items-center gap-2 mb-3 text-[var(--accent-success)]">
                        <Award className="w-4 h-4" />
                        <span className="text-sm font-medium">Accepted Answer</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap text-[var(--text-secondary)] mb-4">
                      {answer.body.split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return (
                            <p key={i} className="font-semibold text-[var(--text-primary)] mt-4 mb-2">
                              {line.replace(/\*\*/g, "")}
                            </p>
                          );
                        }
                        if (line.startsWith("- ")) {
                          return (
                            <p key={i} className="ml-4">
                              {line}
                            </p>
                          );
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
                      <span className="text-sm text-[var(--text-muted)]">
                        Answered {formatDate(answer.createdAt)}
                      </span>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)]">
                        {answer.authorImage ? (
                          <img src={answer.authorImage} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                              {answer.authorName.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-sm text-[var(--text-primary)]">{answer.authorName}</span>
                          <span className="text-xs text-[var(--text-muted)] ml-2">{answer.authorTitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Add answer */}
        <div className="surface rounded-xl p-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[var(--accent-primary)]" />
            Your Answer
          </h3>

          <textarea
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Share your knowledge or experience..."
            className="input min-h-[150px] resize-none mb-4"
            rows={6}
          />

          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              Be helpful and respectful. Format with markdown.
            </p>
            <button
              onClick={handleSubmitAnswer}
              disabled={!newAnswer.trim() || submitting}
              className="btn-primary flex items-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              Post Answer
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

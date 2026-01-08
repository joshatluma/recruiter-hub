"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import {
  ArrowLeft,
  Sparkles,
  Send,
  Loader2,
  Tag,
  User,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

const suggestedTags = [
  "sourcing",
  "screening",
  "interviews",
  "offers",
  "greenhouse",
  "candidate-experience",
  "dei",
  "technical",
  "compensation",
  "onboarding",
];

function AskQuestionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expertId = searchParams.get("expert");

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAiFirst, setShowAiFirst] = useState(true);

  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  async function handleAskAI() {
    if (!title.trim()) return;
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: title, context: body }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAnswer(data.answer);
      } else {
        // Demo fallback
        setAiAnswer(`Based on our knowledge base, here's what I found about "${title}":

**Key Points:**
- This is a common question in recruiting
- Best practices suggest a structured approach
- Consider the candidate experience at every step

**Recommendations:**
1. Start by reviewing our relevant training materials
2. Consult with an expert if you need more specific guidance
3. Document your approach for future reference

If this doesn't fully answer your question, feel free to post it for the team to see.`);
      }
    } catch (error) {
      console.error("Error getting AI answer:", error);
      setAiAnswer("I couldn't find a specific answer in our knowledge base. Consider posting this question for the team.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          body,
          tags: selectedTags,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/qa/${data.id}`);
      } else {
        // Demo - redirect to Q&A page
        router.push("/qa");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      router.push("/qa");
    }
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addCustomTag() {
    const tag = customTag.toLowerCase().trim().replace(/\s+/g, "-");
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setCustomTag("");
    }
  }

  return (
    <AppLayout user={user}>
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <Link
          href="/qa"
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Q&A
        </Link>

        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Ask a Question
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Get help from AI or share with the team
          </p>
        </div>

        {/* AI First Option */}
        {showAiFirst && !aiAnswer && (
          <div className="surface-elevated rounded-xl p-6 mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-[var(--text-primary)] mb-1">
                  Try AI First
                </h2>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  AI will search our knowledge base to find an answer. If it can&apos;t help, you can post for the team.
                </p>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What would you like to know?"
                    className="input"
                  />
                  <button
                    onClick={handleAskAI}
                    disabled={!title.trim() || aiLoading}
                    className="btn-primary flex items-center gap-2"
                  >
                    {aiLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Ask AI
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Answer */}
        {aiAnswer && (
          <div className="surface rounded-xl overflow-hidden mb-6 animate-fade-in-up">
            <div className="p-4 border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[var(--accent-primary)]" />
                <h3 className="font-semibold text-[var(--text-primary)]">AI Answer</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="whitespace-pre-wrap text-[var(--text-secondary)]">
                {aiAnswer}
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)]">
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Was this helpful? If not, post your question for the team.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => router.push("/qa")}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    This Answered My Question
                  </button>
                  <button
                    onClick={() => setShowAiFirst(false)}
                    className="btn-ghost flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Post for Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        {(!showAiFirst || aiAnswer) && (
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {/* Title */}
            <div className="surface rounded-xl p-5">
              <label className="block font-semibold text-[var(--text-primary)] mb-2">
                Question Title
              </label>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Be specific and imagine you&apos;re asking a person
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., How should I handle a counter-offer situation?"
                className="input"
              />
            </div>

            {/* Body */}
            <div className="surface rounded-xl p-5">
              <label className="block font-semibold text-[var(--text-primary)] mb-2">
                Details
              </label>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Include context and what you&apos;ve already tried
              </p>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Provide details about your situation..."
                className="input min-h-[150px] resize-none"
                rows={6}
              />
            </div>

            {/* Tags */}
            <div className="surface rounded-xl p-5">
              <label className="block font-semibold text-[var(--text-primary)] mb-2">
                Tags
              </label>
              <p className="text-sm text-[var(--text-muted)] mb-3">
                Add tags to help others find your question
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-sm px-3 py-1.5 rounded-lg transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30"
                        : "bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomTag()}
                  placeholder="Add custom tag..."
                  className="input flex-1"
                />
                <button onClick={addCustomTag} className="btn-secondary">
                  Add
                </button>
              </div>

              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                  <span className="text-sm text-[var(--text-muted)]">Selected:</span>
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="badge flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => toggleTag(tag)}
                        className="ml-1 hover:text-[var(--accent-danger)]"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                Your question will be visible to all team members
              </p>
              <button
                onClick={handleSubmit}
                disabled={!title.trim() || !body.trim() || submitting}
                className="btn-primary flex items-center gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                Post Question
              </button>
            </div>
          </div>
        )}

        {/* Skip AI option */}
        {showAiFirst && !aiAnswer && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAiFirst(false)}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
            >
              Skip AI and post directly to the team
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function AskQuestionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-atmosphere" />}>
      <AskQuestionContent />
    </Suspense>
  );
}

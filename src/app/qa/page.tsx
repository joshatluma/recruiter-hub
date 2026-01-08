import AppLayout from "@/components/layout/AppLayout";
import {
  Search,
  Plus,
  MessageCircle,
  CheckCircle2,
  Clock,
  ThumbsUp,
  User,
  Sparkles,
  Filter,
} from "lucide-react";
import Link from "next/link";

// Mock Q&A data
const questions = [
  {
    id: "1",
    title: "What's the best way to source senior ML engineers?",
    body: "I'm struggling to find qualified ML engineers with 5+ years of experience. What platforms and techniques have worked best for the team?",
    author: "Emily Davis",
    authorImage: null,
    createdAt: "2 hours ago",
    tags: ["sourcing", "ml-engineering", "technical"],
    answers: 3,
    resolved: true,
    upvotes: 12,
  },
  {
    id: "2",
    title: "How do we handle counter-offers?",
    body: "A candidate just received a counter-offer from their current employer. What's our approach for handling these situations?",
    author: "New Recruiter",
    authorImage: null,
    createdAt: "5 hours ago",
    tags: ["offers", "negotiation", "closing"],
    answers: 5,
    resolved: true,
    upvotes: 8,
  },
  {
    id: "3",
    title: "Interview scheduling best practices for candidates in different time zones?",
    body: "We have a candidate in Asia Pacific and need to coordinate interviews with our US-based team. Any tips for making this smoother?",
    author: "Lisa Park",
    authorImage: null,
    createdAt: "1 day ago",
    tags: ["interviews", "scheduling", "remote"],
    answers: 2,
    resolved: false,
    upvotes: 5,
  },
  {
    id: "4",
    title: "When should we involve the hiring manager in initial screens?",
    body: "Some hiring managers want to be on initial phone screens. Is there a policy or best practice for when this makes sense?",
    author: "Sarah Chen",
    authorImage: null,
    createdAt: "2 days ago",
    tags: ["screening", "hiring-managers", "process"],
    answers: 4,
    resolved: true,
    upvotes: 15,
  },
  {
    id: "5",
    title: "Greenhouse workflow for confidential searches?",
    body: "We're working on a confidential executive search. How should we set up the job in Greenhouse to limit visibility?",
    author: "James Wilson",
    authorImage: null,
    createdAt: "3 days ago",
    tags: ["greenhouse", "executive-search", "confidential"],
    answers: 2,
    resolved: true,
    upvotes: 7,
  },
];

const filters = [
  { value: "all", label: "All Questions" },
  { value: "unanswered", label: "Unanswered" },
  { value: "resolved", label: "Resolved" },
  { value: "my-questions", label: "My Questions" },
];

export default function QAPage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  return (
    <AppLayout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
              Q&A
            </h1>
            <p className="text-[var(--text-secondary)] mt-1">
              Ask questions and share knowledge with the team
            </p>
          </div>
          <Link href="/qa/ask" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Ask Question
          </Link>
        </div>

        {/* AI Answer box */}
        <div className="surface-elevated rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">Ask AI First</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                AI will try to answer from our knowledge base
              </p>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Type your question... (e.g., 'How do I write a good sourcing email?')"
              className="input pr-24"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-1.5 px-3 text-sm">
              Ask AI
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search questions..."
              className="input pl-10"
            />
          </div>
          <select className="input w-auto min-w-[160px]">
            {filters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>

        {/* Questions list */}
        <div className="space-y-3 stagger-children">
          {questions.map((question) => (
            <Link
              key={question.id}
              href={`/qa/${question.id}`}
              className="block surface rounded-xl p-5 card-hover"
            >
              <div className="flex items-start gap-4">
                {/* Vote count */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1 text-center min-w-[50px]">
                  <button className="p-1 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--accent-primary)]">
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className="font-semibold text-[var(--text-primary)]">{question.upvotes}</span>
                  <span className="text-xs text-[var(--text-muted)]">votes</span>
                </div>

                {/* Answer count */}
                <div className={`flex-shrink-0 flex flex-col items-center gap-1 text-center min-w-[50px] p-2 rounded-lg ${
                  question.resolved
                    ? "bg-[var(--accent-success)]/10 border border-[var(--accent-success)]/20"
                    : question.answers > 0
                    ? "bg-[var(--bg-tertiary)]"
                    : ""
                }`}>
                  <span className={`font-semibold ${question.resolved ? "text-[var(--accent-success)]" : "text-[var(--text-primary)]"}`}>
                    {question.answers}
                  </span>
                  <span className={`text-xs ${question.resolved ? "text-[var(--accent-success)]" : "text-[var(--text-muted)]"}`}>
                    {question.resolved ? "resolved" : "answers"}
                  </span>
                </div>

                {/* Question content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
                    {question.body}
                  </p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex flex-wrap gap-1.5">
                      {question.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-[var(--text-muted)] ml-auto flex items-center gap-1">
                      <User className="w-3.5 h-3.5" />
                      {question.author}
                      <span className="mx-1">·</span>
                      <Clock className="w-3.5 h-3.5" />
                      {question.createdAt}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

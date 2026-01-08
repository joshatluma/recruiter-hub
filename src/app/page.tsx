import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  Users,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Content Library",
    description: "Training materials, playbooks, and documentation in one place",
  },
  {
    icon: GraduationCap,
    title: "Learning Paths",
    description: "Structured onboarding and skill development tracks",
  },
  {
    icon: Sparkles,
    title: "AI Copilot",
    description: "Generate content with Gemini-powered assistance",
  },
  {
    icon: Users,
    title: "Expert Directory",
    description: "Find and learn from subject matter experts",
  },
  {
    icon: Trophy,
    title: "Gamification",
    description: "Earn points, badges, and climb the leaderboard",
  },
];

const benefits = [
  "Accelerate recruiter onboarding",
  "Ensure consistent practices",
  "Enable continuous learning",
  "Capture institutional knowledge",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-atmosphere bg-grid">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 text-[var(--accent-primary)] text-sm font-medium mb-6 animate-fade-in-up">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </div>

            <h1
              className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 animate-fade-in-up"
              style={{ fontFamily: "var(--font-playfair)", animationDelay: "0.1s" }}
            >
              Recruiter{" "}
              <span className="text-gradient">Hub</span>
            </h1>

            <p
              className="text-xl text-[var(--text-secondary)] mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Your recruiting enablement platform. Training, processes, workflows,
              and knowledge — all in one place.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/auth/signin" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/dashboard" className="btn-secondary flex items-center gap-2 text-lg px-8 py-4">
                View Demo
              </Link>
            </div>

            <p
              className="text-sm text-[var(--text-muted)] mt-4 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              For Luma Labs recruiting team
            </p>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2
          className="text-3xl font-bold text-[var(--text-primary)] text-center mb-12"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Everything You Need
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="surface rounded-xl p-6 card-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-[var(--accent-primary)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                {feature.title}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="surface rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-3xl font-bold text-[var(--text-primary)] mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Level Up Your Recruiting Team
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--accent-success)]" />
                    <span className="text-[var(--text-secondary)]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-[var(--accent-primary)] mx-auto mb-4" />
                  <p className="text-lg font-semibold text-[var(--text-primary)]">
                    AI-Powered Learning
                  </p>
                  <p className="text-[var(--text-secondary)]">
                    Create and discover content faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[var(--text-muted)]">
            Recruiter Hub by Luma Labs
          </p>
        </div>
      </footer>
    </div>
  );
}

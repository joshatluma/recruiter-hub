import AppLayout from "@/components/layout/AppLayout";
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  BookOpen,
  Trophy,
  Lock,
} from "lucide-react";
import Link from "next/link";

// Mock learning path data
const onboardingPath = {
  id: "onboarding",
  title: "New Recruiter Onboarding",
  description: "Complete this path to get up to speed with recruiting at Luma Labs.",
  totalModules: 8,
  completedModules: 3,
  estimatedHours: 6,
  modules: [
    {
      id: "m1",
      title: "Welcome to Luma Labs Recruiting",
      description: "Introduction to our team, culture, and recruiting philosophy.",
      duration: "30 min",
      completed: true,
    },
    {
      id: "m2",
      title: "Understanding Our Tech Stack",
      description: "Overview of the technologies we use and what to look for in candidates.",
      duration: "45 min",
      completed: true,
    },
    {
      id: "m3",
      title: "Greenhouse ATS Fundamentals",
      description: "Learn how to navigate and use our applicant tracking system.",
      duration: "1 hr",
      completed: true,
    },
    {
      id: "m4",
      title: "Sourcing Strategies",
      description: "Effective techniques for finding great candidates.",
      duration: "1 hr",
      completed: false,
      current: true,
    },
    {
      id: "m5",
      title: "Screening & Phone Interviews",
      description: "How to conduct effective initial candidate conversations.",
      duration: "45 min",
      completed: false,
    },
    {
      id: "m6",
      title: "Interview Coordination",
      description: "Managing the interview process and stakeholder communication.",
      duration: "30 min",
      completed: false,
    },
    {
      id: "m7",
      title: "Offer Management",
      description: "Crafting and extending competitive offers.",
      duration: "45 min",
      completed: false,
    },
    {
      id: "m8",
      title: "Candidate Experience Excellence",
      description: "Ensuring every candidate has a great experience with Luma.",
      duration: "30 min",
      completed: false,
    },
  ],
};

const explorePaths = [
  {
    id: "advanced-sourcing",
    title: "Advanced Sourcing Techniques",
    description: "Master Boolean search, X-ray techniques, and passive candidate outreach.",
    modules: 5,
    estimatedHours: 4,
    level: "Intermediate",
  },
  {
    id: "dei-recruiting",
    title: "Inclusive Recruiting Practices",
    description: "Build diverse teams through intentional, bias-aware recruiting.",
    modules: 6,
    estimatedHours: 3,
    level: "All Levels",
  },
  {
    id: "exec-recruiting",
    title: "Executive Search",
    description: "Strategies for sourcing and closing senior leadership roles.",
    modules: 4,
    estimatedHours: 3,
    level: "Advanced",
  },
];

export default function LearnPage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };
  const progress = (onboardingPath.completedModules / onboardingPath.totalModules) * 100;

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Learning Paths
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Structured training to level up your recruiting skills
          </p>
        </div>

        {/* Onboarding path (featured) */}
        <div className="surface rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="p-6 bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border-b border-[var(--border-subtle)]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="badge mb-2">Required for New Hires</span>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">
                    {onboardingPath.title}
                  </h2>
                  <p className="text-[var(--text-secondary)] mt-1">
                    {onboardingPath.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[var(--accent-primary)]">
                  {Math.round(progress)}%
                </p>
                <p className="text-sm text-[var(--text-muted)]">Complete</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-2">
                <span>{onboardingPath.completedModules} of {onboardingPath.totalModules} modules</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  ~{onboardingPath.estimatedHours} hours total
                </span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Module list */}
          <div className="divide-y divide-[var(--border-subtle)]">
            {onboardingPath.modules.map((module, index) => (
              <Link
                key={module.id}
                href={`/learn/${onboardingPath.id}/${module.id}`}
                className={`flex items-center gap-4 p-4 transition-colors ${
                  module.completed
                    ? "hover:bg-[var(--bg-tertiary)]"
                    : module.current
                    ? "bg-[var(--accent-primary)]/5 hover:bg-[var(--accent-primary)]/10"
                    : "opacity-60 hover:opacity-80"
                }`}
              >
                <div className="flex-shrink-0">
                  {module.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-[var(--accent-success)]" />
                  ) : module.current ? (
                    <div className="w-6 h-6 rounded-full border-2 border-[var(--accent-primary)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)]" />
                    </div>
                  ) : (
                    <Circle className="w-6 h-6 text-[var(--text-muted)]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[var(--text-muted)]">Module {index + 1}</span>
                    {module.current && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-primary)] text-white">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className={`font-medium ${module.completed ? "text-[var(--text-secondary)]" : "text-[var(--text-primary)]"}`}>
                    {module.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-1">
                    {module.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Explore more paths */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">
            Explore More Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {explorePaths.map((path) => (
              <Link
                key={path.id}
                href={`/learn/${path.id}`}
                className="surface rounded-xl p-5 card-hover"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[var(--accent-secondary)]" />
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    {path.level}
                  </span>
                </div>

                <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                  {path.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
                  {path.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {path.modules} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{path.estimatedHours}h
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

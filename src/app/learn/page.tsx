"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  ChevronRight,
  Clock,
  BookOpen,
  Loader2,
  Users,
  Award,
  Briefcase,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  isOnboarding: boolean;
  order: number;
  itemCount: number;
}

// Demo learning paths based on real Luma content
const demoOnboardingPath = {
  id: "onboarding",
  title: "New Recruiter Onboarding",
  description: "Essential training for new recruiting team members at Luma.",
  totalModules: 5,
  completedModules: 0,
  estimatedHours: 4,
  modules: [
    {
      id: "m1",
      title: "Our North Star: Luma's Mission & Values",
      description: "Understand Luma's mission and the 7 core values that guide every hiring decision.",
      duration: "30 min",
      completed: false,
      current: true,
    },
    {
      id: "m2",
      title: "The Recruiting Process Playbook",
      description: "Our complete standard operating procedure for hiring—from intake to offer.",
      duration: "45 min",
      completed: false,
    },
    {
      id: "m3",
      title: "SLAs & Communication Standards",
      description: "Service level agreements and communication standards for candidate experience.",
      duration: "30 min",
      completed: false,
    },
    {
      id: "m4",
      title: "Recruiting Tech Stack Overview",
      description: "Core tools for sourcing, interviewing, and hiring at Luma.",
      duration: "45 min",
      completed: false,
    },
    {
      id: "m5",
      title: "The Recruiter Alignment Document (RAD)",
      description: "How to use RADs effectively for role alignment and success.",
      duration: "30 min",
      completed: false,
    },
  ],
};

const demoExplorePaths = [
  {
    id: "interviewer-certification",
    title: "Interviewer Certification Path",
    description: "Complete this path to become a certified interviewer at Luma.",
    modules: 2,
    estimatedHours: 2,
    level: "Required",
    icon: Award,
  },
  {
    id: "closing-offers",
    title: "Closing & Offers Mastery",
    description: "Master the art of extending and closing offers.",
    modules: 2,
    estimatedHours: 1,
    level: "Intermediate",
    icon: Briefcase,
  },
  {
    id: "hiring-manager",
    title: "Hiring Manager Essentials",
    description: "Key training for hiring managers working with the recruiting team.",
    modules: 4,
    estimatedHours: 2,
    level: "For HMs",
    icon: Users,
  },
  {
    id: "scheduling",
    title: "Scheduling & Coordination",
    description: "Training for coordinators and scheduling operations.",
    modules: 3,
    estimatedHours: 1,
    level: "Operations",
    icon: Calendar,
  },
];

export default function LearnPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  useEffect(() => {
    loadPaths();
  }, []);

  async function loadPaths() {
    try {
      const res = await fetch("/api/learning-paths");
      if (res.ok) {
        const data = await res.json();
        setPaths(data);
      }
    } catch (error) {
      console.error("Error loading paths:", error);
    } finally {
      setLoading(false);
    }
  }

  // Use real data or fallback to demo
  const onboardingPath = demoOnboardingPath;
  const explorePaths = demoExplorePaths;
  const progress = (onboardingPath.completedModules / onboardingPath.totalModules) * 100;

  if (loading) {
    return (
      <AppLayout user={user}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-primary)]" />
        </div>
      </AppLayout>
    );
  }

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
                href={`/content/demo-${index + 1}`}
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
                        Start Here
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {explorePaths.map((path) => {
              const IconComponent = path.icon;
              return (
                <Link
                  key={path.id}
                  href={`/learn/${path.id}`}
                  className="surface rounded-xl p-5 card-hover"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-secondary)]/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-[var(--accent-secondary)]" />
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
              );
            })}
          </div>
        </div>

        {/* Info callout */}
        <div className="surface rounded-xl p-6 border-l-4 border-[var(--accent-primary)] animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            About Learning Paths
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Learning paths are curated sequences of content designed to build your skills systematically.
            Complete the <strong>New Recruiter Onboarding</strong> path first to get familiar with Luma&apos;s
            recruiting philosophy, processes, and tools. Then explore specialized paths based on your role and interests.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}

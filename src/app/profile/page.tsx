import AppLayout from "@/components/layout/AppLayout";
import {
  User,
  Mail,
  Award,
  Trophy,
  BookOpen,
  MessageCircle,
  Heart,
  TrendingUp,
  Calendar,
  Edit,
  Star,
  CheckCircle2,
} from "lucide-react";

// Mock user profile data
const profileData = {
  name: "Demo User",
  email: "demo@lumalabs.ai",
  title: "Recruiter",
  bio: "Focused on technical recruiting for the engineering team. Always learning and improving my craft.",
  joinedDate: "January 2024",
  image: null,
  role: "user",
  expertise: ["Technical Recruiting", "Sourcing", "Interview Coordination"],
  stats: {
    points: 1250,
    rank: 7,
    streak: 7,
    contentCompleted: 12,
    contentCreated: 2,
    questionsAsked: 3,
    answersGiven: 5,
    kudosGiven: 15,
    kudosReceived: 8,
  },
  badges: [
    { name: "Quick Learner", description: "Completed 10+ content items", icon: BookOpen },
    { name: "7-Day Streak", description: "Maintained a 7-day learning streak", icon: TrendingUp },
    { name: "Helpful", description: "Answered 5+ questions", icon: MessageCircle },
  ],
  recentActivity: [
    { type: "completed", title: "Technical Sourcing Best Practices", date: "2 days ago", points: 10 },
    { type: "answered", title: "Best way to source senior ML engineers?", date: "3 days ago", points: 15 },
    { type: "kudos_received", title: "Kudos from Sarah Chen", date: "4 days ago", points: 10 },
    { type: "completed", title: "Interview Evaluation Framework", date: "1 week ago", points: 10 },
    { type: "created", title: "New Hire Checklist Template", date: "2 weeks ago", points: 50 },
  ],
};

const activityIcons: Record<string, typeof BookOpen> = {
  completed: CheckCircle2,
  answered: MessageCircle,
  kudos_received: Heart,
  created: BookOpen,
};

export default function ProfilePage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile header */}
        <div className="surface rounded-2xl overflow-hidden animate-fade-in-up">
          {/* Cover gradient */}
          <div className="h-32 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)]" />

          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative">
                {profileData.image ? (
                  <img
                    src={profileData.image}
                    alt={profileData.name}
                    className="w-24 h-24 rounded-2xl border-4 border-[var(--bg-secondary)]"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl border-4 border-[var(--bg-secondary)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {profileData.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                )}
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border-default)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              </div>

              {/* Name and title */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                  {profileData.name}
                </h1>
                <p className="text-[var(--text-secondary)]">{profileData.title}</p>
              </div>

              {/* Quick stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gradient">{profileData.stats.points}</p>
                  <p className="text-sm text-[var(--text-muted)]">Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--text-primary)]">#{profileData.stats.rank}</p>
                  <p className="text-sm text-[var(--text-muted)]">Rank</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[var(--accent-warning)]">{profileData.stats.streak}</p>
                  <p className="text-sm text-[var(--text-muted)]">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Bio and details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[var(--text-secondary)]">{profileData.bio}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {profileData.expertise.map((skill) => (
                    <span key={skill} className="badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {profileData.email}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Joined {profileData.joinedDate}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats breakdown */}
          <div className="surface rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--accent-warning)]" />
              Your Stats
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Content Completed
                </span>
                <span className="font-semibold text-[var(--text-primary)]">{profileData.stats.contentCompleted}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Content Created
                </span>
                <span className="font-semibold text-[var(--text-primary)]">{profileData.stats.contentCreated}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Questions Asked
                </span>
                <span className="font-semibold text-[var(--text-primary)]">{profileData.stats.questionsAsked}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Answers Given
                </span>
                <span className="font-semibold text-[var(--text-primary)]">{profileData.stats.answersGiven}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                <span className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Kudos Given / Received
                </span>
                <span className="font-semibold text-[var(--text-primary)]">
                  {profileData.stats.kudosGiven} / {profileData.stats.kudosReceived}
                </span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="surface rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[var(--accent-secondary)]" />
              Badges Earned
            </h2>
            <div className="space-y-3">
              {profileData.badges.map((badge) => (
                <div
                  key={badge.name}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-[var(--accent-primary)]/5 to-[var(--accent-secondary)]/5 border border-[var(--accent-primary)]/10"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-[var(--accent-primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-[var(--text-primary)]">{badge.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg border border-dashed border-[var(--border-default)] text-center">
              <p className="text-sm text-[var(--text-muted)]">
                Keep learning to earn more badges!
              </p>
            </div>
          </div>

          {/* Recent activity */}
          <div className="surface rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[var(--accent-success)]" />
              Recent Activity
            </h2>
            <div className="space-y-3">
              {profileData.recentActivity.map((activity, index) => {
                const Icon = activityIcons[activity.type] || BookOpen;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[var(--text-muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[var(--text-primary)] line-clamp-1">
                        {activity.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{activity.date}</p>
                    </div>
                    <span className="text-xs font-medium text-[var(--accent-success)]">
                      +{activity.points}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

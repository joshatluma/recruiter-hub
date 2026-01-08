import AppLayout from "@/components/layout/AppLayout";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Star,
  MessageCircle,
  BookOpen,
  Heart,
  Crown,
} from "lucide-react";

// Mock leaderboard data
const leaderboard = [
  {
    rank: 1,
    id: "2",
    name: "Mike Johnson",
    title: "Recruiting Manager",
    image: null,
    points: 3120,
    change: "+180",
    stats: { learning: 45, contributions: 18, answers: 56 },
    streak: 14,
  },
  {
    rank: 2,
    id: "6",
    name: "James Wilson",
    title: "Senior Recruiter",
    image: null,
    points: 2780,
    change: "+95",
    stats: { learning: 38, contributions: 14, answers: 47 },
    streak: 8,
  },
  {
    rank: 3,
    id: "1",
    name: "Sarah Chen",
    title: "Senior Technical Recruiter",
    image: null,
    points: 2450,
    change: "+120",
    stats: { learning: 42, contributions: 12, answers: 34 },
    streak: 12,
  },
  {
    rank: 4,
    id: "4",
    name: "David Kim",
    title: "DEI Program Lead",
    image: null,
    points: 2100,
    change: "+65",
    stats: { learning: 35, contributions: 15, answers: 42 },
    streak: 5,
  },
  {
    rank: 5,
    id: "3",
    name: "Emily Davis",
    title: "Recruiter",
    image: null,
    points: 1890,
    change: "+110",
    stats: { learning: 30, contributions: 8, answers: 28 },
    streak: 7,
  },
  {
    rank: 6,
    id: "5",
    name: "Lisa Park",
    title: "Recruiting Operations",
    image: null,
    points: 1650,
    change: "+45",
    stats: { learning: 28, contributions: 9, answers: 31 },
    streak: 3,
  },
  {
    rank: 7,
    id: "7",
    name: "Demo User",
    title: "Recruiter",
    image: null,
    points: 1250,
    change: "+150",
    stats: { learning: 12, contributions: 2, answers: 5 },
    streak: 7,
    isCurrentUser: true,
  },
];

const pointsBreakdown = [
  { action: "Complete content", points: "+10", icon: BookOpen },
  { action: "Create content (approved)", points: "+50", icon: BookOpen },
  { action: "Answer question", points: "+15", icon: MessageCircle },
  { action: "Answer accepted", points: "+25", icon: Star },
  { action: "Give kudos", points: "+5", icon: Heart },
  { action: "Receive kudos", points: "+10", icon: Heart },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-300" />;
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 h-6 flex items-center justify-center text-[var(--text-muted)] font-bold">{rank}</span>;
};

const getRankBg = (rank: number) => {
  if (rank === 1) return "bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20";
  if (rank === 2) return "bg-gradient-to-r from-gray-300/10 to-gray-400/10 border-gray-400/20";
  if (rank === 3) return "bg-gradient-to-r from-amber-600/10 to-orange-600/10 border-amber-600/20";
  return "";
};

export default function LeaderboardPage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  return (
    <AppLayout user={user}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Leaderboard
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Top contributors across learning and knowledge sharing
          </p>
        </div>

        {/* Top 3 spotlight */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {leaderboard.slice(0, 3).map((person, index) => (
            <div
              key={person.id}
              className={`surface rounded-xl p-6 text-center ${index === 0 ? "ring-2 ring-yellow-500/30" : ""} ${
                index === 0 ? "-mt-4 mb-4" : ""
              }`}
            >
              <div className="relative inline-block mb-3">
                {person.image ? (
                  <img src={person.image} alt={person.name} className="w-20 h-20 rounded-full" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {person.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-300" : "bg-amber-600"
                }`}>
                  <span className="text-sm font-bold text-black">{person.rank}</span>
                </div>
              </div>

              <h3 className="font-semibold text-[var(--text-primary)]">{person.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-3">{person.title}</p>

              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-gradient">
                {person.points.toLocaleString()}
              </div>
              <p className="text-sm text-[var(--accent-success)]">{person.change} this week</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Full leaderboard */}
          <div className="lg:col-span-2 surface rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="p-4 border-b border-[var(--border-subtle)]">
              <h2 className="font-semibold text-[var(--text-primary)]">All-Time Rankings</h2>
            </div>

            <div className="divide-y divide-[var(--border-subtle)]">
              {leaderboard.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center gap-4 p-4 transition-colors hover:bg-[var(--bg-tertiary)] ${
                    getRankBg(person.rank)
                  } ${person.isCurrentUser ? "bg-[var(--accent-primary)]/5 border-l-2 border-l-[var(--accent-primary)]" : ""}`}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {getRankIcon(person.rank)}
                  </div>

                  {/* Avatar */}
                  {person.image ? (
                    <img src={person.image} alt={person.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {person.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}

                  {/* Name and title */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[var(--text-primary)]">
                        {person.name}
                      </h3>
                      {person.isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--accent-primary)] text-white">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{person.title}</p>
                  </div>

                  {/* Streak */}
                  <div className="flex items-center gap-1 text-sm text-[var(--accent-warning)]">
                    <TrendingUp className="w-4 h-4" />
                    {person.streak}d
                  </div>

                  {/* Points */}
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-[var(--text-primary)]">
                      {person.points.toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--accent-success)]">{person.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Points breakdown */}
          <div className="surface rounded-xl p-5 h-fit animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--accent-warning)]" />
              How to Earn Points
            </h2>

            <div className="space-y-3">
              {pointsBreakdown.map((item) => (
                <div
                  key={item.action}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{item.action}</span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--accent-success)]">
                    {item.points}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border border-[var(--accent-primary)]/20">
              <p className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Pro tip:</strong> Maintain a daily learning streak to climb the leaderboard faster!
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

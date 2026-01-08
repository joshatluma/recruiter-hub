import AppLayout from "@/components/layout/AppLayout";
import {
  Search,
  Star,
  MessageCircle,
  Award,
  Briefcase,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Mock expert data
const experts = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Senior Technical Recruiter",
    image: null,
    expertise: ["Technical Recruiting", "Engineering Hiring", "Sourcing"],
    points: 2450,
    questionsAnswered: 34,
    contentCreated: 12,
    badges: ["Top Contributor", "Expert"],
    bio: "5+ years specializing in engineering and product hiring. Previously at Google and Meta.",
  },
  {
    id: "2",
    name: "Mike Johnson",
    title: "Recruiting Manager",
    image: null,
    expertise: ["Interview Training", "Offer Negotiation", "Team Leadership"],
    points: 3120,
    questionsAnswered: 56,
    contentCreated: 18,
    badges: ["Expert", "Mentor"],
    bio: "Leading the technical recruiting team. Passionate about building great candidate experiences.",
  },
  {
    id: "3",
    name: "Emily Davis",
    title: "Recruiter",
    image: null,
    expertise: ["Campus Recruiting", "Early Careers", "Employer Brand"],
    points: 1890,
    questionsAnswered: 28,
    contentCreated: 8,
    badges: ["Rising Star"],
    bio: "Focused on university recruiting and building our early careers pipeline.",
  },
  {
    id: "4",
    name: "David Kim",
    title: "DEI Program Lead",
    image: null,
    expertise: ["DEI Recruiting", "Inclusive Hiring", "Diversity Sourcing"],
    points: 2100,
    questionsAnswered: 42,
    contentCreated: 15,
    badges: ["Expert", "DEI Champion"],
    bio: "Driving diversity and inclusion initiatives across our recruiting practices.",
  },
  {
    id: "5",
    name: "Lisa Park",
    title: "Recruiting Operations",
    image: null,
    expertise: ["Greenhouse", "Process Optimization", "Analytics"],
    points: 1650,
    questionsAnswered: 31,
    contentCreated: 9,
    badges: ["Tool Expert"],
    bio: "Optimizing our recruiting operations and maintaining our ATS workflows.",
  },
  {
    id: "6",
    name: "James Wilson",
    title: "Senior Recruiter",
    image: null,
    expertise: ["Executive Search", "Compensation", "Closing"],
    points: 2780,
    questionsAnswered: 47,
    contentCreated: 14,
    badges: ["Expert", "Top Closer"],
    bio: "Specializing in senior and executive-level hiring with a strong close rate.",
  },
];

const expertiseAreas = [
  "All Areas",
  "Technical Recruiting",
  "Sourcing",
  "Interviews",
  "DEI",
  "Compensation",
  "Operations",
  "Leadership",
];

export default function ExpertsPage() {
  const user = { name: "Demo User", email: "demo@lumalabs.ai", role: "user" };

  return (
    <AppLayout user={user}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-playfair)" }}>
            Expert Directory
          </h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Connect with team members who have expertise in specific areas
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or expertise..."
              className="input pl-10"
            />
          </div>
          <select className="input w-auto min-w-[200px]">
            {expertiseAreas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        {/* Expert cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {experts.map((expert) => (
            <div
              key={expert.id}
              className="surface rounded-xl p-6 card-hover"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {expert.image ? (
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-16 h-16 rounded-xl"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {expert.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)]">
                        {expert.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {expert.title}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[var(--accent-warning)]">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{expert.points}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--text-muted)] mt-2 line-clamp-2">
                    {expert.bio}
                  </p>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {expert.expertise.map((skill) => (
                      <span key={skill} className="badge text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {expert.badges.map((badge) => (
                      <span key={badge} className="badge-success text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats and actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {expert.questionsAnswered} answers
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {expert.contentCreated} content
                  </span>
                </div>

                <Link
                  href={`/qa/ask?expert=${expert.id}`}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

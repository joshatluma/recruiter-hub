"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Users,
  MessageCircleQuestion,
  Trophy,
  Sparkles,
  User,
  Settings,
  LogOut,
  Home,
  Shield,
} from "lucide-react";
import clsx from "clsx";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Content Library", href: "/content", icon: BookOpen },
  { name: "Learning Paths", href: "/learn", icon: GraduationCap },
  { name: "Experts", href: "/experts", icon: Users },
  { name: "Q&A", href: "/qa", icon: MessageCircleQuestion },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "AI Copilot", href: "/ai", icon: Sparkles },
];

const bottomNavigation = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-subtle)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border-subtle)]">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <h1 className="font-semibold text-[var(--text-primary)]">Recruiter Hub</h1>
            <p className="text-xs text-[var(--text-muted)]">Luma Labs</p>
          </div>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
              {item.name === "AI Copilot" && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-[var(--accent-secondary)]/20 text-[var(--accent-secondary)]">
                  New
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="p-4 border-t border-[var(--border-subtle)] space-y-1">
        {/* Admin link - only for admins */}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className={clsx(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
              pathname === "/admin"
                ? "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Shield className="w-5 h-5" />
            <span className="font-medium">Admin</span>
          </Link>
        )}
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}

        {/* User section */}
        {user && (
          <div className="mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)]">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {user.role === "admin" ? "Admin" : "Recruiter"}
                </p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

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
    <aside className="fixed left-0 top-0 h-screen w-64 sidebar flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-bold text-lg">L</span>
          </div>
          <div>
            <h1 className="font-semibold text-white">Recruiter Hub</h1>
            <p className="text-xs text-white/50">Luma Labs</p>
          </div>
        </Link>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-400 rounded-r-full" />
              )}
              <item.icon className={clsx("w-5 h-5", isActive && "text-indigo-400")} />
              <span className="font-medium text-[0.9375rem]">{item.name}</span>
              {item.name === "AI Copilot" && (
                <span className="ml-auto text-[0.6875rem] px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-medium">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom navigation */}
      <div className="p-3 border-t border-white/10 space-y-0.5">
        {/* Admin link - only for admins */}
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className={clsx(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              pathname === "/admin"
                ? "bg-white/10 text-white"
                : "text-white/60 hover:bg-white/5 hover:text-white/90"
            )}
          >
            {pathname === "/admin" && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-400 rounded-r-full" />
            )}
            <Shield className={clsx("w-5 h-5", pathname === "/admin" && "text-indigo-400")} />
            <span className="font-medium text-[0.9375rem]">Admin</span>
          </Link>
        )}
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-[0.9375rem]">{item.name}</span>
            </Link>
          );
        })}

        {/* User section */}
        {user && (
          <div className="mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-9 h-9 rounded-full ring-2 ring-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {user.role === "admin" ? "Admin" : "Recruiter"}
                </p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

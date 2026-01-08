"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Search, Bell, Loader2, FileText, X, Sparkles, Command } from "lucide-react";
import Link from "next/link";

interface AppLayoutProps {
  children: React.ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
}

export default function AppLayout({ children, user }: AppLayoutProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery }),
        });

        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results?.slice(0, 6) || []);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/content?search=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
      setSearchQuery("");
    }
  }

  function handleResultClick() {
    setShowResults(false);
    setSearchQuery("");
  }

  return (
    <div className="min-h-screen bg-atmosphere">
      <Sidebar user={user} />

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-[var(--border-light)]">
          <div className="flex items-center justify-between h-full px-6">
            {/* Search */}
            <div className="relative w-[420px]" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  placeholder="Search training content..."
                  className="w-full pl-10 pr-20 py-2.5 text-sm bg-[var(--bg-muted)] border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all"
                />
                {isSearching ? (
                  <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[var(--accent-primary)]" />
                ) : searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[var(--text-muted)]">
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border-default)] font-medium">
                    <Command className="w-2.5 h-2.5 inline-block" />K
                  </kbd>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[var(--border-default)] overflow-hidden z-50 animate-scale-in">
                  <div className="px-3 py-2 border-b border-[var(--border-light)] bg-[var(--bg-muted)]">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>AI-powered search results</span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <Link
                        key={result.id}
                        href={`/content/${result.id}`}
                        onClick={handleResultClick}
                        className="flex items-start gap-3 px-3 py-3 hover:bg-[var(--bg-muted)] transition-colors border-b border-[var(--border-light)] last:border-0"
                      >
                        <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary-light)] flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] text-sm">
                            {result.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {result.category} · {result.type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="px-3 py-2.5 border-t border-[var(--border-light)] bg-[var(--bg-muted)]">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-sm text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] font-medium"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 rounded-xl hover:bg-[var(--bg-muted)] transition-colors">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent-danger)] ring-2 ring-white" />
              </button>

              {/* Quick user avatar in header */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                {user?.name?.charAt(0) || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}

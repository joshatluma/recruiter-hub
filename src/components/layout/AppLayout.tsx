"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { Search, Bell, Loader2, FileText, MessageCircle, User, X, Sparkles } from "lucide-react";
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
    <div className="min-h-screen bg-atmosphere bg-grid">
      <Sidebar user={user} />

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-16 border-b border-[var(--border-subtle)] glass">
          <div className="flex items-center justify-between h-full px-6">
            {/* Search */}
            <div className="relative w-96" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  placeholder="Search with AI... (e.g., 'how to source engineers')"
                  className="input pl-10 pr-10 py-2.5 text-sm"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[var(--accent-primary)]" />
                )}
                {searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setShowResults(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 surface-elevated rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                  <div className="p-2 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 px-2 text-xs text-[var(--text-muted)]">
                      <Sparkles className="w-3 h-3" />
                      AI-powered results
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {searchResults.map((result) => (
                      <Link
                        key={result.id}
                        href={`/content/${result.id}`}
                        onClick={handleResultClick}
                        className="flex items-start gap-3 p-3 hover:bg-[var(--bg-tertiary)] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">
                            {result.title}
                          </p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {result.category} · {result.type}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-2 border-t border-[var(--border-subtle)]">
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-sm text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] py-2"
                    >
                      View all results for &quot;{searchQuery}&quot;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[var(--accent-secondary)]" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

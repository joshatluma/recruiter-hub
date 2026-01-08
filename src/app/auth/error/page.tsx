"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    AccessDenied: "Only @lumalabs.ai email addresses can access this platform.",
    Configuration: "There was an issue with the authentication configuration.",
    Default: "An error occurred during sign in.",
  };

  const message = errorMessages[error || "Default"] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-atmosphere bg-grid flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--accent-danger)]/20 mb-6">
          <AlertCircle className="w-8 h-8 text-[var(--accent-danger)]" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Authentication Error
        </h1>
        <p className="text-[var(--text-secondary)] mb-8">{message}</p>

        <Link href="/auth/signin" className="btn-primary inline-block">
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-atmosphere" />}>
      <ErrorContent />
    </Suspense>
  );
}

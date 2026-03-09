"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-56px)] w-full items-center justify-center bg-background p-6">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger/10">
          <AlertTriangle className="h-7 w-7 text-danger" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Oops! Something went wrong
        </h2>
        <p className="text-sm text-muted mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-card-hover text-foreground text-sm font-medium transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
        {error.digest && (
          <p className="text-[10px] text-muted mt-4 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

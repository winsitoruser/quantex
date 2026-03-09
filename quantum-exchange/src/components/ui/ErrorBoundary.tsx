"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  public reset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="flex min-h-[400px] w-full items-center justify-center bg-background p-6">
          <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
              <AlertTriangle className="h-6 w-6 text-danger" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted mb-4">
              {error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={this.reset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent hover:bg-accent-hover text-background text-sm font-medium transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-card-hover text-foreground text-sm font-medium transition-colors"
              >
                <Bug className="h-4 w-4" />
                Report Issue
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

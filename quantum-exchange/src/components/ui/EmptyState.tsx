import { cn } from "@/lib/utils";
import {
  Inbox,
  FileText,
  ShoppingCart,
  Wallet,
  TrendingUp,
  Bot,
  Bell,
  Search,
  type LucideIcon,
} from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface EmptyStateProps {
  icon?: LucideIcon;
  preset?:
    | "orders"
    | "trades"
    | "assets"
    | "bots"
    | "notifications"
    | "search"
    | "default";
  title: string;
  description?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
}

const presetConfig: Record<
  NonNullable<EmptyStateProps["preset"]>,
  { icon: LucideIcon; description?: string }
> = {
  orders: {
    icon: FileText,
    description: "No orders found. Start trading to see your orders here.",
  },
  trades: {
    icon: TrendingUp,
    description: "No trade history yet. Your completed trades will appear here.",
  },
  assets: {
    icon: Wallet,
    description: "No assets found. Deposit or buy crypto to get started.",
  },
  bots: {
    icon: Bot,
    description: "No trading bots yet. Create your first bot to start automated trading.",
  },
  notifications: {
    icon: Bell,
    description: "No new notifications. You're all caught up!",
  },
  search: {
    icon: Search,
    description: "No results found. Try adjusting your search terms.",
  },
  default: {
    icon: Inbox,
    description: "No items to display.",
  },
};

export default function EmptyState({
  icon: CustomIcon,
  preset = "default",
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  const config = presetConfig[preset];
  const Icon = CustomIcon || config.icon;
  const desc = description || config.description;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 min-h-[300px]",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-4 relative">
        <div className="absolute inset-0 bg-accent/10 blur-xl rounded-full" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
          <Icon className="h-8 w-8 text-accent" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {/* Description */}
      {desc && (
        <p className="text-sm text-muted max-w-md mb-6">{desc}</p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

// Pre-styled action button for empty states
interface EmptyStateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const EmptyStateButton = forwardRef<HTMLButtonElement, EmptyStateButtonProps>(
  function EmptyStateButton({ variant = "primary", className, children, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
          variant === "primary" &&
            "bg-accent hover:bg-accent-hover text-background",
          variant === "secondary" &&
            "border border-border hover:bg-card-hover text-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

// Empty state with illustration for larger sections
export function EmptyIllustration({
  type = "trading",
  className,
}: {
  type?: "trading" | "portfolio" | "messages" | "analytics" | "orders";
  className?: string;
}) {
  const illustrations = {
    orders: (
      <svg
        className="w-32 h-32 text-muted/20"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      >
        <rect x="50" y="40" width="100" height="120" rx="8" />
        <path d="M70 70 L130 70" />
        <path d="M70 90 L130 90" />
        <path d="M70 110 L130 110" />
        <path d="M70 130 L110 130" />
      </svg>
    ),
    trading: (
      <svg
        className="w-32 h-32 text-muted/20"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <rect x="40" y="60" width="20" height="80" rx="4" />
        <rect x="80" y="40" width="20" height="100" rx="4" />
        <rect x="120" y="80" width="20" height="60" rx="4" />
        <path
          d="M30 140 L170 140"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    ),
    portfolio: (
      <svg
        className="w-32 h-32 text-muted/20"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      >
        <rect x="50" y="70" width="100" height="80" rx="8" />
        <path d="M50 90 L150 90" />
        <circle cx="100" cy="120" r="20" />
      </svg>
    ),
    messages: (
      <svg
        className="w-32 h-32 text-muted/20"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      >
        <rect x="40" y="50" width="120" height="90" rx="8" />
        <path d="M70 80 L130 80" />
        <path d="M70 100 L110 100" />
        <path d="M70 120 L100 120" />
      </svg>
    ),
    analytics: (
      <svg
        className="w-32 h-32 text-muted/20"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
      >
        <circle cx="100" cy="100" r="60" />
        <path d="M100 40 L100 100 L140 100" />
      </svg>
    ),
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {illustrations[type]}
    </div>
  );
}

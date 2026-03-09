/**
 * Date and Time Formatting Utilities
 * Centralized utilities for consistent date/time formatting across the app
 */

export type DateFormat =
  | "short"       // 2024-03-06
  | "medium"      // Mar 6, 2024
  | "long"        // March 6, 2024
  | "full"        // Wednesday, March 6, 2024
  | "time"        // 14:30:25
  | "time12"      // 2:30:25 PM
  | "datetime"    // Mar 6, 2024 14:30
  | "relative";   // 2 hours ago

export interface FormatDateOptions {
  format?: DateFormat;
  locale?: string;
  showSeconds?: boolean;
  showTimezone?: boolean;
}

/**
 * Format a date to a localized string
 */
export function formatDate(
  date: Date | string | number,
  options: FormatDateOptions = {}
): string {
  const {
    format = "medium",
    locale = typeof window !== "undefined" ? navigator.language : "en-US",
    showSeconds = false,
    showTimezone = false,
  } = options;

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    console.warn("Invalid date:", date);
    return "Invalid Date";
  }

  const dateOptions: Intl.DateTimeFormatOptions = {};
  const timeOptions: Intl.DateTimeFormatOptions = {};

  switch (format) {
    case "short":
      dateOptions.year = "numeric";
      dateOptions.month = "2-digit";
      dateOptions.day = "2-digit";
      break;

    case "medium":
      dateOptions.year = "numeric";
      dateOptions.month = "short";
      dateOptions.day = "numeric";
      break;

    case "long":
      dateOptions.year = "numeric";
      dateOptions.month = "long";
      dateOptions.day = "numeric";
      break;

    case "full":
      dateOptions.weekday = "long";
      dateOptions.year = "numeric";
      dateOptions.month = "long";
      dateOptions.day = "numeric";
      break;

    case "time":
      timeOptions.hour = "2-digit";
      timeOptions.minute = "2-digit";
      timeOptions.second = showSeconds ? "2-digit" : undefined;
      timeOptions.hour12 = false;
      break;

    case "time12":
      timeOptions.hour = "2-digit";
      timeOptions.minute = "2-digit";
      timeOptions.second = showSeconds ? "2-digit" : undefined;
      timeOptions.hour12 = true;
      break;

    case "datetime":
      dateOptions.year = "numeric";
      dateOptions.month = "short";
      dateOptions.day = "numeric";
      timeOptions.hour = "2-digit";
      timeOptions.minute = "2-digit";
      timeOptions.hour12 = false;
      break;

    case "relative":
      return formatRelativeTime(d, locale);
  }

  if (showTimezone) {
    timeOptions.timeZoneName = "short";
  }

  const combinedOptions = { ...dateOptions, ...timeOptions };

  try {
    return new Intl.DateTimeFormat(locale, combinedOptions).format(d);
  } catch (error) {
    console.error("Error formatting date:", error);
    return d.toLocaleString(locale);
  }
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string | number, locale = "en-US"): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffSecs / 3600);
  const diffDays = Math.round(diffSecs / 86400);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffYears) >= 1) {
    return rtf.format(diffYears < 0 ? -diffYears : diffYears, diffYears < 0 ? "year" : "year");
  }
  if (Math.abs(diffMonths) >= 1) {
    return rtf.format(diffMonths < 0 ? -diffMonths : diffMonths, diffMonths < 0 ? "month" : "month");
  }
  if (Math.abs(diffDays) >= 1) {
    return rtf.format(diffDays < 0 ? -diffDays : diffDays, diffDays < 0 ? "day" : "day");
  }
  if (Math.abs(diffHours) >= 1) {
    return rtf.format(diffHours < 0 ? -diffHours : diffHours, diffHours < 0 ? "hour" : "hour");
  }
  if (Math.abs(diffMins) >= 1) {
    return rtf.format(diffMins < 0 ? -diffMins : diffMins, diffMins < 0 ? "minute" : "minute");
  }
  return rtf.format(diffSecs < 0 ? -diffSecs : diffSecs, diffSecs < 0 ? "second" : "second");
}

/**
 * Format time for trading (e.g., "14:30:25")
 */
export function formatTradeTime(date: Date | string | number, showMs = false): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  if (showMs) {
    const ms = String(d.getMilliseconds()).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Format timestamp for order book (e.g., "14:30")
 */
export function formatOrderBookTime(date: Date | string | number): string {
  const d = new Date(date);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Parse ISO string to local date string
 */
export function parseISOToLocal(isoString: string): string {
  const d = new Date(isoString);
  return formatDate(d, { format: "datetime" });
}

/**
 * Get time remaining until a future date
 */
export function getTimeRemaining(targetDate: Date | string | number): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
} {
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isPast: false };
}

/**
 * Format duration in seconds to human readable string
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (days > 0) {
    return `${days}d ${hrs % 24}h`;
  }
  if (hrs > 0) {
    return `${hrs}h ${mins % 60}m`;
  }
  if (mins > 0) {
    return `${mins}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string | number): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is yesterday
 */
export function isYesterday(date: Date | string | number): boolean {
  const d = new Date(date);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    d.getDate() === yesterday.getDate() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get start of day
 */
export function startOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date | string | number): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

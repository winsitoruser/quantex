"use client";

import { useState, useEffect, useCallback } from "react";

export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia(query);

    // Update state if matches changes
    const handleChange = () => setMatches(media.matches);
    handleChange();

    // Use modern event listener if available
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, [query]);

  return matches;
}

// Pre-defined breakpoint hooks
export function useIsMobile() {
  return useMediaQuery("(max-width: 640px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1025px)");
}

export function useIsSm() {
  return useMediaQuery("(max-width: 640px)");
}

export function useIsMd() {
  return useMediaQuery("(min-width: 641px) and (max-width: 768px)");
}

export function useIsLg() {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

export function useIsXl() {
  return useMediaQuery("(min-width: 1025px) and (max-width: 1280px)");
}

export function useIs2Xl() {
  return useMediaQuery("(min-width: 1281px)");
}

// Match any breakpoint up
export function useBreakpointUp(breakpoint: "sm" | "md" | "lg" | "xl" | "2xl") {
  const queries = {
    sm: "(min-width: 0px)",
    md: "(min-width: 641px)",
    lg: "(min-width: 769px)",
    xl: "(min-width: 1025px)",
    "2xl": "(min-width: 1281px)",
  };

  return useMediaQuery(queries[breakpoint]);
}

// Match any breakpoint down
export function useBreakpointDown(breakpoint: "sm" | "md" | "lg" | "xl" | "2xl") {
  const queries = {
    sm: "(max-width: 640px)",
    md: "(max-width: 768px)",
    lg: "(max-width: 1024px)",
    xl: "(max-width: 1280px)",
    "2xl": "(max-width: 9999px)",
  };

  return useMediaQuery(queries[breakpoint]);
}

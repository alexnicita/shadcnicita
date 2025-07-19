import { useEffect, useCallback } from "react";

// Extend the Window interface to include RB2B
declare global {
  interface Window {
    reb2b?: {
      invoked?: boolean;
      identify: (data: Record<string, any>) => void;
      collect: (data?: Record<string, any>) => void;
      methods: string[];
      factory: (method: string) => Function;
      load: (apiKey: string) => void;
      SNIPPET_VERSION: string;
      [key: string]: any;
    };
  }
}

interface Rb2bConfig {
  autoTrack?: boolean;
  debug?: boolean;
}

export function useRb2b(config: Rb2bConfig = {}) {
  const { autoTrack = true, debug = false } = config;

  // Check if RB2B is available
  const isAvailable = useCallback(() => {
    return (
      typeof window !== "undefined" && window.reb2b && window.reb2b.invoked
    );
  }, []);

  // Safe wrapper for RB2B methods
  const callRb2b = useCallback(
    (method: string, data?: Record<string, any>) => {
      try {
        if (
          isAvailable() &&
          window.reb2b &&
          typeof window.reb2b[method] === "function"
        ) {
          window.reb2b[method](data);
          if (debug) {
            console.log(`RB2B: Called ${method}`, data);
          }
        } else if (debug) {
          console.warn(`RB2B: ${method} not available or not loaded yet`);
        }
      } catch (error) {
        console.warn(`RB2B: Error calling ${method}:`, error);
      }
    },
    [isAvailable, debug]
  );

  // Identify user
  const identify = useCallback(
    (userData: Record<string, any>) => {
      callRb2b("identify", userData);
    },
    [callRb2b]
  );

  // Track page view or custom event
  const track = useCallback(
    (eventData?: Record<string, any>) => {
      callRb2b("collect", eventData);
    },
    [callRb2b]
  );

  // Auto-track page views on route changes
  useEffect(() => {
    if (!autoTrack) return;

    // Track initial page view
    const trackPageView = () => {
      track({
        page: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    };

    // Wait for RB2B to be ready, then track
    const checkAndTrack = () => {
      if (isAvailable()) {
        trackPageView();
      } else {
        // Retry after a short delay if RB2B isn't ready yet
        setTimeout(checkAndTrack, 100);
      }
    };

    checkAndTrack();
  }, [autoTrack, track, isAvailable]);

  return {
    isAvailable: isAvailable(),
    identify,
    track,
  };
}

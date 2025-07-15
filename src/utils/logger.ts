// Simple logger that sends page views to our API
export const logPageView = async () => {
  try {
    const pageData = {
      page: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
    };

    // Development logging - just console log
    if (import.meta.env.DEV) {
      console.log(`📊 Page View: ${pageData.page}`, {
        referrer: pageData.referrer || "Direct",
        timestamp: new Date(pageData.timestamp).toISOString(),
      });
      return;
    }

    // Production - call our logging API (no await to avoid blocking)
    fetch("/api/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pageData),
    }).catch(() => {
      // Silently fail - don't break the user experience
    });
  } catch (error) {
    // Silently fail
  }
};

// Track page view on load
export const initializeLogging = () => {
  // Log initial page view
  logPageView();

  // Log when user navigates (for SPA routing)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      logPageView();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

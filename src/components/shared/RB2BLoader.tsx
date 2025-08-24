import { useEffect } from "react";

export default function RB2BLoader() {
  useEffect(() => {
    const load = () => {
      try {
        const existing = document.getElementById("rb2b-script");
        if (existing) existing.remove();

        const script = document.createElement("script");
        script.id = "rb2b-script";
        const id = import.meta.env.VITE_RB2B_ID as string | undefined;
        if (!id) return;
        script.src = `https://ddwl4m2hdecbv.cloudfront.net/b/${id}/${id}.js.gz`;
        script.async = true;
        document.body.appendChild(script);
      } catch {
        // silent fail
      }
    };

    // Initial load
    load();

    // Reload on SPA route changes
    let currentPath = window.location.pathname;
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        load();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}


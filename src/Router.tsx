import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import BlogIndex from "./components/BlogIndex";
import BlogPost from "./components/BlogPost";
import Privacy from "./components/Privacy";
import { initializeLogging } from "./utils/logger";
import { useRb2b } from "./hooks/useRb2b";

export default function Router() {
  // Initialize RB2B tracking with auto page view tracking
  const { isAvailable } = useRb2b({
    autoTrack: true,
    debug: import.meta.env.DEV,
  });

  // Initialize legacy logging when router mounts
  useEffect(() => {
    initializeLogging();
  }, []);

  // Log RB2B status in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log(
        "RB2B tracking status:",
        isAvailable ? "✅ Active" : "⏳ Loading..."
      );
    }
  }, [isAvailable]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </BrowserRouter>
  );
}

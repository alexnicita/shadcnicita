import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import BlogIndex from "./components/BlogIndex";
import BlogPost from "./components/BlogPost";
import Privacy from "./components/Privacy";
import { initializeLogging } from "./utils/logger";
// import { useRb2b } from "./hooks/useRb2b"; // Temporarily disabled for mobile debugging

export default function Router() {
  // RB2B tracking temporarily disabled for mobile debugging
  // const { isAvailable } = useRb2b({
  //   autoTrack: true,
  //   debug: import.meta.env.DEV,
  // });

  // Initialize legacy logging when router mounts
  useEffect(() => {
    initializeLogging();
  }, []);

  // Debug logging for mobile troubleshooting
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("🔧 Router mounted successfully");
      console.log("📱 Mobile Debug Mode: Active");
    }
  }, []);

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

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import App from "./App";
import BlogIndex from "./components/BlogIndex";
import BlogPost from "./components/BlogPost";
import Privacy from "./components/Privacy";
import { initializeLogging } from "./utils/logger";

export default function Router() {
  // Initialize legacy logging when router mounts
  useEffect(() => {
    initializeLogging();
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

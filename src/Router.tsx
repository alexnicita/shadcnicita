import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import App from "./App";
import { initializeLogging } from "./utils/logger";

// Lazy load blog components - only load when needed!
const BlogIndex = lazy(() => import("./components/BlogIndex"));
const BlogPost = lazy(() => import("./components/BlogPost"));

export default function Router() {
  // Initialize logging when router mounts
  useEffect(() => {
    initializeLogging();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<div>Loading blog...</div>}>
              <BlogIndex />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<div>Loading post...</div>}>
              <BlogPost />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

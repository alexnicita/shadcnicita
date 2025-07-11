import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import App from "./App";

// Lazy load blog components - only load when needed!
const BlogIndex = lazy(() => import("./components/BlogIndex"));
const BlogPost = lazy(() => import("./components/BlogPost"));

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/blog"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <BlogIndex />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
              <BlogPost />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import BlogIndex from "./components/BlogIndex";
import BlogPost from "./components/BlogPost";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/blog" element={<BlogIndex />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  );
}

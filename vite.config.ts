import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: "/",
    build: {
      outDir: "dist",
      sourcemap: true,
      target: ["es2015", "safari11", "chrome64", "firefox67"],
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            router: ["react-router-dom"],
          },
        },
        // SECURITY: Exclude draft markdown files from production builds
        external:
          mode === "production"
            ? (id) => id.includes("/blog/drafts/") && id.includes(".md")
            : undefined,
      },
    },
    assetsInclude: ["**/*.md"],
    // Note: Draft posts are excluded from production builds via
    // environment-based filtering in src/data/blogPosts.ts
    // AND runtime checks in BlogPost.tsx
    // AND build-time exclusion above
  };
});

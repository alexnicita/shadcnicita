# Blog Structure & Draft Protection

## 📁 Directory Structure

```
src/blog/
├── published/     # ✅ Live posts (visible in production)
│   └── hello-world/
│       └── index.md
└── drafts/        # 🔒 Work-in-progress (dev only)
    └── sample-draft/
        └── index.md
```

## 🛡️ Multi-Layer Draft Protection

### 1. **Data Layer Protection** (`src/data/blogPosts.ts`)

- Environment-based filtering excludes drafts from `blogPosts` array in production
- Runtime validation function `isPostAccessible()` for additional checks

### 2. **Component Layer Protection** (`src/components/BlogPost.tsx`)

- Runtime checks prevent draft access in production
- Double validation before loading markdown content
- Graceful error handling if draft access is attempted

### 3. **Build Layer Protection** (`vite.config.ts`)

- Build-time exclusion of draft markdown files from production bundles
- External module configuration prevents bundling of draft content

## 🔄 Workflow

### Adding a Draft

1. Create folder in `src/blog/drafts/my-new-post/`
2. Add `index.md` with frontmatter
3. Add entry to `draftPosts` array in `src/data/blogPosts.ts`

### Publishing a Draft

1. Move folder from `drafts/` to `published/`
2. Move entry from `draftPosts` to `publishedPosts` array
3. Update status from "draft" to "published"

## ✅ Security Guarantees

- **Zero Draft Exposure**: Drafts cannot be accessed in production
- **No Bundle Pollution**: Draft markdown files are excluded from production builds
- **Runtime Validation**: Multiple checks prevent any draft access attempts
- **Graceful Degradation**: Failed access attempts show "Post not found" instead of errors

## 🧪 Testing

```bash
# Development (drafts visible)
npm run dev

# Production build (drafts excluded)
npm run build
npm run preview
```

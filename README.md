# Shadcn/UI Landing Page Template

## <a href="https://ui.shadcn.com/" target="_blank">ShadcnUI</a> + <a href="https://react.dev/" target="_blank">React</a> + <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a> + <a href="https://tailwindcss.com/" target="_blank">Tailwind</a> + <a href="https://vercel.com/" target="_blank">Vercel</a>

![shadch-landing-page](https://github.com/leoMirandaa/shadcn-landing-page/assets/61714687/3ba7b51f-9589-4541-800a-5ab7cecad1b5)

Build your React landing page effortlessly with the required sections to your project. <a href="https://nicita.cc/" target="_blank">Live Demo</a>

**Contact: alex@nicita.cc**

## Project Structure

```
shadcnicita/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/UI components
│   │   └── shared/         # Shared components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── data/               # Static data
│   ├── blog/               # Blog content
│   └── lib/                # Library utilities
├── api/                    # Serverless API functions (Vercel standard)
│   └── log.ts              # Request logging endpoint
├── public/                 # Static assets
├── vercel.json            # Vercel configuration
└── package.json
```

## Features

### Landing Page Features

- [x] Fully Responsive Design
- [x] User Friendly Navigation
- [x] Dark Mode Support
- [x] SEO Optimized Meta tags
- [x] TypeScript for type safety
- [x] Tailwind CSS for styling

### Technical Features

- [x] **TypeScript API Functions** - Serverless functions with proper typing
- [x] **Request Logging** - Track page visits in Vercel runtime logs
- [x] **Blog System** - Markdown-based blog with dynamic routing
- [x] **Performance Optimized** - Lazy loading and code splitting
- [x] **Modern React Patterns** - Hooks, context, and functional components

## Sections

- [x] Navbar
- [x] Sidebar(mobile)
- [x] Hero
- [x] Sponsors
- [x] About
- [x] Stats
- [x] How It Works
- [x] Features
- [x] Services
- [x] Call-to-Action (CTA)
- [x] Testimonials
- [x] Team
- [x] Pricing
- [x] Newsletter
- [x] Frequently Asked Questions(FAQ)
- [x] Footer

## API Endpoints

### `/api/log` (POST)

**File Location**: `api/log.ts`

Logs page visits and user interactions for analytics.

**Request Body:**

```json
{
  "page": "/",
  "referrer": "https://google.com",
  "timestamp": 1705315815123,
  "userAgent": "Mozilla/5.0..."
}
```

**Response:**

```json
{
  "logged": true,
  "timestamp": "2024-01-15T10:30:15.123Z",
  "message": "Request logged successfully"
}
```

## Installation

1. Clone this repository:

```bash
git clone https://github.com/alexnicita/shadcnicita.git
```

2. Go into project directory:

```bash
cd shadcnicita
```

3. Install dependencies:

```bash
npm install
```

4. Run development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Deployment

This project is configured for deployment on Vercel with:

- **Automatic TypeScript compilation** for API functions
- **SPA routing** with React Router
- **Serverless functions** in `src/api/`
- **Runtime logging** for analytics

### Deploy to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Vercel will automatically deploy using `vercel.json` configuration

### Environment Variables

No environment variables required for basic functionality.

## Development

### Project Architecture

- **Frontend**: React SPA with TypeScript and Tailwind CSS
- **Routing**: React Router with lazy loading
- **Backend**: Vercel serverless functions in TypeScript
- **Analytics**: Custom logging to Vercel runtime logs
- **Styling**: Tailwind CSS with Shadcn/UI components

### Code Organization

- All source code lives in `src/` directory
- API functions are in `/api/` directory (Vercel standard)
- API functions are TypeScript with proper Vercel types
- Components are organized by feature and reusability
- Utilities and hooks are centralized for reuse

### Adding New API Endpoints

1. Create new `.ts` file in `/api/` directory
2. Import Vercel types: `import type { VercelRequest, VercelResponse } from "@vercel/node"`
3. Export default handler function
4. Deploy to Vercel (automatically detected)

Example:

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ message: "Hello World" });
}
```

## License

This project is licensed under the MIT License.

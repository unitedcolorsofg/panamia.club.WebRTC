# Next.js 12 → 13+ App Router Migration Prompt (2025 Best Practices + FLOSS)

## Context

I have a Next.js 12 project (panamia.club) that I want to upgrade to Next.js 13+ using the App Router. The existing Pages Router functionality should remain intact, but all new development will use 2025 best practices with strong preference for Free/Libre Open Source Software (FLOSS).

**Repository:** panamia.club (local directory)

## Objectives

1. Upgrade to Next.js 13.5+ while keeping existing `pages/` directory functional
2. Create new `app/` directory with modern App Router architecture following 2025 best practices
3. Use FLOSS alternatives wherever possible
4. Separate legacy stack (Mantine) from modern stack (Tailwind + shadcn/ui)
5. Establish code quality standards early
6. Prepare foundation for new peer mentoring feature using modern tooling

## Current Stack (Legacy - Pages Router)

- Next.js 12.3.1
- React 18.2.0
- TypeScript 4.8.4
- NextAuth 4.15.0
- Mantine UI 5.6.2 (Emotion-based)
- Mongoose 6.8.1
- MongoDB (via Docker on localhost:27017)
- Stripe (keep)
- Pusher (keep)
- BunnyCDN (keep)
- Google Analytics (remove if present)

## Target Stack (Modern - App Router) - 2025 Best Practices

### UI & Styling (FLOSS)

- **Tailwind CSS** - utility-first, zero runtime, highly customizable
- **shadcn/ui** - copy/paste components built on Radix UI (fully FLOSS, MIT license)
- **Radix UI** - unstyled, accessible primitives (MIT license)
- **lucide-react** - icon library (ISC license, FLOSS alternative to FontAwesome)

### Forms & Validation (FLOSS)

- **React Hook Form** - performant, uncontrolled forms (MIT)
- **Zod** - TypeScript-first schema validation (MIT)
- Replace Formik (legacy) with React Hook Form

### State Management (FLOSS)

- **TanStack Query v5** (already installed) - server state (MIT)
- **Zustand** - client state if needed (MIT, lighter than Redux)
- Avoid prop drilling with proper Server/Client component architecture

### Authentication (FLOSS)

- **NextAuth v5 (Auth.js)** - upgrade from v4 (ISC license)
- Better App Router integration
- Continued MongoDB adapter support

### Database (FLOSS)

- **Mongoose v8** - upgrade from v6.8.1
- Continue using MongoDB

### Real-time & Services (Keep Current)

- **Pusher** - keep for WebRTC signaling (already integrated)
- **Stripe** - keep for payments (industry standard)
- **BunnyCDN** - keep for file storage/CDN (performant)

### Analytics (Remove Proprietary)

- **Remove Google Analytics** if present
- No replacement needed unless specifically requested

### Code Quality (FLOSS)

- **ESLint** - with Next.js 13+ rules
- **Prettier** - code formatting
- **TypeScript strict mode**
- **Husky + lint-staged** - pre-commit hooks

## Git Strategy

**Branch:**

```bash
main (protected, current production)
└── upgrade/next-13-foundation (work branch)
```

**Commit after each phase, test thoroughly, request approval before proceeding.**

Safe commits can be merged to main individually if desired.

## Migration Requirements - Phased Approach

### Phase 1: Code Quality Foundation (SAFE ✅)

**Goal:** Establish code quality standards before making architectural changes

**1a. Add code quality dependencies:**

```bash
npm install -D \
  prettier \
  prettier-plugin-tailwindcss \
  eslint-config-next@13 \
  husky \
  lint-staged
```

**1b. Create config files:**

`.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

`.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ]
  }
}
```

`lint-staged.config.js`:

```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
```

**1c. Set up Husky:**

```bash
npx husky-init && npm install
# Update .husky/pre-commit to run lint-staged
```

**1d. Run formatter on existing code:**

```bash
npx prettier --write .
```

**COMMIT 1:** `chore: add code quality tooling (Prettier, ESLint, Husky)`

**Test:** Ensure existing code still runs after formatting

---

### Phase 2: Add Modern Dependencies (SAFE ✅)

**Goal:** Install new packages without changing existing code

**2a. Add Tailwind + shadcn/ui dependencies:**

```bash
npm install -D tailwindcss postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot
```

**2b. Add form handling:**

```bash
npm install react-hook-form @hookform/resolvers zod
```

**2c. Initialize shadcn/ui:**

```bash
npx shadcn-ui@latest init
```

Configure for:

- TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes
- Tailwind config: tailwind.config.js
- Components path: @/components
- Utils path: @/lib/utils

**2d. Create Tailwind config** (if not created by shadcn):

`tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

`postcss.config.js`:

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**COMMIT 2:** `chore: add Tailwind CSS and shadcn/ui dependencies`

**Test:** Ensure dev server still starts

---

### Phase 3: Add Documentation (SAFE ✅)

**Goal:** Document architectural decisions before implementation

**3a. Create ARCHITECTURE.md:**

```markdown
# Architecture Overview

## Project Structure

### Legacy Stack (pages/)

- **UI:** Mantine v5 with Emotion
- **Forms:** Formik
- **Auth:** NextAuth v4
- **Routing:** Pages Router
- **Status:** Maintained but not enhanced

### Modern Stack (app/)

- **UI:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Forms:** React Hook Form + Zod
- **Auth:** NextAuth v5
- **Routing:** App Router
- **Status:** All new development

## Shared Infrastructure

- **Database:** MongoDB + Mongoose v8
- **Auth Sessions:** NextAuth (shared between routing systems)
- **Real-time:** Pusher
- **Payments:** Stripe
- **CDN:** BunnyCDN
- **State:** TanStack Query v5

## Development Principles

- Server Components by default
- Client Components only when necessary
- FLOSS preferred for new dependencies
- Zero breakage of existing features
```

**3b. Create FLOSS-ALTERNATIVES.md:**

```markdown
# FLOSS Alternatives Reference

## Current Proprietary Services

### Pusher (Real-time)

- **Status:** Keeping (already integrated, works well)
- **FLOSS alternatives for future:** Socket.io, Supabase Realtime
- **Migration effort:** High

### Stripe (Payments)

- **Status:** Keeping (industry standard, few viable alternatives)
- **FLOSS alternatives:** BTCPay Server (Bitcoin only)
- **Migration effort:** Very high

### BunnyCDN (File Storage/CDN)

- **Status:** Keeping (performant, cost-effective)
- **FLOSS alternatives:** MinIO (self-hosted S3), Cloudflare R2
- **Migration effort:** Medium

## FLOSS Stack (In Use)

- Next.js (MIT)
- React (MIT)
- Tailwind CSS (MIT)
- shadcn/ui (MIT)
- Radix UI (MIT)
- React Hook Form (MIT)
- Zod (MIT)
- TanStack Query (MIT)
- NextAuth (ISC)
- Mongoose (MIT)
```

**COMMIT 3:** `docs: add architecture and FLOSS alternatives documentation`

---

### Phase 4: TypeScript Configuration Update (SAFE ✅)

**Goal:** Prepare TypeScript for App Router and strict mode

**4a. Update tsconfig.json:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**COMMIT 4:** `chore: update TypeScript config for Next 13 and strict mode`

**Test:** Run `npm run build` and fix any new strict mode errors in existing code

---

### Phase 5: Upgrade Core Dependencies (MEDIUM ⚠️)

**Goal:** Upgrade Next.js, React, NextAuth, Mongoose

**5a. Update package.json:**

```json
{
  "dependencies": {
    "next": "^13.5.6",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "next-auth": "^5.0.0-beta.19",
    "mongoose": "^8.0.3",
    "@tanstack/react-query": "^5.14.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

**5b. Update next.config.js:**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,

  // Enable experimental features for App Router
  experimental: {
    serverActions: true,
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: '/pana/[username]',
      loader: 'raw-loader',
    });

    return config;
  },
};

module.exports = nextConfig;
```

**5c. Install dependencies:**

```bash
rm -rf node_modules package-lock.json
npm install
```

**COMMIT 5:** `feat: upgrade to Next.js 13.5, React 18.3, NextAuth v5, Mongoose v8`

**Test:**

- Run `npm run dev`
- Verify existing pages load
- Test authentication flows
- Test database connections
- Check for console errors

---

### Phase 6: Create App Router Foundation (MEDIUM ⚠️)

**Goal:** Set up app/ directory without breaking pages/

**6a. Create directory structure:**

```
app/
├── layout.tsx
├── providers.tsx
├── globals.css
├── page.tsx
├── error.tsx
├── loading.tsx
├── not-found.tsx

lib/
├── utils.ts
├── db.ts

hooks/
(empty for now)
```

**6b. Create app/globals.css:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ...rest of CSS variables from shadcn/ui */
  }
}
```

**6c. Create app/layout.tsx:**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PanaMia Club',
  description: 'Connect with your community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

**6d. Create app/providers.tsx:**

```typescript
'use client'

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
```

**6e. Create app/page.tsx:**

```typescript
import { redirect } from 'next/navigation';

export default function AppHomePage() {
  // Redirect to existing pages/ homepage for now
  redirect('/');
}
```

**6f. Create lib/utils.ts:**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**6g. Update lib/db.ts (or create if doesn't exist):**

```typescript
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

**COMMIT 6:** `feat: add App Router foundation (app/ directory)`

**Test:**

- Run `npm run dev`
- Visit existing pages (should still work)
- Visit `/app` routes (should redirect)
- Check no console errors

---

### Phase 7: Upgrade NextAuth to v5 (RISKY 🔴)

**Goal:** Migrate NextAuth v4 → v5 for better App Router integration

**7a. Create app/api/auth/[...nextauth]/route.ts:**

```typescript
import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import EmailProvider from 'next-auth/providers/email';
import clientPromise from '@/pages/api/auth/lib/mongodb';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'panamia_dev',
    collections: {
      Accounts: 'nextauth_accounts',
      Sessions: 'nextauth_sessions',
      Users: 'nextauth_users',
      VerificationTokens: 'nextauth_verification_tokens',
    },
  }),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  theme: {
    logo: '/logos/2023_logo_pink.svg',
    brandColor: '#4ab3ea',
    buttonText: '#fff',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handlers as GET, handlers as POST };
```

**7b. Create auth.ts helper:**

```typescript
// lib/auth.ts
export { auth } from '@/app/api/auth/[...nextauth]/route';
```

**7c. Keep pages/api/auth/[...nextauth].ts for backward compatibility:**

- Pages Router routes will continue using the old NextAuth endpoint
- App Router routes will use the new route handler

**COMMIT 7:** `feat: upgrade to NextAuth v5 with dual compatibility`

**Test:**

- Test login/logout flows
- Verify sessions persist
- Check both `/api/auth/*` endpoints work
- Test protected pages in pages/
- Test authentication in app/ routes

---

### Phase 8: Add shadcn/ui Components (SAFE ✅)

**Goal:** Install commonly needed components

**8a. Add initial components:**

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
```

**8b. Components will be added to:**

```
components/
└── ui/
    ├── button.tsx
    ├── input.tsx
    ├── form.tsx
    └── ...
```

**COMMIT 8:** `feat: add shadcn/ui component library`

**Test:** Components are in place but not used yet, low risk

---

### Phase 9: Remove Google Analytics (if present) (SAFE ✅)

**Goal:** Remove proprietary analytics

**9a. Search for Google Analytics:**

- Check `pages/_app.tsx` or `pages/_document.tsx`
- Check for `react-ga` or `react-ga4` usage
- Remove GA script tags
- Remove environment variables

**9b. Remove dependencies:**

```bash
npm uninstall react-ga react-ga4
```

**9c. Clean up tracking code:**

- Remove any `ReactGA.initialize()` calls
- Remove `ReactGA.pageview()` calls
- Remove tracking hooks

**COMMIT 9:** `chore: remove Google Analytics`

**Test:** Ensure site still loads, no console errors

---

### Phase 10: Create Mentoring Feature Scaffolding (SAFE ✅)

**Goal:** Build structure for new peer mentoring feature

**10a. Create route structure:**

```
app/
├── (marketing)/
│   ├── layout.tsx
│   └── page.tsx
│
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
│
└── (mentoring)/
    ├── layout.tsx
    │
    ├── profile/
    │   ├── page.tsx
    │   └── edit/
    │       ├── page.tsx
    │       └── _components/
    │           └── profile-form.tsx
    │
    ├── discover/
    │   ├── page.tsx
    │   └── _components/
    │       ├── mentor-card.tsx
    │       └── filters.tsx
    │
    ├── schedule/
    │   ├── page.tsx
    │   └── _components/
    │       └── booking-form.tsx
    │
    └── session/
        └── [sessionId]/
            ├── page.tsx
            └── _components/
                ├── video-room.tsx
                └── chat-panel.tsx
```

**10b. Create layouts with authentication:**

`app/(mentoring)/layout.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function MentoringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        {/* Navigation for mentoring section */}
      </nav>
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}
```

**10c. Create placeholder pages:**

Each page should be a simple Server Component with:

- Proper TypeScript types
- Authentication check
- Basic layout
- TODO comments for feature implementation

Example `app/(mentoring)/discover/page.tsx`:

```typescript
import { auth } from '@/lib/auth'
import { MentorCard } from './_components/mentor-card'

export default async function DiscoverPage() {
  const session = await auth()

  // TODO: Fetch mentors from database
  // TODO: Implement filtering logic
  // TODO: Add search functionality

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover Mentors</h1>
        <p className="text-gray-600 mt-2">
          Find mentors who can help you grow
        </p>
      </div>

      {/* TODO: Add filter components */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* TODO: Map through mentors */}
        <p className="text-gray-500">Mentor cards will appear here</p>
      </div>
    </div>
  )
}
```

**10d. Create API routes for mentoring:**

```
app/api/mentoring/
├── sessions/
│   └── route.ts
├── availability/
│   └── route.ts
└── profiles/
    └── route.ts
```

Example `app/api/mentoring/profiles/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';

export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // TODO: Implement profile fetching logic

  return NextResponse.json({ profiles: [] });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // TODO: Implement profile creation logic

  return NextResponse.json({ success: true });
}
```

**10e. Create Zod schemas for validation:**

```typescript
// lib/validations/mentoring.ts
import { z } from 'zod';

export const profileSchema = z.object({
  bio: z.string().min(10).max(500),
  expertise: z.array(z.string()).min(1).max(10),
  languages: z.array(z.string()).min(1),
  availability: z.object({
    timezone: z.string(),
    schedule: z.array(
      z.object({
        day: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        startTime: z.string(),
        endTime: z.string(),
      })
    ),
  }),
});

export const sessionSchema = z.object({
  mentorId: z.string(),
  menteeId: z.string(),
  scheduledAt: z.date(),
  duration: z.number().min(15).max(120),
  topic: z.string().min(5).max(200),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type SessionFormData = z.infer<typeof sessionSchema>;
```

**COMMIT 10:** `feat: add mentoring feature scaffolding with App Router patterns`

**Test:**

- Navigate to mentoring routes
- Verify authentication redirects work
- Check placeholder pages load
- Verify Server Components render

---

### Phase 11: Update Contributing Documentation (SAFE ✅)

**11a. Update CONTRIBUTING.md:**

```markdown
# Contributing to PanaMia Club

## Development Setup

1. Install dependencies: `npm install`
2. Set up `.env.local` (copy from `example.env`)
3. Start MongoDB: `docker start panamia-mongo`
4. Run dev server: `npm run dev`

## Code Standards

- **Formatting:** Prettier (runs on commit)
- **Linting:** ESLint (runs on commit)
- **TypeScript:** Strict mode enabled
- **Commits:** Conventional commits preferred

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for project structure.

### When to use Pages Router vs App Router

- **Pages Router (`pages/`):** Legacy features, maintenance only
- **App Router (`app/`):** All new features and enhancements

### Styling Guidelines

- **Legacy (pages/):** Continue using Mantine
- **Modern (app/):** Use Tailwind + shadcn/ui

### Form Handling

- **Legacy (pages/):** Formik (existing forms only)
- **Modern (app/):** React Hook Form + Zod

## Pull Request Process

1. Create feature branch from `main`
2. Make changes following architecture guidelines
3. Ensure all tests pass
4. Run `npm run lint` and fix any issues
5. Submit PR with clear description
6. Request review from maintainers

## Testing

- Verify existing pages/ routes still work
- Test new app/ routes thoroughly
- Check authentication flows
- Validate database operations
```

**COMMIT 11:** `docs: update contributing guidelines for dual-stack architecture`

---

## Summary of Commits

### Safe Commits (can merge individually):

1. ✅ Code quality tooling
2. ✅ Add modern dependencies
3. ✅ Documentation
4. ✅ TypeScript config
5. ⚠️ Upgrade core dependencies (TEST THOROUGHLY)
6. ⚠️ App Router foundation (TEST THOROUGHLY)
7. 🔴 NextAuth v5 upgrade (TEST AUTH FLOWS)
8. ✅ shadcn/ui components
9. ✅ Remove Google Analytics
10. ✅ Mentoring scaffolding
11. ✅ Update docs

## Important Constraints

**Must maintain:**

- ✅ Existing Pages Router functionality (zero breakage)
- ✅ MongoDB connection patterns
- ✅ Stripe payment flows
- ✅ Pusher integration
- ✅ BunnyCDN file uploads

**Must NOT do:**

- ❌ Break existing pages
- ❌ Remove Mantine from legacy code
- ❌ Change database schema without approval
- ❌ Modify Stripe webhooks without testing

**Defer decisions:**

- Video infrastructure (TURN servers, etc.)
- Real-time architecture changes
- Database migration strategies

## Success Criteria

- [ ] All commits complete successfully
- [ ] `npm run dev` starts without errors
- [ ] Existing pages accessible and functional
- [ ] Authentication works in both routing systems
- [ ] New app/ routes accessible with modern UI
- [ ] TypeScript strict mode passing
- [ ] Code quality tools running on commit
- [ ] Documentation up to date
- [ ] Mentoring feature scaffolding ready for implementation
- [ ] Zero regression in existing functionality

## Execution Approach

1. **Execute phases in order** (don't skip ahead)
2. **Commit after each phase** with descriptive message
3. **Test thoroughly** after each commit
4. **Request approval** before proceeding to next phase
5. **Flag any issues** or decisions that need input
6. **Document** any deviations from the plan

**Start with Phase 1: Code Quality Foundation**

Please begin and report findings after each phase.

# App Router Migration Plan

## Current Status (December 2025)

### Completed ✓
- ✅ Next.js 15.5.6 upgrade
- ✅ React 19 upgrade
- ✅ NextAuth v4 → v5 migration
- ✅ Auth.js configuration centralized in `auth.ts`
- ✅ App Router auth endpoint: `app/api/auth/[...nextauth]/route.ts`
- ✅ Custom `useVerificationToken` fix for email magic links
- ✅ 19 Pages Router pages updated to use NextAuth v5 `auth()` function
- ✅ Pages Router API routes compatibility layer (`lib/auth-api.ts`)

### Current Architecture
- **Hybrid**: App Router (auth only) + Pages Router (all pages & API routes)
- **Pages**: 48 page components in `pages/` directory
- **API Routes**: 52 API routes in `pages/api/` directory
- **Auth**: Fully functional with email magic links + MongoDB

---

## Phase 8: Full App Router Migration

**Estimated Effort: 12-17 days**
**Status: Not Started**
**Priority: Medium** (current hybrid setup is stable)

### Why Migrate?

1. **Performance**: Server Components reduce JavaScript bundle size
2. **Developer Experience**: Simpler data fetching with async/await
3. **Future-Proof**: Pages Router is in maintenance mode
4. **Modern Features**: Streaming, Suspense, better loading states
5. **NextAuth v5**: Designed for App Router, workarounds needed for Pages Router

### Migration Breakdown

#### 1. API Routes Migration (52 files)
**Effort: 2-3 days**

Convert Pages Router API routes to App Router Route Handlers:

```typescript
// BEFORE: pages/api/example.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getApiSession(req, res)
  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const data = await fetchData()
  return res.status(200).json(data)
}

// AFTER: app/api/example/route.ts
import { NextRequest } from 'next/server'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await fetchData()
  return Response.json(data)
}
```

**Files affected**: All 52 routes in `pages/api/`

**Complexity**: Medium
- Mechanical transformation
- Need to test each endpoint
- Update request/response handling
- 24 routes can remove `getApiSession` workaround and use `auth()` directly

---

#### 2. Static/Simple Pages (~20 files)
**Effort: 1 day**

Pages without data fetching or minimal client interaction:

**Examples**:
- `/about-us` → `app/about-us/page.tsx`
- `/affiliate` → `app/affiliate/page.tsx`
- Static content pages

**Pattern**:
```typescript
// BEFORE: pages/about-us.tsx
export default function AboutUs() {
  return <div>Content</div>
}

// AFTER: app/about-us/page.tsx
export default function AboutUs() {
  return <div>Content</div>
}
```

**Complexity**: Low - mostly file relocation

---

#### 3. Data-Fetching Pages (46 files with getServerSideProps)
**Effort: 3-4 days**

Convert server-side rendering to Server Components:

```typescript
// BEFORE: pages/profile/[slug].tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  const profile = await getProfile(context.params.slug)
  return { props: { profile } }
}

export default function ProfilePage({ profile }) {
  return <Profile data={profile} />
}

// AFTER: app/profile/[slug]/page.tsx
async function getProfile(slug: string) {
  // Direct database/API call
  return await db.profiles.findOne({ slug })
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const profile = await getProfile(params.slug)
  return <Profile data={profile} />
}
```

**Key changes**:
- Remove `getServerSideProps`
- Make page component async
- Move data fetching into component
- Add loading.tsx and error.tsx for each route

**Affected pages**:
- Directory/search pages
- Admin dashboard pages
- Profile pages
- User account pages
- Form pages with pre-filled data

**Complexity**: Medium-High
- Requires understanding data dependencies
- Need to handle loading states properly
- Error boundaries

---

#### 4. Authenticated Pages (19 files)
**Effort: 1-2 days** (overlaps with #3)

Pages already using NextAuth v5 `auth()`:

```typescript
// BEFORE: pages/account/admin.tsx
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await auth(),
    },
  }
}

// AFTER: app/account/admin/page.tsx
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session) redirect('/api/auth/signin')

  return <AdminDashboard session={session} />
}
```

**Files**:
- `pages/admin/download-profiles.tsx`
- `pages/form/become-an-affiliate.tsx`
- `pages/account/admin/users.tsx`
- `pages/account/admin/contactus.tsx`
- `pages/account/admin/signups.tsx`
- `pages/account/admin/podcasts.tsx`
- `pages/account/user.tsx`
- `pages/account/admin.tsx`
- `pages/account/profile/*.tsx` (7 files)
- `pages/account/user/*.tsx` (3 files)

**Complexity**: Low-Medium
- Already using correct auth pattern
- Mainly verification work

---

#### 5. Complex Interactive Pages (~8 files)
**Effort: 2-3 days**

Pages with heavy client-side interaction need client/server split:

**Examples**:
- Form pages (`pages/form/*.tsx`)
- Admin panels with real-time updates
- Interactive dashboards

**Pattern**:
```typescript
// app/form/contact-us/page.tsx (Server Component)
export default async function ContactFormPage() {
  const config = await getFormConfig()
  return <ContactForm config={config} />
}

// components/ContactForm.tsx (Client Component)
'use client'

export function ContactForm({ config }) {
  const [formData, setFormData] = useState({})
  // ... client-side logic
}
```

**Complexity**: High
- Architectural decisions on client/server boundaries
- State management considerations
- Form handling with Server Actions

---

#### 6. Routing & Special Files
**Effort: 1 day**

Create App Router structure:

**New files to create**:
```
app/
├── layout.tsx        # Root layout (from _app.tsx logic)
├── error.tsx         # Global error handler (from _error.tsx)
├── not-found.tsx     # 404 page (from _404.tsx if exists)
├── loading.tsx       # Global loading state
└── [dynamic]/        # Dynamic route segments
    └── page.tsx
```

**Migrations needed**:
- Move `_app.tsx` logic to `layout.tsx`
- Move `_document.tsx` logic to `layout.tsx`
- Update `Link` components (remove `<a>` tags if using legacyBehavior)
- Handle dynamic routes: `[id]`, `[username]`, `[slug]`

**Complexity**: Medium
- Need to understand global app structure
- May require middleware updates

---

#### 7. Testing & Bug Fixes
**Effort: 2-3 days**

Comprehensive testing and fixes:

**Testing checklist**:
- [ ] All pages render correctly
- [ ] Authentication works across all protected routes
- [ ] API endpoints return correct data
- [ ] Forms submit successfully
- [ ] Admin functions work
- [ ] Search/directory features functional
- [ ] No hydration errors
- [ ] Performance benchmarks meet targets
- [ ] SEO metadata preserved

**Common issues to watch**:
- Hydration mismatches (client/server rendering differences)
- Session handling edge cases
- Data fetching race conditions
- Missing error boundaries
- Broken redirects

**Complexity**: Medium-High
- Requires thorough testing
- May uncover unexpected issues

---

## Migration Strategy

### Recommended Approach: Incremental Migration

1. **Preparation** (1 day)
   - Set up app/ directory structure
   - Create root layout.tsx
   - Document current functionality

2. **Phase 1: API Routes** (2-3 days)
   - Migrate all 52 API routes
   - Test each endpoint
   - Remove `lib/auth-api.ts` workaround

3. **Phase 2: Simple Pages** (1 day)
   - Migrate static pages
   - Verify routing works

4. **Phase 3: Data Pages** (3-4 days)
   - Migrate pages with data fetching
   - Add loading/error states
   - Test data flow

5. **Phase 4: Complex Pages** (2-3 days)
   - Split client/server components
   - Implement Server Actions for forms
   - Test interactivity

6. **Phase 5: Cleanup** (2-3 days)
   - Remove pages/ directory
   - Update documentation
   - Performance optimization
   - Final testing

### Alternative: Feature Flag Approach

Run both routers simultaneously:
- New routes in `app/` directory
- Old routes in `pages/` directory
- Gradually move traffic to new routes
- Remove old routes when confident

**Pros**:
- Lower risk
- Easy rollback
- Can test in production

**Cons**:
- More complex codebase temporarily
- Need to maintain both versions
- Longer migration timeline

---

## Rollback Plan

If migration causes critical issues:

1. **Immediate**: Revert the specific problematic page back to Pages Router
2. **Short-term**: Both routers can coexist, prioritize fixing over completing
3. **Long-term**: Maintain Pages Router if App Router proves problematic

---

## Success Metrics

**Performance**:
- [ ] Time to First Byte (TTFB) improved
- [ ] First Contentful Paint (FCP) improved
- [ ] JavaScript bundle size reduced by 20%+

**Functionality**:
- [ ] All existing features work
- [ ] No regression in user experience
- [ ] Auth flow seamless

**Developer Experience**:
- [ ] Simpler data fetching code
- [ ] Better error handling
- [ ] Improved type safety

---

## Notes

- Current hybrid setup is stable and functional
- No urgent need to migrate (Pages Router still supported)
- Recommend migrating when:
  - Adding major new features
  - Have dedicated development time
  - Want to leverage new React/Next.js features

- Can migrate incrementally over multiple sprints
- Some pages may benefit more than others
- Consider ROI for each section

---

## Questions for Planning

Before starting migration:

1. Which pages are most critical to business?
2. Which pages get most traffic?
3. Are there any pages being redesigned soon?
4. What's the timeline/budget for this work?
5. Can we do this incrementally or need all-at-once?

Generated with Claude Code
Last updated: December 2025

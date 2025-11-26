# Migration TODOs

## Completed
- ✅ Next.js 12 → 13 → 14.2.33
- ✅ Remove unused Mantine packages
- ✅ TypeScript 5.3.3
- ✅ Mongoose 8.0.3
- ✅ React 18.3.1
- ✅ App Router foundation created

## Pending Cleanup Work

### Link Component Migration (68 instances)
**Priority:** Low (works fine with legacyBehavior)
**Effort:** 2-4 hours
**Status:** Deferred

All `<Link>` components currently use `legacyBehavior` prop for backward compatibility with Next.js 12 patterns.

**Migration needed:**
- 68 total instances across pages/ and components/
- ~40 simple cases (just text children)
- ~28 complex cases (with className, onClick, styling)

**Modern pattern:**
```tsx
// Current (works fine)
<Link legacyBehavior href="/path"><a>Click</a></Link>

// Target (fully modern)
<Link href="/path">Click</Link>
```

**Approach:**
1. Consider automated codemod for simple cases
2. Manual migration for complex cases
3. Or migrate gradually when touching files for other reasons

**Files with most instances:**
- components/MainHeader.tsx
- components/MainFooter.tsx
- pages/directory/search.tsx
- pages/form/*.tsx

---

## Next Phase: Authentication Upgrade

### NextAuth v4 → v5
**Priority:** HIGH
**Effort:** TBD
**Blockers:** None (Next.js 14 now installed)

Required for modern authentication patterns and better App Router integration.

---

## Future Considerations

### Next.js 15 Upgrade
**Priority:** LOW (defer until stabilized on 14)
**Dependencies:** React 19, various breaking changes
**Recommendation:** Complete NextAuth v5 first, stabilize, then evaluate

### shadcn/ui Components
**Priority:** MEDIUM
**Status:** Ready to implement (Tailwind already configured)

### Remove Google Analytics
**Priority:** LOW (works, just not FLOSS)
**Effort:** 30 minutes

### Mentoring Feature Scaffolding
**Priority:** MEDIUM
**Dependencies:** Authentication stable, WebRTC research needed

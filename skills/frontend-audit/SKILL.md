---
name: frontend-audit
description: "Use when auditing frontend code — component architecture, state management, accessibility, design system consistency, bundle size, and rendering performance. Framework-agnostic with specific guidance for React, Vue, Svelte, and vanilla JS."
---

# Frontend Audit

## Overview

Frontend code is the user's direct experience. Architecture problems here manifest as bugs users can see and feel. A broken backend returns an error; a broken frontend returns confusion, frustration, and churn.

**Core principle:** The UI is the product. If the frontend is broken, nothing else matters to users.

## The Iron Law

```
NO COMPONENT WITHOUT CLEAR RESPONSIBILITY. NO USER INPUT WITHOUT VALIDATION. NO ASYNC OPERATION WITHOUT ALL THREE STATES (LOADING, ERROR, EMPTY).
```

## When to Use

- Auditing frontend architecture
- Reviewing component design
- Investigating UI bugs or inconsistencies
- Before major frontend refactoring
- Performance-related UI complaints
- During any codebase audit
- After onboarding a new frontend framework

## When NOT to Use

- Pure backend API projects with no frontend
- CLI tools (use `architecture-audit` instead)
- Static marketing sites with no interactivity (a quick review of HTML semantics suffices)
- If only a single isolated component needs review (use `code-review` instead)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "components look fine" — open each component file and check its line count, prop count, and responsibilities
- Say "state management is handled" — trace where each piece of state lives and why
- Say "design system is consistent" — grep for hardcoded values, check token adoption
- Judge accessibility by looking at code alone — test keyboard navigation manually
- Skip the bundle analysis — measure actual sizes, not guesses
- Trust component names — read the render method to understand true responsibility
- Say "similar to above" — each component gets its own row in the audit table
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "It works, so it's fine" | Working ≠ maintainable. 600-line components work but are unmaintainable. |
| "We'll refactor later" | Later never comes. Component debt compounds faster than financial debt. |
| "Only one person works on the frontend" | That person will leave. Or get sick. Or forget how it works in 6 months. |
| "It's just a simple form" | Forms are the most complex UI pattern — validation, error states, accessibility, submission states. |
| "We don't need loading states yet" | Users experience blank screens as crashes. Loading states are not optional. |
| "Design tokens are overkill for this project" | Hardcoded values diverge within weeks. Tokens prevent visual entropy. |
| "Screen readers aren't our target audience" | 15% of users have disabilities. It's also a legal requirement in many jurisdictions. |

## Iron Questions (Ask Before Every Component Review)

```
1. If I gave this component to a new developer, could they understand its purpose in 30 seconds?
2. Can I describe what this component does in ONE sentence without using "and"?
3. If I delete this component, what exactly breaks and nothing else?
4. Does every prop this component receives actually change what it renders?
5. Could a user complete the primary action using ONLY a keyboard?
6. What does the user see during the 0-3 seconds between clicking and data loading?
7. What does the user see when there is NO data?
8. What does the user see when the API returns an error?
9. Is every pixel value traceable to a design token?
10. If the API is 10x slower than expected, does this component still behave reasonably?
```

## The Audit Process

### Phase 1: Component Architecture

```
1. MAP the component tree — what renders what (use the framework's devtools or trace imports)
2. IDENTIFY reusable vs one-off components — reusable should be in a shared directory
3. CHECK component responsibility — one component, one job (SRP)
4. FIND components > 200 lines — candidates for splitting
5. LOOK for prop drilling — data passing through 3+ layers without being used
6. CHECK for business logic in render — calculations, filtering, and formatting should be hooks/utils
7. VERIFY component naming — names should describe WHAT, not HOW
```

**Component quality checklist:**

| Check | Healthy | Warning | Unhealthy |
|-------|---------|---------|-----------|
| Lines of code | < 150 | 150-300 | > 300 |
| Props count | < 5 | 5-8 | > 10 |
| Responsibilities | 1 clear purpose | 1 primary + 1 minor | "It handles display, validation, and API calls" |
| State variables | 0-2 | 3-5 | > 5 (split component) |
| useEffect/watchers | 0-1 | 2-3 | > 3 (data fetching layer needed) |
| Children | Composition-based | Some inline renders | Giant render method with 10+ conditionals |
| Re-render triggers | Only when props change | Some unnecessary re-renders | Re-renders on every keystroke |

**Detection patterns:**

```bash
# Find oversized components (> 300 lines)
find . -name "*.tsx" -o -name "*.vue" -o -name "*.svelte" | xargs wc -l | sort -rn | head -20

# Find high prop count components
grep -c "interface.*Props" --include="*.tsx" -r . | grep -v node_modules | sort -t: -k2 -rn | head -20

# Find prop drilling (components passing through props they don't use)
grep -rn "\.\.\.props" --include="*.tsx" . | grep -v node_modules | head -20

# Find business logic in components (API calls in render files)
grep -rn "fetch\|axios\|\.get(\|\.post(" --include="*.tsx" --include="*.vue" . | grep -v node_modules | grep -v "hook\|service\|api\|util" | head -20
```

### Phase 2: State Management

```
1. WHERE does state live? (local, global store, URL, server state)
2. IS the right kind of state in the right place?
3. ARE there state synchronization issues? (same data in two places getting out of sync)
4. IS derived state being stored instead of computed?
5. ARE effects (useEffect / watchers) cleaning up properly?
6. IS server state managed with a dedicated tool? (React Query, SWR, TanStack Query)
7. ARE there unnecessary re-renders caused by state updates?
```

**State placement guide:**

| State Type | Correct Location | Wrong Location | Why |
|-----------|-----------------|---------------|-----|
| Form input values | Local component state | Global store | Forms are ephemeral; global state persists unnecessarily |
| Current user session | Global store / context | Local state | Session survives navigation |
| URL-derived state | URL params / searchParams | Component state | Must survive refresh and be shareable |
| Server data | Server state (React Query, SWR) | Local useState | Server data needs caching, refetching, invalidation |
| UI toggles (modals, dropdowns) | Local state | Global store | UI state is component-scoped |
| Theme / preferences | Context / global store | Prop drilling | Cross-cutting concern needs global access |
| Derived/computed values | useMemo / computed | Separate useState | Stored derived state gets out of sync |

**Framework-specific state smells:**

| Framework | Smell | Fix |
|-----------|-------|-----|
| React | useState + useEffect to sync server data | Use React Query / SWR |
| React | Multiple useState that change together | useReducer or single state object |
| Vue | Deeply nested reactive objects | Flatten state or use computed |
| Svelte | Store for component-local state | Use local reactive declarations |
| All | Prop drilling through 4+ components | Context / provide-inject / store |

### Phase 3: Design System Consistency

```
1. IS there a design system? (tokens, variables, shared components)
2. ARE components using shared tokens or ad-hoc values?
3. IS spacing consistent? (one spacing scale or random pixel values)
4. IS typography consistent? (defined font sizes or ad-hoc rem/px)
5. ARE colors from a palette or hardcoded hex values?
6. ARE breakpoints defined and consistent?
7. IS the component library documented?
```

**Common violations:**

| Violation | Detection | Fix |
|-----------|-----------|-----|
| Hardcoded colors | `grep -rn "#[0-9a-f]\{3,6\}" --include="*.css" --include="*.tsx"` | Use `var(--color-primary)` or theme tokens |
| Hardcoded spacing | `grep -rn "margin.*[0-9]px\|padding.*[0-9]px" --include="*.css"` | Use spacing scale tokens (4, 8, 12, 16, 24, 32, 48) |
| Inline styles for layout | `grep -rn "style={{" --include="*.tsx"` | Use CSS classes or styled-components |
| Inconsistent breakpoints | `grep -rn "max-width.*px\|min-width.*px" --include="*.css"` | Define breakpoint tokens |
| Magic z-index values | `grep -rn "z-index.*[0-9]" --include="*.css" --include="*.tsx"` | Define z-index scale (1, 10, 100, 1000) |
| Unsystematic font sizes | `grep -rn "font-size" --include="*.css"` | Define type scale (xs, sm, md, lg, xl) |
| Mixed unit systems | Both px and rem throughout | Standardize on rem with px fallbacks |

### Phase 4: Error, Loading, and Empty States

```
1. DOES every async operation have a loading state?
2. DOES every async operation have an error state with retry?
3. ARE empty states handled? (no data, no results, first use)
4. DO forms show validation errors clearly and next to the input?
5. DO failed submissions preserve user input?
6. IS there a global error boundary?
7. DO timeout/offline states have dedicated UI?
```

**State coverage matrix (complete for EVERY component with async operations):**

| Component | Loading | Error | Empty | Success | Partial | Timeout | Offline |
|-----------|---------|-------|-------|---------|---------|---------|---------|
| UserList | ✅ Skeleton | ✅ Retry | ❌ Missing | ✅ | N/A | ❌ | ❌ |
| Dashboard | ⚠️ Spinner | ❌ Generic | ❌ | ✅ | ❌ | ❌ | ❌ |

**Quality standards per state:**

| State | Minimum Acceptable | Gold Standard |
|-------|-------------------|---------------|
| Loading | Spinner or skeleton | Content-shaped skeleton with shimmer animation |
| Error | Error message | Error message + retry button + help link |
| Empty | "No items" text | Illustration + explanation + call-to-action |
| Success | Data displayed | Smooth transition with optional celebration |
| Timeout | Generic error | "Taking longer than expected" with retry |
| Offline | Nothing | Offline indicator with cached data if available |

### Phase 5: Accessibility (Quick Check)

```
1. DO images have descriptive alt text (not "image" or "photo")?
2. ARE interactive elements focusable and keyboard-accessible?
3. IS there visible focus style (not just browser default outline: none)?
4. DO form inputs have associated <label> elements?
5. ARE color contrast ratios sufficient (4.5:1 text, 3:1 components)?
6. DO modals trap focus correctly?
7. CAN the entire primary flow be completed with keyboard only?
8. IS there a skip navigation link?
```

(For deep accessibility audit, use `accessibility-audit` skill)

### Phase 6: Bundle and Performance

```
1. WHAT is the total bundle size? (target: < 200KB initial, < 500KB total)
2. ARE there unnecessary dependencies? (moment.js, lodash full import, full icon packs)
3. IS code splitting used for routes?
4. ARE images optimized (WebP, responsive sizes, lazy loading)?
5. ARE heavy components lazily loaded?
6. IS tree shaking working? (no importing entire libraries for one function)
7. ARE fonts optimized (subset, preload, font-display: swap)?
8. ARE third-party scripts deferred?
```

**Common bundle bloat sources:**

| Dependency | Typical Size | Lighter Alternative | Savings |
|-----------|-------------|-------------------|---------|
| moment.js | 284KB | dayjs (2KB) or date-fns (tree-shakeable) | ~280KB |
| lodash (full) | 72KB | lodash-es (tree-shakeable) or native | ~60KB |
| Material UI (full) | 400KB+ | Import individual components | ~300KB |
| Font Awesome (all) | 1.5MB | Only import used icons | ~1.4MB |
| Axios | 13KB | Native fetch | 13KB |

**Detection:**

```bash
# Check bundle size (if available)
npx bundle-phobia [package-name]

# Find full library imports
grep -rn "import .* from 'lodash'" --include="*.ts" --include="*.tsx" . | grep -v node_modules
grep -rn "import .* from '@mui/material'" --include="*.ts" --include="*.tsx" . | grep -v node_modules

# Find unoptimized images
find . -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | xargs ls -la | sort -k5 -rn | head -10
```

### Phase 7: Rendering Performance

```
1. ARE lists virtualized for > 100 items? (react-window, vue-virtual-scroller)
2. ARE expensive computations memoized? (useMemo, computed)
3. ARE component re-renders minimized? (React.memo, shouldComponentUpdate)
4. ARE event handlers debounced for high-frequency inputs? (search, resize, scroll)
5. IS there unnecessary DOM manipulation?
6. ARE animations using GPU-accelerated properties? (transform, opacity — not top, left, width)
```

## Output Format

```markdown
# Frontend Audit: [Project Name]

## Overview
- **Framework:** [React/Vue/Svelte/Vanilla]
- **Components:** N total, N reusable, N one-off, N oversized (>300 LOC)
- **Bundle Size:** XKB initial / XKB total
- **Design System:** Comprehensive / Partial / Missing
- **State Management:** [Library/approach]
- **Accessibility:** WCAG AA Compliant / Partial / Non-compliant

## Component Health
| Component | Lines | Props | State Vars | Responsibilities | States Covered | Assessment |
|-----------|-------|-------|------------|------------------|----------------|------------|
| UserDashboard | 450 | 12 | 8 | Display, fetch, filter | Loading only | 🔴 Split needed |
| LoginForm | 85 | 3 | 2 | Auth form | All 4 | 🟢 Healthy |

## State Management Assessment
| State Type | Location | Assessment |
|-----------|----------|------------|
| Server data | React Query | 🟢 Correct |
| Form state | Local useState | 🟢 Correct |
| User session | Redux store | 🟢 Correct |
| Derived values | Separate useState | 🔴 Should be useMemo |

## Design System Compliance
| Check | Violations | Assessment |
|-------|-----------|------------|
| Hardcoded colors | 23 instances | 🟠 High |
| Hardcoded spacing | 45 instances | 🔴 Critical |
| Inline styles | 12 instances | 🟡 Medium |

## Bundle Analysis
| Chunk | Size | Assessment |
|-------|------|------------|
| Main | 180KB | 🟢 Under 200KB |
| Vendor | 350KB | 🟡 Could tree-shake |

## Findings
[Standard severity format — sorted by severity]

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🟢 Low | N |

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — STOP and Investigate

- Components > 500 lines (god components)
- Prop drilling through 4+ levels
- Business logic in UI components (API calls, calculations in render)
- No loading/error/empty states on async components
- Hardcoded strings (no i18n preparation)
- No design tokens (all ad-hoc values)
- Direct DOM manipulation in framework components
- `any` types in TypeScript component props
- Console.log statements in production code
- Inline styles for layout that should be CSS
- No error boundary at the application root
- Z-index values > 9999 (z-index wars)

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Deep dive:** `accessibility-audit` for WCAG compliance
- **Performance:** `performance-audit` for rendering metrics
- **Design verification:** `product-completeness-audit` for visual completeness
- **API connection:** `full-stack-api-integration` for data flow verification

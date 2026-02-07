---
name: frontend-audit
description: "Use when auditing frontend code — component architecture, state management, accessibility, design system consistency, bundle size, and rendering performance. Framework-agnostic with specific guidance for React, Vue, Svelte, and vanilla JS."
---

# Frontend Audit

## Overview

Frontend code is the user's direct experience. Architecture problems here manifest as bugs users can see and feel.

**Core principle:** The UI is the product. If the frontend is broken, nothing else matters to users.

## The Iron Law

```
NO COMPONENT WITHOUT CLEAR RESPONSIBILITY. NO USER INPUT WITHOUT VALIDATION.
```

## When to Use

- Auditing frontend architecture
- Reviewing component design
- Investigating UI bugs or inconsistencies
- Before major frontend refactoring
- Performance-related UI complaints
- During any codebase audit

## The Audit Process

### Phase 1: Component Architecture

```
1. MAP the component tree — what renders what
2. IDENTIFY reusable vs one-off components
3. CHECK component responsibility — one component, one job
4. FIND components > 200 lines — candidates for splitting
5. LOOK for prop drilling — data passing through many layers
```

**Component quality checklist:**

| Check | Healthy | Unhealthy |
|-------|---------|-----------|
| Lines of code | < 200 | > 300 |
| Props count | < 7 | > 10 |
| Responsibilities | 1 clear purpose | "It handles display, validation, and API calls" |
| State complexity | Minimal local state | Multiple useState with complex updates |
| Children | Composition-based | Giant render method |

### Phase 2: State Management

```
1. WHERE does state live? (local, global store, URL, server)
2. IS the right kind of state in the right place?
3. ARE there state synchronization issues?
4. IS derived state being stored instead of computed?
```

**State placement guide:**

| State Type | Where It Belongs | Not Here |
|-----------|-----------------|----------|
| Form input values | Local component state | Global store |
| Current user session | Global store / context | Local state |
| URL-derived state | URL params | Component state |
| Server data | Server state (React Query, SWR) | Local useState |
| UI toggles (modals, dropdowns) | Local state | Global store |
| Theme / preferences | Context / global store | Prop drilling |

### Phase 3: Design System Consistency

```
1. IS there a design system? (tokens, variables, shared components)
2. ARE components using shared tokens or ad-hoc values?
3. IS spacing consistent? (one spacing scale or random values)
4. IS typography consistent? (defined font sizes or ad-hoc)
5. ARE colors from a palette or hardcoded hex values?
```

**Common violations:**

| Violation | Example | Fix |
|-----------|---------|-----|
| Hardcoded colors | `color: #3b82f6` | Use `var(--color-primary)` |
| Hardcoded spacing | `margin: 13px` | Use spacing scale tokens |
| Inline styles for layout | `style={{ display: flex }}` | Use CSS classes |
| Inconsistent breakpoints | `@media (max-width: 768px)` vs `800px` | Define breakpoint tokens |

### Phase 4: Error and Loading States

```
1. DOES every async operation have a loading state?
2. DOES every async operation have an error state?
3. ARE empty states handled? (no data, no results, first use)
4. DO forms show validation errors clearly?
5. DO failed submissions preserve user input?
```

**State coverage matrix (per component):**

| State | Handled? | Quality |
|-------|----------|---------|
| Loading | ✅/❌ | Skeleton / spinner / blank |
| Error | ✅/❌ | Retry option / helpful message / generic |
| Empty | ✅/❌ | Call to action / illustration / blank |
| Success | ✅/❌ | Feedback / animation / nothing |
| Partial | ✅/❌ | Graceful degradation / crash |

### Phase 5: Accessibility (Quick Check)

```
1. DO images have alt text?
2. ARE interactive elements focusable?
3. IS there keyboard navigation?
4. DO form inputs have labels?
5. ARE colors sufficient contrast ratio?
6. DO modals trap focus correctly?
```

(For deep accessibility audit, use `accessibility-audit` skill)

### Phase 6: Bundle and Performance

```
1. WHAT is the total bundle size? (target < 500KB)
2. ARE there unnecessary dependencies? (moment.js, lodash full import)
3. IS code splitting used for routes?
4. ARE images optimized (WebP, lazy loading)?
5. ARE heavy components lazily loaded?
```

## Output Format

```markdown
# Frontend Audit: [Project Name]

## Overview
- **Framework:** [React/Vue/Svelte/Vanilla]
- **Components:** N total, N reusable, N one-off
- **Bundle Size:** XKB
- **Design System:** Present / Partial / Missing

## Component Health
| Component | Lines | Props | Responsibilities | Assessment |
|-----------|-------|-------|------------------|------------|
| UserDashboard | 450 | 12 | Display, fetch, filter | 🔴 Split needed |

## Findings
[Standard severity format]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- Components > 500 lines
- Prop drilling through 4+ levels
- Business logic in UI components
- No loading/error states
- Hardcoded strings (no i18n preparation)
- No design tokens (all ad-hoc values)
- Direct DOM manipulation in framework components

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Deep dive:** `accessibility-audit` for WCAG compliance
- **Performance:** `performance-audit` for rendering metrics

---
name: ui-ux-redesign
description: "Use when the frontend needs a visual overhaul — redesign with uniformity. Exhaustively audits the existing frontend (design tokens, components, layouts, typography, color, spacing, animations), maps every backend API and data model, identifies UI/UX problems, and generates a prioritized redesign plan with concrete before/after suggestions. Framework-agnostic."
---

# UI/UX Redesign

## Overview

Redesign is not about making things prettier — it's about making things **coherent**. A disjointed UI is a symptom of incremental feature additions without design governance. This skill forces a full-stack visual audit: understand what data the backend provides, inventory every frontend component, expose every inconsistency, and produce an actionable redesign plan that creates **visual and behavioral uniformity**.

**Core principle:** Beautiful design is uniform design. Every pixel should feel like it belongs to the same system.

## The Iron Law

```
NO REDESIGN WITHOUT A FULL INVENTORY. NO SUGGESTION WITHOUT EVIDENCE. NO VISUAL CHANGE WITHOUT UNDERSTANDING THE DATA BEHIND IT.
```

## When to Use

- The UI feels inconsistent, disjointed, or "not right"
- After multiple feature additions without design review
- Before a major version release or public launch
- When users complain about usability (but functionality works)
- When onboarding to a product and the frontend needs modernization
- When switching design direction (dark mode, rebrand, redesign)
- After merging contributions from multiple developers/AI sessions
- When a client or stakeholder says "make it look professional"

## When NOT to Use

- Greenfield projects (there's nothing to redesign — use `brainstorming` → `writing-plans`)
- Pure backend/API projects with no frontend
- Single component fixes (use `code-review` or `frontend-audit`)
- Performance-only issues (use `performance-audit`)
- Accessibility-only issues (use `accessibility-audit`)
- When the problem is functionality, not presentation (debug first)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Suggest redesign without first inventorying EVERY existing component — you don't know what exists
- Suggest new components without checking if a similar one already exists — avoid duplication
- Recommend colors without documenting the EXISTING color palette first — understand before changing
- Recommend spacing changes without mapping the EXISTING spacing scale — measure before prescribing
- Say "modernize the UI" without defining exactly WHAT modern means for THIS product — vague is useless
- Skip the backend API audit — the frontend displays data: understand what data exists
- Suggest layout changes without understanding responsive behavior at ALL breakpoints
- Recommend a design system without checking if one partially exists
- Say "use Tailwind/Material/whatever" without analyzing what's ALREADY in use
- Propose animations without understanding current render performance
- Skip user flow analysis — UX redesign without user flows is decoration, not design
- Suggest removing features for aesthetic purposes — functionality is non-negotiable
- Claim "this looks better" without explaining WHY from a design principle perspective
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "Let's just use a component library" | Dropping in MUI/Shadcn without adapting creates a Frankenstein UI. Libraries require configuration. |
| "Dark mode will fix it" | Dark mode with inconsistent tokens looks worse than light mode with consistent tokens. Fix tokens first. |
| "We need a complete rewrite" | 90% of redesigns can be achieved with token harmonization + component consolidation. Rewrites are last resort. |
| "Users don't care about design" | Users don't SAY they care. But they choose the product that FEELS better. Design is trust. |
| "It works, so it's fine" | Working but ugly = users tolerate it. Working AND beautiful = users love it. |
| "We should follow [trend X]" | Trends without purpose is cargo-cult design. Every choice needs a reason grounded in YOUR product. |
| "Just copy [competitor]" | Copying competitors without understanding WHY they designed that way produces shallow imitations. |
| "Animations will make it feel premium" | Animations on a broken layout make the brokenness more visible. Fix structure first, animate second. |

## Iron Questions

```
1. Can I list EVERY design token currently in use? (colors, spacing, typography, shadows, radii, z-indices)
2. Can I draw the component hierarchy from memory after auditing? (if not, I didn't audit deeply enough)
3. For each API endpoint, do I know EXACTLY what data it returns and which component displays it?
4. Can I identify the 3 most inconsistent visual elements? (with evidence — screenshots or measurements)
5. Can I describe the current user's journey through every primary flow? (with pain points marked)
6. Are there components doing the same thing with different designs? (list all duplicates)
7. What is the current spacing scale? Is it consistent or chaotic?
8. What is the current color palette? How many unique colors exist vs how many SHOULD exist?
9. What does the UI look like at 320px, 768px, 1024px, 1440px, and 1920px? (responsive audit)
10. If I showed this to a designer, what would they fix FIRST?
```

## The Process

### Phase 1: Backend API & Data Model Inventory

```
UNDERSTAND WHAT DATA EXISTS BEFORE TOUCHING THE FRONTEND.

1. MAP every API endpoint:
   | Endpoint | Method | Response Shape | Used By (Component) | UI State Coverage |
   |----------|--------|---------------|---------------------|-------------------|
   | /api/users | GET | { users: User[] } | UserList, UserTable | Loading ✅ Error ❌ Empty ❌ |

2. DOCUMENT every data model:
   | Model | Fields | Frontend Representation | Display Issues |
   |-------|--------|------------------------|----------------|
   | User | id, name, email, avatar, role, createdAt | Avatar+Name in cards, email in detail | Truncation on mobile, no fallback avatar |

3. IDENTIFY data not yet surfaced:
   - Backend fields that exist but frontend doesn't display
   - Relationships that could enhance UX (e.g., user → orders → analytics)
   - Computed/aggregated data available but not visualized

4. IDENTIFY frontend displays with no backend:
   - Hardcoded placeholder data
   - Mock data still in production
   - Features that call endpoints that don't exist yet
```

### Phase 2: Frontend Component Inventory (EXHAUSTIVE)

```
CATALOG EVERY VISUAL ELEMENT. MISS NOTHING.

1. COMPONENT CENSUS:
   For EVERY component in the codebase, record:
   | Component | File | Lines | Purpose | Used Where | Props | Visual Pattern |
   |-----------|------|-------|---------|------------|-------|---------------|
   | Button | ui/Button.tsx | 45 | Primary action trigger | 34 places | variant, size, icon, disabled | 3 visual variants |
   | Card | components/Card.tsx | 120 | Content container | 12 places | title, children, footer | 2 visual variants |

2. DUPLICATE DETECTION:
   - Components doing the same thing with different names
   - Inline JSX that should be a shared component
   - Similar-but-different cards, buttons, modals, tables
   | Component A | Component B | Similarity | Resolution |
   |------------|------------|------------|------------|
   | UserCard | ProfileCard | 85% same layout | Merge into PersonCard with variant prop |

3. LAYOUT PATTERNS:
   - Page layouts (sidebar? top nav? full width?)
   - Grid systems (CSS Grid? Flexbox? Both?)
   - Container widths and max-widths
   - Content area padding patterns

4. VISUAL HIERARCHY:
   - What draws the eye first on each page?
   - Is the hierarchy intentional or accidental?
   - Do CTAs stand out? Are they consistent?
```

### Phase 3: Design Token Audit

```
THIS IS THE FOUNDATION. IF TOKENS ARE BROKEN, EVERYTHING IS BROKEN.

1. COLOR AUDIT:
   □ Extract EVERY unique color value from CSS/styled-components/Tailwind config
   □ Group by usage (brand, semantic, neutral, accent, status)
   □ Count: How many unique colors exist vs how many SHOULD exist?
   □ Map: Which components use which colors?
   | Current Color | Usage Count | Category | Recommended Token |
   |--------------|-------------|----------|-------------------|
   | #6366f1 | 23 | Brand primary | --color-primary |
   | #6467f2 | 4 | Brand primary (variant) | MERGE with --color-primary |
   | #ef4444 | 12 | Error/danger | --color-destructive |
   | #e11d48 | 3 | Error (different shade) | MERGE with --color-destructive |

   TARGET: Every product needs at most:
   - 1 primary + 1 secondary brand color
   - 5 neutrals (50, 100, 300, 500, 900 or equivalent)
   - 4 semantic colors (success, warning, error, info)
   - 2-3 accent colors
   - Background, surface, border variations

2. SPACING AUDIT:
   □ Extract EVERY unique spacing/padding/margin/gap value
   □ Sort numerically
   □ Identify the implied scale (4px base? 8px base? No system?)
   | Current Values | Frequency | Recommended Token |
   |---------------|-----------|-------------------|
   | 4px | 45 | --space-1 |
   | 8px | 89 | --space-2 |
   | 12px | 34 | --space-3 |
   | 16px | 67 | --space-4 |
   | 13px | 3 | REMOVE — use 12 or 16 |
   | 15px | 2 | REMOVE — use 16 |
   | 20px | 28 | --space-5 |
   | 24px | 41 | --space-6 |
   | 32px | 22 | --space-8 |
   | 48px | 15 | --space-12 |
   | 64px | 8 | --space-16 |

   TARGET: One spacing scale. 4px or 8px base. No exceptions.

3. TYPOGRAPHY AUDIT:
   □ Extract EVERY unique font-size, font-weight, line-height, letter-spacing
   □ Map to a type scale (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
   □ Check font-family consistency
   | Current Size | Weight | Line Height | Usage | Recommended Token |
   |-------------|--------|-------------|-------|-------------------|
   | 12px | 400 | 1.5 | Captions, labels | --text-xs |
   | 14px | 400 | 1.5 | Body small, secondary | --text-sm |
   | 16px | 400 | 1.6 | Body default | --text-base |
   | 18px | 600 | 1.4 | Subheadings | --text-lg |
   | 24px | 700 | 1.3 | Section headings | --text-xl |
   | 32px | 800 | 1.2 | Page titles | --text-2xl |
   | 15px | 500 | 1.45 | Inconsistent! | REMOVE — use 14 or 16 |

4. OTHER TOKENS:
   □ Border radii (how many unique values? should be 3-4 max)
   □ Shadows (box-shadow values — should be 3-4 levels)
   □ Z-index (should be a defined scale, not random numbers)
   □ Transitions (duration + easing — should be consistent)
   □ Breakpoints (should be defined, not ad-hoc pixel values)
   □ Border widths (1px, 2px at most)
   □ Opacity values (if used for states like disabled, hover)
```

### Phase 4: User Flow & UX Analysis

```
TRACE EVERY USER JOURNEY. IDENTIFY EVERY FRICTION POINT.

1. IDENTIFY PRIMARY USER FLOWS:
   For each flow, walk through it step by step:
   | Flow | Steps | Friction Points | Severity |
   |------|-------|----------------|----------|
   | Sign up | Landing → Register → Verify Email → Onboarding → Dashboard | 3: Email form has no inline validation, onboarding has 6 steps (too many), dashboard is empty on first visit | 🟠🟡🔴 |

2. NAVIGATION AUDIT:
   □ Is the information architecture logical?
   □ Can users find features without hunting?
   □ Is navigation consistent across pages?
   □ Are there dead ends (pages with no clear next action)?
   □ How many clicks to reach the most-used feature?

3. FEEDBACK & STATE AUDIT:
   For EVERY interactive element:
   □ Does clicking produce immediate visual feedback?
   □ Are hover states present and consistent?
   □ Are active/pressed states visible?
   □ Are disabled states clearly distinguishable?
   □ Do transitions feel smooth or jarring?

4. COGNITIVE LOAD ASSESSMENT:
   □ How much information is shown at once? (less is more)
   □ Are there clear visual groups/sections?
   □ Is there a clear visual hierarchy?
   □ Are related actions grouped together?
   □ Can a first-time user figure out the primary action?

5. MOBILE/RESPONSIVE EXPERIENCE:
   Check at: 320px, 375px, 768px, 1024px, 1440px, 1920px
   | Breakpoint | Issues |
   |-----------|--------|
   | 320px | Text overflows card, nav hamburger missing, table not scrollable |
   | 768px | Good |
   | 1024px | Too much whitespace, content area too narrow |
   | 1920px | Content stretches too wide, max-width missing |
```

### Phase 5: Visual Consistency Analysis

```
THE BIG PICTURE — DOES THE APP FEEL LIKE ONE PRODUCT?

1. CONSISTENCY MATRIX:
   Check each component type against the design standard:
   | Element | Consistent? | Variants Found | Recommended |
   |---------|------------|---------------|-------------|
   | Buttons | ❌ | 5 different styles across pages | 3 variants: primary, secondary, ghost |
   | Cards | ❌ | 4 different border-radius values | 1 radius: 12px |
   | Headings | ⚠️ | Mostly consistent, 2 outliers | Enforce type scale |
   | Forms | ❌ | Different input styles per page | 1 input component |
   | Modals | ✅ | Consistent | Keep |
   | Tables | ❌ | 3 different table implementations | 1 DataTable component |
   | Icons | ⚠️ | Mixed icon libraries | Standardize on one |
   | Spacing | ❌ | 18 unique spacing values | 10-token scale |

2. BRAND COHESION:
   □ Does the color palette feel intentional?
   □ Is there a clear primary action color?
   □ Are status colors (success/warning/error) uniform?
   □ Does the typography feel like one family?
   □ Is the overall mood consistent? (playful, professional, minimal, bold?)

3. ANIMATION & MOTION:
   □ Are transitions present? Consistent duration?
   □ Do animations serve a purpose (feedback) or just decoration?
   □ Is motion reduced for accessibility (prefers-reduced-motion)?
   □ Are loading animations consistent?
```

### Phase 6: Redesign Recommendations

```
EVERY RECOMMENDATION MUST INCLUDE:
1. THE PROBLEM (with evidence — component name, file, screenshot/description)
2. THE PRINCIPLE (which design rule is violated)
3. THE SOLUTION (specific, actionable, with code/token reference)
4. THE PRIORITY (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low)
5. THE EFFORT (S/M/L/XL)

ORGANIZE BY LAYER:

LAYER 1 — DESIGN TOKENS (fix first — everything depends on these):
| Token Category | Current State | Recommended | Effort |
|---------------|--------------|-------------|--------|
| Colors | 34 unique values, no system | 16 tokens: 4 brand, 5 neutral, 4 semantic, 3 accent | M |
| Spacing | 18 unique values, 4px/8px mix | 10 tokens on 4px base: 4,8,12,16,20,24,32,48,64,96 | S |
| Typography | Font sizes vary by page | 7 sizes: xs(12),sm(14),base(16),lg(18),xl(24),2xl(32),3xl(40) | S |
| Radii | 4 values: 4,6,8,12 | 3 values: sm(6),md(10),lg(16),full(999) | S |
| Shadows | Random elevation values | 3 levels: sm, md, lg | S |

LAYER 2 — BASE COMPONENTS (fix second — pages are composed of these):
| Component | Problem | Recommendation | Effort |
|-----------|---------|----------------|--------|
| Button | 5 variants, inconsistent sizing | Consolidate to 3 variants (primary, secondary, ghost) × 3 sizes (sm, md, lg) | M |
| Input | Different styles per page | Single Input component with validation states | M |
| Card | Inconsistent padding and borders | Single Card with variant prop (default, elevated, outlined) | S |

LAYER 3 — LAYOUT & NAVIGATION (fix third — structure defines the experience):
| Area | Problem | Recommendation | Effort |
|------|---------|----------------|--------|
| Page layout | Inconsistent content width | Global max-width container with responsive padding | S |
| Navigation | Mobile nav missing on 3 pages | Consistent responsive nav component | M |
| Footer | Different on every page | Shared Footer component | S |

LAYER 4 — PAGE-LEVEL UI (fix last — built from the layers above):
| Page | Problems | Recommendations | Effort |
|------|----------|----------------|--------|
| Dashboard | Too dense, no visual hierarchy | Card-based layout with clear sections, whitespace between groups | L |
| Settings | Flat list of options, overwhelming | Grouped sections with tabs or accordion | M |
| Profile | Sparse, feels unfinished | Rich profile card with stats, activity timeline | M |

LAYER 5 — UX IMPROVEMENTS (enhance after visual consistency is achieved):
| Flow | Problem | Recommendation | Effort |
|------|---------|----------------|--------|
| Onboarding | 6 steps, high drop-off | 3 steps max, progressive disclosure | L |
| Error states | Generic "something went wrong" | Contextual error messages with retry actions | M |
| Empty states | Blank pages | Illustrated empty states with CTAs | M |
| Loading | Inconsistent (some spinner, some nothing) | Skeleton loading for all async content | M |
```

### Phase 7: Implementation Plan

```
PRODUCE A PHASED PLAN — never attempt all at once.

WAVE 1 — Foundation (1-2 days):
□ Create/consolidate design tokens file (CSS variables or theme config)
□ Audit and replace all hardcoded values with tokens
□ Result: Consistent tokens, even if components aren't perfect yet

WAVE 2 — Base Components (2-3 days):
□ Rebuild/consolidate shared components (Button, Input, Card, Modal)
□ Document component API with props and variants
□ Replace ALL instances of old components with new ones
□ Result: Component library with consistent look

WAVE 3 — Layout & Structure (1-2 days):
□ Implement consistent page layout (container, sidebar, header)
□ Fix responsive breakpoints globally
□ Standardize navigation across all pages
□ Result: Structural consistency

WAVE 4 — Page Refinement (2-4 days):
□ Redesign individual pages using new components and tokens
□ Apply visual hierarchy improvements
□ Address page-specific UX issues
□ Result: Every page feels like the same product

WAVE 5 — Polish (1-2 days):
□ Add/standardize transitions and micro-animations
□ Implement consistent loading, error, and empty states
□ Final responsive audit at all breakpoints
□ Accessibility pass (focus states, contrast, keyboard nav)
□ Result: Professional, polished, uniform product
```

## Output Format

```markdown
# UI/UX Redesign Audit: [Project Name]

## Executive Summary
- **Current State:** [Fragmented / Partially consistent / Needs polish]
- **Primary Issues:** [Top 3 problems in one sentence each]
- **Estimated Effort:** [Total effort across all waves]
- **Risk Level:** [Low — token harmonization / High — structural changes]

## Backend API & Data Inventory
[Phase 1 tables]

## Component Census
- **Total components:** N
- **Shared/reusable:** N
- **Duplicates found:** N
- **Oversized (>300 LOC):** N
[Phase 2 tables]

## Design Token Audit
[Phase 3 tables — colors, spacing, typography, other]

## UX Flow Analysis
[Phase 4 findings]

## Visual Consistency Score
| Area | Score | Issues |
|------|-------|--------|
| Color consistency | 4/10 | 34 unique colors, no palette |
| Spacing consistency | 3/10 | 18 values, no scale |
| Typography consistency | 6/10 | Mostly OK, 4 outliers |
| Component consistency | 5/10 | 8 duplicate patterns |
| Layout consistency | 7/10 | Generally OK, mobile issues |
| Motion/animation | 2/10 | Inconsistent, some missing |
| **Overall** | **4.5/10** | **Needs comprehensive redesign** |

## Redesign Recommendations
### Layer 1: Design Tokens [Priority: 🔴 Critical]
[Phase 6 Layer 1 table]

### Layer 2: Base Components [Priority: 🟠 High]
[Phase 6 Layer 2 table]

### Layer 3: Layout & Navigation [Priority: 🟡 Medium]
[Phase 6 Layer 3 table]

### Layer 4: Page-Level UI [Priority: 🟡 Medium]
[Phase 6 Layer 4 table]

### Layer 5: UX Improvements [Priority: 🟢 Low]
[Phase 6 Layer 5 table]

## Implementation Plan
[Phase 7 wave plan]

## Before/After Previews
[For each major recommendation, describe or mockup the before and after]

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🟢 Low | N |

## Estimated Timeline
| Wave | Description | Effort | Dependencies |
|------|-------------|--------|-------------|
| 1 | Design Tokens | S-M | None |
| 2 | Base Components | M | Wave 1 |
| 3 | Layout | S-M | Wave 1 |
| 4 | Pages | M-L | Waves 2+3 |
| 5 | Polish | S-M | Wave 4 |
```

## Red Flags — STOP and Investigate

- No design tokens or CSS variables at all (everything hardcoded)
- More than 30 unique color values (palette explosion)
- More than 15 unique spacing values (spacing chaos)
- Multiple button/card/input implementations doing the same thing
- Components over 500 lines with mixed concerns
- No responsive behavior below 768px
- No loading states on any async content
- Inline styles used for layout throughout the codebase
- Multiple icon libraries mixed together
- No consistent hover/focus/active states
- Z-index values over 9999 (z-index wars)
- Fonts loaded without preload or font-display strategy
- No visual feedback on user interactions (clicks feel dead)

## Integration

- **Precedes:** `writing-plans` → `executing-plans` when redesigning
- **Uses data from:** `frontend-audit` for component health, `codebase-mapping` for architecture
- **Pairs with:** `codebase-conformity` — after redesign, new code must match the NEW patterns
- **Pairs with:** `accessibility-audit` — redesign is the perfect time to fix a11y
- **Validated by:** `product-completeness-audit` — verify nothing was lost in redesign
- **Followed by:** `verification-before-completion` — verify the redesign is actually better
- **Backend context:** `api-design-audit` — understand what data is available for the frontend

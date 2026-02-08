---
description: Full UI/UX redesign audit — inventories backend APIs, audits every component and design token, analyzes user flows, and produces a layered redesign plan with implementation waves
---

# UI/UX Redesign Workflow

// turbo-all

## Steps

1. **Backend API Inventory**
   - Map every API endpoint, response shape, and which component uses it
   - Document data models and identify unused/missing data
   - Note endpoints without frontend representation and vice versa

2. **Component Census**
   - List EVERY component: file, lines, purpose, usage count, visual pattern
   - Detect duplicates — components doing the same thing with different designs
   - Map layout patterns (grids, containers, page structures)
   - Identify oversized components (>300 LOC)

3. **Design Token Extraction**
   - Extract ALL unique colors from CSS/styled/Tailwind → map to recommended palette
   - Extract ALL unique spacing values → map to a consistent scale (4px base)
   - Extract ALL typography values → map to a type scale
   - Audit border-radii, shadows, z-indices, transitions, breakpoints

4. **User Flow Analysis**
   - Walk through every primary user flow step-by-step
   - Mark friction points (dead ends, confusing navigation, missing feedback)
   - Check responsive behavior at 320px, 768px, 1024px, 1440px
   - Assess cognitive load per page

5. **Visual Consistency Scoring**
   - Score each area: color, spacing, typography, components, layout, motion
   - Produce an overall consistency score (1-10)
   - Identify the top 5 most inconsistent elements

6. **Redesign Recommendations**
   - Layer 1: Design tokens (fix first — foundation)
   - Layer 2: Base components (Button, Input, Card, Modal — everything builds on these)
   - Layer 3: Layout & navigation (structural consistency)
   - Layer 4: Page-level UI (apply layers 1-3 to each page)
   - Layer 5: UX polish (transitions, loading/error/empty states, micro-interactions)

7. **Implementation Plan**
   - Wave 1: Token foundation (1-2 days)
   - Wave 2: Component consolidation (2-3 days)
   - Wave 3: Layout standardization (1-2 days)
   - Wave 4: Page refinement (2-4 days)
   - Wave 5: Polish & accessibility (1-2 days)

8. **Produce Report**
   - Full audit document following the skill output format
   - Include before/after descriptions for each major recommendation
   - Priority-sorted findings with effort estimates

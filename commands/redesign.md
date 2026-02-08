---
description: "Run a full UI/UX redesign audit — inventories backend, audits every component, extracts design tokens, analyzes user flows, and produces layered redesign recommendations"
---

# /redesign

Triggers the `ui-ux-redesign` skill with the `/redesign` workflow.

## Usage

```
/redesign
/redesign "the dashboard feels cluttered and inconsistent"
/redesign "we need to modernize the entire frontend"
```

## What Happens

1. **Backend scan** — maps every API endpoint and data model
2. **Component census** — inventories every frontend component, detects duplicates
3. **Token extraction** — extracts all colors, spacing, typography, radii, shadows
4. **UX analysis** — walks every user flow, marks friction points
5. **Consistency scoring** — rates visual uniformity 1-10 per area
6. **Recommendations** — layered redesign plan (tokens → components → layout → pages → polish)
7. **Implementation plan** — phased waves with effort estimates

## Output

A comprehensive redesign audit report with:
- Backend API & data inventory
- Component census with duplicates
- Design token audit (current vs recommended)
- Visual consistency scores
- Layered redesign recommendations with priority and effort
- Phased implementation plan

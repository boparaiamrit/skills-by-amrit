# /redesign Command Examples

> Run a full UI/UX redesign audit

## Usage

### Antigravity

```
/redesign
/redesign "the dashboard feels cluttered and inconsistent"
```

### Claude Code

```
@/redesign
@/redesign "we need to modernize the entire frontend"
```

## What It Does

1. Maps every backend API endpoint and data model
2. Inventories every frontend component, detects duplicates
3. Extracts all design tokens (colors, spacing, typography)
4. Walks every user flow, marks friction points
5. Scores visual uniformity 1-10 per area
6. Produces layered redesign recommendations
7. Generates phased implementation plan

## Example Output Summary

```markdown
Visual Consistency Score: 4.5/10

Top Issues:
🔴 42 unique colors (should be 16)
🔴 18 spacing values (should be 10)
🟠 8 duplicate component patterns
🟠 No loading states on 12 async components
🟡 Inconsistent typography (4 outliers)

Implementation Plan:
Wave 1: Design Tokens (1-2 days)
Wave 2: Base Components (2-3 days)
Wave 3: Layout (1-2 days)
Wave 4: Pages (2-4 days)
Wave 5: Polish (1-2 days)
```

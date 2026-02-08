# ui-ux-redesign Examples

> Full-stack visual audit — inventories backend APIs, audits every component, extracts design tokens, analyzes user flows, and produces layered redesign recommendations.

## Usage

### Antigravity

```
/redesign
```

### Claude Code

```
@/redesign "the UI feels inconsistent and needs a visual overhaul"
```

## Example Scenario

**Context:** A health dashboard app with 40+ components, built incrementally over 6 months. Multiple developers contributed. The UI "works" but feels disjointed — different button styles per page, inconsistent spacing, 3 different card designs.

### Phase 1: Backend API Inventory

```markdown
| Endpoint | Method | Response Shape | Used By | UI Coverage |
|----------|--------|---------------|---------|-------------|
| /api/metrics | GET | { metrics: Metric[] } | MetricCard, Dashboard | Loading ✅ Error ❌ Empty ❌ |
| /api/user/profile | GET | { user: User } | ProfileCard, Header | Loading ❌ Error ❌ |
| /api/analytics | GET | { data: DataPoint[] } | ChartWidget | Loading ✅ Error ✅ Empty ❌ |
```

### Phase 3: Design Token Extraction

```markdown
Color Audit — 42 unique colors found, should be 16:
| Current | Count | Category | Recommended Token |
|---------|-------|----------|-------------------|
| #6366f1 | 23 | Brand | --color-primary |
| #6467f2 | 4 | Brand (variant) | MERGE → --color-primary |
| #ef4444 | 12 | Error | --color-destructive |
| #10b981 | 8 | Success | --color-success |

Spacing Audit — 18 unique values found, should be 10:
| Current | Count | Recommended |
|---------|-------|-------------|
| 4px | 45 | --space-1 |
| 8px | 89 | --space-2 |
| 13px | 3 | REMOVE → use 12px |
| 15px | 2 | REMOVE → use 16px |
```

### Phase 6: Redesign Recommendations (Layer 2)

```markdown
| Component | Problem | Recommendation | Effort |
|-----------|---------|----------------|--------|
| Button | 5 variants across pages | 3 variants: primary, secondary, ghost × 3 sizes | M |
| Card | Different radius and padding per page | Single Card with variant prop | S |
| Input | 3 different input styles | Single Input with validation states | M |
```

### Visual Consistency Score

```markdown
| Area | Score | Issues |
|------|-------|--------|
| Color | 4/10 | 42 unique colors |
| Spacing | 3/10 | 18 values, no scale |
| Typography | 6/10 | Mostly OK, 4 outliers |
| Components | 5/10 | 8 duplicate patterns |
| Overall | **4.5/10** | Needs redesign |
```

## Output

A full redesign audit report with:
- Backend API inventory (what data exists)
- Component census (what's built, what's duplicated)
- Token audit (colors, spacing, typography — current vs recommended)
- User flow analysis with friction points
- Layered recommendations (tokens → components → layout → pages → polish)
- Phased implementation plan with effort estimates

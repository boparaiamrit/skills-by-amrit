---
name: performance
description: "Profile, analyze, and optimize application performance with structured benchmarking."
disable-model-invocation: true
argument-hint: "[area-to-profile]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
  - Edit
---

# /performance — Performance Analysis & Optimization

Profile application performance, identify bottlenecks, and implement optimizations with before/after benchmarks.

## Instructions

### Step 1: Define Performance Scope

From `$ARGUMENTS`:
- **Build performance** — Compilation, bundling speed
- **Runtime performance** — API response times, rendering speed
- **Database performance** — Query execution, indexing
- **Memory performance** — Leaks, allocation patterns
- **Bundle size** — JavaScript/CSS output size

### Step 2: Baseline Measurement

ALWAYS measure BEFORE optimizing:

```bash
# Build metrics
time npm run build 2>&1

# Bundle analysis (if applicable)
npx next build --profile 2>&1 || npx vite build --report 2>&1

# Bundle size
find dist -name "*.js" -exec wc -c {} + 2>/dev/null | sort -rn | head -10

# Runtime profiling (Node.js)
node --prof [entry-point] 2>/dev/null

# Database queries (if applicable)
# Check for slow queries in logs
```

Record baseline:
```markdown
## Baseline Measurements
| Metric | Value | Target |
|--------|-------|--------|
| Build time | [Xs] | [Xs] |
| Bundle size | [XKB] | [XKB] |
| API response (p50) | [Xms] | [Xms] |
| API response (p99) | [Xms] | [Xms] |
| Memory usage | [XMB] | [XMB] |
```

### Step 3: Identify Bottlenecks

Analyze for common performance issues:

```bash
# Large files (potential bundle bloat)
find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20

# Heavy imports
grep -rn "import.*from" --include="*.ts" --include="*.tsx" . | grep -v node_modules | sort -t: -k3 | head -30

# N+1 query patterns
grep -rn "await.*find\|await.*query\|\.map.*async" --include="*.ts" . | grep -v node_modules | head -20

# Missing indexes (check schema)
grep -rn "where\|WHERE\|findBy\|findOne" --include="*.ts" --include="*.sql" . | grep -v node_modules | head -20

# Synchronous operations in async context
grep -rn "readFileSync\|writeFileSync\|execSync" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10
```

### Step 4: Prioritize & Optimize

Rank bottlenecks by impact. For each:

1. **Measure** — Isolate and quantify the bottleneck
2. **Hypothesize** — What change would improve it?
3. **Implement** — Make the minimal change
4. **Re-measure** — Verify improvement

### Step 5: After-Measurement

Re-run ALL baseline measurements:

```markdown
## Results
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Build time | [Xs] | [Ys] | -[Z]% |
| Bundle size | [XKB] | [YKB] | -[Z]% |
| Response time | [Xms] | [Yms] | -[Z]% |
```

### Step 6: Report

Save to `.planning/research/performance-[area].md`:

```markdown
# Performance Analysis: [Area]

## Summary
[What was optimized and overall improvement]

## Bottlenecks Found
1. [Bottleneck] — [Impact] — [Fix applied]
2. [Bottleneck] — [Impact] — [Fix applied]

## Before/After Comparison
[Table from Step 5]

## Recommendations for Future
- [What to watch for]
- [Preventive measures]
```

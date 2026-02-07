---
description: Profile, analyze, and optimize application performance with before/after benchmarks
---

## Steps

1. Define performance scope from user input:
   - Build performance, runtime, database, memory, or bundle size?

2. Take baseline measurements:
// turbo
```
echo "=== BUILD TIME ==="; time npm run build 2>&1 | tail -5; echo "=== BUNDLE SIZE ==="; find dist -name "*.js" -exec wc -c {} + 2>/dev/null | sort -rn | head -10; echo "=== TEST TIME ==="; time npm test 2>&1 | tail -5
```

3. Record baseline in a table: Metric | Value | Target

4. Identify bottlenecks:
// turbo
```
echo "=== LARGE FILES ==="; find src -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | sort -rn | head -15; echo "=== HEAVY IMPORTS ==="; grep -rn "import.*from" --include="*.ts" --include="*.tsx" . | grep -v node_modules | wc -l; echo "=== SYNC OPS ==="; grep -rn "readFileSync\|writeFileSync\|execSync" --include="*.ts" --include="*.js" . | grep -v node_modules | head -10; echo "=== N+1 PATTERNS ==="; grep -rn "\.map.*async\|for.*await" --include="*.ts" . | grep -v node_modules | head -10
```

5. Rank bottlenecks by impact. For each:
   - Measure the specific bottleneck
   - Hypothesize what change would improve it
   - Implement the minimal change
   - Re-measure to verify improvement

6. Re-run ALL baseline measurements after optimization:
// turbo
```
echo "=== BUILD TIME ==="; time npm run build 2>&1 | tail -5; echo "=== BUNDLE SIZE ==="; find dist -name "*.js" -exec wc -c {} + 2>/dev/null | sort -rn | head -10; echo "=== TEST TIME ==="; time npm test 2>&1 | tail -5
```

7. Create before/after comparison table.

8. Save report to `.planning/research/performance-[area].md` with:
   - Summary, bottlenecks found, before/after comparison, future recommendations.

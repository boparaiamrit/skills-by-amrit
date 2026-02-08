---
description: Run a brutal, exhaustive, multi-pass audit of the entire product — build, routes, data flow, user flows, and edge cases. No shortcuts. Creates an actionable task list.
---

// turbo-all

## Steps

1. Clean build from scratch:
```
echo "=== CLEAN BUILD ==="; rm -rf dist .next build __pycache__ 2>/dev/null; npm run build 2>&1 | tail -20
```

2. Type check (if TypeScript):
```
echo "=== TYPE CHECK ==="; npx tsc --noEmit 2>&1 | tail -30
```

3. Lint check:
```
echo "=== LINT ==="; npm run lint 2>&1 | tail -30
```

4. Dependency check:
```
echo "=== DEPS ==="; npm audit --production 2>&1 | head -20; echo "---"; npm ls --depth=0 2>&1 | grep "ERR\|WARN\|missing\|invalid" | head -10
```

5. Environment check:
```
echo "=== ENV VARS REFERENCED ==="; grep -rn "process\.env\.\|import\.meta\.env\.\|os\.environ\|os\.getenv" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -vi "node_modules\|.git\|dist\|.next" | head -30; echo "=== ENV FILES ==="; find . -name ".env*" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null | head -10
```

6. Record Pass 1 results in a table: Clean Build, Type Check, Lint, Dependencies, Environment — each ✅ or ❌ with specific error counts and details. List EVERY error, not just counts.

7. Enumerate all routes:
```
echo "=== PAGE FILES ==="; find . -type f \( -name "page.tsx" -o -name "page.jsx" -o -name "page.ts" -o -name "page.js" \) -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | sort; echo "=== ROUTE FILES ==="; find . -type f \( -name "*.tsx" -o -name "*.jsx" \) -path "*/pages/*" -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | sort; echo "=== ROUTER CONFIG ==="; grep -rn "path:" --include="*.ts" --include="*.tsx" . | grep -vi "node_modules\|.git\|dist\|.next\|type\|interface" | head -30
```

8. For EACH route found:
   - Read the page component file
   - Check: renders without errors, content is real (not placeholder), responsive, navigation works
   - Record result in the Pass 2 table
   - DO NOT skip any route — check every single one

9. Find all API calls and data sources:
```
echo "=== ALL API CALLS ==="; grep -rn "fetch(\|axios\.\|useSWR\|useQuery\|useMutation\|createClient\|supabase\.\|prisma\." --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next" | head -40; echo "=== ALL HARDCODED DATA ==="; grep -rn "const.*=.*\[\|mock\|placeholder\|lorem\|dummy\|hardcoded\|fake" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock\|import\|export\|type\|interface" | head -30
```

10. For EACH API call found:
    - Trace the data flow: Database/API → Service → Hook → Component → Rendered Output
    - Verify data is fetched (not hardcoded), typed, transformed, error-handled
    - Check loading, error, and empty states
    - Record result in the Pass 3 table
    - DO NOT combine entries — check each one independently

11. Identify and document all user flows:
    - Authentication (signup, login, logout, password reset)
    - Core CRUD operations
    - Secondary features (settings, search, pagination, file upload)
    - For EACH flow: walk through every step, verify each step works, record where it breaks

12. Record Pass 4 results: Flow name, total steps, result (✅/❌/⚠️), failed-at step, root cause

13. Test edge cases:
    - Empty states: what happens with no data?
    - Error states: what happens when API fails?
    - Boundary conditions: max length inputs, special characters, zero values
    - Auth edge cases: expired tokens, protected routes without auth, permission checks
    - Browser edge cases: back button, page refresh, multiple tabs

14. Record Pass 5 results: Category, test, result, issue

15. Compile ALL findings from all 5 passes into a prioritized task list:
    - For EACH issue: task title, severity (🔴/🟠/🟡/🔵), file(s), current behavior, expected behavior, acceptance criteria, estimated effort
    - Sort by severity: 🔴 Critical → 🟠 High → 🟡 Medium → 🔵 Low

16. Generate the Brutal Exhaustive Audit Report:
    - Executive summary (overall health, total issues, breakdown by severity)
    - Pass 1-5 results tables
    - Complete task list
    - Recommended fix order with rationale

17. Present the report to the user with next steps:
    - "Run `/execute` with the task list to fix issues"
    - "Run `/deep-audit` again after fixes to verify"

---
name: deep-audit
description: "Run a brutal, exhaustive, multi-pass audit of the entire product. 5 passes: build, routes, data flow, user flows, edge cases. No shortcuts. Creates actionable task list."
disable-model-invocation: true
argument-hint: "[scope: pass1|pass2|pass3|pass4|pass5|all] (default: all)"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /deep-audit — Brutal Exhaustive Audit

Run a no-shortcuts, multi-pass audit of the entire product. Every file checked. Every route visited. Every flow tested. No exceptions.

## Prerequisites
- A buildable application
- Time — this is thorough, not quick

## Critical Rules

```
YOU CANNOT:
- Say "similar to above" — check each item independently
- Say "the rest are fine" — verify each one
- Skip a file because "it wasn't changed" — verify it anyway
- Trust previous verification — run it fresh
- Combine passes — each pass has a different focus
- Claim a pass is complete without a results table
- Estimate — measure and verify
```

## Instructions

### Step 1: Determine Scope

From `$ARGUMENTS`:
- `pass1` → Only Build & Static Analysis
- `pass2` → Only Route & Page Verification
- `pass3` → Only Data Flow Tracing
- `pass4` → Only User Flow Testing
- `pass5` → Only Edge Case Validation
- `all` or empty → Run ALL 5 passes (recommended)

### Step 2: Pass 1 — Build & Static Analysis

```bash
# Clean build
rm -rf dist .next build __pycache__ 2>/dev/null
npm run build 2>&1

# Type check
npx tsc --noEmit 2>&1

# Lint
npm run lint 2>&1

# Deps
npm audit --production 2>&1 | head -20

# Env vars
grep -rn "process\.env\.\|import\.meta\.env\." --include="*.ts" --include="*.tsx" --include="*.js" . | grep -vi "node_modules\|.git\|dist\|.next" | head -30
```

Record results table: Clean Build, Type Check, Lint, Dependencies, Environment.
List EVERY error, not just counts.

### Step 3: Pass 2 — Route & Page Verification

1. Enumerate ALL routes (from router config or file-system routing)
2. For EACH route, read the page component and verify:
   - Renders without errors
   - Content is real (not placeholder/hardcoded)
   - Responsive (mobile, tablet, desktop)
   - Navigation works

Record results table: Route, Loads, Content, Responsive, Navigation, Issues.
EVERY route gets its own row. No "see above."

### Step 4: Pass 3 — Data Flow Tracing

1. Find all API calls and data sources
2. For EACH one, trace: API → Service → Hook → Component → Output
3. Verify: data is fetched, typed, transformed, error-handled
4. Check: loading states, error states, empty states

Record results table: Data Source, Fetched, Typed, Transformed, Error Handled, Loading, Empty, Issues.

### Step 5: Pass 4 — User Flow Testing

1. Identify all user flows
2. For EACH flow, walk through every step:
   - Verify correct page/data at each step
   - Verify UI feedback (loading, success, error)
   - Complete the flow

Record results table: Flow, Steps, Result, Failed At, Root Cause.

### Step 6: Pass 5 — Edge Case Validation

1. Empty states (no data, no results, new user)
2. Error states (API down, network slow, expired token)
3. Boundary conditions (max input, special chars, zero values)
4. Auth edge cases (protected routes, expired tokens, permissions)
5. Browser edge cases (back button, refresh, multiple tabs)

Record results table: Category, Test, Result, Issue.

### Step 7: Generate Task List

For EACH issue found across ALL passes:
- Task title
- Severity (🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low)
- File(s) affected
- Current behavior
- Expected behavior
- Acceptance criteria
- Estimated effort (S/M/L)

Sort by severity.

### Step 8: Generate Report

Create `DEEP-AUDIT-REPORT.md`:

```markdown
# Deep Audit Report

## Executive Summary
- Overall Health: [CRITICAL / NEEDS WORK / MOSTLY HEALTHY / SOLID]
- Total Issues: [N]
- Breakdown: 🔴 [N] | 🟠 [N] | 🟡 [N] | 🔵 [N]

## Pass 1: Build & Static Analysis
[Results table]

## Pass 2: Route & Page Verification
[Results table — EVERY route]

## Pass 3: Data Flow Tracing
[Results table — EVERY data source]

## Pass 4: User Flow Testing
[Results table — EVERY flow]

## Pass 5: Edge Case Validation
[Results table — EVERY edge case]

## Task List (Priority Order)
[ALL tasks sorted by severity]

## Recommended Fix Order
[What to fix first and why]
```

### Step 9: Present and Next Steps

- If issues found: "Run `/execute` with the task list to fix issues, then `/deep-audit` again to verify"
- If all green: "Product is solid. Run `/commit` to save."

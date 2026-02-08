---
name: brutal-exhaustive-audit
description: "Use when you need an absolutely thorough, no-shortcuts, multi-pass audit of the entire product. Covers build verification, route checking, data flow tracing, user flow testing, and edge case validation. Forces file-by-file verification with explicit tracking. Creates an actionable task list. Cannot cut corners."
---

# Brutal Exhaustive Audit

## Overview

This is the "be exhaustive, be brutal, check everything" skill codified into an enforceable process. AI's context window makes it forget things, skip files, and declare victory early. This skill prevents all of that through **mandatory multi-pass verification with explicit checklists**.

**Core principle:** Every file checked. Every route visited. Every flow walked. No exceptions, no shortcuts, no "it's probably fine."

## The Iron Law

```
NO FILE UNCHECKED. NO ROUTE UNVISITED. NO FLOW UNTESTED. NO CLAIM WITHOUT EVIDENCE.
IF YOU HAVEN'T EXPLICITLY VERIFIED IT, IT IS BROKEN UNTIL PROVEN OTHERWISE.
```

## When to Use

- When you say "be exhaustive" or "be brutal" or "check everything"
- When you don't trust the AI did a complete job
- When previous fixes introduced new problems
- After a large-scale refactoring or migration
- After API integration to verify nothing was missed
- Before a release or demo
- When the product "should work" but something feels wrong

## When NOT to Use

- For a quick single-file fix (use `fix-issue`)
- For understanding a new codebase (use `codebase-mapping`)

## The Five Passes

```
THIS AUDIT HAS FIVE MANDATORY PASSES.
EACH PASS PRODUCES A CHECKLIST.
EVERY ITEM ON EVERY CHECKLIST MUST BE EXPLICITLY VERIFIED.
SKIPPING A PASS IS NOT AN OPTION.
```

### Pass 1: Build & Static Analysis (THE FOUNDATION)

```
IF IT DOESN'T BUILD, NOTHING ELSE MATTERS.

1. CLEAN BUILD:
   □ Delete all build artifacts (dist, .next, build, __pycache__)
   □ Delete node_modules and reinstall (npm ci or pip install -r requirements.txt)
   □ Run the build from scratch
   □ Record: Exit code, warnings, errors
   □ EVERY warning matters — list them all

2. TYPE CHECK (if applicable):
   □ Run TypeScript compiler with --noEmit (or mypy/pyright)
   □ Record: EVERY type error, not just the count
   □ Categorize: Critical (broken logic) vs Minor (missing annotation)

3. LINT CHECK:
   □ Run the full linter
   □ Record: EVERY lint error
   □ Flag: Any rules that are disabled or overridden (eslint-disable, noqa, etc.)

4. DEPENDENCY CHECK:
   □ Are there unused dependencies?
   □ Are there missing dependencies?
   □ Are there security vulnerabilities? (npm audit, pip-audit)
   □ Are there peer dependency conflicts?

5. ENVIRONMENT CHECK:
   □ Are all required environment variables documented?
   □ Are all required environment variables set (or have defaults)?
   □ Are there environment-specific configurations that could break?

PASS 1 RESULT:
| Check | Status | Issues |
|-------|--------|--------|
| Clean Build | ✅/❌ | [details] |
| Type Check | ✅/❌ | [N errors listed] |
| Lint | ✅/❌ | [N errors listed] |
| Dependencies | ✅/❌ | [details] |
| Environment | ✅/❌ | [details] |
```

### Pass 2: Route & Page Verification (EVERY ROUTE, NO EXCEPTIONS)

```
1. ENUMERATE all routes:
   □ Extract from router config / file-system routing
   □ Include dynamic routes
   □ Include auth-protected routes
   □ Include error/404 routes
   □ Include any redirect routes

2. For EACH route, physically verify:
   □ Page loads without errors (console check)
   □ Page renders content (not blank/white screen)
   □ Content is real data, not placeholder
   □ Page is responsive at 3 breakpoints (mobile 375px, tablet 768px, desktop 1440px)
   □ Navigation elements work (links, buttons)
   □ Back button works correctly

3. CROSS-CHECK:
   □ Every route in the router config has a corresponding page component
   □ Every page component is imported and used
   □ No orphan pages (pages that exist but aren't routed to)
   □ No broken redirects

PASS 2 RESULT:
| # | Route | Loads | Content | Responsive | Navigation | Issues |
|---|-------|-------|---------|------------|------------|--------|
| 1 | / | ✅ | ✅ | ✅ | ✅ | None |
| 2 | /dashboard | ✅ | ⚠️ | ❌ | ✅ | Placeholder stats, breaks on mobile |
```

### Pass 3: Data Flow Tracing (FOLLOW EVERY BYTE)

```
FOR EACH API ENDPOINT OR DATA SOURCE:

1. TRACE the data flow:
   Database/API → Server/Service → Hook/Store → Component → Rendered Output

2. At EACH step, verify:
   □ Data is fetched (not hardcoded)
   □ Data shape is correct (matches types)
   □ Data is transformed correctly (dates, numbers, strings)
   □ Errors are caught and handled
   □ Loading states exist
   □ Empty states exist

3. CHECK for data integrity:
   □ Create something → Does it appear in the list?
   □ Update something → Does the update reflect immediately?
   □ Delete something → Does it disappear?
   □ Refresh the page → Does data persist?
   □ Navigate away and back → Does data persist?

4. CHECK for stale data:
   □ Is caching working correctly?
   □ Are mutations invalidating the cache?
   □ Is real-time data (if any) updating?

PASS 3 RESULT:
| Data Source | Fetched | Typed | Transformed | Error Handled | Loading | Empty | Issues |
|------------|---------|-------|-------------|---------------|---------|-------|--------|
| GET /users | ✅ | ✅ | ⚠️ | ❌ | ✅ | ❌ | Dates not formatted, no error UI, no empty state |
```

### Pass 4: User Flow Testing (EVERY JOURNEY, END TO END)

```
IDENTIFY all user flows. Then TEST each one.

CRITICAL FLOWS (test first):
□ Authentication (signup, login, logout, password reset)
□ Core CRUD operations (create, read, update, delete)
□ Primary user journey (the main thing the app does)

SECONDARY FLOWS (test second):
□ Settings/profile management
□ Search/filter functionality
□ Pagination/infinite scroll
□ File upload/download
□ Notifications
□ Multi-step forms/wizards

For EACH flow:
1. Start at the beginning
2. Execute each step
3. At each step, verify:
   □ Correct page/component is shown
   □ Correct data is displayed
   □ UI provides feedback (loading, success, error)
   □ Next step is accessible
4. Complete the flow
5. Verify the end state

DOCUMENT:
| Flow | Steps | Result | Failed At | Root Cause | Fix |
|------|-------|--------|----------|-----------|-----|
| Login | 3 | ✅ | — | — | — |
| Create Item | 5 | ❌ | Step 4 | Form submits but API returns 422, no error shown | Add form validation |
```

### Pass 5: Edge Case & Error Validation (THE FINAL BRUTAL PASS)

```
THIS PASS IS WHY THIS AUDIT IS "BRUTAL."
Most products break here because nobody tests edge cases.

1. EMPTY STATES:
   □ What happens when there's no data? (new user, empty list, no results)
   □ What happens when search returns nothing?
   □ What happens when filters exclude everything?

2. ERROR STATES:
   □ What happens when the API is down?
   □ What happens when the network is slow?
   □ What happens when the auth token expires mid-session?
   □ What happens when you submit invalid data?
   □ What happens when you submit duplicate data?
   □ What happens with concurrent edits?

3. BOUNDARY CONDITIONS:
   □ Maximum length inputs (name with 10000 characters)
   □ Special characters in inputs (< > " ' & / \ null bytes)
   □ Empty string vs null vs undefined
   □ Zero values vs missing values
   □ Extremely large datasets (1000+ items)
   □ Extremely long text content

4. PERMISSION / AUTH EDGE CASES:
   □ Access protected route without auth → redirect to login?
   □ Access protected route with expired token → refresh? redirect?
   □ Access resource you don't own → 403 handling?
   □ Multiple tabs → session consistency?

5. BROWSER EDGE CASES:
   □ Browser back button behavior
   □ Page refresh during form submission
   □ Opening same page in multiple tabs
   □ Copy/paste into form fields
   □ Browser autofill

PASS 5 RESULT:
| Category | Test | Result | Issue |
|----------|------|--------|-------|
| Empty State | Empty user list | ❌ | Shows "undefined" instead of empty message |
| Error State | API timeout | ❌ | Infinite spinner, no timeout handling |
| Boundary | Long name (1000 chars) | ⚠️ | Overflows container |
```

## Task Generation (THE DELIVERABLE)

```
AFTER ALL 5 PASSES, compile findings into ACTIONABLE TASKS:

For EACH issue found, create a task:

### Task [N]: [Title]
- **Pass:** [which pass found it]
- **Severity:** 🔴/🟠/🟡/🔵
- **File(s):** [exact file path(s)]
- **Current Behavior:** [what happens now]
- **Expected Behavior:** [what should happen]
- **Acceptance Criteria:** [how to verify the fix]
- **Estimated Effort:** S/M/L

SORT tasks by:
1. 🔴 Critical first (product broken)
2. 🟠 High second (major feature gaps)
3. 🟡 Medium third (poor UX)
4. 🔵 Low last (polish)
```

## Output Format

```markdown
# Brutal Exhaustive Audit: [Project Name]
**Date:** [timestamp]
**Auditor:** AI Agent

## Executive Summary
- **Overall Health:** [CRITICAL / NEEDS WORK / MOSTLY HEALTHY / SOLID]
- **Total Issues:** [N]
- **Breakdown:** 🔴 [N] | 🟠 [N] | 🟡 [N] | 🔵 [N]

## Pass 1: Build & Static Analysis
[Results table]

## Pass 2: Route & Page Verification
[Results table]

## Pass 3: Data Flow Tracing
[Results table]

## Pass 4: User Flow Testing
[Results table]

## Pass 5: Edge Case & Error Validation
[Results table]

## Task List (Priority Order)
[All tasks sorted by severity]

## Recommended Fix Order
[Ordered list of what to fix first and why]

## Verification
After all tasks are fixed, run this audit again.
Every pass should show all-green results.
```

## Red Flags — STOP

- Skipping a pass because "it's probably fine"
- Checking only a few files instead of ALL files
- Not recording results for every item in the checklist
- Declaring "Pass N complete" without checking every item
- Saying "the rest is probably similar" after checking 3 out of 20 routes
- Treating warnings as "not important"
- Not creating tasks for every issue found
- Claiming the audit is done without completing all 5 passes

## Anti-Shortcut Rules

```
THESE RULES EXIST BECAUSE AI WILL TRY TO CUT CORNERS:

1. You CANNOT say "similar to above" — check each item independently
2. You CANNOT say "the rest are fine" — verify each one
3. You CANNOT skip a file because "it wasn't changed" — verify it anyway
4. You CANNOT trust previous verification — run it fresh
5. You CANNOT combine passes — each pass has a different focus
6. You CANNOT claim a pass is complete without a results table
7. You CANNOT estimate — measure and verify
8. You MUST create a task for EVERY issue, no matter how small
9. You MUST re-run verification after fixes
10. You MUST present ALL findings, not a summary
```

## Integration

- **Before:** `codebase-mapping` for initial understanding
- **Pairs with:** `product-completeness-audit` for functional gaps
- **Pairs with:** `full-stack-api-integration` for API issues
- **After:** `writing-plans` → `executing-plans` to fix found issues
- **Final:** `verification-before-completion` to confirm fixes

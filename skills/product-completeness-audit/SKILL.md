---
name: product-completeness-audit
description: "Use when a product looks 'done' but flows are broken, pages are placeholders, data is hardcoded, or the frontend and backend are not fully connected. Audits every route, every flow, every component for functional completeness vs visual completeness."
---

# Product Completeness Audit

## Overview

A beautiful UI with hardcoded data is a demo, not a product. This skill systematically verifies that every page, every flow, and every component is **functionally complete** — not just visually complete.

**Core principle:** If a user cannot complete the intended journey from start to finish with real data, the product is NOT done. Period.

## The Iron Law

```
NO PAGE IS COMPLETE UNTIL IT RENDERS REAL DATA, HANDLES ALL STATES, AND CONNECTS TO A WORKING BACKEND. VISUAL COMPLETENESS ≠ FUNCTIONAL COMPLETENESS.
```

## When to Use

- After AI has "built" a product and you suspect placeholder pages
- When the frontend looks good but flows feel broken
- When you've integrated APIs but aren't sure everything is connected
- Before presenting a product to stakeholders
- When "it builds" but you don't trust it actually works
- After a major feature addition to verify nothing was broken

## When NOT to Use

- For visual design review (use `frontend-audit`)
- For API design quality (use `api-design-audit`)
- For security concerns (use `security-audit`)

## The Product Completeness Spectrum

```
IDENTIFY where the product sits on this spectrum:

Level 0: SKELETON    → Routes exist, pages are blank or show errors
Level 1: WIREFRAME   → Pages render but with placeholder text/images
Level 2: DEMO        → Stats/data present but hardcoded (same values on every load)
Level 3: CONNECTED   → API calls exist but may fail silently or show partial data
Level 4: FUNCTIONAL  → All data flows work but edge cases break
Level 5: COMPLETE    → Every flow works, errors are handled, edge cases covered

MOST AI-BUILT PRODUCTS ARE AT LEVEL 1-2. YOUR JOB IS TO GET THEM TO LEVEL 5.
```

## The Process

### Phase 1: Route Inventory (MAP EVERYTHING)

```
1. EXTRACT every route from the application:
   - Check router configuration (next.js pages/app, react-router, vue-router, etc.)
   - Check for dynamic routes ([id], :id, etc.)
   - Check for protected routes (auth required)
   - Check for nested routes

2. CREATE the Route Inventory:

   | # | Route | Page Component | Auth Required | Status |
   |---|-------|---------------|---------------|--------|
   | 1 | / | HomePage | No | 🔍 Not checked |
   | 2 | /login | LoginPage | No | 🔍 Not checked |
   | 3 | /dashboard | DashboardPage | Yes | 🔍 Not checked |
   | 4 | /users/:id | UserDetailPage | Yes | 🔍 Not checked |

3. DO NOT MISS:
   - 404 page
   - Error pages
   - Loading pages
   - Auth callback pages
   - Settings/profile pages
   - Modal routes (if using)
```

### Phase 2: User Flow Mapping

```
1. IDENTIFY every user flow in the application:

   Flow 1: Authentication
   → Landing → Login → Dashboard
   → Landing → Signup → Verify Email → Dashboard
   → Dashboard → Logout → Landing

   Flow 2: Core Feature (e.g., CRUD)
   → List page → Create form → Submit → Success → List updated
   → List page → Click item → Detail page → Edit → Submit → Updated
   → List page → Click item → Delete → Confirm → List updated

   Flow 3: Settings
   → Dashboard → Settings → Change password → Save → Confirmation
   → Dashboard → Settings → Update profile → Save → Confirmation

2. For EACH flow, document:
   - Starting point
   - Each step in the journey
   - Expected data at each step
   - Expected UI feedback at each step
   - End state

3. IDENTIFY broken flows:
   - Dead ends (pages that don't link anywhere)
   - Circular flows (pages that redirect back to themselves)
   - Missing steps (form submits but no success/error feedback)
```

### Phase 3: Page-by-Page Deep Audit

```
For EVERY page in the Route Inventory, answer EVERY question:

RENDERING:
□ Does the page render without console errors?
□ Does the page render without visual glitches?
□ Is the layout responsive (mobile, tablet, desktop)?

DATA:
□ Is the data REAL or hardcoded/placeholder?
   - Search for: hardcoded arrays, "lorem ipsum", "John Doe", "test@example.com"
   - Check: does the data change on refresh? If not, it's probably hardcoded
□ Are API calls being made? (check network tab)
□ Is the API response being used by the component?
□ Is the data transformed correctly (dates formatted, numbers formatted, etc.)?

STATES:
□ LOADING: What happens before data arrives? (spinner, skeleton, blank?)
□ ERROR: What happens when the API fails? (error message, retry, blank?)
□ EMPTY: What happens when there's no data? (empty state message, CTA, blank?)
□ SUCCESS: What happens after a successful action? (feedback, redirect, nothing?)

INTERACTIVITY:
□ Do all buttons have click handlers?
□ Do all links navigate to the correct destination?
□ Do all forms validate input?
□ Do all forms submit data to the API?
□ Do all forms show validation errors?
□ Do all forms preserve input on error?
□ Do all modals/dialogs open and close?
□ Do all dropdowns/selects work?
□ Do all search/filter features work?

PERSISTENCE:
□ Does data persist after page reload?
□ Does data persist after navigation and return?
□ Does form data survive browser back button?
□ Does the page respect URL state (filters in query params)?

RECORD the result:

| Page | Rendering | Data | States | Interactivity | Persistence | Level |
|------|-----------|------|--------|---------------|-------------|-------|
| /dashboard | ✅ | ⚠️ Hardcoded | ❌ No loading | ✅ | ❌ | Level 2 |
```

### Phase 4: Backend Connection Verification

```
For EVERY API call in the frontend:

1. TRACE the call chain:
   Component → Hook/Service → API Client → HTTP Request → Backend Endpoint

2. VERIFY each link:
   □ Component calls the hook/service (not a mock)
   □ Hook/service calls the API client (not a mock function)
   □ API client makes a real HTTP request (not returning hardcoded data)
   □ The backend endpoint exists and responds
   □ The response shape matches what the frontend expects
   □ Auth tokens are sent correctly
   □ Error responses are handled, not swallowed

3. CHECK for mock leakage:
   - Are mock service workers (MSW) running in production?
   - Are there if/else blocks that use mock data in production?
   - Are environment variables correctly set for API URLs?
   - Are there commented-out API calls with hardcoded data used instead?

4. DOCUMENT disconnections:

   | Component | Expected API | Actual State | Issue |
   |-----------|-------------|-------------|-------|
   | UserList | GET /users | Hardcoded array | No API call made |
   | LoginForm | POST /auth/login | Returns mock token | Not hitting real endpoint |
```

### Phase 5: End-to-End Flow Testing

```
For EVERY user flow identified in Phase 2:

1. START at the beginning of the flow
2. EXECUTE each step
3. At each step, verify:
   □ The correct page is shown
   □ The correct data is displayed
   □ The UI provides appropriate feedback
   □ The next step is accessible (button, link, redirect)
4. COMPLETE the flow to the end
5. VERIFY the end state is correct

DOCUMENT results:

| Flow | Steps | Completed? | Broke At | Issue |
|------|-------|-----------|---------|-------|
| Auth: Login | 3 | ✅ | — | — |
| Auth: Signup | 5 | ❌ | Step 3 | Email verification not implemented |
| CRUD: Create | 4 | ⚠️ | Step 4 | No success feedback |
```

### Phase 6: Gap Report and Task Generation

```
1. COMPILE all findings into a prioritized gap list:

   🔴 CRITICAL (product is broken):
   - Pages that error on load
   - Flows that cannot be completed
   - Auth that doesn't work
   - Data that doesn't persist

   🟠 HIGH (product is a demo, not real):
   - Pages with hardcoded/placeholder data
   - API calls that hit mock endpoints
   - Forms that don't submit to backend
   - Missing error handling

   🟡 MEDIUM (product works but poorly):
   - Missing loading states
   - Missing empty states
   - Missing error states
   - Poor responsive design

   🔵 LOW (polish items):
   - Missing success feedback
   - Missing animations/transitions
   - Missing accessibility features

2. For EACH gap, create a SPECIFIC, ACTIONABLE task:

   ### Task: Connect UserList to GET /users API
   - **File:** src/pages/users.tsx
   - **Current:** Renders hardcoded array of 3 users
   - **Required:** Call GET /users API, render response, add loading/error/empty states
   - **Acceptance:** Page shows real users from API, loading skeleton appears first
   - **Priority:** 🔴 Critical
```

## Output Format

```markdown
# Product Completeness Audit: [Project Name]

## Executive Summary
- **Completeness Level:** [0-5 with description]
- **Routes Audited:** [N/N total]
- **Flows Tested:** [N/N total]
- **Gaps Found:** 🔴 X Critical, 🟠 X High, 🟡 X Medium, 🔵 X Low

## Route Inventory
[Table from Phase 1 with final status]

## User Flow Results
[Table from Phase 5]

## Page Audit Details
[Detailed per-page results from Phase 3]

## Backend Connection Status
[Table from Phase 4]

## Gap List (Priority Ordered)
### 🔴 Critical Gaps
[Specific tasks with file paths and acceptance criteria]

### 🟠 High Gaps
[...]

### 🟡 Medium Gaps
[...]

### 🔵 Low Gaps
[...]

## Recommended Fix Order
1. [Fix critical auth flow — blocks all authenticated pages]
2. [Connect API for main feature — highest user impact]
3. [Add error handling — prevents white screens]
4. [Add loading states — improves perceived performance]

## Verdict
[PRODUCTION READY / DEMO ONLY / CRITICAL FIXES NEEDED]
```

## Red Flags — STOP

- Checking only the happy path
- Trusting the component renders "correctly" without checking the data source
- Skipping pages because "they look fine"
- Not testing error states ("the API probably handles errors")
- Not testing empty states ("there will always be data")
- Accepting "it builds without errors" as proof of completeness
- Not tracing the full call chain from component to backend

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "The page renders, so it works" | Rendering with hardcoded data is not working |
| "The API is called" | Is the RESPONSE used? Is the REAL endpoint hit? |
| "Tests pass" | Tests with mocks prove the mock works, not the product |
| "It's just a minor issue" | A broken flow is never minor |
| "We'll add error handling later" | Users will see broken pages now |
| "The loading state isn't that important" | Users see a blank screen and think it's broken |
| "Only the main flow matters" | Secondary flows are why products fail |
| "The backend works, so the frontend must" | Two working halves ≠ one working whole |

## Integration

- **Before:** `codebase-mapping` to understand the app structure
- **Pairs with:** `full-stack-api-integration` for fixing API gaps
- **After:** `brutal-exhaustive-audit` for file-level verification
- **Fixing gaps:** `writing-plans` → `executing-plans` for implementation
- **Final check:** `verification-before-completion` before claiming done

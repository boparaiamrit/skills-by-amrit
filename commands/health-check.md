---
name: health-check
description: "Audit the product for functional completeness — find placeholder pages, broken flows, disconnected APIs, and missing states. Distinguish between 'looks done' and 'is done'."
disable-model-invocation: true
argument-hint: "[scope: full|routes|flows|api|all] (default: all)"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /health-check — Product Completeness Audit

Audit the entire product for functional completeness. Find every placeholder page, broken flow, disconnected API, and missing state.

## Prerequisites
- A running or buildable application
- Expectation of what "done" looks like

## Instructions

### Step 1: Determine Scope

From `$ARGUMENTS`:
- `routes` → Only audit route/page completeness
- `flows` → Only audit user flow completeness
- `api` → Only audit API connection completeness
- `full` or `all` or empty → Run the full audit (all three)

### Step 2: Route Inventory

Extract every route and page:

```bash
# Find all page files
find . -type f \( -name "page.tsx" -o -name "page.jsx" \) -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null
# Find pages directory
find . -type f -path "*/pages/*" \( -name "*.tsx" -o -name "*.jsx" \) -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null
# Find router config
grep -rn "path:\|Route\|route" --include="*.ts" --include="*.tsx" . | grep -vi "node_modules\|.git\|dist" | head -30
```

Create Route Inventory:
| # | Route | Component | Auth | Status (Level 0-5) |

### Step 3: Placeholder Detection

```bash
# Hardcoded data
grep -rn "lorem\|ipsum\|placeholder\|fake\|dummy\|John Doe\|jane@\|test@example\|sample\|hardcoded\|TODO\|FIXME" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock" | head -40
# Inline arrays (possible hardcoded data)
grep -rn "const.*=.*\[{" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|type\|interface" | head -30
```

### Step 4: Page-by-Page Audit

For EACH route (no exceptions), determine:
- **Completeness Level** (0=Skeleton, 1=Wireframe, 2=Demo, 3=Connected, 4=Functional, 5=Complete)
- **Data Source** — Real API or hardcoded?
- **Loading State** — Exists?
- **Error State** — Exists?
- **Empty State** — Exists?
- **Interactivity** — All buttons/forms work?

### Step 5: User Flow Testing

Identify and test EVERY user flow:
1. Authentication (signup → verify → login → dashboard → logout)
2. Core CRUD (list → create → detail → edit → delete)
3. Secondary (settings, search, pagination, file upload)

For each: attempt every step, record where it breaks.

### Step 6: API Connection Audit

For each API call in the frontend:
1. Trace: Component → Hook/Service → API Client → HTTP Request
2. Verify: real endpoint hit, response used, errors handled
3. Check for mock service workers running in production mode

### Step 7: Generate Report

Create `HEALTH-CHECK-REPORT.md`:

```markdown
# Product Health Check

## Overall Level: [0-5 with name]
## Routes: [N/N at Level 5]
## Flows: [N/N complete]
## API Connections: [N/N verified]

## Route Audit
[Per-route level assessment]

## Flow Results
[Per-flow step-by-step results]

## API Connection Status
[Per-endpoint verification]

## Gap List (Priority Order)
### 🔴 Critical
### 🟠 High
### 🟡 Medium
### 🔵 Low

## Recommended Fix Order
[What to fix first and why]
```

### Step 8: Create Fix Tasks

For each gap, create a specific task:
- Title, severity, file(s), current behavior, expected behavior, acceptance criteria

Suggest: "Run `/execute` with these tasks to fix the gaps"

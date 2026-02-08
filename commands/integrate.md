---
name: integrate
description: "Integrate an API from a product manager's spec into the frontend with full surface mapping, modular SOLID-compliant API layer, and integration testing."
disable-model-invocation: true
argument-hint: "[api-spec-url or 'from clipboard' or endpoint description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /integrate — Full-Stack API Integration

Integrate an API from a product manager's spec/doc into the existing frontend. Prevents partial integration, broken pages, and placeholder-driven development.

## Prerequisites
- API spec, documentation, Postman collection, or endpoint description
- Existing frontend codebase to integrate into

## Instructions

### Step 1: Understand the API Spec

From `$ARGUMENTS`:
- If a URL: Fetch and parse the API documentation
- If "from clipboard": Ask the user to paste the spec
- If a description: Parse the endpoint details

**ASK the Iron Questions (BLOCKING if unanswered):**
1. Base URL?
2. Auth method? (JWT, API key, session)
3. Response envelope format?
4. All endpoints with request/response shapes?
5. Error codes and their meanings?
6. Rate limits?
7. Pagination style?

### Step 2: Map the Integration Surface

Search the ENTIRE codebase for every file that:
- Makes HTTP calls
- Uses mock/placeholder data
- Has TODO/FIXME about API integration
- Imports mock data files

```bash
grep -rn "fetch\|axios\|useSWR\|useQuery\|mock\|placeholder\|lorem\|fake\|dummy\|TODO.*api" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec" | head -50
```

Create a Surface Map table:
| File | Current State | API Endpoint(s) | What Needs to Change |

### Step 3: Design the API Layer (SOLID)

Design and present to the user:
- API client module (auth, errors, retry)
- Service modules per domain entity
- Type definitions for all shapes
- Hook/composable layer

### Step 4: Implement Endpoint by Endpoint

For EACH endpoint:
1. Types → API client → Service → Hook → Component updates → Integration test
2. Update EVERY file in the surface map for this endpoint
3. Verify build passes after each endpoint

### Step 5: Verify No Mock Data Remains

```bash
grep -rn "mock\|placeholder\|lorem\|fake\|dummy\|hardcoded" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock"
```

### Step 6: Full Verification

1. Run the full test suite
2. Run the build
3. Visit every route and verify real data
4. Check all loading/error/empty states

### Step 7: Generate Integration Report

Create `API-INTEGRATION-REPORT.md`:
- API spec summary
- Surface map (before → after)
- Integration test results
- Remaining issues (if any)
- Verification checklist

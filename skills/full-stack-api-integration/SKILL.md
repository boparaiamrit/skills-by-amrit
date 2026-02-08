---
name: full-stack-api-integration
description: "Use when integrating APIs from a product manager, designer, or spec document into an existing frontend. Covers full-surface mapping, modular API layer creation, systematic replacement of mocks/placeholders, and integration testing. Prevents partial integration, broken pages, and placeholder-driven development."
---

# Full-Stack API Integration

## Overview

Integrating an API is not a file-by-file task — it is a **codebase-wide transformation**. Every endpoint touches multiple files: types, services, components, pages, tests, error handling. Missing even one consumer leaves the product broken.

**Core principle:** Map the ENTIRE integration surface before writing a single line of code. One missed file = one broken page.

## The Iron Law

```
NO API INTEGRATION WITHOUT A COMPLETE SURFACE MAP OF EVERY FILE THAT CONSUMES, DISPLAYS, OR TRANSFORMS THE DATA.
```

## When to Use

- Receiving API docs/specs/Postman collections from a product manager
- Replacing mock data with real API calls
- Migrating from one API to another
- Adding new API endpoints to an existing frontend
- When previous API integration attempt left broken or inconsistent state

## When NOT to Use

- Designing the API itself (use `api-design-audit`)
- Building a brand new app from scratch (use `writing-plans` + `executing-plans`)
- Fixing a single API call bug (use `systematic-debugging`)

## The Iron Questions (ASK BEFORE STARTING)

```
STOP. Before writing code, answer these questions. If you cannot answer ALL of them,
ASK the user. DO NOT ASSUME.

1. What is the base URL of the API?
2. What authentication method does it use? (JWT, API key, session, OAuth)
3. Where does the auth token come from? (login flow, env var, external service)
4. What is the response envelope format? (e.g., { data: ..., error: ... })
5. What are ALL the endpoints? (list every single one)
6. For each endpoint: method, path, request body shape, response body shape
7. What error codes does the API return? How should each be handled?
8. Are there rate limits?
9. Is there pagination? What style? (cursor, offset, page-based)
10. Are there any endpoints that require specific headers beyond auth?
```

If the user cannot answer these questions, flag them as BLOCKING issues.

## The Process

### Phase 1: API Spec Analysis (DO NOT SKIP)

```
1. READ the entire API spec/documentation/Postman collection
2. CREATE a typed inventory of every endpoint:

   | # | Method | Endpoint | Request Body | Response Shape | Auth | Pagination |
   |---|--------|----------|-------------|----------------|------|------------|
   | 1 | GET    | /users   | —           | User[]         | JWT  | cursor     |
   | 2 | POST   | /users   | CreateUser  | User           | JWT  | —          |

3. DEFINE TypeScript/Python types for EVERY request and response shape
4. IDENTIFY shared types (e.g., User appears in multiple endpoints)
5. DOCUMENT error response shapes
6. NOTE any inconsistencies or ambiguities — ASK the user about these
```

### Phase 2: Frontend Surface Mapping (THE CRITICAL STEP)

```
THIS IS THE STEP THAT PREVENTS PARTIAL INTEGRATION.

1. SEARCH the entire codebase for every file that:
   a. Makes HTTP calls (fetch, axios, useSWR, useQuery, $fetch, ky, got, etc.)
   b. Contains mock data or placeholder data (hardcoded arrays, fake users, lorem ipsum)
   c. Has TODO/FIXME comments about API integration
   d. Imports from mock data files or fixture files
   e. Uses environment variables for API URLs
   f. Has loading/error/empty state handling (or is MISSING them)

2. CREATE the Surface Map:

   | File | Current State | API Endpoint(s) Used | What Needs to Change |
   |------|--------------|---------------------|---------------------|
   | src/pages/users.tsx | Hardcoded mock array | GET /users | Replace mock with API call, add loading/error states |
   | src/services/api.ts | Partial, only 2 endpoints | ALL | Complete with all endpoints |
   | src/types/user.ts | Missing pagination types | GET /users | Add PaginatedResponse<User> |
   | src/components/user-list.tsx | No error handling | GET /users | Add error boundary, retry |

3. VERIFY the surface map is COMPLETE:
   - Search for EVERY import of mock/placeholder files
   - Search for EVERY hardcoded data array
   - Search for EVERY fetch/axios/HTTP call
   - Cross-reference: every endpoint in the spec must appear in at least one file
   - Cross-reference: every file using mock data must appear in the surface map

4. PRESENT the surface map to the user for validation before proceeding
```

### Phase 3: API Layer Architecture (SOLID Principles)

```
Design the API layer BEFORE implementing. Follow SOLID:

1. SINGLE RESPONSIBILITY:
   - One API client class/module (handles HTTP, auth, errors)
   - One service per domain entity (UserService, OrderService)
   - One type file per domain entity
   - Components NEVER make direct HTTP calls

2. OPEN/CLOSED:
   - API client accepts interceptors/middleware for extensibility
   - Services return typed results, don't dictate UI behavior
   - Error handling is centralized and extensible

3. DEPENDENCY INVERSION:
   - Components depend on service interfaces, not implementations
   - Services depend on API client interface, not specific HTTP library
   - Easy to swap real API for test doubles

ARCHITECTURAL STRUCTURE:

   types/          → TypeScript types for all API shapes
   lib/api-client  → HTTP client with auth, error handling, retry
   lib/services/   → Service modules per domain (user-service, order-service)
   hooks/          → React hooks or composables wrapping services
   components/     → UI components consuming hooks (NEVER direct API calls)
```

### Phase 4: Systematic Implementation (ONE ENDPOINT AT A TIME)

```
For EACH endpoint in the API spec:

1. CREATE/UPDATE the type definitions
   - Request type
   - Response type
   - Error type (if endpoint-specific)

2. ADD the endpoint to the API client
   - Typed function with proper HTTP method
   - Request validation
   - Response type assertion

3. CREATE/UPDATE the service layer
   - Business logic, data transformation
   - Error mapping (API errors → user-friendly errors)
   - Caching strategy (if applicable)

4. CREATE/UPDATE the hook/composable
   - Loading state
   - Error state
   - Data state
   - Refetch/retry capability
   - Optimistic updates (if applicable)

5. UPDATE EVERY component/page that uses this data (FROM THE SURFACE MAP)
   - Replace mock data with hook/service call
   - Add loading state UI
   - Add error state UI
   - Add empty state UI
   - Verify data shape matches component expectations

6. WRITE an integration test
   - Test the REAL API flow (not mocked)
   - Test error scenarios
   - Test loading states
   - Test empty states

7. VERIFY by running the app and checking the page

8. CHECK OFF in the surface map — confirm ZERO remaining mock usages for this endpoint

NEVER move to the next endpoint until ALL files for the current endpoint are updated.
```

### Phase 5: Integration Testing (NOT MOCKED UNIT TESTS)

```
CRITICAL DISTINCTION:

❌ UNIT TEST (what AI usually does):
   - Mock the API response
   - Verify component renders mock data
   - THIS DOESN'T PROVE THE API INTEGRATION WORKS

✅ INTEGRATION TEST (what you MUST do):
   - Call the REAL API (or a realistic test server)
   - Verify the full data flow: API → service → hook → component → rendered output
   - Verify error flow: API error → error handler → error UI
   - Verify auth flow: no token → redirect to login

WRITE THESE INTEGRATION TESTS:

1. Happy path: API returns data → UI renders correctly
2. Error path: API returns 401 → redirect to login
3. Error path: API returns 500 → error message shown
4. Error path: Network failure → retry option shown
5. Empty path: API returns empty array → empty state shown
6. Loading path: API is slow → loading skeleton shown
7. Pagination: Load more / infinite scroll works
8. Auth: Token refresh on 401, then retry original request
```

### Phase 6: Full Verification (EVERY PAGE, NO EXCEPTIONS)

```
1. START the application
2. VISIT every single route in the application
3. For EACH route, verify:
   - [ ] Page renders without console errors
   - [ ] Data is REAL (not mock/placeholder)
   - [ ] Loading state appears before data loads
   - [ ] Error state appears when API fails
   - [ ] Empty state appears when no data
   - [ ] All interactive elements work (buttons, forms, links)
   - [ ] Navigation to other pages works
   - [ ] Data persists after navigation and return

4. RUN the full test suite
5. RUN the build
6. CHECK for any remaining mock data references:
   - grep -rn "mock\|placeholder\|lorem\|fake\|dummy\|hardcoded\|TODO.*api\|FIXME.*api"
```

## Output Format

```markdown
# API Integration Report

## API Spec Summary
- **Base URL:** [url]
- **Auth:** [method]
- **Endpoints:** [N total]
- **Types Created:** [N]
- **Services Created:** [N]

## Surface Map (Before → After)
| File | Before | After | Status |
|------|--------|-------|--------|
| [file] | Mock data | Real API | ✅ Complete |
| [file] | Hardcoded | Service layer | ✅ Complete |
| [file] | No error handling | Full error handling | ✅ Complete |

## Integration Test Results
| Test | Status |
|------|--------|
| [test description] | ✅/❌ |

## Remaining Issues
[Any identified gaps with severity]

## Verification
- [ ] Every endpoint has typed client function
- [ ] Every endpoint has service layer function
- [ ] Every mock data usage has been replaced
- [ ] Every page renders with real data
- [ ] Integration tests pass
- [ ] Build succeeds
- [ ] No mock data references remain in codebase
```

## Red Flags — STOP

- Implementing without reading the full API spec first
- Creating an API layer without types for every endpoint
- Replacing mock data in SOME files but not building a surface map
- Writing unit tests with mocks instead of integration tests
- Components making direct HTTP calls (violates SRP)
- Moving to next endpoint without verifying ALL consumers are updated
- Claiming "done" without checking every page in the browser
- Not asking questions about ambiguous spec details

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll replace the rest later" | You won't. The surface map exists to prevent this |
| "Mock tests are enough" | Mock tests prove the mock works, not the API |
| "The component handles its own API call" | That violates SRP. Use a service layer |
| "The types are obvious" | Define them explicitly. Obvious today is confusing tomorrow |
| "This page doesn't use the API" | Search for it. You'd be surprised |
| "The spec is clear enough" | If you didn't ask the 10 Iron Questions, you're assuming |

## Integration

- **Before:** `codebase-mapping` to understand the existing frontend structure
- **During:** `test-driven-development` for the integration tests
- **After:** `verification-before-completion` to confirm everything works
- **If issues found:** `systematic-debugging` for specific API failures
- **Architecture review:** `architecture-audit` to validate the API layer design

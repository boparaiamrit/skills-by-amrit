---
description: Integrate an API spec from a product manager into the frontend with full surface mapping, modular API layer, and integration testing
---

## Steps

1. Understand the API spec from the user. Ask the Iron Questions if not answered:
   - Base URL, auth method, response envelope, all endpoints, error codes, rate limits, pagination style
   - If ANY question is unanswered, STOP and ask the user before proceeding

2. Search the codebase for all API consumers:
// turbo
```
echo "=== HTTP CALLS ==="; grep -rn "fetch\|axios\|useSWR\|useQuery\|useMutation\|\$fetch\|httpClient\|apiClient" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.vue" --include="*.py" . | grep -vi "node_modules\|.git\|dist\|.next" | head -40; echo "=== MOCK DATA ==="; grep -rn "mock\|placeholder\|lorem\|fake\|dummy\|hardcoded\|TODO.*api\|FIXME.*api" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.vue" --include="*.py" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock" | head -30; echo "=== ENV API URLS ==="; grep -rn "API_URL\|BASE_URL\|BACKEND\|ENDPOINT" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.env*" . | grep -vi "node_modules\|.git\|dist" | head -20
```

3. Read the API spec/documentation and create a typed endpoint inventory:
   - List EVERY endpoint: method, path, request body, response shape, auth, pagination
   - Create TypeScript/Python types for all request and response shapes
   - Document error response shapes

4. Create the Surface Map:
   - For EVERY file found in step 2, document: file path, current state, which API endpoint(s) it uses, what needs to change
   - Cross-reference: every endpoint in the spec must map to at least one file
   - Cross-reference: every file using mock data must appear in the map
   - Present the surface map to the user for validation

5. Design the API layer architecture following SOLID:
   - API client module (HTTP, auth, error handling, retry)
   - Service modules per domain entity
   - Hook/composable layer
   - Type definitions
   - Present the architecture to the user for approval

6. Implement the API client:
   - Auth token management (get, refresh, include in requests)
   - Error handling (parse API errors, map to user-friendly messages)
   - Response type assertions
   - Retry logic
   - Rate limit handling

7. For EACH endpoint (one at a time):
   a. Create/update type definitions
   b. Add the endpoint to the API client
   c. Create/update the service layer function
   d. Create/update the hook/composable
   e. Update EVERY component/page in the surface map for this endpoint
   f. Add loading, error, and empty states
   g. Write an integration test (NOT mocked)
   h. Verify by running the app and checking the affected page(s)
   // turbo
   ```
   npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -10
   ```

8. After all endpoints are implemented, verify no mock data remains:
// turbo
```
echo "=== REMAINING MOCKS ==="; grep -rn "mock\|placeholder\|lorem\|fake\|dummy\|hardcoded" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock\|__test" | head -20; echo "=== BUILD ==="; npm run build 2>&1 | tail -5; echo "=== TESTS ==="; npm test 2>&1 | tail -10
```

9. Visit EVERY route and verify real data is displayed, all states are handled, and no pages are broken.

10. Generate the API Integration Report:
    - Surface Map (before → after)
    - Integration test results
    - Remaining issues
    - Verification checklist

11. Present results to the user. If gaps found, create fix plans.

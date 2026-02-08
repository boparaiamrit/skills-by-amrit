---
description: Audit every route, flow, and component for functional completeness — find all placeholder pages, broken flows, and disconnected APIs
---

## Steps

1. Extract all routes from the application:
// turbo
```
echo "=== PAGE FILES ==="; find . -type f \( -name "page.tsx" -o -name "page.jsx" -o -name "page.ts" -o -name "page.js" \) -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | head -30; echo "=== ROUTE FILES ==="; find . -type f \( -name "*.tsx" -o -name "*.jsx" -o -name "*.vue" \) -path "*/pages/*" -not -path "*/node_modules/*" -not -path "*/.next/*" 2>/dev/null | head -30; echo "=== ROUTER CONFIG ==="; grep -rn "path:\|route\|Route\|createBrowserRouter\|createFileRoute" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next" | head -30
```

2. Create the Route Inventory from step 1 results:
   - List every route with: path, page component, auth required, status
   - Include 404, error, auth callback, and modal routes
   - Mark all as "🔍 Not checked" initially

3. Identify all user flows:
   - Authentication flows (signup, login, logout, password reset)
   - Core CRUD flows (create, read, update, delete for main entities)
   - Secondary flows (settings, search, pagination, file upload)
   - Document each flow as a numbered sequence of steps

4. Check for placeholder/hardcoded data across the codebase:
// turbo
```
echo "=== HARDCODED DATA ==="; grep -rn "lorem\|ipsum\|placeholder\|fake\|dummy\|John Doe\|jane@\|test@example\|sample data\|mock data\|TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --include="*.vue" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|__mock" | head -40; echo "=== HARDCODED ARRAYS ==="; grep -rn "const.*=.*\[" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec\|import\|export\|type\|interface" | head -30
```

5. Check API connection status:
// turbo
```
echo "=== API CALLS ==="; grep -rn "fetch(\|axios\.\|useSWR\|useQuery\|useMutation" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next" | head -30; echo "=== MOCK SERVICES ==="; grep -rn "msw\|mock.*server\|mock.*handler\|setupServer\|setupWorker" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|.next\|test\|spec" | head -20
```

6. For EACH route in the inventory:
   - Read the page component file
   - Determine the completeness level (0-5):
     - Level 0: SKELETON (blank/error)
     - Level 1: WIREFRAME (placeholder text)
     - Level 2: DEMO (hardcoded data)
     - Level 3: CONNECTED (API called but may fail)
     - Level 4: FUNCTIONAL (works but edge cases break)
     - Level 5: COMPLETE (all states handled)
   - Check: data source (real API vs hardcoded), loading state, error state, empty state, interactivity

7. For EACH user flow:
   - Trace through every step
   - Mark where the flow breaks (if it does)
   - Record: flow name, total steps, completed steps, broken-at step, root cause

8. Trace backend connections:
   - For each API call in the frontend, verify:
     □ The backend endpoint exists
     □ Auth tokens are sent correctly
     □ Response shape matches frontend expectations
     □ Error responses are handled
   - Document any disconnections

9. Generate the completeness report:
   - Overall completeness level (0-5)
   - Route inventory with per-route level
   - Flow test results
   - Gap list sorted by severity (🔴 > 🟠 > 🟡 > 🔵)
   - For EACH gap: specific file, current behavior, expected behavior, acceptance criteria

10. Create fix tasks for each gap and present recommended fix order to the user:
    - Critical gaps first (broken auth, broken core flow)
    - High gaps second (placeholder data, missing API connections)
    - Medium gaps third (missing loading/error/empty states)
    - Low gaps last (polish, animations, accessibility)

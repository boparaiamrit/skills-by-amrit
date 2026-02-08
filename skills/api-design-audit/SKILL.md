---
name: api-design-audit
description: "Use when designing, reviewing, or auditing APIs — REST, GraphQL, RPC, WebSocket. Covers endpoint design, request/response contracts, versioning, error handling, pagination, rate limiting, and documentation."
---

# API Design Audit

## Overview

APIs are contracts. Breaking changes break trust. Bad design creates permanent technical debt that every consumer inherits.

**Core principle:** Design APIs for the consumer, not the implementation. The best API is the one nobody needs documentation to understand.

## The Iron Law

```
NO API ENDPOINT WITHOUT DEFINED CONTRACT, ERROR HANDLING, VALIDATION, AND DOCUMENTATION. NO BREAKING CHANGE WITHOUT VERSIONING.
```

## When to Use

- Designing new API endpoints
- Reviewing existing API architecture
- Investigating API-related bugs
- Before publishing or versioning an API
- When consumers report confusing behavior
- During any codebase audit

## When NOT to Use

- Internal function interfaces (use `code-review` or `architecture-audit`)
- Database query optimization (use `database-audit`)
- UI form validation only (use `frontend-audit`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "API looks standard" — check every endpoint against REST conventions or chosen style
- Say "errors are handled" — verify every endpoint returns structured errors with correct HTTP status
- Say "inputs are validated" — test boundaries, missing fields, wrong types, malicious input
- Skip pagination check — verify every list endpoint is paginated with limits
- Say "auth is fine" — verify every endpoint enforces auth AND authorization (ownership)
- Skip response shape consistency — compare 5+ endpoint responses for structural consistency
- Say "documentation exists" — verify docs match actual behavior (test one endpoint against docs)
- Trust error messages — verify they're helpful but don't leak internals (no stack traces, no SQL)
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "It's an internal API, it doesn't need docs" | Internal APIs become external. Undocumented APIs break silently. |
| "We'll add pagination later" | By then, someone's written a client that expects all results. Breaking change. |
| "Validation is done on the frontend" | Frontend validation is UX. Backend validation is security. Both are required. |
| "We don't need versioning yet" | By the time you need it, you have consumers who can't handle the breaking change. |
| "Our error messages are fine" | "Internal server error" is not fine. "Email must be a valid email address" is fine. |
| "Rate limiting is overkill" | One script without rate limiting can take down your API in seconds. |
| "We use the same response format everywhere" | Verify it. "Everywhere" often has exceptions nobody remembers. |

## Iron Questions

```
1. Can a developer use this API correctly by reading only the response, without documentation?
2. If I send garbage to every field, do I get a helpful validation error for each one?
3. If I request a resource I don't own, do I get 403 (not 200 with someone else's data)?
4. If I request 10 million records, does the API protect itself?
5. What happens when the backend errors? Does the consumer get a structured, debuggable error?
6. If I call this endpoint twice with the same data, do I get the same result? (idempotency)
7. If the API changes tomorrow, do existing consumers break?
8. Can I tell from the URL alone what this endpoint does?
9. How does a new developer discover all available endpoints?
10. What prevents abuse? (rate limiting, auth, input limits)
```

## The Audit Process

### Phase 1: Endpoint Design

**REST conventions:**

| Action | Method | Path | Success Status | Notes |
|--------|--------|------|---------------|-------|
| List | GET | `/resources` | 200 | Must be paginated |
| Create | POST | `/resources` | 201 | Return created resource |
| Read | GET | `/resources/:id` | 200 | 404 if not found |
| Update (full) | PUT | `/resources/:id` | 200 | Replace entire resource |
| Update (partial) | PATCH | `/resources/:id` | 200 | Merge with existing |
| Delete | DELETE | `/resources/:id` | 204 | Idempotent |
| Nested | GET | `/resources/:id/children` | 200 | Relationship access |
| Action | POST | `/resources/:id/actions/send` | 200/202 | Non-CRUD operations |

**Checklist per endpoint:**

| Check | Question | Detection |
|-------|----------|-----------|
| Method | Is HTTP method semantically correct? | `grep -rn "app.get\|app.post\|router.get" --include="*.ts"` |
| Path | Does it follow resource-based naming? | No verbs in URLs (/getUser → /users/:id) |
| Auth | Is authentication required and enforced? | Check middleware chain |
| Authorization | Does it check resource ownership? | Can user A access user B's data? |
| Validation | Are inputs validated with clear errors? | Send empty body, wrong types |
| Response shape | Consistent with other endpoints? | Compare 5 responses |
| Status codes | Correct and specific? | 200 vs 201 vs 204 |
| Idempotency | Are PUT/DELETE idempotent? | Call twice, same result? |
| Content-Type | Correct headers set? | Check response headers |

**Common endpoint design violations:**

| Violation | Example | Correct |
|-----------|---------|---------|
| Verbs in URLs | `GET /getUsers` | `GET /users` |
| Wrong method | `GET /deleteUser/:id` | `DELETE /users/:id` |
| Inconsistent naming | `/users` + `/get-orders` | `/users` + `/orders` |
| Flat when nested | `GET /comments?postId=5` | `GET /posts/5/comments` |
| Wrong status code | 200 for creation | 201 for creation |
| Missing content-type | No Content-Type header | `application/json` |

### Phase 2: Request/Response Contracts

```
1. ARE request bodies validated comprehensively? (type, format, range, required)
2. IS response shape documented and consistent across endpoints?
3. DO responses include only necessary data? (no over-fetching, no sensitive fields)
4. ARE dates in ISO 8601 format? (not Unix timestamps, not locale strings)
5. ARE IDs consistent type? (all strings or all numbers, not mixed)
6. IS null handling explicit? (null vs missing vs empty string)
7. ARE nested resources consistent depth? (not infinitely nested)
```

**Response envelope (recommended):**

```json
// Success (single resource)
{
  "data": { "id": "user_123", "name": "Jane", "email": "jane@example.com" }
}

// Success (list with pagination)
{
  "data": [{ "id": "user_123", "name": "Jane" }],
  "meta": { "cursor": "abc123", "has_next": true, "per_page": 25, "total": 142 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Must be a valid email address", "code": "INVALID_FORMAT" },
      { "field": "name", "message": "Required field", "code": "REQUIRED" }
    ]
  }
}
```

### Phase 3: Error Handling

**Standard error codes:**

| HTTP Status | When | Error Code Example | Consumer Action |
|-------------|------|--------------------|----------------|
| 400 | Invalid input format | `INVALID_REQUEST` | Fix request syntax |
| 401 | Not authenticated | `UNAUTHORIZED` | Authenticate first |
| 403 | Not authorized | `FORBIDDEN` | Don't retry, wrong permissions |
| 404 | Not found | `NOT_FOUND` | Resource doesn't exist |
| 409 | Conflict | `DUPLICATE_ENTRY` | Resolve conflict |
| 422 | Validation failure | `VALIDATION_ERROR` | Fix field values |
| 429 | Rate limited | `RATE_LIMITED` | Wait and retry (check Retry-After) |
| 500 | Server error | `INTERNAL_ERROR` | Report to API provider |
| 503 | Service unavailable | `SERVICE_UNAVAILABLE` | Retry with backoff |

**Error response rules:**
- Always return structured JSON error (not just HTTP status)
- Include machine-readable error code (for programmatic handling)
- Include human-readable message (for debugging)
- Include field-level details for validation errors
- Never expose stack traces in production
- Never expose internal SQL, file paths, or infrastructure details
- Include request ID for support correlation

### Phase 4: Pagination

```
1. ARE list endpoints paginated? (mandatory for > 20 items)
2. IS pagination style consistent? (cursor vs offset — pick one)
3. IS there a max page size? (prevent "give me everything" attacks)
4. IS default page size reasonable? (25-50, not 1000)
5. ARE sort options documented?
6. IS total count available? (with performance caveat for large datasets)
```

**Cursor vs Offset pagination:**

| Aspect | Cursor | Offset |
|--------|--------|--------|
| Performance at scale | 🟢 Constant | 🔴 Degrades with offset |
| Result consistency | 🟢 Stable during pagination | 🔴 Duplicates/gaps with concurrent inserts |
| Jump to page N | 🔴 Not possible | 🟢 Direct access |
| Complexity | Medium | Low |
| Best for | Real-time feeds, large datasets | Small datasets, admin panels |

### Phase 5: Versioning

```
1. IS versioning strategy defined? (URL path, header, or query param)
2. IS backward compatibility enforced? (additive changes only)
3. ARE breaking changes documented with migration guide?
4. IS there a deprecation policy? (sunset headers, timeline)
5. HOW many versions are supported simultaneously?
```

**Strategy comparison:**

| Strategy | Example | Pros | Cons |
|----------|---------|------|------|
| URL path | `/v1/users` | Obvious, easy routing | URL changes for every version |
| Header | `Accept: application/vnd.api+json; version=1` | Clean URLs | Hidden, harder to test |
| Query param | `/users?version=1` | Easy to add | Not RESTful |

### Phase 6: Rate Limiting and Security

```
1. ARE rate limits set? Different limits per endpoint sensitivity?
2. ARE rate limit headers returned? (X-RateLimit-Limit, Remaining, Reset)
3. ARE sensitive endpoints more strictly limited? (auth, password reset)
4. IS there per-user or per-API-key limiting?
5. IS input size limited? (request body, file uploads)
6. IS there request timeout? (prevent slow request attacks)
7. ARE CORS settings appropriate? (not wildcard * in production)
```

## Output Format

```markdown
# API Audit: [Project Name]

## Overview
- **Style:** REST / GraphQL / RPC
- **Endpoints:** N total
- **Auth Method:** JWT / Session / API Key
- **Versioning:** URL / Header / None
- **Pagination:** Cursor / Offset / None ⚠️
- **Rate Limiting:** Configured / Missing ⚠️

## Endpoint Inventory
| Method | Path | Auth | Validation | Pagination | Tests | Status |
|--------|------|------|-----------|------------|-------|--------|
| GET | /api/users | ✅ | ✅ | ✅ cursor | ✅ | 🟢 |
| POST | /api/users | ✅ | ⚠️ partial | N/A | ❌ | 🟠 |

## Contract Consistency
| Check | Consistent | Issues |
|-------|-----------|--------|
| Response envelope | ✅/❌ | |
| Date format | ✅/❌ | |
| ID type | ✅/❌ | |
| Error format | ✅/❌ | |

## Findings
[Standard severity format]

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- No input validation on POST/PUT endpoints
- Inconsistent response shapes across endpoints
- 500 errors exposing stack traces or SQL
- No pagination on list endpoints
- No rate limiting on any endpoint
- Authentication not enforced on sensitive endpoints
- GET endpoints that mutate data
- Verbs in URL paths
- No error response structure (just HTTP status)
- CORS set to `*` in production
- No request size limits
- Mixed ID types (string in some, number in others)

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Security:** `security-audit` for auth/injection analysis
- **Performance:** `performance-audit` for response time analysis
- **Frontend:** `full-stack-api-integration` for end-to-end data flow
- **Docs:** `writing-documentation` for API documentation

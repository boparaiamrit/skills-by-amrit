---
name: api-design-audit
description: "Use when designing, reviewing, or auditing APIs — REST, GraphQL, RPC, WebSocket. Covers endpoint design, request/response contracts, versioning, error handling, pagination, and documentation."
---

# API Design Audit

## Overview

APIs are contracts. Breaking changes break trust. Bad design creates permanent technical debt.

**Core principle:** Design APIs for the consumer, not the implementation.

## The Iron Law

```
NO API ENDPOINT WITHOUT DEFINED CONTRACT, ERROR HANDLING, AND DOCUMENTATION.
```

## When to Use

- Designing new API endpoints
- Reviewing existing API architecture
- Investigating API-related bugs
- Before publishing or versioning an API
- During any codebase audit

## The Audit Process

### Phase 1: Endpoint Design

**REST conventions:**

| Action | Method | Path | Status |
|--------|--------|------|--------|
| List | GET | `/resources` | 200 |
| Create | POST | `/resources` | 201 |
| Read | GET | `/resources/:id` | 200 |
| Update (full) | PUT | `/resources/:id` | 200 |
| Update (partial) | PATCH | `/resources/:id` | 200 |
| Delete | DELETE | `/resources/:id` | 204 |

**Checklist per endpoint:**

| Check | Question |
|-------|----------|
| Method | Is HTTP method semantically correct? |
| Path | Does it follow resource-based naming? |
| Auth | Is authentication required? Enforced? |
| Authorization | Does it check resource ownership? |
| Validation | Are inputs validated with clear error messages? |
| Response shape | Consistent with other endpoints? |
| Status codes | Correct and specific? |
| Idempotency | Are PUT/DELETE idempotent? |

### Phase 2: Request/Response Contracts

```
1. ARE request bodies validated comprehensively?
2. IS response shape documented and consistent?
3. DO responses include only necessary data? (no over-fetching)
4. ARE dates in ISO 8601 format?
5. ARE IDs consistent type? (all strings or all numbers)
6. IS null handling explicit? (null vs missing vs empty)
```

**Response envelope (recommended):**

```json
// Success
{
  "data": { ... },
  "meta": { "page": 1, "total": 100 }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "This field is required" }
    ]
  }
}
```

### Phase 3: Error Handling

**Standard error codes:**

| HTTP Status | When | Example |
|-------------|------|---------|
| 400 | Invalid input | Malformed JSON, missing required field |
| 401 | Not authenticated | Missing or expired token |
| 403 | Not authorized | Authenticated but not permitted |
| 404 | Not found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry, state conflict |
| 422 | Unprocessable | Valid syntax but invalid semantics |
| 429 | Rate limited | Too many requests |
| 500 | Server error | Unhandled exception |

**Error response rules:**
- Always return structured error (not just status code)
- Include machine-readable error code
- Include human-readable message
- Never expose stack traces in production
- Never expose internal identifiers or SQL

### Phase 4: Pagination

```
1. ARE list endpoints paginated? (mandatory for > 20 items)
2. IS pagination style consistent? (cursor vs offset)
3. IS there a max page size? (prevent "give me everything" attacks)
4. ARE sort options documented?
5. IS total count available? (with performance consideration)
```

**Cursor pagination (recommended):**
```json
{
  "data": [...],
  "meta": {
    "cursor": "eyJpZCI6MTAwfQ==",
    "has_next": true,
    "per_page": 25
  }
}
```

### Phase 5: Versioning

```
1. IS versioning strategy defined? (URL path, header, query param)
2. IS backwards compatibility enforced?
3. ARE breaking changes documented?
4. IS there a deprecation policy?
```

### Phase 6: Rate Limiting and Throttling

```
1. ARE rate limits set for all endpoints?
2. ARE rate limit headers returned? (X-RateLimit-Limit, X-RateLimit-Remaining)
3. ARE sensitive endpoints more strictly limited? (auth, password reset)
4. IS there per-user or per-IP limiting?
```

## Output Format

```markdown
# API Audit: [Project Name]

## Overview
- **Style:** REST / GraphQL / RPC
- **Endpoints:** N
- **Auth Method:** JWT / Session / API Key
- **Versioning:** URL / Header / None

## Endpoint Inventory
| Method | Path | Auth | Validation | Tests | Status |
|--------|------|------|-----------|-------|--------|
| GET | /api/users | ✅ | ✅ | ✅ | 🟢 |
| POST | /api/users | ✅ | ⚠️ | ❌ | 🟠 |

## Findings
[Standard severity format]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- No input validation on POST/PUT endpoints
- Inconsistent response shapes across endpoints
- 500 errors exposing stack traces
- No pagination on list endpoints
- No rate limiting
- Authentication not enforced on sensitive endpoints

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Security:** `security-audit` for auth/injection analysis
- **Performance:** `performance-audit` for response time analysis

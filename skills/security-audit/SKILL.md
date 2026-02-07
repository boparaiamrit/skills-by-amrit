---
name: security-audit
description: "Use when asked about security, when auditing a codebase, before deploying to production, or when handling user data. Covers authentication, authorization, injection, data exposure, dependencies, and infrastructure."
---

# Security Audit

## Overview

Find vulnerabilities before attackers do. Security is not a feature — it's a constraint that applies to everything.

**Core principle:** Assume every input is hostile. Assume every boundary will be tested.

## The Iron Law

```
NO DEPLOY WITHOUT SECURITY REVIEW. NO USER INPUT WITHOUT VALIDATION.
```

## When to Use

- "Is this secure?"
- Before any production deployment
- When handling user data, payments, or authentication
- When adding new endpoints or APIs
- During any codebase audit
- After dependency updates
- When implementing authentication/authorization

## The Audit Process

### Phase 1: Authentication

```
1. HOW do users authenticate? (password, OAuth, JWT, session, API key)
2. WHERE is auth checked? (middleware, per-route, manual)
3. WHAT happens when auth fails? (redirect, 401, error page)
4. ARE there endpoints without auth that should have it?
```

**Checklist:**

| Check | Status |
|-------|--------|
| Passwords hashed with bcrypt/argon2 (not MD5/SHA1) | |
| Password strength requirements enforced | |
| Rate limiting on login endpoint | |
| Account lockout after failed attempts | |
| Session invalidation on password change | |
| JWT tokens have reasonable expiry | |
| Refresh tokens properly rotated | |
| Remember-me tokens properly scoped | |
| Multi-factor authentication available (for sensitive apps) | |

### Phase 2: Authorization

```
1. CAN users access other users' data? (IDOR — Insecure Direct Object Reference)
2. ARE role checks consistent across all endpoints?
3. CAN users escalate their own privileges?
4. ARE there admin pages accessible without admin check?
```

**Test patterns:**

```
# IDOR Test
GET /api/users/1/orders     # Logged in as user 2 — should this work?
PUT /api/users/1/profile     # Logged in as user 2 — should this work?

# Privilege Escalation
POST /api/admin/users        # With regular user token
PUT /api/users/1 { role: "admin" }  # Self-promote

# Missing Auth
GET /api/internal/metrics    # No auth header — protected?
GET /api/debug/logs          # Should this be exposed?
```

### Phase 3: Injection Prevention

```
1. SQL/NoSQL injection — Are queries parameterized?
2. XSS — Is output encoded/escaped?
3. Command injection — Is user input in shell commands?
4. Path traversal — Is user input in file paths?
5. Template injection — Is user input in template engines?
6. Header injection — Is user input in HTTP headers?
```

**Framework-specific checks:**

| Framework | Injection Risk | Check |
|-----------|---------------|-------|
| Any SQL | Raw SQL with string concatenation | Use parameterized queries/ORM |
| React | `dangerouslySetInnerHTML` | Audit for necessity, sanitize input |
| Express | `req.query` in `exec()` | Never pass user input to shell |
| Django | `|safe` template filter | Audit each usage |
| Laravel | `DB::raw()` | Verify input is sanitized |
| Flask | `render_template_string()` | Use `render_template()` instead |

### Phase 4: Data Exposure

```
1. CHECK API responses — do they leak sensitive fields?
2. CHECK error messages — do they reveal internals?
3. CHECK logs — do they contain PII, tokens, or passwords?
4. CHECK source code — are secrets committed?
5. CHECK environment — are secrets properly managed?
```

**Common leaks:**

| Leak | Where to Check |
|------|---------------|
| API keys in client-side code | JS bundles, HTML source, `.env` in repo |
| Stack traces in production | Error handler configuration |
| SQL queries in error messages | Exception handling |
| Internal IPs/hostnames | API responses, headers |
| User emails in URLs | URL patterns, logs |
| Tokens in URL params | Should be in headers/cookies |

### Phase 5: Dependency Security

```
1. RUN dependency audit (npm audit, pip audit, bundler-audit)
2. CHECK for known CVEs in current versions
3. IDENTIFY end-of-life dependencies
4. CHECK for typosquatting (similar package names)
5. REVIEW dependency permissions (file access, network, etc.)
```

### Phase 6: Infrastructure

```
1. HTTPS enforced? (HSTS headers present?)
2. CORS configured correctly? (not * in production)
3. Security headers set? (CSP, X-Frame-Options, etc.)
4. Rate limiting on sensitive endpoints?
5. File upload restrictions? (type, size, storage location)
6. Cookie flags correct? (HttpOnly, Secure, SameSite)
```

**Required security headers:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  (CSP supersedes this)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Output Format

```markdown
# Security Audit: [Project Name]

## Executive Summary
[Overall security posture: strong / moderate / weak / critical]

## Findings

### 🔴 Critical — Immediate Action Required
[Vulnerability with reproduction steps and fix]

### 🟠 High — Fix Before Next Deploy
[...]

### 🟡 Medium — Schedule Fix
[...]

## Coverage Matrix

| Area | Status | Notes |
|------|--------|-------|
| Authentication | ✅/⚠️/❌ | |
| Authorization | ✅/⚠️/❌ | |
| Injection Prevention | ✅/⚠️/❌ | |
| Data Exposure | ✅/⚠️/❌ | |
| Dependencies | ✅/⚠️/❌ | |
| Infrastructure | ✅/⚠️/❌ | |

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — Escalate Immediately

- Plaintext passwords anywhere
- API keys/secrets in source code
- Admin endpoints without authentication
- Raw SQL with string concatenation from user input
- `eval()` or `exec()` with user input
- CORS set to `*` in production
- No rate limiting on auth endpoints

## Integration

- **Part of:** Full codebase audit with `architecture-audit`
- **Requires:** `dependency-audit` for package-level checks
- **Triggers:** `incident-response` if active vulnerabilities found

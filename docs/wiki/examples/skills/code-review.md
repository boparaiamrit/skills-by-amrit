# code-review Examples

> Multi-dimensional code review with severity-based feedback.

## Antigravity

```
/review src/features/auth/
```

## Claude Code

```
@/review src/features/auth/
```

## Review Dimensions

1. **Correctness** — Does it work as intended?
2. **Security** — Any vulnerabilities?
3. **Performance** — Any bottlenecks?
4. **Maintainability** — Is it readable and testable?
5. **Conformity** — Matches codebase patterns?

## Output Format

```markdown
## Code Review: src/features/auth/

### Summary
- Files reviewed: 5
- Issues found: 3 (1 🔴, 1 🟠, 1 🟡)

### Issues

#### 🔴 Critical: SQL Injection
**File:** `auth.service.ts:42`
```ts
// Current
const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// Fix
const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
```

#### 🟠 High: Missing Error Handling
**File:** `login.ts:28`
No try/catch around API call.

#### 🟡 Medium: Magic Number
**File:** `session.ts:15`
`3600000` should be named constant `SESSION_TIMEOUT_MS`.

### Positive Notes
- Good use of TypeScript types
- Consistent naming conventions
- Well-structured modules
```

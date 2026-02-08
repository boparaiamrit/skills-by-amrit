# /debug Command Examples

> Systematically debug an issue using structured diagnosis.

## Basic Usage

```
@/debug [error-message-or-description]
```

---

## Examples

### Example 1: Error Message

```
@/debug "TypeError: Cannot read property 'map' of undefined"
```

**What happens:**
1. Searches codebase for `.map(` calls on potentially undefined values
2. Checks recent commits for changes
3. Identifies the source file and line
4. Proposes fix with optional chaining

### Example 2: Behavioral Issue

```
@/debug "Login works locally but fails in production"
```

**Investigation:**
1. Compares environment variables
2. Checks API endpoint configuration
3. Verifies CORS settings
4. Identifies missing production env var

### Example 3: Performance Issue

```
@/debug "Page load takes 10+ seconds on first visit"
```

**Analysis:**
1. Checks bundle size
2. Identifies blocking resources
3. Finds N+1 query in data fetching
4. Proposes lazy loading solution

---

## Workflow Equivalent (Antigravity)

```
/debug "TypeError: Cannot read property 'map' of undefined"
```

Same structured approach with turbo-enabled verification steps.

---

## Related Commands

- `/fix-issue` — For GitHub issues specifically
- `/test` — Add regression test after fix
- `/verify` — Confirm fix works

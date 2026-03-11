# /learn Command Examples

> Extract reusable patterns and learnings from the current session.

## Usage

```
@/learn [category]
```

## Categories

| Category | What It Captures |
|----------|-----------------|
| `error` | Errors encountered and how they were fixed |
| `debug` | Debugging techniques that worked |
| `architecture` | Architecture decisions and trade-offs |
| `tool` | Tool configs, library quirks |
| `workflow` | Process improvements |
| `performance` | Performance fixes, profiling insights |
| `security` | Security issues found, hardening patterns |
| `testing` | Test strategies, mocking patterns |
| `all` | Scan all categories (default) |

## Examples

### Example 1: After Fixing a Tricky Auth Bug

**You:**
```
@/learn debug
```

**What happens:**
1. Scans session context for debugging-related learnings
2. Finds the auth token refresh race condition you debugged
3. Extracts the pattern: "When JWTs expire mid-request, the retry interceptor must queue concurrent refreshes"
4. Checks `.planning/LEARNINGS.md` for duplicates
5. Writes the new entry

**Output:**
```markdown
## Learnings Extracted

**New entries:** 2
**Updated entries:** 0
**Categories covered:** Debugging

### New Learnings
- Debugging — Auth Token Race Condition: Concurrent requests during JWT refresh
  cause 401 cascades; solution is a mutex-guarded refresh queue in the Axios interceptor
- Debugging — Redis Session Mismatch: `express-session` defaults to in-memory store
  in dev but Redis in prod; missing `resave: false` causes stale session overwrites

Saved to `.planning/LEARNINGS.md`
```

### Example 2: End-of-Session Full Capture

**You:**
```
@/learn all
```

**What happens:**
1. Reviews the entire session for patterns across all 8 categories
2. Finds architecture decisions, error resolutions, and tool quirks
3. Deduplicates against existing entries
4. Appends new learnings to each category section

### Example 3: Specific Category

```
@/learn performance
@/learn security
@/learn testing
```

---

## Related Commands

- `/memory` — Cross-session memory (broader scope)
- `/checkpoint` — Capture progress snapshots
- `/verify` — Validate implementations

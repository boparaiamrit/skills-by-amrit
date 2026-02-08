# systematic-debugging Examples

> Hypothesis-driven debugging with evidence chains and root cause focus.

## When to Use

- Bug reports with unclear root cause
- Intermittent failures
- Complex multi-component issues
- Performance problems

---

## Antigravity (Gemini) Examples

### Example 1: API Timeout Issue

**User prompt:**
```
I'm getting timeout errors in production. The API calls to /api/users are timing out after 30 seconds but only for some users.

Please use the systematic-debugging skill to investigate.
```

**What the skill does:**
1. Gathers symptoms and reproduction steps
2. Forms hypotheses ranked by likelihood:
   - H1: N+1 query for users with many records
   - H2: External service dependency timeout
   - H3: Database connection pool exhaustion
3. Tests each hypothesis with evidence
4. Documents root cause and fix

---

### Example 2: Using the Debug Workflow

**Trigger with workflow:**
```
/debug "TypeError: Cannot read property 'id' of undefined in UserProfile component"
```

**The workflow will:**
1. Verify environment state
2. Form 3-5 hypotheses
3. Test each with turbo-enabled commands
4. Document findings in `.planning/debug/`

---

## Claude Code Examples

### Example 1: Memory Leak Investigation

**User prompt:**
```
@/debug "Memory usage grows to 4GB after 2 hours in production"
```

**What Claude Code does:**
1. Reproduces by examining heap snapshots
2. Isolates to event listener accumulation
3. Diagnoses: Missing cleanup in useEffect
4. Fixes with proper cleanup function
5. Adds regression test

---

### Example 2: Spawning Debugger Agent

**For complex issues, spawn the specialist:**
```
Spawn the debugger agent to investigate why WebSocket connections are dropping every 30 minutes.
```

**The debugger agent will:**
- Follow scientific debugging methodology
- Maintain hypothesis log
- Provide evidence-based conclusions

---

## Common Patterns

### Pattern: The Hypothesis Log

Always maintain a running log:

```markdown
## Hypothesis Log

### H1: Database connection timeout
- **Rationale:** Error message mentions "connection reset"
- **Test:** Check connection pool metrics
- **Result:** ❌ REJECTED — Pool shows healthy connections

### H2: Network proxy timeout
- **Rationale:** 30s exactly matches proxy config
- **Test:** Check nginx timeout settings
- **Result:** ✅ CONFIRMED — proxy_read_timeout set to 30s
```

### Pattern: Evidence Trail

Never claim without evidence:

```markdown
## Evidence

1. **nginx.conf:42** — `proxy_read_timeout 30s;`
2. **Production logs** — Timeout occurs at exactly 30.00s
3. **Local test** — Reproduces with slow endpoint + 30s proxy
```

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| Jump to fixing | Form hypotheses first |
| Fix symptoms | Find root cause |
| Refactor while debugging | Minimal fix only |
| Claim "fixed" without test | Add regression test |
| Guess at the cause | Gather evidence |

---

## Related Skills

- [code-review](code-review.md) — Review the fix
- [verification-before-completion](verification-before-completion.md) — Verify fix works
- [incident-response](incident-response.md) — For production incidents

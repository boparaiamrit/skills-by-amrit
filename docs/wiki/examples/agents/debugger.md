# Debugger Agent Examples

> Scientific debugging specialist with hypothesis-driven investigation.

## When to Spawn

- Complex multi-component bugs
- Issues requiring deep investigation
- Intermittent failures
- Performance regressions

---

## Spawning the Agent

### In Claude Code

```
Spawn the debugger agent to investigate why user sessions are expiring after 5 minutes instead of 24 hours.
```

### Via /team Command

```
@/team start debug "Memory leak causing OOM after 2 hours"
```

---

## What the Agent Does

1. **Systematic Investigation**
   - Forms 3-5 hypotheses ranked by likelihood
   - Tests each with specific evidence requirements
   - Maintains hypothesis log with results

2. **Evidence Collection**
   - Code path tracing
   - Log analysis
   - State inspection
   - Recent change review

3. **Root Cause Identification**
   - Documents exact technical cause
   - Identifies file:line
   - Tracks when introduced

4. **Minimal Fix**
   - Changes fewest lines possible
   - No refactoring during debugging
   - Adds explanatory comments

5. **Verification**
   - Regression test creation
   - Build/test validation
   - Ripple effect check

---

## Example Session

**Prompt:**
```
Spawn debugger agent: "API responses are 10x slower after yesterday's deploy"
```

**Agent output:**
```markdown
## Debug Investigation: API Performance Degradation

### Hypothesis Log

#### H1: N+1 query introduced
- Rationale: New user profile endpoint added
- Test: Examine query logs
- Result: ✅ CONFIRMED

### Root Cause
- File: `src/api/users.ts:45`
- Issue: forEach with individual DB query instead of batch
- Introduced: Commit abc123 (yesterday)

### Fix Applied
- Changed to batch query with whereIn()
- Response time: 2.3s → 0.15s

### Regression Test
- Added: `tests/api/users.perf.test.ts`
```

---

## Anti-Patterns

| ❌ Agent Won't | ✅ Agent Will |
|----------------|---------------|
| Guess at causes | Form testable hypotheses |
| Jump to refactoring | Apply minimal fix |
| Claim fixed without proof | Verify with tests |
| Ignore ripple effects | Check for regressions |

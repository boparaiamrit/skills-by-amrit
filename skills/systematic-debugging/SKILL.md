---
name: systematic-debugging
description: "Use for ANY technical issue — test failures, bugs, unexpected behavior, performance problems, build failures, integration issues. Especially when under time pressure, when 'just one quick fix' seems obvious, or when previous fixes didn't work."
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

**Use for ANY technical issue:**
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Use ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (systematic is faster than thrashing)
- Someone wants it fixed NOW (rework costs more than investigation)

## The Four Phases

### Phase 1: Root Cause Investigation

```
1. REPRODUCE: Make the bug happen reliably
   - What exact steps trigger it?
   - What exact error message/behavior occurs?
   - Is it consistent or intermittent?

2. ISOLATE: Narrow the scope
   - When did it last work? (git bisect if needed)
   - What changed? (commits, deps, config, environment)
   - Minimum reproduction case — remove everything irrelevant

3. TRACE: Follow the execution path
   - Read the code, don't guess
   - Add temporary logging at key decision points
   - Check inputs AND outputs at each stage
   - Trace data transformations step by step

4. IDENTIFY: State the root cause
   - "The bug occurs because [specific mechanism]"
   - "This happens when [specific condition]"
   - "The root cause is [specific code/config/state]"
```

### Phase 2: Pattern Analysis

```
1. Is this a known pattern? (race condition, off-by-one, null reference, etc.)
2. Has this happened before? (check git history, issues)
3. Could it happen elsewhere? (search for same pattern)
4. What made this possible? (missing validation, missing test, wrong assumption)
```

### Phase 3: Hypothesis and Testing

```
1. STATE your hypothesis: "I believe the fix is [X] because [evidence]"
2. PREDICT: "If my hypothesis is correct, then [Y] should happen"
3. TEST the prediction before applying the fix
4. If prediction fails → hypothesis is wrong → back to Phase 1
```

### Phase 4: Implementation

```
1. Write a failing test that reproduces the bug
2. Apply the minimal fix
3. Verify the test passes
4. Run full test suite — no regressions
5. Check for same pattern elsewhere
6. Document root cause in commit message
```

## Red Flags — STOP and Follow Process

- "Let me try this" (without root cause)
- "I think the problem is..." (without evidence)
- "It's probably..." (probably = guessing)
- "Let me just restart/clear cache/rebuild" (hiding the problem)
- "It works now" (without understanding why)
- Third attempt at a fix (you're guessing, not debugging)

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I know what's wrong" | If you knew, it wouldn't be a bug |
| "Let me just try this" | Trying without understanding is guessing |
| "It's faster to just fix it" | You've said that about the last 3 attempts |
| "It's an obvious fix" | Then the root cause analysis will be quick |
| "We need this fixed now" | Rework takes longer than investigation |
| "It's a simple bug" | Simple bugs have simple root causes. Find them |

## Debugging Techniques

### Binary Search (Git Bisect)

```bash
git bisect start
git bisect bad HEAD        # Current version is broken
git bisect good v1.2.0     # Last known working version
# Git checks out a middle commit — test it
git bisect good # or bad   # Narrow down
# Repeat until root cause commit is found
git bisect reset
```

### Logging Strategy

```
1. Add logging BEFORE the suspected area
2. Log inputs, decision points, outputs
3. Use structured logging: { event, data, timestamp }
4. Remove logging after diagnosis (don't commit debug logs)
```

### Rubber Duck Protocol

When truly stuck:

```
1. Explain the problem out loud (or in writing)
2. Explain what you've tried
3. Explain why each attempt failed
4. Usually the answer becomes obvious during explanation
```

## Integration

- **After diagnosis:** `test-driven-development` for the fix
- **After fix:** `verification-before-completion` to confirm
- **If pattern found:** `refactoring-safely` to fix globally
- **If recurring:** `architecture-audit` to find systemic cause

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

## When NOT to Use

- Production outage where mitigation is needed first (use `incident-response` — restore service, then debug)
- Design-time decisions (use `brainstorming`)
- Code quality improvements with no bug (use `refactoring-safely`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Apply a fix before stating the root cause — "I think this will fix it" is not debugging
- Say "I found the issue" without reproduction evidence — reproduce first, always
- Skip isolation — "it's probably in this file" is a guess, not a diagnosis
- Apply multiple changes at once — change ONE thing, test, observe
- Accept "it works now" without understanding why — accidental fixes reoccur
- Trust error messages at face value — the symptom is NOT the cause
- Debug by reading code alone when you can run it — runtime truth > static analysis
- Move on after the fix without checking for the same pattern elsewhere
```

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I know what's wrong" | If you knew, it wouldn't be a bug |
| "Let me just try this" | Trying without understanding is guessing |
| "It's faster to just fix it" | You've said that about the last 3 attempts |
| "It's an obvious fix" | Then the root cause analysis will be quick |
| "We need this fixed now" | Rework takes longer than investigation |
| "It's a simple bug" | Simple bugs have simple root causes. Find them |
| "The error message says..." | Error messages describe symptoms, not causes |
| "It worked on my machine" | That's a clue, not a conclusion. Investigate the difference |

## Iron Questions

```
1. Can I REPRODUCE this bug reliably? (if not, I can't verify any fix)
2. WHEN did this last work? (what changed between then and now?)
3. WHERE exactly does the behavior diverge from expected? (trace the code)
4. WHAT is the actual vs expected output? (be precise — not "it's wrong")
5. Is this the ROOT CAUSE or a symptom of something deeper?
6. If I apply this fix, can I PROVE it works? (specific test or verification)
7. Does this same pattern exist elsewhere in the codebase?
8. WHY did the existing tests not catch this? (test gap)
```

## The Four Phases

### Phase 1: Root Cause Investigation

```
1. REPRODUCE: Make the bug happen reliably
   - What exact steps trigger it?
   - What exact error message/behavior occurs?
   - Is it consistent or intermittent?
   - Can you create a minimal reproduction?

2. ISOLATE: Narrow the scope
   - When did it last work? (git bisect if needed)
   - What changed? (commits, deps, config, environment)
   - Minimum reproduction case — remove everything irrelevant
   - Binary search: comment out half the code — does it still fail?

3. TRACE: Follow the execution path
   - Read the code, don't guess
   - Add temporary logging at key decision points
   - Check inputs AND outputs at each stage
   - Trace data transformations step by step
   - Compare actual values to expected values at each step

4. IDENTIFY: State the root cause
   - "The bug occurs because [specific mechanism]"
   - "This happens when [specific condition]"
   - "The root cause is [specific code/config/state]"
   - If you can't state it this clearly, you haven't found it yet
```

### Phase 2: Pattern Analysis

```
1. Is this a known pattern? (race condition, off-by-one, null reference, etc.)
2. Has this happened before? (check git history, issues)
3. Could it happen elsewhere? (search for same pattern)
4. What made this possible? (missing validation, missing test, wrong assumption)
5. Is this a symptom of a deeper architectural issue?
```

**Common bug patterns:**

| Pattern | Symptoms | Investigation |
|---------|----------|---------------|
| Race condition | Intermittent failure, timing-dependent | Add logging with timestamps, test with delays |
| Off-by-one | Wrong count, missing first/last item | Check loop boundaries, array indices |
| Null reference | Crash on property access | Trace where null enters the system |
| State mutation | Works sometimes, fails others | Check shared state, concurrent access |
| Stale cache | Old data displayed, refresh fixes it | Check cache invalidation |
| Type coercion | Wrong comparison results | Check strict vs loose equality, type conversions |
| Timezone | Wrong dates/times | Check UTC vs local conversion at every boundary |
| Encoding | Garbled characters, byte issues | Check encoding at read, transform, write stages |

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
5. Check for same pattern elsewhere (grep for similar code)
6. Document root cause in commit message
```

## Red Flags — STOP and Follow Process

- "Let me try this" (without root cause)
- "I think the problem is..." (without evidence)
- "It's probably..." (probably = guessing)
- "Let me just restart/clear cache/rebuild" (hiding the problem)
- "It works now" (without understanding why)
- Third attempt at a fix (you're guessing, not debugging)
- The fix is larger than the bug (you're changing too much)
- You're fixing a different file than where the bug manifests (check your hypothesis)

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

### Minimal Reproduction

```
1. Start with the failing scenario
2. Remove components until it stops failing
3. The last component you removed is likely involved
4. Build back up to confirm
```

### Rubber Duck Protocol

When truly stuck:

```
1. Explain the problem out loud (or in writing)
2. Explain what you've tried and what results you got
3. Explain why each attempt failed
4. Explain what you EXPECT to happen vs what ACTUALLY happens
5. Usually the answer becomes obvious during explanation
```

## Integration

- **During production incidents:** `incident-response` for mitigation first
- **After diagnosis:** `test-driven-development` for the fix
- **After fix:** `verification-before-completion` to confirm
- **If pattern found:** `refactoring-safely` to fix globally
- **If recurring:** `architecture-audit` to find systemic cause

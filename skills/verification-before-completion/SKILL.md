---
name: verification-before-completion
description: "Use when about to claim work is complete, fixed, passing, or done. Requires running verification commands and confirming output before making any success claims. Evidence before assertions, always."
---

# Verification Before Completion

## Overview

Claiming work is complete without verification is dishonesty, not efficiency.

**Core principle:** Evidence before claims, always.

**Violating the letter of this rule is violating the spirit of this rule.**

## The Iron Law

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command *in this response*, you cannot claim it passes.

## The Gate Function

```
BEFORE claiming any status or expressing satisfaction:

1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output — check exit code, count failures
4. VERIFY: Does output actually confirm the claim?
   - If NO → State actual status with evidence
   - If YES → State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying.
```

## Verification Requirements

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| "Tests pass" | Test output: 0 failures | Previous run, "should pass" |
| "Build succeeds" | Build output: exit 0 | "Linter passed" |
| "Linter clean" | Linter output: 0 errors | Partial check |
| "Bug fixed" | Reproduction test passes | "Code changed" |
| "Type-safe" | Type checker output: 0 errors | "No red squiggles" |
| "Feature complete" | Line-by-line requirement check | "Tests pass" |
| "No regressions" | Full suite green | Targeted tests only |
| "Agent completed" | VCS diff of actual changes | Agent's "success" claim |
| "Deployed" | Health check returns 200 | Deploy command exit |

## Red Flags — STOP

You are about to violate this rule if:

- Using "should", "probably", "seems to", "looks like"
- Expressing satisfaction before verification ("Great!", "Perfect!", "Done!")
- About to commit/push/PR without running tests
- Trusting a subagent's success report without checking
- Relying on partial verification ("well, this test passes...")
- Thinking "just this once"
- Tired and wanting to be done
- **ANY wording implying success without having run verification**

## Rationalization Prevention

| Excuse | Reality |
|--------|---------|
| "Should work now" | RUN the verification |
| "I'm confident" | Confidence ≠ evidence |
| "Just this once" | No exceptions |
| "Linter passed" | Linter ≠ compiler ≠ tests |
| "Agent said success" | Verify independently |
| "I'm tired" | Exhaustion ≠ excuse |
| "Partial check is enough" | Partial proves nothing |
| "Different words, so rule doesn't apply" | Spirit over letter |
| "I checked mentally" | Mental checks aren't evidence |

## Patterns

### Tests

```
✅ [Run test command] → [Output shows: 34/34 pass] → "All 34 tests pass"
❌ "Should pass now"
❌ "Tests look correct"
```

### Regression Test (TDD Red-Green)

```
✅ Write test → Run (FAIL) → Fix → Run (PASS) → Revert fix → Run (FAIL) → Restore → Run (PASS)
❌ "I wrote a regression test" (without red-green cycle)
```

### Build

```
✅ [Run build] → [Output shows: exit 0, no errors] → "Build passes"
❌ "Linter passed, so build should be fine"
```

### Requirements

```
✅ Re-read plan → Create checklist → Verify each item → Report gaps or completion
❌ "Tests pass, so feature is complete"
```

## Integration

- **Used after:** Every `executing-plans` task
- **Used after:** Every `systematic-debugging` fix
- **Used before:** Every `git-workflow` merge
- **Enables:** Honest `code-review` findings

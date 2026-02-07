---
name: test-driven-development
description: "Use during any implementation work — new features, bug fixes, refactors, behavior changes. Enforces the RED-GREEN-REFACTOR cycle. No production code without a failing test first."
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass. Refactor. Repeat.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

**Violating the letter of the rules is violating the spirit of the rules.**

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Wrote code before the test? **Delete it. Start over.**

No exceptions:
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- **Delete means delete**

Implement fresh from tests. Period.

## When to Use

**Always:**
- New features
- Bug fixes
- Refactoring
- Behavior changes

**Exceptions (confirm with human partner):**
- Throwaway prototypes
- Generated code (migrations, scaffolds)
- Configuration files
- Static assets

Thinking "skip TDD just this once"? Stop. That's rationalization.

## Red-Green-Refactor

### RED — Write Failing Test

```
1. Write ONE test for the NEXT smallest piece of behavior
2. Test should be specific enough that only one implementation satisfies it
3. Test name describes the behavior: "should reject email without @ symbol"
4. Run the test
```

### Verify RED — Watch It Fail

```
1. RUN the test
2. Verify it FAILS
3. Verify it fails for the RIGHT REASON (not a syntax error)
4. If it passes → your test is wrong or behavior already exists
```

**Right failure:** `Error: validateEmail is not defined`
**Wrong failure:** `SyntaxError: Unexpected token`

### GREEN — Minimal Code

```
1. Write the MINIMUM code to make the test pass
2. Hardcode if that's minimal (you'll generalize later)
3. Don't add extra logic "while you're at it"
4. Don't refactor yet
5. Don't add error handling unless the test requires it
```

### Verify GREEN — Watch It Pass

```
1. RUN the test
2. Verify it PASSES
3. Run ALL related tests — nothing else broke
4. If anything fails → fix before proceeding
```

### REFACTOR — Clean Up

```
1. Improve code quality WITHOUT changing behavior
2. Extract duplicates, rename, simplify
3. Run ALL tests after every change
4. Tests must stay GREEN throughout refactoring
5. If a test breaks → your refactor changed behavior. Revert.
```

### Repeat

Next behavior, next test, next cycle.

## Good Tests

| Quality | Characteristic |
|---------|---------------|
| **Fast** | Each test < 100ms. Slow tests get skipped |
| **Isolated** | No test depends on another test's state |
| **Deterministic** | Same result every time. No flaky tests |
| **Specific** | Tests one behavior. Fails for one reason |
| **Readable** | Test name is the specification |
| **Complete** | Covers happy path AND error paths |

## Testing Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Testing implementation details | Breaks on refactor | Test behavior, not internals |
| Excessive mocking | Tests pass, production fails | Minimize mocks, use fakes |
| Happy path only | Errors crash production | Test error cases explicitly |
| Slow tests | Developers skip them | Mock external services, use in-memory DBs |
| Test interdependence | Random failures, order-dependent | Full isolation per test |
| Snapshot abuse | Meaningless diffs, auto-updated | Targeted assertions instead |
| "Arrange, Assert" (skip Act) | Test doesn't test anything | Always have explicit action |
| Giant test functions | Can't tell what failed | One assertion per test path |

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll write tests after" | You won't. And if you do, they'll test your implementation, not requirements |
| "It's too simple to test" | If it's too simple to test, it's too simple to get wrong. So write the test |
| "Tests slow me down" | Tests slow you down NOW. Bugs slow you down MORE later |
| "I need to see the code first" | TDD IS how you see the code — one test at a time |
| "The framework handles this" | Does it? Prove it with a test |
| "It works, I checked manually" | Manual checking doesn't prevent regressions |

## Bug Fix Protocol

When fixing a bug:

```
1. WRITE a test that reproduces the bug (RED)
2. RUN it — verify it FAILS (confirms you can reproduce)
3. FIX the bug with minimal code change (GREEN)
4. RUN it — verify it PASSES
5. RUN full suite — no regressions
6. COMMIT with: "fix: [description] — closes #[issue]"
```

**Never fix without reproduction.** If you can't reproduce it, you can't verify the fix.

## Red Flags — STOP and Start Over

- Wrote production code before a test → **Delete and restart**
- Test passes without implementation → Test is wrong
- Modified test to make it pass → Test is wrong
- Skipped RED phase → You don't know what you're testing
- 10+ tests in one file with no implementation → Over-planning, start implementing
- Implementation is "close enough" → Either it passes or it doesn't

## Integration

- **During:** `executing-plans` uses TDD for each task
- **After:** `verification-before-completion` confirms all tests pass
- **Review:** `code-review` checks TDD compliance

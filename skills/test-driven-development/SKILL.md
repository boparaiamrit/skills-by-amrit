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

## When NOT to Use

- Writing documentation (use `writing-documentation`)
- Configuration changes with no behavioral impact
- Evaluating approaches (use `brainstorming` first, then TDD the chosen approach)
- CSS-only styling changes (visual verification, not testable behavior)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Write production code first "to understand the problem" — the test IS how you understand it
- Write multiple tests before any implementation — one test, one implementation cycle
- Skip the RED phase — if you didn't see it fail, you don't know what it tests
- Accept a test that passes without implementation — the test is wrong
- Modify a test to make it pass — the implementation must satisfy the test
- Refactor while tests are RED — GREEN first, then refactor
- Write tests that test implementation details — test BEHAVIOR
- Skip the REFACTOR phase — "it works" is not the end, "it's clean" is
```

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "I'll write tests after" | You won't. And if you do, they'll test your implementation, not requirements |
| "It's too simple to test" | If it's too simple to test, it's too simple to get wrong. So write the test |
| "Tests slow me down" | Tests slow you down NOW. Bugs slow you down MORE later |
| "I need to see the code first" | TDD IS how you see the code — one test at a time |
| "The framework handles this" | Does it? Prove it with a test |
| "It works, I checked manually" | Manual checking doesn't prevent regressions |
| "I'll just write a few tests at the end" | Post-hoc tests verify implementation, not behavior. They're testing the code you wrote, not the code you need |
| "This test is too hard to write" | If it's too hard to test, the design is wrong. Simplify the interface |

## Iron Questions

```
1. Have I written the test BEFORE any production code?
2. Did I watch the test FAIL? (not just "error" — fail for the RIGHT reason)
3. Is this test testing BEHAVIOR, not implementation details?
4. Is the test name a specification? ("should reject email without @")
5. Would this test still pass after a refactor of the implementation?
6. Am I writing the MINIMUM code to pass this one test?
7. Did I resist the urge to add "extra" code that no test requires?
8. After refactoring, do all tests still pass?
```

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

| Quality | Characteristic | Example |
|---------|---------------|---------|
| **Fast** | Each test < 100ms | Mock external services, use in-memory DBs |
| **Isolated** | No test depends on another test's state | Clean setup/teardown per test |
| **Deterministic** | Same result every time | No time-dependent logic, no randomness |
| **Specific** | Tests one behavior. Fails for one reason | One assertion per test path |
| **Readable** | Test name is the specification | `should_return_404_when_user_not_found` |
| **Complete** | Covers happy path AND error paths | Test success, failure, and edge cases |

## Test Structure (AAA Pattern)

```python
def test_should_reject_email_without_at_symbol():
    # Arrange — set up the context
    email = "invalidemail.com"

    # Act — perform the action
    result = validate_email(email)

    # Assert — verify the outcome
    assert result.valid is False
    assert result.error == "Email must contain @ symbol"
```

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
| Testing private methods | Couples tests to implementation | Test through the public interface |
| Overly specific assertions | Fragile tests | Assert what matters, ignore what doesn't |

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
- Testing private methods / internal state → Test behavior through public API

## Integration

- **During:** `executing-plans` uses TDD for each task
- **After:** `verification-before-completion` confirms all tests pass
- **Review:** `code-review` checks TDD compliance
- **Plans:** `writing-plans` includes test code in every task

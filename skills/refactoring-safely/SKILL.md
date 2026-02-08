---
name: refactoring-safely
description: "Use when changing existing code — restructuring, renaming, extracting, inlining, or migrating. Ensures behavior is preserved through methodical, test-backed transformations."
---

# Refactoring Safely

## Overview

Refactoring changes structure without changing behavior. If behavior changes, it's not refactoring — it's rewriting.

**Core principle:** Every refactoring step must be verified. If tests break, the refactoring changed behavior.

## The Iron Law

```
NO REFACTORING WITHOUT TESTS PROVING BEHAVIOR IS PRESERVED.
```

If there are no tests covering the code you're about to refactor, write them first.

## When to Use

- Before: the code needs structural improvement
- Before: adding a feature requires changing existing structure
- When: code smells are identified in review or audit
- When: "I can't add this feature because the code is too tangled"

## When NOT to Use

- Adding new features (that's `executing-plans` with TDD, not refactoring)
- Fixing a bug (that's `systematic-debugging` — behavior SHOULD change)
- Rewriting from scratch (refactoring preserves behavior; rewriting replaces it)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Refactor and add features in the same commit — separate concerns, separate commits
- Refactor without a green test baseline — no tests means you can't verify preservation
- Batch multiple refactoring steps between test runs — one step, one test run
- Say "it still works, I can tell by looking" — run the tests, read the output
- Refactor production-critical code without approval — risk must be explicit
- Skip characterization tests for untested code — capture behavior before changing it
- Refactor "while you're at it" during a bug fix — scope creep is a red flag
- Force a refactoring pattern that doesn't fit — the code tells you what it needs
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "This refactor is so small it doesn't need tests" | Small refactors break things too. Run the tests. |
| "I'll fix the bug AND clean up the code together" | Two different changes = two different commits. Bug fix first. |
| "The tests are slow, I'll run them at the end" | That's batching, not refactoring. Run tests after every step. |
| "This code has no tests, I'll refactor carefully" | No tests = no safety net. Write characterization tests first. |
| "I know what this code does" | Then prove it with a failing test. If you can't, you don't know enough. |
| "Let me rewrite the whole thing, it's cleaner" | Rewriting is not refactoring. Refactoring = incremental, verified steps. |

## Iron Questions

```
1. Are all existing tests GREEN before I start?
2. Is the code I'm refactoring covered by tests? (if not, write characterization tests first)
3. Is this step the SMALLEST possible transformation?
4. Can I finish this step and verify it in under 5 minutes?
5. Did all tests pass AFTER this step? (including tests I didn't write)
6. Does the diff look like PURELY structural change? (no behavior shifts)
7. Am I mixing refactoring with feature work? (if yes, stop and separate)
8. Would reverting this step leave the codebase in a working state?
```

## The Process

### Step 1: Baseline

```
1. RUN all tests — they must be GREEN
2. SAVE the test output (your proof of baseline)
3. IDENTIFY gaps — code you're refactoring but isn't tested
4. IF gaps: Write characterization tests FIRST
```

**Characterization tests:** Tests that capture *current behavior* (even if buggy). They prove you didn't change anything.

```
1. Call the function with representative inputs
2. Capture the actual output
3. Assert on the actual output
4. This locks existing behavior — now refactor safely
```

### Step 2: Plan Refactoring Steps

```
1. BREAK into smallest possible steps
2. EACH step should take < 5 minutes
3. EACH step should keep tests green
4. ORDER: safest changes first (renames → extracts → moves → restructures)
```

**Safe refactoring ordering:**

| Order | Refactoring | Risk | Example |
|-------|------------|------|---------|
| 1 | Rename (variable, function, class) | Very low | `temp` → `connectionTimeout` |
| 2 | Extract function/method | Low | Pull validation logic into `validateInput()` |
| 3 | Extract constant/variable | Low | `3600` → `SECONDS_PER_HOUR` |
| 4 | Inline function/variable | Low | Remove unnecessary wrapper |
| 5 | Move function to different module | Medium | Extract utility to shared module |
| 6 | Change function signature | Medium | Add parameter, change return type |
| 7 | Replace inheritance with composition | High | Class hierarchy → composition pattern |
| 8 | Change data structures | High | Array → Map, nested object → flat |
| 9 | Change architectural patterns | Very high | Singleton → DI, callbacks → async/await |

### Step 3: Execute (One Step at a Time)

```
For each refactoring step:
  1. ANNOUNCE: "Refactoring step N: [what you're doing]"
  2. MAKE the change
  3. RUN tests immediately
  4. Tests GREEN → commit with descriptive message
  5. Tests RED → revert immediately and investigate

NEVER batch multiple refactoring steps without testing between them.
```

### Step 4: Verify

```
1. RUN full test suite (not just related tests)
2. COMPARE behavior with baseline (same test count, same results)
3. REVIEW diff — does it look like purely structural change?
4. IF behavior changed → something went wrong. Revert and re-examine.
5. CHECK: Did any test execution times change significantly? (could indicate performance regression)
```

## Common Refactoring Patterns

### Extract Function

```python
# Before
def process_order(order):
    # validate
    if not order.items:
        raise ValueError("Empty order")
    if order.total <= 0:
        raise ValueError("Invalid total")
    # process
    charge(order.total)
    ship(order.items)

# After
def validate_order(order):
    if not order.items:
        raise ValueError("Empty order")
    if order.total <= 0:
        raise ValueError("Invalid total")

def process_order(order):
    validate_order(order)
    charge(order.total)
    ship(order.items)
```

### Replace Magic Numbers

```python
# Before
if retry_count > 3:
    if timeout > 30:

# After
MAX_RETRIES = 3
CONNECTION_TIMEOUT_SECONDS = 30

if retry_count > MAX_RETRIES:
    if timeout > CONNECTION_TIMEOUT_SECONDS:
```

### Replace Conditional with Polymorphism

```python
# Before
def calculate_discount(customer_type, amount):
    if customer_type == "premium":
        return amount * 0.2
    elif customer_type == "regular":
        return amount * 0.1
    else:
        return 0

# After
class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount): pass

class PremiumDiscount(DiscountStrategy):
    def calculate(self, amount): return amount * Decimal("0.2")

class RegularDiscount(DiscountStrategy):
    def calculate(self, amount): return amount * Decimal("0.1")
```

### Simplify Conditional

```python
# Before
def get_status(user):
    if user.is_active:
        if user.subscription:
            if user.subscription.is_valid():
                return "active"
            else:
                return "expired"
        else:
            return "free"
    else:
        return "inactive"

# After (guard clauses)
def get_status(user):
    if not user.is_active:
        return "inactive"
    if not user.subscription:
        return "free"
    if not user.subscription.is_valid():
        return "expired"
    return "active"
```

## Code Smells That Trigger Refactoring

| Smell | Indicator | Refactoring |
|-------|-----------|-------------|
| Long method | > 50 lines | Extract function |
| God class | > 10 methods doing unrelated things | Extract class |
| Feature envy | Method uses another class's data more than its own | Move method |
| Data clump | Same 3+ params always together | Extract class/dataclass |
| Primitive obsession | Using strings/ints for domain concepts | Create value objects |
| Switch statements | Same switch in multiple places | Polymorphism |
| Duplicate code | Same logic in 2+ places | Extract and share |
| Dead code | Unreachable or unused | Delete it |
| Magic numbers | Unexplained constants | Named constants |

## Red Flags — STOP

- Refactoring and adding features in the same commit
- Refactoring without tests
- Skipping tests between steps
- "It still works, I can tell by looking at it"
- Batch refactoring (multiple changes, tested at the end)
- Refactoring production-critical code without approval
- Test count changed after refactoring (unless tests were also refactored)
- Refactoring "while fixing a bug"

## Integration

- **Before:** Ensure test baseline exists (`test-driven-development`)
- **After each step:** `verification-before-completion`
- **After completion:** `code-review` of the full refactoring
- **For guidance:** `architecture-audit` identifies what needs refactoring
- **Throughout:** `git-workflow` for atomic commits

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

| Order | Refactoring | Risk |
|-------|------------|------|
| 1 | Rename (variable, function, class) | Very low |
| 2 | Extract function/method | Low |
| 3 | Extract constant/variable | Low |
| 4 | Inline function/variable | Low |
| 5 | Move function to different module | Medium |
| 6 | Change function signature | Medium |
| 7 | Replace inheritance with composition | High |
| 8 | Change data structures | High |
| 9 | Change architectural patterns | Very high |

### Step 3: Execute (One Step at a Time)

```
For each refactoring step:
  1. MAKE the change
  2. RUN tests immediately
  3. Tests GREEN → commit with descriptive message
  4. Tests RED → revert and investigate

NEVER batch multiple refactoring steps without testing between them.
```

### Step 4: Verify

```
1. RUN full test suite (not just related tests)
2. COMPARE behavior with baseline
3. REVIEW diff — does it look like purely structural change?
4. IF behavior changed → something went wrong. Revert and re-examine.
```

## Common Refactoring Patterns

### Extract Function

```
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

```
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

```
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
    def calculate(self, amount): return amount * 0.2

class RegularDiscount(DiscountStrategy):
    def calculate(self, amount): return amount * 0.1
```

## Red Flags — STOP

- Refactoring and adding features in the same commit
- Refactoring without tests
- Skipping tests between steps
- "It still works, I can tell by looking at it"
- Batch refactoring (multiple changes, tested at the end)
- Refactoring production-critical code without approval

## Integration

- **Before:** Ensure test baseline exists (`test-driven-development`)
- **After each step:** `verification-before-completion`
- **After completion:** `code-review` of the full refactoring
- **For guidance:** `architecture-audit` identifies what needs refactoring

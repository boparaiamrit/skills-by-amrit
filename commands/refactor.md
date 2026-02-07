---
name: refactor
description: "Safely refactor code with verification at each step."
disable-model-invocation: true
argument-hint: "[file-or-pattern-to-refactor]"
---

# /refactor — Safe Refactoring

Refactor code while maintaining correctness through continuous verification.

## Instructions

1. **Assess the target** from `$ARGUMENTS`:
   - Read and understand the current code
   - Identify code smells: duplication, long functions, god classes, deep nesting
   - Map all callers and dependents of the code being refactored

2. **Establish a safety net**:
   - Run existing tests: `npm test` / `pytest` / etc.
   - If no tests exist → WRITE CHARACTERIZATION TESTS FIRST
   - Note the current test results as the baseline

3. **Plan the refactoring** — choose from:
   - **Extract function** — pull logic into a named function
   - **Extract class** — separate responsibilities
   - **Rename** — improve naming for clarity
   - **Move** — relocate code to better module
   - **Inline** — remove unnecessary abstraction
   - **Replace conditional with polymorphism**
   - **Introduce parameter object** — group related params

4. **Execute in small steps**:
   - Make ONE refactoring move at a time
   - Run tests after EACH move
   - If tests fail → revert and try a different approach
   - Commit after each successful step

5. **Verify the refactoring**:
   - All existing tests still pass
   - No new warnings or errors
   - Code is measurably simpler (fewer lines, less nesting, better names)
   - All callers still work correctly

6. **NEVER combine refactoring with behavior changes** — do one or the other.

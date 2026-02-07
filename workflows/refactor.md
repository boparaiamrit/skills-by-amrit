---
description: Refactor code safely with test verification at each step
---

## Steps

1. Identify the refactoring target. Read the file to understand current structure.

2. Run existing tests to establish a baseline:
```
npm test 2>&1 || pytest 2>&1
```

3. If no tests exist, write characterization tests first:
   - Tests that capture the CURRENT behavior (even if imperfect)
   - These serve as a safety net during refactoring

4. Run the characterization tests to verify they pass:
```
npm test 2>&1 || pytest 2>&1
```

5. Make ONE refactoring move at a time. Choose from:
   - Extract function — pull logic into a named function
   - Extract class — separate responsibilities
   - Rename — improve naming for clarity
   - Move — relocate code to better module
   - Inline — remove unnecessary abstraction
   - Simplify conditionals — reduce nesting

6. After EACH move, run tests:
```
npm test 2>&1 || pytest 2>&1
```

7. If tests fail, revert the last change and try a different approach.

8. After all moves are complete, verify:
   - All tests still pass
   - Code is measurably simpler
   - No new warnings or errors

9. Commit with a descriptive message explaining what was refactored and why.

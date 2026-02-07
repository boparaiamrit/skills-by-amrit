---
description: Generate comprehensive tests for a file or module
---

## Steps

1. Identify the test framework in use:
// turbo
```
cat package.json 2>/dev/null | grep -E "jest|vitest|mocha|pytest" || cat pyproject.toml 2>/dev/null | grep -E "pytest|unittest" || echo "No test framework detected"
```

2. Find existing test files for patterns:
// turbo
```
find . -name "*.test.*" -o -name "*.spec.*" -o -name "test_*" | grep -v node_modules | head -10
```

3. Read the target file that needs tests. Understand:
   - All public functions and their signatures
   - All code paths (happy path, error cases, edge cases)
   - Dependencies that need mocking

4. Check if tests already exist for this file:
// turbo
```
find . -name "*.test.*" -o -name "*.spec.*" | grep -v node_modules
```

5. Write comprehensive tests covering:
   - ✅ Happy path — normal expected behavior
   - ❌ Error cases — invalid input, missing data
   - 🔲 Edge cases — empty arrays, null, boundaries
   - 🔄 State transitions — before/after

6. Run the tests and verify they pass:
```
npm test 2>&1 || pytest 2>&1
```

7. Report test results and coverage to the user.

---
name: test
description: "Generate comprehensive tests for specified code."
disable-model-invocation: true
argument-hint: "[file-or-function]"
---

# /test — Test Generation

Generate comprehensive tests for the specified code.

## Instructions

1. **Analyze the target** from `$ARGUMENTS`:
   - Read the file or function to understand its behavior
   - Identify all code paths (happy path, error cases, edge cases)
   - Check for existing tests — extend rather than duplicate

2. **Determine test framework**:
   - Look at existing test files to identify the framework in use
   - Use the same framework, patterns, and conventions
   - Match the existing file naming convention (`.test.ts`, `_test.py`, etc.)

3. **Write tests covering**:
   - ✅ **Happy path** — normal expected behavior
   - ❌ **Error cases** — invalid input, missing data, network failures
   - 🔲 **Edge cases** — empty arrays, null values, boundary numbers
   - 🔄 **State transitions** — before/after, concurrent access
   - 📊 **Data variations** — different types, large datasets, unicode

4. **Test structure**:
   ```
   describe('[Module/Function Name]', () => {
     describe('happy path', () => {
       it('should [expected behavior]', () => { ... });
     });

     describe('error handling', () => {
       it('should [handle specific error]', () => { ... });
     });

     describe('edge cases', () => {
       it('should [handle edge case]', () => { ... });
     });
   });
   ```

5. **Quality rules**:
   - Each test should test ONE thing
   - Use descriptive test names that explain the scenario
   - Don't mock what you don't own (use fakes/stubs for external deps)
   - Tests should be deterministic — no random data, no time-dependent logic
   - Assert behavior, not implementation details

6. **Run the tests** after writing them to verify they pass.

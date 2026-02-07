---
name: debug
description: "Systematically debug an issue using structured diagnosis."
disable-model-invocation: true
argument-hint: "[error-message-or-description]"
---

# /debug — Systematic Debugging

Diagnose and fix an issue using structured problem-solving.

## Instructions

1. **Reproduce** — Understand the issue from `$ARGUMENTS`:
   - What is the expected behavior?
   - What is the actual behavior?
   - When did it start? (check recent commits with `git log --oneline -20`)

2. **Isolate** — Narrow down the root cause:
   - Search for related error messages in the codebase
   - Trace the execution path from entry point to failure
   - Check recent changes: `git log --diff-filter=M --name-only -10`
   - Look for obvious culprits: typos, missing imports, wrong variable names

3. **Diagnose** — Identify the root cause:
   - Don't fix symptoms — find the actual cause
   - Check if the issue exists in tests (and if tests are passing incorrectly)
   - Verify assumptions about data shapes, API responses, and state

4. **Fix** — Apply the minimal correct fix:
   - Change the fewest lines possible
   - Don't refactor while debugging
   - Add a comment explaining WHY this was the fix if non-obvious

5. **Verify** — Confirm the fix works:
   - Run the relevant tests
   - Manually verify the fix addresses the original issue
   - Check for regression: did the fix break anything else?

6. **Prevent** — Add safeguards:
   - Write a test that would have caught this bug
   - Add error handling if the root cause was an unhandled edge case

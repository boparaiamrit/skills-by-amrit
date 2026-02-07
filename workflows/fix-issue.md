---
description: Diagnose and fix a specific issue with minimal changes and regression testing
---

## Steps

1. Understand the issue from the user's description:
   - What behavior is expected?
   - What behavior is occurring?
   - Error messages or symptoms?

2. Locate the issue:
// turbo
```
grep -rn "[keyword-or-error]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -v node_modules | head -20
```

3. Read the affected file(s) completely to understand context.

4. Trace the root cause:
   - Follow the execution path from entry to failure
   - Check for recent changes: `git log --oneline -10 -- [file]`
   - Verify assumptions about data shapes and state

5. Apply the minimal correct fix:
   - Change the fewest lines possible
   - Don't refactor while fixing
   - Add a comment explaining why if non-obvious

6. Write a regression test that would have caught this bug.

7. Verify the fix:
// turbo
```
npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -10; echo "==="; npm run lint 2>&1 | tail -5
```

8. Check for unintended side effects — did the fix break anything?

9. Present the fix summary:
   - Root cause explanation
   - What was changed and why
   - Test added
   - Verification results

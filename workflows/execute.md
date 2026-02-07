---
description: Execute an implementation plan with pre-flight checks, task-by-task implementation, and inline verification
---

## Steps

1. Load the plan to execute:
// turbo
```
ls .planning/plans/*.md 2>/dev/null; echo "---"; cat .planning/STATE.md 2>/dev/null | head -20
```

2. Run pre-flight verification:
// turbo
```
git status --short; echo "=== BUILD ==="; npm run build 2>&1 | tail -10; echo "=== TESTS ==="; npm test 2>&1 | tail -10
```

3. If pre-flight fails, STOP. Report the failure and ask the user to fix before continuing.

4. Read the plan file and identify all tasks with their dependencies:
// turbo
```
cat .planning/plans/*.md 2>/dev/null | head -200
```

5. Group tasks into execution waves based on dependency analysis:
   - **Wave 1:** Tasks with no dependencies
   - **Wave 2:** Tasks depending on Wave 1 completion
   - Continue until all tasks are assigned to waves

6. For EACH task in the current wave:

   a. **Read task definition** from the plan — understand exactly what needs to change

   b. **Read ALL files** listed in the task — understand existing patterns before writing

   c. **Implement the task** following these rules:
      - Match existing code patterns and conventions
      - Full type safety (no `any` without justification)
      - Error handling on all paths
      - Use the project's logging pattern (not console.log)
      - No hardcoded config values
      - Functions < 50 lines each
      - Add comments only for "why", not "what"

   d. **Verify inline** after EACH task:
   // turbo
   ```
   npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -10; echo "==="; npm run lint 2>&1 | tail -5
   ```

   e. **Update `.planning/STATE.md`** with task completion status, files modified, and verification results

7. After each wave completes:
   - Run the FULL test suite (not just new tests)
   - Verify no regressions from this wave
   - Check integration points between wave tasks

8. After all waves complete, generate execution summary:
   - Total tasks completed/failed/skipped
   - Build, test, lint status
   - Files created and modified
   - Next steps: `/verify` to validate, `/commit` to save

9. Handle any failures:
   - Don't proceed to dependent tasks
   - Document the failure in STATE.md
   - Ask user: "Skip and continue", "Debug", or "Abort"

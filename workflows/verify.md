---
description: Verify implementation against plan with automated checks, plan compliance, regression testing, and UAT
---

## Steps

1. Load the plan and execution state:
// turbo
```
ls .planning/plans/*.md 2>/dev/null; echo "---"; cat .planning/STATE.md 2>/dev/null | head -30
```

2. Run automated verification suite:
// turbo
```
echo "=== BUILD ==="; npm run build 2>&1 | tail -10; echo "=== TYPES ==="; npx tsc --noEmit 2>&1 | tail -10; echo "=== TESTS ==="; npm test 2>&1 | tail -15; echo "=== LINT ==="; npm run lint 2>&1 | tail -10; echo "=== SECURITY ==="; npm audit --production 2>&1 | head -15
```

3. Record automated check results in a table (Build, Types, Tests, Lint, Security — each ✅ or ❌ with details).

4. Read the plan file and for EACH task:
   - Verify all expected files exist
   - Read the implementation and confirm it matches the task description
   - Check each acceptance criterion from the plan
   - Look for TODOs, placeholder code, hardcoded values
   - Record: ✅ Pass / ❌ Fail / ⚠️ Partial with evidence

5. Check integration between tasks:
   - Data flow: Does data flow correctly from input to output?
   - Error propagation: Do errors cascade without silent failures?
   - Edge cases: Are boundary conditions handled?

6. Run regression check:
// turbo
```
git diff --stat HEAD~1 2>/dev/null | head -20; echo "---"; git diff HEAD~1 -- '*.test.*' '*.spec.*' 2>/dev/null | grep "^-" | grep -v "^---" | head -10
```

7. Verify full test suite passes one final time:
// turbo
```
npm test 2>&1
```

8. For user-facing features, conduct conversational UAT:
   - Present ONE test at a time
   - Describe: what to check, how to test, expected result
   - Wait for user confirmation (yes/no/partially)
   - Record each test result

9. Generate verification report and save to `.planning/uat/[plan-slug]-verification.md`:
   - Overall verdict: ✅ PASS / ⚠️ PASS WITH GAPS / ❌ FAIL
   - Automated check results table
   - Per-task compliance results
   - Integration and regression results
   - UAT results if applicable
   - Gap list with severity

10. If gaps are found, create fix plans at `.planning/plans/[plan-slug]-fix.md` with specific tasks to close each gap.

11. Update `.planning/STATE.md` with verification results and date.

12. Present results to user with next steps:
    - If PASS: "Run `/commit` to save changes"
    - If GAPS: "Run `/execute [fix-plan]` to apply fixes"
    - If FAIL: "Run `/debug [issue]` to investigate"

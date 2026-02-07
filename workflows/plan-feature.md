---
description: Create a detailed implementation plan with task breakdown, dependency analysis, and execution waves
---

## Steps

1. Understand the feature/phase from the user's description:
   - What problem does this solve?
   - Who benefits?
   - What are the acceptance criteria?

2. Check for existing project state:
// turbo
```
cat .planning/PROJECT.md 2>/dev/null | head -30; echo "---"; cat .planning/ROADMAP.md 2>/dev/null | head -30; echo "---"; cat .planning/STATE.md 2>/dev/null | head -20
```

3. Research the codebase to understand existing patterns:
// turbo
```
find . -maxdepth 3 -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" | grep -v node_modules | grep -v dist | head -50
```

4. Identify all files that need to be created or modified.

5. Design the solution with architecture decisions:
   - For each significant decision, document options considered, chosen approach, and rationale
   - Document data model changes, API changes, and integration points

6. Break work into atomic, verifiable tasks. Each task must have:
   - Clear title and description
   - Files to create/modify (with specific changes)
   - Dependencies (which tasks must complete first)
   - Verification criteria (how to confirm done)
   - Effort estimate (S/M/L)
   - Risk level (Low/Med/High)

7. Group tasks into execution waves:
   - **Wave 1:** Tasks with no dependencies (can run in parallel)
   - **Wave 2:** Tasks depending only on Wave 1
   - **Wave 3:** Tasks depending on Wave 2
   - Integration testing after all waves

8. Create risk register:
   - List top 3-5 risks with likelihood, impact, and mitigation
   - List assumptions and their impact if wrong
   - List what's explicitly out of scope

9. Save the plan to `.planning/plans/[plan-slug].md` with all sections:
   - Overview, context, architecture decisions, tasks, waves, risks, verification checklist, success criteria

10. Update `.planning/STATE.md` with the new plan entry.

11. Present the plan summary to the user:
    - Total tasks and estimated effort
    - Execution wave overview
    - Top risks
    - Suggest: "Run `/execute [plan-name]` to begin implementation"

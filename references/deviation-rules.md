# Deviation Rules Reference

Protocol for handling deviations from the plan during execution.

---

## Philosophy

Plans are not sacred. Reality is. When execution reveals something the plan did not anticipate, the executor must decide: fix it silently, or stop and ask. This protocol defines the boundary.

The goal is maximum forward progress with minimum risk. Small fixes should not block execution. Large changes should not happen without permission.

---

## Auto-Fix Rules (No Permission Needed)

These deviations are fixed immediately, logged in the SUMMARY.md, and execution continues.

### Rule 1: Typos and Syntax Fixes

**Scope:** Typos in variable names, missing semicolons, incorrect import paths, minor syntax errors in the plan's task descriptions.

**Examples:**
- Plan says `userServce.ts`, clearly meant `userService.ts`
- Import path is wrong but the correct file is obvious
- Missing closing bracket in a code snippet

**Action:** Fix and log. Note what was wrong and what was corrected.

### Rule 2: Missing Critical Elements

**Scope:** Security-critical items the plan omitted that any senior engineer would add without asking.

**Examples:**
- Plan says "create login endpoint" but does not mention password hashing -- add bcrypt
- Plan creates API endpoint without input validation -- add validation
- Plan stores user data without sanitization -- add sanitization
- Missing CSRF protection on form submission

**Action:** Fix and log. These are not optional -- shipping without them would be a defect.

### Rule 3: Blocking Dependencies

**Scope:** Missing packages, missing files, broken imports that prevent the plan from executing.

**Examples:**
- Plan uses `jose` library but it is not in package.json -- install it
- Plan references a utility function that does not exist yet -- create a minimal version
- Plan imports from a path that was restructured -- update the import

**Action:** Fix and log. Execution cannot continue without these.

---

## Permission-Required Rules (Must Stop and Ask)

These deviations require explicit user approval before proceeding.

### Rule 4: Scope Changes

**Scope:** Adding features, endpoints, pages, or functionality not mentioned in the plan.

**Examples:**
- "While building the user API, I noticed we should also add an admin API"
- "This would work better with WebSockets instead of polling"
- "We should add a caching layer here"

**Action:** STOP. Present the deviation, explain why it matters, and ask for permission. The user may say "do it," "skip it," or "add it to a future plan."

### Rule 5: Architecture Changes

**Scope:** Changes to project structure, database schema modifications not in the plan, new dependencies that alter the project's technical direction.

**Examples:**
- "The planned folder structure does not work well for this -- suggesting restructure"
- "We need a new database table the plan did not anticipate"
- "Adding Redis as a dependency for session storage"
- "Switching from REST to GraphQL for this endpoint"

**Action:** STOP. Present the deviation with:
- What you want to change
- Why the current approach is problematic
- Your recommended alternative
- Impact on future plans

---

## Deviation Logging Format

Every deviation is logged in the plan's SUMMARY.md under "Deviations from Plan."

### Auto-Fix Log Entry

```markdown
**[N]. [Rule X -- Category] Brief description**
- **Found during:** Task [N] ([task name])
- **Issue:** [What was wrong]
- **Fix:** [What was done]
- **Files modified:** [file paths]
- **Verification:** [How it was verified]
- **Committed in:** [hash] (part of task commit)
```

### Permission-Required Log Entry

```markdown
**[N]. [Rule X -- Category] Brief description**
- **Found during:** Task [N] ([task name])
- **Issue:** [What was wrong]
- **Proposed fix:** [What was recommended]
- **User decision:** [Approved / Rejected / Deferred]
- **Action taken:** [What was done based on decision]
- **Files modified:** [file paths if approved]
```

---

## Decision Flowchart

```
Deviation found during execution
         |
    Is it a typo, syntax fix, or obvious correction?
    YES -> Rule 1: Auto-fix, log, continue
    NO  |
         |
    Is it a security-critical omission?
    YES -> Rule 2: Auto-fix, log, continue
    NO  |
         |
    Does it block execution (missing dependency/file)?
    YES -> Rule 3: Auto-fix, log, continue
    NO  |
         |
    Does it add new scope or features?
    YES -> Rule 4: STOP, ask permission
    NO  |
         |
    Does it change architecture or add dependencies?
    YES -> Rule 5: STOP, ask permission
    NO  |
         |
    It is probably Rule 1-3. Re-evaluate.
```

---

## When to Stop vs When to Adapt

### Stop When:
- You are about to write code for a feature not in the plan
- You want to add a new dependency that changes the project's direction
- The plan's approach is fundamentally wrong and needs redesign
- You discover a security vulnerability that requires architectural changes
- The fix would take longer than the original task

### Adapt When:
- The fix is smaller than the task itself
- Any competent engineer would make this fix without asking
- Not fixing it would ship a defect
- The fix is clearly within the plan's intent, just not explicitly stated

---

## Summary Table

| Rule | Category | Permission | Impact |
|------|----------|-----------|--------|
| 1 | Typos and syntax | Auto-fix | Minimal -- correctness fixes |
| 2 | Missing critical elements | Auto-fix | Security/quality -- would be a defect without |
| 3 | Blocking dependencies | Auto-fix | Execution -- cannot continue without |
| 4 | Scope changes | MUST ASK | Feature -- adds unplanned functionality |
| 5 | Architecture changes | MUST ASK | Structure -- alters project direction |

**Rule of thumb:** If the deviation is about making the plan WORK correctly, auto-fix it. If the deviation is about making the plan DO MORE, ask first.

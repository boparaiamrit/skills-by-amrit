---
name: execute
description: "Execute an implementation plan with wave-based parallelization, inline verification, and state tracking."
disable-model-invocation: true
argument-hint: "[plan-name or phase-number]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /execute — Plan Execution

Execute an implementation plan using structured task execution with verification at each step.

## Prerequisites
- `.planning/plans/` must contain at least one plan (created by `/plan`)
- `.planning/STATE.md` must exist (created by `/init-project`)

## Instructions

### Step 1: Load Plan

Determine which plan to execute from `$ARGUMENTS`:
- If a plan name is given: Load `.planning/plans/[plan-name].md`
- If a phase number is given: Load all plans for that phase
- If nothing is given: Check `.planning/STATE.md` for the next incomplete plan

```bash
# List available plans
ls .planning/plans/*.md 2>/dev/null

# Check current state
cat .planning/STATE.md
```

### Step 2: Pre-Flight Verification

Before executing ANY tasks:

```bash
# 1. Clean working directory?
git status --short

# 2. Project builds?
npm run build 2>&1 | tail -10

# 3. Tests pass?
npm test 2>&1 | tail -10
```

If pre-flight fails, STOP. Report the failure and suggest fixing before proceeding.

### Step 3: Analyze Dependencies and Create Waves

Read all tasks from the plan. Group into execution waves:

**Wave Rules:**
- Tasks with no dependencies → Wave 1 (can all run in parallel)
- Tasks depending only on Wave 1 → Wave 2
- And so on...
- Tasks within the same wave have NO dependencies on each other

```markdown
## Execution Plan

### Wave 1 (Parallel)
- Task 1: [title]
- Task 3: [title]

### Wave 2 (After Wave 1)
- Task 2: [title] ← depends on Task 1
- Task 4: [title] ← depends on Task 3

### Wave 3 (After Wave 2)
- Task 5: [title] ← depends on Task 2, 4
```

### Step 4: Execute Each Wave

For each wave, execute tasks sequentially (or spawn subagents for parallel execution if using Claude Code):

#### For Each Task:

**4a. Read the task definition** from the plan.

**4b. Understand context** — Read all files listed in the task. Understand existing patterns.

**4c. Implement** — Write production-quality code following:
- Match existing code patterns and conventions
- Full type safety (no `any` without justification)
- Error handling on all paths
- Logging using the project's logging pattern
- No hardcoded config values
- Functions < 50 lines each

**4d. Verify inline** — After EACH task:
```bash
# Build check
npm run build 2>&1 | tail -5

# Test check
npm test 2>&1 | tail -10

# Lint check
npm run lint 2>&1 | tail -5
```

**4e. Update state** — After EACH completed task:
Update `.planning/STATE.md`:
```markdown
### Task [N]: [Title]
- **Status:** ✅ Complete
- **Files:** [created/modified files]
- **Verified:** Build ✅, Tests ✅, Lint ✅
- **Completed:** [timestamp]
```

### Step 5: Wave Completion Check

After each wave completes:
1. Run the FULL test suite (not just the new tests)
2. Verify no regressions from the wave
3. Check that integration points between wave tasks work
4. Update `.planning/STATE.md` with wave status

### Step 6: Post-Execution Summary

After all waves complete:

```markdown
## Execution Summary

### Plan: [plan-name]
- **Total tasks:** [N]
- **Completed:** [N]
- **Failed:** [N]
- **Skipped:** [N]

### Build Status
- Compilation: ✅/❌
- Tests: ✅/❌ ([X] passing, [Y] failing)
- Lint: ✅/❌

### Files Created
- `path/to/file.ts` — [purpose]

### Files Modified
- `path/to/file.ts` — [what changed]

### Next Steps
- Run `/verify` to validate the implementation
- Run `/commit` to commit the changes
- Run `/progress` to see overall project state
```

### Step 7: Handle Failures

If a task fails:

1. **Don't proceed to dependent tasks** — They will fail too
2. **Document the failure** in `.planning/STATE.md`:
   ```markdown
   ### Task [N]: [Title]
   - **Status:** ❌ Failed
   - **Error:** [What went wrong]
   - **Attempted fixes:** [What you tried]
   - **Impact:** [Which dependent tasks are blocked]
   ```
3. **Report to the user** with options:
   - "Skip and continue" — Execute non-dependent tasks
   - "Debug" — Switch to `/debug` mode
   - "Abort" — Stop execution, preserve state

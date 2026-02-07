---
name: executing-plans
description: "Use when you have a detailed implementation plan and need to execute it task by task with verification, testing, and atomic commits."
---

# Executing Plans

## Overview

Execute implementation plans task by task. Each task gets full attention, fresh context, complete verification, and its own atomic commit. Never skip ahead. Never batch tasks.

**Core principle:** One task at a time, fully verified before moving forward.

## The Iron Law

```
NO TASK IS COMPLETE UNTIL VERIFIED. NO MOVING FORWARD UNTIL CURRENT TASK PASSES.
```

## When to Use

- After `writing-plans` produces a plan
- When given an existing implementation plan
- When a task list needs methodical execution

## The Process

### Setup

```
1. READ the entire plan first — understand scope and dependencies
2. IDENTIFY prerequisite tasks and blocking relationships
3. VERIFY project is in clean state (tests pass, clean git)
4. CREATE tracking checklist
```

### Per-Task Execution

```
For each task in the plan:

1. READ the task description completely
2. WRITE the failing test (TDD red phase)
3. RUN the test — verify it FAILS
4. WRITE minimal implementation to pass
5. RUN the test — verify it PASSES
6. REFACTOR if needed (keep tests green)
7. RUN full related test suite
8. VERIFY against task acceptance criteria
9. COMMIT with descriptive message
10. REPORT: "Task N complete. [evidence]. Moving to Task N+1."
```

### Commit Convention

```
<type>(<scope>): <description>

feat: add user registration endpoint
fix: prevent duplicate email registration
test: add validation tests for user input
refactor: extract email validation to shared util
docs: document registration API endpoint
chore: update dependencies
```

### Checkpoint Protocol

After every 3 tasks:

```
1. RUN full test suite (not just related tests)
2. REVIEW changes so far against the plan
3. REPORT progress: "Completed Tasks 1-3. [test results]. [any deviations from plan]."
4. ASK: "Continue to Tasks 4-6?"
```

## Handling Failures

### Test Won't Pass

```
1. DO NOT modify the test to pass (unless test is wrong)
2. RE-READ the plan's expected implementation
3. CHECK if previous task output is what this task expects
4. IF stuck for > 10 minutes: STOP and report the blocker
```

### Plan Doesn't Work

```
1. STOP execution
2. DOCUMENT what went wrong and why
3. REPORT: "Task N blocked because [reason]. Plan needs revision."
4. DO NOT improvise — go back to planning
```

### Deviation Needed

```
1. STOP before deviating
2. EXPLAIN what needs to change and why
3. GET approval for the deviation
4. DOCUMENT the deviation in the plan
5. THEN proceed
```

## Progress Tracking

Maintain a checklist:

```markdown
## Execution Progress

- [x] Task 1: Create user model — ✅ 3 tests pass
- [x] Task 2: Add validation — ✅ 5 tests pass
- [ ] Task 3: Create API endpoint — 🔄 In progress
- [ ] Task 4: Add error handling
- [ ] Task 5: Integration tests
```

## Red Flags — STOP

- Executing multiple tasks without commits
- Skipping tests "because it's obvious"
- Modifying tests to make them pass
- Writing code that isn't in the plan
- Moving to next task when current one has failures
- Committing untested code

## Integration

- **Before:** `writing-plans` creates the plan
- **During each task:** `test-driven-development` governs the cycle
- **After each task:** `verification-before-completion` confirms it's done
- **End of execution:** `code-review` for final review

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

## When NOT to Use

- You don't have a plan yet (use `brainstorming` → `writing-plans` first)
- Single-step bug fix (use `systematic-debugging` directly)
- Exploratory work where the path isn't clear (use `brainstorming` first)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Execute multiple tasks before committing — one task, one commit
- Say "this task is done" without running verification — run the test, read the output
- Skip writing the failing test — RED before GREEN, always
- Move to the next task when current task has warnings — clean is the standard
- Batch similar tasks "for efficiency" — each task gets its own cycle
- Modify the plan without approval — if the plan is wrong, say so, get approval, then deviate
- Skip the checkpoint protocol — every 3 tasks, full test suite + progress report
- Commit untested code — tests pass or it doesn't ship
- Say "close enough" — either it passes the acceptance criteria or it doesn't
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "These two tasks are related, I'll do them together" | Two tasks = two commits. Dependencies are handled by task ordering. |
| "The test is obvious, I'll skip RED phase" | If you didn't see it fail, you don't know it tests the right thing. |
| "I'll commit everything at the end" | One giant commit = impossible to debug, impossible to revert. |
| "The plan is slightly wrong, I'll adjust as I go" | Stop. Report the deviation. Get approval. Then proceed. |
| "This task doesn't need a test" | Every behavior needs verification. If it can't be tested, reconsider the design. |
| "I'm almost done with the next task too" | Finish current task. Commit. Then start the next one. |

## Iron Questions

```
1. Have I read the COMPLETE task description before starting?
2. Did I write the failing test FIRST?
3. Did I watch the test FAIL for the RIGHT reason (not syntax error)?
4. Is my implementation the MINIMUM code to pass the test?
5. Do ALL tests pass (not just the new one)?
6. Does this commit contain exactly ONE logical change?
7. Would reverting this commit leave the codebase in a working state?
8. Have I met ALL the task's acceptance criteria?
9. Am I at a checkpoint? (every 3 tasks → full suite + report)
10. Did I document any deviations from the plan?
```

## The Process

### Setup

```
1. READ the entire plan first — understand scope and dependencies
2. IDENTIFY prerequisite tasks and blocking relationships
3. VERIFY project is in clean state (tests pass, clean git)
4. CREATE tracking checklist
5. CONFIRM with user: "I see N tasks. Starting with Task 1. Ready?"
```

### Per-Task Execution

```
For each task in the plan:

1. READ the task description completely
2. ANNOUNCE: "Starting Task N: [description]"
3. WRITE the failing test (TDD red phase)
4. RUN the test — verify it FAILS (for the right reason)
5. WRITE minimal implementation to pass
6. RUN the test — verify it PASSES
7. REFACTOR if needed (keep tests green)
8. RUN full related test suite — no regressions
9. VERIFY against task acceptance criteria (line by line)
10. COMMIT with descriptive message
11. REPORT: "Task N complete. [evidence]. Moving to Task N+1."
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
3. IDENTIFY any deviations from the plan
4. REPORT progress:

   "Checkpoint: Tasks 1-3 complete.
   - Tests: 34/34 passing
   - Deviations: None (or: Task 2 required [change], approved by user)
   - Next: Tasks 4-6

   Continue?"

5. WAIT for confirmation before proceeding
```

## Handling Failures

### Test Won't Pass

```
1. DO NOT modify the test to pass (unless test is wrong)
2. RE-READ the plan's expected implementation
3. CHECK if previous task output is what this task expects
4. CHECK for typos, missing imports, wrong file paths
5. IF stuck for > 10 minutes: STOP and report the blocker
6. NEVER silently move on
```

### Plan Doesn't Work

```
1. STOP execution immediately
2. DOCUMENT what went wrong and why (with evidence)
3. REPORT: "Task N blocked because [reason]. Plan needs revision."
4. PROPOSE a fix to the plan
5. GET approval for the deviation
6. DO NOT improvise — go back to planning
```

### Deviation Needed

```
1. STOP before deviating
2. EXPLAIN what needs to change and why
3. PROPOSE the specific deviation
4. GET approval for the deviation
5. DOCUMENT the deviation in the plan
6. THEN proceed
```

## Progress Tracking

Maintain a checklist:

```markdown
## Execution Progress

- [x] Task 1: Create user model — ✅ 3 tests pass
- [x] Task 2: Add validation — ✅ 5 tests pass (deviation: added phone validation per user request)
- [ ] Task 3: Create API endpoint — 🔄 In progress
- [ ] Task 4: Add error handling
- [ ] Task 5: Integration tests

### Checkpoints
- [x] Checkpoint 1 (Tasks 1-3): 34/34 tests pass ✅
- [ ] Checkpoint 2 (Tasks 4-6): Pending
```

## Red Flags — STOP

- Executing multiple tasks without commits
- Skipping tests "because it's obvious"
- Modifying tests to make them pass
- Writing code that isn't in the plan (without approval)
- Moving to next task when current one has failures
- Committing untested code
- Not reporting deviations from the plan
- Saying "done" without running full test suite

## Integration

- **Before:** `writing-plans` creates the plan
- **During each task:** `test-driven-development` governs the cycle
- **After each task:** `verification-before-completion` confirms it's done
- **After all tasks:** `code-review` for final review
- **Throughout:** `git-workflow` for commit conventions

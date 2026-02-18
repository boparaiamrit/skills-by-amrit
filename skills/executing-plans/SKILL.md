---
name: executing-plans
description: "Use when you have a detailed implementation plan and need to execute it task by task with deviation handling, checkpoints, and atomic commits."
---

# Executing Plans

## Overview

Execute implementation plans task by task. Each task gets full attention, fresh context, complete verification, and its own atomic commit. The executor follows the plan as a contract — deviations require explicit approval.

**Core principle:** Plans are prompts. Follow them literally. Deviate only with permission.

## The Iron Laws

```
1. NO TASK IS COMPLETE UNTIL ALL <done> CRITERIA ARE MET
2. NO DEVIATION FROM PLAN WITHOUT EXPLICIT APPROVAL
3. NO MOVING FORWARD WHEN CONTEXT USAGE > 70% — CHECKPOINT AND HAND OFF
4. NO SKIPPING <verify> — run the command, read the output, confirm the criteria
```

## Context Engineering (CRITICAL)

You WILL experience quality degradation during long execution sessions. Plan for it.

| Context Usage | Action |
|---------------|--------|
| 0-30% | Work normally — thorough, comprehensive |
| 30-50% | Still good — maintain quality |
| 50-70% | ⚠️ Warning zone — consider checkpointing after current task |
| 70%+ | 🛑 STOP — checkpoint immediately, do NOT start new tasks |

**Self-check:** If you notice yourself:
- Skipping verification steps → STOP, you're degrading
- Writing shorter commit messages → STOP, you're degrading
- Saying "this should work" instead of running tests → STOP, you're degrading

## When to Use

- After `writing-plans` produces a plan
- When given an existing implementation plan with task anatomy
- When a task list needs methodical execution

## When NOT to Use

- No plan exists yet (use `brainstorming` → `writing-plans` first)
- Single-step bug fix (use `systematic-debugging` directly)
- Exploratory work (use `brainstorming` first)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Execute multiple tasks before committing — one task, one commit
- Say "this task is done" without running ALL <verify> commands — run them, read output
- Skip writing the failing test — RED before GREEN, always
- Move to next task when current has warnings — clean is the standard
- Batch similar tasks "for efficiency" — each task gets its own cycle
- Modify the plan without approval — deviations require the Deviation Protocol
- Skip checkpoints — every 3 tasks, MANDATORY full-suite checkpoint
- Commit untested code — tests pass or it doesn't ship
- Say "close enough" — either it meets <done> criteria or it doesn't
- Continue past 70% context usage — checkpoint and hand off
- Ignore DON'T/AVOID instructions in <action> — they exist because someone hit that bug before
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "These two tasks are related, I'll do them together" | Two tasks = two commits. Always. |
| "The test is obvious, I'll skip RED phase" | If you didn't see it fail, you don't know it tests the right thing. |
| "I'll commit everything at the end" | One giant commit = impossible to debug, impossible to revert. |
| "The plan is slightly wrong, I'll adjust as I go" | STOP. Run the Deviation Protocol. Get approval. |
| "This task doesn't need a test" | Every behavior needs verification. No exceptions. |
| "I'm almost done with the next task too" | Finish current. Commit. Then start next. |
| "I can squeeze in one more task" | If context > 70%, no you can't. Checkpoint. |

## Iron Questions

```
1. Have I read the COMPLETE task including <files>, <action>, <verify>, <done>?
2. Did I follow ALL instructions in <action>, including the DON'Ts?
3. Did I write the failing test FIRST?
4. Did I watch the test FAIL for the RIGHT reason (not syntax error)?
5. Is my implementation the MINIMUM code to pass the test?
6. Do ALL tests pass (not just the new one)?
7. Does this commit contain exactly ONE logical change?
8. Have I run EVERY <verify> command and confirmed expected output?
9. Have I checked ALL <done> criteria (every checkbox)?
10. Am I at a checkpoint? (every 3 tasks → full suite + report)
11. Am I past 70% context usage? → CHECKPOINT NOW
12. Did I document any deviation with the Deviation Protocol?
```

## The Execution Process

### Setup

```
1. READ the entire plan first — understand scope, dependencies, context budget
2. LOAD state: node planning-tools.cjs state load
3. VERIFY clean working state:
   - git status (clean working tree)
   - Build passes
   - Tests pass
4. CREATE tracking checklist in .planning/STATE.md
5. CONFIRM: "Plan has N tasks. Starting Task 1. Context is fresh. Ready?"
```

### Per-Task Execution

```
For each task in the plan:

1. READ the full task: <files>, <action>, <verify>, <done>
2. ANNOUNCE: "Starting Task N: [title]"
3. CHECK context usage — if > 70%, CHECKPOINT instead
4. READ all files listed in <files> to understand current state
5. FOLLOW <action> instructions:
   a. Note all DON'T/AVOID instructions — these are guardrails, not suggestions
   b. Write the failing test FIRST (TDD red phase)
   c. Run test — verify it FAILS for the right reason
   d. Write implementation per <action> spec
   e. Run test — verify it PASSES
   f. Refactor if needed (keep tests green)
6. RUN every <verify> command:
   a. Execute the exact command shown
   b. Compare output to expected output
   c. If output doesn't match → FIX before proceeding
7. CHECK every <done> criterion:
   a. Go through each checkbox line-by-line
   b. Verify each one with evidence
   c. If any criterion unmet → FIX before proceeding
8. COMMIT atomically:
   git add [files from <files> section]
   git commit -m "<type>(<scope>): <description>"
9. ADVANCE state: node planning-tools.cjs state advance-task
10. REPORT: "Task N complete. [evidence]. Moving to Task N+1."
```

### Commit Convention

```
<type>(<scope>): <description>

Types:
  feat:     — new feature
  fix:      — bug fix
  test:     — test addition/modification
  refactor: — code restructuring
  docs:     — documentation
  chore:    — maintenance

Examples:
  feat(auth): add JWT token generation
  fix(auth): prevent duplicate refresh tokens
  test(auth): add validation tests for login endpoint
```

## Deviation Protocol

When the plan doesn't match reality — and it will happen — follow these rules:

### Deviation Categories

| Category | Action | Requires Approval |
|----------|--------|-------------------|
| **Cosmetic** — typo in filename, import path different | Fix silently, document in commit | No |
| **Minor** — API signature slightly different, extra param needed | Document in commit, proceed | No |
| **Moderate** — Different approach needed, missing dependency | STOP. Report. Get approval | Yes |
| **Major** — Plan assumption is wrong, architecture change needed | STOP. Return to planning | Yes |

### Deviation Report Format

```markdown
## DEVIATION DETECTED — Task [N]

**Category:** [Cosmetic | Minor | Moderate | Major]
**Plan says:** [What the plan expected]
**Reality is:** [What actually happened]
**Cause:** [Why they differ]

**Proposed fix:** [How to proceed]
**Impact on future tasks:** [Will this affect Tasks N+1, N+2, etc.?]

[For Moderate/Major: Awaiting approval]
```

### Auth Gate

For **Moderate** and **Major** deviations:
1. STOP execution immediately
2. Write the deviation report
3. Present the report to the user
4. Wait for explicit approval: "Approved" or "Go back to planning"
5. Only proceed after approval is received
6. Document the approved deviation in the plan

## Checkpoint Protocol

### Mandatory Checkpoints

Checkpoints happen:
1. **Every 3 tasks** — regardless of how things are going
2. **At 50% context usage** — whether or not 3 tasks are done
3. **On any blocker** — when a task can't be completed
4. **Before starting a complex task** — if you sense risk

### Checkpoint Types

#### Standard Checkpoint (Every 3 Tasks)

```markdown
## CHECKPOINT — After Task [N]

### Completed
- [x] Task 1: [title] — ✅ verified
- [x] Task 2: [title] — ✅ verified
- [x] Task 3: [title] — ✅ verified

### Full Test Suite
```bash
npm test  # (or project's test command)
```
Result: X/Y passing, 0 failing

### Deviations
- [None, or: Task 2 required minor deviation — documented in commit abc123]

### Context Status
- Context usage: ~[X]%
- Quality assessment: [🟢 Peak | 🟡 Good | 🟠 Degrading | 🔴 Poor]

### Next
- Continue with Task 4? [Y/N]
```

#### Context Checkpoint (50-70% Context)

```markdown
## CONTEXT CHECKPOINT — Handoff Required

### Completed
- [list completed tasks with verification status]

### Remaining
- [list remaining tasks from the plan]

### For Continuation Agent
- **Start from:** Task [N]
- **Key context:** [What the next agent needs to know]
- **Watch out for:** [Gotchas discovered during execution]
- **State updated:** yes (node planning-tools.cjs state advance-task)

### Files Modified So Far
- `path/to/file.ts` — [what was done]
```

#### Blocker Checkpoint

```markdown
## BLOCKER CHECKPOINT — Task [N]

### Blocker
[What's blocking progress — exact error, missing dependency, unclear requirement]

### What I Tried
1. [Approach 1] — [Result]
2. [Approach 2] — [Result]

### Impact
- Blocks tasks: [N, N+1, ...]
- Does NOT block: [Other tasks that can proceed]

### Recommended Action
[Specific recommendation — fix the blocker, skip and return, redesign]

### State
node planning-tools.cjs state add-blocker "[description]"
```

## Progress Tracking

### During Execution

Update `.planning/STATE.md` after each task:

```bash
# Advance task counter deterministically
node planning-tools.cjs state advance-task

# After recording a metric
node planning-tools.cjs state record-metric "plan-01" "45min" "3" "5"
```

### Progress Display

```markdown
## Plan Execution: [Plan Name]

### Tasks
- [x] Task 1: Create user model — ✅ 3 tests pass (commit: abc1234)
- [x] Task 2: Add validation — ✅ 5 tests pass (deviation: minor — commit: def5678)
- [ ] Task 3: Create API endpoint — 🔄 In progress

### Checkpoints
- [x] Checkpoint 1 (Tasks 1-3): 34/34 tests pass ✅
- [ ] Checkpoint 2 (Tasks 4-6): Pending

### Deviations
- Task 2: Minor — password validation used bcrypt instead of argon2 (argon2 unavailable in runtime)

### Time
- Started: 10:15
- Task 1: 20min | Task 2: 35min | Task 3: in progress
- Total elapsed: 55min
```

## Plan Completion Protocol

When all tasks in a plan are done:

```
1. RUN full test suite — ALL tests must pass
2. RUN build — must succeed
3. RUN lint — must be clean
4. CREATE plan summary:
   .planning/plans/[phase]-[N]-SUMMARY.md
5. UPDATE state:
   node planning-tools.cjs state update-progress
6. VERIFY against plan's success criteria
7. COMMIT summary:
   git add .planning/
   git commit -m "docs: complete plan [name] execution summary"
8. REPORT final results with evidence
```

### Summary Template

```markdown
# Summary: [Plan Name]

## Results
- **Status:** ✅ Complete | ⚠️ Complete with deviations | ❌ Blocked
- **Tasks:** [N/M] completed
- **Tests:** [X] passing, [0] failing
- **Duration:** [total time]

## Key Files
- `path/to/file.ts` — [purpose]

## Deviations
- [List any deviations and their resolutions]

## Integration Notes
- [Anything the next plan or verifier should know]
```

## Gap Closure

If the summary reveals gaps (tests failing, criteria unmet):

```
1. DO NOT mark the plan as complete
2. IDENTIFY the specific gap(s)
3. CREATE a gap closure mini-plan (1-2 tasks)
4. EXECUTE the gap closure plan
5. RE-VERIFY all original criteria
6. ONLY THEN mark the plan as complete
```

## Red Flags — STOP

- Executing multiple tasks without commits
- Skipping <verify> commands "because it's obvious"
- Modifying tests to make them pass
- Writing code not in the plan (without deviation approval)
- Moving to next task with failures
- Committing untested code
- Not reporting deviations
- Continuing past 70% context usage
- Saying "done" without checking ALL <done> criteria
- Ignoring DON'T/AVOID instructions in <action>

## Integration

- **Before:** `writing-plans` creates the plan
- **During each task:** `test-driven-development` governs the TDD cycle
- **After each task:** `verification-before-completion` confirms it's done
- **After all tasks:** `code-review` for final review
- **Throughout:** `git-workflow` for commit conventions
- **Tools:** `planning-tools.cjs` for deterministic state management

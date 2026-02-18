---
description: "Execute an implementation plan with wave-based parallelization, deviation handling, checkpoints, and deterministic state tracking."
---

# `/execute` — Plan Execution

> Execute an implementation plan task by task. Uses the `executing-plans` skill with deviation protocol, checkpoint system, and `planning-tools.cjs` for state management.

## Usage

```
/execute                  — Execute the current plan (from STATE.md position)
/execute [plan-name]      — Execute a specific plan
/execute --continue       — Continue from last checkpoint
```

## Prerequisites

Before execution:
1. A plan exists in `.planning/plans/` with proper task anatomy (`<files>`, `<action>`, `<verify>`, `<done>`)
2. `.planning/STATE.md` exists (run `/init-project` first)
3. The project builds and tests pass (pre-flight check)

## Instructions

### Step 1: Load Plan and State

```bash
# Load current state
node planning-tools.cjs state load

# Verify structure
node planning-tools.cjs verify structure
```

Read the plan file. If `$ARGUMENTS` specifies a plan, load that. Otherwise, find the current plan from STATE.md position.

### Step 2: Pre-Flight Checks

// turbo
```bash
git status
```

Verify:
- [ ] Working tree is clean (no uncommitted changes)
- [ ] Build passes
- [ ] Existing tests pass

If pre-flight fails, STOP. Fix before executing.

### Step 3: Announce and Confirm

```
"Plan: [name]
Tasks: [N] tasks, estimated [M] minutes
Context budget: [2-3 tasks, should complete in ~50% context]

Starting Task 1. Ready?"
```

In auto mode (config.mode = "auto"), skip confirmation.

### Step 4: Execute Tasks

Use the `executing-plans` skill. For each task:

1. **Read** task fully: `<files>`, `<action>`, `<verify>`, `<done>`
2. **Check context** — if > 70%, checkpoint before starting
3. **Implement** per `<action>` (including DON'T/AVOID rules)
4. **Verify** by running every `<verify>` command
5. **Confirm** every `<done>` criterion
6. **Commit** atomically
7. **Advance state**:
   ```bash
   node planning-tools.cjs state advance-task
   ```

### Step 5: Handle Deviations

If the plan doesn't match reality:

| Category | Action |
|----------|--------|
| **Cosmetic** | Fix silently, note in commit |
| **Minor** | Document in commit, proceed |
| **Moderate** | STOP → Report → Get approval → Proceed |
| **Major** | STOP → Return to planning |

### Step 6: Checkpoint Every 3 Tasks

After every 3 tasks:

```bash
# Run full test suite
npm test  # or project's test command

# Record metrics
node planning-tools.cjs state record-metric "[plan]" "[duration]" "[tasks]" "[files]"
```

Report:
```
"Checkpoint: Tasks 1-3 complete.
Tests: X/Y passing
Deviations: [None or details]
Context: ~[X]% used
Continue?"
```

### Step 7: Plan Completion

When all tasks are done:

```bash
# Update progress
node planning-tools.cjs state update-progress

# Record final metrics
node planning-tools.cjs state record-metric "[plan]" "[total-duration]" "[total-tasks]" "[total-files]"
```

Create summary:
```
.planning/plans/[phase]-[N]-SUMMARY.md
```

### Step 8: Gap Closure (If Needed)

If verification reveals gaps:
1. Run `/gap-closure` workflow
2. Create mini-plan (1-2 tasks)
3. Execute and re-verify
4. Max 2 attempts, then escalate to replanning

### Step 9: Next Steps

```
"Plan [name] complete.
Results: [N/M] tasks ✅, [X] tests passing, [deviations/none]

Next:
1. Run /execute [next-plan] — Continue to next plan
2. Run /plan Phase [N+1] — Plan the next phase
3. Run /progress — View overall progress
4. Run /verify — Deep verification of completed work"
```

## Error Recovery

### Context Exhaustion
```
"Context reaching limit. Saving checkpoint.
Completed: Tasks 1-[N]
Resume with: /execute --continue"
```

### Test Failures
```
"Task [N] verification failed:
[exact error output]

Options:
1. Fix and retry current task
2. Run /gap-closure to close the gap
3. Run /plan to redesign this section"
```

### Blocker
```bash
node planning-tools.cjs state add-blocker "description"
```

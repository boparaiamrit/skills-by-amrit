---
name: loop
description: "Run a repetitive task across multiple targets with safety bounds and progress tracking."
disable-model-invocation: true
argument-hint: "[task-description] --targets [list] [--parallel] [--max N]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /loop — Bounded Repetitive Task Execution

Run a task across multiple targets (files, modules, endpoints, etc.) with safety bounds, progress tracking, and stall detection.

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--targets` | (required) | Comma-separated list or glob pattern of targets |
| `--parallel` | false | Run iterations concurrently (use with caution) |
| `--max` | 10 | Maximum number of iterations (safety bound) |
| `--continue-on-error` | false | Continue to next target if one fails |

## Instructions

### Step 1: Parse Arguments

From `$ARGUMENTS`, extract:
- **Task description:** What to do to each target
- **Targets:** List of files, modules, or items to iterate over
- **Execution mode:** Sequential (default) or parallel
- **Max iterations:** Safety cap (default: 10)
- **Error handling:** Stop on first error (default) or continue

### Step 2: Resolve Targets

If targets are a glob pattern, resolve them:

```bash
# Resolve glob to file list
ls [glob-pattern] 2>/dev/null
```

If targets are a comma-separated list, split them.

Validate:
- Target count must be > 0 (error if empty)
- Target count must be <= max iterations (warn and cap if exceeded)
- Each target must exist (if file-based)

### Step 3: Initialize State

Create `.planning/loop-state.json`:

```json
{
  "task": "[description]",
  "mode": "sequential|parallel",
  "max_iterations": 10,
  "targets": ["target1", "target2"],
  "status": "running",
  "started": "[ISO timestamp]",
  "iterations": [],
  "stall_count": 0
}
```

### Step 4: Pre-Loop Baseline

```bash
# Capture baseline test status
npm test 2>&1 | tail -5
git status --short
```

Record baseline state for stall detection.

### Step 5: Execute Loop

For each target (sequential or parallel based on mode):

1. **Announce:** "Iteration [N]/[total]: Processing [target]"

2. **Execute the task** on the current target

3. **Verify iteration:**
```bash
# Run tests after each iteration
npm test 2>&1 | tail -5
```

4. **Record iteration result in state:**
```json
{
  "target": "[name]",
  "status": "success|fail|skipped",
  "changes": ["files modified"],
  "duration": "[seconds]"
}
```

5. **Stall detection:** After each iteration, check if meaningful progress was made:
   - If no files changed and tests haven't improved for 2 consecutive iterations → STALL
   - On stall: Pause and ask the user whether to continue, skip, or abort

6. **Test regression check:** If tests fail after an iteration:
   - Stop (unless `--continue-on-error`)
   - Report which target caused the regression
   - Suggest: "Run `/debug` to investigate or revert this iteration"

### Step 6: Finalize

Update `.planning/loop-state.json`:

```json
{
  "status": "complete|aborted|stalled",
  "completed": "[ISO timestamp]",
  "summary": {
    "total": 10,
    "success": 8,
    "failed": 1,
    "skipped": 1
  }
}
```

### Step 7: Summary

```markdown
## Loop Complete

**Task:** [description]
**Mode:** Sequential / Parallel
**Targets:** [success]/[total] completed

### Results
| # | Target | Status | Changes | Duration |
|---|--------|--------|---------|----------|
| 1 | [name] | Success | 2 files | 15s |
| 2 | [name] | Success | 1 file | 8s |
| 3 | [name] | Failed | — | 5s |

### Test Status
- **Before loop:** PASS
- **After loop:** PASS/FAIL

### Next Steps
- [If all passed] Run `/quality-gate quick` then `/commit`
- [If failures] Fix failed targets or run `/debug [target]`
```

### Step 8: Update State (If .planning/ Exists)

If `.planning/STATE.md` exists, append:
```markdown
### Loop: [task]
- **Status:** [complete/aborted/stalled]
- **Targets:** [success]/[total]
- **Date:** [timestamp]
```

---
description: Run a repetitive task across multiple targets with safety bounds, stall detection, and progress tracking
---

<purpose>
Bounded iteration engine for applying a task across multiple targets (files, modules, endpoints). Supports sequential (default) and parallel execution. Safety features: max iteration cap (default 10), test pass between iterations, stall detection after 2 no-progress cycles. State tracked in .planning/loop-state.json.
</purpose>

<process>

<step name="parse_arguments">
Extract from `$ARGUMENTS`:

- **Task description** — What to do to each target (e.g., "add error handling", "migrate to new API")
- **Targets** — `--targets file1.ts,file2.ts` or `--targets "src/**/*.ts"` (glob)
- **Mode** — `--parallel` flag for concurrent execution (default: sequential)
- **Max** — `--max N` safety cap (default: 10)
- **Error handling** — `--continue-on-error` to skip failures (default: stop on first error)

Validate:
- Task description is required — error if missing
- Targets are required — error if missing
</step>

<step name="resolve_targets">
Resolve target list:

**If glob pattern:**
```bash
ls {glob_pattern} 2>/dev/null
```

**If comma-separated:** Split into array.

**If directory:** List relevant files in directory.

Validation:
- Empty target list → error: "No targets matched. Check your pattern."
- Target count > max → warn: "Found {N} targets but max is {max}. Processing first {max} only."
- File-based targets → verify each exists

Final target list: `[target1, target2, ..., targetN]`
</step>

<step name="initialize_state">
Create state file for progress tracking:

```bash
mkdir -p .planning
```

Write `.planning/loop-state.json`:
```json
{
  "task": "{description}",
  "mode": "{sequential|parallel}",
  "max_iterations": {max},
  "continue_on_error": {true|false},
  "targets": ["{target1}", "{target2}"],
  "status": "running",
  "started": "{ISO timestamp}",
  "iterations": [],
  "stall_count": 0,
  "baseline_test_status": null
}
```
</step>

<step name="capture_baseline">
Capture baseline state before any iterations:

```bash
# Test baseline
if [ -f "package.json" ]; then
  npm test 2>&1 | tail -10
elif [ -f "pyproject.toml" ]; then
  pytest 2>&1 | tail -10
elif [ -f "Cargo.toml" ]; then
  cargo test 2>&1 | tail -10
fi

# File state baseline
git status --short | wc -l
git diff --stat | tail -1
```

Record baseline in state: test pass/fail, dirty file count, diff stat.
</step>

<step name="execute_sequential" condition="mode == sequential">
For each target in order:

**1. Announce:**
```
--- Iteration {N}/{total}: {target} ---
```

**2. Execute task** — Apply the described task to the current target.

**3. Run inter-iteration tests:**
```bash
if [ -f "package.json" ]; then npm test 2>&1 | tail -10; fi
```

**4. Check for progress:**
```bash
git diff --stat | tail -1
```

If no files changed AND tests unchanged for 2 consecutive iterations:
- Increment `stall_count`
- If `stall_count >= 2`: STALL detected
  - Pause execution
  - Present: "Stall detected — no progress in last 2 iterations. Continue / Skip remaining / Abort?"
  - Wait for user input

**5. Check for regression:**
If tests fail after this iteration:
- If `continue_on_error`: Record failure, continue to next target
- Else: Stop loop, report regression

**6. Record iteration:**
```json
{
  "index": {N},
  "target": "{target}",
  "status": "success|fail|skipped",
  "files_changed": ["{list}"],
  "test_status": "pass|fail",
  "duration_seconds": {N},
  "notes": "{any observations}"
}
```

Reset `stall_count` to 0 if progress was made.
</step>

<step name="execute_parallel" condition="mode == parallel">
**Parallel execution — use with caution.**

Requirements for parallel mode:
- Targets must be independent (no shared state between iterations)
- Task must be idempotent (safe to retry)

Spawn Task subagents for each target (up to max concurrency of 3):

For each batch of 3 targets:
1. Spawn tasks in parallel
2. Wait for all to complete
3. Run tests after batch completes
4. If tests fail: stop, identify which target caused regression

Record all iteration results in state.
</step>

<step name="finalize">
Update `.planning/loop-state.json` with final status:

```json
{
  "status": "complete|aborted|stalled",
  "completed": "{ISO timestamp}",
  "summary": {
    "total": {N},
    "success": {N},
    "failed": {N},
    "skipped": {N},
    "stalls": {N}
  }
}
```

Run final test suite:
```bash
if [ -f "package.json" ]; then npm test 2>&1; fi
```
</step>

<step name="present_summary">
```
## Loop Complete

**Task:** {description}
**Mode:** {Sequential / Parallel}
**Result:** {success}/{total} targets completed

### Iteration Results
| # | Target | Status | Files Changed | Duration |
|---|--------|--------|--------------|----------|
| 1 | {target} | Success | {N} files | {N}s |
| 2 | {target} | Success | {N} files | {N}s |
| 3 | {target} | Failed | — | {N}s |

### Test Status
- **Baseline (before loop):** {PASS/FAIL}
- **Final (after loop):** {PASS/FAIL}

### Safety Events
- Stalls detected: {N}
- Regressions caught: {N}

### Next Steps
- {If all passed} Run `/quality-gate quick` then `/commit`
- {If failures} Fix failed targets: {list}
- {If stalled} Investigate targets: {list of stalled targets}
```
</step>

<step name="update_state">
If `.planning/STATE.md` exists, append:

```markdown
### Loop: {task description}
- **Status:** {complete/aborted/stalled}
- **Targets:** {success}/{total} completed
- **Tests:** {baseline} → {final}
- **Date:** {ISO timestamp}
```
</step>

</process>

<safety_bounds>
**Why safety bounds matter:**
- Unbounded loops can make hundreds of changes, making rollback painful
- Test regressions compound — catching them early is cheaper
- Stall detection prevents wasting time on targets that can't be processed

**Default limits:**
- Max 10 iterations (override with --max)
- Test pass required between iterations (sequential mode)
- Stall detection after 2 no-progress cycles
- Parallel mode capped at 3 concurrent tasks
</safety_bounds>

<success_criteria>
- [ ] Task and targets parsed from arguments
- [ ] Targets resolved (glob expanded, existence verified)
- [ ] Target count within safety bounds
- [ ] State initialized in .planning/loop-state.json
- [ ] Baseline captured (tests, file state)
- [ ] Each iteration: executed, tested, recorded
- [ ] Stall detection active (2 no-progress cycles)
- [ ] Regression detection active (test failures stop loop)
- [ ] Final state written with summary
- [ ] Summary presented with per-target results
- [ ] STATE.md updated if exists
</success_criteria>

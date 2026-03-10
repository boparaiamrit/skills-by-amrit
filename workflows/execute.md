---
description: Execute all plans in a phase using wave-based parallel execution with atomic commits and state tracking
---

<purpose>
Execute all plans in a phase using wave-based parallel execution. Orchestrator stays lean — delegates plan execution to subagents.
</purpose>

<core_principle>
Orchestrator coordinates, not executes. Each subagent loads the full execute-plan context. Orchestrator: discover plans, analyze deps, group waves, spawn agents, handle checkpoints, collect results.
</core_principle>

<required_reading>
Read STATE.md before any operation to load project context.
</required_reading>

<process>

<step name="initialize" priority="first">
Load all context in one call:

```bash
INIT=$(node scripts/planning-tools.cjs init execute-phase "${PHASE_ARG}")
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `executor_model`, `verifier_model`, `commit_docs`, `parallelization`, `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `phase_slug`, `plans`, `incomplete_plans`, `plan_count`, `incomplete_count`, `state_exists`, `roadmap_exists`, `phase_req_ids`.

**If `phase_found` is false:** Error — phase directory not found.
**If `plan_count` is 0:** Error — no plans found in phase.
**If `state_exists` is false but `.planning/` exists:** Offer reconstruct or continue.

When `parallelization` is false, plans within a wave execute sequentially.
</step>

<step name="validate_phase">
From init JSON: `phase_dir`, `plan_count`, `incomplete_count`.

Report: "Found {plan_count} plans in {phase_dir} ({incomplete_count} incomplete)"
</step>

<step name="discover_and_group_plans">
Load plan inventory with wave grouping:

```bash
PLAN_INDEX=$(node scripts/planning-tools.cjs phase-plan-index "${PHASE_NUMBER}")
```

Parse JSON for: `phase`, `plans[]` (each with `id`, `wave`, `autonomous`, `objective`, `files_modified`, `task_count`, `has_summary`), `waves` (map of wave number to plan IDs), `incomplete`, `has_checkpoints`.

**Filtering:** Skip plans where `has_summary: true` (already completed).

Report:
```
## Execution Plan

**Phase {X}: {Name}** — {total_plans} plans across {wave_count} waves

| Wave | Plans | What it builds |
|------|-------|----------------|
| 1 | 01-01, 01-02 | {from plan objectives, 3-8 words} |
| 2 | 01-03 | ... |
```
</step>

<step name="execute_waves">
Execute each wave in sequence. Within a wave: parallel if `PARALLELIZATION=true`, sequential if `false`.

**For each wave:**

1. **Describe what's being built (BEFORE spawning):**

   Read each plan's `<objective>`. Extract what's being built and why.

   ```
   ---
   ## Wave {N}

   **{Plan ID}: {Plan Name}**
   {2-3 sentences: what this builds, technical approach, why it matters}

   Spawning {count} agent(s)...
   ---
   ```

   - Bad: "Executing terrain generation plan"
   - Good: "Procedural terrain generator using Perlin noise — creates height maps, biome zones, and collision meshes. Required before vehicle physics can interact with ground."

2. **Spawn executor agents:**

   Pass paths only — executors read files themselves with their fresh context.
   This keeps orchestrator context lean (~10-15%).

   ```
   Task(
     subagent_type="executor",
     prompt="
       <objective>
       Execute plan {plan_number} of phase {phase_number}-{phase_name}.
       Commit each task atomically. Create SUMMARY.md. Update STATE.md.
       </objective>

       <files_to_read>
       Read these files at execution start using the Read tool:
       - {phase_dir}/{plan_file} (Plan)
       - .planning/STATE.md (State)
       - .planning/config.json (Config, if exists)
       - ./CLAUDE.md (Project instructions, if exists)
       </files_to_read>

       <success_criteria>
       - [ ] All tasks executed
       - [ ] Each task committed individually
       - [ ] SUMMARY.md created in plan directory
       - [ ] STATE.md updated with position and decisions
       </success_criteria>
     "
   )
   ```

3. **Wait for all agents in wave to complete.**

4. **Report completion — spot-check claims first:**

   For each SUMMARY.md:
   - Verify first 2 files from `key-files.created` exist on disk
   - Check `git log --oneline --all --grep="{phase}-{plan}"` returns at least 1 commit
   - Check for `## Self-Check: FAILED` marker

   If ANY spot-check fails: report which plan failed, ask "Retry plan?" or "Continue with remaining waves?"

   If pass:
   ```
   ---
   ## Wave {N} Complete

   **{Plan ID}: {Plan Name}**
   {What was built — from SUMMARY.md}
   {Notable deviations, if any}

   {If more waves: what this enables for next wave}
   ---
   ```

5. **Handle failures:**

   For real failures: report which plan failed, ask "Continue?" or "Stop?". If continue, dependent plans may also fail. If stop, partial completion report.

6. **Proceed to next wave.**
</step>

<step name="aggregate_results">
After all waves:

```markdown
## Phase {X}: {Name} Execution Complete

**Waves:** {N} | **Plans:** {M}/{total} complete

| Wave | Plans | Status |
|------|-------|--------|
| 1 | plan-01, plan-02 | Complete |
| 2 | plan-03 | Complete |

### Plan Details
1. **{phase}-01**: [one-liner from SUMMARY.md]
2. **{phase}-02**: [one-liner from SUMMARY.md]

### Issues Encountered
[Aggregate from SUMMARYs, or "None"]
```
</step>

<step name="regression_check">
**Run full test suite to catch cross-phase regressions.**

After completing all wave execution, run the project's full test suite — not just tests from this phase.

**Step 1: Detect test runner**
```bash
if [ -f "package.json" ]; then
  TEST_CMD="npm test"
elif [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  TEST_CMD="pytest"
elif [ -f "Cargo.toml" ]; then
  TEST_CMD="cargo test"
elif [ -f "go.mod" ]; then
  TEST_CMD="go test ./..."
else
  TEST_CMD=""
fi
```

**Step 2: Run full suite (if test runner detected)**
```bash
if [ -n "$TEST_CMD" ]; then
  echo "Running full test suite: $TEST_CMD"
  $TEST_CMD 2>&1
fi
```

**Step 3: Evaluate results**

**If no test runner detected:** Skip regression check:
```
Regression check: SKIPPED (no test runner detected)
```

**If all tests pass:**
```
Regression check: PASSED — full suite green
```

**If tests fail:**
```
REGRESSION DETECTED

{N} test(s) failed after Phase {X} execution.

Failing tests:
- {test name}: {error}

These tests passed before this phase — this is a regression.
```

**CRITICAL: Do NOT proceed to next phase with failing tests.**
Ask user: "Fix now", "Skip and continue", or "Abort".
</step>

<step name="verify_phase_goal">
Verify phase achieved its GOAL, not just completed tasks.

```
Task(
  prompt="Verify phase {phase_number} goal achievement.
Phase directory: {phase_dir}
Phase goal: {goal from ROADMAP.md}
Phase requirement IDs: {phase_req_ids}
Check must_haves against actual codebase.
Cross-reference requirement IDs from PLAN frontmatter against REQUIREMENTS.md.
Create VERIFICATION.md.",
  subagent_type="verifier"
)
```

Read VERIFICATION.md status:

| Status | Action |
|--------|--------|
| `passed` | Update roadmap, mark phase complete |
| `gaps_found` | Present gap summary, offer gap closure planning |
</step>

<step name="update_roadmap">
**Mark phase complete and update all tracking files.**

Update STATE.md to next phase. Update ROADMAP.md with completion status.

```bash
# Commit completion artifacts
git add .planning/ROADMAP.md .planning/STATE.md .planning/REQUIREMENTS.md {phase_dir}/*-VERIFICATION.md
git commit -m "docs(phase-{X}): complete phase execution"
```
</step>

<step name="offer_next">
Present next steps:

```
## Phase {X}: {Name} Complete

Next steps:
- `/plan-feature {next_phase}` — Plan next phase
- `/verify {X}` — Run verification on this phase
- `/progress` — View overall progress
```
</step>

</process>

<context_efficiency>
Orchestrator: ~10-15% context. Subagents: fresh context each. No polling (Task blocks). No context bleed.
</context_efficiency>

<failure_handling>
- **Agent fails mid-plan:** Missing SUMMARY.md — report, ask user how to proceed
- **Dependency chain breaks:** Wave 1 fails — Wave 2 dependents likely fail — user chooses attempt or skip
- **All agents in wave fail:** Systemic issue — stop, report for investigation
</failure_handling>

<resumption>
Re-run execute with phase argument — discover_plans finds completed SUMMARYs — skips them — resumes from first incomplete plan — continues wave execution.

STATE.md tracks: last completed plan, current wave, pending checkpoints.
</resumption>

<success_criteria>
- All plans in phase executed and committed
- SUMMARY.md created for each plan
- STATE.md and ROADMAP.md updated with progress
- Full test suite run after execution (cross-phase regression check)
- No regressions introduced (or user acknowledged and accepted)
- Phase verification completed (VERIFICATION.md created)
</success_criteria>

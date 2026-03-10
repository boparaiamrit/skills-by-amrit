---
description: Verify implementation against requirements with structured checks, goal-backward analysis, and VERIFICATION.md output
---

<purpose>
Validate built features against phase requirements through goal-backward verification. Check each requirement from REQUIREMENTS.md against actual implementation. Create VERIFICATION.md with pass/fail per requirement.
</purpose>

<required_reading>
Read STATE.md and ROADMAP.md before any operation to load project context.
</required_reading>

<process>

<step name="initialize" priority="first">
Load all context in one call:

```bash
INIT=$(node scripts/planning-tools.cjs init verify-work "${PHASE_ARG}")
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `verifier_model`, `checker_model`, `commit_docs`, `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `has_verification`, `plans`, `summaries`, `incomplete_plans`, `test_info`.

**If `phase_found` is false:** Error — phase not found.
**If `summaries` is empty:** Error — no execution summaries found. Run `/execute` first.
</step>

<step name="load_requirements">
Load phase requirements for verification:

1. Read ROADMAP.md — extract phase goal, success criteria, mapped requirement IDs
2. Read REQUIREMENTS.md — load full descriptions for each mapped REQ-ID
3. Read SUMMARY.md files — understand what was actually built
4. Read PLAN.md files — extract must_haves (truths, artifacts, key_links)

Build verification matrix:
```
| REQ-ID | Requirement | Plan | Must-Have Truth | Status |
|--------|-------------|------|-----------------|--------|
| AUTH-01 | User can create account | 01 | Account creation works | Pending |
| AUTH-02 | User can log in | 01 | Login returns session | Pending |
```
</step>

<step name="run_automated_checks">
Run all automated verification first:

**Step 1: Detect test runner and run full suite**
```bash
if [ -f "package.json" ]; then
  npm run build 2>&1 | tail -10
  npm test 2>&1
  npx tsc --noEmit 2>&1 | tail -10
elif [ -f "pyproject.toml" ] || [ -f "setup.py" ]; then
  pytest 2>&1
elif [ -f "Cargo.toml" ]; then
  cargo build 2>&1 | tail -10
  cargo test 2>&1
elif [ -f "go.mod" ]; then
  go build ./... 2>&1 | tail -10
  go test ./... 2>&1
fi
```

**Step 2: Record results**
```markdown
## Automated Checks
| Check | Status | Details |
|-------|--------|---------|
| Build | Pass/Fail | [summary] |
| Tests | Pass/Fail | [X passing, Y failing] |
| Types | Pass/Fail | [summary] |
| Lint | Pass/Fail | [summary] |
```
</step>

<step name="verify_requirements">
**Goal-backward verification: Start from success criteria, trace back to evidence.**

For EACH requirement mapped to this phase:

1. **Extract the truth** — What must be TRUE for this requirement to be satisfied?
2. **Find evidence** — Does the codebase actually implement this truth?
   - Check file existence: `ls -la [expected_file]`
   - Check implementation content: Read the file, verify logic is correct
   - Run verification commands from PLAN.md tasks
3. **Check wiring** — Are artifacts connected (not just created in isolation)?
   - Component calls API? API queries database? Form has submit handler?
4. **Record result** — Pass (with evidence) or Fail (with specific gap)

```markdown
### REQ-ID: {requirement description}

**Truth:** {what must be true}
**Evidence:**
- File exists: {path} — [found/missing]
- Implementation: {what was checked} — [correct/incorrect/missing]
- Wiring: {connection checked} — [connected/disconnected]
**Verification command:** {command from plan}
**Result:** PASS / FAIL
**Gap (if fail):** {specific gap description}
```
</step>

<step name="check_integration">
Beyond individual requirements, verify integration:

1. **Data flow** — Does data flow correctly through the system?
2. **Error propagation** — Do errors cascade without silent failures?
3. **Edge cases** — Are boundary conditions handled?
4. **Configuration** — Are all config values correct and not hardcoded?
5. **Dependencies** — Are all dependencies declared and compatible?

```bash
# Run full test suite one final time
npm test 2>&1
```
</step>

<step name="create_verification_md">
Create VERIFICATION.md in the phase directory:

```markdown
---
status: passed | gaps_found
phase: {phase_number}-{phase_name}
verified: {ISO timestamp}
requirements_checked: {count}
requirements_passed: {count}
requirements_failed: {count}
---

# Phase {X}: {Name} — Verification Report

## Summary

**Overall: PASS / GAPS FOUND**
**Requirements:** {passed}/{total} verified
**Automated checks:** {status}

## Requirement Verification

### {REQ-ID}: {requirement}
- **Status:** PASS / FAIL
- **Evidence:** {what was checked and found}
- **Gap:** {if fail, what's missing}

### {REQ-ID}: {requirement}
- **Status:** PASS / FAIL
- **Evidence:** {what was checked and found}

[... all requirements ...]

## Automated Check Results

| Check | Status | Details |
|-------|--------|---------|
| Build | Pass/Fail | [summary] |
| Tests | Pass/Fail | [X passing, Y failing] |
| Types | Pass/Fail | [summary] |

## Integration Results

[Cross-component verification results]

## Gaps

[If any requirements failed — structured list]

### Gap 1: {REQ-ID} — {title}
- **Expected:** {what should work}
- **Actual:** {what's broken or missing}
- **Severity:** Critical / High / Medium / Low
- **Root cause:** {if identifiable}

## Human Verification Needed

[Items that require manual testing — UI flows, visual checks, etc.]
```

Write to `{phase_dir}/{phase_num}-VERIFICATION.md`
</step>

<step name="update_state">
Update STATE.md with verification results:

```bash
git add {phase_dir}/*-VERIFICATION.md .planning/STATE.md
git commit -m "docs(phase-{X}): verification complete — {passed}/{total} requirements verified"
```
</step>

<step name="present_results">
**If all passed:**
```
## Phase {X}: {Name} — Verification PASSED

All {N} requirements verified against implementation.

| REQ-ID | Requirement | Status |
|--------|-------------|--------|
| {id} | {description} | PASS |

Automated checks: All green
Regression check: PASSED

Next: `/commit` or proceed to next phase
```

**If gaps found:**
```
## Phase {X}: {Name} — Gaps Found

**Score:** {passed}/{total} requirements verified

### Gaps
{gap summaries}

### Next Steps
- `/plan-feature {X} --gaps` — Plan gap closure
- `/execute {X} --gaps-only` — Execute gap closure plans
```
</step>

</process>

<goal_backward_methodology>
**Traditional verification:** "Did we complete all tasks?" (activity-based)
**Goal-backward verification:** "Does the phase goal work?" (outcome-based)

A task can be "complete" while the goal is unmet:
- Auth endpoint exists but password hashing is missing
- Component renders but doesn't call the API
- Tests pass but don't test the actual behavior

Start from: "What must be TRUE for Phase X to be done?"
Trace back: "What evidence proves each truth?"
Verify: "Does the evidence actually exist in the codebase?"
</goal_backward_methodology>

<success_criteria>
- [ ] Phase context loaded (goal, requirements, summaries)
- [ ] All automated checks run (build, test, types, lint)
- [ ] Each requirement checked against actual implementation
- [ ] Goal-backward analysis: truths traced to evidence
- [ ] Integration verified (data flow, error propagation, wiring)
- [ ] VERIFICATION.md created with structured pass/fail per requirement
- [ ] STATE.md updated with verification results
- [ ] Committed verification artifacts
- [ ] User presented with clear next steps
</success_criteria>

# VERIFICATION.md Template

Template for `.planning/phases/XX-name/{phase_num}-VERIFICATION.md` -- phase goal verification results.

---

## File Template

```markdown
---
phase: {{PHASE_NAME}}
verified_by: "{{VERIFIED_BY}}"
status: passed | gaps_found | human_needed
coverage_score: "{{SCORE_PASSED}}/{{SCORE_TOTAL}}"
verified_at: "{{VERIFIED_AT}}"
---

# Phase {{PHASE_NUMBER}}: {{PHASE_DISPLAY_NAME}} -- Verification Report

**Phase Goal:** [Goal from ROADMAP.md]
**Verified:** {{VERIFIED_AT}}
**Status:** [passed / gaps_found / human_needed]

## Requirements Checked

| ID | Requirement | Status | Evidence |
|----|-------------|--------|----------|
| [REQ-01] | [Description] | PASS | [What confirmed it] |
| [REQ-02] | [Description] | FAIL | [What is wrong] |
| [REQ-03] | [Description] | UNCERTAIN | [Why can't verify] |

**Score:** {{SCORE_PASSED}}/{{SCORE_TOTAL}} requirements satisfied

## Observable Truths

| # | Truth (from must_haves) | Status | Evidence |
|---|------------------------|--------|----------|
| 1 | [Observable behavior] | VERIFIED | [What confirmed it] |
| 2 | [Observable behavior] | FAILED | [What is wrong] |
| 3 | [Observable behavior] | UNCERTAIN | [Why can't verify] |

## Artifact Verification

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/path/file.ts` | [What it should provide] | EXISTS + SUBSTANTIVE | [Exports X, N lines, no stubs] |
| `src/path/other.ts` | [What it should provide] | STUB | [File exists but placeholder] |
| `src/path/missing.ts` | [What it should provide] | MISSING | [File does not exist] |

**Artifacts:** [N]/[M] verified

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| [Component] | [API endpoint] | [fetch/import] | WIRED | [Line N: code that connects] |
| [API route] | [Database] | [ORM call] | NOT WIRED | [Returns hardcoded data] |

**Wiring:** [N]/[M] connections verified

## Test Results

- [ ] Unit tests: [X passed, Y failed, Z skipped]
- [ ] Integration tests: [X passed, Y failed]
- [ ] Build check: [PASSED / FAILED]
- [ ] Type check: [PASSED / FAILED]

## Manual Verification

[If no manual verification needed:]
None -- all verifiable items checked programmatically.

[If manual verification needed:]

### 1. [Test Name]
**Test:** [What to do]
**Expected:** [What should happen]
**Why manual:** [Why can't verify programmatically]

## Gaps Found

[If no gaps:]
**No gaps found.** Phase goal achieved. Ready to proceed.

[If gaps found:]

### Critical Gaps (Block Progress)

1. **[Gap name]**
   - Missing: [what's missing]
   - Impact: [why this blocks the goal]
   - Fix: [what needs to happen]

### Non-Critical Gaps (Can Defer)

1. **[Gap name]**
   - Issue: [what's wrong]
   - Impact: [limited impact because...]
   - Recommendation: [fix now or defer]

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| [path] | [N] | [e.g., `// TODO: implement`] | Blocker / Warning / Info | [What it means] |

## Recommended Fix Plans

[If gaps found, generate fix plan recommendations:]

### {phase}-{next}-PLAN.md: [Fix Name]
**Objective:** [What this fixes]
**Tasks:**
1. [Task to fix gap]
2. [Verification task]
**Estimated scope:** Small / Medium

---

## Verification Metadata

**Verification approach:** Goal-backward (derived from phase goal)
**Must-haves source:** PLAN.md frontmatter
**Automated checks:** [N] passed, [M] failed
**Manual checks required:** [N]
**Total verification time:** [duration]

---
*Verified: {{VERIFIED_AT}}*
*Verifier: {{VERIFIED_BY}}*
```

---

## Guidelines

**Status values:**
- `passed` -- All must-haves verified, no blockers
- `gaps_found` -- One or more critical gaps found
- `human_needed` -- Automated checks pass but human verification required

**Evidence types:**
- EXISTS: "File at path, exports X"
- SUBSTANTIVE: "N lines, has patterns X, Y, Z"
- WIRED: "Line N: code that connects A to B"
- FAILED: "Missing because X" or "Stub because Y"

**Severity levels:**
- Blocker: Prevents goal achievement, must fix
- Warning: Indicates incomplete but does not block
- Info: Notable but not problematic

**Fix plan generation:**
- Only generate if gaps_found
- Group related fixes into single plans
- Keep to 2-3 tasks per plan
- Include verification task in each plan

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PHASE_NAME}}` | Plan frontmatter | Phase identifier |
| `{{PHASE_NUMBER}}` | Derived | Numeric phase |
| `{{PHASE_DISPLAY_NAME}}` | Roadmap | Human-readable phase name |
| `{{VERIFIED_BY}}` | Execution | Who/what verified (e.g., "Claude (subagent)") |
| `{{VERIFIED_AT}}` | System | ISO timestamp |
| `{{SCORE_PASSED}}` | Verification | Number of checks passed |
| `{{SCORE_TOTAL}}` | Verification | Total number of checks |

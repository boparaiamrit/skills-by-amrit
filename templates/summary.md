# SUMMARY.md Template

Template for `.planning/phases/XX-name/{phase}-{plan}-SUMMARY.md` -- execution results documentation.

---

## File Template

```markdown
---
phase: {{PHASE_NAME}}
plan: {{PLAN_NUMBER}}
status: complete
started_at: "{{STARTED_AT}}"
completed_at: "{{COMPLETED_AT}}"
deviations_count: 0
duration: "{{DURATION}}"
tasks_completed: {{TASK_COUNT}}
files_modified: {{FILE_COUNT}}
requirements_completed: []
---

# Phase {{PHASE_NUMBER}}: {{PHASE_DISPLAY_NAME}} -- Plan {{PLAN_NUMBER}} Summary

**[Substantive one-liner describing outcome -- NOT "phase complete" or "implementation finished"]**

## Objective

[From the plan's <objective> section -- what this plan set out to accomplish]

## What Was Done

### Accomplishments
- [Most important outcome]
- [Second key accomplishment]
- [Third if applicable]

### Files Created/Modified
- `path/to/file.ts` -- What it does
- `path/to/another.ts` -- What it does

## Deviations

| # | Task | Expected | Actual | Reason | Rule |
|---|------|----------|--------|--------|------|
| - | - | - | - | - | - |

[If no deviations: "None -- plan executed exactly as written"]

[If deviations occurred:]

### Auto-fixed Issues

**1. [Rule X -- Category] Brief description**
- **Found during:** Task [N] ([task name])
- **Issue:** [What was wrong]
- **Fix:** [What was done]
- **Files modified:** [file paths]
- **Verification:** [How it was verified]

---

**Total deviations:** [N] auto-fixed ([breakdown by rule])
**Impact on plan:** [Brief assessment -- e.g., "All auto-fixes necessary for correctness. No scope creep."]

## Verification Results

- [ ] [Verification check 1] -- PASSED / FAILED
- [ ] [Verification check 2] -- PASSED / FAILED
- [ ] [Build/type check] -- PASSED / FAILED

## Commits

Each task was committed atomically:

1. **Task 1: [task name]** -- `abc123f` (feat/fix/test/refactor)
2. **Task 2: [task name]** -- `def456g` (feat/fix/test/refactor)

**Plan metadata:** `lmn012o` (docs: complete plan)

## Decisions Made

[Key decisions with brief rationale, or "None -- followed plan as specified"]

## Issues Encountered

[Problems and how they were resolved, or "None"]

## Next Readiness

[What's ready for next plan/phase]
[Any blockers or concerns]

---
*Phase: {{PHASE_NAME}}*
*Completed: {{COMPLETED_AT}}*
```

---

## Guidelines

**One-liner must be substantive:**

Good:
- "JWT auth with refresh rotation using jose library"
- "Prisma schema with User, Session, and Product models"
- "Dashboard with real-time metrics via Server-Sent Events"

Bad:
- "Phase complete"
- "Authentication implemented"
- "All tasks done"

**Deviations section:**
- Document any unplanned work using deviation rules
- Auto-fixed issues (Rules 1-3): documented but no permission needed
- Permission-required deviations (Rules 4-5): should have been approved during execution

**After creation:**
- STATE.md updated with position, decisions, issues
- ROADMAP.md progress table updated

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PHASE_NAME}}` | Plan frontmatter | Phase identifier |
| `{{PLAN_NUMBER}}` | Plan frontmatter | Plan number |
| `{{STARTED_AT}}` | Execution start | ISO timestamp |
| `{{COMPLETED_AT}}` | Execution end | ISO timestamp |
| `{{DURATION}}` | Calculated | Human-readable duration |
| `{{TASK_COUNT}}` | Execution | Number of tasks completed |
| `{{FILE_COUNT}}` | Execution | Number of files modified |
| `{{PHASE_NUMBER}}` | Derived | Numeric phase (e.g., `1`) |
| `{{PHASE_DISPLAY_NAME}}` | Roadmap | Human-readable phase name |

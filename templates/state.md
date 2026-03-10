# STATE.md Template

Template for `.planning/STATE.md` -- the project's living memory and session bridge.

---

## File Template

```markdown
---
project_name: "{{PROJECT_NAME}}"
status: active
current_phase: {{CURRENT_PHASE}}
current_plan: {{CURRENT_PLAN}}
milestone: "{{MILESTONE}}"
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated {{LAST_PROJECT_UPDATE}})

**Core value:** [One-liner from PROJECT.md Core Value section]
**Current focus:** [Current phase name]

## Current Position

Phase: [X] of [Y] ([Phase name])
Plan: [A] of [B] in current phase
Status: [Ready to plan / Planning / Ready to execute / In progress / Phase complete]
Last activity: [YYYY-MM-DD] -- [What happened]

Progress: [----------] 0%

## Quick Tasks Completed

| # | Date | Task | Result |
|---|------|------|--------|
| - | - | - | - |

## Performance Metrics

**Velocity:**
- Total plans completed: [N]
- Average duration: [X] min
- Total execution time: [X.X] hours

**By Phase:**

| Phase | Plans | Total Time | Avg/Plan |
|-------|-------|------------|----------|
| - | - | - | - |

## Completed Phases

| Phase | Name | Plans | Completed | Duration |
|-------|------|-------|-----------|----------|
| - | - | - | - | - |

## Decisions Made

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Phase X]: [Decision summary]

## Blockers

[Issues that affect future work]

None yet.

## Session History

| Date | Session | Activity | Stopped At |
|------|---------|----------|------------|
| - | - | - | - |

Last session: [YYYY-MM-DD HH:MM]
Stopped at: [Description of last completed action]
Resume file: [Path to continue file if exists, otherwise "None"]

---
*Last updated: {{CREATED_AT}} after project initialization*
```

---

## Guidelines

**Purpose:** STATE.md is the project's short-term memory spanning all phases and sessions. It solves the cold-start problem -- new sessions read STATE.md first and instantly know where things stand.

**Size constraint:** Keep STATE.md under 100 lines. It is a DIGEST, not an archive.
- Keep only 3-5 recent decisions (full log in PROJECT.md)
- Keep only active blockers, remove resolved ones
- Quick tasks table: last 10 entries max

**Reading:** First step of every workflow.
**Writing:** After every significant action (plan completion, phase transition, key decision).

**Sections:**
- **Project Reference:** Points to PROJECT.md for full context
- **Current Position:** Where we are right now with progress bar
- **Quick Tasks:** One-off tasks completed outside phase workflow
- **Performance Metrics:** Velocity tracking for estimation
- **Completed Phases:** Historical record
- **Decisions Made:** Recent decisions for quick access
- **Blockers:** Active issues affecting future work
- **Session History:** Enables instant resumption

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PROJECT_NAME}}` | PROJECT.md | Name of the project |
| `{{CURRENT_PHASE}}` | Execution state | Current phase number |
| `{{CURRENT_PLAN}}` | Execution state | Current plan number |
| `{{MILESTONE}}` | Roadmap | Current milestone name |
| `{{LAST_PROJECT_UPDATE}}` | PROJECT.md | Last update date |
| `{{CREATED_AT}}` | System | ISO date of creation |

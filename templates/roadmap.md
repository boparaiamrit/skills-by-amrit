# ROADMAP.md Template

Template for `.planning/ROADMAP.md` -- the project's phase execution plan.

---

## File Template

```markdown
---
milestone: "{{MILESTONE}}"
total_phases: {{TOTAL_PHASES}}
---

# Roadmap: {{PROJECT_NAME}}

## Overview

[One paragraph describing the journey from start to finish. What gets built, in what order, and why that order.]

## Phases

| # | Phase | Status | Description |
|---|-------|--------|-------------|
| 1 | [Name] | Not started | [One-line description] |
| 2 | [Name] | Not started | [One-line description] |
| 3 | [Name] | Not started | [One-line description] |
| 4 | [Name] | Not started | [One-line description] |

## Phase Details

### Phase 1: [Name]
**Goal:** [What this phase delivers]
**Depends on:** Nothing (first phase)
**Requirements:** [REQ-01, REQ-02, REQ-03]
**Success Criteria** (what must be TRUE):
  1. [Observable behavior from user perspective]
  2. [Observable behavior from user perspective]
  3. [Observable behavior from user perspective]
**Plans:** [Number of plans, e.g., "3 plans" or "TBD"]

Plans:
- [ ] 01-01: [Brief description of first plan]
- [ ] 01-02: [Brief description of second plan]
- [ ] 01-03: [Brief description of third plan]

### Phase 2: [Name]
**Goal:** [What this phase delivers]
**Depends on:** Phase 1
**Requirements:** [REQ-04, REQ-05]
**Success Criteria** (what must be TRUE):
  1. [Observable behavior from user perspective]
  2. [Observable behavior from user perspective]
**Plans:** [Number of plans]

Plans:
- [ ] 02-01: [Brief description]
- [ ] 02-02: [Brief description]

### Phase 3: [Name]
**Goal:** [What this phase delivers]
**Depends on:** Phase 2
**Requirements:** [REQ-06, REQ-07, REQ-08]
**Success Criteria** (what must be TRUE):
  1. [Observable behavior from user perspective]
  2. [Observable behavior from user perspective]
  3. [Observable behavior from user perspective]
**Plans:** [Number of plans]

Plans:
- [ ] 03-01: [Brief description]
- [ ] 03-02: [Brief description]

### Phase 4: [Name]
**Goal:** [What this phase delivers]
**Depends on:** Phase 3
**Requirements:** [REQ-09, REQ-10]
**Success Criteria** (what must be TRUE):
  1. [Observable behavior from user perspective]
  2. [Observable behavior from user perspective]
**Plans:** [Number of plans]

Plans:
- [ ] 04-01: [Brief description]

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. [Name] | 0/3 | Not started | - |
| 2. [Name] | 0/2 | Not started | - |
| 3. [Name] | 0/2 | Not started | - |
| 4. [Name] | 0/1 | Not started | - |

---
*Roadmap created: {{CREATED_AT}}*
*Last updated: {{CREATED_AT}} after initial planning*
```

---

## Guidelines

**Phase count:** Depends on project scope (3-5 for small, 5-8 for standard, 8-12 for large).

**Each phase delivers something coherent.** A phase is not a layer (all models, then all APIs). It is a vertical slice or a meaningful capability.

**Success criteria:**
- 2-5 observable behaviors per phase (from user's perspective)
- Cross-checked against requirements during roadmap creation
- Verified after execution

**Plan sizing:**
- Each phase has 1+ plans
- Split if >3 tasks or multiple subsystems
- Plans use naming: `{phase}-{plan}-PLAN.md` (e.g., `01-02-PLAN.md`)

**Status values:**
- `Not started` -- Haven't begun
- `In progress` -- Currently working
- `Complete` -- Done (add completion date)
- `Deferred` -- Pushed to later (with reason)

**After milestones ship:**
- Collapse completed phases in summary
- Add new phases for upcoming work
- Keep continuous phase numbering (never restart at 01)

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{MILESTONE}}` | User input | Milestone name (e.g., "v1.0 MVP") |
| `{{TOTAL_PHASES}}` | Planning | Number of phases in roadmap |
| `{{PROJECT_NAME}}` | PROJECT.md | Name of the project |
| `{{CREATED_AT}}` | System | ISO date of creation |

---
description: Initialize a new project with compound init, structured context gathering, requirements, roadmap, and .planning/ directory
---

<purpose>
Initialize a new project through unified flow: proposal-first discovery, requirements, roadmap. Makes smart recommendations and lets the user override. One workflow takes you from idea to ready-for-planning with minimal friction.
</purpose>

<process>

<step name="initialize" priority="first">
**MANDATORY FIRST STEP — Execute these checks before ANY user interaction:**

```bash
INIT=$(node scripts/planning-tools.cjs init new-project)
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `project_exists`, `has_codebase_map`, `planning_exists`, `has_existing_code`, `has_package_file`, `is_brownfield`, `needs_codebase_map`, `has_git`, `project_path`.

**If `project_exists` is true:** Error — project already initialized. Use `/progress`.

**If `has_git` is false:** Initialize git:
```bash
git init
```
</step>

<step name="create_planning_directory">
Create the .planning/ directory structure:

```bash
mkdir -p .planning/plans .planning/research .planning/debug .planning/phases
```
</step>

<step name="brownfield_check">
**If `needs_codebase_map` is true** (existing code detected but no codebase map):

Ask the user:
- "Map codebase first" — Run `/codebase-map` to understand existing architecture
- "Skip mapping" — Proceed with project initialization

**If skip or not brownfield:** Continue to project proposal.
</step>

<step name="project_proposal">
**Open the conversation:**

Ask: "What do you want to build?"

Wait for response. Silently read any available context (README.md, package.json, existing files).

**Generate Project Proposal:**

```
# Project Proposal

## What I Understand
[Synthesize from response + context clues from existing files.
Restate the core idea, target users, and key problem being solved.]

## Recommended Approach

### Decisions Made (auto-decided)
- [Decision]: [One-line reason]

### Recommendations (override if you disagree)
- [Topic]: Going with [X] because [reason]. Alt: [Y] if [condition].

### Input Needed (max 5 questions)
- [Question]: My recommendation: [X] because [reason].
```

**Question budget:** Max 5 must-ask items. Everything else auto-decided or overridable recommendation.

Present proposal. If user wants to override, incorporate feedback and re-present. Loop until approved.
</step>

<step name="write_project_md">
Synthesize all context into `.planning/PROJECT.md`:

```markdown
# [Project Name]

## Vision
[3 sentences describing what this project is and why it matters]

## Goals
1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

## Target Users
- **Primary:** [who]
- **Secondary:** [who]

## Tech Stack
- **Language:** [X]
- **Framework:** [X]
- **Database:** [X]
- **Infrastructure:** [X]
- **Key Libraries:** [X, Y, Z]

## Constraints
- [Timeline, quality priorities, non-negotiables]

## Requirements

### Validated
(None yet — ship to validate)

### Active
- [ ] [Requirement 1]
- [ ] [Requirement 2]

### Out of Scope
- [Exclusion 1] — [why]

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| [Choice] | [Why] | Pending |

---
*Last updated: [date] after initialization*
```

**Commit:**
```bash
git add .planning/PROJECT.md
git commit -m "docs: initialize project"
```
</step>

<step name="workflow_config">
**Generate workflow configuration proposal based on project context:**

```
## Recommended Workflow Configuration

| Setting | Value | Why |
|---------|-------|-----|
| Granularity | Coarse | [reason] |
| Execution | Parallel | [reason] |
| Git Tracking | Yes | [reason] |
| Verifier | Yes | [reason] |
| Model Profile | Balanced | [reason] |
```

Present to user. If they want to override, incorporate changes.

**Create `.planning/config.json`:**

```json
{
  "granularity": "coarse|standard|fine",
  "parallelization": true,
  "commit_docs": true,
  "model_profile": "balanced",
  "workflow": {
    "research": true,
    "plan_check": true,
    "verifier": true
  }
}
```

**If commit_docs = No:** Add `.planning/` to `.gitignore`.

**Commit:**
```bash
git add .planning/config.json
git commit -m "chore: add project config"
```
</step>

<step name="define_requirements">
**Generate requirements proposal based on PROJECT.md and domain knowledge:**

```
## Proposed v1 Requirements

### [Category 1]
**Included (table stakes):**
- [Feature A] — Users expect this

**Included (from your description):**
- [Feature C] — You mentioned this

**Deferred to v2:**
- [Feature D] — Nice but not essential
```

Present to user. Loop until approved.

**Create `.planning/REQUIREMENTS.md`:**

```markdown
# Requirements

## v1 Requirements

### [Category]
- [ ] **[CAT]-01**: [Specific, testable, user-centric requirement]
- [ ] **[CAT]-02**: [Specific, testable, user-centric requirement]

## v2 Requirements (Deferred)
- [Feature] — [why deferred]

## Out of Scope
- [Thing] — [why excluded]

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| [filled by roadmap] |
```

**REQ-ID format:** `[CATEGORY]-[NUMBER]` (AUTH-01, CONTENT-02)

**Requirement quality criteria:**
- Specific and testable: "User can reset password via email link"
- User-centric: "User can X" (not "System does Y")
- Atomic: One capability per requirement

**Commit:**
```bash
git add .planning/REQUIREMENTS.md
git commit -m "docs: define v1 requirements"
```
</step>

<step name="create_roadmap">
**Create ROADMAP.md with phased delivery:**

Read PROJECT.md and REQUIREMENTS.md. Derive phases from requirements.

```markdown
# Roadmap

## Progress

| # | Phase | Goal | Requirements | Status |
|---|-------|------|--------------|--------|
| 1 | [Name] | [Goal] | [REQ-IDs] | Pending |
| 2 | [Name] | [Goal] | [REQ-IDs] | Pending |

## Phase Details

### Phase 1: [Name]
**Goal:** [What this phase achieves]
**Requirements:** [REQ-IDs]
**Success Criteria:**
1. [Observable user behavior 1]
2. [Observable user behavior 2]
3. [Observable user behavior 3]

### Phase 2: [Name]
**Goal:** [What this phase achieves]
**Requirements:** [REQ-IDs]
**Success Criteria:**
1. [criterion]
2. [criterion]
```

**Rules:**
- Every v1 requirement maps to exactly one phase
- 2-5 success criteria per phase (observable user behaviors)
- 100% requirement coverage verified

Present to user. If they want to adjust, incorporate changes.

**Create `.planning/STATE.md`:**

```markdown
# Project State

**Current Phase:** 1
**Status:** Ready to Plan

## Progress
| # | Phase | Plans | Status |
|---|-------|-------|--------|
| 1 | [Name] | 0/0 | Pending |

## Quick Tasks
| Date | Task | Status | Files |
|------|------|--------|-------|

## Decisions
[None yet]

## Blockers
[None]

---
*Last updated: [date]*
```

**Commit:**
```bash
git add .planning/ROADMAP.md .planning/STATE.md .planning/REQUIREMENTS.md
git commit -m "docs: create roadmap ({N} phases)"
```
</step>

<step name="completion">
Present completion summary:

```
## Project Initialized

**[Project Name]**

| Artifact | Location |
|----------|----------|
| Project | `.planning/PROJECT.md` |
| Config | `.planning/config.json` |
| Requirements | `.planning/REQUIREMENTS.md` |
| Roadmap | `.planning/ROADMAP.md` |
| State | `.planning/STATE.md` |

**{N} phases** | **{X} requirements** | Ready to build

---

## Next Up

**Phase 1: [Phase Name]** — [Goal]

`/discuss 1` — gather context and clarify approach
`/plan-feature 1` — skip discussion, plan directly
```
</step>

</process>

<success_criteria>
- [ ] .planning/ directory created
- [ ] Git repo initialized (if needed)
- [ ] Brownfield detection completed
- [ ] Project proposal generated with max 5 must-ask questions
- [ ] User approved proposal
- [ ] PROJECT.md captures full context — committed
- [ ] config.json with workflow preferences — committed
- [ ] REQUIREMENTS.md with REQ-IDs — committed
- [ ] ROADMAP.md with phases, requirement mappings, success criteria
- [ ] STATE.md initialized
- [ ] REQUIREMENTS.md traceability section prepared
- [ ] User knows next step is `/discuss 1` or `/plan-feature 1`
- [ ] Atomic commits: each artifact committed immediately
</success_criteria>

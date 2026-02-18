---
name: init-project
description: "Initialize a new project with deep context gathering, planning structure, and roadmap."
disable-model-invocation: true
argument-hint: "[project-description]"
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - WebSearch
  - Task
---

# /init-project — Project Initialization

Initialize a new project through structured context gathering: questioning → research → requirements → roadmap → state. Uses `planning-tools.cjs` for deterministic state setup.

## What This Creates

```
.planning/
├── PROJECT.md        — Project context, goals, constraints, tech stack
├── REQUIREMENTS.md   — Scoped requirements with acceptance criteria
├── ROADMAP.md        — Phase structure with dependencies and estimates
├── STATE.md          — Current state tracker (living document)
├── MEMORY.md         — Persistent project brain (~300 lines max)
├── config.json       — Workflow preferences and execution config
├── plans/            — Implementation plans per phase
├── research/         — Research outputs and discussion contexts
├── debug/            — Debug investigation logs
├── sessions/         — Session logs for memory system
│   └── _archive/     — Archived older sessions
├── decisions/
│   └── DECISIONS.md  — Chronological decision log
├── context/
│   ├── architecture.md — Architecture decisions record
│   ├── patterns.md     — Established code patterns
│   ├── gotchas.md      — Known issues and workarounds
│   └── tech-debt.md    — Known technical debt
├── handoffs/
│   ├── LATEST.md       — Last session's handoff note
│   └── _history/       — Previous handoffs
├── phases/           — Phase directories (created as needed)
└── uat/              — User acceptance testing
```

**After this command:** Run `/discuss [feature]` to lock decisions, then `/plan` to start.

## Instructions

### Step 0: Bootstrap Structure (MANDATORY FIRST STEP)

```bash
node planning-tools.cjs init
```

This creates the entire `.planning/` directory structure and `config.json` deterministically. Do NOT create directories/files manually.

### Step 1: Context Gathering

If `$ARGUMENTS` is provided, use it as the project description. Otherwise, ask:

1. **What are you building?** — Project name, one-line description, 3-sentence vision.
2. **Who is this for?** — Target users, use cases, scale expectations.
3. **Tech stack?** — Language, framework, database, infrastructure.
4. **What exists already?** — Greenfield or adding to existing codebase?
5. **Constraints?** — Deadlines, budget, team size, mandatory tech choices.
6. **Quality priorities?** — Rank: speed, reliability, security, maintainability, UX.
7. **Working style?** — Interactive (confirm each step) or auto (trust the agent)?
8. **Depth preference?** — Quick (speed), standard (balanced), or comprehensive (thorough)?

### Step 2: Codebase Reconnaissance (If Existing Project)

If NOT greenfield:

```bash
# Map existing structure
find . -maxdepth 3 -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | sort

# Identify tech stack from config
cat package.json 2>/dev/null | head -30
cat tsconfig.json 2>/dev/null | head -20
ls -la *.config.* .env* docker* Makefile 2>/dev/null

# Check recent activity
git log --oneline -20 2>/dev/null

# Count codebase size
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" \) -not -path '*/node_modules/*' | wc -l
```

### Step 3: Write PROJECT.md

```markdown
# Project: [Name]

## Vision
[3-sentence project vision from context gathering]

## Goals
1. [Primary goal]
2. [Secondary goal]
3. [Tertiary goal]

## Target Users
- **Primary:** [Who and what they need]
- **Secondary:** [Who and what they need]

## Tech Stack
- **Language:** [language + version]
- **Framework:** [framework + version]
- **Database:** [database + reason]
- **Infrastructure:** [hosting, CI/CD]
- **Key libraries:** [critical dependencies]

## Constraints
- **Timeline:** [deadline or "no hard deadline"]
- **Quality priorities:** [ordered list: speed > reliability > security > etc.]
- **Non-negotiables:** [things that must be true]

## What Exists (if applicable)
- **Codebase size:** [files, lines]
- **Architecture:** [current architectural style]
- **Test coverage:** [current state]
- **Known tech debt:** [if any]

## Context Notes
[Anything else relevant — team size, previous attempts, political considerations]
```

### Step 4: Write REQUIREMENTS.md

```markdown
# Requirements: [Project Name]

## Functional Requirements

### FR-1: [Feature Name]
- **Description:** [What it does]
- **Acceptance criteria:**
  - [ ] [Criterion 1 — specific, testable]
  - [ ] [Criterion 2]
  - [ ] [Criterion 3]
- **Priority:** P0 (Must) / P1 (Should) / P2 (Nice)

### FR-2: [Feature Name]
...

## Non-Functional Requirements

### NFR-1: Performance
- [Specific performance targets]

### NFR-2: Security
- [Specific security requirements]

### NFR-3: Reliability
- [Uptime, error budget, recovery time]

## Out of Scope
- [Thing 1 — explicitly excluded and why]
- [Thing 2]
```

### Step 5: Write ROADMAP.md

Break the project into phases (3-7 is a good range):

```markdown
# Roadmap: [Project Name]

## Progress
| Phase | Status | Plans | Tasks |
|-------|--------|-------|-------|
| Phase 1 | ⬜ Not Started | 0/? | 0/? |
| Phase 2 | ⬜ Not Started | 0/? | 0/? |
| Phase 3 | ⬜ Not Started | 0/? | 0/? |

## Phase 1: [Name] — Foundation
- **Goal:** [What this phase achieves]
- **Deliverables:** [Specific outputs]
- **Dependencies:** None
- **Estimated effort:** [S/M/L/XL]
- **Requirements covered:** FR-1, NFR-1

## Phase 2: [Name] — Core Features
- **Goal:** [What this phase achieves]
- **Deliverables:** [Specific outputs]
- **Dependencies:** Phase 1
- **Estimated effort:** [S/M/L/XL]
- **Requirements covered:** FR-2, FR-3

## Phase 3: [Name] — Polish & Deploy
...
```

### Step 6: Configure Settings

```bash
# Set user preferences from context gathering
node planning-tools.cjs config set mode [interactive|auto]
node planning-tools.cjs config set depth [quick|standard|comprehensive]

# If user specified preferences
node planning-tools.cjs config set preferences.auto_commit false
node planning-tools.cjs config set preferences.research_before_planning true
```

### Step 7: Initialize Memory

Create `.planning/MEMORY.md` using the persistent-memory skill template with project info from context gathering.

### Step 8: Commit Everything

```bash
git add .planning/
git commit -m "chore: initialize project planning structure"
```

### Step 9: Confirm and Summarize

Display:
- ✅ `.planning/` structure created (via planning-tools.cjs)
- ✅ `PROJECT.md` — Project context captured
- ✅ `REQUIREMENTS.md` — Requirements documented
- ✅ `ROADMAP.md` — [N] phases defined
- ✅ `STATE.md` — State tracking initialized
- ✅ `MEMORY.md` — Memory system bootstrapped
- ✅ `config.json` — Settings configured (mode: X, depth: Y)

**Next steps:**
1. Run `/discuss [Phase 1 feature]` to lock decisions before planning
2. Run `/plan Phase 1` to create implementation plans
3. Run `/research [topic]` if research is needed first
4. Run `/settings` to view/modify configuration
5. Run `/progress` to see current state

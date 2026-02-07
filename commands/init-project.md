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

Initialize a new project through structured context gathering: questioning → research → requirements → roadmap → state.

## What This Creates

```
.planning/
├── PROJECT.md        — Project context, goals, constraints, tech stack
├── REQUIREMENTS.md   — Scoped requirements with acceptance criteria
├── ROADMAP.md        — Phase structure with dependencies and estimates
├── STATE.md          — Current state tracker (living document)
└── config.json       — Workflow preferences
```

**After this command:** Run `/plan $ARGUMENTS` or `/execute` to start working.

## Instructions

### Step 1: Context Gathering

If `$ARGUMENTS` is provided, use it as the project description. Otherwise, ask:

1. **What are you building?** — Project name, one-line description, 3-sentence vision.
2. **Who is this for?** — Target users, use cases, scale expectations.
3. **Tech stack?** — Language, framework, database, infrastructure.
4. **What exists already?** — Is this greenfield or adding to an existing codebase?
5. **Constraints?** — Deadlines, budget, team size, mandatory tech choices.
6. **Quality priorities?** — Rank: speed, reliability, security, maintainability, UX.

### Step 2: Codebase Reconnaissance (If Existing Project)

If this is NOT a greenfield project:

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

### Step 3: Create .planning/ Directory

```bash
mkdir -p .planning/plans .planning/research .planning/debug .planning/uat
```

### Step 4: Write PROJECT.md

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

### Step 5: Write REQUIREMENTS.md

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

### Step 6: Write ROADMAP.md

Break the project into phases (3-7 is a good range):

```markdown
# Roadmap: [Project Name]

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

### Step 7: Write STATE.md

```markdown
# Project State

## Current Phase
Phase 0 — Initialization

## Status
- **Overall:** 🟢 On Track
- **Active tasks:** None
- **Blockers:** None

## History
- [timestamp] — Project initialized with /init-project
```

### Step 8: Write config.json

```json
{
  "project": "[name]",
  "initialized": "[ISO timestamp]",
  "phases": [number of phases],
  "current_phase": 0,
  "preferences": {
    "auto_commit": false,
    "auto_test": true,
    "verification_required": true
  }
}
```

### Step 9: Confirm and Summarize

Display:
- ✅ `.planning/PROJECT.md` created
- ✅ `.planning/REQUIREMENTS.md` created
- ✅ `.planning/ROADMAP.md` created
- ✅ `.planning/STATE.md` created
- ✅ `.planning/config.json` created

**Next steps:**
- Run `/plan Phase 1` to create a detailed implementation plan
- Run `/research [topic]` to investigate before planning
- Run `/progress` to see current state

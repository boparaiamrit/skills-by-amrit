---
name: agent-team-coordination
description: File-based multi-agent team coordination protocol — enables sequential role-switching with shared blackboard, task boards, and handoff documents. Works in any single-agent environment (Antigravity, Cursor, Claude Code).
---

# 🤝 Agent Team Coordination

> Multi-role coordination for single-agent environments — bringing team dynamics to solo AI sessions.

## Why This Exists

Claude Code introduced "Agent Teams" — multiple AI instances working in parallel via tmux sessions. But most developers use **Antigravity** or **Cursor**, which run single-agent sessions. This skill brings team coordination patterns to these environments through **sequential role-switching** with a **shared blackboard**.

Instead of multiple agents running simultaneously, one agent wears different specialist hats in sequence, with handoff documents preserving context between roles.

---

## Core Concept: Sequential Role-Switching

```
Traditional Team (Claude Code):
┌──────────┐  ┌──────────┐  ┌──────────┐
│Researcher│  │Executor  │  │Reviewer  │
│ (Agent 1)│  │ (Agent 2)│  │ (Agent 3)│
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │              │              │
     └──────────┬───┘──────────────┘
                │
          Shared Files

This Skill (Any Agent):
┌────────────────────────────────────────┐
│            Single Agent                 │
│                                         │
│  Phase 1: 🔬 Researcher Role           │
│     → writes research findings          │
│     → creates handoff document          │
│                                         │
│  Phase 2: 📋 Planner Role              │
│     → reads research findings           │
│     → creates implementation plan       │
│     → creates handoff document          │
│                                         │
│  Phase 3: ⚙️ Executor Role             │
│     → reads plan                        │
│     → implements changes                │
│     → creates handoff document          │
│                                         │
│  Phase 4: 🔍 Reviewer Role             │
│     → reads all previous handoffs       │
│     → reviews implementation            │
│     → writes review feedback            │
└────────────────────────────────────────┘
```

The blackboard (shared files) ensures no context is lost between role switches.

---

## Architecture

### Directory Structure

```
.planning/
├── team/
│   ├── config.json              # Team definition
│   ├── BOARD.md                 # Human-readable task board
│   ├── tasks/
│   │   ├── 001-task-name.md     # Individual task files
│   │   ├── 002-task-name.md
│   │   └── ...
│   ├── handoffs/
│   │   ├── phase-1-research.md  # Role handoff documents
│   │   ├── phase-2-plan.md
│   │   ├── phase-3-execute.md
│   │   └── phase-4-review.md
│   └── reviews/
│       └── review-NNN.md        # Review feedback on tasks
```

### Team Config (`config.json`)

```json
{
  "team_name": "feature-auth-refactor",
  "objective": "Refactor authentication module to support OAuth2",
  "roles": [
    {
      "name": "researcher",
      "emoji": "🔬",
      "phase": 1,
      "focus": "Understand current auth system, research OAuth2 best practices",
      "reads": [],
      "produces": ["research-findings.md", "handoff"]
    },
    {
      "name": "architect",
      "emoji": "📐",
      "phase": 2,
      "focus": "Design the new auth architecture based on research",
      "reads": ["phase-1-research.md"],
      "produces": ["architecture-decision.md", "handoff"]
    },
    {
      "name": "planner",
      "emoji": "📋",
      "phase": 3,
      "focus": "Break architecture into implementable tasks",
      "reads": ["phase-2-architect.md"],
      "produces": ["PLAN.md", "task-files", "handoff"]
    },
    {
      "name": "executor",
      "emoji": "⚙️",
      "phase": 4,
      "focus": "Implement tasks from the plan",
      "reads": ["phase-3-plan.md", "task-files"],
      "produces": ["code-changes", "handoff"]
    },
    {
      "name": "reviewer",
      "emoji": "🔍",
      "phase": 5,
      "focus": "Review all changes for quality, security, performance",
      "reads": ["all-handoffs", "code-changes"],
      "produces": ["review-report.md"]
    }
  ],
  "current_phase": 1,
  "current_role": "researcher",
  "created_at": "2026-02-08T04:00:00Z",
  "status": "active"
}
```

---

## Pre-Built Role Templates

### 🔬 Researcher Role

**When active, the agent:**
1. Reads the team objective from `config.json`
2. Searches the codebase for relevant code, patterns, and tests
3. Researches external documentation if needed
4. Produces a findings document with evidence
5. Writes a handoff for the next role

**Handoff template:**
```markdown
# Phase 1 Handoff: Research → Architect

## Research Summary
[Key findings in 3-5 bullet points]

## Codebase Analysis
- **Current implementation:** [where the code lives]
- **Dependencies:** [what depends on this code]
- **Test coverage:** [current test state]
- **Technical debt:** [existing issues]

## External Research
- [Finding 1 with source]
- [Finding 2 with source]

## Recommendations
1. [Recommendation with rationale]
2. [Recommendation with rationale]

## Risks Identified
- [Risk 1 — severity and mitigation]
- [Risk 2 — severity and mitigation]

## Files of Interest
- `path/to/file.ts` — [why it matters]
```

### 📐 Architect Role

**When active, the agent:**
1. Reads the researcher's handoff
2. Designs the solution architecture
3. Documents patterns, interfaces, and data flow
4. Identifies breaking changes and migration needs
5. Writes a handoff for the planner

### 📋 Planner Role

**When active, the agent:**
1. Reads the architect's handoff
2. Decomposes the architecture into atomic tasks
3. Identifies dependencies between tasks
4. Groups tasks into implementation waves
5. Creates individual task files
6. Writes a handoff for the executor

### ⚙️ Executor Role

**When active, the agent:**
1. Reads the planner's handoff and task files
2. Implements tasks in wave order (respecting dependencies)
3. Runs tests after each task
4. Updates task status (todo → done)
5. Writes a handoff for the reviewer

### 🔍 Reviewer Role

**When active, the agent:**
1. Reads ALL previous handoffs for full context
2. Reviews code changes for correctness, security, performance
3. Runs the full test suite
4. Produces a review report with severity-based feedback
5. Updates the team board with final status

---

## Task Board (`BOARD.md`)

Human-readable task board maintained by all roles:

```markdown
# 📋 Team Board: [team_name]
> Objective: [objective from config]
> Status: Phase [N] — [role_name]
> Last Updated: [DATE]

## 🔴 Blocked
- [ ] #003 — Write OAuth2 tests (blocked by #002)

## 🟡 In Progress
- [ ] #002 — Implement token refresh logic

## 🟢 Done
- [x] #001 — Research OAuth2 providers
- [x] #004 — Update database schema

## 📊 Progress
[████████░░] 60% — 3/5 tasks complete
```

---

## Task File Template

Each task in `.planning/team/tasks/`:

```markdown
# Task #[NNN] — [Title]

## Meta
- **Status:** todo | in-progress | review | done | blocked
- **Phase:** [which phase creates this task]
- **Assigned Role:** [which role implements]
- **Priority:** critical | high | medium | low
- **Wave:** [execution wave number]
- **Dependencies:** [task IDs this depends on]
- **Estimated Effort:** [S/M/L/XL]

## Description
[What needs to be done]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

## Implementation Notes
[Filled by executor — how it was implemented]

## Files Changed
- `path/to/file` — [what changed]

## Review Notes
[Filled by reviewer — feedback on implementation]

## Timestamps
- Created: [DATE]
- Started: [DATE or null]
- Completed: [DATE or null]
- Reviewed: [DATE or null]
```

---

## How to Use

### Starting a Team Session

Tell the agent:
```
Start a team session for: [describe the task/feature]
```

The agent will:
1. Create `.planning/team/` directory structure
2. Generate `config.json` with appropriate roles
3. Begin Phase 1 (Researcher role)

### Switching Roles

When a phase is complete, tell the agent:
```
Switch to the next role
```

Or the agent should automatically switch when it completes its phase objectives and writes the handoff document.

### Resuming a Team Session

If a team session spans multiple conversations:
```
Resume the team session
```

The agent will:
1. Read `config.json` to determine current phase
2. Read the latest handoff document
3. Continue from where the last role left off

### Multi-Conversation Teams

For complex features spanning multiple sessions:
- Each conversation picks up from the current phase in `config.json`
- The handoff documents ensure zero context loss
- The persistent-memory skill's MEMORY.md tracks the team session state

---

## Role Presets

### Quick Feature (3 roles)
```json
{
  "roles": ["researcher", "executor", "reviewer"],
  "description": "Fast iteration for small features"
}
```

### Full Pipeline (5 roles)
```json
{
  "roles": ["researcher", "architect", "planner", "executor", "reviewer"],
  "description": "Complete pipeline for complex features"
}
```

### Debug Investigation (3 roles)
```json
{
  "roles": ["investigator", "fixer", "verifier"],
  "description": "Scientific debugging with hypothesis testing"
}
```

### Parallel Research (3 roles)
```json
{
  "roles": ["researcher-frontend", "researcher-backend", "synthesizer"],
  "description": "Multi-angle research before implementation"
}
```

---

## Integration with Persistent Memory

The team coordination skill works hand-in-hand with the persistent-memory skill:

1. **Memory reads team state**: `MEMORY.md` includes active team session info
2. **Handoffs feed memory**: Phase handoffs are compressed into MEMORY.md
3. **Decisions tracked**: Team decisions go into `DECISIONS.md`
4. **Cross-session continuity**: If a team session spans multiple conversations, the memory system provides continuity

---

## Agent-Specific Setup

### Antigravity (Gemini)
Use the `/team-session` workflow in `.agent/workflows/`.

### Cursor
The `team-protocol.mdc` rule in `.cursor/rules/` activates team behavior.

### Claude Code
Use the `/team` command in `.claude/commands/`.

---

## Anti-Patterns

❌ **Don't** skip the handoff document — it's the team's communication channel
❌ **Don't** let one role do everything — that defeats the purpose
❌ **Don't** start implementing before research is done
❌ **Don't** skip the review role — it catches issues
❌ **Don't** create too many tasks — keep them atomic but not micro
❌ **Don't** modify task files from the wrong role

## Best Practices

✅ **Do** write thorough handoff documents between roles
✅ **Do** keep the task board updated in real-time
✅ **Do** include "watch out for" notes in handoffs
✅ **Do** respect task dependencies (wave order)
✅ **Do** mark acceptance criteria as met before marking tasks done
✅ **Do** have the reviewer read ALL handoffs for full context

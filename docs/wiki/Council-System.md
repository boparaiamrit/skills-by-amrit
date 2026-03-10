# 🏛️ Council System

> Multi-agent coordination with real subagent spawning and deterministic state management

The Council System (v4.0.0) replaces role-switching with real `Task()` subagent spawning. Each agent gets a fresh 200k context window, communicates through file-based handoffs, and must pass code-enforced quality gates before the next agent starts.

---

## Architecture

```
              ╔═══════════════════════════════════╗
              ║       🎯 ORCHESTRATOR              ║
              ║  - Spawns agents via Task()        ║
              ║  - Manages 13 CLI commands         ║
              ║  - Enforces quality gates          ║
              ╚════════════╦══════════════════════╝
                           ║
           Task()          ║           Task()
        ┌──────────────────┼──────────────────────┐
        ▼                  ▼                       ▼
   ┌─────────┐      ┌──────────┐            ┌──────────┐
   │ Agent 1  │───▶  │ Agent 2   │───▶  ...  │ Agent N   │
   │ (200k)   │      │ (200k)    │            │ (200k)    │
   └─────────┘      └──────────┘            └──────────┘
        │                  │                       │
        ▼                  ▼                       ▼
   handoff.md         handoff.md              handoff.md
```

**Key Design Decisions:**
- **Orchestrator-delegate pattern** — not peer-to-peer. The orchestrator owns all routing decisions
- **Each agent gets fresh 200k context** — via `Task()` spawning, not role-switching
- **CLI handles all structural operations** — 13 commands, zero LLM state management
- **File-based handoffs** — agents communicate through structured markdown documents

---

## Presets

| Preset | Agents | Use Case |
|:---|:---|:---|
| `full` | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| `rapid` | Researcher → Executor → Reviewer | Quick implementations |
| `debug` | Investigator → Fixer → Verifier | Bug fixes |
| `architecture` | Researcher → Architect → Reviewer | Design decisions |
| `refactoring` | Researcher → Planner → Executor → Reviewer | Code restructuring |
| `audit` | Researcher → Mapper → Reviewer | Codebase analysis |

---

## CLI Commands

All council state management is handled by deterministic CLI commands — no LLM writes to council state files directly.

| Command | Description |
|:---|:---|
| `council-init` | Initialize council session with preset and goal |
| `council-assign` | Assign a task to an agent |
| `council-advance` | Advance to the next agent in the sequence |
| `council-handoff` | Record an agent's handoff document |
| `council-gate` | Run quality gate checks for agent transition |
| `council-board` | Display the current task board |
| `council-status` | Show council session status and progress |
| `council-message` | Send a structured message between agents |
| `council-review` | Record a review finding |
| `council-block` | Flag a blocker that prevents advancement |
| `council-unblock` | Resolve a previously flagged blocker |
| `council-complete` | Mark the council session as complete |
| `council-abort` | Abort the council session with a reason |

**Usage:**
```bash
node planning-tools.cjs council-init --preset full --goal "implement user auth"
node planning-tools.cjs council-assign --agent researcher --task "analyze auth patterns"
node planning-tools.cjs council-advance
node planning-tools.cjs council-gate --from researcher --to architect
```

---

## Quality Gates

Every agent transition must pass a quality gate. The gate checks are enforced by the CLI — the orchestrator cannot skip them.

| Transition | Required Criteria |
|:---|:---|
| Researcher → Architect | Research report exists, key findings documented, risks identified |
| Architect → Planner | Architecture decisions documented, trade-offs analyzed |
| Planner → Executor | PLAN.md exists, tasks have `<files>`, `<action>`, `<verify>`, `<done>` blocks |
| Executor → Reviewer | All planned tasks completed, inline verification passed, commits created |
| Reviewer → Complete | Review findings documented, no critical issues remaining |

**Gate Failure:**
If a gate check fails, the CLI reports which criteria were not met. The orchestrator must either:
1. Send the agent back to complete the missing work
2. Flag a blocker and escalate

---

## File Structure

```
.planning/council/
├── council.json              # Session config: preset, goal, agent sequence, current state
├── BOARD.md                  # Visual task board with agent assignments
├── tasks/
│   ├── task-001.md           # Individual task definitions
│   └── task-002.md
├── handoffs/
│   ├── researcher.md         # Researcher's handoff document
│   ├── architect.md          # Architect's handoff document
│   └── ...
├── messages/
│   ├── msg-001.json          # Structured agent-to-agent messages
│   └── ...
└── reviews/
    ├── review-001.md         # Review findings
    └── ...
```

---

## Usage

**Start a council session:**
```
/team start "implement user auth with OAuth2" --preset full
```

**Resume an existing session:**
```
/team resume
```

**Check progress:**
```
/team status
```

**View the task board:**
```
/team board
```

The orchestrator handles all agent spawning, handoff management, and quality gate enforcement automatically. You interact through `/team` — the council CLI commands run behind the scenes.

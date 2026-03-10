# Multi-Agent Council System — Architecture & Implementation

> Production-grade multi-agent coordination via deterministic CLI state machine. Works in any AI coding agent.

---

## Architecture Overview

The council system uses an **orchestrator-delegate pattern**, not peer-to-peer communication:

```
                    ┌─────────────────────────────┐
                    │     ORCHESTRATOR (you)       │
                    │  Runs CLI commands            │
                    │  Manages state machine        │
                    │  Enforces quality gates       │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │  Task() spawning — fresh 200k context    │
       ┌──────▼──┐  ┌──────▼──┐  ┌──▼────┐  ┌──▼──────┐
       │Researcher│  │Architect│  │Executor│  │Reviewer │
       └────┬─────┘  └────┬────┘  └──┬───┘  └────┬────┘
            │              │          │            │
            └──── File-based handoffs ─────────────┘
                  (.planning/council/)
```

**Key design decisions:**

- **Each agent gets fresh context** via `Task()` spawning — no shared session, no context pollution
- **CLI handles all structural operations** deterministically — no LLM creating JSON or managing state
- **File-based handoffs** — agents communicate through numbered markdown files, not direct messages
- **Quality gates are code-enforced** — the CLI validates handoff content before allowing transitions

---

## Council State Machine

### States

```
initialized ──► executing ──► agent-active ──► gate-check ──► advancing ──► complete
     │                              │               │
     │                              │               ▼
     │                              │          gate-failed
     │                              │          (blocks advance)
     │                              ▼
     │                         handoff written
     │                              │
     └──────────────────────────────┘
                (council reset)
```

### State Transitions

| From | To | Trigger | Condition |
|------|----|---------|-----------|
| `initialized` | `active` | `council advance` | First call activates agent[0] |
| `active` | `active` | `council advance` | Gate check passes, next agent activated |
| `active` | `active` (blocked) | `council advance` | Gate check fails, stays on current agent |
| `active` | `completed` | `council advance` | Last agent finished, no more agents |
| Any | `initialized` | `council reset` | Archives current state, fresh start |

### State Storage

All state lives in `council.json`:

```json
{
  "objective": "Implement OAuth2 login flow",
  "preset": "rapid",
  "agents": ["researcher", "executor", "reviewer"],
  "current_phase": 1,
  "current_agent": "executor",
  "status": "active",
  "messages_count": 3,
  "tasks_count": 4,
  "handoffs_count": 1,
  "gates_passed": [{"gate": "researcher->executor", "at": "..."}],
  "gates_failed": [],
  "history": [...]
}
```

---

## CLI Commands Reference

All commands run via `node planning-tools.cjs council <subcommand>`.

| Command | Purpose | Key Flags |
|---------|---------|-----------|
| `council init <objective>` | Initialize council state machine | `--preset full\|rapid\|debug\|architecture\|refactoring\|audit` |
| `council status` | Show current council state as JSON | |
| `council advance` | Move to next agent (runs gate validation) | `--force` to skip gate check |
| `council message <from> <to> <type>` | Create numbered handoff message | `--content "..."` |
| `council handoff <agent>` | Record agent completion with handoff doc | `--summary "..."` |
| `council gate-check` | Validate transition quality gate | `--from <agent> --to <agent>` |
| `council board` | Regenerate BOARD.md from current state | |
| `council task-add <description>` | Add a task to the council board | `--assignee <agent> --depends-on <id>` |
| `council task-update <id>` | Update task status | `--status pending\|in-progress\|done\|blocked --result "..."` |
| `council reset` | Archive current council and start fresh | |

---

## Presets

| Preset | Agent Sequence | Use Case |
|--------|---------------|----------|
| `full` | Researcher, Architect, Planner, Executor, Reviewer | Complex multi-module features |
| `rapid` | Researcher, Executor, Reviewer | Small features, clear requirements |
| `debug` | Investigator, Fixer, Verifier | Bug investigation, production issues |
| `architecture` | Researcher, Architect, Reviewer | Design decisions, tech evaluation |
| `refactoring` | Researcher, Planner, Executor, Reviewer | Large-scale code refactoring |
| `audit` | Researcher, Mapper, Reviewer | Codebase analysis, system audits |

---

## Quality Gates

Gate checks run automatically on `council advance` (skip with `--force`). Each transition has required criteria:

| Gate Transition | Required Criteria |
|----------------|-------------------|
| `researcher -> architect` | Handoff from researcher exists, contains `findings` section |
| `researcher -> executor` | Handoff from researcher exists |
| `architect -> planner` | Handoff from architect exists, contains `design` section |
| `planner -> executor` | Handoff from planner exists, task files created in `tasks/` |
| `executor -> reviewer` | Handoff from executor exists, contains `commits` section |
| `investigator -> fixer` | Handoff from investigator exists, contains `root cause` section |
| `fixer -> verifier` | Handoff from fixer exists, contains `fix` section |
| `* -> reviewer` | At least 1 handoff exists from any previous agent |

**What happens on gate failure:** The CLI returns `advanced: false` with a `missing` array describing what the agent still needs to produce. The orchestrator stays on the current agent and instructs it to fill in the gaps.

---

## Memory Module

### Purpose

Persistent codebase intelligence that gives every council agent deep project context without burning tokens re-scanning files.

### Files

Located in `.planning/memory/`:

| File | Contents |
|------|----------|
| `codebase-map.md` | Directory structure, module purposes, entry points |
| `database-schemas.md` | All tables, columns, types, relationships, indexes |
| `api-routes.md` | All endpoints, controllers, middleware, auth requirements |
| `service-graph.md` | Service dependencies, business logic flows |
| `frontend-map.md` | Components, state management, routing (if applicable) |
| `tech-stack.md` | Languages, frameworks, tools, configuration |

### Lifecycle

- **Creation:** The mapper agent scans the entire codebase at council start and populates all 6 files
- **Refresh:** When files are older than 48 hours, they are regenerated before council work begins
- **Updates:** After each council session, the Memory Module is updated with new schemas, routes, or services discovered during work
- **Consumption:** The orchestrator includes relevant Memory Module context in each agent's routing message

---

## File Structure

```
.planning/council/
├── council.json              # State machine (JSON)
├── BOARD.md                  # Auto-generated task board
├── messages/
│   ├── msg-001.md            # Numbered inter-agent messages
│   ├── msg-002.md
│   └── msg-NNN.md
├── handoffs/
│   ├── handoff-001-researcher.md   # Agent completion documents
│   ├── handoff-002-executor.md
│   └── handoff-NNN-agent.md
├── tasks/
│   ├── 001-setup-oauth-client.md   # Task files with frontmatter
│   ├── 002-implement-token-flow.md
│   └── NNN-slug.md
└── reviews/                  # Review feedback documents
```

---

## Comparison: Before vs After

| Aspect | Before (v3.4) | After (v3.6+) |
|--------|--------------|----------------|
| **Spawning** | Role-switching (single session) | Real `Task()` spawning (fresh context) |
| **Context** | Single shared session (degrades) | Fresh 200k context per agent |
| **State** | Manual LLM file creation | Deterministic CLI (`council.json`) |
| **Gates** | LLM self-check (unreliable) | CLI validation (code-enforced) |
| **Parallelism** | None | Wave-capable (multiple agents per phase) |
| **Reliability** | Depends on instruction-following | Code-enforced transitions |
| **Board** | LLM-generated markdown (inconsistent) | Auto-generated from state machine |
| **Messages** | Freeform files | Numbered, typed, timestamped |
| **Reset/Archive** | Manual cleanup | One command: `council reset` |

---

## Example Session Transcript

A rapid council to add a caching layer to an API:

```bash
# 1. Initialize the council
$ node planning-tools.cjs council init "Add Redis caching to /api/products endpoint" --preset rapid
{
  "initialized": true,
  "objective": "Add Redis caching to /api/products endpoint",
  "preset": "rapid",
  "agents": ["researcher", "executor", "reviewer"],
  "council_dir": ".planning/council/"
}

# 2. Advance to first agent (researcher)
$ node planning-tools.cjs council advance
{
  "advanced": true,
  "from": null,
  "to": "researcher",
  "phase": 0
}

# >>> Orchestrator spawns researcher subagent with Task()
# >>> Researcher reads Memory Module, investigates caching options
# >>> Researcher writes findings

# 3. Record researcher handoff
$ node planning-tools.cjs council handoff researcher --summary "Analyzed /api/products. 240ms avg response. Redis recommended with 5min TTL. Cache key: products:{category}:{page}."

# 4. Advance to executor (gate check runs automatically)
$ node planning-tools.cjs council advance
{
  "advanced": true,
  "from": "researcher",
  "to": "executor",
  "gate_result": "passed",
  "phase": 1
}

# >>> Orchestrator spawns executor subagent with Task()
# >>> Executor reads researcher handoff, implements caching
# >>> Executor adds tasks and marks them done

# 5. Add and track tasks
$ node planning-tools.cjs council task-add "Install ioredis and configure connection" --assignee executor
$ node planning-tools.cjs council task-add "Add cache middleware to /api/products" --assignee executor
$ node planning-tools.cjs council task-update 1 --status done --result "Added ioredis 5.3.2, config in lib/redis.js"
$ node planning-tools.cjs council task-update 2 --status done --result "Cache middleware in middleware/cache.js, 5min TTL"

# 6. Record executor handoff and advance to reviewer
$ node planning-tools.cjs council handoff executor --summary "Implemented Redis caching. 2 files added. Cache hit reduces response to 12ms."
$ node planning-tools.cjs council advance
{
  "advanced": true,
  "from": "executor",
  "to": "reviewer",
  "gate_result": "passed",
  "phase": 2
}

# >>> Orchestrator spawns reviewer subagent with Task()
# >>> Reviewer reads ALL handoffs, verifies implementation

# 7. Complete the council
$ node planning-tools.cjs council handoff reviewer --summary "Implementation verified. Cache invalidation tested. No issues found."
$ node planning-tools.cjs council advance
{
  "advanced": false,
  "reason": "Council completed — no more agents in sequence.",
  "status": "completed"
}

# 8. Check final board
$ node planning-tools.cjs council board
{
  "path": ".planning/council/BOARD.md",
  "tasks_total": 2,
  "tasks_done": 2
}
```

---

## FAQ

**Q: What happens if a gate check fails?**
A: The CLI returns `advanced: false` with the specific missing items. The orchestrator keeps the current agent active and instructs it to produce the missing artifacts. No state corruption.

**Q: Can I skip gate checks?**
A: Yes, with `council advance --force`. Useful during development, not recommended for production work.

**Q: How does this work across different AI agents?**
A: The CLI is agent-agnostic. Any agent that can run `node planning-tools.cjs council ...` and read/write markdown files can participate. The orchestrator pattern works in Claude Code, Gemini CLI, Cursor, Windsurf, and others.

**Q: What happens on `council reset`?**
A: The entire `.planning/council/` directory is archived to `.planning/council-archive-<timestamp>/`, then a fresh empty council structure is created.

**Q: How is context managed per agent?**
A: Each agent is spawned with `Task()` which gives it a fresh 200k context window. The orchestrator includes relevant Memory Module excerpts and previous handoff content in the agent's prompt. No context degradation across phases.

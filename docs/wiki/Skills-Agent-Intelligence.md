# 🟣 Skills Reference — Agent Intelligence ✨ NEW

> 2 skills that give AI agents persistent memory and team coordination capabilities

These skills are the **flagship additions in v3.0.0** — they bring LLM Council-style agent coordination and claude-mem-style persistent memory to **every AI coding agent**.

---

## 23. 💾 persistent-memory

**Use When:** Any project where you work across multiple AI sessions and need context to persist.

**What It Does:**
Creates a file-based memory system in `.planning/` that automatically captures and retrieves context across sessions. No databases, no hooks, no external services — just markdown files.

**The Problem It Solves:**
Every AI session starts from scratch. You explain the same architecture, repeat the same decisions, and lose the context you built in previous sessions.

**How It Works:**

```
SESSION START                    DURING SESSION                 SESSION END
┌──────────────┐                ┌──────────────┐               ┌──────────────┐
│Read MEMORY.md│                │Capture:      │               │Write session │
│Read LATEST.md│───►            │ ▪ Decisions  │───►           │Write handoff │
│Full context! │                │ ▪ Gotchas    │               │Update memory │
└──────────────┘                │ ▪ Architecture│              │Compress      │
                                └──────────────┘               └──────────────┘
```

**Memory Directory Structure:**
```
.planning/
├── MEMORY.md                    # 🧠 Project brain (~300 lines max)
├── sessions/
│   ├── 2026-02-08-session-1.md  # Session log
│   └── _archive/                # Compressed old sessions
├── decisions/
│   └── DECISIONS.md             # Chronological decision log
├── context/
│   ├── architecture.md          # Architecture decisions
│   ├── patterns.md              # Code patterns
│   ├── gotchas.md               # Known issues
│   └── tech-debt.md             # Technical debt
└── handoffs/
    └── LATEST.md                # Last session's handoff
```

**Token Budget:**
| File | Lines | Tokens | When Loaded |
|:---|:---:|:---:|:---|
| MEMORY.md | ~300 | ~1,500 | Always (session start) |
| LATEST.md | ~30 | ~150 | Always (session start) |
| Context files | Varies | Varies | On demand |
| Session logs | Varies | Varies | Never (unless asked) |
| **Total auto** | **~330** | **~1,650** | **Per session** |

**Compression Protocol:**
When MEMORY.md exceeds 300 lines:
1. Recent sessions → keep last 5
2. Key decisions → keep last 10
3. Resolved issues → remove
4. Detailed content → move to `context/` files
5. Old session logs → move to `sessions/_archive/`

**Setup Per Agent:**
| Agent | How to Enable |
|:---|:---|
| 🟢 Antigravity | Add memory instructions to `GEMINI.md` |
| 🔵 Cursor | Install `memory-protocol.mdc` rule |
| 🟣 Claude Code | Use `/memory init` command |

**Comparison with claude-mem:**
| Feature | claude-mem | persistent-memory |
|:---|:---:|:---:|
| Infrastructure | SQLite + Chroma + Bun | Zero ✅ |
| Agent support | Claude Code only | ANY agent ✅ |
| Setup complexity | Plugin + worker service | 4 lines in GEMINI.md ✅ |
| Version control | Not git-native | Git-native ✅ |
| Token cost | Variable (progressive) | ~1,650 flat ✅ |

---

## 24. 💎 agent-team-coordination

**Use When:** Complex tasks that benefit from deep project knowledge and structured specialist coordination — research, design, plan, execute, review.

**What It Does:**
Implements the **Council v2 pattern** — an Orchestrator agent spawns real subagents via `Task()`, each getting a fresh 200k context window. No more role-switching within a single context. Backed by **13 council CLI commands** for deterministic state management and **code-enforced quality gates** at every agent transition.

**The Problem It Solves:**
AI coding tasks fail at scale because no single agent can hold all context simultaneously. Linear handoffs lose context. Role-switching dilutes focus. Council v2 solves this with real subagent spawning — each specialist gets dedicated context, communicates through file-based handoffs, and must pass quality gates before the next agent starts.

**How It Works:**

```
              ╔═══════════════════════════════╗
              ║     🎯 ORCHESTRATOR AGENT      ║
              ║  Spawns via Task()             ║
              ║  13 CLI commands for state     ║
              ║  Quality gates at transitions  ║
              ╚════════════╦══════════════════╝
                           ║ Task() spawning
            ┌──────────────┼──────────────────┐
            │  File-based handoffs + gates      │
     ┌──────▼──┐ ┌──────▼──┐ ┌──▼───┐ ┌──▼──────┐
     │🔬Research│ │📐Architect│ │⚙️Exec│ │🔍Review │
     └────┬─────┘ └────┬────┘ └──┬──┘ └────┬────┘
          └─────────────┴────┬───┴──────────┘
                   File-based Handoff Documents
```

**Memory Module Structure:**
```
.planning/
├── MEMORY.md                    # 🧠 Compressed project brain (~300 lines)
├── memory/                      # 📚 Deep intelligence files
│   ├── codebase-map.md         # Directory structure + module purposes
│   ├── database-schemas.md     # ALL tables, columns, relationships, indexes
│   ├── api-routes.md           # ALL endpoints, controllers, middleware
│   ├── service-graph.md        # Service dependencies + business logic
│   ├── frontend-map.md         # Components, state, routing
│   └── tech-stack.md           # Languages, frameworks, tools, config
└── council/                     # 🎯 Council state
    ├── council.json            # Configuration + routing log
    ├── BOARD.md                # Task board
    ├── messages/               # Structured agent-to-agent messages
    ├── handoffs/               # Role completion documents
    ├── tasks/                  # Task definitions
    └── reviews/                # Review feedback
```

**Communication Types:**
| Type | From → To | Purpose |
|:---|:---|:---|
| 📤 Handoff | Agent → Manager | "I'm done, here's my work" |
| ❓ Question | Agent → Agent | "I need clarification on X" |
| 🚨 Escalation | Agent → Manager | "I'm stuck, need guidance" |
| 📊 Status | Agent → Manager | "Here's my progress" |
| 🔄 Request | Agent → Manager | "I need specialist X" |

**Council Presets:**
| Preset | Agents | Best For |
|:---|:---|:---|
| 🏗️ Full (5) | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| ⚡ Rapid (3) | Researcher → Executor → Reviewer | Quick features |
| 🐛 Debug (3) | Investigator → Fixer → Verifier | Bug hunting |
| 📐 Architecture (3) | Researcher → Architect → Reviewer | Design decisions |
| 🔄 Refactoring (4) | Researcher → Planner → Executor → Reviewer | Safe refactoring |
| 🔍 Audit (4) | Security + Performance + Architecture → Synthesizer | System audits |

**Key Differentiators:**
| Feature | Role-Switching (v3) | Council v2 (v4) |
|:---|:---:|:---:|
| Agent isolation | Shared context | Fresh 200k per agent via `Task()` ✅ |
| State management | LLM-managed | 13 CLI commands (deterministic) ✅ |
| Quality gates | Honor system | Code-enforced at transitions ✅ |
| Handoffs | In-context | File-based documents ✅ |
| Routing | Fixed sequence | Orchestrator decides ✅ |
| Infrastructure | Zero | Zero ✅ |
| Agent support | Single agent | ANY agent ✅ |

See [Council System](Council-System.md) for the full architecture, CLI commands, and quality gate details.

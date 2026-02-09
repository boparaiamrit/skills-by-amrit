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
Implements the **LLM Council pattern** — a Manager agent with full project knowledge orchestrates specialist sub-agents through dynamic routing, peer communication, and structured escalation. The **Memory Module** deeply scans your codebase (schemas, routes, services, patterns) BEFORE any work begins, giving the Manager complete understanding.

**The Problem It Solves:**
AI coding tasks fail at scale because no single agent can hold all context simultaneously. Linear handoffs lose context. Parallel chaos creates conflicts. The LLM Council solves this with an intelligent routing graph where the Manager has deep project knowledge and dynamically routes work to specialists.

**How It Works:**

```
              ╔═══════════════════════════════╗
              ║       🎯 MANAGER AGENT         ║
              ║  Has: Full Memory Module        ║
              ║  Routes tasks dynamically        ║
              ║  Resolves conflicts              ║
              ╚════════════╦══════════════════╝
                           ║
            ┌──────────────┼──────────────────┐
            │  Dynamic Routing + Escalation     │
     ┌──────▼──┐ ┌──────▼──┐ ┌──▼───┐ ┌──▼──────┐
     │🔬Research│ │📐Architect│ │⚙️Exec│ │🔍Review │
     └────┬─────┘ └────┬────┘ └──┬──┘ └────┬────┘
          └─────────────┴────┬───┴──────────┘
                   Peer-to-Peer Communication
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
| Feature | Linear Handoffs | LLM Council |
|:---|:---:|:---:|
| Project knowledge | Partial | Full (Memory Module) ✅ |
| Routing | Fixed sequence | Dynamic (Manager decides) ✅ |
| Feedback loops | None | Escalation + re-routing ✅ |
| Peer communication | None | Direct specialist-to-specialist ✅ |
| Quality gates | None | Enforced at every transition ✅ |
| Infrastructure | Zero | Zero ✅ |
| Agent support | Single agent | ANY agent ✅ |

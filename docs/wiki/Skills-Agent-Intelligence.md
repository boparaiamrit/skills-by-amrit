# 🟣 Skills Reference — Agent Intelligence ✨ NEW

> 2 skills that give AI agents persistent memory and team coordination capabilities

These skills are the **flagship additions in v3.0.0** — they bring Claude Code-style agent teams and claude-mem-style persistent memory to **every AI coding agent**.

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
│Read LATEST.md│───▶            │ ▪ Decisions  │───▶           │Write handoff │
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

## 24. 🤝 agent-team-coordination

**Use When:** Complex tasks that benefit from structured phases — research, design, plan, execute, review.

**What It Does:**
Enables Claude Code-style agent team dynamics in single-agent environments through sequential role-switching with shared blackboard files.

**The Problem It Solves:**
Claude Code has Agent Teams (parallel agents via tmux). But Antigravity, Cursor, and most agents run single sessions. This skill brings team coordination patterns to ANY agent.

**How It Works:**

```
┌────────────────────────────────────────────────┐
│              Single Agent Session                │
│                                                  │
│  Phase 1: 🔬 Researcher                        │
│     Focus: Codebase analysis, evidence gathering │
│     Produces: Research findings + handoff         │
│                                                  │
│  Phase 2: 📐 Architect                          │
│     Focus: Solution design, pattern selection    │
│     Reads: Research findings                      │
│     Produces: Architecture design + handoff       │
│                                                  │
│  Phase 3: 📋 Planner                            │
│     Focus: Task decomposition, wave planning     │
│     Reads: Architecture design                    │
│     Produces: Task files + plan + handoff         │
│                                                  │
│  Phase 4: ⚙️ Executor                           │
│     Focus: Implementation, testing               │
│     Reads: Plan + task files                      │
│     Produces: Code changes + handoff              │
│                                                  │
│  Phase 5: 🔍 Reviewer                           │
│     Focus: Quality review, security, performance  │
│     Reads: ALL previous handoffs                  │
│     Produces: Review report                       │
└────────────────────────────────────────────────┘
```

**Team Directory Structure:**
```
.planning/team/
├── config.json              # Team definition (name, roles, phase)
├── BOARD.md                 # Kanban task board
├── tasks/
│   ├── 001-task-name.md     # Individual task files
│   └── 002-task-name.md
├── handoffs/
│   ├── phase-1-research.md  # Role handoff documents
│   ├── phase-2-architect.md
│   └── phase-3-plan.md
└── reviews/
    └── review-001.md        # Review feedback
```

**Role Presets:**
| Preset | Roles | Best For |
|:---|:---|:---|
| ⚡ Quick (3) | Researcher → Executor → Reviewer | Small features, bug fixes |
| 🏗️ Full (5) | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| 🐛 Debug (3) | Investigator → Fixer → Verifier | Bug investigations |
| 🔬 Research (3) | Researcher-A → Researcher-B → Synthesizer | Multi-angle research |

**Task Board Example:**
```markdown
# 📋 Team Board: auth-refactor
> Phase 3 — ⚙️ Executor

## 🔴 Blocked
- [ ] #005 — Integration tests (blocked by #003, #004)

## 🟡 In Progress
- [ ] #003 — Implement token refresh

## 🟢 Done
- [x] #001 — Research OAuth2 providers
- [x] #002 — Design auth schema
- [x] #004 — Database migration

## 📊 Progress
[██████░░░░] 60% — 3/5 tasks
```

**Multi-Conversation Support:**
Team sessions can span multiple conversations. The blackboard persists in `.planning/team/`, so any conversation can resume from exactly where the last one left off.

**Comparison with Claude Code Agent Teams:**
| Feature | Claude Code Teams | agent-team-coordination |
|:---|:---:|:---:|
| Parallelism | True parallel (tmux) | Sequential (role-switching) |
| Infrastructure | tmux + iTerm | Zero ✅ |
| Agent support | Claude Code only | ANY agent ✅ |
| Communication | Inter-agent messaging | Handoff documents |
| Context loss | Possible (parallel) | None (sequential) ✅ |
| File conflicts | Possible (parallel) | None (sequential) ✅ |

# 🤖 Agent Teams & Persistent Memory

> How skills-by-amrit brings Claude Code-style agent teams and session memory to **every** AI coding agent.

## The Problem

### Agent Teams
Claude Code introduced [Agent Teams](https://code.claude.com/docs/en/agent-teams) — multiple AI instances working in parallel via tmux, with shared task lists and inter-agent messaging. It's powerful, but it **only works in Claude Code**. Most developers use Antigravity, Cursor, or other agents that run single sessions.

### Session Memory
[claude-mem](https://github.com/thedotmack/claude-mem) is a Claude Code plugin that auto-captures session context using lifecycle hooks and SQLite. It's brilliant, but it requires:
- Claude Code (hooks-based)
- Bun runtime
- SQLite + Chroma vector database
- HTTP worker service on port 37777

That's a lot of infrastructure just for memory.

## Our Solution

### Agent Teams → Sequential Role-Switching
Instead of parallel agents, we use **sequential role-switching** with a **file-based blackboard**:

```
Claude Code Agent Teams:           Our Approach:
┌─────┐ ┌─────┐ ┌─────┐          ┌────────────────────────┐
│Agent│ │Agent│ │Agent│          │     Single Agent        │
│  1  │ │  2  │ │  3  │          │                        │
└──┬──┘ └──┬──┘ └──┬──┘          │ Phase 1: 🔬 Researcher │
   │       │       │              │ Phase 2: 📐 Architect  │
   └───┬───┘───────┘              │ Phase 3: ⚙️ Executor   │
       │                          │ Phase 4: 🔍 Reviewer   │
  Shared Files                    └────────────────────────┘
                                          │
                                    Shared Files
                                   (.planning/team/)
```

**Why this works just as well:**
- Same quality output through structured phases
- Handoff documents preserve full context between roles
- No tmux, no parallel sessions, no infrastructure
- Works in ANY agent (Antigravity, Cursor, Claude Code, Gemini CLI, etc.)
- The blackboard (`.planning/team/`) is human-readable

### Session Memory → Instruction-Based Memory
Instead of hooks and databases, we use **instruction-based memory** through agent rules:

```
claude-mem:                        Our Approach:
┌────────────────────┐            ┌────────────────────┐
│ Lifecycle Hooks    │            │ Agent Rules        │
│ (SessionStart,     │            │ (GEMINI.md,        │
│  PostToolUse,      │            │  .cursorrules,     │
│  Stop, SessionEnd) │            │  CLAUDE.md)        │
├────────────────────┤            ├────────────────────┤
│ SQLite + Chroma    │            │ Markdown files     │
│ (database)         │            │ (.planning/)       │
├────────────────────┤            ├────────────────────┤
│ Bun Worker Service │            │ Nothing extra      │
│ (port 37777)       │            │ (zero infra)       │
├────────────────────┤            ├────────────────────┤
│ AI Compression     │            │ AI Compression     │
│ (Agent SDK)        │            │ (built into agent) │
└────────────────────┘            └────────────────────┘
```

**Why this works just as well:**
- Same persistent memory across sessions
- Same handoff notes for continuity
- No external services, no databases, no ports
- Version-controlled in git (searchable history!)
- Works in ANY agent
- Token-efficient (~1,650 tokens per session start)

---

## Quick Start

### For Antigravity (Gemini)

1. Install the skills:
```
npx skills add persistent-memory agent-team-coordination
```

2. Add to your project's `GEMINI.md` (or `~/.gemini/GEMINI.md` for global):
```markdown
## 🧠 Automatic Memory Protocol

ALWAYS at the START of every conversation:
1. Check if `.planning/MEMORY.md` exists
2. If yes, read it FIRST before doing anything else
3. Also read `.planning/handoffs/LATEST.md` if it exists

ALWAYS at the END of significant work:
1. Update `.planning/MEMORY.md` with new learnings
2. Write `.planning/handoffs/LATEST.md` for the next session
3. Append decisions to `.planning/decisions/DECISIONS.md`
4. Keep MEMORY.md under 300 lines
```

3. Initialize memory:
```
Tell the agent: "Initialize project memory using the persistent-memory skill"
```

### For Cursor

1. Install the skills:
```
npx skills add persistent-memory agent-team-coordination
```

2. The `memory-protocol.mdc` and `team-protocol.mdc` rules are automatically installed to `.cursor/rules/`.

3. Initialize memory:
```
Tell Cursor: "Initialize project memory following the memory-protocol rule"
```

### For Claude Code

1. Install the skills:
```
npx skills add persistent-memory agent-team-coordination
```

2. Use the commands:
```
/memory init    — Initialize memory
/memory read    — Read current memory
/memory write   — Save session learnings
/team start     — Start a team session
```

---

## Memory System Details

### What Gets Captured

| What | Where | When |
|------|-------|------|
| Project overview | `MEMORY.md` | On init, updated each session |
| Architecture decisions | `context/architecture.md` | On architecture changes |
| Key decisions | `decisions/DECISIONS.md` | On significant decisions |
| Code patterns | `context/patterns.md` | On pattern discovery |
| Known bugs/gotchas | `context/gotchas.md` | On bug discovery |
| Technical debt | `context/tech-debt.md` | On debt identification |
| Session summaries | `sessions/*.md` | End of each session |
| Handoff notes | `handoffs/LATEST.md` | End of each session |

### Token Budget

| File | Lines | Tokens | Loaded |
|------|-------|--------|--------|
| MEMORY.md | ~300 | ~1,500 | Always |
| LATEST.md | ~30 | ~150 | Always |
| Context files | Varies | Varies | On demand |
| Session logs | Varies | Varies | Never (unless asked) |
| **Total automatic** | **~330** | **~1,650** | **Per session** |

### Compression Strategy

When MEMORY.md exceeds 300 lines:
1. Recent sessions → keep last 5
2. Key decisions → keep last 10
3. Resolved issues → remove
4. Detailed entries → move to context/ files
5. Old session logs → move to `_archive/`

---

## Team System Details

### Role Presets

| Preset | Roles | Best For |
|--------|-------|----------|
| Quick (3) | Researcher → Executor → Reviewer | Small features, bug fixes |
| Full (5) | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| Debug (3) | Investigator → Fixer → Verifier | Bug investigations |
| Research (3) | Researcher-A → Researcher-B → Synthesizer | Multi-angle research |

### Handoff Documents

The most important part of the team system. Each role writes a handoff for the next:

```
Phase 1: Researcher writes → phase-1-research.md
  │
  ▼ (Architect reads research.md)
Phase 2: Architect writes → phase-2-architect.md
  │
  ▼ (Planner reads architect.md)
Phase 3: Planner writes → phase-3-plan.md + task files
  │
  ▼ (Executor reads plan.md + tasks)
Phase 4: Executor writes → phase-4-execute.md
  │
  ▼ (Reviewer reads ALL handoffs)
Phase 5: Reviewer writes → review-report.md
```

### Task Board

Visual progress tracking in `.planning/team/BOARD.md`:

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

---

## Comparison with Alternatives

### vs Claude Code Agent Teams

| Feature | Claude Code Teams | Our Approach |
|---------|-------------------|--------------|
| Parallelism | True parallel (tmux) | Sequential role-switching |
| Infrastructure | tmux required | Zero infrastructure |
| Agent compatibility | Claude Code only | Any agent |
| Communication | Inter-agent messaging | Handoff documents |
| Task tracking | Shared task list | Shared task board |
| Quality gates | Hooks (TeammateIdle) | Review role + criteria |
| Context preservation | Session memory | File-based blackboard |

### vs claude-mem

| Feature | claude-mem | Our Approach |
|---------|-----------|--------------|
| Capture method | Lifecycle hooks | Instruction-based |
| Storage | SQLite + Chroma | Markdown files |
| Infrastructure | Bun worker + HTTP | Zero infrastructure |
| Search | MCP tools (semantic) | File reading (exact) |
| Agent compatibility | Claude Code only | Any agent |
| Version control | Not git-native | Git-native |
| Token cost | Progressive disclosure | ~1,650 tokens flat |
| Setup complexity | Plugin install + config | Add rules to GEMINI.md |

---

## Advanced Usage

### Cross-Agent Memory

The same `.planning/` directory works across different agents:

```
Monday morning (Antigravity):
  → Reads MEMORY.md, works on feature
  → Writes session log + handoff

Monday afternoon (Cursor):
  → Reads same MEMORY.md + same handoff
  → Continues work seamlessly
  → Updates memory files

Tuesday (Claude Code):
  → Same memory, same context
  → Use /memory read to see everything
```

This is **impossible** with claude-mem (Claude Code only) or Claude Code teams (single-agent-type).

### Multi-Project Memory

Each project has its own `.planning/` directory, so memories never leak between projects. For cross-project knowledge, use the global `~/.gemini/GEMINI.md` (Antigravity) or global cursor rules.

### Team Sessions Across Conversations

A team session can span multiple conversations:

```
Conversation 1:
  → Start team, complete Phase 1 (Research)
  → Handoff written, config saved

Conversation 2 (hours later):
  → "Resume team session"
  → Reads config.json → Phase 2 (Architect)
  → Reads research handoff
  → Continues naturally
```

---

## FAQ

**Q: Does this actually work without hooks?**
A: Yes. The key insight is that modern AI agents are instruction-followers. If you tell them "always read MEMORY.md first" in their rules, they will. claude-mem's hooks are just a programmatic way to ensure the same behavior — we achieve it through instructions.

**Q: What if the agent forgets to write memory?**
A: The handoff note reminder is baked into the rules. But if the session crashes, you lose that session's learnings (same as claude-mem if the hook fails). The solution: write memory incrementally during the session, not just at the end.

**Q: Is the team system as good as real parallel agents?**
A: For a single developer, often better. Sequential roles with handoffs produce more coherent output because each role has full context. Parallel agents can have coordination issues and file conflicts. The trade-off is speed — parallel is faster for truly independent tasks.

**Q: Can I use this with claude-mem too?**
A: Yes! They're complementary. claude-mem captures low-level observations; our system captures high-level decisions and context. Use both if you use Claude Code.

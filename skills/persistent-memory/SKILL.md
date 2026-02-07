---
name: persistent-memory
description: Automated persistent memory system for AI agents — captures decisions, context, and learnings across sessions using file-based protocols. Works in Antigravity, Cursor, Claude Code, and any agent that can read/write files.
---

# 🧠 Persistent Memory System

> Automated context preservation across AI coding sessions — no hooks, no APIs, no external services.

## Why This Exists

Every AI coding session starts from scratch. You explain the same architecture, repeat the same decisions, and lose the context you built in previous sessions. This skill solves that by creating a **file-based memory protocol** that any AI agent can follow.

Unlike `claude-mem` (which requires Claude Code hooks and a worker service), this system works in **any agent** that can read and write files — Antigravity, Cursor, Claude Code, Gemini CLI, Cline, and more.

---

## Architecture

### The Memory Stack

```
.planning/
├── MEMORY.md                    # 🧠 Compressed project brain (~300 lines max)
├── sessions/
│   ├── YYYY-MM-DD-session-N.md  # Session logs (auto-pruned to last 10)
│   └── _archive/                # Older sessions compressed here
├── decisions/
│   └── DECISIONS.md             # Chronological decision log (append-only)
├── context/
│   ├── architecture.md          # Architecture decisions record
│   ├── patterns.md              # Established code patterns
│   ├── gotchas.md               # Known issues, bugs, workarounds
│   └── tech-debt.md             # Known technical debt
└── handoffs/
    └── LATEST.md                # Last session's handoff note for next session
```

### How It Works

```
┌─────────────────────────────────────────────────────┐
│                  SESSION START                        │
│                                                       │
│  1. Agent reads MEMORY.md (project brain)             │
│  2. Agent reads handoffs/LATEST.md (last session)     │
│  3. Agent has full context — no questions needed      │
├─────────────────────────────────────────────────────┤
│                  DURING SESSION                       │
│                                                       │
│  4. Agent works normally on tasks                     │
│  5. On significant decisions → append to DECISIONS.md │
│  6. On discovering bugs → append to gotchas.md        │
│  7. On architecture changes → update architecture.md  │
├─────────────────────────────────────────────────────┤
│                  SESSION END                          │
│                                                       │
│  8. Agent creates session log in sessions/            │
│  9. Agent writes handoffs/LATEST.md for next session  │
│  10. Agent compresses updates into MEMORY.md          │
│  11. If MEMORY.md > 300 lines, compress oldest entries│
└─────────────────────────────────────────────────────┘
```

---

## Protocol: Session Start

**ALWAYS do this at the start of every conversation involving project work:**

### Step 1: Check for existing memory
```
Look for .planning/MEMORY.md in the project root.
```

### Step 2: If MEMORY.md exists, READ IT FIRST
```
Read .planning/MEMORY.md to understand:
- Project overview and current state
- Key architectural decisions
- Active work streams
- Known issues and workarounds
- What happened in recent sessions
```

### Step 3: Read the last handoff
```
Read .planning/handoffs/LATEST.md to understand:
- What was being worked on last
- What was completed
- What's pending
- Any blockers or open questions
```

### Step 4: Acknowledge context
```
Briefly acknowledge what you know from memory:
"I see from memory that we're working on [X], last session we [Y],
and there's a known issue with [Z]."
```

---

## Protocol: During Session

### On significant decisions:
Append to `.planning/decisions/DECISIONS.md`:

```markdown
## [DATE] — [Topic]
**Decision:** [What was decided]
**Rationale:** [Why this was chosen]
**Alternatives:** [What was considered but rejected]
**Impact:** [What this affects]
```

### On discovering bugs or gotchas:
Append to `.planning/context/gotchas.md`:

```markdown
## [Component/Area]
**Issue:** [Description]
**Workaround:** [How to handle it]
**Root Cause:** [If known]
**Date Discovered:** [DATE]
```

### On architecture changes:
Update `.planning/context/architecture.md`:

```markdown
## [System/Module Name]
**Pattern:** [What pattern is used]
**Rationale:** [Why this approach]
**Dependencies:** [What it depends on]
**Last Updated:** [DATE]
```

### On identifying technical debt:
Append to `.planning/context/tech-debt.md`:

```markdown
## [Area]
**Debt:** [What needs fixing]
**Severity:** low | medium | high | critical
**Estimated Effort:** [Time estimate]
**Date Identified:** [DATE]
```

---

## Protocol: Session End

**ALWAYS do this before ending a significant work session:**

### Step 1: Create session log
Create `.planning/sessions/YYYY-MM-DD-session-N.md`:

```markdown
# Session: [DATE] — Session [N]

## Duration
[Approximate time spent]

## Objective
[What was the goal]

## Completed
- [x] [Task 1 — brief description]
- [x] [Task 2 — brief description]

## In Progress
- [ ] [Task — what remains]

## Decisions Made
- [Decision 1 — brief]
- [Decision 2 — brief]

## Issues Encountered
- [Issue 1 — brief]

## Files Modified
- `path/to/file.ts` — [what changed]
- `path/to/other.py` — [what changed]

## Next Steps
1. [What should happen next]
2. [Follow-up items]
```

### Step 2: Write handoff note
Overwrite `.planning/handoffs/LATEST.md`:

```markdown
# Handoff: [DATE]

## Last Session Summary
[One paragraph of what happened]

## Current State
- **Working on:** [Active task]
- **Blocked by:** [Any blockers, or "nothing"]
- **Branch:** [Git branch if applicable]

## Immediate Next Steps
1. [Most important next thing]
2. [Second priority]
3. [Third priority]

## Open Questions
- [Any unresolved questions]

## Watch Out For
- [Any gotchas the next session should know about]
```

### Step 3: Update MEMORY.md
Update `.planning/MEMORY.md` with any new information from this session. Keep it under 300 lines by compressing older entries.

---

## MEMORY.md Template

```markdown
# 🧠 Project Memory
> Auto-maintained by persistent-memory skill
> Last updated: [DATE]

## 📋 Project Overview
[2-3 sentence project description]
- **Tech Stack:** [languages, frameworks, databases]
- **Repository:** [repo info]
- **Status:** [active development | maintenance | etc.]

## 🏗️ Architecture
[Key architectural decisions — bullet points]
- [Pattern 1]: [why]
- [Pattern 2]: [why]

## 📊 Current State
### Active Work
- [What's being worked on right now]

### Recently Completed
- [Last 3-5 completed items with dates]

### Blocked / Waiting
- [Anything blocked and why]

## 🔑 Key Decisions
[Last 10 significant decisions, newest first]
1. [DATE] — [Decision]: [Brief rationale]
2. [DATE] — [Decision]: [Brief rationale]

## ⚠️ Known Issues & Gotchas
- [Issue 1]: [Workaround]
- [Issue 2]: [Workaround]

## 📝 Patterns & Conventions
- [Pattern 1]: [How to use it]
- [Pattern 2]: [How to use it]

## 🗓️ Recent Sessions
| Date | Summary |
|------|---------|
| [DATE] | [One-line summary] |
| [DATE] | [One-line summary] |
| [DATE] | [One-line summary] |
```

---

## Compression Protocol

When MEMORY.md exceeds 300 lines:

1. **Recent Sessions table**: Keep only last 5 entries
2. **Key Decisions**: Keep only last 10
3. **Recently Completed**: Keep only last 5
4. **Known Issues**: Remove resolved issues
5. **Move detailed content** to context/ subdirectory files
6. **Archive old session logs** to sessions/_archive/

---

## Agent-Specific Setup

### Antigravity (Gemini)
Add to your `GEMINI.md` or `.gemini/GEMINI.md`:

```markdown
## 🧠 Automatic Memory Protocol

ALWAYS at the START of every conversation involving project work:
1. Check if `.planning/MEMORY.md` exists in the project
2. If yes, read it FIRST before doing anything else
3. Also read `.planning/handoffs/LATEST.md` if it exists
4. Use this context to inform your work

ALWAYS at the END of significant work sessions:
1. Update `.planning/MEMORY.md` with new learnings
2. Write `.planning/handoffs/LATEST.md` for the next session
3. Append any decisions to `.planning/decisions/DECISIONS.md`
4. Keep MEMORY.md under 300 lines (compress older entries)
```

### Cursor
Add the `memory-protocol.mdc` rule to `.cursor/rules/`.

### Claude Code
Add the `memory.md` command to `.claude/commands/`.

---

## Token Efficiency

This system is designed to be **token-efficient**:

- **MEMORY.md**: ~300 lines ≈ 1,500 tokens (always loaded)
- **LATEST.md**: ~30 lines ≈ 150 tokens (always loaded)
- **Context files**: Loaded on-demand only when relevant
- **Session logs**: Never loaded unless explicitly requested
- **Total automatic overhead**: ~1,650 tokens per session start

Compare to claude-mem's progressive disclosure (50-1,000 tokens per search result) — this is comparable but **zero-infrastructure**.

---

## Initialization

To bootstrap memory for an existing project, run the `/memory` command or workflow, which will:

1. Create the `.planning/` directory structure
2. Scan the codebase to generate initial `MEMORY.md`
3. Create initial `architecture.md` from code analysis
4. Create initial `patterns.md` from code patterns
5. Set up empty `DECISIONS.md` and `gotchas.md`

---

## Anti-Patterns

❌ **Don't** store raw conversation logs — too large, too noisy
❌ **Don't** let MEMORY.md grow unbounded — compress aggressively
❌ **Don't** duplicate information across files — single source of truth
❌ **Don't** include sensitive data (API keys, passwords) in memory files
❌ **Don't** skip the handoff note — it's the most valuable part
❌ **Don't** manually edit MEMORY.md — let the agent maintain it

## Best Practices

✅ **Do** keep MEMORY.md under 300 lines at all times
✅ **Do** write a handoff note at the end of EVERY session
✅ **Do** include "watch out for" notes in handoffs
✅ **Do** compress older decisions into one-liners
✅ **Do** reference specific files and line numbers in gotchas
✅ **Do** commit `.planning/` to version control (add secrets to .gitignore)

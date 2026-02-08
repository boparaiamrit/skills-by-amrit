# persistent-memory Examples

> Cross-session memory that persists decisions and context.

## Antigravity

```
/memory-sync
```

Auto-activates on session start/end via GEMINI.md.

## Claude Code

```
@/memory status
@/memory save
@/memory restore
```

## File Structure

```
.planning/
├── MEMORY.md              ← 🧠 Project brain (~300 lines)
├── sessions/
│   └── 2024-02-08-feat-auth.md
├── decisions/DECISIONS.md ← 📋 Decision log (append-only)
├── context/
│   ├── architecture.md    ← 🏗️ Architecture decisions
│   ├── patterns.md        ← 🔄 Established patterns
│   ├── gotchas.md         ← ⚠️ Known issues
│   └── tech-debt.md       ← 🔧 Technical debt
└── handoffs/LATEST.md     ← 📤 Last session's handoff
```

## Session Start

Agent automatically reads:
1. `MEMORY.md` — Project context
2. `handoffs/LATEST.md` — Previous session's work

## Session End

Agent automatically writes:
1. Session log to `sessions/`
2. Updates `handoffs/LATEST.md`
3. Appends to `decisions/DECISIONS.md` if decisions were made

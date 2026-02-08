# memory-protocol Rule Examples

> Cross-session memory persistence.

## File Structure

```
.planning/
├── MEMORY.md           ← Project brain
├── STATE.md            ← Current state
├── sessions/           ← Session logs
├── decisions/          ← Decision log
├── plans/              ← Implementation plans
├── context/            ← Architecture docs
└── handoffs/           ← Session handoffs
```

## Session Start

1. Read MEMORY.md
2. Read handoffs/LATEST.md
3. Continue where left off

## Session End

1. Update STATE.md
2. Write session log
3. Update handoffs/LATEST.md

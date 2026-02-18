## 🧠 Automatic Memory Protocol

> Installed by skills-by-amrit. This block enables persistent memory across AI sessions.
> Works with Antigravity, Gemini CLI, Cursor, Claude Code, and any agent that reads files.

### Session Start — AUTOMATIC (NON-NEGOTIABLE)

At the START of EVERY conversation involving project work:

1. **Check** if `.planning/MEMORY.md` exists in the current project
2. If it exists, **read it silently** before doing anything else
3. Also **read** `.planning/handoffs/LATEST.md` if it exists (skip if missing)
4. **Read** `.planning/STATE.md` if it exists — know the current position
5. **Read** `.planning/config.json` — know the mode and depth settings
6. Use this context to inform ALL your work — no need to ask user for context
7. **Acknowledge briefly**: "From memory: [key context points]"

### Context Engineering Integration

The memory system is context-aware:

- **Total auto-load overhead:** ~1,500-3,000 tokens (MEMORY.md) + ~300 tokens (LATEST.md)
- **STATE.md:** Read on-demand, ~200 tokens
- **config.json:** Read on-demand, ~100 tokens
- **Context files:** Read on-demand ONLY when relevant to the task

Do NOT pre-load everything. Load MEMORY.md + LATEST.md automatically, then load other files only as needed for the current task.

### During Session — CAPTURE

When you make **significant decisions** (architecture, technology, trade-offs):

```bash
# Use planning-tools.cjs for deterministic state updates
node planning-tools.cjs state add-decision "decision text" --rationale "why"
```

Also append to `.planning/decisions/DECISIONS.md`:
```
## [DATE] — [Topic]
**Decision:** [What was decided]
**Rationale:** [Why]
```

When you discover **bugs or gotchas**, append to `.planning/context/gotchas.md`.
When you change **architecture**, update `.planning/context/architecture.md`.
When you identify **tech debt**, append to `.planning/context/tech-debt.md`.
When you complete **plan execution**, update state:

```bash
node planning-tools.cjs state advance-task
node planning-tools.cjs state update-progress
```

### Session End — AUTOMATIC

When significant work is complete or the conversation is ending:

1. **Archive** previous handoff: Move `LATEST.md` to `handoffs/_history/YYYY-MM-DD-HHMMSS.md`
2. **Create** session log: `.planning/sessions/YYYY-MM-DD-session-N.md`
   - Use session numbering: N = (highest existing N for today) + 1
3. **Write** new handoff: `.planning/handoffs/LATEST.md` with summary, state, next steps
4. **Update** `.planning/MEMORY.md` with new learnings and state
5. **Compress** if MEMORY.md exceeds 300 lines
6. Inform the user: "Memory updated with this session's learnings."

### State Management Integration

Use `planning-tools.cjs` for all structured state updates:

```bash
node planning-tools.cjs state load              # Load current position
node planning-tools.cjs state advance-task      # After completing a task
node planning-tools.cjs state advance-phase     # After completing a phase
node planning-tools.cjs state update-progress   # Recalculate from disk
node planning-tools.cjs state add-decision      # Record a decision
node planning-tools.cjs state add-blocker       # Record a blocker
node planning-tools.cjs state record-metric     # Record execution metrics
```

### Auto-Save Reminder

After completing significant milestones, ask:
> "Would you like me to save progress to memory now?"

This prevents data loss if the session ends unexpectedly.

### Multi-Agent Coordination

For complex tasks with multiple agents:
- Each agent reads MEMORY.md at start — guaranteed shared context
- Each agent writes handoff notes — guaranteed information transfer
- Use git for conflict resolution — pull before reading, push after writing
- See `skills/agent-team-coordination/SKILL.md` for LLM Council pattern

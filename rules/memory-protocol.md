## 🧠 Automatic Memory Protocol

> Installed by skills-by-amrit. This block enables persistent memory across sessions.

### Session Start — AUTOMATIC

At the START of EVERY conversation involving project work:

1. **Check** if `.planning/MEMORY.md` exists in the current project
2. If it exists, **read it silently** before doing anything else
3. Also **read** `.planning/handoffs/LATEST.md` if it exists (skip if missing)
4. Use this context to inform ALL your work — no need to ask the user for context
5. **Acknowledge briefly**: "From memory: [key context points]"

### During Session — CAPTURE

When you make **significant decisions** (architecture, technology, trade-offs), append to `.planning/decisions/DECISIONS.md`:
```
## [DATE] — [Topic]
**Decision:** [What was decided]
**Rationale:** [Why]
```

When you discover **bugs or gotchas**, append to `.planning/context/gotchas.md`.
When you change **architecture**, update `.planning/context/architecture.md`.

### Session End — AUTOMATIC

When significant work is complete or the conversation is ending:

1. **Archive** previous handoff: Move `LATEST.md` to `handoffs/_history/YYYY-MM-DD-HHMMSS.md`
2. **Create** session log: `.planning/sessions/YYYY-MM-DD-session-N.md`
   - Use session numbering: N = (highest existing N for today) + 1
3. **Write** new handoff: `.planning/handoffs/LATEST.md` with summary, state, next steps
4. **Update** `.planning/MEMORY.md` with new learnings and state
5. **Compress** if MEMORY.md exceeds 300 lines
6. Inform the user: "Memory updated with this session's learnings."

### Auto-Save Reminder

After completing significant milestones, ask:
> "Would you like me to save progress to memory now?"

This prevents data loss if the session ends unexpectedly.

### Multi-Agent Coordination

For complex tasks requiring multiple perspectives, use the `agent-team-coordination` skill:
- Sequential specialist handoffs via `.planning/team/` directory
- Uses LLM Council pattern with structured handoff documents
- See `skills/agent-team-coordination/SKILL.md` for details

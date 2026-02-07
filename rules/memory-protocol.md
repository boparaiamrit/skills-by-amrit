## 🧠 Automatic Memory Protocol

> Installed by skills-by-amrit. This block enables persistent memory across sessions.

### Session Start — AUTOMATIC

At the START of EVERY conversation involving project work:

1. **Check** if `.planning/MEMORY.md` exists in the current project
2. If it exists, **read it silently** before doing anything else
3. Also **read** `.planning/handoffs/LATEST.md` if it exists
4. Use this context to inform ALL your work — no need to ask the user for context
5. **Acknowledge briefly**: "From memory: [key context points]"

### During Session — CAPTURE

When you make **significant decisions**, append to `.planning/decisions/DECISIONS.md`:
```
## [DATE] — [Topic]
**Decision:** [What was decided]
**Rationale:** [Why]
```

When you discover **bugs or gotchas**, append to `.planning/context/gotchas.md`.
When you change **architecture**, update `.planning/context/architecture.md`.

### Session End — AUTOMATIC

When significant work is complete or the conversation is ending:

1. **Create** session log: `.planning/sessions/YYYY-MM-DD-session-N.md`
2. **Write** handoff: `.planning/handoffs/LATEST.md` with summary, state, next steps
3. **Update** `.planning/MEMORY.md` with new learnings and state
4. **Compress** if MEMORY.md exceeds 300 lines
5. Inform the user: "Memory updated with this session's learnings."

### Team Sessions — WHEN REQUESTED

For complex tasks, use the agent-team-coordination skill:
- Sequential role-switching: 🔬Researcher → 📐Architect → 📋Planner → ⚙️Executor → 🔍Reviewer
- Maintain `.planning/team/` directory for coordination
- Write handoff documents between role switches
- Keep the task board updated in `.planning/team/BOARD.md`

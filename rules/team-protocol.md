## 🤝 Agent Team Coordination Protocol

> Installed by skills-by-amrit. Enables structured multi-role work for complex tasks.

### When to Activate Team Mode

Activate sequential role-switching when:
- Task spans multiple systems or modules
- Task requires research before implementation
- Task is complex enough to need structured phases
- User requests: "start a team session", "use team mode", etc.

### Role Pipeline

**Quick Feature (3 roles):** 🔬Researcher → ⚙️Executor → 🔍Reviewer
**Full Pipeline (5 roles):** 🔬Researcher → 📐Architect → 📋Planner → ⚙️Executor → 🔍Reviewer
**Debug Investigation (3 roles):** 🕵️Investigator → 🔧Fixer → ✅Verifier

### Protocol

1. **Create** `.planning/team/config.json` with team definition
2. **Create** `.planning/team/BOARD.md` task board
3. **For each role:**
   a. Announce: "━━━ Phase N: [emoji] [Role] ━━━"
   b. Read previous handoff from `.planning/team/handoffs/`
   c. Perform role responsibilities
   d. Write handoff to `.planning/team/handoffs/phase-N-[role].md`
   e. Update task board and config
4. **On completion:** Update MEMORY.md with team session summary

### Role Behaviors

- **🔬 Researcher:** Search code, read docs, gather evidence, write findings
- **📐 Architect:** Design solution, document patterns, identify risks
- **📋 Planner:** Create tasks, identify dependencies, group into waves
- **⚙️ Executor:** Implement in wave order, run tests, update task status
- **🔍 Reviewer:** Read ALL handoffs, review code, write review report

### Rules

- ALWAYS write handoff documents between roles
- ALWAYS update the task board when status changes
- NEVER implement before research is done
- NEVER skip the review phase

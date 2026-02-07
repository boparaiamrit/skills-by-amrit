# /team — Agent Team Coordination

Start and manage a multi-role team session for complex features. Uses sequential role-switching with a shared blackboard for coordination.

## Usage
- `/team start [objective]` — Start a new team session
- `/team resume` — Resume an existing team session
- `/team next` — Switch to the next role
- `/team board` — Show current task board
- `/team status` — Show team session status

## Protocol

### Starting a Team (`start`)
1. Ask the user for the objective if not provided
2. Assess complexity and suggest a role preset:
   - **Quick (3 roles):** Researcher → Executor → Reviewer
   - **Full (5 roles):** Researcher → Architect → Planner → Executor → Reviewer
   - **Debug (3 roles):** Investigator → Fixer → Verifier
3. Create `.planning/team/` directory structure
4. Write `config.json` with team definition
5. Create empty `BOARD.md` task board
6. Begin Phase 1 in the first role

### Resuming (`resume`)
1. Read `.planning/team/config.json`
2. Determine current phase and role
3. Read the latest handoff document
4. Read the task board
5. Continue from the current phase

### Switching Roles (`next`)
1. Verify current phase is complete:
   - All role objectives met
   - Handoff document written
   - Task board updated
2. Advance `config.json` to next phase
3. Read the handoff from the completing role
4. Announce role switch: "🔬 → ⚙️ Switching to Executor role"
5. Begin new role's responsibilities

### Task Board (`board`)
Display `.planning/team/BOARD.md` with:
- Blocked tasks
- In-progress tasks
- Completed tasks
- Progress bar

### Status (`status`)
Show:
- Team name and objective
- Current phase and role
- Tasks: total, done, in-progress, blocked
- Timeline of phase completions

## Role Behaviors

When in each role, the agent should:

### 🔬 Researcher
- Search codebase extensively
- Read documentation
- Identify patterns, risks, dependencies
- Write findings to `handoffs/phase-N-research.md`

### 📐 Architect
- Design solution based on research
- Document patterns, interfaces, data flow
- Identify breaking changes
- Write design to `handoffs/phase-N-architect.md`

### 📋 Planner
- Break architecture into atomic tasks
- Create task files in `tasks/`
- Identify dependencies and waves
- Write plan to `handoffs/phase-N-plan.md`

### ⚙️ Executor
- Implement tasks in wave order
- Run tests after each task
- Update task status in files and board
- Write results to `handoffs/phase-N-execute.md`

### 🔍 Reviewer
- Read ALL previous handoffs
- Review code for correctness, security, performance
- Run full test suite
- Write review to `handoffs/phase-N-review.md`

## Integration
- Works with `/memory` command for cross-session continuity
- Team decisions are logged to `.planning/decisions/DECISIONS.md`
- Team state is tracked in `.planning/MEMORY.md`

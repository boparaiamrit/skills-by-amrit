# /team — LLM Council Command

Start and manage an LLM Council session — a Manager-orchestrated multi-agent team with deep codebase intelligence via the Memory Module.

## Usage
- `/team start [objective]` — Start a new council session
- `/team resume` — Resume an existing council session
- `/team board` — Show current council task board
- `/team status` — Show council status, routing log, and agent states
- `/team route [agent]` — Manually route next task to a specific agent
- `/team memory` — Show Memory Module status and staleness

## Protocol

### Starting a Council (`start`)
1. Ask the user for the objective if not provided
2. **Initialize Memory Module** (if not exists):
   - Scan codebase → `.planning/memory/codebase-map.md`
   - Extract ALL database schemas → `.planning/memory/database-schemas.md`
   - Map ALL API routes/controllers → `.planning/memory/api-routes.md`
   - Map ALL services/dependencies → `.planning/memory/service-graph.md`
   - Map frontend (if applicable) → `.planning/memory/frontend-map.md`
   - Inventory tech stack → `.planning/memory/tech-stack.md`
   - Compress into `.planning/MEMORY.md`
3. **Select a council preset** based on complexity:
   - 🏗️ **Full Council (5):** Researcher → Architect → Planner → Executor → Reviewer
   - ⚡ **Rapid Council (3):** Researcher → Executor → Reviewer
   - 🐛 **Debug Council (3):** Investigator → Fixer → Verifier
   - 📐 **Architecture Council (3):** Researcher → Architect → Reviewer
   - 🔄 **Refactoring Council (4):** Researcher → Planner → Executor → Reviewer
   - 🔍 **Audit Council (4):** Security + Performance + Architecture → Synthesizer
4. Create `.planning/council/` directory structure
5. Write `council.json` with configuration
6. Create `BOARD.md` task board
7. Enter **Manager role** and make first routing decision

### Resuming (`resume`)
1. Read `.planning/council/council.json`
2. Read `.planning/MEMORY.md` (project brain)
3. Read last message in `.planning/council/messages/`
4. Read the task board
5. Enter **Manager role** and determine next action

### Task Board (`board`)
Display `.planning/council/BOARD.md` with:
- Council members and their statuses
- Blocked / In-progress / Done tasks
- Recent routing decisions
- Progress bar

### Status (`status`)
Show:
- Council name, objective, preset
- Current active agent and task
- All agents and their states (active / idle / done)
- Routing log (last 10 decisions)
- Message count
- Memory Module staleness check

### Route (`route`)
Manually override Manager routing:
- Force-route next task to a specific agent
- Manager still provides Memory Module context in the routing message
- Useful for course-correcting or exploring alternatives

### Memory (`memory`)
Show Memory Module health:
- Which intelligence files exist
- Last updated timestamps
- Staleness warnings (>24h since last update)
- Missing coverage (tables/routes/services not documented)

## Manager Behavior

When in Manager role, the agent:

1. **Reads messages** from sub-agents (handoffs, questions, escalations)
2. **Consults Memory Module** for relevant context
3. **Makes routing decisions** — which agent should handle the next task
4. **Provides context** — pulls relevant schemas, routes, gotchas into routing messages
5. **Enforces quality gates** — verifies acceptance criteria before phase transitions
6. **Handles escalations** — provides guidance using deep project knowledge
7. **Updates the board** — maintains real-time task status

## Sub-Agent Behaviors

### 🔬 Researcher
- Search codebase in areas specified by Manager's routing
- Research external documentation/best practices
- Produce evidence-backed findings with file paths
- Write handoff message to Manager

### 📐 Architect
- Read research findings (via Manager routing)
- Design solution using Memory Module for schema/service context
- Document interfaces, data flows, breaking changes
- Can peer-communicate with Researcher for clarification
- Write handoff message to Manager

### 📋 Planner
- Read architecture design (via Manager routing)
- Decompose into atomic tasks with dependencies
- Group into execution waves
- Create task files in `.planning/council/tasks/`
- Write handoff message to Manager

### ⚙️ Executor
- Read task breakdown (via Manager routing)
- Implement tasks in wave order, run tests
- Can peer-communicate with Architect for design clarification
- Escalate blockers to Manager
- Write handoff message to Manager per wave

### 🔍 Reviewer
- Read ALL previous handoffs for full context
- Review code against architecture design
- Check security, performance, correctness
- Can peer-communicate with Executor and Architect
- Write review report to Manager

## Communication

Sub-agents communicate via structured messages in `.planning/council/messages/`:
- **📤 Handoff** — "I'm done, here's my work"
- **❓ Question** — To Manager or allowed peers
- **🚨 Escalation** — "I'm stuck" (always to Manager)
- **📊 Status** — Progress update to Manager
- **🔄 Request** — "I need specialist X" (to Manager for routing)

## Integration
- Memory Module persists across sessions in `.planning/memory/`
- Works with `/memory` command for cross-session continuity
- Council decisions logged to `.planning/decisions/DECISIONS.md`
- Council state tracked in `council.json` for seamless resume

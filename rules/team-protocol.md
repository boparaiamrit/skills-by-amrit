## 🎯 LLM Council Protocol

> Installed by skills-by-amrit. Enables Manager-orchestrated multi-agent coordination.

### When to Activate Council Mode

Activate the LLM Council when:
- Task spans multiple systems or modules
- Task requires research before implementation
- Task is complex enough to need structured phases
- User requests: "start a council", "use team mode", "team session", etc.

### The LLM Council Pattern

Unlike simple role-switching, the Council has a **Manager** with full project knowledge who orchestrates **specialist sub-agents**:

```
🎯 MANAGER (orchestrator)
  ├── 🔬 Researcher
  ├── 📐 Architect
  ├── 📋 Planner
  ├── ⚙️ Executor
  └── 🔍 Reviewer
```

### Council Presets

| Preset | Agents | Use When |
|--------|--------|----------|
| **Full Council** | Researcher → Architect → Planner → Executor → Reviewer | Complex multi-module features |
| **Rapid Council** | Researcher → Executor → Reviewer | Small features, clear requirements |
| **Debug Council** | Investigator → Fixer → Verifier | Bug investigation, production issues |
| **Architecture** | Researcher → Architect → Reviewer | Design decisions, tech evaluation |
| **Refactoring** | Researcher → Planner → Executor → Reviewer | Large-scale refactoring |

### Directory Structure

```
.planning/
├── MEMORY.md                    # Project brain (persistent memory)
├── memory/                      # Memory Module (codebase intelligence)
│   ├── codebase-map.md
│   ├── database-schemas.md
│   ├── api-routes.md
│   ├── service-graph.md
│   ├── frontend-map.md
│   └── tech-stack.md
├── council/                     # Active council state
│   ├── council.json            # Configuration + routing log
│   ├── BOARD.md                # Task board
│   ├── messages/               # Agent communications
│   ├── handoffs/               # Phase handoff documents
│   ├── tasks/                  # Task definitions
│   └── reviews/                # Review feedback
└── decisions/DECISIONS.md       # Decision log
```

### Protocol

#### Starting a Council
1. **Check Memory Module** — Create if missing, refresh if stale (>48h)
2. **Create** `.planning/council/` with `council.json` and `BOARD.md`
3. **Select preset** based on task complexity
4. **Enter Manager role** and route first task

#### Manager Responsibilities
- Load and consult Memory Module before every routing decision
- Provide relevant context (schemas, routes, gotchas) in routing messages
- Enforce quality gates at phase transitions
- Handle escalations with specific guidance
- Update BOARD.md after each routing

#### Sub-Agent Responsibilities
- Read Manager's routing message (includes Memory Module context)
- Execute specialist work
- Write structured message back to Manager (handoff, question, escalation, status)
- Can peer-communicate with allowed agents for quick alignment

#### Ending a Council
- Manager verifies objective is complete
- Update Memory Module with new schemas/routes/services
- Update MEMORY.md with council outcomes
- Update DECISIONS.md with key decisions
- Archive council to `.planning/council/_archive/`

### Message Format

All communications go to `.planning/council/messages/msg-NNN.md`:

```markdown
# Message #NNN
**From:** 🔬 researcher
**To:** 🎯 manager
**Type:** handoff | question | escalation | status | request
**Timestamp:** [DATE]

## Content
[Message content]

## Suggested Next Action
[What should happen next]
```

### Rules

- ALWAYS create/refresh Memory Module before council work
- ALWAYS route through Manager (except allowed peer-to-peer)
- ALWAYS write structured messages between agents
- ALWAYS enforce quality gates before phase transitions
- NEVER skip the Reviewer phase
- NEVER close council without updating Memory Module and MEMORY.md

---
name: orchestrate
description: "Chain multiple agents in sequence with structured handoffs for complex multi-step tasks."
disable-model-invocation: true
argument-hint: "[chain: feature|bugfix|refactor|security] [task-description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Task
---

# /orchestrate — Agent Chain Orchestration

Chain multiple specialist agents in sequence with structured handoff documents. Each agent builds on the previous agent's output.

## Predefined Chains

| Chain | Agents | Use Case |
|-------|--------|----------|
| `feature` | researcher → planner → executor → reviewer → verifier | New feature implementation |
| `bugfix` | debugger → planner → executor → verifier | Bug investigation and fix |
| `refactor` | mapper → planner → executor → reviewer | Code restructuring |
| `security` | mapper → investigator → reviewer | Security assessment |

## Instructions

### Step 1: Parse Arguments

From `$ARGUMENTS`, extract:
- **Chain:** `feature`, `bugfix`, `refactor`, or `security`
- **Task description:** What needs to be done

If no chain specified, infer from the task description:
- Bug/error/fix keywords → `bugfix`
- Refactor/restructure/reorganize → `refactor`
- Security/vulnerability/audit → `security`
- Everything else → `feature`

### Step 2: Initialize Orchestration

```bash
mkdir -p .planning/orchestration
```

Create `.planning/orchestration/[task-slug]-chain.md`:

```markdown
# Orchestration: [task description]

**Chain:** [chain type]
**Agents:** [agent1] → [agent2] → [agent3] → ...
**Started:** [ISO timestamp]
**Status:** In Progress

## Handoffs
[Will be populated as agents complete]
```

### Step 3: Execute Agent Chain

For each agent in the chain:

#### 3a: Brief the Agent

Provide the agent with:
- The original task description
- The handoff document from the previous agent (if any)
- The agent's specific role and expected output

#### 3b: Run the Agent

Spawn the agent as a subagent using Task:

**Researcher Agent:**
- Investigate the codebase, dependencies, existing patterns
- Output: Research findings, relevant files, constraints identified

**Planner Agent:**
- Create an implementation plan based on research
- Output: Task breakdown, file changes, acceptance criteria

**Executor Agent:**
- Implement the plan
- Output: Files modified, implementation summary

**Reviewer Agent:**
- Review the implementation for quality, patterns, edge cases
- Output: Issues found, suggestions, approval/rejection

**Verifier Agent:**
- Run tests, check requirements, validate completion
- Output: Verification results, pass/fail

**Debugger Agent:**
- Investigate the bug, find root cause
- Output: Root cause analysis, reproduction steps, fix strategy

**Mapper Agent:**
- Map relevant codebase areas, understand architecture
- Output: Codebase map, dependency graph, hotspots

**Investigator Agent (Security):**
- Scan for vulnerabilities, check auth, validate inputs
- Output: Security findings with severity

#### 3c: Capture Handoff Document

After each agent completes, create a structured handoff:

```markdown
## Handoff: [Agent Name] → [Next Agent Name]

### Context
[What was this agent asked to do]

### Findings
[Key discoveries, decisions made, artifacts produced]

### Files Modified
[List of files created or changed by this agent]

### Open Questions
[Unresolved items the next agent should address]

### Recommendations
[What the next agent should focus on or be aware of]
```

Append handoff to the orchestration document.

### Step 4: Gate Checks Between Agents

Between each agent handoff, evaluate:

1. **Should we continue?** — Did the agent produce usable output?
2. **Are there blockers?** — Did the agent surface issues that prevent the next step?
3. **Scope check** — Is the work still within the original task scope?

If a gate check fails:
- Record the blocker
- Present options: "Resolve blocker and continue / Abort chain / Skip this agent"

### Step 5: Final Output

After the last agent completes, generate the final orchestration report:

```markdown
## Orchestration Complete: [task]

**Chain:** [type]
**Agents:** [count] agents executed
**Duration:** [total time]
**Verdict:** SHIP / NEEDS WORK / BLOCKED

### Agent Results
| # | Agent | Status | Key Output |
|---|-------|--------|-----------|
| 1 | Researcher | Done | [summary] |
| 2 | Planner | Done | [summary] |
| 3 | Executor | Done | [summary] |
| 4 | Reviewer | Done | [summary] |
| 5 | Verifier | Done | [summary] |

### Verdict Criteria
- **SHIP** — All agents passed, tests green, reviewer approved
- **NEEDS WORK** — Reviewer or verifier found issues that need fixing
- **BLOCKED** — A gate check failed, external dependency needed

### Handoff Chain
[Full chain of handoff documents]

### Files Modified (Total)
[Aggregate list of all files modified across all agents]

### Next Steps
- [If SHIP] Run `/commit` to save changes
- [If NEEDS WORK] Fix issues: [list], then re-run affected agents
- [If BLOCKED] Resolve: [blocker description]
```

### Step 6: Update State

If `.planning/STATE.md` exists, append:
```markdown
### Orchestration: [chain] — [task]
- **Status:** SHIP/NEEDS WORK/BLOCKED
- **Agents:** [count] executed
- **Date:** [timestamp]
```

Save full orchestration report to `.planning/orchestration/[task-slug]-chain.md`.

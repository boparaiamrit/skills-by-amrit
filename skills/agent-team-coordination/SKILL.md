---
name: agent-team-coordination
description: "Multi-agent council using real subagent spawning (Task() tool), deterministic CLI state management, and file-based handoffs. Orchestrator stays lean while specialists execute in fresh contexts."
---

# Multi-Agent Council — Agent Team Coordination

> Production-grade multi-agent coordination using **real subagent spawning** via Task(), **deterministic CLI** for all structural operations, and **file-based handoffs** between agents. Each agent runs in its own fresh 200k context. The orchestrator stays lean (~10-15% context usage).

## Iron Law

```
Every council operation that touches file naming, numbering, state transitions,
or validation MUST go through the planning-tools CLI. Agents execute —
the CLI manages structure.
```

This is non-negotiable. LLMs cannot reliably handle sequential numbering, state machine transitions, or structural validation. The CLI does this deterministically. Agents focus on what LLMs are good at: reasoning, writing, and analysis.

## When to Use

Activate council coordination when:
- Task spans 3+ files or 2+ systems
- Task requires research before implementation
- Task benefits from independent specialist perspectives
- Context would exceed 50% for a single session
- User requests: "start a council", "use team mode", "team session"

Do NOT use when:
- Task is a single-file change with clear requirements
- Task is a quick bug fix with obvious cause
- User explicitly wants a single-session approach

## Anti-Shortcut Rules

These are hard constraints. No exceptions without explicit user override.

| # | Rule | Why |
|---|------|-----|
| 1 | YOU CANNOT skip CLI commands and create council files manually | CLI enforces naming, numbering, and format. Manual creation causes state drift. |
| 2 | YOU CANNOT role-switch in a single session instead of spawning agents | Context burns fast, quality degrades, no isolation between perspectives. |
| 3 | YOU CANNOT advance state without a validated handoff | Unvalidated handoffs propagate errors to downstream agents. |
| 4 | YOU CANNOT skip quality gates (use `--force` only with user permission) | Gates catch 80% of handoff quality issues before they compound. |
| 5 | YOU CANNOT let agents communicate directly | All handoffs go through files. This is the ONLY reliable state transfer. |
| 6 | YOU CANNOT manually edit BOARD.md | Board is generated output. CLI regenerates it from state. |

## Common Rationalizations

| Thought | Reality |
|---------|---------|
| "I can just role-play all agents in one session" | Context burns fast, quality degrades, no parallelism, no isolation |
| "File handoffs are unnecessary overhead" | They're the ONLY reliable state transfer between fresh contexts |
| "The CLI is unnecessary ceremony" | LLMs cannot reliably number files, validate structure, or manage state machines |
| "I'll skip the gate check — the handoff looks fine" | Gates catch structural issues your pattern-matching missed |
| "One long session is faster than spawning agents" | Fresh 200k contexts produce dramatically better output per agent |
| "I'll just create the message file myself" | You WILL get the numbering wrong eventually. The CLI won't. |

## Iron Questions

Before starting a council, answer these:

1. **Is this actually complex enough for a council?** (If a single session can handle it in <30% context, skip the council.)
2. **Which preset fits?** (Don't default to Full — most tasks need Rapid or Debug.)
3. **Does a Memory Module exist?** (If not, the first agent must be a mapper.)
4. **What is the concrete deliverable?** (Councils without clear objectives meander.)

## Directory Structure

```
.planning/
├── MEMORY.md                    # Persistent cross-session memory
├── memory/                      # Memory Module (codebase intelligence)
│   ├── codebase-map.md
│   ├── database-schemas.md
│   ├── api-routes.md
│   ├── service-graph.md
│   ├── frontend-map.md
│   └── tech-stack.md
├── council/                     # Active council state
│   ├── STATE.md                # State machine (CLI-managed, never hand-edit)
│   ├── BOARD.md                # Task board (CLI-generated, never hand-edit)
│   ├── messages/               # Routing messages (CLI-created)
│   │   └── msg-001.md
│   ├── handoffs/               # Agent handoff documents (CLI-validated)
│   │   └── handoff-001-researcher.md
│   └── gates/                  # Gate check results (CLI-generated)
│       └── gate-001-research.md
└── decisions/DECISIONS.md       # Decision log
```

## The Process

### Phase 1: Council Initialization

```bash
# Initialize council with a preset
council init --preset full --objective "Implement user authentication system"

# Available presets: full, rapid, debug, architecture, refactoring, audit
```

This creates `.planning/council/` with STATE.md, BOARD.md, and the agent sequence.

If no Memory Module exists (`.planning/memory/` is missing or stale >48h):

```bash
# Spawn mapper agent to create Memory Module
Task("Map the codebase and create Memory Module files in .planning/memory/.
      Scan: project structure, database schemas, API routes, service dependencies,
      frontend components, tech stack. Write one file per category.")
```

Wait for mapper to complete before proceeding. Every subsequent agent needs this context.

### Phase 2: Agent Execution Loop

For each agent in the preset sequence:

**Step 1 — Create routing message:**
```bash
council message --to researcher --task "Analyze authentication patterns in codebase" \
  --context "memory/api-routes.md,memory/service-graph.md"
```

The CLI creates `messages/msg-NNN.md` with proper numbering and format.

**Step 2 — Spawn the agent:**
```
Task("You are the RESEARCHER agent for this council.

READ these files:
- .planning/council/messages/msg-001.md (your assignment)
- .planning/memory/api-routes.md (context)
- .planning/memory/service-graph.md (context)

EXECUTE your research task as described in the message.

WRITE your findings to: .planning/council/handoffs/handoff-001-researcher.md

Your handoff MUST include these sections:
## Summary
## Findings
## Risks & Concerns
## Recommendations for Next Agent
## Files Examined")
```

Each agent gets a fresh 200k context. Pass file paths, not file contents.

**Step 3 — Validate the handoff:**
```bash
council handoff --validate handoff-001-researcher.md
```

CLI checks: file exists, required sections present, non-empty content.

**Step 4 — Check quality gate:**
```bash
council gate-check --phase research
```

CLI evaluates gate criteria for the current phase. Returns PASS or FAIL with reasons.

If gate fails:
```bash
# Option A: Respawn agent with feedback
council message --to researcher --task "Gate failed: missing risk analysis. Revise handoff."
# Then respawn agent...

# Option B: Force advance (requires user permission)
council advance --force --reason "User approved: risk analysis deferred to architect"
```

**Step 5 — Advance state:**
```bash
council advance
```

Moves state machine to next agent. Only works after gate passes (or `--force`).

**Step 6 — Regenerate board:**
```bash
council board
```

Rebuilds BOARD.md from current state. Shows completed phases, current agent, remaining work.

**Repeat steps 1-6 for each agent in sequence.**

### Phase 3: Review & Synthesis

The final agent (always a reviewer) examines all previous handoffs:

```
Task("You are the REVIEWER agent for this council.

READ these files:
- .planning/council/messages/msg-NNN.md (your assignment)
- ALL files in .planning/council/handoffs/ (previous agent work)
- Relevant .planning/memory/ files

REVIEW all handoffs for:
- Completeness against the original objective
- Consistency between agents' recommendations
- Gaps or contradictions
- Quality of implementation (if executor was involved)

WRITE your review to: .planning/council/handoffs/handoff-NNN-reviewer.md

Include: ## Verdict (APPROVE / REVISE / REJECT), ## Issues Found, ## Final Recommendations")
```

After reviewer completes:

```bash
council handoff --validate handoff-NNN-reviewer.md
council gate-check --phase review
council advance  # Moves to COMPLETE state
council board    # Final board showing all phases done
```

Update persistent memory with council outcomes:
- Update `.planning/MEMORY.md` with decisions made
- Update `.planning/memory/` if codebase structure changed
- Archive council if desired

## Council Presets

| Preset | Agents | Use When |
|--------|--------|----------|
| **Full** (5) | researcher -> architect -> planner -> executor -> reviewer | Complex multi-module features, new systems |
| **Rapid** (3) | researcher -> executor -> reviewer | Small features with clear requirements |
| **Debug** (3) | investigator -> fixer -> verifier | Bug investigation, production issues |
| **Architecture** (3) | researcher -> architect -> reviewer | Design decisions, tech evaluation, RFC |
| **Refactoring** (4) | researcher -> planner -> executor -> reviewer | Large-scale refactoring, migrations |
| **Audit** (3) | researcher -> mapper -> reviewer | Codebase audit, security review, dependency analysis |

### Choosing a Preset

- **Default to Rapid** unless complexity justifies more agents.
- **Use Full** only when architecture decisions AND implementation are both needed.
- **Use Debug** for any bug that isn't immediately obvious.
- **Use Architecture** when the deliverable is a design document, not code.
- **Use Refactoring** when touching >10 files with structural changes.
- **Use Audit** when the goal is understanding, not changing.

## Memory Module

The Memory Module lives in `.planning/memory/` and provides codebase intelligence to every agent.

### Files

| File | Contains |
|------|----------|
| `codebase-map.md` | Project structure, key directories, entry points |
| `database-schemas.md` | Tables, relationships, migrations |
| `api-routes.md` | Endpoints, methods, auth requirements |
| `service-graph.md` | Service dependencies, data flow |
| `frontend-map.md` | Components, pages, state management |
| `tech-stack.md` | Languages, frameworks, versions, tooling |

### Rules

- Created by mapper agent at council start if missing
- Refreshed if >48 hours old
- Passed to each agent as context file paths
- Updated after council if codebase structure changed
- Not every file is needed — pass only relevant ones to each agent

## Quality Gates

Gates are checked by the CLI, not by LLM judgment.

| Transition | Gate Criteria |
|------------|--------------|
| Research -> Design | Findings documented, risks identified, alternatives compared |
| Design -> Planning | Architecture documented, interfaces defined, breaking changes noted |
| Planning -> Execution | Tasks are atomic (<30min each), dependencies explicit, acceptance criteria set |
| Execution -> Review | All tasks addressed, tests pass, no unresolved TODOs |
| Review -> Complete | Critical issues resolved, Memory Module updated if needed |

## Orchestrator Guidelines

The orchestrator (you, the main session) must stay lean:

- **DO** read handoffs to understand progress
- **DO** use CLI commands for all structural operations
- **DO** pass file paths to agents, not file contents
- **DO** keep your own context under 15% — let agents do the heavy lifting
- **DON'T** do agent work yourself — spawn a Task()
- **DON'T** hold agent outputs in your context — they're in files
- **DON'T** manually create or edit any file in `.planning/council/`

### Spawning Agents Effectively

Good agent prompt structure:
```
Task("You are the [ROLE] agent for this council.

READ: [list of file paths]
EXECUTE: [clear description of what to do]
WRITE: [exact output file path]
FORMAT: [required sections in output]")
```

Bad agent prompt:
```
Task("Look at the codebase and figure out what needs to happen for auth.")
```

Be specific. Agents have fresh contexts — they know nothing except what you tell them.

## Red Flags

Stop and reassess if you observe:

| Red Flag | What's Wrong |
|----------|-------------|
| Single session handling multiple agent roles | You're role-switching, not spawning. Quality will degrade. |
| Manual file creation in `.planning/council/` | CLI exists for a reason. State will drift. |
| No handoff validation between agents | Garbage in, garbage out. Validate before advancing. |
| Orchestrator context >50% | You're doing agent work. Spawn instead. |
| Agents referencing work without file paths | Hallucination risk. Always pass explicit paths. |
| Skipping gate checks | You're trusting vibes over structure. |
| BOARD.md manually edited | Board is generated output. Use `council board`. |

## Error Recovery

| Issue | Recovery |
|-------|----------|
| Agent produces empty/garbage handoff | Respawn with clearer instructions and more context files |
| Gate check fails | Read failure reason, fix handoff or `--force` with user permission |
| STATE.md corrupted | `council init --recover` rebuilds from handoffs/ and messages/ |
| Memory Module stale | Spawn mapper agent to refresh before continuing |
| Agent stuck on wrong task | New routing message with correction, respawn agent |
| Council objective changed mid-flight | `council update --objective "new objective"`, reassess remaining agents |

## Integration

- **Uses:** `persistent-memory` (Memory Module creation and updates), `systematic-debugging` (debug preset), `codebase-mapping` (mapper agent)
- **Feeds into:** `executing-plans` (executor agent output), `verification-before-completion` (reviewer agent output)
- **CLI dependency:** `planning-tools` must be available for all `council` commands

## Quick Reference

```bash
# Full lifecycle
council init --preset rapid --objective "Add rate limiting to API"
council message --to researcher --task "..." --context "memory/api-routes.md"
# [spawn researcher via Task()]
council handoff --validate handoff-001-researcher.md
council gate-check --phase research
council advance
council board
council message --to executor --task "..." --context "memory/api-routes.md,handoffs/handoff-001-researcher.md"
# [spawn executor via Task()]
council handoff --validate handoff-002-executor.md
council gate-check --phase execution
council advance
council board
council message --to reviewer --task "..." --context "handoffs/"
# [spawn reviewer via Task()]
council handoff --validate handoff-003-reviewer.md
council gate-check --phase review
council advance
council board
# Done — update MEMORY.md with outcomes
```

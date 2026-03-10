## Multi-Agent Council Protocol

> Installed by skills-by-amrit. Deterministic CLI-driven multi-agent coordination with file-based handoffs.

### Core Principle

Agents reason and write. The CLI manages structure. Never mix these responsibilities.

### When to Activate Council Mode

Activate the council when:
- Task spans 3+ files or 2+ systems
- Task requires research before implementation
- Task benefits from independent specialist perspectives
- User requests: "start a council", "use team mode", "team session"

### Architecture

```
ORCHESTRATOR (main session, stays lean ~10-15% context)
  │
  ├── council CLI ──── STATE.md, BOARD.md, messages/, handoffs/, gates/
  │
  └── Task() spawns ── researcher, architect, planner, executor, reviewer
                        (each in fresh 200k context)
```

- Orchestrator uses CLI for all structural operations
- Orchestrator spawns agents via Task() with file paths
- Agents read files, execute their role, write handoff files
- CLI validates everything between agent runs

### Council Presets

| Preset | Agents | Use When |
|--------|--------|----------|
| **Full** (5) | researcher -> architect -> planner -> executor -> reviewer | Complex multi-module features |
| **Rapid** (3) | researcher -> executor -> reviewer | Small features, clear requirements |
| **Debug** (3) | investigator -> fixer -> verifier | Bug investigation |
| **Architecture** (3) | researcher -> architect -> reviewer | Design decisions |
| **Refactoring** (4) | researcher -> planner -> executor -> reviewer | Large-scale refactoring |
| **Audit** (3) | researcher -> mapper -> reviewer | Codebase audit |

### Message Protocol

All messages created via CLI. No manual creation.

```bash
council message --to <agent> --task "<description>" --context "<file1>,<file2>"
```

- CLI assigns sequential numbering (`msg-001.md`, `msg-002.md`, ...)
- CLI enforces message format (From, To, Task, Context Files)
- Messages live in `.planning/council/messages/`
- Orchestrator creates messages; agents read them

### Handoff Protocol

Agents write handoffs. CLI validates them.

```bash
# After agent completes and writes handoff file:
council handoff --validate handoff-NNN-agent.md
```

- Handoffs live in `.planning/council/handoffs/`
- Required sections: Summary, Findings/Work Done, Recommendations for Next Agent
- CLI checks: file exists, sections present, non-empty content
- No advancement without validated handoff

### Gate Protocol

Quality gates checked by CLI between phases.

```bash
council gate-check --phase <phase>
```

- Gates are deterministic checks, not LLM judgment
- Must pass before `council advance`
- `--force` available for user override only (never self-override)
- Gate results logged in `.planning/council/gates/`

| Transition | Gate Checks |
|------------|-------------|
| Research -> Design | Findings documented, risks identified |
| Design -> Planning | Architecture documented, interfaces defined |
| Planning -> Execution | Tasks atomic, dependencies explicit |
| Execution -> Review | Tasks addressed, no unresolved TODOs |
| Review -> Complete | Critical issues resolved |

### State Protocol

State machine managed exclusively by CLI.

```bash
council advance        # Move to next agent (requires gate pass)
council advance --force --reason "..."  # Override (user permission only)
```

- STATE.md is CLI-managed — never hand-edit
- State transitions are: init -> agent1 -> agent2 -> ... -> complete
- Cannot skip agents in sequence
- Cannot go backwards (start new council instead)

### Board Protocol

Board is generated output, never manually edited.

```bash
council board          # Regenerate from current state
```

- Run after every `council advance`
- Shows: completed phases, current agent, remaining work
- BOARD.md is in `.planning/council/`

### Agent Spawning Protocol

Spawn each agent via Task() with explicit instructions:

```
Task("You are the [ROLE] agent for this council.

READ: [list of specific file paths]
EXECUTE: [clear task description]
WRITE: [exact output file path]
FORMAT: [required sections]")
```

Rules:
- Pass file paths, not file contents
- One agent per Task() call
- Wait for agent to complete before advancing
- Never do agent work in the orchestrator session

### Hard Rules

1. **ALL structural operations go through CLI** — messages, handoffs, gates, state, board
2. **ALL agent work happens in spawned Task() calls** — never role-switch in main session
3. **ALL handoffs are validated before advancement** — no exceptions without `--force`
4. **ALL gates are checked before advancement** — no exceptions without `--force`
5. **NEVER manually create or edit files in `.planning/council/`**
6. **NEVER skip the reviewer agent** — every preset ends with review
7. **NEVER let orchestrator context exceed 50%** — spawn agents for heavy work

### Memory Module

- Lives in `.planning/memory/`
- Created by mapper agent if missing
- Refreshed if >48 hours old
- Passed to agents as context file paths
- Updated after council if codebase changed

### Error Recovery

| Issue | Recovery |
|-------|----------|
| Agent produces bad handoff | Respawn with clearer instructions |
| Gate fails | Fix handoff or `--force` with user permission |
| STATE.md corrupted | `council init --recover` |
| Memory Module stale | Spawn mapper agent to refresh |

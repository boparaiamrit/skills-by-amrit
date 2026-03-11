---
description: Chain multiple specialist agents in sequence with structured handoff documents and gate checks between steps
---

<purpose>
Multi-agent orchestration engine that chains specialist agents for complex tasks. Predefined chains: feature (researcher→planner→executor→reviewer→verifier), bugfix (debugger→planner→executor→verifier), refactor (mapper→planner→executor→reviewer), security (mapper→investigator→reviewer). Structured handoff documents pass context between agents. Gate checks between steps ensure quality. Final verdict: SHIP / NEEDS WORK / BLOCKED.
</purpose>

<process>

<step name="parse_arguments">
Extract from `$ARGUMENTS`:

- **Chain type** — `feature`, `bugfix`, `refactor`, or `security`
- **Task description** — What needs to be accomplished

If no chain type specified, infer from keywords:
- Bug, error, fix, crash, broken → `bugfix`
- Refactor, restructure, reorganize, extract, simplify → `refactor`
- Security, vulnerability, audit, auth, injection → `security`
- Default → `feature`

Chain definitions:
```
feature:  researcher → planner → executor → reviewer → verifier
bugfix:   debugger → planner → executor → verifier
refactor: mapper → planner → executor → reviewer
security: mapper → investigator → reviewer
```
</step>

<step name="initialize">
```bash
mkdir -p .planning/orchestration
```

Create orchestration tracking file `.planning/orchestration/{task-slug}-chain.md`:

```markdown
# Orchestration: {task description}

**Chain:** {chain type}
**Agents:** {agent1} → {agent2} → {agent3} → ...
**Started:** {ISO timestamp}
**Status:** In Progress

## Handoffs
```

Initialize in-memory state:
```
current_agent_index = 0
handoffs = []
files_modified_total = []
verdict = "pending"
```
</step>

<step name="execute_chain">
For each agent in the chain, execute steps 3a through 3d:

**3a: Prepare agent brief**

Construct the agent's input:
```markdown
## Agent Brief: {agent_role}

### Original Task
{task description from user}

### Your Role
{role-specific instructions — see agent_roles below}

### Previous Handoff
{handoff document from previous agent, or "You are the first agent in the chain." if first}

### Expected Output
{what this agent should produce — see agent_roles below}
```

**3b: Spawn agent via Task**

Use the Task tool to spawn the agent as a subagent. Each agent has access to the codebase and the handoff from the previous agent.

**3c: Capture agent output and create handoff document**

After the agent completes, structure its output as a handoff:

```markdown
## Handoff: {current_agent} → {next_agent}

### Context
{What was this agent asked to do and why}

### Findings
{Key discoveries, decisions, artifacts — the substance of the work}

### Files Modified
{Specific files created, modified, or deleted}

### Open Questions
{Unresolved items, ambiguities, decisions deferred to next agent}

### Recommendations
{Specific guidance for the next agent based on findings}
```

Append handoff to the orchestration tracking file.
Add any modified files to `files_modified_total`.

**3d: Gate check before proceeding to next agent**

Evaluate:
1. **Output quality** — Did the agent produce actionable output? (Not empty, not just errors)
2. **Blockers** — Did the agent surface blockers that prevent the next step?
3. **Scope** — Is the work still within the original task boundaries?

If gate check fails:
- Set verdict to "BLOCKED" with reason
- Present to user: "Gate check failed after {agent}. Reason: {reason}. Options: resolve and continue / abort / skip to next agent"
- Wait for user decision

If gate check passes: proceed to next agent.
</step>

<step name="agent_roles">
Agent role definitions:

**Researcher** (feature chain):
- Investigate codebase structure, find relevant files and patterns
- Identify constraints, dependencies, and existing conventions
- Output: research findings, relevant file list, constraints, recommended approach

**Planner** (feature, bugfix, refactor chains):
- Create a structured implementation plan based on prior findings
- Break work into ordered tasks with file changes and acceptance criteria
- Output: task list, file change plan, risk assessment, estimated scope

**Executor** (feature, bugfix, refactor chains):
- Implement the plan by writing/modifying code
- Follow existing codebase patterns and conventions
- Output: implementation summary, files modified, tests added

**Reviewer** (feature, refactor, security chains):
- Review code changes for quality, patterns, edge cases, security
- Check for missed error handling, type safety, test coverage
- Output: issues found (with severity), suggestions, approval or rejection

**Verifier** (feature, bugfix chains):
- Run automated checks (build, test, lint, types)
- Verify implementation against acceptance criteria
- Output: verification results, pass/fail per criterion

**Debugger** (bugfix chain):
- Investigate the bug: reproduce, isolate, find root cause
- Trace through code execution, check logs, analyze stack traces
- Output: root cause analysis, reproduction steps, fix strategy

**Mapper** (refactor, security chains):
- Map relevant codebase areas, understand architecture and data flow
- Identify coupling, hotspots, dependency chains
- Output: codebase map, architecture summary, areas of concern

**Investigator** (security chain):
- Scan for security vulnerabilities: injection, auth bypass, data exposure
- Check input validation, output encoding, access control
- Output: security findings with severity, affected files, remediation steps
</step>

<step name="determine_verdict">
After the last agent completes, determine final verdict:

**SHIP** — All conditions met:
- All agents completed successfully
- No open blockers
- Tests pass (if verifier was in chain)
- Reviewer approved (if reviewer was in chain)

**NEEDS WORK** — Partial success:
- Most agents completed but reviewer or verifier found fixable issues
- No critical blockers, but improvements needed before shipping

**BLOCKED** — Cannot proceed:
- A gate check failed
- External dependency needed
- Critical issue found that requires user decision
</step>

<step name="generate_report">
Write final report to `.planning/orchestration/{task-slug}-chain.md` and present:

```
## Orchestration Complete: {task}

**Chain:** {chain type}
**Agents executed:** {count}/{total}
**Duration:** {total elapsed time}
**Verdict:** SHIP / NEEDS WORK / BLOCKED

### Agent Results
| # | Agent | Status | Key Output |
|---|-------|--------|-----------|
| 1 | {agent} | {Done/Failed/Skipped} | {one-line summary} |
| 2 | {agent} | {Done/Failed/Skipped} | {one-line summary} |
...

### Files Modified (Aggregate)
{Deduplicated list of all files modified across all agents}

### Handoff Chain Summary
{For each handoff: one-line summary of key findings passed forward}

### Open Items
{Any unresolved questions or deferred decisions from any agent}

### Next Steps
- [If SHIP] Run `/quality-gate pre-pr` then `/commit`
- [If NEEDS WORK] Address: {specific issues list}
- [If BLOCKED] Resolve: {blocker description}
```
</step>

<step name="update_state">
If `.planning/STATE.md` exists, append:

```markdown
### Orchestration: {chain} — {task}
- **Verdict:** {SHIP / NEEDS WORK / BLOCKED}
- **Agents:** {completed}/{total}
- **Files modified:** {count}
- **Date:** {ISO timestamp}
- **Report:** `.planning/orchestration/{task-slug}-chain.md`
```
</step>

</process>

<handoff_quality>
Good handoffs:
- Specific findings with file paths and line references
- Clear recommendations the next agent can act on immediately
- Open questions that flag ambiguity rather than hiding it

Bad handoffs:
- Vague summaries: "Looked at the code, seems fine"
- Missing context: Findings without explanation of WHY they matter
- No recommendations: Leaving the next agent to re-discover what to focus on
</handoff_quality>

<success_criteria>
- [ ] Chain type determined (feature/bugfix/refactor/security)
- [ ] Orchestration tracking file created
- [ ] Each agent briefed with task + previous handoff
- [ ] Each agent produced actionable output
- [ ] Structured handoff document created after each agent
- [ ] Gate checks passed between agents (or user resolved blockers)
- [ ] All handoffs recorded in orchestration file
- [ ] Final verdict determined (SHIP / NEEDS WORK / BLOCKED)
- [ ] Aggregate file list compiled across all agents
- [ ] Final report written to .planning/orchestration/
- [ ] STATE.md updated if exists
- [ ] Clear next steps presented based on verdict
</success_criteria>

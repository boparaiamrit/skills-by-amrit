<purpose>
Orchestrate a multi-agent council session where each specialist agent runs in its own fresh context,
coordinated through deterministic CLI commands and file-based handoffs.
</purpose>

<core_principle>
Orchestrator coordinates, agents execute. Each agent gets a fresh context window.
The orchestrator stays lean (~10-15% context) by reading only CLI JSON returns.
</core_principle>

<required_reading>
Read STATE.md or .planning/MEMORY.md before any operation to load project context.
</required_reading>

<process>

<step name="initialize_council" priority="first">
Initialize the council session and parse configuration:

```bash
INIT=$(node scripts/planning-tools.cjs council init "<objective>" --preset <preset>)
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `agents[]`, `current_phase`, `council_dir`, `preset`, `objective`, `session_id`.

**Presets:**

| Preset | Agents (in sequence) | Use Case |
|--------|---------------------|----------|
| `full` | Researcher → Architect → Planner → Executor → Reviewer | Complex features, multi-module impact |
| `rapid` | Researcher → Executor → Reviewer | Small features, clear requirements |
| `debug` | Investigator → Fixer → Verifier | Bug investigation, production issues |
| `architecture` | Researcher → Architect → Reviewer | Design decisions, tech evaluation |
| `refactoring` | Researcher → Planner → Executor → Reviewer | Large-scale refactoring |
| `audit` | Security Auditor + Performance Auditor + Architecture Auditor → Synthesizer | System audit, pre-launch review |

**If init fails:** Report error, suggest checking that `scripts/planning-tools.cjs` exists and supports the `council` command.

Report council overview:
```
## Council Session

**Objective:** {objective}
**Preset:** {preset}
**Agents:** {agent_count} specialists
**Estimated context per agent:** Fresh 200k each

| # | Agent | Role |
|---|-------|------|
| 1 | {agent_name} | {agent_role} |
| 2 | {agent_name} | {agent_role} |
...
```
</step>

<step name="load_memory_module">
Check for codebase intelligence files that agents may need:

```bash
MEMORY_FILES=""
if [ -d ".planning/memory" ]; then
  MEMORY_FILES=$(ls .planning/memory/*.md 2>/dev/null | tr '\n' ',')
fi
if [ -f ".planning/MEMORY.md" ]; then
  MEMORY_FILES="${MEMORY_FILES}.planning/MEMORY.md"
fi
```

If memory files exist, they will be passed to each agent's `<files_to_read>` block.
Orchestrator does NOT read these files — agents read them with their fresh context.
</step>

<step name="execute_agent_sequence">
For each agent in the council sequence:

**a) Announce the agent spawn:**

```
---
## Agent {N}/{total}: {agent_name}

**Role:** {agent_role_description}
**Receives:** {what this agent gets — objective, prior handoffs, memory files}
**Expected output:** {what this agent produces — analysis, design, plan, code, review}

Spawning...
---
```

**b) Create routing message via CLI:**

```bash
MSG=$(node scripts/planning-tools.cjs council message manager <agent> task --content "<routing instructions>")
if [[ "$MSG" == @file:* ]]; then MSG=$(cat "${MSG#@file:}"); fi
```

Parse JSON for: `message_id`, `path`.

**c) Spawn agent as a REAL subagent via Task():**

```
Task(
  subagent_type="<agent-name>",
  prompt="<objective>
    Execute your role as {agent_name} for the council session.

    Council objective: {objective}

    <files_to_read>
    Read these files at execution start using the Read tool:
    - {council_dir}/council.json (Council configuration and state)
    - {council_dir}/messages/msg-{latest}.md (Your routing instructions from Manager)
    - {previous_handoff_paths if any} (Prior agent findings — read all listed)
    - {memory_file_paths if any} (Codebase intelligence)
    - ./CLAUDE.md (Project instructions, if exists — follow project-specific guidelines)
    </files_to_read>

    <execution_instructions>
    1. Read all files listed above
    2. Execute your specialist role thoroughly
    3. Write your findings and deliverables
    4. When done, write your handoff to: {council_dir}/handoffs/handoff-{NNN}-{agent}.md

    Handoff format:
    ```markdown
    # Handoff: {agent_name}

    ## Summary
    [2-3 sentence summary of what was done]

    ## Key Findings
    [Bullet list of important discoveries/decisions/outputs]

    ## Files Produced
    [List of files created or modified with paths]

    ## Recommendations for Next Agent
    [What the next agent should focus on, watch out for, or build upon]

    ## Issues / Blockers
    [Any problems encountered or unresolved questions — or "None"]
    ```
    </execution_instructions>

    <success_criteria>
    - [ ] All routing instructions addressed
    - [ ] Handoff file written to {council_dir}/handoffs/
    - [ ] Key findings documented with evidence (file paths, code references)
    - [ ] Recommendations provided for downstream agents
    </success_criteria>
  </objective>"
)
```

Each agent gets a fresh 200k context — no context bleed from prior agents.

**d) After agent returns, create handoff via CLI:**

```bash
HANDOFF=$(node scripts/planning-tools.cjs council handoff <agent> --summary "<brief summary of agent output>")
if [[ "$HANDOFF" == @file:* ]]; then HANDOFF=$(cat "${HANDOFF#@file:}"); fi
```

Parse JSON for: `handoff_id`, `path`, `summary`.

**e) Report agent completion:**

```
---
## Agent {N}/{total}: {agent_name} — Complete

**Summary:** {brief summary from handoff}
**Handoff:** {handoff_path}
{If more agents: "Next: {next_agent_name}"}
---
```

**f) Check quality gate via CLI:**

```bash
GATE=$(node scripts/planning-tools.cjs council gate-check --from <current_agent> --to <next_agent>)
if [[ "$GATE" == @file:* ]]; then GATE=$(cat "${GATE#@file:}"); fi
```

Parse JSON for: `passed`, `reason`, `missing_items[]`.

**If gate passed:** Continue to next agent.

**If gate failed and `--auto` flag NOT set:**

```
## Quality Gate: FAILED

**From:** {current_agent} → **To:** {next_agent}
**Reason:** {reason}
**Missing:** {missing_items}
```

Use AskUserQuestion:
- header: "Gate Failed"
- question: "Quality gate failed between {current_agent} and {next_agent}. How to proceed?"
- options:
  - "Re-run {current_agent}" — Have the agent try again with gate feedback
  - "Skip gate" — Proceed anyway (not recommended)
  - "Abort council" — Stop the session

If "Re-run": Re-spawn agent with gate feedback appended to routing message.
If "Skip gate": Continue to next agent. Log gate skip.
If "Abort": Jump to `close_council` with partial status.

**If gate failed and `--auto` flag IS set:**
- Auto re-run the agent once with gate feedback
- If gate fails again after re-run, abort and report

**g) Advance council via CLI:**

```bash
ADV=$(node scripts/planning-tools.cjs council advance)
if [[ "$ADV" == @file:* ]]; then ADV=$(cat "${ADV#@file:}"); fi
```

Parse JSON for: `from`, `to`, `gate_result`.

**h) Regenerate board:**

```bash
node scripts/planning-tools.cjs council board
```
</step>

<step name="parallel_agents">
**For audit preset only:** Some agents run in parallel (Security + Performance + Architecture auditors).

When agents[] contains a parallel group (indicated by `parallel: true` in council.json):

1. Spawn ALL parallel agents simultaneously via multiple Task() calls
2. Wait for ALL to complete
3. Create handoff for each
4. Run gate check on the combined output
5. Advance to next sequential agent (Synthesizer)

```
# Spawn parallel agents simultaneously
Task(subagent_type="security-auditor", prompt="...", description="Security audit")
Task(subagent_type="performance-auditor", prompt="...", description="Performance audit")
Task(subagent_type="architecture-auditor", prompt="...", description="Architecture audit")
```

Each parallel agent's handoff is passed to the Synthesizer's `<files_to_read>`.
</step>

<step name="final_review">
After the last agent completes (usually Reviewer or Synthesizer):

1. **Collect all handoffs:**
```bash
SUMMARY=$(node scripts/planning-tools.cjs council summary)
if [[ "$SUMMARY" == @file:* ]]; then SUMMARY=$(cat "${SUMMARY#@file:}"); fi
```

2. **Generate council summary report:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 COUNCIL SESSION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Objective:** {objective}
**Preset:** {preset}
**Agents:** {completed_count}/{total_count} completed

| # | Agent | Status | Key Output |
|---|-------|--------|------------|
| 1 | {agent} | Complete | {one-liner from handoff} |
| 2 | {agent} | Complete | {one-liner from handoff} |
...

## Consolidated Findings
{Merged key findings from all handoffs}

## Action Items
{Actionable next steps extracted from handoffs}

## Files Produced
{All files created/modified across all agents}
```

3. **Update STATE.md** with council results (if STATE.md exists).

4. **Update Memory Module** (if `.planning/MEMORY.md` exists):
   - Append council decisions and key findings
   - Note any architectural changes discovered
</step>

<step name="close_council">
Close the council session:

```bash
node scripts/planning-tools.cjs council close --status <completed|partial|aborted>
```

**If partial or aborted:**
```
## Council Session: {status}

**Completed agents:** {list}
**Remaining agents:** {list}
**Reason:** {why stopped}

Handoffs so far are preserved in: {council_dir}/handoffs/
Resume with: /team resume
```
</step>

</process>

<context_efficiency>
Orchestrator: ~10-15% context. Each agent: fresh 200k. No polling (Task blocks). No context bleed between agents.

**What the orchestrator reads:**
- CLI JSON returns (small, structured)
- Agent completion status
- Gate check results

**What the orchestrator does NOT read:**
- Full handoff file contents (agents read prior handoffs themselves)
- Memory module files (agents read these themselves)
- Codebase files (agents handle this)
</context_efficiency>

<failure_handling>
- **Agent fails to return:** Report failure, ask user to re-run or skip
- **Agent produces no handoff file:** Treat as failure, offer re-run with explicit handoff instructions
- **Gate fails twice (auto mode):** Abort council, report partial results
- **Gate fails (interactive):** User chooses re-run, skip, or abort
- **CLI command fails:** Report the error, suggest manual workaround
- **All agents complete but objective not met:** Reviewer should catch this — if not, present findings and let user decide next steps
- **classifyHandoffIfNeeded bug:** If agent reports "failed" with this error, check if handoff file exists on disk. If yes, treat as success.
</failure_handling>

<resumption>
Council sessions can be resumed across context windows:

```bash
RESUME=$(node scripts/planning-tools.cjs council resume)
if [[ "$RESUME" == @file:* ]]; then RESUME=$(cat "${RESUME#@file:}"); fi
```

Parse JSON for: `session_id`, `objective`, `completed_agents[]`, `next_agent`, `handoff_paths[]`.

Resume picks up from the next uncompleted agent. All prior handoffs are preserved on disk and passed to the next agent's `<files_to_read>`.
</resumption>

<success_criteria>
- [ ] Council initialized with correct preset and agents
- [ ] Memory module paths identified and passed to agents
- [ ] Each agent spawned as real subagent with fresh context
- [ ] Each agent receives only what it needs via `<files_to_read>`
- [ ] Handoff files created for each agent
- [ ] Quality gates checked between agents
- [ ] Board updated after each agent
- [ ] Council summary generated after completion
- [ ] STATE.md updated with results
- [ ] All file paths are absolute or project-relative (no hardcoded paths)
</success_criteria>

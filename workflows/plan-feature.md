---
description: Create detailed implementation plans with compound init, structured output, task anatomy, wave assignment, and plan verification
---

<purpose>
Create executable phase plans with task breakdown, dependency analysis, wave-based execution grouping, and goal-backward verification. Plans are prompts — so detailed that any executor agent can implement them verbatim.
</purpose>

<required_reading>
Read STATE.md and ROADMAP.md before any operation to load project context.
</required_reading>

<process>

<step name="initialize" priority="first">
Load all context in one call:

```bash
INIT=$(node scripts/planning-tools.cjs init plan-phase "${PHASE_ARG}")
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `planner_model`, `checker_model`, `commit_docs`, `phase_found`, `phase_dir`, `phase_number`, `phase_name`, `phase_goal`, `phase_req_ids`, `has_context`, `has_research`, `state_exists`, `roadmap_exists`.

**If `phase_found` is false:** Error — phase not found in ROADMAP.md.
**If `state_exists` is false:** Error — project not initialized. Run `/init-project` first.

**Resolve model profile:**
```bash
MODEL=$(node scripts/planning-tools.cjs resolve-model planner)
```
</step>

<step name="gather_context">
Read all available context for this phase:

1. **ROADMAP.md** — Extract phase goal, success criteria, requirement IDs
2. **REQUIREMENTS.md** — Load full requirement descriptions for mapped REQ-IDs
3. **CONTEXT.md** (if exists) — User decisions from `/discuss`
   - Decisions marked "DECIDED" are LOCKED — plans MUST implement exactly
   - Decisions marked "RECOMMENDED" — treat as decided
   - Decisions marked "OPEN" — planner makes judgment call
4. **Research files** (if exists) — Domain research findings
5. **Existing plans** (if gap closure mode) — Previous plans and VERIFICATION.md gaps

Report context loaded:
```
## Planning Context

**Phase {X}: {Name}**
Goal: {goal}
Requirements: {REQ-IDs}
Context decisions: {count} locked, {count} open
Research: {available/none}
```
</step>

<step name="spawn_planner">
Spawn planner agent with structured context:

```
Task(
  subagent_type="planner",
  prompt="
    <planning_context>
    Phase: {phase_number} - {phase_name}
    Goal: {phase_goal}
    Requirements: {phase_req_ids}
    Mode: {standard | gap_closure | revision}
    </planning_context>

    <files_to_read>
    - .planning/ROADMAP.md (Phase goals and requirements)
    - .planning/REQUIREMENTS.md (Full requirement descriptions)
    - .planning/STATE.md (Current project state)
    - .planning/config.json (Project configuration)
    - {phase_dir}/CONTEXT.md (User decisions, if exists)
    - ./CLAUDE.md (Project instructions, if exists)
    </files_to_read>

    <output_spec>
    Create PLAN.md files in {phase_dir}/ with proper frontmatter:

    ---
    phase: {phase_number}
    plan: {plan_number}
    title: [Plan Title]
    wave: {wave_number}
    depends_on: [{dependency_plan_ids}]
    requirements: [{REQ-IDs this plan covers}]
    must_haves:
      truths:
        - [User-observable outcome 1]
        - [User-observable outcome 2]
      artifacts:
        - path: [file path]
          provides: [what it does]
      key_links:
        - from: [source file]
          to: [target file/endpoint]
          via: [connection method]
    ---

    Each task MUST have:
    - description: What this task builds
    - file_changes[]: Exact file paths created or modified
    - verification: Specific command to verify completion
    - done_when: Measurable acceptance criteria

    Task format:
    <task name="[title]" type="auto">
      <files>[exact paths]</files>
      <action>[specific implementation instructions with anti-patterns]</action>
      <verify>
        <automated>[test command]</automated>
      </verify>
      <done>[measurable criteria]</done>
    </task>

    Rules:
    - 2-3 tasks per plan (up to 5 for tightly coupled work)
    - Wave assignment based on dependency analysis
    - Every requirement must have covering task(s)
    - Plans should complete within ~50% context window
    </output_spec>

    <success_criteria>
    - [ ] All phase requirements have covering tasks
    - [ ] Every task has files, action, verify, done
    - [ ] Wave assignments are consistent with dependencies
    - [ ] No circular dependencies
    - [ ] Plans fit within context budget
    </success_criteria>
  "
)
```

**Handle planner return:**

- **PLANNING COMPLETE:** Proceed to plan verification
- **PLANNING BLOCKED:** Present blocker, work with user to resolve
</step>

<step name="run_plan_checker">
After planner creates PLAN.md files, verify them:

```
Task(
  subagent_type="verifier",
  prompt="
    <verification_context>
    Phase: {phase_number} - {phase_name}
    Phase Goal: {phase_goal}
    Phase Requirements: {phase_req_ids}
    Mode: plan_check (verify plans WILL achieve goal, not code)
    </verification_context>

    <files_to_read>
    - {phase_dir}/*-PLAN.md (Plans to verify)
    - .planning/ROADMAP.md (Phase goals)
    - .planning/REQUIREMENTS.md (Full requirements)
    - {phase_dir}/CONTEXT.md (User decisions, if exists)
    </files_to_read>

    <verification_dimensions>
    1. Requirement Coverage — every REQ-ID has covering task(s)
    2. Task Completeness — every task has files, action, verify, done
    3. Dependency Correctness — no cycles, valid references, wave consistency
    4. Key Links Planned — artifacts wired together, not just created
    5. Scope Sanity — 2-3 tasks/plan, plans fit context budget
    6. Context Compliance — locked decisions honored, deferred ideas excluded
    </verification_dimensions>

    <expected_output>
    Return one of:
    - ## VERIFICATION PASSED — all checks pass
    - ## ISSUES FOUND — structured issue list with fix hints
    </expected_output>
  "
)
```

**Handle checker return:**

- **VERIFICATION PASSED:** Proceed to commit
- **ISSUES FOUND:** Enter revision loop
</step>

<step name="revision_loop">
If checker finds issues, iterate planner and checker (max 3 iterations):

1. Send checker issues back to planner for revision
2. Planner updates PLAN.md files
3. Re-run checker
4. Repeat until passed or max iterations

**If max iterations reached:**
- Present remaining issues to user
- Offer: "Force proceed", "Provide guidance", or "Abandon"
</step>

<step name="commit_plans">
After verification passes:

```bash
git add {phase_dir}/*-PLAN.md
git commit -m "docs(phase-{X}): create execution plans ({N} plans, {W} waves)"
```

Update STATE.md with planning completion.
</step>

<step name="present_results">
```
## Planning Complete: Phase {X} — {Name}

**Plans:** {N} | **Waves:** {W} | **Requirements covered:** {R}/{total}

| Plan | Title | Wave | Tasks | Requirements |
|------|-------|------|-------|--------------|
| {phase}-01 | [title] | 1 | 3 | [REQ-IDs] |
| {phase}-02 | [title] | 1 | 2 | [REQ-IDs] |
| {phase}-03 | [title] | 2 | 2 | [REQ-IDs] |

### Execution Order
- **Wave 1:** {phase}-01, {phase}-02 (parallel)
- **Wave 2:** {phase}-03 (depends on Wave 1)

---

## Next Up

`/execute {phase}` — execute all plans

Also: `/verify {phase}` — verify after execution
```
</step>

</process>

<plan_quality_criteria>
Good plans have:
- **Specific tasks** — "Create POST /api/auth/login accepting {email, password}" not "Add authentication"
- **Anti-patterns in actions** — "Use jose (NOT jsonwebtoken — CommonJS issues with Edge runtime)"
- **Runnable verification** — `npm test -- tests/auth.test.ts` not "it works"
- **Measurable done criteria** — "Valid credentials return 200 + JWT cookie" not "auth is complete"
- **Wave-aware dependencies** — Wave 1 creates foundation, Wave 2 builds on it
- **Context-budget-aware scope** — 2-3 tasks per plan, ~50% context window
</plan_quality_criteria>

<success_criteria>
- [ ] Phase context loaded (goal, requirements, decisions)
- [ ] Planner spawned with structured context
- [ ] PLAN.md files created with proper frontmatter schema
- [ ] Every task has: description, file_changes[], verification, done_when
- [ ] Wave assignment based on dependency analysis
- [ ] Plan checker verified plans will achieve phase goal
- [ ] Revision loop completed (if issues found)
- [ ] Plans committed to git
- [ ] STATE.md updated
- [ ] User knows next step is `/execute`
</success_criteria>

---
description: Execute a small task quickly with single plan, atomic commit, and state tracking — no heavy orchestration
---

<purpose>
Quick task protocol for small changes. Single plan, single execution, atomic commit. Skips heavy orchestration (no waves, no verification agent, no subagent spawning).
</purpose>

<process>

<step name="initialize" priority="first">
Load context in one call:

```bash
INIT=$(node scripts/planning-tools.cjs init quick "${DESCRIPTION}")
if [[ "$INIT" == @file:* ]]; then INIT=$(cat "${INIT#@file:}"); fi
```

Parse JSON for: `project_exists`, `state_exists`, `has_plans`, `config`.

**If project not initialized:** Warn but continue — quick tasks work without full project setup.
</step>

<step name="understand_task">
Understand the task from the user's description:
- What needs to change?
- Why?
- What is NOT included? (scope boundary)

**Keep scope tight.** If the task requires more than ~3 file changes or involves architectural decisions, recommend `/plan-feature` instead.
</step>

<step name="quick_research">
Quick codebase research (2-3 minutes max):

```bash
# Find relevant files
grep -rn "[keyword]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -v node_modules | head -20
```

Read existing files to understand patterns before making changes.
</step>

<step name="pre_flight">
Pre-flight check:

```bash
git status --short
```

Detect test runner and run build check:
```bash
if [ -f "package.json" ]; then
  npm run build 2>&1 | tail -5
  npm test 2>&1 | tail -5
elif [ -f "pyproject.toml" ]; then
  pytest 2>&1 | tail -5
elif [ -f "Cargo.toml" ]; then
  cargo build 2>&1 | tail -5
fi
```

If pre-flight fails, STOP and report. Don't build on a broken foundation.
</step>

<step name="implement">
Implement the change following existing patterns:
- Match existing code style and conventions
- Minimal changes — don't refactor while doing a quick task
- Add tests if behavior changes
- Full type safety and error handling
- No TODOs, no placeholder code
</step>

<step name="verify">
Run verification:

```bash
if [ -f "package.json" ]; then
  npm run build 2>&1 | tail -5
  npm test 2>&1 | tail -5
  npm run lint 2>&1 | tail -5
elif [ -f "pyproject.toml" ]; then
  pytest 2>&1 | tail -5
elif [ -f "Cargo.toml" ]; then
  cargo build 2>&1 | tail -5
  cargo test 2>&1 | tail -5
fi
```

If verification fails, fix before proceeding.
</step>

<step name="commit">
**Atomic commit — stage specific files only (NEVER `git add -A`):**

```bash
git add [specific files changed]
git commit -m "{type}(quick): {concise description}

- {key change 1}
- {key change 2}"
```

Commit types: `feat`, `fix`, `refactor`, `chore`, `test`, `docs`.
</step>

<step name="update_state">
If `.planning/STATE.md` exists, update the quick tasks table:

```markdown
## Quick Tasks
| Date | Task | Status | Files |
|------|------|--------|-------|
| {date} | {description} | Done | {files changed} |
```
</step>

<step name="present_summary">
Present summary:

```
## Quick Task Complete

**Task:** {description}
**Files modified:** {list}
**Verification:** Build: Pass | Tests: Pass | Lint: Pass
**Commit:** {hash} — {message}

{If STATE.md exists: "State updated."}
```
</step>

</process>

<scope_guard>
Quick tasks are for:
- Bug fixes (1-3 files)
- Small feature additions (1-3 files)
- Config changes
- Documentation updates
- Dependency updates

NOT for:
- Multi-file architectural changes (use `/plan-feature`)
- New features requiring research (use `/research` then `/plan-feature`)
- Cross-cutting concerns (use `/plan-feature`)
</scope_guard>

<success_criteria>
- [ ] Task understood with clear scope boundary
- [ ] Quick codebase research completed
- [ ] Pre-flight checks passed
- [ ] Change implemented following existing patterns
- [ ] Verification passed (build, test, lint)
- [ ] Atomic commit with specific files (not git add -A)
- [ ] STATE.md quick tasks table updated (if exists)
- [ ] Summary presented to user
</success_criteria>

---
description: Create, verify, or list named progress checkpoints with git snapshots, file state, and test status
---

<purpose>
Named progress checkpoints that capture git state, file manifest, and test status at meaningful milestones. Three modes: CREATE (snapshot current state), VERIFY (compare against a checkpoint), LIST (show all checkpoints). Stored in .planning/checkpoints/ for cross-session tracking.
</purpose>

<process>

<step name="parse_arguments">
Parse `$ARGUMENTS` for mode and checkpoint name:

- `create [name]` → Create a new checkpoint with the given name
- `verify [name]` → Compare current state against the named checkpoint
- `list` → Show all existing checkpoints
- `[name]` (no mode) → Default to `create [name]`
- (empty) → Default to `list`

Checkpoint names must be kebab-case: `feature-start`, `core-done`, `tests-pass`, `refactored`, `pr-ready`.
</step>

<step name="ensure_directory">
```bash
mkdir -p .planning/checkpoints
```
</step>

<step name="mode_create" condition="mode == create">
**CREATE: Capture current state as a named checkpoint.**

**1. Capture git state:**
```bash
COMMIT=$(git rev-parse HEAD)
BRANCH=$(git branch --show-current)
git status --short
```

**2. Capture file snapshot:**
```bash
git ls-files -s | head -100
```

**3. Run tests:**
```bash
if [ -f "package.json" ]; then
  npm test 2>&1 | tail -15
elif [ -f "pyproject.toml" ]; then
  pytest 2>&1 | tail -15
elif [ -f "Cargo.toml" ]; then
  cargo test 2>&1 | tail -15
elif [ -f "go.mod" ]; then
  go test ./... 2>&1 | tail -15
fi
```

Record test result as: `pass`, `fail`, or `skip` (if no test runner detected).

**4. Check for dirty state:**
```bash
git status --short | wc -l
```

**5. Write checkpoint file** to `.planning/checkpoints/{name}.md`:

```markdown
---
name: {checkpoint-name}
created: {ISO timestamp}
commit: {full git hash}
branch: {branch name}
tests: pass|fail|skip
dirty_files: {count}
---

# Checkpoint: {name}

## Git State
- **Commit:** {hash}
- **Branch:** {branch}
- **Clean:** {yes if 0 dirty files, else no}
- **Dirty files:** {list or "none"}

## Test Status
- **Result:** {PASS / FAIL / SKIPPED}
- **Details:** {test output summary}

## Key Files
{List of files relevant to what this checkpoint represents}

## Context
{Brief description of what this checkpoint represents in the development flow}
```

**6. Confirm:**
```
Checkpoint created: {name}
  Commit: {short hash}
  Branch: {branch}
  Tests: {PASS/FAIL/SKIP}
  Stored: .planning/checkpoints/{name}.md
```
</step>

<step name="mode_verify" condition="mode == verify">
**VERIFY: Compare current state against a named checkpoint.**

**1. Load checkpoint:**
```bash
cat .planning/checkpoints/{name}.md
```

If checkpoint not found: error — "Checkpoint '{name}' not found. Run `/checkpoint list` to see available checkpoints."

**2. Extract checkpoint commit hash from frontmatter.**

**3. Compare git state:**
```bash
# Commits since checkpoint
git log --oneline {checkpoint_commit}..HEAD | head -20

# Files changed
git diff {checkpoint_commit} --stat
git diff {checkpoint_commit} --name-status
```

**4. Run current tests:**
```bash
if [ -f "package.json" ]; then npm test 2>&1 | tail -15; fi
```

**5. Compare results:**

| Aspect | At Checkpoint | Current | Delta |
|--------|--------------|---------|-------|
| Commit | {old} | {new} | {N commits ahead} |
| Tests | {old status} | {new status} | SAME / REGRESSION / IMPROVED |
| Dirty files | {old count} | {new count} | {+/-N} |

**6. Determine verdict:**
- **ON TRACK** — Tests still pass, progress made (commits ahead)
- **REGRESSION** — Tests were passing at checkpoint but now fail
- **DIVERGED** — Significant unexpected file changes outside scope

**7. Present comparison with verdict and file change list.**
</step>

<step name="mode_list" condition="mode == list">
**LIST: Show all checkpoints in chronological order.**

```bash
ls -t .planning/checkpoints/*.md 2>/dev/null
```

If no checkpoints: "No checkpoints found. Create one with `/checkpoint create [name]`."

For each checkpoint file:
1. Read the frontmatter (name, created, commit, tests)
2. Calculate files changed since that checkpoint: `git diff {commit} --stat | tail -1`

Present timeline table:

```
## Checkpoints

| # | Name | Date | Commit | Tests | Since Then |
|---|------|------|--------|-------|-----------|
| 1 | feature-start | {date} | {hash} | PASS | +45 files changed |
| 2 | core-done | {date} | {hash} | PASS | +12 files changed |
| 3 | tests-pass | {date} | {hash} | PASS | +3 files changed |

Current: {N} commits ahead of latest checkpoint ({name})
```
</step>

<step name="update_state">
If `.planning/STATE.md` exists, append checkpoint activity:

```markdown
### Checkpoint: {mode} {name}
- **Date:** {ISO timestamp}
- **Result:** {created / verified: ON TRACK|REGRESSION|DIVERGED / listed: N checkpoints}
```
</step>

</process>

<checkpoint_naming>
Recommended checkpoint names for common flows:

**Feature development:**
`feature-start` → `core-done` → `tests-pass` → `refactored` → `pr-ready`

**Bug fix:**
`repro-confirmed` → `root-cause-found` → `fix-applied` → `tests-pass`

**Refactoring:**
`baseline` → `extraction-done` → `wiring-updated` → `tests-green` → `cleanup-done`
</checkpoint_naming>

<success_criteria>
- [ ] Mode parsed correctly (create/verify/list)
- [ ] .planning/checkpoints/ directory exists
- [ ] CREATE: git state, file manifest, and test status captured
- [ ] CREATE: Checkpoint file written with frontmatter and structured content
- [ ] VERIFY: Checkpoint loaded and compared against current state
- [ ] VERIFY: Verdict determined (ON TRACK / REGRESSION / DIVERGED)
- [ ] LIST: All checkpoints shown in chronological order with delta info
- [ ] STATE.md updated if exists
- [ ] Clear confirmation or comparison presented to user
</success_criteria>

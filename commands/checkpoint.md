---
name: checkpoint
description: "Create or verify named progress checkpoints with git snapshots and test status."
disable-model-invocation: true
argument-hint: "[create|verify|list] [checkpoint-name]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# /checkpoint — Progress Checkpoints

Create, verify, or list named progress checkpoints. Each checkpoint captures a git snapshot, file state, and test status.

## Modes

| Mode | Usage | What It Does |
|------|-------|-------------|
| `create` | `/checkpoint create core-done` | Snapshot current state as a named checkpoint |
| `verify` | `/checkpoint verify core-done` | Compare current state against a checkpoint |
| `list` | `/checkpoint list` | Show all checkpoints with status |

## Typical Flow

```
feature-start → core-done → tests-pass → refactored → pr-ready
```

## Instructions

### Step 1: Parse Arguments

From `$ARGUMENTS`, determine:
- **Mode:** `create`, `verify`, or `list` (default: `create` if a name is given, `list` if no arguments)
- **Checkpoint name:** Kebab-case identifier (e.g., `core-done`, `tests-pass`)

### Step 2: Ensure Directory

```bash
mkdir -p .planning/checkpoints
```

### Step 3: Execute Mode

#### Mode: CREATE

1. **Capture git state:**
```bash
git rev-parse HEAD
git status --short
git diff --stat
```

2. **Capture file manifest:**
```bash
# List all tracked files with their hashes
git ls-files -s | head -100
```

3. **Run tests and record status:**
```bash
# Auto-detect and run
if [ -f "package.json" ]; then npm test 2>&1 | tail -10; fi
if [ -f "pyproject.toml" ]; then pytest 2>&1 | tail -10; fi
if [ -f "Cargo.toml" ]; then cargo test 2>&1 | tail -10; fi
```

4. **Save checkpoint to `.planning/checkpoints/[name].md`:**
```markdown
---
name: [checkpoint-name]
created: [ISO timestamp]
commit: [git hash]
branch: [branch name]
tests: pass|fail|skip
dirty_files: [count]
---

# Checkpoint: [name]

## Git State
- **Commit:** [hash]
- **Branch:** [branch]
- **Clean:** yes/no
- **Dirty files:** [list if any]

## Test Status
- **Result:** PASS / FAIL / SKIPPED
- **Details:** [summary]

## Files Snapshot
[List of key files and their git hashes at this point]

## Notes
[Any context about what this checkpoint represents]
```

5. **Present confirmation:**
```markdown
## Checkpoint Created: [name]
- **Commit:** [short hash]
- **Tests:** PASS/FAIL
- **Files tracked:** [count]
- **Stored at:** `.planning/checkpoints/[name].md`
```

#### Mode: VERIFY

1. **Load the checkpoint:**
```bash
cat .planning/checkpoints/[name].md
```

2. **Compare current state:**
```bash
# Files changed since checkpoint commit
git diff [checkpoint-commit] --stat
git diff [checkpoint-commit] --name-status
```

3. **Run tests and compare:**
```bash
npm test 2>&1 | tail -10
```

4. **Present comparison:**
```markdown
## Checkpoint Verify: [name]

| Aspect | Checkpoint | Current | Status |
|--------|-----------|---------|--------|
| Commit | [old-hash] | [new-hash] | [X commits ahead] |
| Tests | PASS | PASS/FAIL | SAME/REGRESSION |
| Dirty files | [count] | [count] | +N/-N |

### Files Changed Since Checkpoint
- `path/to/file.ts` — modified
- `path/to/new.ts` — added
- `path/to/old.ts` — deleted

### Verdict: ON TRACK / REGRESSION / DIVERGED
```

#### Mode: LIST

1. **Read all checkpoints:**
```bash
ls .planning/checkpoints/*.md 2>/dev/null
```

2. **Present timeline:**
```markdown
## Checkpoints

| # | Name | Date | Commit | Tests | Files Changed Since |
|---|------|------|--------|-------|-------------------|
| 1 | feature-start | [date] | [hash] | PASS | — |
| 2 | core-done | [date] | [hash] | PASS | +12 files |
| 3 | tests-pass | [date] | [hash] | PASS | +3 files |

**Current position:** [X commits ahead of latest checkpoint]
```

### Step 4: Update State (If .planning/ Exists)

If `.planning/STATE.md` exists, append:
```markdown
### Checkpoint: [mode] [name]
- **Date:** [timestamp]
- **Result:** [created/verified/listed]
```

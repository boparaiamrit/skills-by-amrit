---
name: quick
description: "Execute a small task without full project planning — for quick fixes, small features, and one-off changes."
disable-model-invocation: true
argument-hint: "[task-description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# /quick — Quick Task Execution

Execute a small, well-defined task without creating a full plan. For tasks that don't need phase structure.

## When to Use
- Bug fixes that are clearly scoped
- Small features (< 30 min of work)
- Configuration changes
- Documentation updates
- One-off investigations

## When NOT to Use (Use /plan + /execute Instead)
- Multi-file feature implementations
- Architectural changes
- Database migrations
- Anything touching authentication or authorization
- Changes requiring research first

## Instructions

### Step 1: Understand the Task

From `$ARGUMENTS`, determine:
- **What needs to change?** — Specific files and behavior
- **Why?** — The reason for the change
- **Scope boundary** — What is NOT included

### Step 2: Quick Research

Spend 2-3 minutes understanding the context:

```bash
# Find relevant files
grep -rn "[keyword]" --include="*.ts" --include="*.js" --include="*.py" . | grep -v node_modules | head -20

# Read the main file
cat [relevant-file]
```

Understand existing patterns before writing code.

### Step 3: Pre-Flight Check

```bash
git status --short
npm run build 2>&1 | tail -5
npm test 2>&1 | tail -5
```

### Step 4: Implement

Follow these rules:
- **Match existing patterns** — Don't introduce new patterns for a quick task
- **Minimal changes** — Change the fewest lines possible
- **No refactoring** — If you see tech debt, note it but don't fix it
- **Add tests** — Even quick tasks should have tests if behavior changes
- **Type safety** — No `any`, proper error handling

### Step 5: Verify

```bash
npm run build 2>&1 | tail -5
npm test 2>&1 | tail -5
npm run lint 2>&1 | tail -5
```

### Step 6: Summary

```markdown
## Quick Task Complete

**Task:** [Description from $ARGUMENTS]

**Changes:**
- `path/to/file.ts` — [What changed]
- `path/to/test.ts` — [Test added]

**Verification:** Build ✅, Tests ✅, Lint ✅

**Next:** Run `/commit` to save these changes.
```

### Step 7: Update State (If .planning/ Exists)

If `.planning/STATE.md` exists, append:
```markdown
### Quick Task: [title]
- **Status:** ✅ Complete
- **Date:** [timestamp]
- **Files:** [list]
```

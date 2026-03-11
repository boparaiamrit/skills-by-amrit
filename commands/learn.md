---
name: learn
description: "Extract reusable patterns and learnings from the current session and save to .planning/LEARNINGS.md."
disable-model-invocation: true
argument-hint: "[category: error|debug|architecture|tool|workflow|performance|security|testing|all]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# /learn — Extract Session Learnings

Extract reusable patterns and learnings from the current session. Categorize, deduplicate, and persist to `.planning/LEARNINGS.md`.

## Categories

| Category | What to Capture |
|----------|----------------|
| Error Resolution | Errors encountered and how they were fixed |
| Debugging | Debugging techniques that worked for this codebase |
| Architecture | Architecture decisions, patterns, trade-offs |
| Tool/Library | Tool configs, library quirks, version-specific behavior |
| Workflow | Process improvements, command sequences that helped |
| Performance | Performance fixes, profiling insights, bottlenecks found |
| Security | Security issues found, hardening patterns applied |
| Testing | Test strategies, mocking patterns, coverage insights |

## Instructions

### Step 1: Determine Scope

From `$ARGUMENTS`:
- If a category is given: Extract learnings only for that category
- If `all` or empty: Scan for learnings across all 8 categories

### Step 2: Scan Session Context

Review the current session for extractable learnings:

1. **Errors resolved** — What broke and how was it fixed?
2. **Debugging paths** — What investigation steps led to root cause?
3. **Architecture choices** — What patterns were chosen and why?
4. **Tool discoveries** — What tool/library behavior was non-obvious?
5. **Workflow improvements** — What process worked well?
6. **Performance insights** — What was slow and how was it fixed?
7. **Security findings** — What vulnerabilities were found or prevented?
8. **Testing patterns** — What test approach worked for this code?

### Step 3: Check Existing Learnings

```bash
cat .planning/LEARNINGS.md 2>/dev/null || echo "No existing learnings file."
```

If the file exists, read it to avoid duplicating existing entries.

### Step 4: Format Each Learning

Each learning follows this structure:

```markdown
### [Category] — [Short Title]
- **Pattern:** What was learned (the reusable insight)
- **Context:** Where/when this applies
- **Solution:** The specific fix, technique, or approach
- **Date:** [ISO date]
```

### Step 5: Deduplicate

Before adding a learning:
1. Check if an existing entry covers the same pattern
2. If similar entry exists, **update** it with new context rather than adding a duplicate
3. If genuinely new, append to the appropriate category section

### Step 6: Write to LEARNINGS.md

Ensure `.planning/` directory exists:

```bash
mkdir -p .planning
```

Write or update `.planning/LEARNINGS.md` with the structure:

```markdown
# Project Learnings

> Reusable patterns and insights extracted from development sessions.

## Error Resolution
[entries]

## Debugging
[entries]

## Architecture
[entries]

## Tool/Library
[entries]

## Workflow
[entries]

## Performance
[entries]

## Security
[entries]

## Testing
[entries]

---
*Last updated: [ISO date]*
```

### Step 7: Summary

Present what was captured:

```markdown
## Learnings Extracted

**New entries:** [count]
**Updated entries:** [count]
**Categories covered:** [list]

### New Learnings
- [Category] — [Title]: [one-line summary]

Saved to `.planning/LEARNINGS.md`
```

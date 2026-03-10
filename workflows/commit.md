---
description: Create an attributed atomic commit with smart type detection and specific file staging
---

<purpose>
Create conventional commits with attribution, specific file staging (never git add -A), and state tracking. Reads attribution config from .planning/config.json if available.
</purpose>

<process>

<step name="check_changes">
Check what files have changed:

```bash
git status --short
git diff --staged --stat
```

If nothing is staged AND nothing is modified: "Nothing to commit."
</step>

<step name="read_config">
Read attribution config from `.planning/config.json` (if exists):

```bash
cat .planning/config.json 2>/dev/null
```

Extract:
- `commit_docs` — whether to include .planning/ files
- `attribution` — Co-Authored-By settings (if configured)
</step>

<step name="analyze_changes">
Show the detailed diff for commit message generation:

```bash
git diff --staged --name-only 2>/dev/null
git diff --name-only 2>/dev/null
```

If nothing is staged, identify files to stage based on the current task context.

**CRITICAL: Stage specific files only — NEVER use `git add -A` or `git add .`**

```bash
# Stage specific files individually
git add path/to/file1.ts
git add path/to/file2.ts
```

**Exclude from staging:**
- `.env`, `credentials.json`, or any secrets files
- Large binary files unless explicitly intended
- Unrelated changes from other tasks
</step>

<step name="determine_type">
Based on the changes, determine the commit type:

| Type | When |
|------|------|
| `feat` | New feature, endpoint, component |
| `fix` | Bug fix, error correction |
| `refactor` | Code restructuring, no behavior change |
| `docs` | Documentation changes |
| `test` | Test-only changes |
| `chore` | Config, tooling, dependencies |
| `style` | Formatting, whitespace |
| `perf` | Performance improvement |
</step>

<step name="generate_commit">
Generate and execute the commit:

```bash
git commit -m "{type}({scope}): {concise description}

- {key change 1}
- {key change 2}
{attribution_footer}"
```

**Commit message rules:**
- Imperative mood ("add" not "added")
- Max 72 chars subject line
- Body explains WHY, not WHAT (the diff shows WHAT)
- Scope = affected module or feature area

**Attribution footer (if configured in config.json):**
```
Co-Authored-By: {name} <{email}>
```
</step>

<step name="update_state">
If `.planning/STATE.md` exists, update session info:

```bash
# Record the commit in state
cat .planning/STATE.md 2>/dev/null | head -5
```

Update last session timestamp and "Stopped At" field if applicable.

**If commit_docs is true:** Include .planning/ state files in a separate docs commit:
```bash
git add .planning/STATE.md
git commit -m "docs: update project state"
```
</step>

<step name="confirm">
Present confirmation:

```
Committed: {hash}
{type}({scope}): {description}

Files: {count} files changed
```
</step>

</process>

<commit_quality>
Good commits:
- `feat(auth): add JWT refresh token rotation` — specific, clear scope
- `fix(api): handle null user in profile endpoint` — describes the bug fix

Bad commits:
- `update files` — meaningless
- `fix stuff` — no context
- `WIP` — never commit work in progress
</commit_quality>

<success_criteria>
- [ ] Changes analyzed (staged and unstaged)
- [ ] Specific files staged (never git add -A)
- [ ] No secrets or credentials staged
- [ ] Commit type correctly determined
- [ ] Commit message follows conventional format
- [ ] Attribution added if configured
- [ ] STATE.md updated if exists
- [ ] Confirmation presented
</success_criteria>

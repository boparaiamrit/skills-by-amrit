---
name: git-workflow
description: "Use when performing any git operations — branching, committing, merging, rebasing, resolving conflicts. Ensures clean history, atomic commits, and proper branch management."
---

# Git Workflow

## Overview

Git is the record of your project's evolution. Every commit should be atomic, meaningful, and reversible.

**Core principle:** Clean history enables clean debugging. Every commit tells a story.

## When to Use

- Starting any new work (branch creation)
- Every completed task (commit)
- Finishing a feature (merge/PR)
- Dealing with conflicts
- Managing multiple parallel efforts

## Branch Strategy

### Branch Types

| Branch | Pattern | Purpose | Lifetime |
|--------|---------|---------|----------|
| `main` | `main` | Production code | Permanent |
| Feature | `feat/<description>` | New functionality | Until merged |
| Fix | `fix/<description>` | Bug fixes | Until merged |
| Refactor | `refactor/<description>` | Code improvements | Until merged |
| Experiment | `experiment/<description>` | Throw-away exploration | Until discarded |

### Branch Lifecycle

```
1. CREATE branch from latest main
2. WORK in small, committed increments
3. KEEP branch up to date (rebase on main regularly)
4. REVIEW before merge (code-review skill)
5. MERGE via PR (squash for feature branches, merge for long-lived)
6. DELETE branch after merge
```

## Commit Convention

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `docs` | Documentation only |
| `style` | Formatting, semicolons, etc. (no code change) |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

### Commit Quality Rules

| ✅ Good Commit | ❌ Bad Commit |
|----------------|---------------|
| `feat(auth): add email validation with regex pattern` | `update stuff` |
| `fix(api): prevent null reference in user lookup` | `fix bug` |
| `test(cart): add edge cases for empty cart checkout` | `add tests` |
| `refactor(db): extract query builder to shared util` | `refactor` |

### Atomic Commits

Each commit should:
- Compile and pass tests on its own
- Be independently revertable
- Contain exactly ONE logical change
- Have a message that explains WHY, not just WHAT

## Working with Conflicts

```
1. UNDERSTAND both sides of the conflict
2. DON'T just pick one side — merge intent, not text
3. VERIFY the merged result compiles and tests pass
4. IF unsure → ask the human partner
```

## Stashing and Context Switching

```bash
# Save current work
git stash push -m "description of work in progress"

# Switch to urgent fix
git checkout -b fix/urgent-issue

# ... fix and commit ...

# Return to original work
git checkout original-branch
git stash pop
```

## Red Flags — STOP

- Committing directly to main
- Giant commits with multiple unrelated changes
- `git add .` without reviewing what's staged
- Force pushing to shared branches
- Committing without running tests
- Vague commit messages
- Committing debug code, console.logs, or TODOs

## Quick Reference

```bash
# Start new work
git checkout main && git pull
git checkout -b feat/description

# Save progress
git add -p                     # Stage interactively
git commit -m "feat: description"

# Stay current
git fetch origin
git rebase origin/main

# Ready to merge
git push -u origin feat/description
# Create PR, get review, merge

# After merge
git checkout main && git pull
git branch -d feat/description
```

## Integration

- **Branch creation:** At start of `brainstorming` or `executing-plans`
- **Commits:** After each `executing-plans` task
- **Merge:** After `code-review` approval
- **Conflict resolution:** During `refactoring-safely`

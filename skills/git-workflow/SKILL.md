---
name: git-workflow
description: "Use when performing any git operations — branching, committing, merging, rebasing, resolving conflicts. Ensures clean history, atomic commits, and proper branch management."
---

# Git Workflow

## Overview

Git is the record of your project's evolution. Every commit should be atomic, meaningful, and reversible.

**Core principle:** Clean history enables clean debugging. Every commit tells a story.

## The Iron Law

```
NO COMMIT WITHOUT PASSING TESTS. NO MERGE WITHOUT REVIEW.
```

## When to Use

- Starting any new work (branch creation)
- Every completed task (commit)
- Finishing a feature (merge/PR)
- Dealing with conflicts
- Managing multiple parallel efforts

## When NOT to Use

- Deciding what to build (use `brainstorming`)
- Deciding how to build it (use `writing-plans`)
- This is a reference skill for git operations, not a decision-making skill

## Anti-Shortcut Rules

```
YOU CANNOT:
- Commit directly to main — always use feature branches
- Use git add . without reviewing staged files — stage interactively (git add -p)
- Force push to shared branches — only force push YOUR branches
- Commit with "WIP", "fix", or "update" messages — describe WHAT and WHY
- Commit debug code, console.logs, or TODO comments — clean up first
- Squash without reading the individual commits — understand what you're merging
- Skip tests before committing — failing tests = broken commit
- Resolve conflicts by picking one side without understanding both — merge INTENT
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "I'll clean up the history later" | You won't. Write clean commits now. |
| "It's just a small commit to main" | Small direct commits cause most merge conflicts and regressions. |
| "WIP commit, I'll squash later" | WIP commits become permanent. Write a real message. |
| "Force push is fine, nobody else uses this branch" | Until someone does. Only force push branches YOU own. |
| "I'll review what I staged before pushing" | Review before staging. After is too late — you'll miss things. |
| "The tests passed earlier" | Earlier ≠ now. Run them before every commit. |

## Iron Questions

```
1. Does this commit compile and pass tests on its own?
2. If I revert this single commit, does the codebase still work?
3. Does the commit message explain WHY, not just WHAT?
4. Is this exactly ONE logical change? (not two changes in one commit)
5. Have I staged only the files related to this change?
6. Is there any debug code, commented-out code, or TODOs in the staged changes?
7. Would a reviewer understand this commit without additional context?
8. Am I committing to the correct branch?
```

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
   git checkout main && git pull
   git checkout -b feat/description

2. WORK in small, committed increments
   [write test → implement → verify → commit]

3. KEEP branch up to date (rebase on main regularly)
   git fetch origin
   git rebase origin/main

4. REVIEW before merge (code-review skill)

5. MERGE via PR (squash for feature branches, merge for long-lived)

6. DELETE branch after merge
   git checkout main && git pull
   git branch -d feat/description
```

## Commit Convention

### Format

```
<type>(<scope>): <description>

[optional body — explains WHY, not WHAT]

[optional footer — references issues, breaking changes]
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

### Commit Quality

| ✅ Good Commit | ❌ Bad Commit |
|----------------|---------------|
| `feat(auth): add email validation with regex pattern` | `update stuff` |
| `fix(api): prevent null reference in user lookup` | `fix bug` |
| `test(cart): add edge cases for empty cart checkout` | `add tests` |
| `refactor(db): extract query builder to shared util` | `refactor` |
| `fix(payment): handle timeout when gateway returns 504` | `wip` |

### Atomic Commits

Each commit should:
- Compile and pass tests on its own
- Be independently revertable
- Contain exactly ONE logical change
- Have a message that explains WHY, not just WHAT

## Working with Conflicts

```
1. UNDERSTAND both sides of the conflict — read the diff carefully
2. IDENTIFY the intent of each change — what was each trying to accomplish?
3. MERGE intent, not text — the correct resolution may be different from both sides
4. VERIFY the merged result compiles and tests pass
5. IF unsure → ask the human partner (never guess on conflict resolution)
```

## Stashing and Context Switching

```bash
# Save current work with descriptive message
git stash push -m "description of work in progress"

# Switch to urgent fix
git checkout -b fix/urgent-issue

# ... fix, test, and commit ...

# Return to original work
git checkout original-branch
git stash pop
```

## Quick Reference

```bash
# Start new work
git checkout main && git pull
git checkout -b feat/description

# Save progress (interactive staging)
git add -p                     # Stage interactively
git diff --staged              # Review staged changes
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

## Red Flags — STOP

- Committing directly to main
- Giant commits with multiple unrelated changes
- `git add .` without reviewing what's staged
- Force pushing to shared branches
- Committing without running tests
- Vague commit messages ("fix", "update", "wip")
- Committing debug code, console.logs, or TODOs
- Resolving conflicts by always picking one side
- Not pulling main before creating a branch

## Integration

- **Branch creation:** At start of `brainstorming` or `executing-plans`
- **Commits:** After each `executing-plans` task
- **Merge:** After `code-review` approval
- **Conflict resolution:** During `refactoring-safely`
- **Before commit:** `verification-before-completion`

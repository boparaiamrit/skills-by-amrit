---
name: commit
description: "Stage changes and create a well-formatted conventional commit."
disable-model-invocation: true
argument-hint: "[optional-scope]"
---

# /commit — Smart Commit

Create a well-formatted commit message following Conventional Commits.

## Instructions

1. **Check what changed**:
   - Run `git status` and `git diff --staged`
   - If nothing is staged, run `git diff` to see unstaged changes
   - Summarize the changes in your mind before writing the message

2. **Determine commit type**:
   - `feat:` — New feature or capability
   - `fix:` — Bug fix
   - `refactor:` — Code change that neither fixes a bug nor adds a feature
   - `docs:` — Documentation only
   - `test:` — Adding or updating tests
   - `chore:` — Maintenance tasks, dependency updates
   - `perf:` — Performance improvement
   - `ci:` — CI/CD changes
   - `style:` — Formatting, whitespace (no logic change)

3. **Write the commit message**:
   ```
   <type>(<scope>): <short description>

   <body — explain WHAT and WHY, not HOW>

   <footer — breaking changes, issue references>
   ```

4. **Rules**:
   - Subject line ≤ 72 characters
   - Use imperative mood ("add", not "added" or "adds")
   - Scope from `$ARGUMENTS` if provided, otherwise infer from changed files
   - Body should explain WHY the change was made
   - Reference issues if applicable: `Fixes #123`

5. **Stage and commit**:
   - Stage all relevant files (ask user if unsure)
   - Create the commit with the formatted message
   - Show the commit hash and summary

6. **Do NOT push** — let the user decide when to push.

---
name: review
description: "Perform a thorough code review of specified files or the current diff."
disable-model-invocation: true
argument-hint: "[file-or-branch]"
---

# /review — Code Review

Review code changes for quality, correctness, and best practices.

## Instructions

1. **Determine scope**:
   - If `$ARGUMENTS` is a file path → review that specific file
   - If `$ARGUMENTS` is a branch name → review `git diff main..$ARGUMENTS`
   - If empty → review `git diff --staged` (staged changes)
   - If no staged changes → review `git diff` (unstaged changes)

2. **Review Checklist** — Check each change for:
   - [ ] **Correctness**: Does the logic do what it claims?
   - [ ] **Edge cases**: Are boundary conditions handled?
   - [ ] **Error handling**: Are errors caught and handled properly?
   - [ ] **Security**: Any injection, auth bypass, or data exposure?
   - [ ] **Performance**: Any N+1 queries, unnecessary loops, or missing indexes?
   - [ ] **Tests**: Are there tests? Do they cover the happy path AND error cases?
   - [ ] **Naming**: Are variables, functions, and files named clearly?
   - [ ] **DRY**: Is there duplicated logic that should be extracted?
   - [ ] **Types**: Are type hints/annotations present and correct?

3. **Output format**:
   ```
   ## Code Review — [scope]

   ### ✅ Looks Good
   - [List things done well]

   ### 🔧 Suggestions
   - [Improvements that should be made]

   ### ⚠️ Issues
   - [Problems that must be fixed before merge]

   ### 📝 Nits
   - [Minor style/formatting preferences]
   ```

4. **Be specific** — reference exact file paths and line numbers.
5. **Be constructive** — explain WHY something is an issue, not just WHAT.

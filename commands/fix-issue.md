---
name: fix-issue
description: "Fix a GitHub/Linear issue by number."
disable-model-invocation: true
argument-hint: "[issue-number]"
---

# /fix-issue — Fix a Tracked Issue

Fix a GitHub or Linear issue end-to-end.

## Instructions

1. **Read the issue** `$ARGUMENTS`:
   - If it's a number, fetch the issue from the project's issue tracker
   - Understand the problem description, acceptance criteria, and any comments
   - Check for related issues or PRs

2. **Create a branch**:
   - Branch name: `fix/$ARGUMENTS-short-description` or `feat/$ARGUMENTS-short-description`
   - Based on current `main` or `develop` branch

3. **Implement the fix**:
   - Follow existing code patterns and conventions
   - Write the minimal code to fix the issue
   - Handle edge cases mentioned in the issue

4. **Write tests**:
   - Add tests that verify the fix
   - Include a test for the original failing scenario
   - Ensure no regressions

5. **Verify**:
   - All tests pass
   - Linting passes
   - Build succeeds

6. **Commit** with a conventional commit message:
   ```
   fix: short description

   Fixes #[issue-number]

   - What was changed and why
   ```

7. **Summarize** what was done and what the user should review.

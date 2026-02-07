---
description: Review code changes for quality, correctness, and best practices
---

## Steps

1. Identify what to review — check staged changes first:
// turbo
```
git diff --staged --stat
```

2. If nothing staged, check unstaged changes:
// turbo
```
git diff --stat
```

3. Show the full diff for review:
// turbo
```
git diff --staged 2>/dev/null || git diff
```

4. For each changed file, check:
   - **Correctness**: Does the logic match the intent?
   - **Error handling**: Are errors caught properly?
   - **Edge cases**: Are boundary conditions handled?
   - **Security**: Any injection, auth bypass, or data exposure?
   - **Performance**: N+1 queries, unnecessary loops?
   - **Tests**: Are changes covered by tests?
   - **Naming**: Clear, descriptive names?
   - **DRY**: Any duplicated logic?

5. Compile the review into a structured report:
   ```
   ## Code Review

   ### ✅ Looks Good
   - [positive observations]

   ### ⚠️ Issues (must fix)
   - [blocking issues]

   ### 🔧 Suggestions (should improve)
   - [non-blocking improvements]

   ### 📝 Nits
   - [minor style notes]
   ```

6. Present the review to the user with specific file/line references.

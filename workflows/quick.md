---
description: Execute a small task quickly without full project planning
---

## Steps

// turbo-all

1. Understand the task from the user's description:
   - What needs to change?
   - Why?
   - What is NOT included?

2. Quick codebase research (2-3 minutes max):
```
grep -rn "[keyword]" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.py" . | grep -v node_modules | head -20
```

3. Pre-flight check:
```
git status --short; echo "==="; npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -5
```

4. Implement the change following existing patterns:
   - Match existing code style and conventions
   - Minimal changes — don't refactor while doing a quick task
   - Add tests if behavior changes
   - Full type safety and error handling

5. Verify:
```
npm run build 2>&1 | tail -5; echo "==="; npm test 2>&1 | tail -5; echo "==="; npm run lint 2>&1 | tail -5
```

6. Present summary:
   - What was changed and why
   - Files modified
   - Verification results
   - Next: "Run `/commit` to save"

7. If `.planning/STATE.md` exists, append quick task entry with status, date, and files.

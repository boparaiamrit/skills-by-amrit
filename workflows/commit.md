---
description: Create a conventional commit with smart type detection
---

// turbo-all

## Steps

1. Check what files have changed:
```
git status --short
```

2. Show the diff of staged changes (or all changes if nothing staged):
```
git diff --staged --stat
```

3. If nothing is staged, stage all changes:
```
git add -A && git status --short
```

4. Show the detailed diff for commit message generation:
```
git diff --staged --name-only
```

5. Based on the changes, determine the commit type:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `refactor:` for code restructuring
   - `docs:` for documentation
   - `test:` for test changes
   - `chore:` for maintenance

6. Generate and execute a conventional commit with a descriptive message. Use imperative mood, max 72 chars subject line.

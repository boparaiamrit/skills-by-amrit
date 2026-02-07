---
description: Check and update project dependencies, finding outdated and vulnerable packages
---

## Steps

1. List outdated dependencies:
// turbo
```
npm outdated 2>&1 || pip list --outdated 2>&1
```

2. Check for security vulnerabilities:
// turbo
```
npm audit 2>&1 | tail -30 || pip-audit 2>&1 | tail -30 || echo "No audit tool available"
```

3. Check for unused dependencies:
// turbo
```
npx depcheck 2>/dev/null | head -30 || echo "depcheck not available, skipping"
```

4. Review the findings:
   - 🔴 Critical: Security vulnerabilities with known exploits
   - 🟠 High: Major version bumps available
   - 🟡 Medium: Minor/patch updates available
   - 🔵 Low: Unused dependencies to remove

5. Ask the user which updates to apply:
   - Security patches only (safest)
   - All patch updates
   - All minor updates
   - Major upgrades (requires testing)

6. Apply the approved updates:
```
npm update 2>&1
```

7. Run tests after updating:
```
npm test 2>&1
```

8. Create a commit with the dependency updates:
```
git add package.json package-lock.json && git commit -m "chore(deps): update dependencies"
```

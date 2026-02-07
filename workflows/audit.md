---
description: Run a full codebase audit across security, performance, architecture, and database
---

## Steps

1. Run the linter to check for obvious issues:
// turbo
```
npm run lint 2>&1 | head -50
```

2. Search for hardcoded secrets or API keys:
// turbo
```
grep -rn "password\|secret\|api_key\|apikey\|token" --include="*.ts" --include="*.js" --include="*.py" --include="*.env" . | grep -vi "node_modules\|.git\|dist" | head -30
```

3. Search for console.log/print debug statements that shouldn't be in production:
// turbo
```
grep -rn "console\.log\|console\.debug\|print(" --include="*.ts" --include="*.js" --include="*.py" . | grep -vi "node_modules\|.git\|dist\|test\|spec" | head -30
```

4. Check for TODO/FIXME/HACK comments that indicate incomplete work:
// turbo
```
grep -rn "TODO\|FIXME\|HACK\|XXX\|WORKAROUND" --include="*.ts" --include="*.js" --include="*.py" . | grep -vi "node_modules\|.git\|dist" | head -30
```

5. Review the findings and create an `AUDIT-REPORT.md` with categorized results:
   - 🔴 Critical: Security vulnerabilities, exposed secrets
   - 🟠 High: Missing error handling, potential data loss
   - 🟡 Medium: Code smells, TODOs, missing tests
   - 🔵 Low: Style issues, minor improvements

6. Present the audit report to the user with recommended priorities.

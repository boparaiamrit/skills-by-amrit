---
description: Run pre-deployment safety checks before releasing to production
---

## Steps

1. Verify the build compiles without errors:
```
npm run build 2>&1
```

2. Run the full test suite:
// turbo
```
npm test 2>&1
```

3. Check git status for uncommitted changes:
// turbo
```
git status --short
```

4. Verify we're up to date with the remote:
// turbo
```
git fetch origin && git log HEAD..origin/main --oneline
```

5. Search for debug statements that shouldn't be deployed:
// turbo
```
grep -rn "console\.log\|debugger" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . | grep -vi "node_modules\|.git\|dist\|test\|spec" | head -20
```

6. Check for known vulnerabilities in dependencies:
// turbo
```
npm audit --production 2>&1 | tail -20
```

7. Verify environment variables are documented:
// turbo
```
grep -rn "process\.env\.\|import\.meta\.env\.\|os\.getenv\|os\.environ" --include="*.ts" --include="*.js" --include="*.py" . | grep -vi "node_modules\|.git\|dist" | head -20
```

8. Compile a deployment readiness report:
   - Build: PASS/FAIL
   - Tests: X/Y passing
   - Git: Clean/Dirty
   - Security: X warnings
   - Verdict: READY/NOT READY

9. Present the report to the user. DO NOT deploy automatically — await user confirmation.

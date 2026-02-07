---
description: Respond to a production incident with structured diagnosis and resolution
---

## Steps

1. **Assess the situation** — Gather initial information:
// turbo
```
git log --oneline -5
```

2. Check recent deployments:
// turbo
```
git log --oneline --since="24 hours ago"
```

3. Check application logs for errors:
// turbo
```
tail -100 logs/error.log 2>/dev/null || journalctl -u app --since "1 hour ago" 2>/dev/null || echo "Check your logging service manually"
```

4. **Identify the blast radius**:
   - What users/features are affected?
   - Is the issue intermittent or constant?
   - When did it start? (correlate with recent deploys)

5. **Determine root cause**:
   - Check if a recent deploy caused it: `git diff HEAD~1..HEAD --stat`
   - Check for infrastructure issues (disk space, memory, connections)
   - Check for external dependency failures

6. **Decide on action**:
   - If a recent deploy caused it → rollback: `git revert HEAD`
   - If external dependency → implement circuit breaker or fallback
   - If data issue → identify and fix the bad data

7. **Apply the fix** and verify:
```
npm test 2>&1 || pytest 2>&1
```

8. **Post-mortem** — Create an `INCIDENT-REPORT.md` with:
   - Timeline of events
   - Root cause analysis
   - Impact assessment
   - Resolution steps taken
   - Prevention measures for the future

9. Present the incident report to the user.

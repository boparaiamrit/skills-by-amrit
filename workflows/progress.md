---
description: Show current project progress, phase status, and task completion
---

## Steps

1. Check if project state exists:
// turbo
```
ls .planning/ 2>/dev/null; echo "---"; cat .planning/STATE.md 2>/dev/null; echo "---"; cat .planning/ROADMAP.md 2>/dev/null
```

2. If `.planning/` doesn't exist, inform the user:
   > No project state found. Run `/init-project` to initialize project tracking.

3. Parse the state and roadmap to calculate:
   - Which phase is current
   - How many tasks are complete vs remaining
   - What's actively being worked on
   - Any blockers

4. Check for plans and their status:
// turbo
```
ls .planning/plans/*.md 2>/dev/null; echo "---"; ls .planning/uat/*.md 2>/dev/null; echo "---"; cat .planning/config.json 2>/dev/null
```

5. Display a progress dashboard with:
   - 📊 Overall status: 🟢 On Track / 🟡 At Risk / 🔴 Blocked
   - Phase overview table (phase, name, status, task progress)
   - Current phase detail (active, completed, and blocked tasks)
   - Recent activity timeline
   - Plans table with status
   - Verification status per phase
   - Current blockers (or "None")
   - Next recommended action

# /plan Command Examples

> Create detailed implementation plans with task decomposition.

## Usage

### Claude Code
```
@/plan "Add user notification preferences with email and push support"
```

### Antigravity
```
/plan-feature "Add user notification preferences"
```

## What It Does

1. **Scope Analysis** — Understands full requirements
2. **Research** — Checks existing patterns
3. **Decomposition** — Breaks into tasks
4. **Wave Organization** — Groups by dependencies
5. **Effort Estimation** — Time per task
6. **Output** — Creates `.planning/plans/[slug].md`

## Example Output

```markdown
## Plan: User Notification Preferences

### Scope
Allow users to configure email and push notification preferences.

### Tasks

#### Wave 1: Database (2h)
- [ ] T1: Add preferences table — 1h
- [ ] T2: Create migration — 30min
- [ ] T3: Seed default preferences — 30min

#### Wave 2: API (3h)
- [ ] T4: GET /preferences endpoint — 1h
- [ ] T5: PATCH /preferences endpoint — 1h
- [ ] T6: Validation middleware — 1h

#### Wave 3: UI (4h)
- [ ] T7: Preferences page component — 2h
- [ ] T8: Toggle components — 1h
- [ ] T9: Save confirmation UX — 1h

### Total Estimate: 9 hours
```

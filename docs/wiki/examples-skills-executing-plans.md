# executing-plans Examples

> Wave-based plan execution with checkpoints and inline verification.

## Antigravity

```
/execute .planning/plans/dashboard.md
```

## Claude Code

```
@/execute .planning/plans/dashboard.md
```

## Process

1. **Read plan** — Load tasks and dependencies
2. **Wave execution** — Complete each wave in order
3. **Checkpoint** — Verify before moving to next wave
4. **Inline verification** — Test each task's output
5. **Progress update** — Update plan file with ✅/❌

## Example Session

```markdown
## Executing: dashboard.md

### Wave 1 Progress
- [x] T1: Create dashboard route ✅
- [x] T2: Set up analytics service ✅

### Checkpoint 1
- Build passes: ✅
- Tests pass: ✅
- Proceeding to Wave 2...

### Wave 2 Progress
- [x] T3: Build chart components ✅
- [ ] T4: Implement data fetching... (in progress)
```

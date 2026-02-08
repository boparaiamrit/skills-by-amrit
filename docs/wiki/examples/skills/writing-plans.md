# writing-plans Examples

> Task decomposition with dependencies, effort estimates, and wave-based execution.

## Antigravity

```
/plan-feature "Add user dashboard with analytics"
```

## Claude Code

```
@/plan "Add user dashboard with analytics"
```

## Output Format

```markdown
## Plan: User Dashboard with Analytics

### Overview
[Description and scope]

### Tasks

#### Wave 1 (Foundation)
- [ ] T1: Create dashboard route — 30min
- [ ] T2: Set up analytics service — 1h

#### Wave 2 (Core Features) — depends on Wave 1
- [ ] T3: Build chart components — 2h
- [ ] T4: Implement data fetching — 1.5h

#### Wave 3 (Polish) — depends on Wave 2
- [ ] T5: Add loading states — 30min
- [ ] T6: Write tests — 1h

### Risks
- API rate limits may affect real-time updates
```

# Planner Agent Examples

> Task decomposition specialist with dependency-aware planning.

## When to Spawn

- Complex feature with multiple components
- Multi-sprint work
- Cross-team coordination needed
- Risk assessment required

## Spawning

### Claude Code

```
Spawn planner agent for: "Implement OAuth 2.0 authentication"
```

### Via /team

```
@/team start full "Implement OAuth 2.0"
```
*Planner is the 3rd phase in full team preset*

## What the Agent Does

1. **Scope Analysis** — Understand full requirements
2. **Dependency Mapping** — What depends on what
3. **Wave Organization** — Group tasks by execution order
4. **Effort Estimation** — Time estimates per task
5. **Risk Assessment** — What could go wrong
6. **Plan Document** — Output to `.planning/plans/`

## Example Output

```markdown
## Plan: OAuth 2.0 Authentication

### Scope
Full OAuth 2.0 with Google, GitHub, and email/password fallback.

### Waves

#### Wave 1: Foundation (4h)
- [ ] T1: Auth provider setup — 1h
- [ ] T2: Database schema — 1h
- [ ] T3: Session management — 2h

#### Wave 2: Providers (6h) — after Wave 1
- [ ] T4: Google OAuth — 2h
- [ ] T5: GitHub OAuth — 2h
- [ ] T6: Email/password — 2h

#### Wave 3: UI (4h) — after Wave 2
- [ ] T7: Login page — 2h
- [ ] T8: Auth guards — 1h
- [ ] T9: Profile management — 1h

### Risks
- 🔴 Token refresh edge cases
- 🟠 Rate limiting from providers
- 🟡 Session sync across tabs
```

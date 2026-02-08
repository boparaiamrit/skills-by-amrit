# /team Command Examples

> Agent team coordination for complex features.

## Usage

### Claude Code
```
@/team start [preset] "[task description]"
```

### Antigravity
```
/team-session [preset] "[task description]"
```

## Presets

| Preset | Roles | Best For |
|--------|-------|----------|
| `quick` | Researcher → Executor → Reviewer | Small features |
| `full` | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| `debug` | Investigator → Fixer → Verifier | Bug hunting |

## Examples

### Quick Feature
```
@/team start quick "Add dark mode toggle"
```

### Full Feature
```
@/team start full "Implement OAuth 2.0 with Google and GitHub"
```

### Debug Session
```
@/team start debug "Memory leak causing OOM after 2 hours"
```

## What Happens

Each role:
1. Reads previous role's handoff
2. Does their specialized work
3. Writes handoff for next role

All handoffs stored in `.planning/team/[session-id]/`

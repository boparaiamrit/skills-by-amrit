# agent-team-coordination Examples

> Multi-role team coordination with sequential role-switching.

## Usage

### Antigravity
```
/team-session full "Implement OAuth authentication"
```

### Claude Code
```
@/team start full "Implement OAuth authentication"
```

## Team Presets

| Preset | Roles | Use Case |
|--------|-------|----------|
| `quick` | Researcher → Executor → Reviewer | Simple features |
| `full` | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| `debug` | Investigator → Fixer → Verifier | Bug hunting |

## How It Works

1. Each role reads previous handoff
2. Does specialized work
3. Writes handoff for next role
4. All artifacts in `.planning/team/`

## Example Session

```
Phase 1: 🔬 Researcher
→ Researches OAuth libraries, existing auth code
→ Writes: research-findings.md

Phase 2: 📐 Architect
→ Designs token flow, session management
→ Writes: architecture-design.md

Phase 3: 📋 Planner
→ Creates task breakdown, estimates
→ Writes: implementation-plan.md

Phase 4: ⚙️ Executor
→ Implements each task
→ Writes: execution-log.md

Phase 5: 🔍 Reviewer
→ Reviews all code, suggests fixes
→ Writes: review-report.md
```

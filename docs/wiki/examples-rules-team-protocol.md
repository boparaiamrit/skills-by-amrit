# team-protocol Rule Examples

> Multi-agent team coordination.

## Team Presets

| Preset | Roles |
|--------|-------|
| quick | Researcher → Executor → Reviewer |
| full | Researcher → Architect → Planner → Executor → Reviewer |
| debug | Investigator → Fixer → Verifier |

## Handoff Protocol

Each role:
1. Reads previous handoff
2. Does specialized work
3. Writes handoff for next role

## Artifacts

```
.planning/team/[session-id]/
├── research-findings.md
├── architecture-design.md
├── implementation-plan.md
├── execution-log.md
└── review-report.md
```

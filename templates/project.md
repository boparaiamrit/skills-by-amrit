# PROJECT.md Template

Template for `.planning/PROJECT.md` -- the living project context document.

---

## File Template

```markdown
---
project_name: "{{PROJECT_NAME}}"
version: "1.0.0"
created_at: "{{CREATED_AT}}"
status: active
---

# {{PROJECT_NAME}}

## Vision

[What this project does and why it exists. 2-3 sentences capturing the product's purpose, target audience, and core differentiator. Use the user's language and framing. Update whenever reality drifts from this description.]

## Core Value

[The ONE thing that matters most. If everything else fails, this must work. One sentence that drives prioritization when tradeoffs arise.]

## Tech Stack

{{TECH_STACK}}

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Runtime | [e.g., Node.js] | [e.g., 20.x] | [Why chosen] |
| Framework | [e.g., Next.js] | [e.g., 14.x] | [Why chosen] |
| Database | [e.g., PostgreSQL] | [e.g., 16] | [Why chosen] |
| ORM | [e.g., Prisma] | [e.g., 5.x] | [Why chosen] |
| Styling | [e.g., Tailwind CSS] | [e.g., 3.x] | [Why chosen] |
| Testing | [e.g., Vitest] | [e.g., 1.x] | [Why chosen] |

## Constraints

- **[Type]**: [What] -- [Why]
- **[Type]**: [What] -- [Why]

Common types: Tech stack, Timeline, Budget, Dependencies, Compatibility, Performance, Security

## Team

| Role | Description |
|------|-------------|
| [e.g., Solo developer] | [Context about who builds and maintains] |

## Success Criteria

What "done" looks like for this project:

1. [Observable outcome from user perspective]
2. [Observable outcome from user perspective]
3. [Observable outcome from user perspective]

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet -- ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] [Requirement 1]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- [Exclusion 1] -- [why]
- [Exclusion 2] -- [why]

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| [Choice] | [Why] | [Good / Revisit / Pending] |

---
*Last updated: {{CREATED_AT}} after project initialization*
```

---

## Guidelines

**Vision:**
- Current accurate description of the product
- 2-3 sentences capturing what it does and who it's for
- Use the user's words and framing
- Update when the product evolves beyond this description

**Core Value:**
- The single most important thing
- Everything else can fail; this cannot
- Drives prioritization when tradeoffs arise
- Rarely changes; if it does, it's a significant pivot

**Tech Stack:**
- Specific versions, not just names
- Include rationale for each choice
- Update when stack changes

**Constraints:**
- Hard limits on implementation choices
- Include the "why" -- constraints without rationale get questioned

**Success Criteria:**
- Observable behaviors from user perspective
- Testable and verifiable
- 3-5 criteria that define "done"

**Key Decisions:**
- Significant choices that affect future work
- Track outcome when known

## Evolution

PROJECT.md evolves throughout the project lifecycle.

**After each phase transition:**
1. Requirements invalidated? Move to Out of Scope with reason
2. Requirements validated? Move to Validated with phase reference
3. New requirements emerged? Add to Active
4. Decisions to log? Add to Key Decisions
5. Vision still accurate? Update if drifted

**After each milestone:**
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update tech stack if anything changed

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PROJECT_NAME}}` | User input | Name of the project |
| `{{CREATED_AT}}` | System | ISO date of creation |
| `{{TECH_STACK}}` | Discussion phase | Technology choices |

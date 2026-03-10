# CONTEXT.md Template

Template for `.planning/phases/XX-name/{phase_num}-CONTEXT.md` -- captures implementation decisions from discussion.

---

## File Template

```markdown
---
phase: {{PHASE_NAME}}
gathered_at: "{{GATHERED_AT}}"
status: ready_for_planning
---

# Phase {{PHASE_NUMBER}}: {{PHASE_DISPLAY_NAME}} -- Context

**Gathered:** {{GATHERED_AT}}
**Status:** Ready for planning

## Phase Boundary

[Clear statement of what this phase delivers -- the scope anchor. This comes from ROADMAP.md and is fixed. Discussion clarifies implementation within this boundary.]

## User Decisions

Decisions the user explicitly made during discussion. These are NON-NEGOTIABLE for downstream agents.

### [Area 1 -- genuine ambiguity that required user input]
- [Specific decision made]
- [Another decision if applicable]

### [Area 2 -- another question only the user could answer]
- [Specific decision made]

## Recommendations Accepted

Recommendations the AI proposed and the user accepted. Locked unless explicitly overridden.

### [Topic 1]
- **Recommendation:** [What was recommended]
- **Rationale:** [Project-specific reasoning]
- **Alternatives considered:** [Y] if [condition], [Z] if [condition]

### [Topic 2]
- **Recommendation:** [What was recommended]
- **Rationale:** [Project-specific reasoning]
- **Alternatives considered:** [Y] if [condition]

## Auto-Decided (locked unless overridden)

Decisions the AI made autonomously based on project conventions, industry standards, or clear best practices.

### [Package 1: e.g., Data Display Strategy]
- **[Decision]:** [One-line reason]

### [Package 2: e.g., Security Defaults]
- **[Decision]:** [One-line reason]

## Open Questions

Questions that could not be fully resolved during discussion:

1. **[Question]**
   - What we know: [partial info]
   - What's unclear: [the gap]
   - Recommendation: [how to handle during planning/execution]

## Constraints Discovered

Constraints that emerged during discussion (not in PROJECT.md yet):

- **[Type]:** [Constraint] -- [Why it matters]
- **[Type]:** [Constraint] -- [Why it matters]

## Specific Ideas

[Any particular references, examples, or "I want it like X" moments from discussion. Product references, specific behaviors, interaction patterns.]

[If none: "No specific requirements -- open to standard approaches"]

## Deferred Ideas

[Ideas that came up during discussion but belong in other phases. Captured so they are not lost, but explicitly out of scope for this phase.]

[If none: "None -- discussion stayed within phase scope"]

---
*Phase: {{PHASE_NAME}}*
*Context gathered: {{GATHERED_AT}}*
```

---

## Guidelines

**Three decision tiers flow into this document:**
- **Auto-decided (~70%):** Obvious choices driven by conventions, standards, best practices. Locked unless user overrides.
- **Recommendations (~25%):** Real trade-offs where one option is clearly better for this project. Recommended and accepted.
- **User decisions (~5%):** Genuine ambiguities only the user could answer.

All three tiers feed downstream as locked decisions. The distinction is about HOW each decision was reached, not its importance.

**Good content (concrete decisions):**
- "Card-based layout, not timeline"
- "Retry 3 times on network failure, then fail"
- "Group by year, then by month"

**Bad content (too vague):**
- "Should feel modern and clean"
- "Good user experience"
- "Fast and responsive"

**After creation:**
- Researcher uses all tiers to focus investigation
- Planner uses all tiers + research to create executable tasks
- Downstream agents should NOT need to ask the user again about captured decisions

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PHASE_NAME}}` | Roadmap | Phase identifier |
| `{{PHASE_NUMBER}}` | Derived | Numeric phase |
| `{{PHASE_DISPLAY_NAME}}` | Roadmap | Human-readable phase name |
| `{{GATHERED_AT}}` | System | ISO date of discussion |

# RESEARCH.md Template

Template for `.planning/phases/XX-name/{phase_num}-RESEARCH.md` -- comprehensive research before planning.

---

## File Template

```markdown
---
phase: {{PHASE_NAME}}
researched_at: "{{RESEARCHED_AT}}"
domain: "{{RESEARCH_DOMAIN}}"
confidence: HIGH | MEDIUM | LOW
---

# Phase {{PHASE_NUMBER}}: {{PHASE_DISPLAY_NAME}} -- Research

**Researched:** {{RESEARCHED_AT}}
**Domain:** {{RESEARCH_DOMAIN}}
**Confidence:** [HIGH / MEDIUM / LOW]

## Question

[The central question this research answers. What does the planner need to know to create effective tasks?]

## Findings

### Standard Stack

The established libraries/tools for this domain:

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| [name] | [ver] | [what it does] | [why experts use it] |
| [name] | [ver] | [what it does] | [why experts use it] |

### Architecture Patterns

**Recommended structure:**
```
src/
  [folder]/        # [purpose]
  [folder]/        # [purpose]
  [folder]/        # [purpose]
```

**Pattern 1: [Pattern Name]**
- What: [description]
- When to use: [conditions]
- Example: [brief code example or reference]

**Pattern 2: [Pattern Name]**
- What: [description]
- When to use: [conditions]

### Don't Hand-Roll

Problems with existing solutions -- do not reinvent:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| [problem] | [what you'd build] | [library] | [edge cases, complexity] |

### Common Pitfalls

**Pitfall 1: [Name]**
- What goes wrong: [description]
- How to avoid: [prevention strategy]
- Warning signs: [how to detect early]

**Pitfall 2: [Name]**
- What goes wrong: [description]
- How to avoid: [prevention strategy]
- Warning signs: [how to detect early]

## Recommendations

### Primary Recommendation
[One-liner actionable guidance -- the main takeaway]

### Supporting Recommendations
1. [Specific recommendation with rationale]
2. [Specific recommendation with rationale]
3. [Specific recommendation with rationale]

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| [standard] | [alternative] | [when alternative makes sense] |

## References

### Primary (HIGH confidence)
- [Official docs / verified source] -- [topics covered]

### Secondary (MEDIUM confidence)
- [Community verified] -- [finding + verification]

### Tertiary (LOW confidence -- needs validation)
- [Unverified] -- [finding, marked for validation during implementation]

## Decision

**Go with:** [Clear decision statement]
**Because:** [Project-specific reasoning]
**Revisit if:** [Conditions that would change this decision]

---
*Phase: {{PHASE_NAME}}*
*Research completed: {{RESEARCHED_AT}}*
*Ready for planning: [yes / no]*
```

---

## Guidelines

**When to create:**
- Before planning phases in niche/complex domains
- When standard approach is unclear
- When "how do experts do this" matters more than "which library"

**Content quality:**
- Standard stack: Specific versions, not just names
- Architecture: Include actual patterns from authoritative sources
- Don't hand-roll: Be explicit about what problems to NOT solve yourself
- Pitfalls: Include warning signs, not just "don't do this"
- References: Mark confidence levels honestly

**Integration with planning:**
- RESEARCH.md loaded as context during plan creation
- Standard stack informs library choices
- Don't hand-roll prevents custom solutions
- Pitfalls inform verification criteria

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PHASE_NAME}}` | Roadmap | Phase identifier |
| `{{PHASE_NUMBER}}` | Derived | Numeric phase |
| `{{PHASE_DISPLAY_NAME}}` | Roadmap | Human-readable phase name |
| `{{RESEARCHED_AT}}` | System | ISO date of research |
| `{{RESEARCH_DOMAIN}}` | Research scope | Primary technology/problem domain |

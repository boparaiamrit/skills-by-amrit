---
name: brainstorming
description: "Plan and design features before coding. Generates requirements checklists, approach comparisons with tradeoffs, and validated design documents. Use when the user asks to brainstorm, plan a feature, design architecture, explore options, think through an approach, write an RFC, or decide between implementations."
---

# Brainstorming: Ideas Into Validated Designs

Turn rough ideas into validated designs through collaborative dialogue before writing code.

## Workflow

### Phase 1: Understand Context

1. Read existing project state (files, docs, recent changes)
2. Identify related code, patterns, and constraints
3. Search for similar existing features to avoid reinvention

### Phase 2: Clarify Requirements

Ask focused questions one at a time. Prefer multiple choice and lead with your recommendation. If the user says "you decide", pick the best option and explain why. Never assume unstated requirements.

Always cover: error handling, failure modes, scope boundaries, and acceptance criteria. Tailor remaining questions to the feature type (e.g., auth and rate limits for APIs, migration strategy for data models, accessibility for UI).

### Phase 3: Compare Approaches

1. Propose 2-3 approaches with explicit tradeoffs
2. Present your recommendation with reasoning
3. Quantify differences when possible (e.g., "Option A is simpler but 2x slower")
4. Get explicit user approval before proceeding

**Example comparison table:**

| Criterion | Option A: Simple cache | Option B: Event-driven |
|-----------|----------------------|----------------------|
| Complexity | Low | Medium |
| Performance | Adequate | Best |
| Maintainability | High | Low |
| Risk | Low | High |
| **Recommendation** | Best balance | Only if scale requires it |

### Phase 4: Present Design

Present in 200-300 word sections. Check after each: "Does this look right so far?"

Required sections: Goal, Architecture, Implementation approach, Data model changes, API changes, Error handling, Testing strategy, Risks/unknowns, Scope boundaries (in/out/deferred).

### Phase 5: Document and Handoff

1. Save design to `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. Commit the document
3. Ask: "Ready to create an implementation plan?" If yes, hand off to `writing-plans`

## Constraints

- No coding before design approval
- Always offer 2-3 approaches to surface tradeoffs
- Always cover failure modes and risks
- YAGNI by default -- do not design for scale unless requested
- Reject vague requirements -- clarify before proceeding

## Output Format

```markdown
# Brainstorming Summary: [Feature Name]

## Problem Statement
[What problem this solves, in the user's words]

## Approved Approach
[Which option was selected and why]

## Key Decisions
| Decision | Rationale |
|----------|-----------|
| [Decision 1] | [Why] |

## Scope
- **In scope:** [What we build]
- **Out of scope:** [What we skip]
- **Deferred:** [Future work]

## Risks
| Risk | Mitigation | Severity |
|------|-----------|----------|
| [Risk] | [Plan] | High/Medium/Low |

## Next Step
Hand off to `writing-plans` for implementation plan
```

## Integration

- **After brainstorming:** `writing-plans` for implementation plan
- **For existing codebases:** `codebase-mapping` to understand the project first
- **For architecture concerns:** `architecture-audit` to validate the approach

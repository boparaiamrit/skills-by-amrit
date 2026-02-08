---
name: brainstorming
description: "Use before any creative work — creating features, building components, adding functionality, or modifying behavior. Explores intent, requirements, and design before implementation."
---

# Brainstorming Ideas Into Designs

## Overview

Turn rough ideas into validated designs through collaborative dialogue before a single line of code is written.

**Core principle:** Understand what you're building before you build it.

**Violating the letter of this process is violating the spirit of this process.**

## The Iron Law

```
NO IMPLEMENTATION WITHOUT A VALIDATED DESIGN FIRST
```

If you haven't clarified requirements and gotten design approval, you cannot write code.

## When to Use

**Always:**
- New feature requests
- Significant refactors
- New projects or modules
- Major behavior changes
- Architecture decisions

**Exceptions (ask your human partner):**
- Bug fixes with clear reproduction
- Typo corrections
- Dependency updates
- Configuration changes

## When NOT to Use

- You already have a detailed design document (use `writing-plans`)
- The task is a bug fix with clear reproduction steps (use `systematic-debugging`)
- The task is a simple configuration change or file edit
- The user explicitly says "just do it, no discussion needed"

## Anti-Shortcut Rules

```
YOU CANNOT:
- Start coding before design approval — even "just to prototype"
- Assume requirements the user hasn't stated — ask, even if it feels obvious
- Present only one approach — always offer 2-3 with trade-offs
- Skip edge cases — "what happens when this fails?" is always relevant
- Design for scale you don't need — YAGNI unless the user requests otherwise
- Accept vague requirements — "make it better" is not a requirement
- Let your bias override the user's intent — recommend, don't dictate
- Skip the "Risks and Unknowns" section — there are always unknowns
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "This is obvious, no need to brainstorm" | Obvious to you ≠ obvious to the codebase. Ask first. |
| "I'll figure out the design as I code" | That's not brainstorming, that's hoping. Plan first. |
| "The user knows what they want" | Users know the PROBLEM. They rarely know the best SOLUTION. |
| "We can change it later" | Changing architecture later costs 10x. Design now. |
| "Let me just build a quick prototype" | Prototypes become production code. Design first. |
| "The requirements are simple" | Simple requirements hide complex edge cases. Explore them. |

## Iron Questions

```
1. What problem does this solve? (not what feature — what PROBLEM)
2. Who uses this and when? (user journey, not technical flow)
3. What happens when it fails? (error states, rollback, recovery)
4. What does this NOT do? (explicit boundaries prevent scope creep)
5. What existing code/patterns does this interact with?
6. If we build this wrong, what breaks? (blast radius)
7. How do we verify this works? (acceptance criteria, not "it looks right")
8. What's the simplest version that delivers value? (MVP, not ideal)
9. What are we assuming? (list every assumption — then verify)
10. Is there an existing solution we can adapt instead of building from scratch?
```

## The Process

### Phase 1: Understand Context

```
1. READ existing project state (files, docs, recent changes)
2. IDENTIFY what exists related to this request
3. UNDERSTAND the current architecture and patterns in use
4. NOTE constraints and dependencies
5. SEARCH for similar features already built (don't reinvent)
```

### Phase 2: Ask Questions

**Rules:**
- One question at a time — don't overwhelm
- Prefer multiple choice when possible
- Lead with your recommended option
- Ask until YOU understand, not until THEY tire
- If the user says "you decide" — pick the best option AND explain why

**Question categories by feature type:**

| Feature Type | Key Questions |
|-------------|---------------|
| UI/Frontend | Layout? Density? Interactions? Empty states? Responsive breakpoints? Accessibility? |
| API/Backend | Request/response format? Auth? Rate limits? Error handling? Versioning? Idempotency? |
| Data/Database | Schema? Relationships? Indexes? Migration strategy? Volume estimates? Retention? |
| Integration | Protocol? Auth? Retry? Failure modes? Timeout? Backpressure? Circuit breaking? |
| Performance | Target latency? Throughput? Caching strategy? Degradation mode? Monitoring? |
| Security | Auth model? Authorization granularity? Data sensitivity? Audit logging? |

### Phase 3: Explore Approaches

```
1. PROPOSE 2-3 different approaches with trade-offs
2. PRESENT options conversationally with your recommendation
3. EXPLAIN the reasoning — "I recommend A because..."
4. DISCUSS trade-offs honestly — what do we sacrifice?
5. QUANTIFY when possible — "Option A is ~2x faster but ~3x more complex"
6. GET explicit approval before proceeding
```

**Approach comparison template:**

| Criterion | Option A | Option B | Option C |
|-----------|----------|----------|----------|
| Complexity | Low | Medium | High |
| Performance | Adequate | Good | Best |
| Maintainability | High | Medium | Low |
| Time to implement | 2 tasks | 5 tasks | 10 tasks |
| Risk | Low | Medium | High |
| **Recommendation** | ✅ Best balance | | For future if needed |

### Phase 4: Present Design

**Rules:**
- Break into sections of 200-300 words
- Check after each section: "Does this look right so far?"
- Cover all of these:

```markdown
## [Feature] Design

### Goal
One sentence: what this achieves.

### Architecture
- Where this fits in the system
- Which modules are affected
- Data flow diagram (if applicable)

### Implementation Approach
- High-level steps
- Key technical decisions and why
- Dependencies and prerequisites

### Data Model Changes
- New tables/collections/types
- Modified existing models
- Migration strategy

### API Changes
- New endpoints/functions
- Modified contracts
- Backwards compatibility plan

### Error Handling
- What can go wrong
- How each failure is handled
- User-facing vs internal errors

### Testing Strategy
- Unit test boundaries
- Integration test scenarios
- Edge cases to cover

### Risks and Unknowns
- What we're not sure about
- What could go wrong
- Contingency plans

### Scope Boundaries (Explicit)
- What this feature DOES
- What this feature DOES NOT do
- What's deferred to future work
```

### Phase 5: Document and Handoff

```
1. SAVE design to docs/plans/YYYY-MM-DD-<topic>-design.md
2. COMMIT design document
3. OFFER: "Ready to create an implementation plan?"
4. IF YES → Use writing-plans skill
```

## Output Format

When presenting the final approved design:

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
| [Decision 2] | [Why] |

## Scope
- **In scope:** [What we're building]
- **Out of scope:** [What we're not building]
- **Deferred:** [What we'll build later]

## Risks
| Risk | Mitigation | Severity |
|------|-----------|----------|
| [Risk] | [Plan] | 🔴/🟡/🟢 |

## Next Step
→ Ready for `writing-plans` to create implementation plan
```

## Red Flags — STOP

- Jumping to code without design approval
- Assuming requirements
- Ignoring edge cases
- Designing for scale you don't need (YAGNI)
- Not questioning "obvious" requirements
- Accepting vague requirements without clarification
- User says "just make it work" → clarify scope anyway (politely)
- You're excited about a solution → slow down, present alternatives

## Integration

- **After brainstorming:** Use `writing-plans` to create implementation plan
- **During brainstorming:** Use `git-workflow` for initial branching
- **For existing codebases:** Use `codebase-mapping` first
- **For architecture concerns:** Use `architecture-audit` to validate approach

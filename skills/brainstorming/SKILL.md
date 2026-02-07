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

## The Process

### Phase 1: Understand Context

```
1. READ existing project state (files, docs, recent changes)
2. IDENTIFY what exists related to this request
3. UNDERSTAND the current architecture and patterns in use
4. NOTE constraints and dependencies
```

### Phase 2: Ask Questions

**Rules:**
- One question at a time — don't overwhelm
- Prefer multiple choice when possible
- Lead with your recommended option
- Ask until YOU understand, not until THEY tire

**Question categories by feature type:**

| Feature Type | Key Questions |
|-------------|---------------|
| UI/Frontend | Layout? Density? Interactions? Empty states? Responsive breakpoints? |
| API/Backend | Request/response format? Auth? Rate limits? Error handling? Versioning? |
| Data/Database | Schema? Relationships? Indexes? Migration strategy? Volume estimates? |
| Integration | Protocol? Auth? Retry? Failure modes? Timeout? Backpressure? |
| Performance | Target latency? Throughput? Caching strategy? Degradation mode? |

### Phase 3: Explore Approaches

```
1. PROPOSE 2-3 different approaches with trade-offs
2. PRESENT options conversationally with your recommendation
3. EXPLAIN the reasoning — "I recommend A because..."
4. DISCUSS trade-offs honestly — what do we sacrifice?
5. GET explicit approval before proceeding
```

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
```

### Phase 5: Document and Handoff

```
1. SAVE design to docs/plans/YYYY-MM-DD-<topic>-design.md
2. COMMIT design document
3. OFFER: "Ready to create an implementation plan?"
4. IF YES → Use writing-plans skill
```

## Red Flags — STOP

- Jumping to code without design approval
- Assuming requirements
- Ignoring edge cases
- Designing for scale you don't need (YAGNI)
- Not questioning "obvious" requirements
- Accepting vague requirements without clarification

## Integration

- **After brainstorming:** Use `writing-plans` to create implementation plan
- **During brainstorming:** Use `git-workflow` for initial branching
- **For existing codebases:** Use `codebase-mapping` first

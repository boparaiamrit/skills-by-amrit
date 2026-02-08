# brainstorming Examples

> Creative ideation with structured exploration and divergent thinking.

## When to Use

- New feature design
- Architecture decisions
- Problem exploration
- Multiple solution evaluation

---

## Antigravity Examples

### Example 1: Feature Brainstorming

```
I need to add a notification system to my app. Please use the brainstorming skill to explore options.
```

**The skill generates:**
- Mind map of notification types (push, email, in-app, SMS)
- Trade-off matrix for each approach
- Implementation complexity vs user value analysis
- Recommended approach with rationale

### Example 2: Architecture Decision

```
We're choosing between monolith vs microservices. Brainstorm the implications.
```

---

## Claude Code Examples

### Example 1: Structured Exploration

```
@/plan "Add real-time collaboration to our document editor"
```

Uses brainstorming internally to explore:
- WebSocket vs SSE vs polling
- CRDT vs OT for conflict resolution
- Presence indicators implementation

---

## Output Format

```markdown
## Brainstorm: [Topic]

### Options Explored
1. **Option A** — [Description]
   - Pros: ...
   - Cons: ...
   - Effort: [Low/Med/High]

2. **Option B** — [Description]
   - Pros: ...
   - Cons: ...
   - Effort: [Low/Med/High]

### Recommendation
[Option X] because [evidence-based rationale]

### Next Steps
1. [Action item]
2. [Action item]
```

---

## Related Skills

- [writing-plans](writing-plans.md) — After brainstorming, create the plan
- [codebase-mapping](codebase-mapping.md) — Understand existing code first

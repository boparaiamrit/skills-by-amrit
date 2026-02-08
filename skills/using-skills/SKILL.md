---
name: using-skills
description: "Use when a task could benefit from the skills library. Guides skill discovery, activation, composition, and effective application."
---

# Using Skills

## Overview

Skills are not optional reading — they are mandatory workflows when their activation conditions are met.

**Core principle:** If a skill exists for your situation, you MUST use it. Not using it is a process violation.

## The Iron Law

```
IF A SKILL EXISTS FOR YOUR SITUATION, YOU MUST USE IT. NO EXCEPTIONS.
```

## When to Use

- Before starting any task (check if a skill applies)
- When composing multiple skills for complex work
- When unsure which skill applies

## When NOT to Use

This is a meta-skill. It's always relevant. Check it before every task.

## Anti-Shortcut Rules

```
YOU CANNOT:
- Skip checking for applicable skills — check before EVERY task
- Cherry-pick parts of a skill — follow it completely or not at all
- Say "I know the gist" and skip reading SKILL.md — read it fully every time
- Override Iron Laws with rationalizations — Iron Laws are absolute
- Skip a skill because "this task is simple" — simple tasks have applicable skills too
- Use a skill partially and claim you followed it — partial compliance ≠ compliance
- Deviate from a skill without documenting why and getting approval
```

## How Skills Work

### Automatic Activation

Skills activate when their `description` field matches the current situation:

```yaml
# In each SKILL.md:
description: "Use when debugging any technical issue..."
```

Before every task, check: **Does a skill exist for this?**

### Skill Composition

Skills compose naturally. A typical feature implementation activates:

```
brainstorming          → Understand requirements
    ↓
writing-plans          → Create implementation plan
    ↓
executing-plans        → Execute task by task
    ├── test-driven-development  → Per-task TDD cycle
    ├── verification-before-completion → After each task
    └── git-workflow             → Atomic commits
    ↓
code-review            → Review all changes
    ↓
verification-before-completion → Final verification
```

### Common Compositions

| Scenario | Skill Chain |
|----------|------------|
| New feature | brainstorming → writing-plans → executing-plans |
| Bug fix | systematic-debugging → test-driven-development → verification-before-completion |
| Full audit | codebase-mapping → architecture-audit + security-audit + performance-audit + database-audit |
| Refactoring | codebase-mapping → architecture-audit → refactoring-safely |
| Production incident | incident-response → systematic-debugging → test-driven-development |
| New API endpoint | brainstorming → api-design-audit → writing-plans → executing-plans |
| Frontend feature | brainstorming → frontend-audit → writing-plans → executing-plans |
| Deep quality check | product-completeness-audit → brutal-exhaustive-audit |
| API integration | full-stack-api-integration → verification-before-completion |
| Documentation | writing-documentation → code-review |
| Multi-role task | agent-team-coordination → (skills per role) |

## Skill Discovery

When starting a task:

```
1. READ the task description
2. IDENTIFY keywords that match skill descriptions
3. CHECK the entry point file activation table
4. IF match found → READ the SKILL.md before proceeding
5. IF multiple matches → compose them in logical order
6. IF no match → Proceed with general principles from core-principles.md
```

## Rules for Skill Usage

### Don't Skip Steps

Each skill's process is sequential and complete. Skipping steps means:
- You'll miss something
- You'll produce worse results
- You'll violate the iron law

### Don't Cherry-Pick

Using "the parts I like" from a skill is not using the skill. Follow it completely or not at all.

### Don't Override Iron Laws

Iron laws exist because violations cause real damage. No rationalization justifies breaking them.

### Do Compose Skills

Skills are designed to work together. When multiple skills apply, use all of them in the appropriate order.

### Do Report Deviations

If you need to deviate from a skill (rare), document why and get approval.

### Do Re-Read Skills

Even if you've used a skill before, re-read the SKILL.md each time. Skills get updated and your memory is imperfect.

## Quick Reference

| Need | Skill |
|------|-------|
| "I need to build something" | brainstorming → writing-plans → executing-plans |
| "Something is broken" | systematic-debugging |
| "Review this code" | code-review |
| "Is this done?" | verification-before-completion |
| "Audit the system" | codebase-mapping → [appropriate audit skills] |
| "Improve existing code" | refactoring-safely |
| "Production is down" | incident-response |
| "Write tests" | test-driven-development |
| "Document this" | writing-documentation |
| "Check security" | security-audit |
| "Why is it slow?" | performance-audit |
| "Check the database" | database-audit |
| "Check the frontend" | frontend-audit |
| "Design an API" | api-design-audit |
| "Check dependencies" | dependency-audit |
| "Check logging/monitoring" | observability-audit |
| "Check accessibility" | accessibility-audit |
| "Check CI/CD" | ci-cd-audit |
| "Git help" | git-workflow |
| "Check completeness" | product-completeness-audit |
| "Deep exhaustive audit" | brutal-exhaustive-audit |
| "Integrate an API" | full-stack-api-integration |
| "Multi-agent task" | agent-team-coordination |
| "Cross-session context" | persistent-memory |
| "Create a new skill" | writing-skills |

## Integration

- This is a meta-skill: used to discover and apply other skills
- Pairs with `writing-skills` for creating new skills
- References all other skills in the library

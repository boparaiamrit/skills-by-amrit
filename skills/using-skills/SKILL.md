---
name: using-skills
description: "Use when a task could benefit from the skills library. Guides skill discovery, activation, composition, and effective application."
---

# Using Skills

## Overview

Skills are not optional reading — they are mandatory workflows when their activation conditions are met.

**Core principle:** If a skill exists for your situation, you MUST use it. Not using it is a process violation.

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

## Skill Discovery

When starting a task:

```
1. READ the task description
2. IDENTIFY keywords that match skill descriptions
3. CHECK the CLAUDE.md activation table
4. IF match found → READ the SKILL.md before proceeding
5. IF no match → Proceed with general principles from core-principles.md
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
| "Create a new skill" | writing-skills |

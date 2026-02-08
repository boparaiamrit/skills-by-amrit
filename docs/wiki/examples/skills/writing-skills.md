# writing-skills Examples

> How to create new skills for the framework.

## Skill Structure

```
skills/[skill-name]/
└── SKILL.md
```

## SKILL.md Template

```markdown
---
name: skill-name
description: "Brief description for skill discovery"
---

# Skill Name

## Overview
What this skill does and when to use it.

## Iron Law
The ONE non-negotiable rule.

## When to Use
- Scenario 1
- Scenario 2

## When NOT to Use
- Anti-scenario 1

## Process

### Phase 1: [Name]
Steps...

### Phase 2: [Name]
Steps...

## Output Format
Expected output structure.

## Red Flags
Warning signs to watch for.

## Integration
Related skills.
```

## Example: Creating a New Skill

```
I need to create a skill for reviewing database migrations.

1. Create skills/migration-review/SKILL.md
2. Define Iron Law: "Every migration must be reversible"
3. Document process phases
4. Add to activation table in CLAUDE.md/GEMINI.md
```

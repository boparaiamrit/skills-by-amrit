---
name: writing-skills
description: "Use when creating new skills for the skills library. Defines the structure, format, quality standards, and testing requirements for new skills."
---

# Writing Skills

## Overview

Skills are the building blocks of this system. A well-written skill makes AI assistants genuinely better. A poorly-written skill adds noise.

**Core principle:** If following the skill doesn't produce measurably better results, the skill shouldn't exist.

## The Iron Law

```
EVERY SKILL MUST HAVE A CLEAR IRON LAW, DEFINED ACTIVATION CONDITIONS, AND A VERIFIABLE PROCESS.
```

## Skill Directory Structure

```
skills/
└── skill-name/
    └── SKILL.md           # Required: The skill definition
```

Skills are single-file. All information lives in `SKILL.md`. No external dependencies.

## SKILL.md Format

Every skill MUST follow this structure:

```markdown
---
name: skill-name
description: "One-line description starting with 'Use when...' that enables automatic activation."
---

# [Skill Title]

## Overview
[2-3 sentences: what this skill does and why it matters]
[Core principle statement]

## The Iron Law
[NON-NEGOTIABLE rule in a code block]

## When to Use
[Specific, measurable activation conditions]
[Counter-examples: when NOT to use]

## The Process
[Numbered, sequential steps]
[Key decision points]
[Verification at each stage]

## Red Flags — STOP
[Signs the process is being violated]

## Common Rationalizations (optional)
[Excuses table: excuse → reality]

## Output Format (if applicable)
[Template for skill output]

## Integration
[How this skill connects to other skills]
```

## Quality Standards

### The Description (YAML frontmatter)

Must start with **"Use when..."** — this enables automatic activation:
- ✅ `"Use when debugging any technical issue — test failures, build errors, unexpected behavior."`
- ❌ `"A skill for debugging"` (no activation trigger)
- ❌ `"Debugging methodology"` (no actionable context)

### The Iron Law

Must be:
- **Absolute** — No exceptions, no "it depends"
- **Falsifiable** — You can determine if it's being followed
- **Concise** — One sentence in a code block
- ✅ `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`
- ❌ `Try to find the root cause when possible`

### The Process

Must be:
- **Sequential** — Clear order of operations
- **Verifiable** — Each step has a "done" condition
- **Actionable** — Concrete actions, not vague advice
- ✅ `1. RUN all tests  2. VERIFY they pass  3. IF any fail → STOP`
- ❌ `Make sure everything works`

### Red Flags

Must be:
- **Observable** — Things you can actually detect
- **Specific** — Not generic warnings
- ✅ "Wrote production code before a test"
- ❌ "Be careful"

## Naming Convention

- **Directory name:** `kebab-case`, verb-first or noun-phrase
- **Avoid:** Generic names like "best-practices" or "tips"
- ✅ `test-driven-development`, `systematic-debugging`, `security-audit`
- ❌ `good-coding`, `useful-stuff`, `misc-tips`

## Testing a Skill

Before adding a skill, verify:

```
1. FOLLOW the skill yourself on a real project
2. DOES it produce better results than not following it?
3. IS the process clear enough to follow literally?
4. ARE the activation conditions specific enough?
5. COULD someone misinterpret any step?
6. IS anything missing? (common edge cases)
```

## What Makes a Skill Valuable

| Property | High Value | Low Value |
|----------|-----------|----------|
| Specificity | Exact steps for exact situations | Generic advice |
| Falsifiability | Clear pass/fail criteria | "It depends" |
| Iron Law | Non-negotiable rule | Soft suggestion |
| Integration | Connects to other skills | Standalone |
| Rationalization prevention | Tables of excuses with rebuttals | None |
| Process enforcement | Checkpoints and verification | Trust-based |

## Integration

- This is a meta-skill: used to create new skills
- All created skills must cross-reference related skills
- New skills must be added to the `CLAUDE.md` activation table

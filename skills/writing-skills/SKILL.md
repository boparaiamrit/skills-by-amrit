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

## When to Use

- Creating a new skill for the library
- Enhancing an existing skill
- Reviewing a skill's quality
- Standardizing skill format

## When NOT to Use

- Applying an existing skill (use `using-skills`)
- The intended behavior is better captured as a workflow, not a skill

## Anti-Shortcut Rules

```
YOU CANNOT:
- Create a skill without an Iron Law — if it has no non-negotiable rule, it's advice, not a skill
- Write "Use when..." descriptions that are vague — "Use when coding" activates for everything
- Include "it depends" in a skill — skills are prescriptive, not suggestive
- Skip the Common Rationalizations section — every process has excuses people make to skip it
- Write a process with vague steps — "make sure it's good" is not a verifiable step
- Create a skill that duplicates another skill's scope — check existing skills first
- Skip the Anti-Shortcut Rules — they prevent the most common ways the skill gets bypassed
- Write Iron Questions that can be answered without evidence — "Did you check?" ≠ "What was the output?"
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "This skill is too short to need all sections" | Short skills still need structure. Sections prevent shortcuts. |
| "The process is self-explanatory" | To you, maybe. To an LLM following instructions literally, no. |
| "Iron Questions are overkill" | They're the accountability mechanism. Without them, skills get skipped. |
| "Not every skill needs rationalizations" | Every process has excuses for skipping it. Document them. |
| "I'll add the missing sections later" | Later never comes. Complete the skill now. |
| "This is a simple skill" | Simple skills with poor structure produce poor results. |

## Iron Questions

```
1. Does this skill have an Iron Law? (absolute, falsifiable, concise)
2. Does the description start with "Use when..."? (enables automatic activation)
3. Does every process step have a verifiable outcome? (not just "do X")
4. Are there Anti-Shortcut Rules? (preventing bypass)
5. Are there Common Rationalizations with rebuttals? (preventing excuses)
6. Are there Iron Questions that require evidence-based answers? (accountability)
7. Does it have When NOT to Use? (preventing misapplication)
8. Does it integrate with other skills? (skills compose, they don't standalone)
9. Could someone follow this skill LITERALLY and produce good results?
10. Is there an existing skill that already covers this? (check for duplication)
```

## Skill Directory Structure

```
skills/
└── skill-name/
    └── SKILL.md           # Required: The skill definition
```

Skills are single-file. All information lives in `SKILL.md`. No external dependencies.

## SKILL.md Format — The 10/10 Template

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

## When NOT to Use
[Counter-examples: when a different skill is appropriate]

## Anti-Shortcut Rules
[Code block: "YOU CANNOT:" followed by specific prohibitions]

## Common Rationalizations (Don't Accept These)
[Table: Rationalization | Reality]

## Iron Questions
[Numbered code block: questions requiring evidence-based answers]

## The Process / The Audit Process
[Numbered, sequential phases with steps]
[Key decision points]
[Verification at each stage]
[Tables and examples for clarity]

## Output Format (if applicable)
[Template for skill output]

## Red Flags — STOP
[Observable signs the process is being violated]

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

### Anti-Shortcut Rules

Must be:
- **Specific** — Name the exact shortcut being prohibited
- **Falsifiable** — You can tell if the rule was broken
- **Exhaustive** — Cover the most common ways people bypass the process
- ✅ `YOU CANNOT: Say "tests pass" without test output in this response`
- ❌ `Don't skip steps`

### Common Rationalizations

Must be:
- **Realistic** — Excuses people actually make
- **Rebutted** — Each excuse has a one-line shutdown
- **Formatted as table** — Easy to scan
- ✅ `"I'll write tests after" | You won't. And if you do, they'll test your implementation, not requirements`
- ❌ `Don't make excuses` (too vague)

### Iron Questions

Must be:
- **Evidence-requiring** — Can't be answered with "yes" alone
- **Specific** — About concrete artifacts, not feelings
- **Numbered** — In a code block for consistency
- ✅ `Have I run the FULL test suite in THIS response? (what was the output?)`
- ❌ `Did you test it?` (can be answered with "yes" without evidence)

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

## What Makes a Skill Valuable

| Property | 10/10 | 5/10 | 1/10 |
|----------|-------|------|------|
| Iron Law | Absolute, falsifiable, one sentence | Present but soft | Missing |
| Anti-Shortcut Rules | 6-8 specific prohibitions | Generic "don't skip" | Missing |
| Common Rationalizations | 5-8 realistic excuses with rebuttals | 2-3 weak ones | Missing |
| Iron Questions | 8-10 evidence-requiring questions | 3-4 yes/no questions | Missing |
| Process | Phased, verified, specific | Present but vague | Missing |
| When NOT to Use | Specific redirects to other skills | "When it doesn't apply" | Missing |
| Red Flags | Observable, specific behaviors | Generic warnings | Missing |
| Integration | Specific skill references with trigger conditions | "Works with other skills" | Missing |

## Testing a Skill

Before adding a skill, verify:

```
1. FOLLOW the skill yourself on a real project
2. DOES it produce better results than not following it?
3. IS the process clear enough to follow literally?
4. ARE the activation conditions specific enough?
5. COULD someone misinterpret any step?
6. IS anything missing? (common edge cases)
7. CHECK against the quality rubric above — does every cell say "10/10"?
```

## Integration

- This is a meta-skill: used to create new skills
- All created skills must cross-reference related skills
- New skills must be added to entry point files (CLAUDE.md, GEMINI.md) activation tables
- Use `using-skills` to understand how skills compose

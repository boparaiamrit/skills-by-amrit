---
name: writing-skills
description: "Use when creating new skills for the skills library. Defines the structure, format, quality standards, and testing requirements for new skills."
---

# Writing Skills

## Overview

Skills are the building blocks of this system. A well-written skill makes AI assistants genuinely better. A poorly-written skill adds noise.

**Core principle:** If following the skill doesn't produce measurably better results, the skill shouldn't exist.

**Master reference:** All skills inherit from `_rules/SKILL.md`. Read it before writing any skill.

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
- The behavior is a one-off checklist, not a repeatable process

## Anti-Shortcut Rules

```
YOU CANNOT:
- Create a skill without an Iron Law -- if it has no non-negotiable rule, it's advice, not a skill
- Write "Use when..." descriptions that are vague -- "Use when coding" activates for everything
- Include "it depends" in a skill -- skills are prescriptive, not suggestive
- Skip the Common Rationalizations section -- every process has excuses people make to skip it
- Write a process with vague steps -- "make sure it's good" is not a verifiable step
- Create a skill that duplicates another skill's scope -- check existing skills first
- Skip the Anti-Shortcut Rules -- they prevent the most common ways the skill gets bypassed
- Write Iron Questions that can be answered without evidence -- "Did you check?" != "What was the output?"
- Omit the Red Flags section -- without observable violation indicators, the skill cannot self-enforce
- Skip the Integration section -- isolated skills are broken skills
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
| "I'll just copy another skill and modify it" | Copying without understanding produces cargo-cult skills. Understand the WHY. |
| "The Red Flags are obvious" | If they were obvious, people wouldn't violate them. Write them down. |

## Iron Questions

```
1. Does this skill have an Iron Law? (absolute, falsifiable, concise)
2. Does the description start with "Use when..."? (enables automatic activation)
3. Does every process step have a verifiable outcome? (not just "do X")
4. Are there Anti-Shortcut Rules? (preventing bypass -- at least 6 specific prohibitions)
5. Are there Common Rationalizations with rebuttals? (preventing excuses -- at least 5)
6. Are there Iron Questions that require evidence-based answers? (accountability -- at least 8)
7. Does it have When NOT to Use? (preventing misapplication -- with redirects to correct skills)
8. Does it integrate with other skills? (skills compose, they don't standalone)
9. Could someone follow this skill LITERALLY and produce good results?
10. Is there an existing skill that already covers this? (check for duplication)
11. Does the skill have a Red Flags section with observable violations?
12. Does the skill conform to the _rules master reference?
```

---

## Skill File Anatomy

### Frontmatter Fields

Every `SKILL.md` begins with YAML frontmatter:

```yaml
---
name: skill-name          # Required. kebab-case, matches directory name
description: "Use when..." # Required. MUST start with "Use when" for activation
---
```

**Rules for `name`:**
- Must match the directory name exactly
- kebab-case only: `code-review`, `systematic-debugging`
- Verb-first or noun-phrase: `writing-plans`, `security-audit`
- Never generic: no `best-practices`, `tips`, `misc`, `utils`

**Rules for `description`:**
- Must start with "Use when" -- this is how activation matching works
- One sentence, specific enough to trigger on the right tasks
- Include example triggers after the dash: "Use when debugging any technical issue -- test failures, build errors, unexpected behavior."

### Body Structure (Required Sections)

Every skill MUST contain these sections in this order:

| Section | Purpose | Required? |
|---------|---------|-----------|
| `# [Title]` | Human-readable skill name | Yes |
| `## Overview` | 2-3 sentences + core principle | Yes |
| `## The Iron Law` | Non-negotiable rule in code block | Yes |
| `## When to Use` | Specific activation conditions | Yes |
| `## When NOT to Use` | Counter-examples with skill redirects | Yes |
| `## Anti-Shortcut Rules` | "YOU CANNOT:" prohibitions in code block | Yes |
| `## Common Rationalizations` | Table of excuses with rebuttals | Yes |
| `## Iron Questions` | Numbered evidence-requiring questions in code block | Yes |
| `## The Process` | Phased, sequential, verifiable steps | Yes |
| `## Output Format` | Template for skill output | If applicable |
| `## Red Flags -- STOP` | Observable violation indicators | Yes |
| `## Integration` | Cross-references to related skills | Yes |

### What Each Section Must Contain

**Overview:** Exactly 2-3 sentences describing what the skill does and why it matters, followed by a bold "Core principle:" statement. Some skills add "Violating the letter of this rule is violating the spirit of this rule." for emphasis.

**The Iron Law:** A single non-negotiable rule inside a code block. Must be SCREAMING_CASE. Must be absolute (no "try to" or "when possible"). Must be falsifiable (you can determine if it's being followed).

**When to Use:** Bullet list with specific, measurable conditions. Split into "Always" and "Optional" sub-sections if some conditions are mandatory and others are discretionary.

**When NOT to Use:** Bullet list with specific redirects. Each item should say what to do instead: "The task is a bug fix with clear reproduction steps (use `systematic-debugging`)".

**Anti-Shortcut Rules:** Code block starting with "YOU CANNOT:" followed by 6-8 specific prohibitions. Each prohibition names the exact shortcut and explains why it's wrong.

**Common Rationalizations:** Table with two columns: `Rationalization` and `Reality`. At least 5 rows. Each rebuttal is a one-line shutdown, not a paragraph.

**Iron Questions:** Numbered list inside a code block. At least 8 questions. Each question must require evidence to answer -- not just "yes" or "no". Include parenthetical guidance: `(what was the output?)`.

**The Process:** Broken into numbered phases (Phase 1, Phase 2, etc.) with numbered steps inside each phase. Steps use action verbs in CAPS: READ, VERIFY, CHECK, RUN, TRACE. Each step has a clear "done" condition.

**Red Flags:** Bullet list of observable behaviors that indicate the skill is being violated. These are the "stop and course-correct" triggers.

**Integration:** Bullet list showing how this skill connects to others. Uses format: `**After:** skill-name completes X` or `**Before:** skill-name starts Y`.

---

## Quality Checklist for New Skills

Run this checklist against every new skill before considering it complete:

### Iron Law Check
- [ ] Is there exactly one Iron Law?
- [ ] Is it in a code block?
- [ ] Is it SCREAMING_CASE?
- [ ] Is it absolute (no "try", "should", "when possible")?
- [ ] Is it falsifiable (can you determine violation)?
- [ ] Is it one sentence?

### Iron Questions Check
- [ ] Are there at least 8 questions?
- [ ] Are they in a numbered code block?
- [ ] Does each question require evidence (not just "yes/no")?
- [ ] Do questions have parenthetical guidance?
- [ ] Do questions cover the most common failure modes?

### Anti-Shortcut Rules Check
- [ ] Are there at least 6 prohibitions?
- [ ] Are they in a "YOU CANNOT:" code block?
- [ ] Does each name a specific shortcut?
- [ ] Does each explain why it's wrong?
- [ ] Do they cover the most tempting shortcuts?

### Common Rationalizations Check
- [ ] Are there at least 5 rationalizations?
- [ ] Is each rebuttal one line?
- [ ] Are the rationalizations realistic (things people actually say)?
- [ ] Is the format a table?

### Process Check
- [ ] Is the process broken into phases?
- [ ] Does each phase have numbered steps?
- [ ] Does each step use an action verb?
- [ ] Does each step have a verifiable outcome?
- [ ] Are there decision points (IF/THEN)?
- [ ] Could someone follow this literally and succeed?

### When to Use / When NOT to Use Check
- [ ] Are activation conditions specific and measurable?
- [ ] Do "When NOT to Use" items redirect to correct skills?
- [ ] Is there no overlap with existing skills?

### Red Flags Check
- [ ] Are all red flags observable behaviors?
- [ ] Are they specific (not "be careful")?
- [ ] Do they cover the most common violations?

### Integration Check
- [ ] Are related skills referenced by name?
- [ ] Is the direction specified (before/after/complements)?
- [ ] Does the skill fit into at least one activation chain?

---

## The Process

### Phase 1: Research and Scope

```
1. IDENTIFY the domain the skill covers -- what specific activity does it improve?
2. CHECK existing skills -- does any existing skill already cover this? (list them)
3. DEFINE the boundary -- what is IN scope and what is OUT of scope?
4. READ the _rules master reference to understand inherited principles
5. READ 2-3 existing well-crafted skills as reference (code-review, verification-before-completion, brainstorming are good examples)
```

### Phase 2: Draft the Core

```
1. WRITE the Iron Law first -- this defines the skill's non-negotiable rule
2. WRITE the description -- "Use when..." with specific activation triggers
3. WRITE When to Use -- specific conditions that activate this skill
4. WRITE When NOT to Use -- with redirects to correct skills
5. VERIFY the Iron Law is absolute, falsifiable, and concise
```

### Phase 3: Build the Guardrails

```
1. WRITE Anti-Shortcut Rules -- at least 6 specific prohibitions
   - Think: "What are the most common ways someone would skip this process?"
   - Each rule must name the specific shortcut and explain why it's wrong
2. WRITE Common Rationalizations -- at least 5 with one-line rebuttals
   - Think: "What excuses would someone give for not following this skill?"
3. WRITE Iron Questions -- at least 8 evidence-requiring questions
   - Think: "What questions, if answered honestly with evidence, guarantee quality?"
   - Each must require showing output/evidence, not just saying "yes"
```

### Phase 4: Define the Process

```
1. BREAK the process into 3-6 sequential phases
2. WRITE numbered steps for each phase using action verbs (READ, VERIFY, CHECK, RUN)
3. ADD decision points where outcomes branch (IF/THEN)
4. ENSURE each step has a verifiable "done" condition
5. ADD tables and examples where they improve clarity
6. TEST by reading the process literally -- would a strict rule-follower succeed?
```

### Phase 5: Add Safety Nets

```
1. WRITE Red Flags -- observable behaviors that indicate violation
2. WRITE the Integration section -- how does this connect to other skills?
3. WRITE the Output Format -- what does the skill produce? (if applicable)
4. ADD an Overview with core principle
```

### Phase 6: Review and Validate

```
1. RUN the full Quality Checklist (above) against the skill
2. SCORE the skill against the value rubric (below) -- every cell must say "10/10"
3. READ the skill from top to bottom as if you've never seen it -- is it clear?
4. VERIFY no section is missing
5. CHECK that the skill conforms to _rules master reference principles
```

---

## SKILL.md Format -- The 10/10 Template

Copy this template when creating a new skill:

```markdown
---
name: skill-name
description: "Use when [specific activation condition] -- [example triggers]."
---

# [Skill Title]

## Overview

[2-3 sentences: what this skill does and why it matters.]

**Core principle:** [One-sentence principle that captures the skill's philosophy.]

## The Iron Law

\```
[NON-NEGOTIABLE RULE IN SCREAMING CASE]
\```

[1-2 sentences explaining the Iron Law and its implications.]

## When to Use

**Always:**
- [Condition 1]
- [Condition 2]

**Optional but valuable:**
- [Condition 3]

## When NOT to Use

- [Counter-example 1] (use `other-skill` instead)
- [Counter-example 2] (use `other-skill` instead)

## Anti-Shortcut Rules

\```
YOU CANNOT:
- [Specific prohibition 1] -- [why it's wrong]
- [Specific prohibition 2] -- [why it's wrong]
- [Specific prohibition 3] -- [why it's wrong]
- [Specific prohibition 4] -- [why it's wrong]
- [Specific prohibition 5] -- [why it's wrong]
- [Specific prohibition 6] -- [why it's wrong]
\```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "[Excuse 1]" | [One-line rebuttal] |
| "[Excuse 2]" | [One-line rebuttal] |
| "[Excuse 3]" | [One-line rebuttal] |
| "[Excuse 4]" | [One-line rebuttal] |
| "[Excuse 5]" | [One-line rebuttal] |

## Iron Questions

\```
1. [Evidence-requiring question]? ([what evidence to show])
2. [Evidence-requiring question]? ([what evidence to show])
3. [Evidence-requiring question]? ([what evidence to show])
4. [Evidence-requiring question]? ([what evidence to show])
5. [Evidence-requiring question]? ([what evidence to show])
6. [Evidence-requiring question]? ([what evidence to show])
7. [Evidence-requiring question]? ([what evidence to show])
8. [Evidence-requiring question]? ([what evidence to show])
\```

## The Process

### Phase 1: [Phase Name]

\```
1. [ACTION VERB]: [What to do] -- [done condition]
2. [ACTION VERB]: [What to do] -- [done condition]
3. [ACTION VERB]: [What to do] -- [done condition]
\```

### Phase 2: [Phase Name]

\```
1. [ACTION VERB]: [What to do] -- [done condition]
2. IF [condition] THEN [action]
3. [ACTION VERB]: [What to do] -- [done condition]
\```

## Output Format

\```markdown
## [Skill Output Title]

### [Section 1]
[Template for output]

### [Section 2]
[Template for output]
\```

## Red Flags -- STOP

- [Observable violation behavior 1]
- [Observable violation behavior 2]
- [Observable violation behavior 3]
- [Observable violation behavior 4]

## Integration

- **Before:** `skill-name` -- [relationship]
- **After:** `skill-name` -- [relationship]
- **Complements:** `skill-name` -- [relationship]
```

---

## Common Mistakes When Writing Skills

### Mistake 1: Vague Iron Laws

```
BAD:  "Try to verify your work"
GOOD: "NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE"
```

The Iron Law must be absolute. If it contains "try", "should", "consider", or "when possible", it's not an Iron Law -- it's a suggestion.

### Mistake 2: Yes/No Iron Questions

```
BAD:  "Did you check the tests?"
GOOD: "Have I run the FULL test suite in THIS response? (what was the output?)"
```

If the question can be answered "yes" without providing evidence, it's useless. The parenthetical forces specificity.

### Mistake 3: Generic Anti-Shortcut Rules

```
BAD:  "Don't skip steps"
GOOD: "YOU CANNOT: Say 'tests pass' without test output in this response -- stale evidence is not evidence"
```

Each prohibition must name the exact shortcut, the exact thing being prohibited, and why.

### Mistake 4: Missing "When NOT to Use"

A skill without "When NOT to Use" will be activated incorrectly. Every skill must explicitly redirect to the correct skill for out-of-scope tasks.

### Mistake 5: Process Steps Without Verification

```
BAD:  "1. Review the code"
GOOD: "1. READ each changed file  2. CHECK for edge cases (null, empty, max, negative)  3. LIST all findings with severity"
```

Each step must have an observable outcome. "Review" is not observable. "READ and LIST findings" is.

### Mistake 6: Copying Without Understanding

Copying another skill's structure and swapping words produces a cargo-cult skill. Understand WHY each section exists:
- **Iron Law** exists to create a bright-line rule that prevents rationalization
- **Anti-Shortcut Rules** exist because people always find ways to skip process
- **Iron Questions** exist because self-assessment without evidence requirements is worthless
- **Rationalizations** exist because excuses are predictable and can be pre-rebutted

### Mistake 7: Over-Scoping the Process

A process with 10 phases and 50 steps will be ignored. Keep it to 3-6 phases with 3-5 steps each. If the process is too long, the skill's scope is too broad -- split it into two skills.

### Mistake 8: No Integration Section

Skills don't exist in isolation. Every skill must specify:
- What skills come before it in a workflow
- What skills come after it
- What skills complement it for deeper analysis

---

## Testing a Skill

Before adding a skill to the library, verify it meets quality standards:

### Structural Test

```
1. READ the skill top to bottom -- is every required section present?
2. RUN the Quality Checklist above -- does every item pass?
3. SCORE against the value rubric -- does every cell say "10/10"?
```

### Literal Interpretation Test

```
1. READ the process as if you are a strict rule-follower with no domain knowledge
2. FOLLOW every step exactly as written
3. IDENTIFY any step that is ambiguous, vague, or unverifiable
4. FIX those steps until they pass the literal interpretation test
```

### Activation Test

```
1. READ the description -- does it clearly match the intended use cases?
2. LIST 5 scenarios where this skill SHOULD activate -- does the description match?
3. LIST 5 scenarios where this skill should NOT activate -- does it correctly exclude them?
4. CHECK for overlap with existing skills -- would two skills both claim to activate?
```

### Adversarial Test

```
1. TRY to skip the process by finding loopholes -- do the Anti-Shortcut Rules catch you?
2. TRY to claim completion without evidence -- do the Iron Questions catch you?
3. TRY to rationalize skipping steps -- do the Common Rationalizations pre-rebut your excuse?
4. TRY to violate the Iron Law while technically following the process -- does the Red Flags section catch you?
```

### Real-World Test

```
1. APPLY the skill to a real task (not a toy example)
2. COMPARE the result to what you would produce WITHOUT the skill
3. IF the skill doesn't produce measurably better results, it shouldn't exist
4. COLLECT feedback -- what was confusing? What was missing? What was unnecessary?
```

---

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
| Description | "Use when..." with specific triggers | Generic one-liner | Missing or vague |
| Frontmatter | name + description, both correct | Partial | Missing |

---

## Skill Directory Structure

```
skills/
└── skill-name/
    └── SKILL.md           # Required: The skill definition
```

Skills are single-file. All information lives in `SKILL.md`. No external dependencies.

## Naming Convention

- **Directory name:** `kebab-case`, verb-first or noun-phrase
- **Avoid:** Generic names like "best-practices" or "tips"
- Good: `test-driven-development`, `systematic-debugging`, `security-audit`
- Bad: `good-coding`, `useful-stuff`, `misc-tips`

---

## Red Flags -- STOP

- Creating a skill without reading existing skills first
- Submitting a skill that fails any Quality Checklist item
- Writing an Iron Law that contains "try", "should", or "when possible"
- Writing Iron Questions answerable with "yes" alone
- Skipping the Integration section
- Writing a process longer than 6 phases (scope too broad -- split the skill)
- Copying another skill without understanding why each section exists
- Not testing the skill against a real task before adding it

## Integration

- **Master reference:** `_rules` -- all skills inherit core principles from here
- **Companion:** `using-skills` -- how to discover and apply skills
- **Feeds into:** Entry point files (CLAUDE.md, GEMINI.md) -- new skills must be registered in activation tables
- **Used by:** Any session where a new skill is being created or an existing skill enhanced
- **Quality gate:** New skills should pass a `code-review` of the SKILL.md file itself

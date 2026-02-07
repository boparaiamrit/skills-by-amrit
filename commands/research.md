---
name: research
description: "Deep research on a topic, technology, or codebase area before planning or implementation."
disable-model-invocation: true
argument-hint: "[topic-or-question]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - Task
---

# /research — Deep Research

Conduct thorough research on a topic before planning or implementation. Produces a structured research report.

## Instructions

### Step 1: Define Research Scope

From `$ARGUMENTS`, determine:
- **Research question:** What exactly are we investigating?
- **Research type:** Codebase analysis, technology evaluation, domain knowledge, or competitive analysis?
- **Depth required:** Quick scan (30 min) or deep dive (2+ hours)?

### Step 2: Codebase Research (If Applicable)

For questions about the existing codebase:

```bash
# Find relevant files
grep -rn "[keyword]" --include="*.ts" --include="*.js" --include="*.py" . | grep -v node_modules | head -50

# Map structure of relevant area
find [directory] -type f -not -path '*/node_modules/*' | head -50

# Check git history for relevant changes
git log --all --oneline --grep="[keyword]" | head -20

# Find related tests
find . -path "*/test*" -name "*[keyword]*" -o -path "*/spec*" -name "*[keyword]*" | head -20
```

For each relevant file found:
1. **Read the full file** — Don't skim. Understand the complete context.
2. **Trace imports/exports** — Map the dependency chain.
3. **Read the tests** — Tests document expected behavior.
4. **Check git blame** — Who wrote it, when, and why?

### Step 3: Technology Research (If Applicable)

For questions about technologies or approaches:

1. **Official documentation** — Always start here
2. **GitHub examples** — Look at how others use it
3. **Known issues** — Check for gotchas, breaking changes, compatibility
4. **Alternatives** — What else could solve this problem?
5. **Performance characteristics** — Speed, memory, scalability

### Step 4: Synthesize Findings

Create a structured research report. Save to `.planning/research/[topic-slug].md`:

```markdown
# Research: [Topic]

## Question
[The specific research question]

## Executive Summary
[3-5 sentence summary of key findings]

## Key Findings

### Finding 1: [Title]
- **Source:** [file:line or URL]
- **Detail:** [What was discovered]
- **Implications:** [What this means for our work]

### Finding 2: [Title]
...

## Patterns & Conventions
- [Pattern 1]: [Description and where it's used]
- [Pattern 2]: ...

## Risks & Concerns
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk] | Low/Med/High | Low/Med/High | [Action] |

## Recommendations
1. [Actionable recommendation]
2. [Actionable recommendation]

## References
- [Source 1] — [What it contributes]
- [Source 2] — [What it contributes]

## Open Questions
- [Question that needs further investigation]
- [Question that needs user input]
```

### Step 5: Report to User

Present the key findings and ask if they want to:
- **Proceed to planning** — `/plan [feature]` using this research
- **Dive deeper** — Research a specific finding further
- **Change direction** — Research revealed a better approach

---
description: "Full discussion workflow — multiple-choice preference capture with recommendations, quick-answer, and locked decisions."
---

# `/discuss` Workflow

> Complete workflow for pre-planning discussion. Use when a feature request has multiple valid approaches and user preference matters.

## Steps

### 1. Read Project Context
// turbo
```
Read .planning/MEMORY.md and .planning/STATE.md to understand current project state.
Read any existing CONTEXT.md in .planning/research/ or current phase directory.
```

### 2. Identify Decision Points

Analyze the user's request and list 3-8 decision points where multiple valid approaches exist. For each, identify 2-4 concrete options and your recommendation.

### 3. Present Multiple-Choice Questions

Present ALL questions in the MCQ format with recommendations. Include a quick-answer line at the bottom.

**Each question must have:**
- Lettered options (A, B, C, D) in a table
- 1-line trade-off per option
- A "✏️ Custom" option as the last choice
- 🏆 **Recommended** highlighted with rationale

**At the bottom of ALL questions, include:**

```markdown
### ⚡ Quick Answer

Answer all questions in one line:

> **All recommended:** `1A 2B 3A 4B 5A`
>
> **Example custom:** `1A 2B 3:"your custom preference here"`

**Your answer:**
```

Wait for the user's answer before proceeding.

### 4. Parse and Confirm

Parse the quick-answer sequence (e.g., `1A 2B 3C 4A 5:"Redis"`) and present the confirmation table:

```markdown
## ✅ Decisions Locked

| # | Decision | Your Choice | Notes |
|---|----------|-------------|-------|
| 1 | [Category] | A: [Choice] | 🏆 Matches recommendation |
| 2 | [Category] | B: [Choice] | ⚠️ Differs from recommendation |

> **Confirm these are correct?** Say "change Q3 to B" to modify.
```

### 5. Write CONTEXT.md

Create the locked decisions file at:
- Phase project: `.planning/phases/[NN]-[name]/CONTEXT.md`
- Standalone: `.planning/research/[feature]-context.md`

Include the quick-answer sequence in the file for reference.

### 6. Commit and Transition
// turbo
```bash
node planning-tools.cjs state add-decision "Discussed [feature] — locked [N] decisions"
git add .planning/
git commit -m "docs: lock decisions for [feature]"
```

Output:
```
"Decisions locked: [N] choices captured. Ready to plan.

Run /plan to create the implementation plan, or review the locked decisions first?"
```

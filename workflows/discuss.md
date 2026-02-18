---
description: "Full discussion workflow — structured preference capture with locked decisions and transition to planning."
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

Analyze the user's request and list 3-8 decision points where multiple valid approaches exist:

| # | Decision Point | Options |
|---|---------------|---------|
| 1 | [Category] | Option A, Option B, Option C |
| 2 | [Category] | Option A, Option B |

### 3. Ask Deep Questions

Present **5-10 specific either/or questions** — not open-ended:

```
1. [Specific A] or [Specific B]?
2. [Approach X] or [Approach Y]?
```

Wait for ALL answers before proceeding.

### 4. Confirm Understanding

Summarize back to the user:

```
"Based on your answers:
1. You want [X] not [Y]
2. You prefer [A] over [B]
3. [Constraint C] applies

Is this correct? Anything to change?"
```

### 5. Write CONTEXT.md

Create the locked decisions file at:
- Phase project: `.planning/phases/[NN]-[name]/CONTEXT.md`
- Standalone: `.planning/research/[feature]-context.md`

### 6. Commit and Transition
// turbo
```bash
git add .planning/
git commit -m "docs: lock decisions for [feature]"
```

Output:
```
"Decisions locked. Run /plan to create the implementation plan."
```

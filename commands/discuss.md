---
description: "Capture user preferences and lock decisions BEFORE planning begins. Prevents replanning from misaligned assumptions."
---

# `/discuss` — Pre-Planning Decision Capture

> Lock in the user's preferences before writing a plan. Prevents the #1 cause of rework: wrong assumptions about what the user wants.

## Why This Exists

Without this, the planning cycle looks like:
1. User says "add auth"
2. Agent plans OAuth2
3. User says "I wanted magic links"
4. Agent replans from scratch — wasting 50% of the context window

With `/discuss`, decisions are locked BEFORE planning:
1. User says "add auth"
2. Agent presents 5 multiple-choice questions with recommendations
3. User answers in one line: `1A 2B 3C 4A 5A`
4. Agent locks decisions and plans exactly what was requested — zero rework

## When to Use

- **Before** creating any implementation plan
- **Before** starting a new feature or non-trivial change
- **When** requirements are ambiguous or have multiple valid approaches
- **When** the user's preference matters (UI layout, library choice, architecture)

## When NOT to Use

- Bug fixes with clear reproduction
- Configuration changes
- Tasks where there's only one sensible approach
- User explicitly says "just do it, I trust your judgment"

## The Protocol

### Step 1: Understand the Scope

Read the user's request and identify the **decision points** — places where multiple valid approaches exist. Group them by category.

### Step 2: Present Multiple-Choice Questions

Present each question as a **lettered multiple-choice** with your **recommendation** highlighted. Always include a "Custom" option.

**Format (MANDATORY):**

```markdown
---

## 📋 Discussion: [Feature Name]

I've identified [N] decisions we need to lock before planning. Here are your options:

---

### Q1: [Decision Category] 🏗️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | [Option A name] | [1-line impact/trade-off] |
| **B** | [Option B name] | [1-line impact/trade-off] |
| **C** | [Option C name] | [1-line impact/trade-off] |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — [Why this is the best default]

---

### Q2: [Decision Category] 🔒

| | Option | What It Means |
|:---:|:---|:---|
| **A** | [Option A name] | [1-line impact/trade-off] |
| **B** | [Option B name] | [1-line impact/trade-off] |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: B** — [Why this is the best default]

---

### Q3: [Decision Category] 🎨

| | Option | What It Means |
|:---:|:---|:---|
| **A** | [Option A name] | [1-line impact/trade-off] |
| **B** | [Option B name] | [1-line impact/trade-off] |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — [Why this is the best default]

---

### ⚡ Quick Answer

Answer all questions in one line. Use the letter for your choice, or quotes for custom answers.

> **All recommended:** `1A 2B 3A`
>
> **Example custom:** `1A 2B 3:"infinite scroll with cursor pagination"`

**Your answer:**
```

**Question Design Rules:**

| Rule | Why |
|------|-----|
| 3-4 options max per question | More causes decision fatigue |
| Always include "Custom" as last option | Respect user's creativity |
| Always show your recommendation | Save user's time |
| 1-line trade-off per option | Don't overwhelm with paragraphs |
| 5-8 questions max total | Keep discussion focused |
| Group related decisions | Reduce cognitive load |

### Step 3: Parse the Quick Answer

When the user responds, parse their answer sequence:

```
Input: "1A 2B 3C 4A 5:'use Redis for caching'"

Parsed:
- Q1: Option A (Auth Method → Magic Links)
- Q2: Option B (Database → PostgreSQL)
- Q3: Option C (Deployment → Docker)
- Q4: Option A (CSS → Tailwind)
- Q5: Custom ("use Redis for caching")
```

If the user gives a natural language response instead, map it to the options:
```
User: "I want magic links, postgres, and tailwind. For Q3 I'm thinking Docker."
→ 1A 2B 3C 4A
```

If the user says something technically risky, note it but still respect their choice:

```markdown
> 📝 Note: localStorage for tokens has XSS risks. I recommend httpOnly cookies.
> But you've chosen localStorage — I'll implement it that way with appropriate XSS mitigations.
```

### Step 4: Confirm and Lock Decisions

Present a confirmation summary:

```markdown
## ✅ Decisions Locked

| # | Decision | Your Choice | Notes |
|---|----------|-------------|-------|
| 1 | Auth method | A: Magic Links | 🏆 Matches recommendation |
| 2 | Database | B: PostgreSQL | 🏆 Matches recommendation |
| 3 | Deployment | C: Docker | ⚠️ Differs from recommendation (Vercel) |
| 4 | CSS framework | A: Tailwind | 🏆 Matches recommendation |
| 5 | Caching | Custom: "Redis" | ✏️ Custom answer |

### Constraints Captured
- [Any constraints from the user's responses]
- [Budget, timeline, browser support, etc.]

### Anti-Preferences (Things You Do NOT Want)
- [Anything the user explicitly rejected or expressed dislike for]

> **Confirm these are correct?** Then I'll create the plan.
> To change anything, just say "change Q3 to B" or "change Q3 to 'Kubernetes instead'"
```

### Step 5: Save and Proceed

```bash
# Save the context file
# For phase-based projects:
.planning/phases/[phase-number]-[name]/CONTEXT.md

# For standalone features:
.planning/research/[feature-name]-context.md

# Update state
node planning-tools.cjs state add-decision "Discussed [feature] — locked [N] decisions"

# Commit
git add .planning/
git commit -m "docs: capture discussion context for [feature]"
```

Then transition:

```
"Decisions locked: [N] choices captured. Ready to plan.

Run /plan to create the implementation plan, or review the locked decisions first?"
```

## CONTEXT.md Format

The locked decisions file should follow this structure:

```markdown
# Discussion Context: [Feature Name]

## Date
[YYYY-MM-DD]

## Quick Answer Sequence
`1A 2B 3C 4A 5:"Redis for caching"`

## Locked Decisions (NON-NEGOTIABLE)

These decisions are final. Do not revisit during planning or execution.

| # | Decision | Choice | Notes |
|---|----------|--------|-------|
| 1 | Auth method | Magic Links | User prefers passwordless UX |
| 2 | Database | PostgreSQL | Already in stack |
| 3 | Deployment | Docker | Team uses Docker Compose |
| 4 | CSS framework | Tailwind v4 | User's preference |
| 5 | Caching | Redis | Custom: user specified |

## Constraints Captured

- Must work in Chrome, Firefox, Safari (no IE)
- Must support dark mode (user preference)
- Must load in < 2 seconds on 3G
- Budget: 2 days maximum

## User's Exact Words

> "[Copy user's key statements here — their words, not your interpretation]"

## Anti-Preferences (Things the User Does NOT Want)

- No modals — user hates modals
- No pagination — user prefers infinite scroll
- No skeleton loaders — user prefers spinner

## Unanswered (Deferred to Planning)

- Exact card fields (planner decides based on data model)
- Toast library choice (implementation detail)
```

## What Makes Decisions "Locked"

Once locked:
- **Planner** cannot substitute a different library, layout, or approach
- **Executor** cannot deviate from the locked decision (even if they "know better")
- **Only the user** can unlock/change a decision by explicitly saying so
- If a locked decision is technically impossible, the agent must STOP and report — not silently switch

## Integration

- **Before:** User has a feature request or requirement
- **After:** `writing-plans` uses the CONTEXT.md as input (locked decisions = constraints)
- **During planning:** Planner reads CONTEXT.md and respects all locked decisions
- **During execution:** Executor follows plan, which already incorporates locked decisions

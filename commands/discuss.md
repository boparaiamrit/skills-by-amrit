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
2. Agent asks 5 targeted questions
3. User locks decisions: "magic links, no passwords, Resend for email"
4. Agent plans exactly what was requested — zero rework

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

Read the user's request and identify the **decision points** — places where multiple valid approaches exist.

```markdown
## Decision Points Identified

For "[feature name]", I need your preference on:

1. **[Category 1]:** [Option A] vs [Option B] vs [Option C]
2. **[Category 2]:** [Option A] vs [Option B]
3. **[Category 3]:** [Approach A] vs [Approach B]
```

### Step 2: Deep Questions (5-10 Questions Maximum)

Ask targeted questions. Not "what do you want?" but specific either/or questions:

**Good Questions:**
```
1. Dashboard layout: Cards (Trello-style) or Table (spreadsheet-style)?
2. Auth provider: Supabase Auth, NextAuth, or custom JWT?
3. Data fetching: Server-side with page reload, or client-side with loading states?
4. Mobile: Responsive CSS only, or dedicated mobile components?
5. Error handling: Toast notifications, inline errors, or error pages?
```

**Bad Questions (DON'T ASK THESE):**
```
- "What kind of auth do you want?" (too vague)
- "How should the UI look?" (too open-ended)
- "What should happen on error?" (no options given)
```

### Step 3: Listen and Confirm

Let the user answer. Don't argue with their choices. Your job is to capture, not to convince.

If the user says something technically risky, note it but still respect their choice:

```markdown
> 📝 Note: localStorage for tokens has XSS risks. I recommend httpOnly cookies.
> But you've chosen localStorage — I'll implement it that way with appropriate XSS mitigations.
```

### Step 4: Lock Decisions

Create a `CONTEXT.md` for this phase/feature:

```markdown
# Discussion Context: [Feature Name]

## Date
[YYYY-MM-DD]

## Locked Decisions (NON-NEGOTIABLE)

These decisions are final. Do not revisit during planning or execution.

| # | Decision | Choice | Notes |
|---|----------|--------|-------|
| 1 | Dashboard layout | Cards (Trello-style) | User prefers visual density |
| 2 | Auth provider | Supabase Auth | Already using Supabase for DB |
| 3 | Data fetching | Server-side (SSR) | SEO is important |
| 4 | Mobile approach | Responsive CSS only | No budget for native |
| 5 | Error handling | Toast notifications | User prefers non-blocking UX |

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

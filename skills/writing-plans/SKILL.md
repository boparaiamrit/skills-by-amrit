---
name: writing-plans
description: "Use when you have a spec or requirements for a multi-step task and need to create a detailed implementation plan before touching code."
---

# Writing Plans

## Overview

Write implementation plans that are **executable prompts**, not documents that become prompts. Every word in the plan is read directly by the executor as its instruction set. There is no translation layer.

**Core principle:** Plans are prompts. If a different agent executed this plan verbatim, they would produce identical results without asking a single clarifying question.

## The Iron Laws

```
1. NO VAGUE STEPS — EVERY TASK HAS <files>, <action>, <verify>, <done>
2. PLANS MUST COMPLETE WITHIN ~50% CONTEXT — if too big, SPLIT
3. 2-3 TASKS PER PLAN MAXIMUM — more plans, smaller scope, consistent quality
```

## Context Engineering (CRITICAL)

Quality degrades as context fills. Plan for this.

| Context Usage | Quality Level | Action |
|---------------|---------------|--------|
| 0-30% | 🟢 PEAK | Full thoroughness |
| 30-50% | 🟡 GOOD | Still solid |
| 50-70% | 🟠 DEGRADING | Time to split/checkpoint |
| 70%+ | 🔴 POOR | Quality collapse — STOP |

**Rules:**
- Each plan: **2-3 tasks maximum**
- Each task: **15-60 minutes of execution time**
- Total plan scope: **Completable in a fresh context window**
- If you need 10 tasks, that's 4-5 plans, not 1 mega-plan
- "Could this plan be completed with peak-quality output?" If NO → split

## When to Use

**Always after:**
- Brainstorming produces an approved design
- A non-trivial feature request is understood
- `/discuss` captures user preferences (locked decisions)

**Skip when:**
- Single-file bug fix with clear cause
- Simple configuration change
- Copy editing

## When NOT to Use

- You don't have a design yet (use `brainstorming` first)
- The task is a single-step operation (just do it)
- You're exploring or prototyping (use `brainstorming` for exploration)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Write a task without <files>, <action>, <verify>, <done> fields
- Include "..." or "TODO" in code blocks — complete, copy-pasteable code always
- Write a task that takes > 60 minutes — break it down further
- Skip verification commands — every step has "Run: X, Expected: Y"
- Assume the executor knows the project — include exact paths and anti-patterns
- Write pseudocode — write real, compilable/runnable code
- Leave the test step as "write appropriate tests" — write the actual tests
- Plan more than what was designed — scope is defined by the design document
- Create a plan with more than 3 tasks — SPLIT into multiple plans
- Ignore user decisions from discuss-phase — locked decisions are NON-NEGOTIABLE
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "The executor will figure it out" | They won't. That's planning, not execution. |
| "The code is too long for the plan" | Include the complete code. Plans that skip code create gaps. |
| "This step is obvious" | Nothing is obvious without context. |
| "I'll add the test details during execution" | No. The test is part of the plan. |
| "The verification is self-evident" | Include exact command and expected output. |
| "3 tasks is too few for this feature" | Then create multiple plans. Quality > quantity per plan. |
| "All 8 tasks fit naturally in one plan" | Context will degrade. Split into 3 plans. Always split. |

## Iron Questions

```
1. Could someone with ZERO project knowledge follow this plan?
2. Does every task have <files>, <action>, <verify>, <done>?
3. Is every code block complete and copy-pasteable? (no "..." or "TODO")
4. Is each task doable in 15-60 minutes?
5. Are there 2-3 tasks per plan maximum?
6. Does every <action> include WHAT TO AVOID and WHY?
7. Does every <verify> have an exact command with expected output?
8. Does every <done> have measurable acceptance criteria?
9. Would a different agent produce identical results from this plan?
10. Can this plan complete in ~50% of a fresh context window?
```

## Task Anatomy — The Four Required Fields

Every task MUST have these four fields. No exceptions.

### 1. `<files>` — Exact file paths created or modified

```markdown
**Files:**
- Create: `src/auth/jwt-handler.ts`
- Modify: `src/routes/auth.ts` (add login endpoint)
- Create: `tests/auth/jwt-handler.test.ts`
```

Not "the auth files." Not "relevant files." EXACT PATHS.

### 2. `<action>` — Specific implementation with anti-patterns

```markdown
**Action:**
Create JWT handler using the `jose` library (NOT `jsonwebtoken` — CommonJS
incompatible with Edge runtime). Implement:
- `generateAccessToken(userId)` — 15min expiry, RS256 algorithm
- `generateRefreshToken(userId)` — 7day expiry, stored in httpOnly cookie
- `verifyToken(token)` — Returns decoded payload or throws `TokenExpiredError`

DO NOT:
- Use symmetric algorithms (HS256) — we need key rotation
- Store tokens in localStorage — XSS vulnerability
- Use `any` type for token payload — define `TokenPayload` interface
```

The `<action>` tells the executor what to build AND what to avoid. The anti-patterns prevent common mistakes.

### 3. `<verify>` — Exact commands to prove it works

```markdown
**Verify:**
```bash
# Tests pass
npm test -- tests/auth/jwt-handler.test.ts
# Expected: PASS — 5/5 tests passing

# Build passes
npm run build 2>&1 | tail -5
# Expected: Build successful

# Manual verification
curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"test@test.com","password":"test123"}' \
  -H "Content-Type: application/json"
# Expected: 200 with Set-Cookie header containing refresh token
```
```

### 4. `<done>` — Measurable acceptance criteria

```markdown
**Done when:**
- [ ] Valid credentials return 200 + JWT access token in body
- [ ] Refresh token set as httpOnly cookie (not in response body)
- [ ] Invalid credentials return 401 with generic error message
- [ ] Expired token verification throws `TokenExpiredError`
- [ ] All 5 tests pass, build green, no lint errors
```

## Plan Document Structure

```markdown
# Plan: [Feature Name]

**Goal:** [One sentence — what this plan achieves]
**Phase:** [Phase number from ROADMAP.md]
**Requires:** [Plans that must complete before this one, or "None"]
**Provides:** [What this plan gives to dependent plans]
**Context budget:** [2-3 tasks, ~X minutes total]

---

### Task 1: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`
- Create: `tests/exact/path/to/test.ts`

**Action:**
[Specific implementation instructions — what to build, how to build it,
what to avoid and WHY. Include complete code blocks.]

```typescript
// exact/path/to/file.ts
export function functionName(input: InputType): OutputType {
  // Complete implementation — no TODOs, no placeholders
  return result;
}
```

**Verify:**
```bash
npm test -- tests/exact/path/to/test.ts
# Expected: PASS — 3/3 tests passing
```

**Done when:**
- [ ] Function returns correct output for valid input
- [ ] Error thrown for invalid input
- [ ] All 3 tests pass, build green

---

### Task 2: [Next Component]
[Same four-field structure]

---

## Dependencies
- This plan depends on: [Plan X — provides database models]
- This plan is required by: [Plan Y — needs these endpoints]
```

## Task Sizing Rules

| Duration | Verdict |
|----------|---------|
| < 15 min | Too small — combine with another task |
| 15-60 min | ✅ Perfect size |
| 60-120 min | Borderline — consider splitting |
| > 120 min | Too big — MUST split |

## Plan Sizing Rules

| Tasks | Verdict |
|-------|---------|
| 1 task | Acceptable for simple plans |
| 2-3 tasks | ✅ Ideal plan size |
| 4-5 tasks | Too many — split into 2 plans |
| 6+ tasks | Way too many — split into 3+ plans |

## Handling User Decisions (from /discuss)

If a `CONTEXT.md` exists for this phase, it contains **locked decisions**:

```markdown
## Locked Decisions (NON-NEGOTIABLE)
- Card layout (not table) for dashboard
- Use jose library for JWT (not jsonwebtoken)
- Infinite scroll (not pagination)
```

These are **non-negotiable**. The plan MUST implement exactly what the user chose. Don't substitute, don't "improve," don't second-guess.

## Save Location

```
.planning/plans/[phase]-[N]-PLAN.md
# Example: .planning/plans/01-01-PLAN.md
```

For phase-based project:
```
.planning/phases/01-auth/01-01-PLAN.md
```

Commit the plan before execution begins:
```bash
node planning-tools.cjs state add-decision "Created plan [name]" --rationale "Covers [scope]"
git add .planning/plans/
git commit -m "docs: create plan [name]"
```

## Execution Handoff

After writing the plan:

```
"Plan complete: [N] tasks, ~[M] minutes estimated.

Ready to execute? Options:
1. Execute now — I'll run the tasks in sequence with verification
2. Review first — Check the plan before executing
3. Split further — If any task feels too large

Run /execute [plan-name] to begin."
```

Then use `executing-plans` skill.

## Red Flags — STOP

- Task missing any of the 4 required fields (files/action/verify/done)
- Plan has more than 3 tasks
- Task estimated at > 60 minutes
- Code snippets with `...` or `TODO`
- Anti-patterns not documented in `<action>`
- No verification commands
- Ignoring locked decisions from `/discuss`
- Assuming knowledge of project structure
- Planning more than what was designed

## Integration

- **Before:** `brainstorming` produces the design, `/discuss` captures user preferences
- **After:** `executing-plans` implements the plan
- **During:** `test-driven-development` governs each task
- **Throughout:** `git-workflow` for commit conventions
- **Tools:** `planning-tools.js` for state management

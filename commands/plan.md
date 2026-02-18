---
description: "Create a detailed implementation plan with task anatomy, context budgets, and user decision enforcement."
---

# `/plan` — Create Implementation Plan

> Create a plan that is an **executable prompt** — so clear that a different agent could execute it and produce identical results. Uses the `writing-plans` skill.

## Usage

```
/plan [feature-or-phase]  — Plan a specific feature or phase
/plan --from-discuss      — Plan using locked decisions from /discuss
```

## Prerequisites

1. `.planning/` exists (run `/init-project` first)
2. Ideally, `/discuss` was run to lock decisions (recommended, not required)
3. If `research_before_planning` is enabled in config, `/research` has been run

## Instructions

### Step 1: Load Context

```bash
# Load current state
node planning-tools.cjs state load
```

Read:
- `.planning/PROJECT.md` — understand the project
- `.planning/ROADMAP.md` — understand the phase
- `.planning/STATE.md` — understand current position
- Discussion context (if exists): `.planning/research/[feature]-context.md` or `.planning/phases/[NN]-[name]/CONTEXT.md`
- Existing codebase patterns

### Step 2: Respect Locked Decisions

If a CONTEXT.md exists with locked decisions, these are **non-negotiable constraints**:

```markdown
## Locked Decisions (NON-NEGOTIABLE)
- [Decision 1] — MUST implement exactly this way
- [Decision 2] — Do NOT substitute
```

If no CONTEXT.md exists, recommend running `/discuss` first:
```
"No locked decisions found. Run /discuss [feature] to capture preferences first?
Or proceed with planning using my best judgment?"
```

### Step 3: Research Codebase

Understand the codebase before planning:

```bash
# Check existing patterns
grep -r "pattern-to-find" src/ --include="*.ts" -l

# Understand the test setup
ls tests/ test/ __tests__/ spec/ 2>/dev/null

# Check dependencies
cat package.json | grep -A 50 '"dependencies"' 2>/dev/null
```

### Step 4: Design Solution

Make architecture decisions:
```markdown
### Decision: [Title]
- **Options:** [A vs B vs C]
- **Chosen:** [X]
- **Rationale:** [Why]
- **Trade-offs:** [What we give up]
```

Record decisions:
```bash
node planning-tools.cjs state add-decision "[decision]" --rationale "[why]"
```

### Step 5: Write Plan with Task Anatomy

Every task MUST have these four fields:

```markdown
# Plan: [Feature Name]

**Goal:** [One sentence]
**Phase:** [Phase number]
**Requires:** [Dependent plans or "None"]
**Context budget:** [2-3 tasks, ~X minutes]

---

### Task 1: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`

**Action:**
[What to build, how to build it, what to AVOID and why]

**Verify:**
```bash
[exact command]
# Expected: [exact output]
```

**Done when:**
- [ ] [Criterion 1 — measurable]
- [ ] [Criterion 2 — measurable]
```

### Plan Sizing Rules

| Tasks in Plan | Verdict |
|---------------|---------|
| 1 task | Acceptable for simple plans |
| 2-3 tasks | ✅ Ideal |
| 4-5 tasks | Too many — split into 2 plans |
| 6+ tasks | Way too many — split into 3+ plans |

### Task Sizing Rules

| Duration | Verdict |
|----------|---------|
| < 15 min | Too small — combine |
| 15-60 min | ✅ Perfect |
| > 60 min | Too big — split |

### Step 6: Quality Self-Check

Before saving, verify:
- [ ] Every task has `<files>`, `<action>`, `<verify>`, `<done>`
- [ ] Plan has 2-3 tasks maximum
- [ ] Each task is 15-60 minutes
- [ ] `<action>` includes DON'T/AVOID anti-patterns
- [ ] `<verify>` has exact commands with expected output
- [ ] `<done>` has measurable criteria (not vague)
- [ ] Locked decisions from CONTEXT.md are respected
- [ ] Plan can complete in ~50% of a fresh context window

### Step 7: Save and Commit

```bash
# Save plan
# Phase project: .planning/phases/[NN]-[name]/[NN]-[plan-number]-PLAN.md
# Standalone: .planning/plans/[name]-PLAN.md

git add .planning/plans/
git commit -m "docs: create plan [name]"
```

### Step 8: Offer Execution

```
"Plan: [name] — [N] tasks, ~[M] minutes

Ready to execute? Options:
1. /execute [plan] — Run it now
2. Review first — I'll walk through each task
3. Split further — If any task feels too large
4. /discuss — If decisions need locking first"
```

## Multi-Plan Features

If the scope requires multiple plans:

```
"This feature needs [N] plans to maintain quality:

Plan 1: [name] — [task count] tasks
Plan 2: [name] — [task count] tasks
Plan 3: [name] — [task count] tasks

Dependencies: Plan 2 requires Plan 1. Plan 3 requires Plan 2.

Start with Plan 1?"
```

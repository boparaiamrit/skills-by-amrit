---
description: "When plan execution reveals gaps — failing tests, unmet criteria, missing integrations. Creates and executes a mini-plan to close them."
---

# `/gap-closure` — Close Execution Gaps

> When a plan execution finishes but verification reveals gaps, this workflow creates a focused mini-plan to close them without re-running the entire plan.

## When to Activate

1. Plan execution summary shows `⚠️ Complete with deviations` or `❌ Blocked`
2. Full test suite fails after plan execution
3. Acceptance criteria from `<done>` are partially unmet
4. Integration testing reveals gaps between plans
5. UAT/verification finds issues

## Protocol

### Step 1: Identify Gaps

```markdown
## Gap Analysis: [Plan Name]

### Gaps Found
| # | Gap | Severity | Source |
|---|-----|----------|--------|
| 1 | [Description] | 🔴 Critical / 🟠 High / 🟡 Medium | Test failure / Unmet criteria / Integration |
| 2 | ... | ... | ... |

### Root Cause
[Brief analysis — why did the gap occur? Plan issue? Execution issue? Assumption wrong?]
```

### Step 2: Create Gap Closure Plan

A gap closure plan is a **mini-plan** — 1-2 tasks maximum, laser-focused on the gap:

```markdown
# Gap Closure: [Plan Name] — [Gap Description]

**Goal:** Close identified gap(s) from [Plan Name] execution
**Tasks:** [1-2 maximum]
**Estimated time:** [minutes]

---

### Task 1: [Fix Description]

**Files:**
- Modify: `path/to/file.ts`

**Action:**
[Specific fix — what to change and why]

**Verify:**
[Exact command that was failing, now expected to pass]

**Done when:**
- [ ] [Specific criterion that was unmet, now met]
```

### Step 3: Execute

Use the `executing-plans` skill to execute the gap closure plan. Same rules apply:
- One task, one commit
- Full verification
- Atomic commits

### Step 4: Re-Verify Original Criteria

After gap closure, re-run ALL original `<verify>` and `<done>` checks from the original plan:

```bash
# Re-run full test suite
npm test

# Re-check all <done> criteria from original plan
```

### Step 5: Close or Escalate

If ALL criteria pass:
```
1. Mark original plan as ✅ Complete
2. Update summary with gap closure notes
3. Proceed to next plan
```

If gaps remain:
```
1. DO NOT loop endlessly
2. After 2 gap closure attempts, ESCALATE:
   - "Two gap closure attempts haven't resolved [issue]. This needs redesign."
   - Return to planning
```

## Anti-Patterns

- ❌ Endless gap closure loops — max 2 attempts, then redesign
- ❌ Scope creep during closure — ONLY fix the identified gap
- ❌ Skipping re-verification — must confirm ALL original criteria, not just the fixed one
- ❌ Mini-plans with 3+ tasks — that's not a gap closure, that's a new plan

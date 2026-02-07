---
name: verify
description: "Validate built features through systematic verification and conversational UAT."
disable-model-invocation: true
argument-hint: "[plan-name or phase-number]"
allowed-tools:
  - Read
  - Grep
  - Glob
  - Bash
  - Write
  - Task
---

# /verify — Implementation Verification

Validate that built features work correctly, meet acceptance criteria, and haven't introduced regressions.

## Prerequisites
- Implementation should be complete (run `/execute` first)
- `.planning/plans/` should contain the relevant plan
- `.planning/STATE.md` should show completed tasks

## Instructions

### Step 1: Determine Scope

From `$ARGUMENTS`:
- If plan name given: Verify that specific plan
- If phase number given: Verify all plans in that phase
- If nothing: Verify the most recently executed plan from `.planning/STATE.md`

### Step 2: Automated Verification Suite

Run ALL automated checks:

```bash
echo "=== 1. BUILD CHECK ==="
npm run build 2>&1

echo "=== 2. TYPE CHECK ==="
npx tsc --noEmit 2>&1

echo "=== 3. TEST SUITE ==="
npm test 2>&1

echo "=== 4. LINT CHECK ==="
npm run lint 2>&1

echo "=== 5. SECURITY AUDIT ==="
npm audit --production 2>&1 | head -20
```

Record results in a table:

| Check | Status | Details |
|-------|--------|---------|
| Build | ✅/❌ | [summary] |
| Types | ✅/❌ | [errors if any] |
| Tests | ✅/❌ | [X passing, Y failing] |
| Lint | ✅/❌ | [errors if any] |
| Security | ✅/❌ | [vulnerabilities if any] |

### Step 3: Plan Compliance Check

Read the plan from `.planning/plans/`. For EACH task:

1. **Verify file existence** — All files listed in the task exist
2. **Verify implementation** — Read the files, confirm the implementation matches the task
3. **Check definition of done** — Verify each acceptance criterion
4. **Check for shortcuts** — Look for TODOs, placeholder code, hardcoded values

```markdown
### Task [N]: [Title]
- **Files exist:** ✅/❌
- **Implementation complete:** ✅/❌ [notes]
- **Acceptance criteria:**
  - [x] Criterion 1 — [evidence]
  - [ ] Criterion 2 — MISSING: [what's missing]
- **Code quality:** ✅/❌ [notes]
- **Verdict:** PASS / FAIL / PARTIAL
```

### Step 4: Integration Verification

Beyond individual tasks, verify the pieces work together:

1. **Data flow** — Does data flow correctly from input to storage to output?
2. **Error propagation** — Do errors cascade correctly without silent failures?
3. **Edge cases** — Test boundary conditions, empty inputs, max values
4. **Concurrent access** — If applicable, verify race conditions are handled

### Step 5: Regression Check

Ensure existing functionality still works:

```bash
# Check what files changed
git diff --stat HEAD~1

# Check if any tests were removed or weakened
git diff HEAD~1 -- '*.test.*' '*.spec.*' | grep "^-" | grep -v "^---" | head -20

# Run full test suite one more time
npm test 2>&1
```

### Step 6: Conversational UAT (If Applicable)

For user-facing features, present tests one at a time:

```markdown
## UAT Test 1: [Feature Name]
**What to check:** [Specific thing to verify]
**How to test:** [Step-by-step instructions]
**Expected result:** [What should happen]

Please confirm: Does this work correctly? (yes/no/partially)
```

Wait for user response. Record the result. Move to next test.

### Step 7: Generate Verification Report

Save to `.planning/uat/[plan-slug]-verification.md`:

```markdown
# Verification Report: [Plan Name]

## Overall Verdict: ✅ PASS / ⚠️ PASS WITH GAPS / ❌ FAIL

## Automated Checks
[Results table from Step 2]

## Task Compliance
[Per-task results from Step 3]

## Integration Results
[From Step 4]

## Regression Results
[From Step 5]

## UAT Results (if applicable)
[From Step 6]

## Gaps Found
[List of any failures with severity and fix suggestions]

## Recommendations
- [What to do next]
```

### Step 8: Generate Gap Fix Plans (If Gaps Found)

For each gap, create a fix plan:

```bash
# Save fix plan
cat > .planning/plans/[plan-slug]-fix.md << 'PLAN'
---
gap_closure: true
parent_plan: [plan-slug]
---
# Fix Plan: [Gap Description]
## Tasks
### Task 1: [Fix Description]
- Description: [Specific fix]
- Files: [What to modify]
- Verification: [How to confirm]
PLAN
```

Then tell the user:
- "Run `/execute [plan-slug]-fix` to apply the fixes"
- "Or `/debug [specific issue]` to investigate further"

### Step 9: Update State

Update `.planning/STATE.md`:
```markdown
## Verification: [Plan Name]
- **Status:** ✅ Passed / ⚠️ Passed with Gaps / ❌ Failed
- **Date:** [timestamp]
- **Automated:** [X/Y passing]
- **Manual:** [X/Y confirmed]
- **Gaps:** [count and severity summary]
```

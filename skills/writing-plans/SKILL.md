---
name: writing-plans
description: "Use when you have a spec or requirements for a multi-step task and need to create a detailed implementation plan before touching code."
---

# Writing Plans

## Overview

Write comprehensive implementation plans assuming the engineer executing them has zero codebase context and follows instructions literally. Every task is bite-sized (2-5 minutes), every step has exact file paths, complete code, and verification commands.

**Core principle:** A plan so clear that an enthusiastic junior engineer with no project context could follow it flawlessly.

## The Iron Law

```
NO VAGUE STEPS — EVERY TASK HAS EXACT FILES, EXACT CODE, EXACT VERIFICATION
```

"Add validation" is not a step. "Add email format validation using regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` to `src/validators/user.ts:validateEmail()`, returning `{ valid: false, error: 'Invalid email format' }` on failure" is a step.

## When to Use

**Always after:**
- Brainstorming produces an approved design
- A non-trivial feature request is understood
- A refactoring scope is defined

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
- Write a step without the exact file path — "update the config" is not a step
- Include "..." or "TODO" in code blocks — complete, copy-pasteable code always
- Write a step that takes > 5 minutes — break it down further
- Skip verification commands — every step has "Run: X, Expected: Y"
- Assume the executor knows the project structure — include exact paths
- Write pseudocode — write real, compilable/runnable code
- Leave the test step as "write appropriate tests" — write the actual tests
- Plan more than what was designed — scope is defined by the design document
- Use relative descriptions — "in the same folder" is vague; use full paths
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "The executor will figure it out" | They won't. That's planning, not execution. |
| "The code is too long for the plan" | Include the complete code. Plans that skip code create implementation gaps. |
| "This step is obvious" | Nothing is obvious without context. Spell it out. |
| "I'll add the test details during execution" | No. The test is part of the plan. Write it now. |
| "The verification is self-evident" | Include the exact command and expected output. Always. |
| "5 tasks is enough for this feature" | Count the actual steps. A "simple" feature often has 10+ tasks. |

## Iron Questions

```
1. Could someone with ZERO project knowledge follow this plan?
2. Is every code block complete and copy-pasteable? (no "..." or "TODO")
3. Does every task have a verification command with expected output?
4. Is each task doable in 2-5 minutes?
5. Are the tasks ordered correctly? (dependencies respected)
6. Does the plan cover error handling, not just happy path?
7. Does the plan include tests for every new behavior?
8. Does the plan match the approved design? (no extra scope)
9. Would the TDD cycle (RED → GREEN → REFACTOR) work for each task?
10. If I hand this plan to a different agent/developer, would they produce identical results?
```

## Plan Document Structure

Every plan MUST use this format:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies/libraries]
**Estimated Tasks:** [N tasks, ~M minutes each]
**Prerequisites:** [What must be true before starting]

---

### Task 1: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts`
- Test: `tests/exact/path/to/test.ts`

**Step 1: Write the failing test**

\`\`\`typescript
// tests/exact/path/to/test.ts
describe('ComponentName', () => {
  it('should do specific thing', () => {
    const result = functionName(input);
    expect(result).toBe(expected);
  });
});
\`\`\`

**Step 2: Run test — verify it fails**

Run: `npm test -- tests/exact/path/to/test.ts`
Expected: FAIL — "functionName is not defined"

**Step 3: Write minimal implementation**

\`\`\`typescript
// exact/path/to/file.ts
export function functionName(input: InputType): OutputType {
  return expected;
}
\`\`\`

**Step 4: Run test — verify it passes**

Run: `npm test -- tests/exact/path/to/test.ts`
Expected: PASS — 1/1 tests passing

**Step 5: Commit**

\`\`\`bash
git add tests/exact/path/to/test.ts exact/path/to/file.ts
git commit -m "feat: add specific feature"
\`\`\`

---

### Task 2: [Next Component]
...
```

## Task Granularity Rules

**Each task is ONE action (2-5 minutes):**

| ✅ Correct Granularity | ❌ Too Coarse |
|------------------------|---------------|
| "Write the failing test for user validation" | "Implement user management" |
| "Add the email column to users table" | "Set up the database" |
| "Create the API route handler" | "Build the API" |
| "Add input sanitization to search endpoint" | "Make it secure" |
| "Write error response for duplicate email" | "Handle errors" |

**Each task must have all of these:**

| Required | Why |
|----------|-----|
| Exact file paths | Executor shouldn't search for files |
| Complete code blocks | No guessing, no interpretation |
| Verification command | Prove it works before moving on |
| Expected output | Know what success looks like |
| Commit instruction | Atomic commits per task |

## Code in Plans

**Always include:**
- Complete, copy-pasteable code blocks
- Exact import statements
- Type annotations (if applicable)
- Error handling
- The full function, not just the changed lines

**Never include:**
- `// ... rest of the code` (complete code always)
- `// TODO: implement` (implement it in the plan)
- Pseudocode without real syntax
- Hand-wavy descriptions like "add appropriate validation"
- `// Add your logic here` placeholders

## Verification Commands

Every step that produces a testable result needs:

```markdown
**Verify:** `<exact command>`
**Expected:** <exact expected output or pattern>
```

Examples:
```markdown
**Verify:** `npm test -- tests/validators/email.test.ts`
**Expected:** PASS — 3/3 tests passing

**Verify:** `curl -X POST http://localhost:3000/api/users -d '{"email":"bad"}' -H "Content-Type: application/json"`
**Expected:** HTTP 422 — {"error":{"code":"VALIDATION_ERROR","details":[{"field":"email","message":"Invalid email format"}]}}
```

## Save Location

```
docs/plans/YYYY-MM-DD-<feature-name>.md
```

Commit the plan before execution begins.

## Execution Handoff

After writing the plan:

```
"Plan complete and saved. Two execution options:

1. **Subagent-Driven** — I dispatch fresh agents per task, review between tasks
2. **Sequential** — I execute tasks one by one with verification between each

Which approach?"
```

Then use `executing-plans` skill.

## Red Flags — STOP

- Writing steps without exact file paths
- Steps that take more than 5 minutes
- Missing verification commands
- Code snippets with `...` or `TODO`
- Assuming knowledge of project structure
- Planning more than what was designed
- No error handling in the plan
- No tests in the plan
- Steps that depend on unstated prerequisites

## Integration

- **Before:** `brainstorming` produces the design
- **After:** `executing-plans` implements the plan
- **During:** `test-driven-development` governs each task
- **Throughout:** `git-workflow` for commit conventions

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

## Plan Document Structure

Every plan MUST use this format:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence]
**Architecture:** [2-3 sentences about approach]
**Tech Stack:** [Key technologies/libraries]
**Estimated Tasks:** [N tasks, ~M minutes each]

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

## Code in Plans

**Always include:**
- Complete, copy-pasteable code blocks
- Exact import statements
- Type annotations (if applicable)
- Error handling

**Never include:**
- `// ... rest of the code` (complete code always)
- `// TODO: implement` (implement it in the plan)
- Pseudocode without real syntax
- Hand-wavy descriptions like "add appropriate validation"

## Verification Commands

Every step that produces a testable result needs:

```markdown
**Verify:** `<exact command>`
**Expected:** <exact expected output or pattern>
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

## Integration

- **Before:** `brainstorming` produces the design
- **After:** `executing-plans` implements the plan
- **During:** `test-driven-development` governs each task

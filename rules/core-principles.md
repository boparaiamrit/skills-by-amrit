# Core Principles

> Non-negotiable rules that govern all behavior. Every skill inherits these.

---

## The Three Iron Laws

### Iron Law 1: Evidence Before Claims

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command *in this message*, you cannot claim it passes.

**Violations:**
- "Should work now" → Run the command
- "I'm confident" → Confidence ≠ evidence
- "Tests should pass" → Show the output
- "Looks correct" → Prove it

### Iron Law 2: Root Cause Before Fixes

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed root cause analysis, you cannot propose fixes. Symptom fixes are failure.

**Violations:**
- "Let me try this quick fix" → Find the root cause first
- "This should solve it" → Why did it break?
- "I'll just add a null check" → Why is it null?

### Iron Law 3: Plan Before Code

```
NO IMPLEMENTATION WITHOUT A CLEAR PLAN FIRST
```

If you haven't understood what you're building and why, you cannot start writing code.

**Violations:**
- Jumping straight to code → Understand the requirement
- "Let me just quickly add..." → What's the design?
- Making it up as you go → Write the plan first

---

## Context Engineering — The Quality Degradation Curve

```
QUALITY DEGRADES AS CONTEXT FILLS. PLAN FOR THIS.
```

As the context window fills during long execution sessions, output quality drops predictably:

| Context Usage | Quality Level | Behavior |
|---------------|---------------|----------|
| 0-30% | 🟢 PEAK | Thorough, comprehensive, catches edge cases |
| 30-50% | 🟡 GOOD | Confident, solid work, minimal shortcuts |
| 50-70% | 🟠 DEGRADING | Efficiency mode — starts cutting corners |
| 70%+ | 🔴 POOR | Rushed, minimal, misses important details |

### Context Budget Rules

1. **Plans must be small enough to complete within ~50% context** — if a plan would fill the context window, it's too big. Split it.
2. **2-3 tasks per plan maximum** — More plans, smaller scope, consistent quality.
3. **Fresh context for each plan** — When using subagents, each gets a clean context window.
4. **Orchestrators stay lightweight** — Coordinators should use ≤15% context. They route, not implement.
5. **If you feel yourself rushing, STOP** — This is the degradation curve talking. Checkpoint and hand off.

### The Litmus Test

> "Could this plan be completed with peak-quality output in a single fresh context window?"
>
> If NO → Split the plan. Always split.

---

## Verification Protocol

Before ANY claim of success, completion, or correctness:

```
1. IDENTIFY: What command proves this claim?
2. RUN: Execute the FULL command (fresh, complete)
3. READ: Full output, check exit code, count failures
4. VERIFY: Does output confirm the claim?
   - If NO → State actual status with evidence
   - If YES → State claim WITH evidence
5. ONLY THEN: Make the claim

Skip any step = lying, not verifying.
```

### Verification Requirements by Claim Type

| Claim | Requires | Not Sufficient |
|-------|----------|----------------|
| "Tests pass" | Test command output showing 0 failures | Previous run, "should pass" |
| "Build succeeds" | Build command with exit code 0 | "Linter passed" |
| "Bug fixed" | Reproduction test passes | "Code looks right" |
| "Feature complete" | All acceptance criteria verified | "Tests pass" alone |
| "No regressions" | Full test suite green | Targeted tests only |
| "Linter clean" | Linter output with 0 errors | Partial run |
| "Type-safe" | Type checker passes | "No red squiggles" |

---

## Code Quality Standards

### Universal (Framework-Agnostic)

1. **Single Responsibility** — Every function, class, and module does one thing
2. **DRY** — Extract shared logic. If you copy-paste, you're doing it wrong
3. **YAGNI** — Don't build it until you need it. Remove speculative features
4. **Explicit over implicit** — Name things clearly. Avoid magic
5. **Fail fast** — Validate inputs early. Throw on unexpected state
6. **Immutability preferred** — Avoid mutation where possible
7. **Composition over inheritance** — Prefer composition. Use interfaces
8. **Error handling is mandatory** — No bare catch blocks. No swallowed errors
9. **Tests are mandatory** — No production code without tests
10. **Documentation is mandatory** — Complex logic gets comments. Public APIs get docs

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Functions | Verb-first, describes action | `calculateTotal()`, `validateInput()` |
| Booleans | Question form | `isValid`, `hasPermission`, `canDelete` |
| Constants | SCREAMING_SNAKE or descriptive | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| Classes | Noun, PascalCase | `OrderProcessor`, `UserValidator` |
| Files | Match primary export | `order-processor.ts`, `user_validator.py` |

### Code Smells — Stop and Refactor

| Smell | Symptom | Action |
|-------|---------|--------|
| God class | Class > 300 lines or > 5 responsibilities | Split |
| Long function | Function > 50 lines | Extract |
| Deep nesting | > 3 levels of indentation | Flatten with early returns |
| Primitive obsession | Passing 5+ raw params | Create a value object |
| Feature envy | Method uses more from another class | Move it |
| Shotgun surgery | One change requires editing 5+ files | Consolidate |
| Magic numbers | `if (status === 3)` | Extract to named constant |
| Dead code | Commented-out code, unused imports | Delete it |

---

## Communication Standards

### How to Report Findings

Every finding follows this structure:

```markdown
### [Finding Title]

**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low | ⚪ Info
**Location:** `path/to/file.ts:42`
**Evidence:** [What you observed — exact output, code snippet]
**Impact:** [What happens if this isn't fixed]
**Recommendation:** [Specific, actionable fix]
```

### How to Communicate Status

- **Be honest** — If something is broken, say it's broken
- **Be specific** — "3 of 47 tests fail" not "some tests fail"
- **Be actionable** — "Add index on `user_id` column" not "database is slow"
- **Show evidence** — Include output, not just conclusions
- **Acknowledge uncertainty** — "I'm not sure about X" is always acceptable

---

## Process Standards

### Before Starting Any Task

1. Read the requirement fully
2. Ask clarifying questions (don't assume)
3. Check if a relevant skill exists
4. Follow the skill's process

### During Execution

1. Work in small, verifiable steps
2. Commit frequently with clear messages
3. Test as you go — don't batch testing to the end
4. If something feels wrong, stop and investigate

### Before Claiming Completion

1. Run the full verification suite
2. Check all acceptance criteria
3. Review your own changes
4. Confirm nothing is left behind (TODOs, debug code, commented-out code)

---

## Rationalization Prevention

These are common excuses for skipping process. None are acceptable.

| Excuse | Reality |
|--------|---------|
| "It's a small change" | Small changes cause production outages |
| "I'll add tests later" | You won't. Write them now |
| "It's obvious" | If it were obvious, it wouldn't need discussing |
| "We're in a hurry" | Rushing guarantees rework |
| "Just this once" | There are no exceptions |
| "It works on my machine" | That's not verification |
| "The linter passed" | Linter ≠ correctness |
| "I'm confident" | Confidence ≠ evidence |
| "It's temporary" | Nothing is more permanent than a temporary fix |

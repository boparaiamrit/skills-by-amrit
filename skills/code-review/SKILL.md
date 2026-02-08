---
name: code-review
description: "Use when completing tasks, implementing features, before merging, or when asked to review code. Systematic review process covering correctness, security, performance, and maintainability."
---

# Code Review

## Overview

Catch issues before they cascade. Every change gets reviewed systematically before it ships.

**Core principle:** Review early, review often. Fresh eyes find what familiar ones miss.

## The Iron Law

```
NO MERGE WITHOUT REVIEW. NO REVIEW WITHOUT EVIDENCE.
```

## When to Use

**Mandatory:**
- Before merging to main/production branch
- After completing a major feature
- After completing each task in a plan
- Before deploying

**Optional but valuable:**
- When stuck (fresh perspective)
- Before refactoring (baseline check)
- After fixing complex bugs
- When learning a new codebase

## When NOT to Use

- Reviewing auto-generated code (migrations, scaffolds) — verify output instead
- Reviewing dependency lock file diffs — use `dependency-audit`
- One-character typo fixes (just commit it)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "code looks good" — review every changed file, every function
- Say "logic is correct" — trace execution with edge case inputs (null, empty, max, negative)
- Say "tests are sufficient" — verify error paths are tested, not just happy paths
- Say "security is fine" — check for injection, auth bypass, data exposure explicitly
- Say "performance is acceptable" — check for N+1 queries, unbounded loops, missing pagination
- Skip unchanged files in the diff — context matters (does the change break callers?)
- Rubber-stamp small PRs — small bugs in small PRs cause large outages
- Review only the code, not the tests — tests ARE deliverables
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "It's just a small change" | Small changes cause most production incidents. Review it. |
| "The tests pass" | Tests can't catch what they don't test. Check coverage. |
| "I trust this developer" | Trust is not a review strategy. Evidence is. |
| "We're in a hurry" | Shipping a bug is slower than reviewing code. |
| "It's the same pattern as before" | Same pattern ≠ correct pattern. Maybe the pattern is wrong. |
| "LGTM" | Not a review. Name one thing you verified. |

## Iron Questions

```
1. If I give this function null, undefined, empty string, or -1, does it handle it?
2. If this endpoint receives 10,000 concurrent requests, what happens?
3. If the database is down when this runs, what error does the user see?
4. Can user A access user B's data through this change?
5. Is there any hardcoded value here that should be configurable?
6. If I revert this commit alone, does the codebase still work?
7. Are there any race conditions in this async code?
8. Does this change require a documentation update that's missing?
9. Could a junior developer understand this code in 6 months?
10. What's the blast radius if this code is wrong?
```

## The Review Process

### Step 1: Understand the Context

```
1. READ the PR/change description
2. READ the related design doc or issue
3. UNDERSTAND what it's supposed to do
4. UNDERSTAND what it should NOT do
5. CHECK the scope — is the change appropriately sized?
```

### Step 2: High-Level Review

```
1. Does the architecture make sense?
2. Is the approach consistent with existing patterns?
3. Are there simpler alternatives?
4. Is the scope appropriate? (too much? too little?)
5. Are there missing files? (new feature but no tests? no docs?)
```

### Step 3: Detailed Review

Go through each file change and check:

#### Correctness
- [ ] Logic is correct for all input ranges
- [ ] Edge cases handled (null, empty, zero, negative, max)
- [ ] Error handling is complete (not just happy path)
- [ ] Async operations properly awaited
- [ ] Resources properly cleaned up (connections, file handles)
- [ ] State mutations are intentional and documented
- [ ] Return values are correct in all branches

#### Security
- [ ] User input is validated and sanitized
- [ ] Authentication checked where needed
- [ ] Authorization verified (right user, right resource)
- [ ] No sensitive data in logs, URLs, or error messages
- [ ] SQL/NoSQL injection prevented (parameterized queries)
- [ ] CSRF/XSS protections in place
- [ ] Secrets not hardcoded
- [ ] No information leakage in error responses

#### Performance
- [ ] No N+1 queries
- [ ] Appropriate indexes for new queries
- [ ] No unnecessary computation in loops
- [ ] Large datasets paginated
- [ ] Expensive operations cached where appropriate
- [ ] No memory leaks (event listeners, subscriptions, closures)
- [ ] Database queries use appropriate limits

#### Maintainability
- [ ] Code is readable without comments
- [ ] Functions are single-purpose and < 50 lines
- [ ] Naming is clear and consistent
- [ ] No dead code or commented-out code
- [ ] DRY — no duplicated logic
- [ ] Types/interfaces properly defined
- [ ] No magic numbers or strings
- [ ] Appropriate abstraction level (not over-engineered, not under-designed)

#### Testing
- [ ] New behavior has tests
- [ ] Tests cover error paths, not just happy path
- [ ] Tests are independent and deterministic
- [ ] No test interdependencies
- [ ] Mocking is minimal and appropriate
- [ ] Edge cases tested
- [ ] Test names describe behavior ("should reject invalid email")

### Step 4: Report Findings

```markdown
## Code Review: [Feature/PR Name]

### Summary
[1-2 sentences: overall assessment]

### Strengths
- [What was done well — always include this]

### Findings

#### 🔴 Critical
- **[Issue]:** [Description with file:line reference]
  - **Impact:** [What goes wrong]
  - **Fix:** [Specific recommendation with code example]

#### 🟠 High
- **[Issue]:** [Description]
  - **Impact:** [What goes wrong]
  - **Fix:** [Recommendation]

#### 🟡 Medium
- **[Issue]:** [Description]
  - **Fix:** [Recommendation]

#### 🟢 Low
- **[Issue]:** [Description]
  - **Fix:** [Recommendation]

### Statistics
- Files reviewed: N
- Findings: N Critical, N High, N Medium, N Low
- Test coverage: Adequate / Insufficient / Missing

### Verdict
[APPROVE / REQUEST CHANGES / NEEDS DISCUSSION]
```

## Responding to Review Feedback

When YOU receive review feedback:

```
1. READ all feedback before responding
2. FIX Critical and High issues immediately
3. RESPOND to each point (agree, disagree with reasoning, or ask for clarification)
4. DON'T take it personally — reviews improve the code
5. PUSH BACK with technical reasoning if you disagree
6. VERIFY your fixes with evidence
```

## Red Flags — STOP

- Skipping review because "it's simple"
- Ignoring Critical findings
- Proceeding with unresolved High findings
- Rubber-stamping without actually reading code
- Reviewing only the happy path
- Not running the code/tests yourself
- Saying "LGTM" without evidence
- Reviewing only new code, not how it integrates with existing code

## Integration

- **After:** `executing-plans` completes a task
- **Before:** `git-workflow` merge operations
- **Feeds into:** `verification-before-completion`
- **Complements:** `security-audit` for deep security review
- **Complements:** `performance-audit` for deep performance review

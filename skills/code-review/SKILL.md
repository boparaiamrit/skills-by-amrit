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

## The Review Process

### Step 1: Understand the Context

```
1. READ the PR/change description
2. READ the related design doc or issue
3. UNDERSTAND what it's supposed to do
4. UNDERSTAND what it should NOT do
```

### Step 2: High-Level Review

```
1. Does the architecture make sense?
2. Is the approach consistent with existing patterns?
3. Are there simpler alternatives?
4. Is the scope appropriate? (too much? too little?)
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

#### Security
- [ ] User input is validated and sanitized
- [ ] Authentication checked where needed
- [ ] Authorization verified (right user, right resource)
- [ ] No sensitive data in logs, URLs, or error messages
- [ ] SQL/NoSQL injection prevented
- [ ] CSRF/XSS protections in place
- [ ] Secrets not hardcoded

#### Performance
- [ ] No N+1 queries
- [ ] Appropriate indexes for new queries
- [ ] No unnecessary computation in loops
- [ ] Large datasets paginated
- [ ] Expensive operations cached where appropriate
- [ ] No memory leaks (event listeners, subscriptions)

#### Maintainability
- [ ] Code is readable without comments
- [ ] Functions are single-purpose and < 50 lines
- [ ] Naming is clear and consistent
- [ ] No dead code or commented-out code
- [ ] DRY — no duplicated logic
- [ ] Types/interfaces properly defined

#### Testing
- [ ] New behavior has tests
- [ ] Tests cover error paths, not just happy path
- [ ] Tests are independent and deterministic
- [ ] No test interdependencies
- [ ] Mocking is minimal and appropriate
- [ ] Edge cases tested

### Step 4: Report Findings

```markdown
## Code Review: [Feature/PR Name]

### Summary
[1-2 sentences: overall assessment]

### Strengths
- [What was done well]

### Findings

#### 🔴 Critical
- **[Issue]:** [Description with file:line reference]
  - **Impact:** [What goes wrong]
  - **Fix:** [Specific recommendation]

#### 🟠 High
- ...

#### 🟡 Medium
- ...

#### 🟢 Low
- ...

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

## Integration

- **After:** `executing-plans` completes a task
- **Before:** `git-workflow` merge operations
- **Feeds into:** `verification-before-completion`

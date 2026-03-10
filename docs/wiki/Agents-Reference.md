# 🤖 Agents Reference

> 9 specialist agent definitions for Claude Code agent teams

Agent definitions are `.md` files installed to `.claude/agents/`. Each defines a specialist AI persona with focused protocols, principles, and anti-patterns.

---

## Agent Roster

```
🔬 Researcher ──▶ 📋 Planner ──▶ ⚙️ Executor ──▶ 🔍 Reviewer
                                       │
                         🐛 Debugger   ✅ Verifier   🗺️ Mapper
                              │
                    🔎 Investigator ──▶ 🔧 Fixer
```

---

## 🔬 Researcher

**File:** `agents/researcher.md`

**Purpose:** Deep codebase and domain research — gathers comprehensive evidence and context before planning or implementation begins.

**When to Use:**
- Before planning a new feature
- When investigating unfamiliar parts of the codebase
- When evaluating technology choices
- Before major refactoring efforts

**Key Behaviors:**
- Exhaustive search — leaves no stone unturned
- Source attribution — always cites where information came from
- Evidence-based — findings backed by code references
- Structured output — organized reports, not stream-of-consciousness

**Output Format:**
```markdown
# Research Report: [Topic]

## Executive Summary
[3-5 key findings]

## Codebase Analysis
[Detailed findings with file references]

## External Research
[Findings from docs, best practices, alternatives]

## Recommendations
[Prioritized recommendations with rationale]

## Risks
[Identified risks with severity and mitigation]
```

---

## 📋 Planner

**File:** `agents/planner.md`

**Purpose:** Task decomposition and implementation planning — generates dependency-aware plans with effort estimates, risk assessments, and implementation waves.

**When to Use:**
- After research is complete
- Before starting implementation
- When breaking down epics into stories/tasks

**Key Behaviors:**
- Dependency-aware — identifies what must come before what
- Risk-conscious — flags potential blockers early
- Effort estimation — T-shirt sizes (S/M/L/XL) or fibonacci
- Wave planning — groups tasks into parallel execution waves

**v4.0.0 Enhancements:**
- Structured `PLAN.md` output with `<files>`, `<action>`, `<verify>`, `<done>` blocks per task
- Automatic wave assignment based on dependency graph
- Plans capped at 2-3 tasks per plan to stay within context quality limits

---

## ⚙️ Executor

**File:** `agents/executor.md`

**Purpose:** Plan execution with quality gates — implements tasks from plans with checkpoint handling, inline verification, and state updates.

**When to Use:**
- When there's an existing plan ready to execute
- During implementation sprints
- When following a specific task list

**Key Behaviors:**
- Follows the plan — doesn't improvise or skip steps
- Wave-ordered execution — respects dependencies
- Checkpoint creation — saves state between waves
- Fail-fast — stops on blockers rather than continuing with assumptions
- Inline verification — tests after each task

**v4.0.0 Enhancements:**
- **Deviation protocol** — categorizes deviations as cosmetic/minor/moderate/major with escalation rules
- **Context fidelity** — enforces locked decisions from `/discuss`, forbidden from overriding them
- Atomic git commits per task with conventional commit format

---

## 🔍 Reviewer

**File:** `agents/reviewer.md`

**Purpose:** Structured code review — examines changes for correctness, security, performance, patterns, and maintainability.

**When to Use:**
- After implementation is complete
- During PR review
- Before merging to main branch

**Key Behaviors:**
- Multi-dimensional — checks security, correctness, performance, maintainability, style
- Severity-based — categorizes findings as critical/major/minor/nit
- Constructive — provides fix suggestions, not just criticism
- Thorough — reads full context before commenting

**Review Checklist:**
- [ ] Security: No vulnerabilities (injection, auth bypass, data exposure)
- [ ] Correctness: Logic is sound, edge cases handled
- [ ] Performance: No N+1s, unnecessary allocations, or bottlenecks
- [ ] Maintainability: Clear naming, appropriate abstraction, documented
- [ ] Tests: Adequate coverage, meaningful assertions
- [ ] Style: Consistent with codebase conventions

---

## 🐛 Debugger

**File:** `agents/debugger.md`

**Purpose:** Scientific debugging with hypothesis tracking — investigates issues using hypothesis-driven methodology with evidence chains.

**When to Use:**
- When a bug is reported
- When behavior is unexpected
- When production issues arise
- When tests fail mysteriously

**Key Behaviors:**
- Hypothesis-driven — proposes theories before investigating
- Evidence-based — tests hypotheses with targeted experiments
- Binary search — narrows scope efficiently
- Root cause focus — fixes the source, not the symptom
- Documentation — logs the investigation trail

---

## ✅ Verifier

**File:** `agents/verifier.md`

**Purpose:** Work verification and gap analysis — validates implementation against plans, runs comprehensive checks, identifies gaps.

**When to Use:**
- After executor completes tasks
- Before marking work as done
- During QA cycles

**Key Behaviors:**
- Criteria-driven — checks against acceptance criteria from the plan
- Automated checks — runs tests, linting, type checking
- Gap identification — finds what was missed or incomplete
- Fix plan generation — when gaps are found, generates a fix plan
- Regression checking — ensures existing functionality still works

**v4.0.0 Enhancements:**
- **Goal-backward verification** — starts from the acceptance criteria and works backward to verify each was met
- Gap closure generates a mini 1-2 task fix plan automatically

---

## 🗺️ Mapper

**File:** `agents/mapper.md`

**Purpose:** Codebase mapping and dependency analysis — analyzes project structure, module boundaries, dependencies, and health metrics.

**When to Use:**
- When onboarding to a new codebase
- When planning major refactoring
- When documenting system architecture
- When identifying tech debt hot spots

**Key Behaviors:**
- Systematic — covers every module methodically
- Visual — produces dependency graphs and diagrams
- Metrics-driven — calculates complexity, coupling, coverage
- Health assessment — identifies areas needing attention
- Actionable — prioritizes improvement recommendations

**Output:**
```markdown
# Codebase Map: [Project]

## Module Inventory
| Module | Files | Lines | Complexity | Coverage |
|:---|:---:|:---:|:---:|:---:|
| auth/ | 12 | 1,200 | Medium | 85% |
| api/ | 24 | 3,400 | High | 72% |

## Dependency Graph
[Visual or text representation]

## Entry Points
[Main entry files and execution flows]

## Health Report
[Areas of concern, hot spots, recommendations]
```

---

## 🔎 Investigator

**File:** `agents/investigator.md`

**Purpose:** Bug investigation specialist — systematically traces issues from symptoms to root cause through hypothesis generation, log analysis, and reproduction.

**When to Use:**
- As the first agent in the debug council preset
- When a bug needs systematic investigation before fixing
- When the root cause of an issue is unclear

**Key Behaviors:**
- Symptoms before hypotheses — documents exactly what's happening before theorizing why
- Evidence-based — every hypothesis is testable, every finding cites specific files or logs
- Systematic elimination — rules out possibilities methodically
- Reproduction-focused — if it can't be reproduced, it can't be verified
- Does NOT fix code — diagnoses, documents, and hands off to the Fixer

---

## 🔧 Fixer

**File:** `agents/fixer.md`

**Purpose:** Bug fix implementation — implements targeted, minimal fixes based on investigation findings with comprehensive verification.

**When to Use:**
- After the Investigator has identified the root cause
- When a surgical, minimal-footprint fix is needed
- As the second agent in the debug council preset

**Key Behaviors:**
- Minimal footprint — changes only what's necessary
- Evidence-based fixes — addresses the documented root cause, not symptoms
- Defense in depth — adds guards to prevent recurrence
- Verify before done — runs tests, confirms the symptom is resolved
- Documents the fix — future developers understand what was fixed and why

---

## 🤝 Using Agents Together

Agents are designed to work in sequence, with each agent's output feeding into the next:

```
1. 🗺️ Mapper    ──▶  Understand the codebase
2. 🔬 Researcher ──▶  Research the specific area
3. 📋 Planner    ──▶  Create the implementation plan
4. ⚙️ Executor   ──▶  Implement the plan
5. ✅ Verifier   ──▶  Verify implementation
6. 🔍 Reviewer   ──▶  Final review
```

For debugging:
```
1. 🐛 Debugger   ──▶  Investigate the bug
2. ⚙️ Executor   ──▶  Implement the fix
3. ✅ Verifier   ──▶  Verify the fix
```

In v4.0.0, this is powered by the [Council System](Council-System.md) with real `Task()` subagent spawning — each agent gets a fresh 200k context window and communicates through file-based handoffs. See [Council System](Council-System.md) for the full architecture.

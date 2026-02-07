# 🧠 Skills Reference — Core Development

> 8 foundational skills for everyday software engineering

These skills cover the complete development workflow — from brainstorming ideas through execution, testing, debugging, review, and delivery.

---

## 1. 💡 brainstorming

**Use When:** Before any creative or feature work — when you need ideas, approaches, or alternatives.

**What It Teaches The Agent:**
- Structured brainstorming techniques (mind mapping, SCAMPER, Six Thinking Hats)
- Divergent thinking before convergent decisions
- Evaluation frameworks for comparing approaches
- Trade-off analysis and decision matrices

**Key Protocols:**
1. Generate at least 3 distinct approaches before choosing
2. Map relationships between ideas visually
3. Evaluate on feasibility, impact, and complexity
4. Document rejected alternatives and why

**Anti-Patterns:**
- ❌ Jumping to the first solution
- ❌ Ignoring unconventional approaches
- ❌ Not considering trade-offs
- ❌ Brainstorming without constraints

---

## 2. 📝 writing-plans

**Use When:** Before implementing any feature or change — when you need a structured plan.

**What It Teaches The Agent:**
- Task decomposition into atomic units
- Dependency identification and wave planning
- Effort estimation (T-shirt sizes: S/M/L/XL)
- Risk assessment and mitigation strategies
- Acceptance criteria definition

**Key Protocols:**
1. Research before planning (never plan uninformed)
2. Decompose into tasks small enough to complete in one session
3. Identify dependencies → group into execution waves
4. Define clear acceptance criteria for each task
5. Include rollback strategies for risky changes

**Output:** `.planning/PLAN.md` with:
- Objective, scope, and non-goals
- Task list with dependencies, effort, and acceptance criteria
- Wave-ordered execution plan
- Risk register

---

## 3. ⚙️ executing-plans

**Use When:** After a plan is written — when it's time to implement.

**What It Teaches The Agent:**
- Wave-based execution (respect dependency order)
- Checkpoint creation between waves
- Inline verification after each task
- State tracking in `.planning/STATE.md`
- Fail-fast on blockers (don't keep going if something's wrong)

**Key Protocols:**
1. Read the plan completely before starting
2. Execute tasks in wave order
3. After each task: run tests, verify criteria
4. After each wave: create checkpoint, update state
5. If blocked: stop, report, wait for resolution

---

## 4. 🧪 test-driven-development

**Use When:** Writing any production code — tests should come first.

**What It Teaches The Agent:**
- Red-Green-Refactor cycle
- Test architecture (unit → integration → e2e pyramid)
- Fixture patterns and test factories
- Edge case identification
- Coverage strategies and meaningful metrics

**Key Protocols:**
1. **Red:** Write a failing test first
2. **Green:** Write minimum code to pass
3. **Refactor:** Clean up without changing behavior
4. Cover happy path, edge cases, and error paths
5. Use descriptive test names: `should_reject_negative_quantity`

**Anti-Patterns:**
- ❌ Writing tests after implementation
- ❌ Testing implementation details instead of behavior
- ❌ 100% coverage as a goal (test quality over quantity)
- ❌ Ignoring edge cases

---

## 5. 🐛 systematic-debugging

**Use When:** Investigating bugs, unexpected behavior, or production issues.

**What It Teaches The Agent:**
- Hypothesis-driven debugging (scientific method)
- Evidence chain construction
- Binary search isolation technique
- State inspection and reproduction
- Root cause analysis (5 Whys, Ishikawa)

**Key Protocols:**
1. **Reproduce** the bug reliably
2. **Hypothesize** the root cause
3. **Test** the hypothesis with targeted investigation
4. **Narrow** the scope using binary search
5. **Fix** the root cause, not the symptom
6. **Verify** the fix doesn't introduce regressions
7. **Document** the root cause and fix

**Output:** Debugging log with:
- Symptom description
- Hypothesis chain (tested, confirmed/rejected)
- Root cause
- Fix applied
- Regression test added

---

## 6. 🔍 code-review

**Use When:** After implementation — reviewing code for quality, security, and correctness.

**What It Teaches The Agent:**
- Multi-dimensional review (correctness, security, performance, maintainability)
- Severity-based feedback (🔴 Critical → 🟡 Major → 🔵 Minor → ⚪ Nit)
- Constructive feedback with examples, not just complaints
- Pattern recognition for common bugs

**Key Protocols:**
1. Read the full diff before commenting
2. Check: security → correctness → performance → maintainability → style
3. Every critical/major finding must include a fix suggestion
4. Acknowledge good patterns (positive feedback matters)
5. Distinguish blocking vs non-blocking feedback

**Severity Framework:**
| Severity | Blocks Ship? | Examples |
|:---|:---:|:---|
| 🔴 Critical | Yes | SQL injection, data loss, auth bypass |
| 🟡 Major | Yes | Logic errors, missing validation, race conditions |
| 🔵 Minor | No | Naming conventions, refactoring opportunities |
| ⚪ Nit | No | Style preferences, formatting |

---

## 7. ✅ verification-before-completion

**Use When:** Before marking any task as done — the final quality gate.

**What It Teaches The Agent:**
- Automated verification checks
- Compliance validation against acceptance criteria
- Regression testing
- Edge case exploration
- Documentation completeness

**Key Protocols:**
1. Run the full test suite
2. Verify ALL acceptance criteria from the plan
3. Check for regressions in related functionality
4. Verify documentation is updated
5. Confirm no TODO/FIXME/HACK comments remain
6. Check types, linting, and formatting

---

## 8. 📦 git-workflow

**Use When:** Making commits, branches, PRs, or dealing with Git operations.

**What It Teaches The Agent:**
- Conventional Commits format (`feat:`, `fix:`, `refactor:`, etc.)
- Atomic commits (one logical change per commit)
- Branch naming conventions (`feature/`, `fix/`, `chore/`)
- PR description templates
- Conflict resolution strategies

**Key Protocols:**
1. Use Conventional Commits: `type(scope): description`
2. Keep commits atomic — one logical change
3. Write meaningful commit bodies for non-obvious changes
4. Never commit: secrets, build artifacts, generated files
5. Rebase for linear history, merge for feature branches

**Commit Types:**
| Type | When |
|:---|:---|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behavior change) |
| `perf` | Performance improvement |
| `test` | Test changes |
| `docs` | Documentation |
| `chore` | Build, CI, tooling |
| `style` | Formatting (no logic change) |

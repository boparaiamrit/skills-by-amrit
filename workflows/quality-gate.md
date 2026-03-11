---
description: Run a structured technical quality pipeline with auto-detection, 6-step checks, 4 modes, and PASS/FAIL reporting
---

<purpose>
Technical quality gate that runs before commits and PRs. Auto-detects project type from manifest files. Executes a 6-step pipeline (Build, Type Check, Lint, Test, Security Scan, Diff Review) filtered by mode (quick, full, pre-commit, pre-pr). Produces a structured PASS/FAIL report.
</purpose>

<process>

<step name="determine_mode">
Parse `$ARGUMENTS` for mode:
- `quick` — Build + Test only (fast sanity check)
- `full` — All 6 pipeline steps (default if no argument)
- `pre-commit` — Build + Lint + Test
- `pre-pr` — All 6 steps + Coverage analysis

Pipeline step matrix:

| Step | quick | full | pre-commit | pre-pr |
|------|-------|------|------------|--------|
| Build | yes | yes | yes | yes |
| Type Check | — | yes | — | yes |
| Lint | — | yes | yes | yes |
| Test | yes | yes | yes | yes |
| Security | — | yes | — | yes |
| Diff Review | — | yes | — | yes |
| Coverage | — | — | — | yes |
</step>

<step name="detect_project">
Auto-detect project type from manifest files:

```bash
ls package.json pyproject.toml setup.py Cargo.toml go.mod pom.xml build.gradle Makefile 2>/dev/null
```

Detection rules:
- `package.json` → Node.js (check for TypeScript via `tsconfig.json`)
- `pyproject.toml` or `setup.py` → Python
- `Cargo.toml` → Rust
- `go.mod` → Go
- `pom.xml` → Java (Maven)
- `build.gradle` → Java (Gradle)

For Node.js, read available scripts:
```bash
cat package.json 2>/dev/null | grep -A 30 '"scripts"'
```

Build a command map based on detected type:
```
build_cmd = "npm run build" | "cargo build" | "go build ./..." | ...
type_cmd = "npx tsc --noEmit" | "mypy ." | ...
lint_cmd = "npm run lint" | "cargo clippy" | "ruff check ." | ...
test_cmd = "npm test" | "cargo test" | "pytest" | "go test ./..." | ...
security_cmd = "npm audit --production" | "cargo audit" | "pip-audit" | ...
```
</step>

<step name="run_build">
**Step: Build** (all modes)

```bash
# Run the detected build command
{build_cmd} 2>&1
```

Record: status (PASS/FAIL), error output, duration.

If build fails: continue pipeline but mark overall verdict as FAIL.
</step>

<step name="run_typecheck">
**Step: Type Check** (full, pre-pr modes only)

```bash
# Node.js + TypeScript
npx tsc --noEmit 2>&1

# Python
mypy . 2>&1
```

Record: status, error count. Skip if project has no type system.
</step>

<step name="run_lint">
**Step: Lint** (full, pre-commit, pre-pr modes)

```bash
# Run detected lint command
{lint_cmd} 2>&1
```

Record: status, error count, warning count.
</step>

<step name="run_tests">
**Step: Tests** (all modes)

```bash
# Run detected test command
{test_cmd} 2>&1
```

Record: status, tests passed, tests failed, tests skipped, duration.
</step>

<step name="run_security">
**Step: Security Scan** (full, pre-pr modes)

```bash
# Run detected security command
{security_cmd} 2>&1 | head -30
```

Record: status, vulnerability count by severity (critical/high/medium/low).
</step>

<step name="run_diff_review">
**Step: Diff Review** (full, pre-pr modes)

```bash
git diff --stat
git diff --staged --stat
git diff --staged 2>/dev/null | head -200
```

Check for red flags:
- **Secrets:** `.env`, `credentials`, API keys, tokens in diff
- **Debug code:** `console.log`, `debugger`, `print(`, `TODO`, `FIXME`, `HACK`
- **Scope creep:** Files changed outside expected area
- **Large files:** Binary files, generated files in staging

Record: status (PASS/WARN), list of warnings.
</step>

<step name="run_coverage">
**Step: Coverage** (pre-pr mode only)

```bash
# Node.js
npx jest --coverage 2>&1 | tail -20
# or npx vitest run --coverage 2>&1 | tail -20

# Python
pytest --cov 2>&1 | tail -20
```

Record: line coverage %, branch coverage %.
</step>

<step name="generate_report">
Compute overall verdict:
- **PASS** — All executed steps passed
- **FAIL** — One or more steps failed

Present report:

```
## Quality Gate Report

**Mode:** {mode}
**Project:** {type} (detected from {manifest})
**Verdict:** PASS / FAIL

### Pipeline Results
| Step | Status | Details | Duration |
|------|--------|---------|----------|
| Build | PASS/FAIL | {summary} | {Xs} |
| Type Check | PASS/FAIL/SKIP | {summary} | {Xs} |
| Lint | PASS/FAIL/SKIP | {summary} | {Xs} |
| Tests | PASS/FAIL | {X pass, Y fail} | {Xs} |
| Security | PASS/FAIL/SKIP | {X vulns} | {Xs} |
| Diff Review | PASS/WARN/SKIP | {notes} | — |
| Coverage | {X%}/SKIP | {line/branch} | — |

{If FAIL:}
### Failures
1. {step}: {what failed and how to fix}

{If PASS:}
### Ready
All checks passed. Run `/commit` to save changes.
```
</step>

<step name="update_state">
If `.planning/STATE.md` exists, append quality gate result:

```markdown
### Quality Gate: {mode}
- **Status:** PASS/FAIL
- **Date:** {ISO timestamp}
- **Steps:** {passed}/{total} passed
- **Failures:** {list or "none"}
```
</step>

</process>

<mode_guidance>
- **During development:** Use `quick` for fast feedback loops
- **Before committing:** Use `pre-commit` to catch lint and test issues
- **Before PRs:** Use `pre-pr` for comprehensive validation with coverage
- **Periodic health check:** Use `full` to catch security and type issues
</mode_guidance>

<success_criteria>
- [ ] Mode determined (quick/full/pre-commit/pre-pr)
- [ ] Project type auto-detected from manifest files
- [ ] All applicable pipeline steps executed
- [ ] Each step recorded with PASS/FAIL/SKIP status
- [ ] Diff review checked for secrets, debug code, scope creep
- [ ] Overall verdict computed (PASS only if all steps pass)
- [ ] Structured report presented with table
- [ ] STATE.md updated if exists
- [ ] Clear next steps provided
</success_criteria>

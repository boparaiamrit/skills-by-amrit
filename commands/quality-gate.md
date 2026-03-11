---
name: quality-gate
description: "Run technical quality checks before commits or PRs — build, types, lint, test, security, diff review."
disable-model-invocation: true
argument-hint: "[mode: quick|full|pre-commit|pre-pr]"
allowed-tools:
  - Read
  - Bash
  - Grep
  - Glob
---

# /quality-gate — Technical Quality Gate

Run a structured quality pipeline before commits or PRs. Auto-detects project type and runs appropriate checks.

## Modes

| Mode | Steps | When to Use |
|------|-------|-------------|
| `quick` | Build + Test | Fast sanity check during development |
| `full` | All 6 steps | Thorough check before important milestones |
| `pre-commit` | Build + Lint + Test | Before committing changes |
| `pre-pr` | All 6 + Coverage | Before opening a pull request |

## Instructions

### Step 1: Determine Mode

From `$ARGUMENTS`:
- If mode given: Use that mode
- If empty: Default to `full`

### Step 2: Auto-Detect Project Type

```bash
# Detect project type from manifest files
ls package.json pyproject.toml setup.py Cargo.toml go.mod pom.xml build.gradle Makefile 2>/dev/null
```

Determine:
- **Node.js** — `package.json` exists
- **Python** — `pyproject.toml` or `setup.py` exists
- **Rust** — `Cargo.toml` exists
- **Go** — `go.mod` exists
- **Java (Maven)** — `pom.xml` exists
- **Java (Gradle)** — `build.gradle` exists

Read the manifest to detect available scripts/commands:

```bash
# For Node.js
cat package.json | grep -A 20 '"scripts"'
```

### Step 3: Run Pipeline

Run the applicable steps based on mode:

#### Step 3a: Build Check (all modes)

```bash
# Node.js
npm run build 2>&1

# Python
python -m py_compile [main_module] 2>&1

# Rust
cargo build 2>&1

# Go
go build ./... 2>&1
```

Record: PASS/FAIL, duration, error count.

#### Step 3b: Type Check (full, pre-pr)

```bash
# Node.js (TypeScript)
npx tsc --noEmit 2>&1

# Python (mypy)
mypy . 2>&1

# Rust (included in build)
# Go (included in build)
```

Record: PASS/FAIL, error count.

#### Step 3c: Lint Check (full, pre-commit, pre-pr)

```bash
# Node.js
npm run lint 2>&1

# Python
ruff check . 2>&1 || flake8 . 2>&1

# Rust
cargo clippy 2>&1

# Go
golangci-lint run 2>&1
```

Record: PASS/FAIL, warning count, error count.

#### Step 3d: Test Suite (all modes)

```bash
# Node.js
npm test 2>&1

# Python
pytest 2>&1

# Rust
cargo test 2>&1

# Go
go test ./... 2>&1
```

Record: PASS/FAIL, tests passed, tests failed, duration.

#### Step 3e: Security Scan (full, pre-pr)

```bash
# Node.js
npm audit --production 2>&1 | head -30

# Python
pip-audit 2>&1 || safety check 2>&1

# Rust
cargo audit 2>&1

# Go
govulncheck ./... 2>&1
```

Record: PASS/FAIL, vulnerability count by severity.

#### Step 3f: Diff Review (full, pre-pr)

```bash
git diff --stat
git diff --staged --stat
```

Check for:
- Files that shouldn't be committed (`.env`, credentials, large binaries)
- Unintended changes (files outside the expected scope)
- Debug code left in (`console.log`, `debugger`, `print()`, `TODO`)

### Step 4: Coverage Check (pre-pr only)

```bash
# Node.js
npx jest --coverage 2>&1 | tail -20
# or
npx vitest --coverage 2>&1 | tail -20

# Python
pytest --cov 2>&1 | tail -20
```

Record: Line coverage %, branch coverage %.

### Step 5: Generate Report

```markdown
## Quality Gate Report

**Mode:** [mode]
**Project:** [type] detected from [manifest]
**Verdict:** PASS / FAIL

### Pipeline Results
| Step | Status | Details | Duration |
|------|--------|---------|----------|
| Build | PASS/FAIL | [summary] | [Xs] |
| Type Check | PASS/FAIL/SKIP | [summary] | [Xs] |
| Lint | PASS/FAIL/SKIP | [summary] | [Xs] |
| Tests | PASS/FAIL | [X pass, Y fail] | [Xs] |
| Security | PASS/FAIL/SKIP | [X vulns] | [Xs] |
| Diff Review | PASS/WARN/SKIP | [notes] | — |
| Coverage | [X%]/SKIP | [line/branch] | — |

### Verdict: PASS / FAIL
[If FAIL: list which steps failed and what to fix]
[If PASS: "Ready to commit/PR"]

### Next Steps
- [If PASS] Run `/commit` to save changes
- [If FAIL] Fix issues above, then re-run `/quality-gate [mode]`
```

### Step 6: Update State (If .planning/ Exists)

If `.planning/STATE.md` exists, append:
```markdown
### Quality Gate: [mode]
- **Status:** PASS/FAIL
- **Date:** [timestamp]
- **Details:** [summary of results]
```

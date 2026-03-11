# /quality-gate Command Examples

> Run technical quality checks before commits or PRs.

## Usage

```
@/quality-gate [mode]
```

## Modes

| Mode | Steps | When to Use |
|------|-------|-------------|
| `quick` | Build + Test | Fast sanity check |
| `full` | All 6 steps | Before milestones |
| `pre-commit` | Build + Lint + Test | Before committing |
| `pre-pr` | All 6 + Coverage | Before opening a PR |

## Examples

### Example 1: Pre-PR Gate Catching Issues

**You:**
```
@/quality-gate pre-pr
```

**What happens:**
1. Auto-detects Node.js project from `package.json`
2. Reads `scripts` to find build, lint, and test commands
3. Runs the full pipeline sequentially

**Output:**
```markdown
## Quality Gate Report

**Mode:** pre-pr
**Project:** Node.js (detected from package.json)
**Verdict:** FAIL

### Pipeline Results
| Step | Status | Details | Duration |
|------|--------|---------|----------|
| Build | PASS | tsc compiled cleanly | 4.2s |
| Type Check | PASS | 0 errors | 3.1s |
| Lint | FAIL | 2 errors in src/auth/session.ts | 1.8s |
| Tests | FAIL | 47 pass, 1 fail | 12.3s |
| Security | PASS | 0 vulnerabilities | 2.1s |
| Diff Review | WARN | Found `console.log` in src/api/handler.ts | — |
| Coverage | 84% | Lines: 84%, Branches: 71% | — |

### Verdict: FAIL
- **Lint:** `no-unused-vars` on line 23, `no-explicit-any` on line 45 of session.ts
- **Tests:** `auth.refresh.test.ts` — expected 200, got 401

### Next Steps
- Fix lint errors in `src/auth/session.ts`
- Fix failing test in `auth.refresh.test.ts`
- Remove `console.log` from `src/api/handler.ts`
- Re-run `/quality-gate pre-pr`
```

### Example 2: Quick Check During Development

```
@/quality-gate quick
```

Runs only Build + Test for a fast sanity check.

### Example 3: Pre-Commit Gate

```
@/quality-gate pre-commit
```

Runs Build + Lint + Test before committing staged changes.

---

## Related Commands

- `/commit` — Create conventional commits (run after gate passes)
- `/verify` — Validate against plan requirements
- `/checkpoint` — Snapshot progress before risky changes

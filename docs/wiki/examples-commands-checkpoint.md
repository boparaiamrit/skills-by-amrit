# /checkpoint Command Examples

> Create or verify named progress checkpoints with git snapshots and test status.

## Usage

```
@/checkpoint [create|verify|list] [name]
```

## Modes

| Mode | Usage | What It Does |
|------|-------|-------------|
| `create` | `/checkpoint create core-done` | Snapshot current state |
| `verify` | `/checkpoint verify core-done` | Compare against a checkpoint |
| `list` | `/checkpoint list` | Show all checkpoints |

## Examples

### Example 1: Multi-Step Refactor with Checkpoints

**Step 1 — Checkpoint before starting:**
```
@/checkpoint create refactor-start
```

**Output:**
```markdown
## Checkpoint Created: refactor-start
- **Commit:** a3f7c21
- **Tests:** PASS (142 pass, 0 fail)
- **Files tracked:** 87
- **Stored at:** `.planning/checkpoints/refactor-start.md`
```

**Step 2 — Checkpoint after extracting shared utils:**
```
@/checkpoint create utils-extracted
```

**Step 3 — Verify no regressions from the starting point:**
```
@/checkpoint verify refactor-start
```

**Output:**
```markdown
## Checkpoint Verify: refactor-start

| Aspect | Checkpoint | Current | Status |
|--------|-----------|---------|--------|
| Commit | a3f7c21 | e9b2d44 | 3 commits ahead |
| Tests | PASS (142) | PASS (148) | +6 tests |
| Dirty files | 0 | 2 | +2 uncommitted |

### Files Changed Since Checkpoint
- `src/utils/format.ts` — added
- `src/utils/validate.ts` — added
- `src/api/handler.ts` — modified (extracted utils)
- `src/auth/session.ts` — modified (extracted utils)

### Verdict: ON TRACK
```

**Step 4 — View all checkpoints:**
```
@/checkpoint list
```

**Output:**
```markdown
## Checkpoints

| # | Name | Date | Commit | Tests |
|---|------|------|--------|-------|
| 1 | refactor-start | 2026-03-11 | a3f7c21 | PASS |
| 2 | utils-extracted | 2026-03-11 | e9b2d44 | PASS |

**Current position:** 0 commits ahead of latest checkpoint
```

---

## Typical Flow

```
feature-start → core-done → tests-pass → refactored → pr-ready
```

## Related Commands

- `/quality-gate` — Run full pipeline at key checkpoints
- `/verify` — Validate against plan requirements
- `/commit` — Save changes after checkpoint passes

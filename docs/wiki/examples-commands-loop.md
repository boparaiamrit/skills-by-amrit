# /loop Command Examples

> Run a repetitive task across multiple targets with safety bounds and progress tracking.

## Usage

```
@/loop "[task]" --targets [list-or-glob] [--max N] [--continue-on-error]
```

## Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--targets` | (required) | Comma-separated list or glob pattern |
| `--max` | 10 | Maximum iterations (safety bound) |
| `--parallel` | false | Run concurrently |
| `--continue-on-error` | false | Skip failures |

## Examples

### Example 1: Adding TypeScript Types to JS Files

**You:**
```
@/loop "Convert to TypeScript with strict types" --targets src/utils/*.js --max 10
```

**What happens:**
1. Resolves glob: finds 5 files matching `src/utils/*.js`
2. Captures baseline test status (all passing)
3. Iterates through each file sequentially:
   - Renames `.js` to `.ts`
   - Adds type annotations to all exports
   - Updates imports in dependent files
   - Runs tests after each conversion
4. Detects stalls if a file has no meaningful changes

**Output:**
```markdown
## Loop Complete

**Task:** Convert to TypeScript with strict types
**Mode:** Sequential
**Targets:** 5/5 completed

### Results
| # | Target | Status | Changes | Duration |
|---|--------|--------|---------|----------|
| 1 | src/utils/format.js | Success | 3 files | 18s |
| 2 | src/utils/validate.js | Success | 2 files | 12s |
| 3 | src/utils/parse.js | Success | 4 files | 22s |
| 4 | src/utils/transform.js | Success | 2 files | 14s |
| 5 | src/utils/helpers.js | Success | 3 files | 16s |

### Test Status
- **Before loop:** PASS (142 tests)
- **After loop:** PASS (142 tests)

### Next Steps
- Run `/quality-gate quick` then `/commit`
```

### Example 2: With Failure Handling

```
@/loop "Add JSDoc comments to exported functions" --targets src/api/*.ts --continue-on-error
```

If `src/api/legacy.ts` causes a test regression, the loop records the failure, skips that file, and continues with the remaining targets.

### Example 3: Stall Detection

If two consecutive iterations produce no file changes, the loop pauses and asks:
```
Stall detected: No meaningful changes for 2 iterations.
Options: [C]ontinue / [S]kip target / [A]bort loop
```

---

## Related Commands

- `/quality-gate quick` — Verify everything passes after the loop
- `/checkpoint create` — Snapshot state before a large loop
- `/debug` — Investigate if a target causes a regression

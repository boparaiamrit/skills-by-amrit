# /execute Command Examples

> Execute plans wave by wave.

## Usage

```
@/execute [plan-path]
```

## Examples

```
@/execute .planning/plans/oauth.md
@/execute .planning/plans/dashboard.md
```

## Process

1. Load plan file
2. Execute Wave 1 tasks
3. Checkpoint: verify before Wave 2
4. Continue through all waves
5. Update plan with checkmarks

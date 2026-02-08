# codebase-mapping Examples

> Module boundaries, dependency graphs, health metrics.

## Usage

### Antigravity
```
/codebase-map
```

### Claude Code
```
Spawn mapper agent to map this codebase
```

## Output Structure

Creates `.planning/codebase/`:
- `ARCHITECTURE.md` — High-level overview
- `MODULES.md` — Module breakdown
- `DEPENDENCIES.md` — Dependency graph
- `HEALTH.md` — Code health metrics

## Example Output

```markdown
## Codebase Map

### Overview
- Lines of code: 45,000
- Files: 312
- Modules: 8
- External deps: 42

### Module Breakdown

| Module | Files | LOC | Test Coverage |
|--------|-------|-----|---------------|
| auth | 24 | 3,200 | 82% |
| api | 45 | 6,100 | 76% |
| ui | 89 | 12,400 | 45% |
| core | 34 | 8,900 | 91% |

### Dependency Graph
```
┌──────┐     ┌──────┐     ┌──────┐
│  UI  │────▶│ API  │────▶│ Core │
└──────┘     └──────┘     └──────┘
                │
                ▼
           ┌────────┐
           │  Auth  │
           └────────┘
```

### Health Metrics
- Complexity: 🟡 Medium (avg 12 per function)
- Duplication: 🟢 Low (3.2%)
- Dead code: 🟠 High (8 unused exports)
```

# performance-audit Examples

> N+1 queries, bundle sizes, bottlenecks, caching.

## Usage

### Antigravity
```
/performance
```

### Claude Code
```
@/performance
```

## Checks Performed

- N+1 query detection
- Bundle size analysis
- API latency
- Memory leaks
- CPU profiling
- Cache hit rates

## Example Output

```markdown
## Performance Audit

### 🔴 Critical
- N+1 query on /orders (200ms → 2000ms with 10 items)
- No caching on user profile API

### 🟠 High
- Bundle size: 2.1MB (target: <1MB)
- moment.js: 288kb (unused 90%)

### 🟡 Medium
- Images not lazy loaded
- No compression on API responses

### Metrics
| Endpoint | P50 | P95 | P99 |
|----------|-----|-----|-----|
| /api/users | 45ms | 120ms | 450ms |
| /api/orders | 890ms | 2100ms | 5400ms |

### Bundle Analysis
```
├── react-dom (128kb)
├── moment (288kb) ← REMOVE
├── lodash (72kb) ← tree-shake
└── your-code (145kb)
```

### Recommendations
- Add Redis cache for user profiles
- Replace moment with date-fns
- Enable gzip compression
```

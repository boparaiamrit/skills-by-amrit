# observability-audit Examples

> Logging, metrics, tracing, alerting.

## Usage

### Antigravity
```
/audit observability
```

### Claude Code
```
@/audit observability
```

## Checks Performed

- Structured logging
- Log levels appropriate
- Metrics coverage
- Distributed tracing
- Alert coverage
- Dashboard completeness

## Example Output

```markdown
## Observability Audit

### 🔴 Critical
- No alerting on error rate spike
- Payment flow has no tracing

### 🟠 High
- console.log used instead of logger (47 files)
- No metrics on /api/* latency

### 🟡 Medium
- Missing correlation IDs in logs
- Metrics names inconsistent

### Coverage
| Area | Logs | Metrics | Traces |
|------|------|---------|--------|
| Auth | ✅ | ❌ | ❌ |
| API | ✅ | ✅ | ❌ |
| DB | ✅ | ✅ | ✅ |
| Queue | ❌ | ❌ | ❌ |

### Recommendations
- Add OpenTelemetry tracing
- Create error rate alert (>1%)
- Add request ID to all logs
```

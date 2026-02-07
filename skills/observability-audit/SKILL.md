---
name: observability-audit
description: "Use when auditing logging, monitoring, alerting, tracing, or metrics. Covers structured logging, error tracking, health checks, dashboards, and incident detection capabilities."
---

# Observability Audit

## Overview

If you can't observe it, you can't debug it. Observability is not optional — it's how you understand production.

**Core principle:** Every production system must answer: What happened? When? Why? To whom?

## The Iron Law

```
NO PRODUCTION SERVICE WITHOUT STRUCTURED LOGGING, HEALTH CHECKS, AND ERROR TRACKING.
```

## When to Use

- "Can we debug production issues?"
- Before deploying a new service
- After a production incident
- When investigation takes too long
- During any codebase audit

## The Audit Process

### Phase 1: Logging

**Structured logging requirements:**

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "error",
  "message": "Payment processing failed",
  "service": "payment-service",
  "trace_id": "abc123",
  "user_id": "user_456",
  "error": {
    "type": "PaymentGatewayError",
    "message": "Connection timeout",
    "stack": "..."
  },
  "context": {
    "order_id": "order_789",
    "amount": 99.99
  }
}
```

**Logging checklist:**

| Check | Status |
|-------|--------|
| Structured format (JSON, not text) | |
| Consistent log levels (debug, info, warn, error) | |
| Request correlation IDs | |
| No PII in logs (passwords, tokens, SSN) | |
| Error logs include stack traces | |
| Sufficient context for debugging | |
| Log rotation configured | |
| Log aggregation (centralized) | |

**Log levels guide:**

| Level | When | Example |
|-------|------|---------|
| `debug` | Detailed diagnostic info | "Query took 45ms, returned 12 rows" |
| `info` | Normal operations | "User logged in", "Order created" |
| `warn` | Unexpected but handled | "Rate limit approaching", "Retry attempt 2/3" |
| `error` | Failures requiring attention | "Payment failed", "Database connection lost" |
| `fatal` | Application cannot continue | "Config file missing", "Port already in use" |

### Phase 2: Health Checks

```
1. DOES the service have a health endpoint? (/health, /healthz)
2. DOES it check actual dependencies? (DB, cache, external APIs)
3. IS it used by load balancers for routing?
4. DOES it distinguish liveness vs readiness?
```

**Health check response:**

```json
{
  "status": "healthy",
  "checks": {
    "database": { "status": "healthy", "latency_ms": 5 },
    "cache": { "status": "healthy", "latency_ms": 1 },
    "external_api": { "status": "degraded", "latency_ms": 2500 }
  },
  "version": "1.2.3",
  "uptime_seconds": 86400
}
```

### Phase 3: Error Tracking

```
1. ARE errors captured and aggregated? (Sentry, Bugsnag, etc.)
2. ARE errors classified and prioritized?
3. DO errors include user context and request context?
4. ARE error notifications configured? (Slack, email, PagerDuty)
5. IS there error rate monitoring with thresholds?
```

### Phase 4: Metrics

```
1. ARE key business metrics tracked? (signups, orders, revenue)
2. ARE key technical metrics tracked? (response time, error rate, throughput)
3. IS there a dashboard? (Grafana, Datadog, etc.)
4. ARE alerts configured for anomalies?
```

**Essential metrics (RED method):**

| Metric | What It Measures |
|--------|-----------------|
| **R**ate | Requests per second |
| **E**rrors | Error rate (% or count) |
| **D**uration | Response time (p50, p95, p99) |

### Phase 5: Tracing

```
1. ARE requests traceable across services? (distributed tracing)
2. ARE trace IDs propagated through the call chain?
3. CAN you reconstruct a full request path from trace ID?
4. ARE slow operations visible in traces?
```

## Output Format

```markdown
# Observability Audit: [Project Name]

## Summary
| Capability | Status | Tool | Assessment |
|-----------|--------|------|------------|
| Logging | ✅/⚠️/❌ | [Tool] | |
| Health Checks | ✅/⚠️/❌ | | |
| Error Tracking | ✅/⚠️/❌ | [Tool] | |
| Metrics | ✅/⚠️/❌ | [Tool] | |
| Tracing | ✅/⚠️/❌ | [Tool] | |
| Alerting | ✅/⚠️/❌ | [Tool] | |

## Findings
[Standard severity format]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- Console.log/print as the logging strategy
- No health check endpoint
- No error tracking service
- No alerting on error rate spikes
- PII in logs (passwords, tokens, personal data)
- No request correlation IDs

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Enables:** `incident-response` capabilities
- **Informs:** `performance-audit` metrics analysis

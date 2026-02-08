---
name: observability-audit
description: "Use when auditing logging, monitoring, alerting, tracing, or metrics. Covers structured logging, error tracking, health checks, dashboards, distributed tracing, and incident detection capabilities."
---

# Observability Audit

## Overview

If you can't observe it, you can't debug it. If you can't debug it, you can't fix it. Observability is the difference between "something is wrong" and "here's exactly what's wrong, where, since when, and for whom."

**Core principle:** Every production system must answer four questions at any point in time: *What happened? When? Why? To whom?*

## The Iron Law

```
NO PRODUCTION SERVICE WITHOUT STRUCTURED LOGGING, HEALTH CHECKS, AND ERROR TRACKING. NO DEPLOYMENT WITHOUT MONITORING. NO ALERT WITHOUT A RUNBOOK.
```

## When to Use

- "Can we debug production issues?"
- Before deploying a new service
- After a production incident (post-mortem revealed gaps)
- When investigation takes too long
- When errors are discovered by users instead of alerts
- During any codebase audit
- Before scaling a service

## When NOT to Use

- Prototypes or throwaway experiments (basic console logging is fine)
- Static sites with no server component
- If you're just adding a single log line (use `code-review` instead)
- If the issue is specifically performance, not visibility (use `performance-audit`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "logging is fine" — read actual log output and verify it's structured, contextual, and actionable
- Say "we have monitoring" — show the dashboard, verify it shows real-time data, check alerting rules
- Say "errors are tracked" — verify error grouping, notification routing, and triage workflow
- Skip checking what happens when a dependency goes down — simulate failure mentally or actually
- Assume health checks work — call the health endpoint and verify the response checks REAL dependencies
- Trust that alerts work — verify the notification pipeline end-to-end (alert → channel → person)
- Say "we'll add observability later" — it's needed BEFORE production, not after the first incident
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "We'll add logging when something breaks" | You won't know it's broken without logging. Circular dependency. |
| "Console.log is fine for now" | Unstructured text logs are unsearchable, unfilterable, and fill up disk fast. |
| "We don't need distributed tracing yet" | You will need it the moment your first cross-service bug appears. Retrofitting is painful. |
| "Nobody looks at the dashboard" | Then your dashboard shows the wrong things. Fix the dashboard, don't eliminate monitoring. |
| "Alerts are too noisy so we ignore them" | Noisy alerts are worse than no alerts. Tune them — don't disable. |
| "Our error rate is low enough" | Low ≠ zero. One uncaught error in a payment flow is one too many. |
| "We know the system well enough" | You won't in 6 months, and neither will the person who replaces you. |

## Iron Questions (Ask Before Concluding the Audit)

```
1. If this service crashed right now, how would we know? How quickly?
2. If response times doubled, which alert fires? In how many minutes?
3. Can I trace a single user request from entry to database and back?
4. If I search for a specific user's actions today, what do I find?
5. When was the last error? What was it? Is it resolved?
6. What's the difference between "service is down" and "service is degraded"? Can your health checks tell?
7. If a downstream dependency becomes slow (not down, just slow), does the system degrade gracefully?
8. Can an on-call engineer understand a 3AM alert without looking at code?
9. Are there any errors happening right now that nobody knows about?
10. What was the MTTR (mean time to resolution) for the last 3 incidents? Could better observability have reduced it?
```

## The Audit Process

### Phase 1: Structured Logging

**Structured logging requirements:**

```json
{
  "timestamp": "2024-01-15T10:30:00.123Z",
  "level": "error",
  "message": "Payment processing failed",
  "service": "payment-service",
  "trace_id": "abc-123-def-456",
  "span_id": "ghi-789",
  "user_id": "user_456",
  "error": {
    "type": "PaymentGatewayError",
    "message": "Connection timeout after 30s",
    "code": "GATEWAY_TIMEOUT",
    "stack": "..."
  },
  "context": {
    "order_id": "order_789",
    "amount": 99.99,
    "currency": "USD",
    "gateway": "stripe",
    "attempt": 2
  },
  "duration_ms": 30042
}
```

**Logging checklist:**

| Check | Status | Detection |
|-------|--------|-----------|
| Structured format (JSON, not text) | | `grep -rn "console.log\|print(" --include="*.ts" --include="*.py" . \| grep -v node_modules` |
| Consistent log levels (debug, info, warn, error) | | `grep -rn "logger\.\|log\." --include="*.ts" --include="*.py" . \| head -30` |
| Request correlation IDs (trace_id) | | `grep -rn "trace_id\|correlation_id\|request_id" --include="*.ts" --include="*.py" .` |
| No PII in logs (passwords, tokens, SSN, emails) | | `grep -rn "password\|secret\|token\|ssn" --include="*.ts" --include="*.py" . \| grep -i log` |
| Error logs include stack traces | | Verify error handler attaches stack |
| Sufficient context for debugging | | Read 5 random log entries — can you debug from them alone? |
| Log rotation / retention configured | | Check logging config for max size / days |
| Log aggregation (centralized collection) | | Check for logging service (CloudWatch, Datadog, ELK, Loki) |
| Sensitive data redacted | | Check for redaction middleware in logging pipeline |
| Request/response logging for APIs | | Check middleware for HTTP request logging |

**Log levels guide (enforce consistency):**

| Level | When | Example | Does NOT Include |
|-------|------|---------|-----------------|
| `debug` | Detailed diagnostic info for developers | "Query took 45ms, returned 12 rows" | In production (should be disabled) |
| `info` | Normal operations worth recording | "User logged in", "Order created", "Deploy started" | Routine internal events (loop iterations) |
| `warn` | Unexpected but handled situations | "Rate limit approaching 80%", "Retry attempt 2/3", "Deprecated API called" | Things that are actually errors |
| `error` | Failures requiring attention | "Payment failed", "Database connection lost", "External API returned 500" | Things the code recovers from gracefully |
| `fatal` | Application cannot continue | "Config file missing", "Database unreachable on startup", "Port already in use" | Recoverable errors |

**Common logging anti-patterns:**

| Anti-Pattern | Example | Fix |
|-------------|---------|-----|
| Log and swallow | `catch (e) { log(e); }` — then nothing | Log AND handle appropriately |
| Generic messages | `logger.error("Error occurred")` | Include WHAT error, WHERE, in WHICH context |
| Missing context | `logger.error(error.message)` | Add user_id, request_id, input data |
| Sensitive data | `logger.info("User logged in", { password })` | Redact sensitive fields |
| Wrong level | `logger.error("User not found")` — 404 is not error | Use `warn` for expected-but-unusual |
| Excessive logging | Logging every loop iteration | Log aggregates or milestones |

### Phase 2: Health Checks

```
1. DOES the service have a health endpoint? (/health, /healthz, /ready)
2. DOES it check actual dependencies? (DB connection, cache, external APIs)
3. IS it used by load balancers / orchestrators for routing decisions?
4. DOES it distinguish liveness vs readiness?
5. DOES it include version information?
6. IS the health check itself fast (< 500ms)?
7. DOES it avoid false positives? (returns healthy when service is actually degraded)
```

**Liveness vs Readiness:**

| Check | Purpose | What it Tests | Failure Action |
|-------|---------|--------------|----------------|
| Liveness (`/healthz`) | "Is the process running?" | Process alive, not deadlocked | Restart container |
| Readiness (`/ready`) | "Can it serve traffic?" | Dependencies reachable, migrations done | Remove from load balancer |
| Startup (`/startup`) | "Has it finished initializing?" | Warm-up complete, caches loaded | Wait longer before killing |

**Health check response (gold standard):**

```json
{
  "status": "healthy",
  "checks": {
    "database": { "status": "healthy", "latency_ms": 5, "connection_pool": "8/20" },
    "cache": { "status": "healthy", "latency_ms": 1, "hit_rate": "94%" },
    "external_api": { "status": "degraded", "latency_ms": 2500, "note": "Slow but responding" },
    "disk": { "status": "healthy", "free_gb": 45.2, "usage_percent": 62 }
  },
  "version": "1.2.3",
  "commit": "abc1234",
  "uptime_seconds": 86400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Phase 3: Error Tracking

```
1. ARE errors captured and aggregated? (Sentry, Bugsnag, Datadog, Rollbar)
2. ARE errors grouped intelligently? (not 1000 identical alerts)
3. DO errors include user context, request context, and breadcrumbs?
4. ARE error notifications routed correctly? (critical → PagerDuty, low → Slack)
5. IS there error rate monitoring with thresholds?
6. ARE errors triaged and assigned? (not just collected)
7. IS there a distinction between expected errors (404, validation) and unexpected errors (500, null reference)?
8. ARE source maps uploaded for frontend error tracking?
```

**Error tracking maturity model:**

| Level | Description | Assessment |
|-------|------------|------------|
| 0 — None | Errors disappear into void | 🔴 Critical |
| 1 — Basic | Errors logged to file, reviewed manually | 🟠 High risk |
| 2 — Collected | Errors sent to tracking service (Sentry) | 🟡 Acceptable |
| 3 — Managed | Errors grouped, prioritized, assigned | 🟢 Good |
| 4 — Proactive | Error budgets, anomaly detection, auto-remediation | 🟢 Excellent |

### Phase 4: Metrics

```
1. ARE key business metrics tracked? (signups, orders, revenue, churn)
2. ARE key technical metrics tracked? (response time, error rate, throughput, saturation)
3. IS there a dashboard? (Grafana, Datadog, CloudWatch)
4. ARE alerts configured for anomalies?
5. ARE metrics labeled with dimensions? (by endpoint, by user tier, by region)
6. ARE custom metrics defined for domain-specific concerns?
7. CAN you compare current metrics to historical baselines?
```

**Essential metrics frameworks:**

**RED Method (for request-driven services):**

| Metric | What It Measures | Alert Threshold Example |
|--------|-----------------|-----------------------|
| **R**ate | Requests per second | < 50% of baseline for 5 min |
| **E**rrors | Error rate (% or count) | > 1% error rate for 2 min |
| **D**uration | Response time (p50, p95, p99) | p99 > 2s for 5 min |

**USE Method (for infrastructure/resources):**

| Metric | What It Measures | Alert Threshold Example |
|--------|-----------------|-----------------------|
| **U**tilization | CPU, memory, disk, connections | > 80% for 10 min |
| **S**aturation | Queue depth, thread pool | > 90% capacity |
| **E**rrors | Hardware errors, connection errors | Any non-zero |

**The Four Golden Signals (Google SRE):**

| Signal | Measures |
|--------|----------|
| Latency | How long requests take (distinguish success vs error latency) |
| Traffic | How much demand is placed on the system |
| Errors | Rate of failed requests |
| Saturation | How "full" the system is (most constrained resource) |

### Phase 5: Distributed Tracing

```
1. ARE requests traceable across services? (OpenTelemetry, Jaeger, Zipkin)
2. ARE trace IDs propagated through the ENTIRE call chain? (HTTP headers, message queues, async jobs)
3. CAN you reconstruct a full request path from a single trace ID?
4. ARE slow operations visible as spans with duration?
5. ARE database queries captured as spans?
6. ARE external API calls captured as spans?
7. IS sampling configured appropriately? (100% for errors, 1-10% for normal traffic)
```

**Trace propagation checklist:**

| Boundary | Propagated? | Method |
|----------|------------|--------|
| HTTP → HTTP | | W3C Trace Context header or B3 header |
| HTTP → Queue | | Message metadata |
| Queue → Worker | | Read from message metadata |
| Sync → Async | | Explicit context passing |
| Service → Database | | Span wrapping DB client |
| Service → External API | | Injected in outgoing headers |

### Phase 6: Alerting

```
1. ARE alerts defined for critical metrics? (error rate, latency, availability)
2. DO alerts have clear, actionable titles? (not "Alert #472")
3. DO alerts include runbooks or links? (what to do when this fires)
4. IS there alert severity tiering? (page vs warn vs info)
5. IS there alert fatigue? (> 50 alerts/week per team = too many)
6. DO alerts have proper thresholds? (not too sensitive, not too lax)
7. IS there an on-call rotation? (who gets paged?)
8. ARE alerts tested periodically? (fire drills for alerting)
```

**Alert quality rubric:**

| Quality | Bad Alert | Good Alert |
|---------|----------|------------|
| Title | "Error detected" | "Payment API error rate > 5% for 3 min" |
| Context | None | Current rate: 8.2%, baseline: 0.3%, affected endpoints: /checkout |
| Action | "Investigate" | "Check payment gateway status, see runbook: link" |
| Routing | Everyone | On-call for payment-team |
| Threshold | Any error | > 5% error rate sustained for 3 minutes |

## Output Format

```markdown
# Observability Audit: [Project Name]

## Summary
| Capability | Status | Tool | Maturity Level | Assessment |
|-----------|--------|------|---------------|------------|
| Structured Logging | ✅/⚠️/❌ | [Tool] | [0-4] | [Notes] |
| Health Checks | ✅/⚠️/❌ | — | [0-4] | [Notes] |
| Error Tracking | ✅/⚠️/❌ | [Tool] | [0-4] | [Notes] |
| Metrics & Dashboards | ✅/⚠️/❌ | [Tool] | [0-4] | [Notes] |
| Distributed Tracing | ✅/⚠️/❌ | [Tool] | [0-4] | [Notes] |
| Alerting | ✅/⚠️/❌ | [Tool] | [0-4] | [Notes] |

## Can Answer The Four Questions?
| Question | Answer | Confidence |
|----------|--------|------------|
| What happened? | ✅/❌ | [How quickly, how precisely] |
| When? | ✅/❌ | [Timestamp precision] |
| Why? | ✅/❌ | [Root cause discoverability] |
| To whom? | ✅/❌ | [User attribution capability] |

## Findings
[Standard severity format — sorted by severity]

## Summary
| Severity | Count |
|----------|-------|
| 🔴 Critical | N |
| 🟠 High | N |
| 🟡 Medium | N |
| 🟢 Low | N |

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — STOP and Investigate

- `console.log` / `print()` as the primary logging strategy
- No health check endpoint
- No error tracking service (errors silently disappear)
- No alerting on error rate spikes
- PII in logs (passwords, tokens, personal data, IP addresses)
- No request correlation IDs (can't trace a request across services)
- Health check returns 200 even when database is down
- Alerts that nobody responds to (alert fatigue)
- Log files on disk with no rotation (disk fills up)
- No distinction between expected and unexpected errors
- Metrics without baselines (can't detect anomalies)
- Traces that stop at service boundaries

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Enables:** `incident-response` capabilities (what you can observe, you can respond to)
- **Informs:** `performance-audit` metrics analysis
- **Complements:** `security-audit` for audit logging and intrusion detection
- **Prerequisites:** `ci-cd-audit` for deployment marker integration

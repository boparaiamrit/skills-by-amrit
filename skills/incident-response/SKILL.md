---
name: incident-response
description: "Use during production incidents — outages, security breaches, data corruption, performance degradation. Provides structured triage, mitigation, resolution, and post-mortem processes."
---

# Incident Response

## Overview

When production is down, every second counts. Panic wastes time. Process saves it.

**Core principle:** Mitigate first, investigate second, fix permanently third.

## The Iron Law

```
MITIGATE IMPACT BEFORE INVESTIGATING ROOT CAUSE.
```

During an incident, the priority is restoring service — not finding the bug.

## When to Use

- Production outage
- Security breach or suspected breach
- Data corruption
- Severe performance degradation
- Customer-facing errors spiking
- Any P0/P1 incident

## Severity Classification

| Level | Criteria | Response Time |
|-------|----------|---------------|
| P0 — Total outage | Service completely down, data loss | < 15 minutes |
| P1 — Major degradation | Core feature broken, significant user impact | < 30 minutes |
| P2 — Partial impact | Feature degraded, workaround exists | < 2 hours |
| P3 — Minor issue | Edge case, few users affected | Next business day |

## The Incident Process

### Phase 1: Triage (First 5 Minutes)

```
1. ASSESS: What is the impact? (users affected, revenue impact, data risk)
2. CLASSIFY: P0/P1/P2/P3
3. COMMUNICATE: Alert stakeholders with impact summary
4. DECIDE: Can this be mitigated immediately?
```

**Triage template:**

```markdown
🚨 INCIDENT: [Brief Description]
**Severity:** P0/P1/P2/P3
**Impact:** [Who/what is affected]
**Started:** [When first detected]
**Status:** Investigating / Mitigating / Resolved
**Lead:** [Who is handling this]
```

### Phase 2: Mitigate (Next 15 Minutes)

```
Priority order:
1. ROLLBACK if recent deploy caused it
2. SCALE if capacity-related
3. FAILOVER if infrastructure-related
4. DISABLE the broken feature (feature flags)
5. REDIRECT traffic (maintenance page)
```

**The goal is NOT to fix the bug. The goal is to restore service.**

### Phase 3: Investigate (Once Mitigated)

```
1. WHEN did it start? (correlate with deploys, config changes, traffic spikes)
2. WHAT changed? (deploy diff, config change, dependency update)
3. WHERE is it failing? (which service, which endpoint, which query)
4. WHY is it failing? (root cause analysis — use systematic-debugging skill)
```

### Phase 4: Fix (Permanent Resolution)

```
1. WRITE a failing test that reproduces the issue
2. IMPLEMENT the fix
3. VERIFY on staging
4. DEPLOY with careful monitoring
5. CONFIRM incident is resolved
```

### Phase 5: Post-Mortem (Within 48 Hours)

```markdown
# Post-Mortem: [Incident Title]

**Date:** [Date]
**Duration:** [Start → Resolution]
**Severity:** P0/P1/P2/P3
**Impact:** [Customer-facing impact summary]

## Timeline
| Time | Event |
|------|-------|
| HH:MM | First alert triggered |
| HH:MM | Incident declared |
| HH:MM | Root cause identified |
| HH:MM | Mitigation applied |
| HH:MM | Permanent fix deployed |
| HH:MM | Incident resolved |

## Root Cause
[Technical explanation of what went wrong and why]

## What Went Well
- [Things that helped resolve quickly]

## What Went Poorly
- [Things that slowed resolution]

## Action Items
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Add monitoring for X | [Name] | [Date] | ⬜ |
| Write test for edge case | [Name] | [Date] | ⬜ |
| Update runbook | [Name] | [Date] | ⬜ |

## Lessons Learned
[What we'll do differently next time]
```

## Communication Templates

### Initial Alert
```
🚨 [P0/P1] Incident: [Brief description]
Impact: [Who is affected]
Status: Investigating
Next update: [Time]
```

### Update
```
📊 Incident Update: [Brief description]
Status: Mitigating / Root cause found
Current impact: [Status]
ETA to resolution: [Estimate]
Next update: [Time]
```

### Resolution
```
✅ Incident Resolved: [Brief description]
Duration: [X hours/minutes]
Impact: [Summary]
Root cause: [One sentence]
Post-mortem: [Date]
```

## Red Flags During Incidents

- Guessing instead of checking logs
- Applying untested fixes to production
- Making multiple changes simultaneously (can't tell what fixed it)
- Not communicating with stakeholders
- Declaring resolution without verification
- Skipping post-mortem

## Integration

- **During investigation:** `systematic-debugging` for root cause
- **During fix:** `test-driven-development` for the fix
- **After resolution:** `verification-before-completion`
- **Prevention:** `observability-audit`, `ci-cd-audit` to improve detection

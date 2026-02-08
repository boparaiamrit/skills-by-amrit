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

## When NOT to Use

- Non-production issues (use `systematic-debugging`)
- Performance that's slow but not degrading (use `performance-audit`)
- Security concerns that aren't active breaches (use `security-audit`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Start investigating root cause before mitigating — restore service first
- Apply untested fixes to production — test the fix before deploying
- Make multiple changes simultaneously — you won't know what fixed it
- Skip communication — stakeholders need updates every 15 minutes during P0/P1
- Declare resolved without verification — health check must return 200, logs must be clean
- Skip post-mortem — incidents without post-mortems repeat
- Guess instead of checking logs — "I think" is not evidence during an incident
- Blame individuals — post-mortems are blameless or they're useless
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "Let me find the root cause first" | Users are down NOW. Restore service first, investigate second. |
| "I'll update the team after I fix it" | Silence during incidents causes panic. Communicate every 15 minutes. |
| "This fix will definitely work" | "Definitely" isn't evidence. Test on staging first. |
| "We don't need a post-mortem for this one" | Every incident teaches something. No exceptions. |
| "It was just a one-time thing" | Every repeat incident was "just a one-time thing" the first time. |
| "The deploy looks fine" | Did you check the deploy DIFF? Compare with the incident timeline. |

## Iron Questions

```
1. What is the user impact RIGHT NOW? (not "what might happen" — what IS happening)
2. When did it start? (check deploy history, config changes, traffic spikes)
3. What changed recently? (deploys, config, infrastructure, dependencies)
4. Can I rollback to restore service? (fastest mitigation)
5. Is data being corrupted while I investigate? (if yes, stop the bleeding first)
6. Who needs to know about this? (stakeholders, customers, on-call)
7. Is this a security breach? (if yes, activate security incident protocol)
8. What evidence do I need to preserve? (logs, metrics, state snapshot)
9. How do I verify this is actually resolved? (not "it looks better" — measurement)
10. What prevents this from happening again? (the post-mortem question)
```

## Severity Classification

| Level | Criteria | Response Time | Communication |
|-------|----------|---------------|---------------|
| P0 — Total outage | Service completely down, data loss | < 15 minutes | Every 15 min |
| P1 — Major degradation | Core feature broken, significant user impact | < 30 minutes | Every 30 min |
| P2 — Partial impact | Feature degraded, workaround exists | < 2 hours | Every 2 hours |
| P3 — Minor issue | Edge case, few users affected | Next business day | End of day |

## The Incident Process

### Phase 1: Triage (First 5 Minutes)

```
1. ASSESS: What is the impact? (users affected, revenue impact, data risk)
2. CLASSIFY: P0/P1/P2/P3
3. COMMUNICATE: Alert stakeholders with impact summary
4. DECIDE: Can this be mitigated immediately?
5. PRESERVE: Save current state of logs, metrics, error messages (they may rotate)
```

**Triage template:**

```markdown
🚨 INCIDENT: [Brief Description]
**Severity:** P0/P1/P2/P3
**Impact:** [Who/what is affected, quantify if possible]
**Started:** [When first detected]
**Status:** Investigating
**Lead:** [Who is handling this]
**Next Update:** [Time — 15 min for P0, 30 min for P1]
```

### Phase 2: Mitigate (Next 15 Minutes)

```
Priority order (try each, move to next if not applicable):
1. ROLLBACK if recent deploy caused it (fastest — check deploy timeline first)
2. SCALE if capacity-related (add instances, increase resources)
3. FAILOVER if infrastructure-related (switch to backup)
4. DISABLE the broken feature (feature flags, if available)
5. REDIRECT traffic (maintenance page, CDN-level redirect)
6. RATE LIMIT if abuse-related (block abusive traffic patterns)
```

**The goal is NOT to fix the bug. The goal is to restore service.**

### Phase 3: Investigate (Once Mitigated)

```
1. WHEN did it start? (correlate with deploys, config changes, traffic spikes)
2. WHAT changed? (deploy diff, config change, dependency update, DNS, certificate)
3. WHERE is it failing? (which service, which endpoint, which query, which region)
4. WHY is it failing? (root cause analysis — use systematic-debugging skill)

Investigation checklist:
- [ ] Check deploy history (last 24 hours)
- [ ] Check config changes
- [ ] Check infrastructure changes (DNS, certificates, scaling)
- [ ] Check dependency updates
- [ ] Check external service status (third-party APIs, cloud provider)
- [ ] Check traffic patterns (sudden spike, unusual patterns)
- [ ] Check database (connection pool, slow queries, locks)
- [ ] Check disk space, memory, CPU
- [ ] Check error logs for first occurrence
- [ ] Check monitoring dashboards for anomalies
```

### Phase 4: Fix (Permanent Resolution)

```
1. WRITE a failing test that reproduces the issue
2. IMPLEMENT the fix
3. VERIFY on staging (or equivalent non-production environment)
4. DEPLOY with careful monitoring
5. CONFIRM incident is resolved with evidence:
   - Health check returns 200
   - Error rate returned to baseline
   - Key metrics returned to baseline
   - No new errors in logs for 15+ minutes
```

### Phase 5: Post-Mortem (Within 48 Hours)

```markdown
# Post-Mortem: [Incident Title]

**Date:** [Date]
**Duration:** [Start → Resolution]
**Severity:** P0/P1/P2/P3
**Impact:** [Customer-facing impact summary — quantify]
**Authors:** [Who wrote this post-mortem]

## Timeline
| Time | Event |
|------|-------|
| HH:MM | First alert triggered |
| HH:MM | Incident declared, severity assigned |
| HH:MM | Mitigation applied |
| HH:MM | Root cause identified |
| HH:MM | Permanent fix deployed |
| HH:MM | Incident resolved, monitoring confirmed |

## Root Cause
[Technical explanation of what went wrong and why]

## Contributing Factors
- [Factor 1 — why was this possible?]
- [Factor 2 — what amplified the impact?]

## Detection
- **How was it detected?** [Alert / Customer report / Manual check]
- **Could we have detected it sooner?** [Yes/No — how?]
- **Detection gap:** [Time from start to detection]

## What Went Well
- [Things that helped resolve quickly]

## What Went Poorly
- [Things that slowed resolution]

## Action Items
| # | Action | Owner | Deadline | Status | Priority |
|---|--------|-------|----------|--------|----------|
| 1 | Add monitoring for X | [Name] | [Date] | ⬜ | 🔴 High |
| 2 | Write test for edge case | [Name] | [Date] | ⬜ | 🟡 Medium |
| 3 | Update runbook | [Name] | [Date] | ⬜ | 🟡 Medium |
| 4 | Add circuit breaker for Y | [Name] | [Date] | ⬜ | 🟠 High |

## Lessons Learned
[What we'll do differently next time]

## Prevention
[What systemic changes prevent this class of incident]
```

## Communication Templates

### Initial Alert
```
🚨 [P0/P1] Incident: [Brief description]
Impact: [Who is affected, quantified]
Status: Investigating
Lead: [Name]
Next update: [Time]
```

### Update
```
📊 Incident Update: [Brief description]
Status: Mitigating / Root cause found / Fix deploying
Current impact: [Status — improving / stable / worsening]
ETA to resolution: [Estimate or "Unknown"]
Next update: [Time]
```

### Resolution
```
✅ Incident Resolved: [Brief description]
Duration: [X hours/minutes]
Impact: [Summary — quantified]
Root cause: [One sentence]
Post-mortem: Scheduled for [Date]
```

## Red Flags During Incidents

- Guessing instead of checking logs
- Applying untested fixes to production
- Making multiple changes simultaneously (can't tell what fixed it)
- Not communicating with stakeholders
- Declaring resolution without verification (health check, metrics, logs)
- Skipping post-mortem
- Blaming individuals instead of systems
- Not preserving evidence (logs, metrics, state)

## Integration

- **During investigation:** `systematic-debugging` for root cause
- **During fix:** `test-driven-development` for the fix
- **After resolution:** `verification-before-completion`
- **Prevention:** `observability-audit`, `ci-cd-audit` to improve detection
- **Security incidents:** `security-audit` for breach analysis

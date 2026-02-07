---
name: ci-cd-audit
description: "Use when auditing build pipelines, deployment processes, CI/CD configuration, environment management, or release workflows. Covers build reliability, deployment safety, rollback capability, and environment parity."
---

# CI/CD Audit

## Overview

Deployment should be boring. If deploying is scary, your pipeline is broken.

**Core principle:** Every deploy should be automated, tested, reversible, and auditable.

## The Iron Law

```
NO MANUAL DEPLOYMENT STEPS. NO DEPLOY WITHOUT AUTOMATED TESTS. NO DEPLOY WITHOUT ROLLBACK PLAN.
```

## When to Use

- Setting up or reviewing CI/CD pipelines
- After a failed deployment
- Before first production deploy
- When deployment takes too long or fails too often
- During any codebase audit

## The Audit Process

### Phase 1: Build Pipeline

```
1. IS the build automated? (triggered on push/PR)
2. IS the build reproducible? (same input → same output)
3. DOES the build fail fast? (lint → type check → unit test → integration test)
4. IS build time reasonable? (< 10 min for most projects)
5. ARE build artifacts versioned?
```

**Pipeline stage order:**

```
1. Install dependencies (cached)
2. Lint / format check
3. Type checking
4. Unit tests
5. Integration tests
6. Build production artifacts
7. Security scan
8. Deploy to staging
9. Smoke tests on staging
10. Deploy to production
11. Health check verification
```

### Phase 2: Test Coverage in Pipeline

```
1. ARE tests mandatory before merge? (not just "run on PR")
2. DO test failures block deployment?
3. IS there a minimum coverage threshold?
4. ARE flaky tests tracked and fixed (not ignored)?
5. ARE E2E tests included (at least smoke tests)?
```

### Phase 3: Environment Management

```
1. HOW many environments? (dev → staging → production minimum)
2. IS staging identical to production? (same infra, same config pattern)
3. ARE environment variables managed securely? (not in code)
4. CAN any developer deploy to production? (should require approval)
5. ARE database migrations automated?
```

**Environment parity checklist:**

| Aspect | Staging | Production | Match? |
|--------|---------|-----------|--------|
| Runtime version | Same? | Same? | |
| Dependencies | Same? | Same? | |
| Infrastructure | Similar? | — | |
| Data volume | Representative? | — | |
| Config structure | Same? | Same? | |

### Phase 4: Deployment Safety

```
1. IS there a health check after deploy?
2. CAN you rollback in < 5 minutes?
3. IS there a deployment window policy?
4. ARE deployments logged with who/what/when?
5. IS there a canary/blue-green strategy for critical services?
```

**Rollback strategy assessment:**

| Strategy | Speed | Complexity | Data Risk |
|----------|-------|-----------|-----------|
| Revert last commit + redeploy | Slow (5-10min) | Low | None |
| Previous container/artifact | Fast (< 1min) | Medium | None |
| Blue-green swap | Instant | High | None |
| Feature flags | Instant | Medium | None |
| Database rollback | Slow | High | ⚠️ Risk |

### Phase 5: Secrets Management

```
1. ARE secrets in environment variables (not code)?
2. ARE secrets rotated periodically?
3. ARE secrets different per environment?
4. IS there audit logging for secret access?
5. CAN secrets be rotated without code change?
```

### Phase 6: Monitoring Integration

```
1. ARE deployments tracked in monitoring? (deploy markers)
2. DO alerts trigger on post-deploy anomalies?
3. IS there automated rollback on error rate spikes?
4. ARE logs enhanced during deployment (extra context)?
```

## Output Format

```markdown
# CI/CD Audit: [Project Name]

## Pipeline Overview
- **CI Platform:** [GitHub Actions / GitLab CI / Jenkins / etc.]
- **Environments:** [List]
- **Deploy Frequency:** [Per day/week/month]
- **Average Build Time:** [X minutes]
- **Rollback Time:** [X minutes]

## Pipeline Stages
| Stage | Automated | Blocking | Duration |
|-------|-----------|----------|----------|
| Lint | ✅/❌ | ✅/❌ | Xm |
| Tests | ✅/❌ | ✅/❌ | Xm |
| Build | ✅/❌ | ✅/❌ | Xm |
| Deploy | ✅/❌ | — | Xm |

## Findings
[Standard severity format]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- Manual deployment steps (SSH + git pull)
- Tests not required before merge
- No staging environment
- Secrets in source code
- No rollback plan
- Deploy takes > 30 minutes
- No health check after deploy
- "It works on my machine" deployments

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `security-audit` for secrets and deploy security
- **Enables:** `incident-response` rollback procedures

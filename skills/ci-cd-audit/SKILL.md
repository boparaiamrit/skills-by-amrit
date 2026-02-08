---
name: ci-cd-audit
description: "Use when auditing build pipelines, deployment processes, CI/CD configuration, environment management, or release workflows. Covers build reliability, deployment safety, rollback capability, secrets management, and environment parity."
---

# CI/CD Audit

## Overview

Deployment should be boring. If deploying is scary, your pipeline is broken.

**Core principle:** Every deploy should be automated, tested, reversible, and auditable.

## The Iron Law

```
NO MANUAL DEPLOYMENT STEPS. NO DEPLOY WITHOUT AUTOMATED TESTS. NO DEPLOY WITHOUT ROLLBACK PLAN. NO SECRETS IN SOURCE CODE.
```

## When to Use

- Setting up or reviewing CI/CD pipelines
- After a failed deployment
- Before first production deploy
- When deployment takes too long or fails too often
- When different environments behave differently
- During any codebase audit

## When NOT to Use

- Personal scripts or local dev tooling (not deployment)
- Evaluating which CI platform to choose (this audits existing pipelines)
- Library/package projects with no deployment (use `dependency-audit`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "pipeline looks fine" — read every stage, every config file, every env var
- Say "tests run in CI" — verify they BLOCK deployment on failure (not just advisory)
- Say "we have staging" — verify staging matches production config structure
- Say "rollback works" — verify the procedure is documented AND tested
- Say "secrets are secure" — grep the repo for hardcoded values
- Skip checking deployment logs — read the last 5 deployments for warnings
- Assume environment parity — check runtime versions, deps, config in each env
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "We deploy manually because it's faster" | Manual deploys are faster until they fail. Then it's a 4-hour incident. |
| "We don't need staging" | Local ≠ production. Network, DNS, config, secrets, scale differ. |
| "Tests slow down the pipeline" | Slow tests = testing problem. Fix tests, don't skip them. |
| "We've never needed to rollback" | You haven't needed to rollback YET. When you do, 5 min vs 5 hours matters. |
| "We deploy from our laptops" | One compromised laptop = compromised production. Deploy from CI only. |
| "Friday deploys are fine" | If they require bravery, your pipeline lacks confidence signals. |

## Iron Questions

```
1. If a broken commit hits main, what stops it from reaching production?
2. Can you rollback in under 5 minutes?
3. Can you deploy a hotfix in under 15 minutes?
4. What's the blast radius of a bad deploy?
5. If CI goes down, can you deploy in an emergency?
6. Who can deploy to production? Is there approval?
7. Are there ANY manual steps? Including database migrations?
8. Can you reproduce any past deployment exactly?
9. What happens if two people deploy simultaneously?
10. How long from merged PR to running in production?
```

## The Audit Process

### Phase 1: Build Pipeline

```
1. IS the build automated? (triggered on push/PR/tag)
2. IS the build reproducible? (same commit → same artifact)
3. DOES it fail fast? (lint → types → unit → integration → e2e)
4. IS build time reasonable? (< 10 min total, < 5 min for tests)
5. ARE artifacts versioned and immutable?
6. ARE dependencies cached?
7. ARE builds deterministic? (lockfiles committed)
```

**Pipeline stage order (fail-fast):**

```
1. Install dependencies (cached)           [~30s]
2. Lint / format check                      [~15s]  ← Cheapest first
3. Type checking                            [~30s]
4. Unit tests                               [~1-3m]
5. Integration tests                        [~3-5m]
6. Build production artifacts               [~1-3m]
7. Security scan                            [~30s]
8. Deploy to staging                        [~1-2m]
9. Smoke tests on staging                   [~3-5m]
10. Manual approval gate (if required)
11. Deploy to production                    [~1-2m]
12. Health check + smoke test               [~30s]
13. Deploy notification + monitoring marker [~5s]
```

### Phase 2: Test Gate Enforcement

```
1. ARE tests mandatory before merge? (branch protection)
2. DO failures BLOCK deployment? (not just yellow warnings)
3. IS there a coverage threshold?
4. ARE flaky tests tracked and fixed?
5. ARE E2E smoke tests included?
6. ARE test results visible on PRs?
```

| Check | Enforced | Method | Assessment |
|-------|----------|--------|------------|
| Lint passes | ✅/❌ | Branch protection | |
| Types pass | ✅/❌ | Branch protection | |
| Unit tests pass | ✅/❌ | Pipeline failure | |
| Coverage threshold | ✅/❌ | Coverage tool | |
| Security scan clean | ✅/❌ | Pipeline failure | |

### Phase 3: Environment Management

```
1. HOW many environments? (dev → staging → production minimum)
2. IS staging a true production replica?
3. ARE env vars managed securely? (vault, CI secrets — not .env in repo)
4. ARE database migrations automated?
5. ARE feature flags used for risky features?
```

**Environment parity checklist:**

| Aspect | Dev | Staging | Production | Risk If Mismatched |
|--------|-----|---------|-----------|-------------------|
| Runtime version | | | | Behavior differences |
| Dependencies | | | | Inconsistent results |
| Config structure | | | | Missing variables |
| Database version | | | | SQL compatibility |
| TLS/SSL | | | | Certificate issues |
| Data volume | | | | Performance gaps |

### Phase 4: Deployment Safety

```
1. IS there a health check after deploy?
2. CAN you rollback in < 5 minutes?
3. IS there automatic rollback on failure?
4. ARE deployments logged (who/what/when)?
5. IS there canary or blue-green for critical services?
6. ARE database migrations backward-compatible?
```

**Deployment strategies:**

| Strategy | Speed | Complexity | Risk | Best For |
|----------|-------|-----------|------|----------|
| Direct replace | Slow, downtime | Low | 🔴 High | Dev only |
| Rolling update | Medium | Medium | 🟡 Medium | Stateless services |
| Blue-green | Fast | High | 🟢 Low | Critical services |
| Canary | Gradual | High | 🟢 Lowest | High-traffic |
| Feature flags | Instant | Medium | 🟢 Low | Risky features |

**Rollback requirements:**

- [ ] Previous artifact available and tagged
- [ ] Rollback command documented and tested
- [ ] DB migrations are backward-compatible
- [ ] Any on-call engineer can perform rollback
- [ ] Rollback time under 5 minutes
- [ ] Monitoring confirms rollback succeeded

### Phase 5: Secrets Management

```
1. ARE secrets in env vars or vault (NOT source code)?
2. ARE secrets different per environment?
3. ARE secrets rotated periodically?
4. IS there audit logging for secret access?
5. CAN secrets rotate without code change?
6. Are there secrets in git history?
7. ARE CI secrets properly scoped?
```

**Detection:**

```bash
# Hardcoded secrets
grep -rn "API_KEY\|SECRET\|PASSWORD\|TOKEN" --include="*.ts" --include="*.py" . | grep -v node_modules | grep -v ".env.example" | grep -v "process.env"

# .env files in repo
find . -name ".env" -not -name ".env.example" -not -path "*/node_modules/*"

# .env in .gitignore
grep ".env" .gitignore
```

### Phase 6: Monitoring Integration

```
1. ARE deployments tracked in monitoring? (deploy markers)
2. DO alerts trigger on post-deploy anomalies?
3. IS there automated rollback on error rate spikes?
4. ARE DORA metrics tracked?
```

**DORA Metrics:**

| Metric | Elite | High | Medium | Low |
|--------|-------|------|--------|-----|
| Deploy frequency | Multiple/day | Weekly | Monthly | > 6 months |
| Lead time | < 1 hour | < 1 week | 1-6 months | > 6 months |
| MTTR | < 1 hour | < 1 day | < 1 week | > 6 months |
| Change failure rate | 0-15% | 16-30% | 31-45% | 46-60% |

## Output Format

```markdown
# CI/CD Audit: [Project Name]

## Pipeline Overview
- **CI Platform:** [GitHub Actions / GitLab CI / etc.]
- **Environments:** [List]
- **Deploy Frequency:** [Per day/week/month]
- **Build Time:** [X minutes]
- **Rollback Time:** [X minutes / untested]
- **Strategy:** [Rolling / Blue-green / Canary]

## Pipeline Stages
| Stage | Automated | Blocking | Cached | Duration |
|-------|-----------|----------|--------|----------|

## DORA Metrics Assessment
[Current vs target]

## Findings
[Standard severity format]

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- Manual deployment (SSH + git pull + restart)
- Tests not required before merge
- No staging environment
- Secrets in source code or git history
- No rollback plan
- Deploy takes > 30 minutes
- No health check after deploy
- Only one person knows how to deploy
- No deploy notifications

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `security-audit` for secrets and deploy security
- **Enables:** `incident-response` rollback procedures
- **Informs:** `observability-audit` for deploy markers

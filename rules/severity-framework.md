# Severity Framework

> Standardized severity classification used by all skills.

---

## Severity Levels

| Level | Emoji | Label | Response Time | Meaning |
|-------|-------|-------|---------------|---------|
| S0 | 🔴 | Critical | Immediate | Production outage, security breach, data loss |
| S1 | 🟠 | High | Before next deploy | Significant risk, broken functionality, vulnerability |
| S2 | 🟡 | Medium | This sprint | Technical debt, performance degradation, missing coverage |
| S3 | 🟢 | Low | Backlog | Code quality, style, minor improvement |
| S4 | ⚪ | Info | Optional | Observation, suggestion, discussion point |

---

## Classification Criteria

### 🔴 Critical (S0)

**Characteristics:**
- Active security vulnerability (exposed credentials, injection, broken auth)
- Data corruption or loss risk
- Application crashes or cannot start
- Payment/billing errors
- Regulatory compliance violation

**Examples:**
- SQL injection in user-facing endpoint
- Hardcoded API keys in committed code
- Missing database constraints allowing corrupt data
- Race condition causing double-spend
- Unhandled exceptions in payment flow

### 🟠 High (S1)

**Characteristics:**
- Broken feature in production
- Security weakness (not yet exploitable)
- Data inconsistency risk
- Missing authorization checks
- Performance degradation affecting users

**Examples:**
- N+1 query on a list endpoint serving 1000+ items
- Missing CSRF protection on state-changing endpoints
- No rate limiting on authentication endpoints
- Business logic that silently fails
- Missing database indexes on frequent query paths

### 🟡 Medium (S2)

**Characteristics:**
- Technical debt that compounds
- Missing test coverage on critical paths
- Performance issues (not yet impacting users)
- Code that's hard to maintain
- Missing monitoring/observability

**Examples:**
- Controller with 500+ lines
- Test suite that doesn't cover error paths
- No structured logging in a production service
- Missing input validation on internal APIs
- Hardcoded configuration values

### 🟢 Low (S3)

**Characteristics:**
- Style and convention violations
- Minor code smells
- Documentation gaps
- Non-critical improvements

**Examples:**
- Inconsistent naming conventions
- Missing JSDoc/docstring on internal functions
- TODO comments older than 3 months
- Minor code duplication (< 10 lines)
- Unused imports

### ⚪ Info (S4)

**Characteristics:**
- Observations with no action needed
- Architecture discussion points
- Future consideration items

**Examples:**
- "This pattern could benefit from X when the team grows"
- "Consider Y when traffic exceeds Z"
- "Alternative approach worth discussing"

---

## Aggregation Rules

When reporting findings across an audit:

```markdown
## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 2 | ⛔ Blocks release |
| 🟠 High | 5 | ⚠️ Fix before deploy |
| 🟡 Medium | 12 | 📋 Sprint backlog |
| 🟢 Low | 8 | 📝 Improvement backlog |
| ⚪ Info | 3 | 💬 Discussion items |

**Verdict:** [PASS / CONDITIONAL PASS / FAIL]
```

### Verdict Rules

- **FAIL** — Any 🔴 Critical finding → Cannot proceed
- **CONDITIONAL PASS** — Any 🟠 High finding → Can proceed with fix plan
- **PASS** — Only 🟡 and below → Proceed with awareness

---

## Usage in Skills

Every skill that produces findings MUST:
1. Use this severity framework consistently
2. Include a summary table
3. State a verdict
4. Order findings by severity (highest first)

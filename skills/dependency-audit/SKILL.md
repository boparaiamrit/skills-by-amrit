---
name: dependency-audit
description: "Use when reviewing project dependencies, investigating supply chain security, checking for outdated packages, or evaluating new dependencies to add."
---

# Dependency Audit

## Overview

Every dependency is code you didn't write, can't fully control, and must trust. Audit ruthlessly.

**Core principle:** Every dependency is a liability until proven otherwise.

## The Iron Law

```
NO NEW DEPENDENCY WITHOUT JUSTIFICATION. NO UNAUDITED DEPENDENCY IN PRODUCTION.
```

## When to Use

- Adding a new dependency
- Running periodic dependency health checks
- After security advisory notifications
- Investigating unexplained behavior (could be dependency bug)
- During any codebase audit
- Before major version upgrades

## The Audit Process

### Phase 1: Inventory

```
1. LIST all direct dependencies and their versions
2. COUNT total dependencies (direct + transitive)
3. IDENTIFY outdated packages (how far behind latest?)
4. FLAG deprecated packages
```

### Phase 2: Security Scan

```
# Run the appropriate audit command
npm audit                    # Node.js
pip audit                    # Python
bundle-audit check           # Ruby
composer audit               # PHP
cargo audit                  # Rust
dotnet list package --vulnerable  # .NET
```

**For each vulnerability:**

| Field | Info Needed |
|-------|------------|
| Package | Which dependency |
| Severity | Critical / High / Medium / Low |
| CVE | Identifier for tracking |
| Fix Available? | Is there a patched version? |
| Direct/Transitive | Do you control the version? |
| Impact | Can it be exploited in your usage? |

### Phase 3: Health Assessment (Per Dependency)

| Criterion | Healthy | Concerning |
|-----------|---------|-----------|
| Last published | < 6 months ago | > 2 years ago |
| Open issues | Actively triaged | Hundreds unaddressed |
| Contributors | 5+ active | 1 (bus factor) |
| Downloads/week | Trending up or stable | Declining |
| License | MIT, Apache, BSD | GPL (for proprietary), No license |
| Bundle size | Appropriate | Massive for feature used |
| Dependencies | Few | Deep dependency tree |

### Phase 4: Necessity Check

For each dependency, ask:

```
1. WHAT does it do that we use?
2. HOW much of it do we use? (one function from a 500KB library?)
3. COULD we implement this ourselves? (< 100 lines?)
4. IS there a smaller alternative?
5. IS it actively maintained?
```

**Dependencies to question:**

| Type | Example | Question |
|------|---------|----------|
| Utility libraries | lodash, underscore | Do you need the whole library or one function? |
| Date libraries | moment.js (deprecated) | Switch to date-fns, dayjs, or native Intl |
| CSS frameworks | Full Bootstrap | Do you use more than 10% of it? |
| Polyfills | babel polyfills | Do your target browsers need them? |
| Wrappers | axios | Is native fetch sufficient? |

### Phase 5: License Compliance

| License | Commercial Use | Copyleft? | Risk |
|---------|---------------|-----------|------|
| MIT | ✅ | No | None |
| Apache 2.0 | ✅ | No | Patent clause |
| BSD | ✅ | No | None |
| ISC | ✅ | No | None |
| GPL v2/v3 | ⚠️ | Yes | Must open-source your code |
| LGPL | ✅ (if dynamically linked) | Partial | Complex compliance |
| AGPL | ❌ (for SaaS) | Yes | Network use triggers copyleft |
| No License | ❌ | Unknown | Cannot legally use |

## Output Format

```markdown
# Dependency Audit: [Project Name]

## Summary
- **Direct Dependencies:** N
- **Total (with transitive):** N
- **Outdated:** N
- **Deprecated:** N
- **Known Vulnerabilities:** N

## Vulnerabilities
| Package | Severity | CVE | Fix Available | Fixed In |
|---------|----------|------|-------------|----------|
| express | 🔴 Critical | CVE-2024-XXXX | ✅ | 4.18.3 |

## Unnecessary Dependencies
| Package | Reason | Alternative |
|---------|--------|------------|
| moment | Deprecated | dayjs or date-fns |
| lodash | Only uses _.get | Optional chaining (?.) |

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags

- Dependencies with known critical CVEs
- Packages with no license
- Dependencies last updated > 2 years ago
- Single-maintainer critical dependencies
- GPL dependencies in proprietary code
- > 500 transitive dependencies (supply chain risk)

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `security-audit` for vulnerability context
- **Triggers:** `incident-response` if critical CVE found

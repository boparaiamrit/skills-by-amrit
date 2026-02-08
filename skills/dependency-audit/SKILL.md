---
name: dependency-audit
description: "Use when reviewing project dependencies, investigating supply chain security, checking for outdated packages, or evaluating new dependencies to add."
---

# Dependency Audit

## Overview

Every dependency is code you didn't write, can't fully control, and must trust. The average npm project has 200+ transitive dependencies. Each one is a potential vulnerability, a potential breaking change, and a potential abandoned project.

**Core principle:** Every dependency is a liability until proven otherwise. Justify every one.

## The Iron Law

```
NO NEW DEPENDENCY WITHOUT JUSTIFICATION. NO UNAUDITED DEPENDENCY IN PRODUCTION. NO DEPENDENCY WITHOUT AN EXIT STRATEGY.
```

## When to Use

- Adding a new dependency (always audit before adding)
- Running periodic dependency health checks (quarterly minimum)
- After security advisory notifications (CVE alerts)
- Investigating unexplained behavior (could be dependency bug)
- During any codebase audit
- Before major version upgrades
- When build/install times are growing

## When NOT to Use

- Choosing between two technologies (that's a design decision, not an audit)
- Evaluating your own code quality (use `code-review` or `architecture-audit`)
- If the project has zero external dependencies (rare but possible)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "dependencies look fine" — run the actual audit command and read the output
- Say "no vulnerabilities" — run npm audit / pip audit / equivalent AND check the output
- Say "package is maintained" — check last publish date, open issues count, contributor count
- Say "we need this dependency" — verify what fraction of it you use (one function from 500KB?)
- Skip transitive dependencies — they're the largest attack surface
- Say "license is fine" — verify the specific license against your project's license requirements
- Trust download counts alone — popular packages can be compromised too
- Say "we'll update later" — document WHEN and add it to the backlog with a deadline
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "Everyone uses this package" | Popularity ≠ security. Popular packages are bigger targets for supply chain attacks. |
| "It's only a dev dependency" | Dev dependencies execute during build. A compromised build dependency compromises your artifact. |
| "We only use one function from it" | Then implement that function yourself. Don't ship 500KB for one utility. |
| "It's been around forever" | "Around forever" often means "unmaintained." Check last commit date. |
| "The vulnerability doesn't affect us" | Prove it with evidence. Most "doesn't affect us" claims are wishful thinking. |
| "We'll update when we have time" | You won't have time until the CVE becomes an incident. Schedule it now. |
| "Pinning versions protects us" | Pinning prevents auto-updates but also prevents auto-patches. You must actively manage pinned versions. |

## Iron Questions

```
1. If this dependency disappeared tomorrow, how hard would it be to replace?
2. What exactly do we use from this dependency? (list specific functions/features)
3. Could we implement this ourselves in less than 100 lines?
4. Who maintains this? Is it one person or an organization?
5. When was the last release? When was the last commit?
6. Does this dependency pull in heavy transitive dependencies?
7. Is the license compatible with our project?
8. What's our update strategy for this dependency? (auto / manual / pinned)
9. If this dependency has a breaking change, how much of our code changes?
10. Are there lighter alternatives that cover our specific use case?
```

## The Audit Process

### Phase 1: Inventory

```
1. LIST all direct dependencies and their versions
2. COUNT total dependencies (direct + transitive)
3. IDENTIFY outdated packages (how far behind latest?)
4. FLAG deprecated packages
5. IDENTIFY duplicate packages (same package, different versions)
6. CALCULATE total dependency weight (disk size, download size)
```

**Detection:**

```bash
# Node.js
npm ls --all --depth=0          # Direct dependencies
npm ls --all | wc -l            # Total dependency count
npm outdated                     # Outdated packages
npx depcheck                     # Unused dependencies

# Python
pip list                         # All installed
pip list --outdated              # Outdated packages
pip show [package]               # Package details
pipdeptree                       # Dependency tree

# General
du -sh node_modules/             # Total size (Node)
find node_modules -name "package.json" | wc -l  # Package count (Node)
```

### Phase 2: Security Scan

```
# Run the appropriate audit command
npm audit                           # Node.js
pip audit                           # Python (pip-audit)
bundle-audit check                  # Ruby
composer audit                      # PHP
cargo audit                         # Rust
dotnet list package --vulnerable    # .NET
```

**For each vulnerability:**

| Field | Required Info | Impact Assessment |
|-------|-------------|-------------------|
| Package | Which dependency? | Direct or transitive? |
| Severity | Critical / High / Medium / Low | Does it match your risk tolerance? |
| CVE | CVE identifier | Is it verified? |
| Fix Available? | Patched version exists? | Can you upgrade without breaking changes? |
| Exploitability | Can it be exploited in YOUR usage? | Network-accessible? User-input-driven? |
| Workaround | Alternative mitigation? | Can you patch behavior without upgrading? |

**Vulnerability triage decision tree:**

```
Is it Critical or High severity?
├── Yes → Is there a fix available?
│   ├── Yes → Upgrade immediately
│   └── No → Is it exploitable in your context?
│       ├── Yes → Find alternative dependency or implement workaround
│       └── No → Document risk, monitor for fix, set review date
└── No (Medium/Low) → Schedule for next dependency update cycle
```

### Phase 3: Health Assessment (Per Major Dependency)

| Criterion | Healthy (🟢) | Concerning (🟡) | Dangerous (🔴) |
|-----------|-------------|-----------------|----------------|
| Last published | < 6 months ago | 6 months - 2 years | > 2 years |
| Open issues | Actively triaged | Growing backlog | Hundreds unaddressed |
| Contributors | 5+ active | 2-4 | 1 (bus factor = 1) |
| Downloads/week | Stable or growing | Declining | Rapidly declining |
| License | MIT, Apache, BSD | LGPL | GPL (for proprietary), No license |
| Bundle size | Appropriate for features used | Larger than needed | Massive (> 500KB for one feature) |
| Dependencies | Few (< 10 transitive) | Moderate (10-50) | Deep tree (> 100 transitive) |
| TypeScript support | Built-in types | @types package | No types |
| Security history | No CVEs | Past CVEs, all resolved | Active unresolved CVEs |
| Breaking change frequency | Semantic versioning followed | Occasional surprises | Frequent breakage |

### Phase 4: Necessity Check

For each dependency, justify its existence:

```
1. WHAT does it do that we actually use?
2. HOW MUCH of it do we use? (% of API surface)
3. COULD we implement this ourselves? (< 100 lines = do it yourself)
4. IS there a smaller alternative?
5. COULD a native platform API replace this? (fetch vs axios, Intl vs moment)
6. IS it a direct dependency or should it be a dev dependency?
```

**Common unnecessary dependencies:**

| Type | Example | Question | Alternative |
|------|---------|----------|-------------|
| Full utility lib | lodash | Using > 5 functions? | Import individual functions or use native |
| Date library | moment.js (deprecated!) | Any date formatting? | dayjs (2KB), date-fns, native Intl |
| CSS framework | Full Bootstrap (300KB) | Using > 10% of it? | Tailwind (purged), custom CSS |
| HTTP client | axios | Just making GET/POST? | Native fetch API |
| Polyfills | babel polyfills | Target browsers need them? | Check caniuse.com |
| Wrappers | node-fetch | Node 18+ target? | Native fetch (built-in) |
| UUID generation | uuid package | Simple IDs? | crypto.randomUUID() (native) |

### Phase 5: License Compliance

| License | Commercial Use | Copyleft? | Risk Level | Notes |
|---------|---------------|-----------|-----------|-------|
| MIT | ✅ | No | 🟢 None | Most permissive |
| Apache 2.0 | ✅ | No | 🟢 Low | Patent clause — gives patent rights |
| BSD (2/3-clause) | ✅ | No | 🟢 None | Simple and permissive |
| ISC | ✅ | No | 🟢 None | Simplified MIT |
| GPL v2/v3 | ⚠️ | Yes | 🔴 High | Must open-source YOUR code if distributed |
| LGPL | ✅ (if dynamically linked) | Partial | 🟡 Medium | Complex compliance rules |
| AGPL | ❌ (for SaaS) | Yes | 🔴 Critical | Network use triggers copyleft |
| No License | ❌ | Unknown | 🔴 Critical | Cannot legally use — all rights reserved by default |
| Dual License | Depends | Varies | 🟡 Check | Read both options carefully |

**Detection:**

```bash
# Node.js - List all licenses
npx license-checker --summary

# Check for problematic licenses
npx license-checker --failOn "GPL-3.0;AGPL-3.0"
```

### Phase 6: Supply Chain Security

```
1. ARE lockfiles committed? (package-lock.json, yarn.lock, poetry.lock)
2. ARE dependency versions pinned? (exact versions, not ranges)
3. IS there a .npmrc or pip.conf restricting registries?
4. ARE pre/post install scripts reviewed? (npm scripts can execute arbitrary code)
5. IS there a policy for reviewing new dependencies before adding?
6. ARE you using a private registry or proxy? (Artifactory, Verdaccio)
7. IS two-factor authentication enabled on your npm/PyPI account?
```

## Output Format

```markdown
# Dependency Audit: [Project Name]

## Summary
- **Direct Dependencies:** N
- **Total (with transitive):** N
- **Outdated:** N (N critical behind)
- **Deprecated:** N
- **Known Vulnerabilities:** N (N Critical, N High)
- **Unused Dependencies:** N
- **Total node_modules Size:** XMB

## Vulnerabilities
| Package | Severity | CVE | Fix Available | Exploitable | Action |
|---------|----------|------|-------------|------------|--------|
| express | 🔴 Critical | CVE-2024-XXXX | ✅ v4.18.3 | Yes | Upgrade now |

## Health Assessment (Top 10 Dependencies)
| Package | Version | Last Published | Contributors | License | Assessment |
|---------|---------|---------------|-------------|---------|------------|
| react | 18.2.0 | 2 months ago | 100+ | MIT | 🟢 Healthy |

## Unnecessary Dependencies
| Package | Reason | Alternative | Savings |
|---------|--------|------------|---------|
| moment | Deprecated | dayjs | ~280KB |
| lodash | Only uses _.get | Optional chaining | ~60KB |

## License Compliance
| License | Count | Risk |
|---------|-------|------|
| MIT | 45 | 🟢 |
| Apache-2.0 | 12 | 🟢 |
| GPL-3.0 | 1 | 🔴 |

## Findings
[Standard severity format]

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — STOP and Investigate

- Dependencies with known critical CVEs (unpatched)
- Packages with no license (legally unusable)
- Dependencies last updated > 2 years ago in active use
- Single-maintainer critical dependencies (bus factor = 1)
- GPL dependencies in proprietary code
- \> 500 transitive dependencies (supply chain risk surface)
- Deprecated packages still in use (moment.js, request, etc.)
- No lockfile committed (non-deterministic builds)
- Pre/post install scripts that download remote code
- Duplicate packages at different versions

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `security-audit` for vulnerability context
- **Triggers:** `incident-response` if critical CVE found
- **Informs:** `ci-cd-audit` for build pipeline security
- **Relates:** `performance-audit` for bundle size impact

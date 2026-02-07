# 🔷 Skills Reference — Evolution

> 4 skills for evolving, documenting, and managing codebases over time

---

## 19. ♻️ refactoring-safely

**Use When:** Restructuring code without changing behavior — improving design, reducing tech debt.

**What It Teaches:**
- Incremental transformation patterns (Strangler Fig, Branch by Abstraction)
- Test coverage requirements before refactoring
- Feature flag strategies for gradual rollout
- Rollback strategies if refactoring goes wrong
- Code smell identification and remediation
- Refactoring commit patterns (separate from feature work)

**Key Protocols:**
1. **Ensure test coverage** before touching anything
2. **Refactor in small, atomic commits** (each commit compiles and passes tests)
3. **Never mix refactoring with feature work** in the same commit
4. **Use feature flags** for large refactors
5. **Verify behavior preserved** after each step

**Common Refactoring Patterns:**
| Pattern | When to Use |
|:---|:---|
| Extract Method | Long functions (>50 lines) |
| Extract Class | God classes with multiple responsibilities |
| Replace Conditional with Polymorphism | Complex switch/if-else chains |
| Introduce Parameter Object | Functions with 4+ parameters |
| Replace Magic Numbers with Constants | Unexplained numeric literals |
| Move Method | Method used more by another class |

---

## 20. 📖 writing-documentation

**Use When:** Creating or updating documentation — README, API docs, architecture docs, guides.

**What It Teaches:**
- Documentation types (reference, tutorial, explanation, how-to)
- README structure standards
- API documentation best practices
- Architecture decision records (ADRs)
- Code comment philosophy (why, not what)
- Knowledge transfer documentation

**Documentation Hierarchy:**
```
1. README.md           — Project overview, quick start
2. docs/
│  ├── ARCHITECTURE.md — Architecture decisions and rationale
│  ├── API.md          — API reference
│  ├── SETUP.md        — Development environment setup
│  ├── DEPLOYMENT.md   — Deployment procedures
│  └── CONTRIBUTING.md — Contribution guidelines
3. Code comments        — Why, not what
4. ADRs                — Architecture Decision Records
```

---

## 21. 🗺️ codebase-mapping

**Use When:** Understanding a new or complex codebase — entry points, module relationships, health.

**What It Teaches:**
- Module boundary identification
- Dependency graph construction
- Entry point mapping (what starts where)
- Code health metrics (complexity, coupling, coverage)
- Hot spot identification (frequently changed files)
- Dead code detection

**Output:** Codebase map including:
- Module inventory with responsibilities
- Dependency graph (visual + text)
- Entry points and execution flows
- Health metrics by module
- Recommended improvement areas

---

## 22. 🚨 incident-response

**Use When:** Handling production incidents — outages, data issues, security breaches.

**What It Teaches:**
- Incident triage and severity classification
- Communication protocols (who to notify, when)
- Root cause investigation while under pressure
- Mitigation vs fix (stop the bleeding first)
- Post-mortem structure (blameless)
- Prevention measures and follow-up tracking

**Incident Severity:**
| Level | Description | Response Time | Examples |
|:---:|:---|:---:|:---|
| P1 🔴 | System down | Immediate | Total outage, data loss |
| P2 🟠 | Major degradation | < 30 min | Core feature broken |
| P3 🟡 | Minor impact | < 4 hours | Non-critical bug |
| P4 🔵 | Cosmetic | Next sprint | UI glitch |

**Response Protocol:**
1. **Acknowledge** — Assign owner, set severity
2. **Triage** — Assess scope and impact
3. **Mitigate** — Stop the bleeding (rollback, feature flag, hotfix)
4. **Communicate** — Notify stakeholders
5. **Fix** — Apply permanent fix
6. **Post-mortem** — Document timeline, root cause, prevention
7. **Follow-up** — Track action items to completion

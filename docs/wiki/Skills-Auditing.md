# 🔶 Skills Reference — Auditing

> 10 specialized audit skills for comprehensive codebase health assessment

---

## 9. 🏛️ architecture-audit

**Use When:** Assessing system design, modularity, coupling, or scalability concerns.

**What It Teaches:**
- SOLID principle compliance checking
- Module boundary analysis and coupling metrics
- Dependency direction verification (no circular deps)
- Layered architecture validation
- Scalability bottleneck identification

**Checks:**
- [ ] Single Responsibility — each module has one reason to change
- [ ] Open/Closed — extensible without modification
- [ ] Dependency Inversion — depend on abstractions
- [ ] Module boundaries — no leaky abstractions
- [ ] Circular dependencies — none present
- [ ] Layer discipline — no skipping layers

---

## 10. 🔒 security-audit

**Use When:** Reviewing code for security vulnerabilities or before deployment.

**What It Teaches:**
- OWASP Top 10 vulnerability detection
- Authentication and authorization flow review
- Input validation and sanitization
- Secrets management (no hardcoded keys/tokens)
- SQL injection, XSS, CSRF prevention
- Dependency vulnerability scanning

**Severity Matrix:**
| Finding | Severity | Example |
|:---|:---:|:---|
| Auth bypass | 🔴 Critical | Missing middleware on admin routes |
| SQL injection | 🔴 Critical | User input in raw SQL |
| XSS | 🟡 Major | Unescaped user content in HTML |
| Missing CSRF | 🟡 Major | State-changing GET requests |
| Weak hashing | 🟡 Major | MD5 for passwords |
| Info disclosure | 🔵 Minor | Stack traces in production |

---

## 11. ⚡ performance-audit

**Use When:** Diagnosing slow performance, optimizing queries, or reducing bundle sizes.

**What It Teaches:**
- N+1 query detection and elimination
- Bundle size analysis and tree shaking
- Runtime profiling and bottleneck identification
- Caching strategy evaluation
- Memory leak detection
- Database query optimization

**Common Findings:**
- N+1 queries in ORMs (use eager loading / joins)
- Missing database indexes on query columns
- Unbounded result sets (add LIMIT)
- Synchronous operations that should be async
- Unnecessary re-renders in React/frontend
- Large unused dependencies in the bundle

---

## 12. 🗄️ database-audit

**Use When:** Reviewing schema design, query performance, or migration safety.

**What It Teaches:**
- Schema normalization assessment (3NF minimum)
- Index strategy review (covering indexes, composite keys)
- Query plan analysis (EXPLAIN)
- Migration safety (backward compatibility)
- Data integrity constraints (FK, CHECK, UNIQUE)
- Connection pool configuration

**Checks:**
- [ ] Tables are at least 3NF (justified denormalization documented)
- [ ] Foreign keys have indexes
- [ ] Query columns have appropriate indexes
- [ ] Migrations are reversible
- [ ] NOT NULL constraints where appropriate
- [ ] No unbounded queries (missing LIMIT)
- [ ] Timestamps use UTC

---

## 13. 🎨 frontend-audit

**Use When:** Reviewing frontend code quality, performance, or user experience.

**What It Teaches:**
- Component architecture patterns (presentational vs container)
- State management review (global vs local)
- Rendering efficiency (unnecessary re-renders)
- Responsive design verification
- Asset optimization (images, fonts, CSS)
- Error boundary implementation

---

## 14. 🌐 api-design-audit

**Use When:** Reviewing REST/GraphQL API design for consistency and best practices.

**What It Teaches:**
- RESTful resource naming conventions
- HTTP method semantics (GET = safe + idempotent)
- Pagination strategies (cursor vs offset)
- Error response format standardization
- API versioning strategies
- Rate limiting and throttling
- OpenAPI/Swagger documentation

**Checks:**
- [ ] Consistent resource naming (plural nouns, kebab-case)
- [ ] Proper HTTP status codes (201 for create, 204 for delete)
- [ ] Pagination on list endpoints
- [ ] Standardized error format with error codes
- [ ] Authentication on protected endpoints
- [ ] Input validation with clear error messages

---

## 15. 📦 dependency-audit

**Use When:** Checking for outdated, vulnerable, or unnecessary dependencies.

**What It Teaches:**
- Vulnerability scanning (CVEs)
- License compliance checking
- Bundle impact analysis (size contribution)
- Outdated dependency identification
- Unused dependency detection
- Lock file integrity verification

---

## 16. 📊 observability-audit

**Use When:** Assessing monitoring, logging, alerting, and debugging capability.

**What It Teaches:**
- Structured logging standards (JSON, log levels)
- Metrics collection (RED method: Rate, Errors, Duration)
- Distributed tracing setup
- Alert quality (actionable vs noisy)
- Dashboard effectiveness
- Production debugging capability

**Checks:**
- [ ] Structured logging (not console.log/print)
- [ ] Request tracing with correlation IDs
- [ ] Error rates monitored and alerted
- [ ] Latency metrics (p50, p95, p99)
- [ ] Health check endpoints
- [ ] Log rotation and retention

---

## 17. ♿ accessibility-audit

**Use When:** Ensuring UI is usable by everyone, WCAG compliance.

**What It Teaches:**
- WCAG 2.1 AA compliance checking
- Keyboard navigation verification
- Screen reader compatibility
- Color contrast ratios (4.5:1 minimum for text)
- ARIA attributes and roles
- Focus management
- Semantic HTML structure

---

## 18. 🔄 ci-cd-audit

**Use When:** Reviewing build and deployment pipeline quality.

**What It Teaches:**
- Build time optimization
- Test reliability (flaky test detection)
- Deployment safety (canary, blue-green, rolling)
- Pipeline security (secrets handling, artifact signing)
- Branch protection rules
- Automated quality gates

**Checks:**
- [ ] Build time under 10 minutes
- [ ] No flaky tests (test quarantine strategy)
- [ ] Automated rollback on failure
- [ ] Branch protection on main
- [ ] Secrets not in pipeline logs
- [ ] Required status checks before merge

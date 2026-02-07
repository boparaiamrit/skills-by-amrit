---
name: architecture-audit
description: "Use when asked to audit, evaluate, or understand a codebase's architecture. Covers structure, patterns, coupling, cohesion, and architectural drift. Use after codebase-mapping for full context."
---

# Architecture Audit

## Overview

Evaluate the structural health of a codebase — patterns, coupling, cohesion, and alignment between what the code claims to be and what it actually is.

**Core principle:** Architecture is not what's drawn on a whiteboard. It's what's in the code.

## The Iron Law

```
NO ARCHITECTURAL CLAIMS WITHOUT READING THE ACTUAL CODE
```

## When to Use

- "Audit this codebase"
- "Is this well-architected?"
- "What's the technical debt situation?"
- System feels hard to change or understand
- New team member needs to understand the system
- Before a major refactoring or migration

## The Audit Process

### Phase 1: Structure Mapping

```
1. MAP the directory structure — what's where
2. IDENTIFY the architectural pattern (layered, hexagonal, microservices, monolith, etc.)
3. COMPARE claimed architecture (docs) vs actual architecture (code)
4. DOCUMENT the real dependency graph
```

**Key questions:**
- Where does business logic live?
- Where does data access happen?
- Where are the boundaries between modules?
- What's shared vs isolated?

### Phase 2: Dependency Analysis

```
1. MAP module dependencies — who imports what
2. IDENTIFY circular dependencies
3. CHECK dependency direction — do inner layers depend on outer?
4. MEASURE coupling — how many modules change when one module changes?
```

**Dependency direction rules:**
```
✅ Controllers → Services → Repositories → Models
❌ Models → Services (wrong direction)
❌ Services → Controllers (wrong direction)
❌ Utilities → Business Logic (wrong direction)
```

### Phase 3: Pattern Consistency

```
1. IDENTIFY the dominant patterns (Repository, Service, Factory, etc.)
2. CHECK if patterns are applied consistently
3. FIND violations — where does the pattern break?
4. ASSESS — is the pattern appropriate for the problem?
```

**Common pattern violations:**

| Pattern | Violation | Impact |
|---------|-----------|--------|
| MVC | Business logic in controllers | Untestable, duplicated logic |
| Repository | Direct SQL in services | Coupled to DB implementation |
| Service Layer | Fat controllers, thin services | Logic scattered across layers |
| Event-Driven | Synchronous calls bypassing events | Hidden behavior, tight coupling |
| Clean Architecture | Framework code in domain layer | Domain locked to framework |

### Phase 4: Cohesion and Boundaries

```
1. CHECK module cohesion — does each module have a single, clear purpose?
2. CHECK boundary clarity — can you describe what a module does in one sentence?
3. FIND leaking abstractions — internal details exposed to consumers
4. IDENTIFY god classes/modules — things that do too much
```

**Cohesion checklist:**

| Question | Healthy | Unhealthy |
|----------|---------|-----------|
| Can you describe this module in one sentence? | Yes | "It does X and Y and also Z" |
| How many reasons to change? | 1-2 | 5+ |
| How many other modules depend on it? | Few | Everyone |
| Can you replace it without changing consumers? | Yes | No |

### Phase 5: Cross-Cutting Concerns

```
1. HOW is authentication handled? (centralized or scattered?)
2. HOW is authorization enforced? (middleware, decorators, manual checks?)
3. HOW is error handling done? (global handler, per-endpoint, inconsistent?)
4. HOW is logging implemented? (structured, unstructured, missing?)
5. HOW is configuration managed? (env vars, hardcoded, mixed?)
6. HOW are transactions managed? (explicit, implicit, missing?)
```

### Phase 6: Evolution Assessment

```
1. HOW hard is it to add a new feature? (new endpoint, new entity, new UI page)
2. HOW hard is it to change an existing feature?
3. HOW hard is it to delete a feature?
4. WHAT breaks when you touch one thing? (blast radius)
```

## Output Format

```markdown
# Architecture Audit: [Project Name]

## Executive Summary
[2-3 sentences: overall health assessment]

## Architecture Overview
- **Pattern:** [Identified pattern]
- **Claimed vs Actual:** [Alignment assessment]
- **Module Count:** [N modules/packages/services]
- **Primary Language(s):** [Languages]

## Dependency Map
[Key dependencies and their directions]

## Findings

### 🔴 Critical
[Findings with evidence and recommendations]

### 🟠 High
[...]

### 🟡 Medium
[...]

### 🟢 Low
[...]

## Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| Circular dependencies | N | 🔴/🟢 |
| God classes (>300 lines) | N | 🔴/🟢 |
| Dependency depth | N layers | 🟡/🟢 |
| Test coverage estimate | N% | 🟡/🟢 |
| Avg file length | N lines | 🟡/🟢 |

## Recommendations
[Priority-ordered improvements with effort estimates]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — Stop and Escalate

- No clear boundaries between modules
- Circular dependencies everywhere
- Business logic in 10+ different layers
- No tests
- No consistent error handling
- Config values hardcoded throughout

## Integration

- **Before:** `codebase-mapping` for initial understanding
- **Alongside:** `security-audit`, `performance-audit`, `database-audit`
- **After:** `refactoring-safely` for recommended improvements

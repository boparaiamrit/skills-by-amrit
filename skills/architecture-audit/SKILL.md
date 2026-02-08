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

## When NOT to Use

- First encounter with a codebase (use `codebase-mapping` first)
- Debugging a specific bug (use `systematic-debugging`)
- Performance bottleneck investigation only (use `performance-audit`)
- Need to understand what the codebase does (use `codebase-mapping`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Assess architecture from directory names alone — read the actual code in each layer
- Claim "clean architecture" because folders are named well — check dependency direction
- Say "patterns are consistent" without checking EVERY module — inconsistency hides in corners
- Skip dependency graph analysis — coupling only reveals itself through imports
- Accept "it works" as architectural validation — working ≠ well-architected
- Audit only the happy path — error handling architecture matters equally
- Skip cross-cutting concerns — auth, logging, config are architecture too
- Trust documentation over code — code is the source of truth, docs drift
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "The folder structure looks clean" | Folder structure ≠ architecture. Check dependency direction. |
| "We're using MVC/Clean Architecture" | Claiming a pattern ≠ implementing it. Verify with imports. |
| "Only the core modules matter" | Utility modules, middleware, and config can rot the architecture. |
| "It's a small project, architecture doesn't matter" | Small projects become large projects. Foundation matters. |
| "We'll fix the architecture later" | Later never comes. Architectural debt compounds exponentially. |
| "The tests prove the architecture is fine" | Tests can pass in a poorly architected system. |

## Iron Questions

```
1. Can I add a new feature without modifying existing code? (OCP)
2. Can I replace the database without touching business logic? (DIP)
3. Can I describe what each module does in ONE sentence? (SRP/cohesion)
4. Do inner layers depend on outer layers? (dependency direction violation)
5. If I change one module, how many other modules break? (coupling)
6. Are there circular dependencies? (sure sign of tangled architecture)
7. Does the code match the claimed architecture pattern?
8. Are cross-cutting concerns (auth, logging, errors) centralized or scattered?
9. Can I test business logic without infrastructure? (testability)
10. Is there a God class/module that everything depends on?
```

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

**Dependency health matrix:**

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| Circular dependencies | 0 | 1-2 | 3+ |
| Max dependency depth | 3-4 layers | 5-6 layers | 7+ layers |
| Fan-out (imports per module) | < 5 | 5-10 | > 10 |
| Fan-in (dependents per module) | < 10 | 10-20 | > 20 (God module) |

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
| Microservices | Direct database calls between services | Shared state, no isolation |
| DDD | Anemic domain models (data-only entities) | Business logic leaks to services |

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
| Are its internals hidden from consumers? | Yes | Consumers reach into internals |

### Phase 5: Cross-Cutting Concerns

```
1. HOW is authentication handled? (centralized or scattered?)
2. HOW is authorization enforced? (middleware, decorators, manual checks?)
3. HOW is error handling done? (global handler, per-endpoint, inconsistent?)
4. HOW is logging implemented? (structured, unstructured, missing?)
5. HOW is configuration managed? (env vars, hardcoded, mixed?)
6. HOW are transactions managed? (explicit, implicit, missing?)
7. HOW is validation done? (centralized, per-endpoint, duplicated?)
```

**Cross-cutting concern health:**

| Concern | Centralized | Scattered | Missing |
|---------|-------------|-----------|---------|
| Auth | ✅ Middleware | ⚠️ Per-route checks | 🔴 No auth |
| Errors | ✅ Global handler | ⚠️ Try-catch everywhere | 🔴 Unhandled errors |
| Logging | ✅ Structured, central | ⚠️ console.log scattered | 🔴 No logging |
| Config | ✅ Environment + defaults | ⚠️ Hardcoded in some places | 🔴 Secrets in code |
| Validation | ✅ Shared validators | ⚠️ Inline checks | 🔴 No validation |

### Phase 6: Evolution Assessment

```
1. HOW hard is it to add a new feature? (new endpoint, new entity, new UI page)
2. HOW hard is it to change an existing feature?
3. HOW hard is it to delete a feature?
4. WHAT breaks when you touch one thing? (blast radius)
5. HOW would this scale at 10x the current load?
6. WHAT would a new team member struggle with?
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
| Cross-cutting consistency | N/7 centralized | 🟡/🟢 |

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
- God module that everything imports from
- Domain layer imports framework/infrastructure code

## Integration

- **Before:** `codebase-mapping` for initial understanding
- **Alongside:** `security-audit`, `performance-audit`, `database-audit`
- **After:** `refactoring-safely` for recommended improvements
- **Triggers:** `writing-plans` for remediation work

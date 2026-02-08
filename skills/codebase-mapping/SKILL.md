---
name: codebase-mapping
description: "Use when first encountering a codebase, onboarding to a project, or needing to understand system structure before auditing or modifying. Creates a mental model of the system before any changes."
---

# Codebase Mapping

## Overview

Before you can improve a system, you must understand it. Codebase mapping creates a comprehensive mental model.

**Core principle:** Observation before action. Understanding before modification.

## The Iron Law

```
NO CHANGES TO A CODEBASE YOU HAVEN'T MAPPED. NO ASSUMPTIONS ABOUT STRUCTURE.
```

## When to Use

- First time encountering a project
- Before any audit skill
- Before major refactoring
- When onboarding to a team
- When the codebase feels "confusing"

## When NOT to Use

- You've already mapped this codebase and it hasn't changed significantly
- Simple bug fix in a file you already understand (use `systematic-debugging`)
- Adding to an area you've recently worked in (context is fresh)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Start modifying code before completing the mapping — understand first, change second
- Assume structure from directory names — read the actual files
- Skip the dependency analysis — hidden dependencies create hidden bugs
- Map only the parts you think are relevant — map the whole system, surprises hide in corners
- Trust the README as ground truth — READMEs age, code doesn't lie
- Skip the data model phase — the data model IS the architecture for most systems
- Stop at the directory tree — trace actual data flows through the code
- Declare mapping complete without tracing at least 2 critical flows end-to-end
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "I just need to fix this one file" | One file connects to other files. Map first. |
| "The README explains everything" | READMEs explain intent. Code reveals reality. |
| "It's a small project, I can figure it out" | Small projects still have hidden complexity. |
| "I've worked with this framework before" | Framework knowledge ≠ project knowledge. |
| "I'll learn as I go" | Learning by breaking things is not mapping. |
| "The tests explain the behavior" | Tests explain expected behavior. Code reveals actual behavior. |

## Iron Questions

```
1. Can I explain what this system does in 2 sentences? (if not, keep mapping)
2. Can I trace a request from entry point to database and back? (if not, trace it)
3. What are the 3 most important files in this codebase? (know the core)
4. Where does authentication happen? (one of the first things to understand)
5. Where does business logic live? (separate from infrastructure?)
6. What are the external dependencies? (APIs, services, databases)
7. What's the test coverage picture? (well-tested, partially tested, untested)
8. Are there any surprises? (unexpected patterns, odd file locations, magic)
```

## The Mapping Process

### Phase 1: Surface Scan (5 minutes)

```
1. READ the README (if it exists)
2. CHECK the directory structure (top-level only)
3. IDENTIFY the language/framework (package.json, requirements.txt, etc.)
4. READ the entry point (main, index, app)
5. NOTE what's obvious and what's surprising
```

**Capture:**

```markdown
## First Impression
- **Language:** [X]
- **Framework:** [X]
- **Build System:** [X]
- **Test Framework:** [X]
- **Entry Point:** [file]
- **Surprises:** [anything unexpected]
```

### Phase 2: Structure Analysis (15 minutes)

```
1. MAP the directory tree (2-3 levels deep)
2. IDENTIFY the architectural pattern (MVC, layered, hexagonal, etc.)
3. CATEGORIZE directories: source / tests / config / docs / scripts / assets
4. COUNT significant files per directory
5. IDENTIFY the "core" — where does business logic live?
```

**Capture:**

```markdown
## Structure Map
```
project/
├── src/           [N files] — Source code
│   ├── api/       [N files] — API endpoints
│   ├── models/    [N files] — Data models
│   ├── services/  [N files] — Business logic
│   └── utils/     [N files] — Utilities
├── tests/         [N files] — Test suite
├── config/        [N files] — Configuration
└── docs/          [N files] — Documentation
```

**Pattern:** [Layered / MVC / Hexagonal / etc.]
**Core:** Business logic in [directory]
```

### Phase 3: Dependency Analysis (10 minutes)

```
1. READ package manifest (dependencies and versions)
2. IDENTIFY key frameworks and libraries
3. COUNT total dependencies (direct + transitive)
4. FLAG outdated or deprecated dependencies
5. UNDERSTAND the tech stack
```

**Dependency categories to identify:**

| Category | Examples | Why It Matters |
|----------|----------|---------------|
| Framework | Express, Django, Rails | Core constraints and patterns |
| Database | Prisma, SQLAlchemy, TypeORM | Data access patterns |
| Auth | Passport, JWT, OAuth libs | Security model |
| Testing | Jest, pytest, RSpec | Test capabilities |
| Build | Webpack, Vite, esbuild | Build pipeline |
| Monitoring | Sentry, Datadog | Observability |

### Phase 4: Data Model (10 minutes)

```
1. FIND schema definitions (migrations, models, types)
2. MAP entities and their relationships
3. IDENTIFY the data flow (where does data come from, where does it go)
4. NOTE the database type and access pattern (ORM, raw SQL, etc.)
```

### Phase 5: Entry Points and Flows (15 minutes)

```
1. IDENTIFY all entry points (HTTP routes, CLI commands, event handlers, cron jobs)
2. TRACE 2-3 critical flows end-to-end:
   - The "happy path" for the main feature
   - The authentication flow
   - An error path
3. MAP the call chain for each flow
```

**Flow tracing template:**

```markdown
### Flow: [Name]
1. Entry: [file:function] — receives [what]
2. Middleware: [file:function] — validates/transforms [what]
3. Handler: [file:function] — processes [what]
4. Service: [file:function] — business logic for [what]
5. Repository: [file:function] — database [operation]
6. Response: [format] — returns [what]
```

### Phase 6: Health Indicators (5 minutes)

```
1. CHECK test coverage (how many tests, what's tested)
2. CHECK last commit dates (active or abandoned?)
3. CHECK issue tracker (known problems?)
4. CHECK CI/CD (automated builds and deploys?)
5. CHECK documentation freshness
6. CHECK code quality tools (linter, formatter, type checker)
```

## Output: The System Map

```markdown
# System Map: [Project Name]

## Overview
[2-3 sentences: what this system does]

## Tech Stack
| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Python | 3.11 |
| Framework | FastAPI | 0.104 |
| Database | PostgreSQL | 15 |
| Cache | Redis | 7.2 |
| Tests | pytest | 7.4 |

## Architecture
**Pattern:** [Identified pattern]
**Module count:** [N]
**Dependency count:** [N direct, N total]

## Structure
[Directory tree with annotations]

## Key Flows
[2-3 traced flows with file references]

## Data Model
[Entity-relationship overview]

## Health
| Indicator | Status |
|-----------|--------|
| Test coverage | ~N% |
| Last commit | [date] |
| CI/CD | Present / Missing |
| Documentation | Current / Outdated / Missing |
| Code quality tools | [Linter / Formatter / None] |

## Red Flags
[Any immediate concerns noted during mapping]

## Next Steps
[Recommended audit skills to apply]
```

## Red Flags During Mapping

- No README or outdated README
- No tests directory
- No CI/CD configuration
- Node_modules or vendor committed
- Secrets in code (grep for `password`, `secret`, `key`, `token`)
- Last commit > 6 months ago
- > 50 direct dependencies
- No type system (in a large project)
- .env files committed to git

## Integration

- **First step before:** `architecture-audit`, `security-audit`, `performance-audit`
- **Informs:** Which audit skills to apply and in what order
- **Enables:** Better planning in `brainstorming` and `writing-plans`

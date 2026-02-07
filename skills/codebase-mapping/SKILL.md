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
\`\`\`
project/
├── src/           [N files] — Source code
│   ├── api/       [N files] — API endpoints
│   ├── models/    [N files] — Data models
│   ├── services/  [N files] — Business logic
│   └── utils/     [N files] — Utilities
├── tests/         [N files] — Test suite
├── config/        [N files] — Configuration
└── docs/          [N files] — Documentation
\`\`\`

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

### Phase 6: Health Indicators (5 minutes)

```
1. CHECK test coverage (how many tests, what's tested)
2. CHECK last commit dates (active or abandoned?)
3. CHECK issue tracker (known problems?)
4. CHECK CI/CD (automated builds and deploys?)
5. CHECK documentation freshness
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
- Secrets in code
- Last commit > 6 months ago
- > 50 direct dependencies

## Integration

- **First step before:** `architecture-audit`, `security-audit`, `performance-audit`
- **Informs:** Which audit skills to apply and in what order
- **Enables:** Better planning in `brainstorming` and `writing-plans`

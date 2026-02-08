---
name: writing-documentation
description: "Use when creating or updating documentation — READMEs, API docs, architecture docs, onboarding guides, or inline code documentation."
---

# Writing Documentation

## Overview

Documentation is code for humans. If humans can't understand your system, it might as well not exist. Bad documentation is worse than no documentation — it actively misleads.

**Core principle:** Write for the reader who has zero context, is in a hurry, and will judge your entire project in 30 seconds.

## The Iron Law

```
NO PUBLIC API WITHOUT DOCUMENTATION. NO COMPLEX LOGIC WITHOUT COMMENTS. NO DOCUMENTATION THAT DOESN'T MATCH THE CODE.
```

## When to Use

- Creating a new project or module
- Adding public APIs or exported functions
- After major architectural changes
- Before onboarding new team members
- When someone asks "how does this work?" (a documentation failure signal)
- When you struggle to explain something (sign it needs better docs)
- Before launching or publishing

## When NOT to Use

- Auto-generated API reference from types (tools like TypeDoc handle this)
- Comments that restate what the code does (`// increment i by 1`)
- Documentation for internal implementation details that change frequently

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "documentation is done" — verify every code example runs, every link works, every setup step succeeds
- Copy-paste code examples without testing them — stale examples are worse than no examples
- Document what you PLAN to build — only document what EXISTS and WORKS
- Write "see code for details" — if the reader needs code, the documentation failed
- Skip the Quick Start — the first 60 seconds determines if anyone reads further
- Leave TODO or "Coming soon" in documentation — remove it or write it now
- Document for yourself — document for someone who joins tomorrow
- Skip testing setup instructions — run them from scratch in a clean environment
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "The code is self-documenting" | Code explains WHAT and HOW. It never explains WHY, trade-offs, or business rules. |
| "Nobody reads documentation" | Nobody reads BAD documentation. Good docs with a Quick Start get read. |
| "We'll document it later" | Later = never. Document as you build. |
| "It's an internal project" | Internal projects have the highest onboarding cost. Your future self is "internal." |
| "The types are the documentation" | Types tell you the shape of data. They don't tell you when to use it, what happens on error, or why this API exists. |
| "Just ask the team" | That person will leave, be on vacation, or be too busy. Docs scale, people don't. |
| "Too many changes to keep docs updated" | Then automate what you can and document stable interfaces, not implementation details. |

## Iron Questions

```
1. Can a new developer get the project running in under 5 minutes following only the README?
2. Does every public function/endpoint have documented: purpose, parameters, return value, errors, and example?
3. Is there an architecture overview that fits on one page?
4. If every team member was unavailable, could someone maintain this project from docs alone?
5. When was each documentation page last verified against the actual code?
6. Are there any broken links, stale screenshots, or wrong version numbers?
7. Does the README answer the three questions every visitor has: What? Why? How?
8. Are error messages documented with solutions (not just descriptions)?
9. Is the documentation searchable and navigable?
10. Would someone starting today be productive in one day?
```

## Documentation Types

### README.md (Every Project — Non-Negotiable)

**Structure (every README MUST have these sections):**

```markdown
# Project Name

One line: what this does and who it's for.

## Quick Start

Three commands or fewer to get running:

```bash
# Install
npm install

# Configure
cp .env.example .env

# Run
npm run dev
```

## Features

- Feature 1: brief description
- Feature 2: brief description

## Architecture

Brief overview of how the system is structured.
Link to detailed architecture doc if complex.

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 15+

### Setup
Step-by-step setup instructions (tested from scratch).

### Testing
How to run tests, what test framework is used.

### Environment Variables
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | — | PostgreSQL connection string |
| API_KEY | Yes | — | External API key |

## Deployment

How to deploy (or link to deployment docs).

## Contributing

Link to CONTRIBUTING.md or brief guidelines.

## License
[License type]
```

**README quality rubric:**

| Criterion | 🔴 Failing | 🟡 Adequate | 🟢 Excellent |
|-----------|-----------|------------|-------------|
| Time to running | > 15 min | 5-15 min | < 5 min |
| Setup steps | "Figure it out" | Steps listed | Steps tested + troubleshooting |
| Architecture | None | Text description | Diagram + component table |
| Examples | None | Basic | Copy-pasteable, tested |
| Env vars | Undocumented | Listed | Listed with types + defaults |

### API Documentation

For each endpoint or public function:

```markdown
### `POST /api/users`

Create a new user account.

**Authentication:** Required (Bearer token)

**Request Body:**
| Field | Type | Required | Validation | Description |
|-------|------|----------|-----------|-------------|
| email | string | Yes | Valid email format | User's email address |
| name | string | Yes | 1-100 characters | Display name |
| role | string | No | "user" or "admin" | Default: "user" |

**Response (201 Created):**
```json
{
  "data": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
| Status | Code | Description | Example |
|--------|------|-------------|---------|
| 400 | VALIDATION_ERROR | Invalid input | Missing required field |
| 401 | UNAUTHORIZED | Missing/invalid token | Expired JWT |
| 409 | DUPLICATE_EMAIL | Email already registered | Existing account |

**Example:**
```bash
curl -X POST https://api.example.com/users \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "name": "Jane Doe"}'
```
```

### Architecture Documentation

```markdown
# Architecture: [System Name]

## Overview
[2-3 sentences: what the system does and how]

## System Diagram
[ASCII diagram, Mermaid, or link to diagram tool]

## Components
| Component | Responsibility | Technology | Owner |
|-----------|---------------|-----------|-------|
| API Gateway | Request routing, auth | Express | Backend team |
| User Service | User management | Node.js | Backend team |
| Database | Data persistence | PostgreSQL | Platform team |

## Data Flow
[Describe how data moves through the system for the primary use case]

## Key Decisions
| Decision | Rationale | Trade-offs | Date |
|----------|-----------|-----------| -----|
| PostgreSQL over MongoDB | Relational data, ACID | Less flexible schema | 2024-01 |
| JWT over sessions | Stateless, scalable | Token revocation complexity | 2024-01 |

## Non-Functional Requirements
| Requirement | Target | Current |
|------------|--------|---------|
| Response time (p95) | < 200ms | 150ms |
| Availability | 99.9% | 99.7% |
| Max concurrent users | 10,000 | 5,000 tested |
```

### Inline Code Documentation

```python
# GOOD: Explains WHY, not WHAT
# Process orders in batches of 100 to stay within the payment
# gateway's rate limit of 120 requests/minute. Sleep between
# batches to avoid 429 errors.
for batch in chunk(orders, 100):
    process(batch)
    sleep(60)

# BAD: States the obvious (delete these comments)
# Loop through orders
for order in orders:
    process(order)

# GOOD: Documents non-obvious behavior
def calculate_tax(amount: Decimal, state: str) -> Decimal:
    """Calculate sales tax for a given US state.

    Note: Oregon (OR) has no sales tax. Delaware (DE) has
    no sales tax but has a gross receipts tax handled separately
    by the GrossReceiptsCalculator.

    Args:
        amount: Pre-tax amount in USD
        state: Two-letter US state code (uppercase)

    Returns:
        Tax amount. Returns Decimal('0') for exempt states.

    Raises:
        ValueError: If state code is not a valid US state.
    """
```

**When to comment vs when not to:**

| Comment | When | Example |
|---------|------|---------|
| WHY comments | Always valuable | "// Rate limit workaround — gateway allows 120 req/min" |
| WHAT comments | Only for complex algorithms | "// Floyd-Warshall shortest path between all pairs" |
| TODO comments | Only if tracked in issue tracker | "// TODO(#423): Add retry logic for transient failures" |
| Disable comments | Never acceptable | "// Don't remove this, it breaks everything" |

## Documentation Quality Rules

| Rule | 🔴 Failing | 🟢 Passing | Detection |
|------|-----------|-----------|-----------|
| Current | Describes last year's version | Matches current code | Compare docs to actual API |
| Complete | "TODO: document this" | Covers all public APIs | Search for undocumented exports |
| Concise | 5 paragraphs of history | Gets to the point | Word count per concept |
| Correct | Pseudocode examples | Verified, runnable examples | Run every example |
| Consistent | Every page different | Follows templates | Visual comparison |
| Discoverable | Buried in wiki | Linked from README | Navigation check |

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| No docs | Nobody can use your code | Write README at minimum |
| Outdated docs | Worse than no docs — actively misleading | Verify quarterly, automate what possible |
| Over-documented | Comments on every line obscure important ones | Comment WHY, not WHAT |
| Self-referential | "This function does what it does" | Describe purpose and behavior |
| Aspirational | Documents what you plan to build | Only document what exists |
| Write-only | Written once, never updated | Schedule review cycles |
| Screenshot-heavy | Screenshots become stale | Prefer text + diagrams over screenshots |

## Output Format

```markdown
# Documentation Audit: [Project Name]

## README Assessment
| Criterion | Status | Assessment |
|-----------|--------|------------|
| Quick Start (< 5 min) | ✅/❌ | |
| Architecture overview | ✅/❌ | |
| Setup instructions (tested) | ✅/❌ | |
| Environment variables | ✅/❌ | |
| Contributing guide | ✅/❌ | |

## API Documentation
| Endpoint | Documented | Examples | Error Codes | Assessment |
|----------|-----------|----------|------------|------------|
| POST /users | ✅ | ✅ | ⚠️ partial | 🟡 |

## Code Comments
| Module | WHY Comments | Stale Comments | Assessment |
|--------|-------------|---------------|------------|
| auth/ | 5 | 0 | 🟢 |
| api/ | 1 | 3 | 🟠 |

## Findings
[Standard severity format]

## Verdict: [PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — STOP and Investigate

- README says "TODO" or "Coming soon"
- Documentation references features that don't exist
- Setup instructions don't actually work (test them!)
- API docs don't match actual API behavior
- No documentation for environment variables
- Comments explain WHAT (obvious) instead of WHY (valuable)
- Broken links in documentation
- No architecture overview for a project with > 5 modules
- Examples that don't compile/run
- Documentation only in one person's head

## Integration

- **After:** `brainstorming` produces a design → document it
- **After:** `executing-plans` completes → update docs
- **Part of:** `code-review` checks documentation quality
- **Enables:** Future `codebase-mapping` by new team members
- **References:** `api-design-audit` for API documentation standards

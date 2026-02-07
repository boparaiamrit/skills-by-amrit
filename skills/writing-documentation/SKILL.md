---
name: writing-documentation
description: "Use when creating or updating documentation — READMEs, API docs, architecture docs, onboarding guides, or inline code documentation."
---

# Writing Documentation

## Overview

Documentation is code for humans. If humans can't understand your system, it might as well not exist.

**Core principle:** Write for the reader who has zero context and is in a hurry.

## The Iron Law

```
NO PUBLIC API WITHOUT DOCUMENTATION. NO COMPLEX LOGIC WITHOUT COMMENTS.
```

## When to Use

- Creating a new project or module
- Adding public APIs
- After major architectural changes
- Before onboarding new team members
- When someone asks "how does this work?"
- When you struggle to explain something (sign it needs better docs)

## Documentation Types

### README.md (Every Project)

```markdown
# Project Name

One line: what this does and who it's for.

## Quick Start

\`\`\`bash
# Install
npm install project-name

# Configure
cp .env.example .env

# Run
npm run dev
\`\`\`

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
Step-by-step setup instructions.

### Testing
How to run tests.

### Contributing
Link to CONTRIBUTING.md

## License
[License type]
```

### API Documentation

For each endpoint or public function:

```markdown
### `POST /api/users`

Create a new user account.

**Authentication:** Required (Bearer token)

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| name | string | Yes | 1-100 characters |
| role | string | No | Default: "user" |

**Response (201):**
\`\`\`json
{
  "data": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "role": "user",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

**Errors:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid input |
| 409 | DUPLICATE_EMAIL | Email already registered |
```

### Architecture Documentation

```markdown
# Architecture: [System Name]

## Overview
[2-3 sentences: what the system does and how]

## System Diagram
[ASCII diagram or link to diagram]

## Components
| Component | Responsibility | Technology |
|-----------|---------------|-----------|
| API Gateway | Request routing, auth | Express |
| User Service | User management | Node.js |
| Database | Data persistence | PostgreSQL |

## Data Flow
[Describe how data moves through the system]

## Key Decisions
| Decision | Rationale | Trade-offs |
|----------|-----------|-----------|
| PostgreSQL over MongoDB | Relational data, ACID | Less flexible schema |

## Deployment
[How the system is deployed and operated]
```

### Inline Code Documentation

```python
# Good: Explains WHY, not WHAT
# Process orders in batches of 100 to stay within the payment
# gateway's rate limit of 120 requests/minute
for batch in chunk(orders, 100):
    process(batch)
    sleep(60)

# Bad: States the obvious
# Loop through orders
for order in orders:
    process(order)

# Good: Documents non-obvious behavior
def calculate_tax(amount: Decimal, state: str) -> Decimal:
    """Calculate sales tax.

    Note: Oregon (OR) has no sales tax. Delaware (DE) has
    no sales tax but has a gross receipts tax handled separately.

    Returns Decimal('0') for exempt states.
    """
```

## Documentation Quality Rules

| Rule | Good | Bad |
|------|------|-----|
| Current | Matches the code | Describes last year's version |
| Complete | Covers all public APIs | "TODO: document this" |
| Concise | Gets to the point | 5 paragraphs of history |
| Correct | Verified examples | Copy-pasted pseudocode |
| Consistent | Follows a template | Every page is different |

## Anti-Patterns

| Anti-Pattern | Problem |
|-------------|---------|
| No docs | Nobody can use your code |
| Outdated docs | Worse than no docs — actively misleading |
| Over-documented | Comments on every line obscure important ones |
| Self-referential | "This function does what it does" |
| Aspirational | Documents what you plan to build, not what exists |

## Red Flags

- README says "TODO" or "Coming soon"
- Documentation references features that don't exist
- Setup instructions don't actually work
- API docs don't match actual API behavior
- No documentation for configuration options
- Comments explain WHAT (obvious) instead of WHY (valuable)

## Integration

- **After:** `brainstorming` produces a design → document it
- **After:** `executing-plans` completes → update docs
- **Part of:** `code-review` checks documentation quality
- **Enables:** Future `codebase-mapping` by new team members

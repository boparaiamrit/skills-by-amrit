---
name: database-audit
description: "Use when auditing database schema, migrations, data integrity, query patterns, or when asked about database architecture. Covers schema design, indexing, migrations, constraints, and data consistency."
---

# Database Audit

## Overview

The database is the foundation. If the schema is wrong, everything built on top is fragile.

**Core principle:** Schema should enforce business rules. Don't trust application code to maintain data integrity.

## The Iron Law

```
NO NULLABLE COLUMN WITHOUT DOCUMENTED REASON. NO MISSING INDEX ON FOREIGN KEYS.
```

## When to Use

- Auditing database architecture
- Reviewing migration files
- Investigating data inconsistency
- Before schema changes
- Performance investigation (query-related)
- During any codebase audit

## The Audit Process

### Phase 1: Schema Analysis

```
1. READ all migration files OR inspect actual schema
2. MAP all tables, columns, types, and constraints
3. IDENTIFY relationships (1:1, 1:N, M:N)
4. CHECK for orphaned tables (not referenced by any code)
```

**For each table, verify:**

| Check | Question |
|-------|----------|
| Primary key | Does it exist? Is it appropriate (auto-increment, UUID, composite)? |
| Column types | Are they appropriate? (VARCHAR(255) for emails? DECIMAL for money?) |
| Nullable columns | Is NULL semantically meaningful or just lazy? |
| Default values | Do they make business sense? |
| Constraints | CHECK, UNIQUE, NOT NULL — are business rules enforced? |
| Timestamps | created_at, updated_at present where needed? |
| Soft deletes | If used, is deleted_at indexed? |

### Phase 2: Relationship Integrity

```
1. EVERY foreign key MUST have a database-level FK constraint
2. EVERY FK column MUST have an index
3. CHECK cascade behavior (ON DELETE, ON UPDATE)
4. CHECK for orphan records (FK without matching parent)
```

**Cascade rules:**

| Relationship | ON DELETE | Reason |
|-------------|-----------|--------|
| Order → User | RESTRICT | Don't delete users with orders |
| OrderItem → Order | CASCADE | Deleting order removes items |
| Comment → User | SET NULL | Keep comments, lose attribution |
| Session → User | CASCADE | User deletion clears sessions |

### Phase 3: Index Analysis

```
1. EVERY foreign key column — indexed? (mandatory)
2. Frequent WHERE clause columns — indexed?
3. Frequent ORDER BY columns — indexed?
4. Composite queries — composite index in correct order?
5. Unused indexes — consuming write performance?
```

**Index ordering rule for composite indexes:**
```
Most selective column FIRST
= conditions before RANGE conditions
```

### Phase 4: Migration Quality

```
1. EVERY migration has a rollback (down/revert)
2. Migrations are idempotent (safe to run twice)
3. Data migrations separate from schema migrations
4. No destructive changes without backup strategy
5. Migration naming follows convention (timestamp + description)
```

**Migration anti-patterns:**

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| No rollback | Can't undo deployment | Always write `down()` |
| Mixing schema + data | Can't partially roll back | Separate migrations |
| Column rename without alias | Breaks running code | Add new → migrate → drop old |
| Dropping column without backup | Data loss | Backup first, soft-delete, then hard-delete |

### Phase 5: Data Type Accuracy

| Data Type | Correct Usage | Common Mistakes |
|-----------|--------------|-----------------|
| Money/Currency | `DECIMAL(19,4)` | `FLOAT` (rounding errors), `INT` cents |
| Email | `VARCHAR(254)` | `VARCHAR(50)` (too short), `TEXT` (too loose) |
| UUID | `UUID` native type | `VARCHAR(36)` (slower, larger) |
| Boolean | `BOOLEAN` | `TINYINT` without CHECK, `VARCHAR` |
| IP Address | `INET` (Postgres) | `VARCHAR(15)` (misses IPv6) |
| JSON | `JSONB` (Postgres) | `TEXT` (no validation, no queries) |
| Coordinates | `POINT`/`GEOGRAPHY` | Two `FLOAT` columns |
| Status/Enum | `VARCHAR` + CHECK | Magic integers |

### Phase 6: Consistency Between Code and Schema

```
1. DO models match migrations? (same columns, same types)
2. ARE there columns in the DB not in any model?
3. ARE there model properties not in the DB?
4. DO relationships in code match FK constraints in DB?
5. ARE there tables with no corresponding model?
```

## Output Format

```markdown
# Database Audit: [Project Name]

## Schema Overview
- **Tables:** N
- **Total Columns:** N
- **Foreign Keys:** N (with constraints: N)
- **Indexes:** N

## Findings by Severity
[Standard severity format]

## Missing Indexes
| Table | Column | Query Pattern |
|-------|--------|--------------|
| orders | user_id | Frequent WHERE/JOIN |

## Schema Recommendations
[Specific DDL statements]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — Escalate

- No foreign key constraints
- Money stored as FLOAT
- No indexes on FK columns
- Tables with > 50 columns (normalization issue)
- No migrations (schema managed manually)
- Migrations without rollbacks

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `performance-audit` for query optimization
- **Follow-up:** `refactoring-safely` for schema changes

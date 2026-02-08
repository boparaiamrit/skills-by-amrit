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

## When NOT to Use

- Application-level performance only (use `performance-audit`)
- API design concerns (use `api-design-audit`)
- Code-level architecture (use `architecture-audit`)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Audit schema from ORM models alone — check the ACTUAL database schema or migration files
- Say "indexes are fine" without checking query patterns — indexes serve queries, not tables
- Skip nullable column analysis — every NULL column is a potential bug waiting to happen
- Accept missing FK constraints because "the app handles it" — apps crash, constraints don't
- Ignore migration rollback plans — every migration needs a reverse
- Trust column names match their purpose — verify types and constraints match semantics
- Skip data integrity checks — orphaned records, duplicates, and invalid states exist silently
- Assess schema health without understanding the query patterns — schema exists to serve queries
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "The ORM handles foreign keys" | ORMs create references, databases enforce them. Check for DB-level constraints. |
| "We don't need indexes yet, it's fast enough" | It's fast with 100 rows. Production has millions. |
| "Nullable is easier, we'll fix it later" | NULL propagates through joins and aggregations, causing subtle bugs. |
| "Money as FLOAT works fine for us" | Until you have rounding errors in financial reports. |
| "We don't use migrations, we change the schema directly" | Direct changes = no rollback, no history, no reproducibility. |
| "VARCHAR(255) is fine for everything" | It's a red flag that types weren't considered. |

## Iron Questions

```
1. Does every foreign key column have a database-level FK constraint? (not just ORM)
2. Does every foreign key column have an index?
3. Is every nullable column intentionally nullable? (documented reason?)
4. Is DECIMAL/NUMERIC used for all monetary values? (never FLOAT)
5. Does every table have timestamps (created_at, updated_at)?
6. Does every migration have a reversible rollback?
7. Are composite indexes in the correct order? (most selective first)
8. Are there tables with > 30 columns? (normalization issue)
9. Are there orphaned records? (FK data without parent)
10. Does the schema match the ORM models exactly?
```

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

**Cascade decision tree:**

| Question | If Yes | If No |
|----------|--------|-------|
| Should child records survive parent deletion? | SET NULL or RESTRICT | CASCADE |
| Is the child meaningless without the parent? | CASCADE | RESTRICT or SET NULL |
| Would deleting the parent cause data loss? | RESTRICT | CASCADE or SET NULL |
| Is the FK column nullable? | SET NULL is an option | CASCADE or RESTRICT |

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

Example:
WHERE status = 'active' AND created_at > '2024-01-01'
→ INDEX (status, created_at) ✅
→ INDEX (created_at, status) ❌ (range before equality)
```

**Index analysis checklist:**

| Column Usage | Needs Index? | Notes |
|-------------|-------------|-------|
| Foreign key | ✅ Always | Required for JOIN performance |
| WHERE clause (frequent) | ✅ Yes | Check query logs for frequency |
| JOIN condition | ✅ Yes | Both sides of the join |
| ORDER BY (on large tables) | ✅ Usually | Prevents filesort |
| GROUP BY | ✅ Usually | Can improve aggregation |
| SELECT only | ❌ No | Unless using covering index |
| Boolean with low cardinality | ❌ Usually not | Unless combined in composite |

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
| Adding NOT NULL without default | Breaks existing rows | Add nullable → backfill → add constraint |
| Large table ALTER in production | Locks table, causes downtime | Use pt-online-schema-change or equivalent |

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
| Phone | `VARCHAR(20)` | `INTEGER` (leading zeros), `VARCHAR(10)` (international) |
| URL | `TEXT` with CHECK | `VARCHAR(255)` (too short for real URLs) |

### Phase 6: Consistency Between Code and Schema

```
1. DO models match migrations? (same columns, same types)
2. ARE there columns in the DB not in any model?
3. ARE there model properties not in the DB?
4. DO relationships in code match FK constraints in DB?
5. ARE there tables with no corresponding model?
6. DO enums/check constraints match application-level validation?
```

## Output Format

```markdown
# Database Audit: [Project Name]

## Schema Overview
- **Tables:** N
- **Total Columns:** N
- **Foreign Keys:** N (with DB constraints: N)
- **Indexes:** N
- **Nullable Columns:** N (justified: N, unjustified: N)

## Findings by Severity

### 🔴 Critical
[Findings with evidence and DDL fix]

### 🟠 High
[...]

### 🟡 Medium
[...]

### 🟢 Low
[...]

## Missing Indexes
| Table | Column | Query Pattern | DDL |
|-------|--------|--------------|-----|
| orders | user_id | Frequent WHERE/JOIN | CREATE INDEX idx_orders_user_id ON orders(user_id); |

## Schema Recommendations
[Specific DDL statements for each fix]

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
- Orphaned records in production
- Schema/model mismatch

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `performance-audit` for query optimization
- **Follow-up:** `refactoring-safely` for schema changes
- **Pair with:** `security-audit` for data exposure concerns

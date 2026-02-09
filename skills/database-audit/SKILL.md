---
name: database-audit
description: "Use when auditing database schema, migrations, data integrity, query patterns, or when asked about database architecture. Covers schema design, indexing strategy (including high-volume tables), migrations, constraints, query optimization, and data consistency. Especially critical for tables with text-heavy columns, large datasets (logs, activity, notifications), and missing indexes."
---

# Database Audit

## Overview

The database is the foundation. If the schema is wrong, everything built on top is fragile.

**Core principle:** Schema should enforce business rules. Don't trust application code to maintain data integrity.

## The Iron Laws

```
1. NO NULLABLE COLUMN WITHOUT DOCUMENTED REASON. NO MISSING INDEX ON FOREIGN KEYS.
2. EVERY QUERY THAT TOUCHES PRODUCTION MUST HIT AN INDEX — NEVER A FULL TABLE SCAN ON LARGE TABLES.
3. TEXT-HEAVY TABLES THAT GROW UNBOUNDED (logs, activity, notifications) MUST HAVE RETENTION, PARTITIONING, OR ARCHIVAL STRATEGY.
```

## When to Use

- Auditing database architecture
- Reviewing migration files
- Investigating data inconsistency
- Before schema changes
- Performance investigation (query-related)
- During any codebase audit
- **When tables have many text columns** (logs, activity feeds, notifications)
- **When tables are expected to grow unbounded** (audit trails, event stores)
- **When query performance degrades over time** (missing index symptoms)

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
- Ignore large-table strategy — any table that grows unbounded WILL become a bottleneck
- Skip EXPLAIN/ANALYZE on critical queries — "it works" does not mean "it performs"
- Assume TEXT columns don't need indexing — if you query them, you index them
- Accept "we'll add indexes later" — by the time you notice, production is already slow
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
| "The log table doesn't need indexes" | It does when you query it. And you WILL query it. |
| "We'll archive old data when it gets big" | Define "big". Set the threshold NOW, automate it NOW. |
| "Full-text search is overkill" | TEXT columns without search indexes cause LIKE '%query%' full scans. |
| "We only read recent rows" | Without a time-based index, "recent" still scans the whole table. |
| "Notifications don't need optimization" | Users have thousands. Unread counts on every page load. Do the math. |

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
11. Does EVERY query path hit an index? (run EXPLAIN on the top 20 queries)
12. Are high-volume tables (logs, activity, notifications) partitioned or have retention policies?
13. Are TEXT/JSONB columns that are queried/filtered indexed appropriately?
14. Does unread_count / badge_count hit an index or does it full-scan?
15. Are there queries doing LIKE '%text%' on unindexed TEXT columns?
```

## The Audit Process

### Phase 1: Schema Analysis

```
1. READ all migration files OR inspect actual schema
2. MAP all tables, columns, types, and constraints
3. IDENTIFY relationships (1:1, 1:N, M:N)
4. CHECK for orphaned tables (not referenced by any code)
5. CLASSIFY tables by growth pattern:
   - Static (config, settings) — rarely changes
   - Transactional (orders, trades) — grows with business
   - Unbounded (logs, activity, notifications) — ⚠️ grows forever
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
| Growth pattern | Static, transactional, or unbounded? |
| Retention | If unbounded, what's the archival/purge strategy? |

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
| Notification → User | CASCADE | User deletion clears notifications |
| ActivityLog → User | SET NULL | Keep audit trail, lose attribution |

**Cascade decision tree:**

| Question | If Yes | If No |
|----------|--------|-------|
| Should child records survive parent deletion? | SET NULL or RESTRICT | CASCADE |
| Is the child meaningless without the parent? | CASCADE | RESTRICT or SET NULL |
| Would deleting the parent cause data loss? | RESTRICT | CASCADE or SET NULL |
| Is the FK column nullable? | SET NULL is an option | CASCADE or RESTRICT |
| Is it an audit/compliance table? | SET NULL (preserve record) | CASCADE or RESTRICT |

### Phase 3: Index Analysis — Core

```
1. EVERY foreign key column — indexed? (mandatory)
2. Frequent WHERE clause columns — indexed?
3. Frequent ORDER BY columns — indexed?
4. Composite queries — composite index in correct order?
5. Unused indexes — consuming write performance?
6. Missing covering indexes — queries reading table unnecessarily?
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
| Soft-delete (deleted_at) | ✅ Yes | Partial index WHERE deleted_at IS NULL |

### Phase 4: Index Analysis — High-Volume Tables (CRITICAL)

This phase is **mandatory** for any table that grows unbounded: logs, activity feeds, notifications, audit trails, event stores, analytics, sessions, messages.

#### 4.1 Identify High-Volume Tables

```
HIGH-VOLUME INDICATORS:
- Table name contains: log, activity, event, notification, audit, session, message, analytics, metric, tracking
- Table has a timestamp column used for ordering/filtering
- Table has a user_id/entity_id FK for per-user queries
- Table grows by 100+ rows/day per user
- Table has no DELETE or PURGE mechanism
- Table has TEXT/JSONB columns storing variable-length data
```

#### 4.2 Common Query Patterns on High-Volume Tables

Every high-volume table is queried in predictable patterns. **Each pattern MUST hit an index:**

| Query Pattern | Example | Required Index | Priority |
|--------------|---------|----------------|----------|
| Recent by user | `WHERE user_id = ? ORDER BY created_at DESC LIMIT 20` | `(user_id, created_at DESC)` | 🔴 Critical |
| Unread count | `WHERE user_id = ? AND read = false` | `(user_id, read) WHERE read = false` | 🔴 Critical |
| Unread items | `WHERE user_id = ? AND read_at IS NULL ORDER BY created_at DESC` | `(user_id, read_at, created_at DESC)` | 🔴 Critical |
| Filter by type | `WHERE user_id = ? AND type = ? ORDER BY created_at DESC` | `(user_id, type, created_at DESC)` | 🟠 High |
| Date range | `WHERE user_id = ? AND created_at BETWEEN ? AND ?` | `(user_id, created_at)` | 🟠 High |
| Global recent | `ORDER BY created_at DESC LIMIT 50` | `(created_at DESC)` | 🟡 Medium |
| Search by content | `WHERE body ILIKE '%search%'` | Full-text index (GIN/tsvector) | 🟠 High |
| Aggregate count | `SELECT COUNT(*) WHERE user_id = ? AND type = ?` | `(user_id, type)` | 🟡 Medium |
| Batch mark-read | `UPDATE WHERE user_id = ? AND read = false` | `(user_id, read)` | 🟠 High |
| Cleanup old | `DELETE WHERE created_at < ? AND read = true` | `(created_at) WHERE read = true` | 🟡 Medium |

#### 4.3 The Notification/Activity Table Audit

This is the archetype of a table that silently kills performance. Run this checklist:

```
NOTIFICATION TABLE DEEP DIVE:

□ user_id column has FK constraint AND index?
□ created_at has index? (for ordering)
□ Composite index (user_id, created_at DESC) exists?
  → This is the MOST CRITICAL index — serves "show my notifications" query
□ read/read_at status indexed?
  → Partial index: WHERE read_at IS NULL (for unread count)
□ type/category column indexed?
  → Composite: (user_id, type, created_at DESC) for filtered views
□ TEXT columns (title, body, description):
  → If queried with LIKE: needs full-text index
  → If only displayed: no index needed, but watch column size
  → If filtered: GIN index on tsvector column
□ JSONB/JSON data columns:
  → If queried by key: GIN index on specific paths
  → If only stored: no index, but consider extracting query fields
□ action_url / link columns:
  → Rarely indexed (good) — only display, never queried
□ Row count estimate: how many rows per user per year?
  → < 1,000: manageable without special strategy
  → 1,000-100,000: needs good indexes + pagination
  → > 100,000: needs partitioning or archival
□ Retention policy exists?
  → Auto-delete after N days?
  → Archive to cold storage?
  → Soft-delete with cleanup job?
```

#### 4.4 Text Column Indexing Strategy

Tables with many TEXT columns are performance traps. Audit each TEXT column:

| TEXT Column Purpose | Index Strategy | DDL Example |
|--------------------|---------------|-------------|
| Displayed only (title, body) | ❌ No index | — |
| Filtered with `=` | B-tree on hash | `CREATE INDEX ON t USING hash (column);` |
| Filtered with `LIKE 'prefix%'` | B-tree with text_pattern_ops | `CREATE INDEX ON t (column text_pattern_ops);` |
| Searched with `LIKE '%term%'` | GIN trigram | `CREATE EXTENSION pg_trgm; CREATE INDEX ON t USING gin (column gin_trgm_ops);` |
| Full-text searched | GIN tsvector | `CREATE INDEX ON t USING gin (to_tsvector('english', column));` |
| JSON queried by key | GIN jsonb_path_ops | `CREATE INDEX ON t USING gin (column jsonb_path_ops);` |
| Used in WHERE + ORDER | Composite B-tree | `CREATE INDEX ON t (status, column);` |

**The cardinal sin:**
```sql
-- 🔴 NEVER do this on a large table without an index:
SELECT * FROM notifications WHERE body LIKE '%payment%';
-- This is a FULL TABLE SCAN. On 10M rows, this takes seconds.

-- ✅ Instead, add a trigram index:
CREATE INDEX idx_notifications_body_trgm ON notifications USING gin (body gin_trgm_ops);
-- Now the same query uses the index: milliseconds.
```

#### 4.5 Partial Indexes (Postgres)

Partial indexes are **essential** for high-volume tables. They index ONLY the rows that matter:

```sql
-- Instead of indexing ALL notifications:
CREATE INDEX idx_notif_user_read ON notifications (user_id, read);
-- This indexes millions of read=true rows you'll never query

-- ✅ Use a partial index — only index unread:
CREATE INDEX idx_notif_unread ON notifications (user_id, created_at DESC)
WHERE read_at IS NULL;
-- 95% smaller. 10x faster for the query that matters.

-- More examples:
-- Active sessions only
CREATE INDEX idx_active_sessions ON sessions (user_id, created_at)
WHERE expired_at IS NULL;

-- Pending items only
CREATE INDEX idx_pending_orders ON orders (user_id, created_at)
WHERE status = 'pending';

-- Non-deleted records
CREATE INDEX idx_active_users ON users (email)
WHERE deleted_at IS NULL;
```

#### 4.6 Table Partitioning Strategy

For tables exceeding 10M rows, partitioning is not optional:

```sql
-- Time-based partitioning (most common for logs/activity)
CREATE TABLE activity_log (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE activity_log_2024_01 PARTITION OF activity_log
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE activity_log_2024_02 PARTITION OF activity_log
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automate with pg_partman extension
```

| Partitioning Strategy | When to Use | Example Tables |
|----------------------|-------------|----------------|
| Range (time) | Time-series data, logs | activity_log, audit_trail, metrics |
| List (category) | Categorical data, tenants | notifications (by type), orders (by region) |
| Hash (distribution) | Even distribution needed | sessions, cache entries |

#### 4.7 High-Volume Table Health Score

Score each high-volume table:

| Criteria | Points | Check |
|----------|--------|-------|
| Primary query has index | +3 | `EXPLAIN` shows Index Scan |
| Unread/status query has partial index | +2 | Partial index on status condition |
| TEXT columns queried → has search index | +2 | GIN/tsvector index exists |
| Retention policy defined | +2 | Auto-cleanup or archival documented |
| Row count manageable (< 10M) OR partitioned | +1 | Check table size |
| **Total** | **/10** | ≥ 7 = healthy, 4-6 = at risk, < 4 = 🔴 critical |

### Phase 5: Migration Quality

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
| Adding index on huge table without CONCURRENTLY | Locks writes | `CREATE INDEX CONCURRENTLY` |

### Phase 6: Data Type Accuracy

| Data Type | Correct Usage | Common Mistakes |
|-----------|--------------|-----------------
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
| Log message | `TEXT` | `VARCHAR(255)` (truncates data) |
| Notification body | `TEXT` | `VARCHAR` with arbitrary limit |
| Search content | `TSVECTOR` + `TEXT` source | Raw `TEXT` without search index |

### Phase 7: Query Pattern Analysis

```
1. IDENTIFY the top 20 most frequent queries (from app code, not gut feeling)
2. RUN EXPLAIN ANALYZE on each
3. VERIFY each hits an index (Index Scan, not Seq Scan)
4. CHECK for N+1 query patterns in ORM code
5. CHECK for queries that fetch all columns when only a few are needed
6. CHECK for pagination using OFFSET on large tables (use cursor instead)
```

**Query Anti-Patterns on High-Volume Tables:**

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| `SELECT COUNT(*) FROM large_table` | Full table scan | Maintain counter cache or use estimate |
| `ORDER BY created_at OFFSET 10000` | Scans and discards 10,000 rows | Cursor-based pagination with `WHERE id > last_id` |
| `SELECT * FROM notifications WHERE user_id = ?` (no LIMIT) | Returns ALL rows for user | Always `LIMIT` + pagination |
| `WHERE body LIKE '%search%'` on unindexed TEXT | Full table scan | Add trigram or full-text index |
| `WHERE DATE(created_at) = '2024-01-01'` | Function prevents index use | `WHERE created_at >= '2024-01-01' AND created_at < '2024-01-02'` |
| `WHERE LOWER(email) = 'user@example.com'` | Function prevents index use | Expression index: `CREATE INDEX ON t (LOWER(email))` |
| `IN (SELECT ...)` on large subquery | Materializes entire subquery | Use `EXISTS` or `JOIN` instead |
| Multiple sequential queries in loop | N+1 problem | Batch query with `WHERE id IN (...)` |

### Phase 8: Consistency Between Code and Schema

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
- **Tables:** N (static: N, transactional: N, unbounded: N)
- **Total Columns:** N (text-heavy: N)
- **Foreign Keys:** N (with DB constraints: N, missing: N)
- **Indexes:** N (missing critical: N, unused: N)
- **Nullable Columns:** N (justified: N, unjustified: N)

## High-Volume Table Assessment
| Table | Rows (est.) | Growth Rate | Has Indexes | Has Retention | Health Score |
|-------|------------|-------------|-------------|---------------|-------------|
| notifications | 2.3M | 50K/month | ⚠️ Partial | ❌ None | 4/10 |
| activity_log | 8.1M | 200K/month | ❌ Missing | ❌ None | 2/10 |

## Findings by Severity

### 🔴 Critical
[Findings with evidence, EXPLAIN output, and DDL fix]

### 🟠 High
[...]

### 🟡 Medium
[...]

### 🟢 Low
[...]

## Missing Indexes
| Table | Column(s) | Query Pattern | DDL | Priority |
|-------|-----------|--------------|-----|----------|
| notifications | (user_id, created_at DESC) | User's recent | `CREATE INDEX ...` | 🔴 Critical |
| notifications | (user_id) WHERE read_at IS NULL | Unread count | `CREATE INDEX ...` | 🔴 Critical |
| activity_log | (user_id, created_at DESC) | User activity | `CREATE INDEX ...` | 🔴 Critical |

## Unused Indexes
| Table | Index Name | Size | Last Used | Recommendation |
|-------|-----------|------|-----------|----------------|

## High-Volume Table Recommendations
| Table | Issue | Recommendation | Effort |
|-------|-------|---------------|--------|
| notifications | No partial index for unread | Add partial index WHERE read_at IS NULL | S |
| activity_log | 8M+ rows, no partitioning | Partition by month on created_at | L |
| logs | No retention | Add cleanup job for rows > 90 days | M |

## Schema Recommendations
[Specific DDL statements for each fix]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — Escalate Immediately

- No foreign key constraints at database level
- Money stored as FLOAT
- No indexes on FK columns
- Tables with > 50 columns (normalization issue)
- No migrations (schema managed manually)
- Migrations without rollbacks
- Orphaned records in production
- Schema/model mismatch
- **High-volume table (logs, activity, notifications) with no indexes on user_id + created_at**
- **TEXT columns queried with LIKE without search index**
- **Tables with > 1M rows and no partitioning or retention strategy**
- **Counting queries (unread badges) doing full table scans**
- **Pagination using OFFSET on tables with > 100K rows**
- **No partial indexes on status/boolean columns in high-volume tables**

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Complements:** `performance-audit` for query optimization
- **Follow-up:** `refactoring-safely` for schema changes
- **Pair with:** `security-audit` for data exposure concerns
- **Combine with:** `ui-ux-redesign` when slow queries cause poor UX
- **Triggers:** `observability-audit` if no query monitoring exists

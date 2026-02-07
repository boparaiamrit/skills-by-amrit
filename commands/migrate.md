---
name: migrate
description: "Plan and execute database or code migrations with rollback safety."
disable-model-invocation: true
argument-hint: "[migration-description]"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
---

# /migrate — Migration Planning & Execution

Plan and execute database schema migrations or major code migrations with safety checks and rollback strategies.

## Instructions

### Step 1: Determine Migration Type

From `$ARGUMENTS`:
- **Database migration** — Schema changes (tables, columns, indexes, constraints)
- **Code migration** — Moving/renaming modules, updating patterns, API versioning
- **Data migration** — Transforming existing data (backfills, format changes)
- **Infrastructure migration** — Moving between services, upgrading runtimes

### Step 2: Impact Analysis

```bash
# For database migrations — check current schema
# (Adapt to your ORM/migration tool)
npx prisma db pull 2>/dev/null
npx drizzle-kit introspect 2>/dev/null
cat schema.prisma 2>/dev/null | head -100

# For code migrations — find all affected files
grep -rn "[pattern-to-migrate]" --include="*.ts" --include="*.js" . | grep -v node_modules | wc -l

# Check what depends on the thing being migrated
grep -rn "import.*[module-name]" --include="*.ts" --include="*.js" . | grep -v node_modules
```

### Step 3: Create Migration Plan

```markdown
## Migration Plan: [Title]

### What's Changing
[Specific description of the migration]

### Pre-Migration Checklist
- [ ] Database backup exists
- [ ] All tests pass before migration
- [ ] Migration script tested on staging/dev
- [ ] Rollback script prepared and tested
- [ ] Downtime window communicated (if applicable)

### Migration Steps
1. [Step 1 — specific action]
2. [Step 2 — specific action]
3. [Step 3 — specific action]

### Rollback Steps (If Migration Fails)
1. [Rollback step 1]
2. [Rollback step 2]
3. [Rollback step 3]

### Affected Components
| Component | Impact | Risk |
|-----------|--------|------|
| [component] | [what changes] | Low/Med/High |

### Data Implications
- Rows affected: [estimate]
- Expected duration: [time]
- Data loss risk: None / Reversible / Irreversible
```

### Step 4: Generate Migration Files

For database migrations, create the migration files using the project's migration tool:

```bash
# Prisma
npx prisma migrate dev --name [migration-name]

# Drizzle
npx drizzle-kit generate:pg --name [migration-name]

# Raw SQL
mkdir -p migrations
cat > migrations/[timestamp]-[name].sql << 'SQL'
-- Migration: [description]
-- Up
[SQL statements]

-- Down (rollback)
[Reverse SQL statements]
SQL
```

### Step 5: Test Migration

```bash
# Run migration on dev/test database
[migration command] 2>&1

# Verify post-migration state
[verification queries]

# Run full test suite
npm test 2>&1
```

### Step 6: Execute or Instruct

For safe migrations (adding columns, adding tables):
- Execute the migration directly

For dangerous migrations (dropping columns, changing types, data transforms):
- Present the plan to the user
- Require explicit confirmation
- Document the rollback procedure
- Suggest running on staging first

### Step 7: Post-Migration Verification

```bash
# Verify the migration applied correctly
[schema check command]

# Run integration tests
npm test 2>&1

# Check for data integrity
[data validation queries]
```

Update `.planning/STATE.md` with migration results.

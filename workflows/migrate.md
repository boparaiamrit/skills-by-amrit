---
description: Plan and execute database or code migrations with rollback safety
---

## Steps

1. Determine migration type from user description:
   - **Database** — Schema changes (tables, columns, indexes)
   - **Code** — Moving/renaming modules, API versioning
   - **Data** — Backfills, format transformations
   - **Infrastructure** — Service moves, runtime upgrades

2. Analyze impact:
// turbo
```
cat package.json 2>/dev/null | grep -E "prisma|drizzle|sequelize|typeorm|knex|mongoose"; echo "---"; ls prisma/ drizzle/ migrations/ 2>/dev/null; echo "---"; grep -rn "import.*from" --include="*.ts" --include="*.js" . | grep -v node_modules | head -30
```

3. For database migrations, check current schema:
// turbo
```
npx prisma db pull 2>/dev/null; cat prisma/schema.prisma 2>/dev/null | head -100; cat drizzle/*.ts 2>/dev/null | head -100
```

4. Create migration plan with:
   - What's changing (specific description)
   - Pre-migration checklist (backup, tests pass, rollback ready)
   - Migration steps (numbered, specific)
   - Rollback steps (if migration fails)
   - Affected components table (component, impact, risk)
   - Data implications (rows affected, estimated duration, data loss risk)

5. Generate migration files using the project's migration tool.

6. Test the migration:
// turbo
```
npm test 2>&1 | tail -15
```

7. For safe migrations (adding), execute directly. For dangerous migrations (dropping, modifying), present plan and require user confirmation.

8. Post-migration verification:
// turbo
```
npm run build 2>&1 | tail -10; echo "==="; npm test 2>&1 | tail -15
```

9. Update `.planning/STATE.md` with migration results.

# Acme API — FastAPI + SQLAlchemy + Alembic + PostgreSQL

> REST API powering the Acme platform. Async-first, type-safe, with automatic OpenAPI docs.

## Skills Integration

This project uses [skills-by-amrit](https://github.com/amrit/skills-by-amrit). Skills are installed in `.claude/skills/` and activate automatically.

**Required workflows:**
- Run `/audit` before every PR — catches missing auth, N+1 queries, unvalidated input
- Run `/plan` before any endpoint spanning multiple services or touching the DB schema
- Run `/verify` after implementing any plan — confirms every acceptance criterion
- Run `/debug` for any failing test — hypothesis-driven, not random print statements
- Run `/deep-audit` on `app/api/` and `app/models/` before any release
- Use `/discuss` before designing any new domain model — lock schema decisions early

## Critical Rules

### Database — Violations Are Blockers

1. **Never write raw SQL in application code.** All queries go through SQLAlchemy ORM or `text()` with bound parameters. No f-string SQL. Ever.
2. **Never skip migrations.** Every schema change MUST have an Alembic migration. No `metadata.create_all()` in production paths.
3. **Never modify a deployed migration.** Create a new migration to alter or rollback. Editing history breaks every other developer's database.
4. **Always use transactions for multi-step writes.** If a handler does 2+ writes, wrap them in `async with session.begin():`.

### Validation & Security

5. **Pydantic models validate all input.** Every route parameter, query param, and request body MUST use a Pydantic schema. No `dict` or `Any` in endpoint signatures.
6. **Never return ORM models directly.** Always map through a response schema to avoid leaking internal fields (`password_hash`, `deleted_at`, internal IDs).
7. **All endpoints require auth unless explicitly marked public.** Use `Depends(get_current_user)` — never skip it "for now."

## BAD vs GOOD

```python
# BAD: Raw SQL with string interpolation — SQL injection
@router.get("/users")
async def list_users(role: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(f"SELECT * FROM users WHERE role = '{role}'")
    return result.fetchall()

# GOOD: ORM query with Pydantic response — safe, typed, documented
@router.get("/users", response_model=list[UserOut])
async def list_users(
    role: UserRole,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    stmt = select(User).where(User.role == role)
    result = await db.execute(stmt)
    return result.scalars().all()
```

```python
# BAD: Returning the ORM model — leaks password_hash, internal fields
@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

# GOOD: Explicit response schema — only exposes intended fields
@router.get("/me", response_model=UserProfile)
async def get_profile(current_user: User = Depends(get_current_user)):
    return UserProfile.model_validate(current_user)
```

## Project Structure

```
app/
  api/
    v1/
      endpoints/      # Route handlers grouped by domain
      dependencies.py # Shared FastAPI dependencies (auth, db, pagination)
    router.py         # Top-level router aggregating all v1 endpoints
  models/             # SQLAlchemy ORM models (one file per domain)
  schemas/            # Pydantic request/response schemas
  services/           # Business logic (not in route handlers)
  core/
    config.py         # Pydantic Settings — reads env vars
    security.py       # JWT creation, password hashing
    database.py       # Engine, session factory, Base
migrations/
  versions/           # Alembic migration scripts
  env.py              # Alembic environment config
tests/
  conftest.py         # Fixtures: test DB, client, auth headers
  api/                # Endpoint tests (mirror app/api/ structure)
  services/           # Unit tests for business logic
```

## Testing

- **Runner:** pytest with anyio — `pytest -x --tb=short`
- **HTTP client:** httpx `AsyncClient` with `app=app` for zero-network tests
- **Database:** Testcontainers spins up a real PostgreSQL per session — no SQLite hacks
- **Coverage:** `pytest --cov=app --cov-fail-under=85`
- Use `/verify` after test runs to confirm all plan criteria are met

## Environment Variables

```bash
# .env — NEVER commit this file
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/acme
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=             # DANGER: used for JWT signing
CORS_ORIGINS=["http://localhost:3000"]
SENTRY_DSN=             # Optional: error tracking
```

## Conventions

- **Commits:** Conventional commits — `feat:`, `fix:`, `refactor:`. Use `/commit` to generate.
- **Branches:** `feat/`, `fix/`, `chore/` prefixes from `main`.
- **PRs:** Must pass CI (lint + type-check + test + migration check). Run `/audit` locally first.
- **Linting:** `ruff check . && ruff format --check . && mypy app/`
- **New endpoints:** Always add to the router, write tests, update OpenAPI tags.
- **New models:** Create migration with `alembic revision --autogenerate -m "description"`. Review the generated SQL before committing.
- **Services over handlers:** Business logic belongs in `app/services/`, not in route functions. Handlers are thin wrappers.

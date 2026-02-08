---
name: performance-audit
description: "Use when investigating slow responses, high resource usage, scaling concerns, or when asked about performance. Covers database queries (N+1), memory, CPU, rendering, caching, and load patterns."
---

# Performance Audit

## Overview

A slow application is a broken application. Performance issues are bugs that cost money and users.

**Core principle:** Measure before optimizing. Profile before guessing.

## The Iron Law

```
NO OPTIMIZATION WITHOUT PROFILING DATA. NO ASSUMPTION WITHOUT MEASUREMENT.
```

## When to Use

- "Why is this slow?"
- Response times > thresholds
- High database query counts
- Memory growth over time
- CPU spikes
- Scaling concerns
- Before launching high-traffic features
- During any codebase audit

## When NOT to Use

- Schema design review only (use `database-audit`)
- Architecture evaluation (use `architecture-audit`)
- Premature optimization of code that isn't slow (YAGNI — measure first)

## Anti-Shortcut Rules

```
YOU CANNOT:
- Say "this is slow" without measuring — what's the actual latency? What's the target?
- Optimize without profiling first — you'll optimize the wrong thing
- Say "no N+1 issues" without tracing query counts per request — count queries, don't guess
- Assume caching fixes everything — stale data bugs from bad caching are worse than slowness
- Skip frontend performance because "the backend is the bottleneck" — audit both
- Ignore P99 latency because P50 looks good — users experience tail latency
- Say "it's fast enough" without defining what "fast enough" means — quantify the target
- Benchmark in development and apply conclusions to production — environments differ
```

## Common Rationalizations (Don't Accept These)

| Rationalization | Reality |
|----------------|---------|
| "It's fast on my machine" | Your machine has one user. Production has thousands. |
| "We can scale by adding servers" | Horizontal scaling doesn't fix N+1 queries or memory leaks. |
| "The ORM handles query optimization" | ORMs generate queries. You optimize them. |
| "Nobody has complained about speed" | Users leave silently. They don't file bug reports. |
| "We'll optimize when it's a problem" | By then you've built on top of the bottleneck. |
| "Caching will fix it" | Caching masks problems and introduces consistency issues. |
| "100ms is fast enough" | For one request. At 1000 concurrent, it's 100 seconds of CPU. |

## Iron Questions

```
1. How many database queries does this page/endpoint execute? (count them)
2. Are any queries executing inside a loop? (N+1 detection)
3. What's the P50 and P99 response time? (not just average)
4. Are there queries on large tables without LIMIT? (unbounded result sets)
5. What's the bundle size and LCP for the frontend? (measured, not guessed)
6. Are there memory allocations that grow without bound? (check for leaks)
7. Is there a caching strategy? What's the cache hit rate?
8. What happens at 10x current traffic? (bottleneck prediction)
9. Are expensive operations happening synchronously in the request cycle?
10. Are database indexes aligned with actual query patterns?
```

## The Audit Process

### Phase 1: N+1 Query Detection (Highest Priority)

N+1 is the #1 performance problem. Loading N items, then executing 1 query per item.

**Detection pattern:**

```
1. FIND list/index operations (pages that show multiple items)
2. TRACE the data loading — how many queries for N items?
3. COUNT: 1 query for the list + 1 query per item = N+1
4. LOOK for lazy-loaded relationships accessed in loops
```

**Framework-specific detection:**

| Framework | N+1 Pattern | Fix |
|-----------|------------|-----|
| Django | `for obj in queryset: obj.related.field` | `select_related()` / `prefetch_related()` |
| Rails | `@items.each { \|i\| i.category.name }` | `.includes(:category)` |
| Laravel | `foreach ($items as $item) $item->category->name` | `with('category')` / eager load |
| SQLAlchemy | `for item in items: item.category.name` | `joinedload()` / `subqueryload()` |
| Prisma | `for (const item of items) item.category` | `include: { category: true }` |
| TypeORM | Loop accessing `entity.relation` | `relations: ['category']` or QueryBuilder joins |

**N+1 severity calculation:**

| Items | Extra Queries | Impact |
|-------|--------------|--------|
| 10 | 10 | Noticeable on slow connections |
| 50 | 50 | Visible delay |
| 100 | 100 | Unacceptable |
| 1000 | 1000 | Page timeout likely |

### Phase 2: Query Analysis

```
1. IDENTIFY the most frequent queries (not just the slowest)
2. CHECK for missing indexes on WHERE/JOIN/ORDER BY columns
3. CHECK for full table scans (EXPLAIN/EXPLAIN ANALYZE)
4. CHECK for SELECT * when only specific columns needed
5. CHECK for unnecessary queries (could be cached or eliminated)
6. CHECK for queries inside transactions that could be outside
```

**Index audit checklist:**

| Column Usage | Needs Index? |
|-------------|-------------|
| Foreign key | ✅ Always |
| WHERE clause (frequent) | ✅ Yes |
| JOIN condition | ✅ Yes |
| ORDER BY (on large tables) | ✅ Usually |
| SELECT only | ❌ No |
| Boolean with low cardinality | ❌ Usually not |

### Phase 3: Memory and Resource Analysis

```
1. CHECK for memory leaks (event listeners not removed, growing caches)
2. CHECK for unbounded collections (lists that grow without limit)
3. CHECK for large object allocation in loops
4. CHECK for missing pagination on large datasets
5. CHECK for buffering entire files into memory
6. CHECK for connection pool exhaustion (DB, Redis, HTTP)
```

**Memory leak patterns:**

| Pattern | Detection | Fix |
|---------|-----------|-----|
| Unreleased event listeners | Memory grows over time | Remove listeners on cleanup |
| Growing in-memory caches | Memory grows without bound | Add TTL and max size |
| Closures holding references | GC can't collect | Break reference chain |
| Unclosed connections | Connection pool exhaustion | Use connection pooling with limits |
| Large response buffering | Memory spike per request | Stream responses |

### Phase 4: Frontend Performance

```
1. CHECK bundle size (is it > 500kb?)
2. CHECK for unnecessary re-renders (React profiler)
3. CHECK image optimization (format, size, lazy loading)
4. CHECK font loading strategy
5. CHECK for render-blocking resources
6. CHECK for layout shifts (CLS)
```

**Core Web Vitals targets:**

| Metric | Good | Needs Work | Poor |
|--------|------|-----------|------|
| LCP (Largest Contentful Paint) | < 2.5s | < 4.0s | > 4.0s |
| FID (First Input Delay) | < 100ms | < 300ms | > 300ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 800ms | < 1.8s | > 1.8s |
| INP (Interaction to Next Paint) | < 200ms | < 500ms | > 500ms |

### Phase 5: Caching Strategy

```
1. WHAT is cached? (queries, computed values, API responses, pages)
2. WHAT is NOT cached but should be? (frequently read, rarely written data)
3. HOW is cache invalidated? (TTL, event-based, manual)
4. ARE there stale data risks?
5. IS caching consistent? (one mechanism or scattered approaches)
6. WHAT's the cache hit rate? (< 80% = investigate)
```

**Caching decision matrix:**

| Data Characteristic | Cache Strategy | Invalidation |
|--------------------|---------------|--------------|
| Read-heavy, rarely changes | Aggressive TTL (hours) | Event-based + TTL |
| Read-heavy, frequently changes | Short TTL (seconds/minutes) | Write-through |
| User-specific data | Per-user cache key | On user action |
| Computed aggregations | Precompute on schedule | Scheduled refresh |
| Session data | In-memory / Redis | On logout / expiry |

### Phase 6: Scalability Assessment

```
1. IDENTIFY bottlenecks (DB, CPU, memory, I/O, network)
2. CHECK for horizontal scalability (stateless services?)
3. CHECK for connection pooling (DB, Redis, HTTP clients)
4. CHECK for queue-based processing (long operations async?)
5. CHECK for timeout configurations
6. CHECK for graceful degradation under load
```

## Output Format

```markdown
# Performance Audit: [Project Name]

## Executive Summary
[Overall performance assessment]

## Key Metrics
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Avg response time | Xms | <200ms | 🟡 |
| P99 response time | Xms | <1000ms | 🔴 |
| Queries per request | X | <10 | 🟠 |
| Bundle size | XMB | <500KB | 🟡 |
| LCP | Xs | <2.5s | 🟢 |

## N+1 Queries Found
[List with evidence, impact, and fixes]

## Missing Indexes
[List with DDL to create them]

## Other Findings
[By severity]

## Quick Wins (< 1 hour each)
[High impact, low effort improvements]

## Verdict
[PASS / CONDITIONAL PASS / FAIL]
```

## Red Flags — Immediate Attention

- > 50 queries per page load
- No database indexes on foreign keys
- Loading entire tables into memory
- No pagination on any endpoint
- No caching strategy
- Synchronous external API calls in request cycle
- Bundle size > 2MB
- Memory that grows without bound

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Requires:** `database-audit` for schema-level analysis
- **Follow-up:** `refactoring-safely` for optimization work
- **Monitoring:** `observability-audit` for ongoing performance tracking

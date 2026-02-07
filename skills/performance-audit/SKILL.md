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

### Phase 2: Query Analysis

```
1. IDENTIFY the most frequent queries (not just the slowest)
2. CHECK for missing indexes on WHERE/JOIN/ORDER BY columns
3. CHECK for full table scans
4. CHECK for SELECT * when only specific columns needed
5. CHECK for unnecessary queries (could be cached or eliminated)
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
```

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

### Phase 5: Caching Strategy

```
1. WHAT is cached? (queries, computed values, API responses, pages)
2. WHAT is NOT cached but should be? (frequently read, rarely written data)
3. HOW is cache invalidated? (TTL, event-based, manual)
4. ARE there stale data risks?
5. IS caching consistent? (one mechanism or scattered approaches)
```

### Phase 6: Scalability Assessment

```
1. IDENTIFY bottlenecks (DB, CPU, memory, I/O, network)
2. CHECK for horizontal scalability (stateless services?)
3. CHECK for connection pooling (DB, Redis, HTTP clients)
4. CHECK for queue-based processing (long operations async?)
5. CHECK for timeout configurations
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

## N+1 Queries Found
[List with evidence and fixes]

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

## Integration

- **Part of:** Full audit with `architecture-audit`
- **Requires:** `database-audit` for schema-level analysis
- **Follow-up:** `refactoring-safely` for optimization work

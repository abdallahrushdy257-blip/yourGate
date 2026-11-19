---
name: performance-optimization
description: Use when pages or endpoints are slow, when the user mentions performance, N+1, heavy queries, large bundles, or before production release. Measures first, then optimizes backend queries and frontend rendering/bundles.
---

# Performance Optimization

## Rule: measure → change one thing → re-measure. Never optimize blind.

## Backend (Laravel / SQL)
- **Measure**: enable `DB::enableQueryLog()` or Laravel Debugbar/Telescope; count queries per request.
- **N+1**: relation accessed inside a loop/Resource without `with()` → add eager loading. Guard with `Model::preventLazyLoading(!app()->isProduction())`.
- **Indexes**: every column in `WHERE`, `JOIN`, `ORDER BY` on large tables (`store_id`, foreign keys, dates, status) → add migration index. Verify with `EXPLAIN`.
- **Aggregates**: use `withSum` / `withCount` / DB-side `SUM` instead of loading rows and summing in PHP.
- **Pagination**: never return unbounded lists; use `paginate()`.
- **Select only needed columns** for list endpoints.
- **Cache** stable lookups (chart of accounts, settings, dropdowns) with tagged/keyed cache scoped by tenant; invalidate on write.

## Frontend (React / Vite)
- **Measure**: `npm run build` chunk sizes; Chrome DevTools Performance + Lighthouse.
- **Code splitting**: `React.lazy` + `Suspense` per route; split heavy libs (charts, pdf, excel) into lazy chunks.
- **Re-renders**: stabilize props with `useMemo`/`useCallback` only where profiling shows waste; avoid inline object props on heavy lists.
- **Lists**: virtualize tables > ~500 rows; server-side pagination/filtering.
- **Requests**: dedupe/cancel (AbortController), debounce search inputs, avoid fetch waterfalls (`Promise.all`).
- **Assets**: compress images, lazy-load media, preload critical fonts.

## Output
Before/after numbers for every change (query count, ms, KB). Revert changes with no measurable gain.

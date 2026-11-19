---
name: database-design
description: Use when creating or changing migrations, tables, relations, indexes, or seeders, or when designing data models for a new feature. Ensures safe, reversible, indexed, tenant-aware schema changes.
---

# Database Design & Migrations

## Rules
- **Never edit an existing, already-run migration** — create a new one.
- Every migration must have a working `down()`.
- Money: `decimal(15,2)` (never `float`/`double`). Quantities: `decimal` when fractional.
- Every tenant-owned table: `store_id` (or tenant key) + foreign key + index; model uses the tenant-scoping trait.
- Foreign keys with explicit `onDelete` (`cascade` for owned children, `restrict`/`nullOnDelete` for references).
- Index: foreign keys, `status`, dates used for filtering/reports, and composite `(store_id, <filter_col>)`.
- Unique constraints scoped per tenant: `unique(['store_id', 'code'])`, not global.
- Use `softDeletes` for financial/audit records; never hard-delete posted accounting data.
- Enums: prefer string column + PHP enum/constants over DB `enum` (easier to extend).

## Process
1. Check existing models/migrations for naming and patterns before adding.
2. Write the migration + model (`$fillable`, `$casts`, relations, tenant trait).
3. Run `php artisan migrate` then `php artisan migrate:rollback --step=1` then `migrate` again — verify reversibility.
4. Add/update a factory and a feature test that creates and queries the record under two tenants (isolation check).
5. Run the full test suite.

## Destructive changes (drop/rename column, change type)
- Confirm with the user first.
- Two-step deploy: add new column + backfill → switch code → drop old column in a later migration.

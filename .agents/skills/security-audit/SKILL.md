---
name: security-audit
description: Use when the user asks for a security check, before deploying to production, or when touching auth, permissions, payments, file uploads, or multi-tenant data access. Audits backend and frontend for OWASP Top 10 vulnerabilities.
---

# Security Audit

## Scan targets (search, don't guess)
| Risk | What to grep / inspect |
|---|---|
| SQL injection | `DB::raw`, `whereRaw`, `selectRaw`, `->query(`, string-concatenated SQL |
| Broken access control | routes outside auth middleware; controllers/services fetching by `id` without tenant/owner scope; missing policy/permission checks |
| Mass assignment | `$guarded = []`, `->create($request->all())`, `->update($request->all())` |
| XSS | `dangerouslySetInnerHTML`, `{!! !!}`, `innerHTML =` |
| Secrets | hardcoded keys/passwords, committed `.env`, tokens in `localStorage` logs |
| Auth | token expiry, logout revokes token, rate limiting on login/register/OTP |
| Uploads | `mimes`/`max` validation, stored outside public path or randomized names |
| CORS / config | `APP_DEBUG=true` in prod, wildcard CORS with credentials |
| Dependencies | `composer audit`, `npm audit --omit=dev` |

## Process
1. Run the scans above with grep/Select-String across `backend/` and `frontend/src/`.
2. For each hit, confirm exploitability by reading the code path — discard false positives.
3. Run `composer audit` and `npm audit --omit=dev`.
4. For each confirmed issue, write a failing test that proves it (e.g. tenant A reads tenant B's record → expect 404/403), then fix.

## Output
```
CRITICAL | HIGH | MEDIUM | LOW   file:line   vulnerability   → fix
```
Only confirmed findings. Include the dependency audit summary.

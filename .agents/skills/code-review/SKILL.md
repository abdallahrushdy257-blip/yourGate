---
name: code-review
description: Use after finishing a feature, fix, or refactor and before committing, or when the user asks to review code/diff/PR. Reviews changes for correctness, regressions, security, and consistency with project conventions.
---

# Code Review

## Process
1. Get the scope: `git diff` (unstaged) + `git diff --staged`, or the files named by the user.
2. Read surrounding code, not just the diff — check callers and callees of every changed function.
3. Review in this order (stop and report blockers first):
   - **Correctness**: logic errors, off-by-one, null/undefined, wrong conditions, unhandled promise/exception paths.
   - **Regressions**: changed signatures, renamed keys, removed exports, route/endpoint changes that break consumers.
   - **Security**: see checklist below.
   - **Data integrity**: transactions around multi-write ops, money as decimal (never float), tenant scoping.
   - **Consistency**: matches existing patterns (naming, folder structure, response shape, error handling).
   - **Performance**: N+1 queries, queries in loops, missing pagination, unnecessary re-renders.
4. Verify claims by running tests/build — never assume.

## Security checklist
- No raw SQL with interpolated input; no mass-assignment of unvalidated input.
- Every endpoint has auth + authorization; every query is scoped to the current tenant/user.
- No secrets, tokens, or `.env` values in code or logs.
- Output is escaped (no `dangerouslySetInnerHTML` / `{!! !!}` with user data).
- File uploads validate type + size.

## Output format
```
BLOCKER  file:line  issue → fix
MAJOR    file:line  issue → fix
MINOR    file:line  issue → fix
```
End with: tests run + result. No praise, no restating the diff.

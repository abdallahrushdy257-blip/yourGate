# Universal Project Engineering Rules

1. **Discover Before Editing (`project-discovery`)**: On any unfamiliar repo or module, inspect manifests (`package.json`, `composer.json`, `pyproject.toml`, `go.mod`, `*.csproj`, `pubspec.yaml`), local `AGENTS.md`/`README.md`, and 1-2 existing modules end-to-end first. Mirror existing conventions instead of inventing new patterns.
2. **Contract Alignment**: For full-stack or multi-service tasks, verify exact routes, HTTP methods, payload keys, types, and response structures across producer and consumer before editing either side.
3. **Auto-Activate Relevant Skills**:
   - Planning multi-file features or refactors: `brainstorming` -> `writing-plans`
   - Bugs, 500s, test failures: `systematic-debugging` (trace root cause first; never guess)
   - Feature/fix implementation: `test-driven-development` + `clean-code`
   - Auth, permissions, uploads, multi-tenancy, payments: `security-audit` + `api-security-best-practices`
   - Migrations, schemas, slow queries: `database-design` + `sql-optimization-patterns`
   - UI/UX, styling, accessibility, RTL/i18n: `frontend-design` + stack skill (`react-best-practices`, `tailwind-patterns`, `i18n-localization`)
   - Detected stack: apply matching expert skill (`laravel-expert`, `php-pro`, `typescript-pro`, `javascript-pro`, `nodejs-backend-patterns`, `nextjs-best-practices`, `python-pro`, `fastapi-pro`, `django-pro`, `flutter-expert`, `golang-pro`, `csharp-pro`, `java-pro`, `docker-expert`)
   - Final check: `verification-before-completion` + `code-review`
4. **Verify With Real Tools**: Use `context7` for up-to-date library docs, read-only DB MCP (if configured) to verify schemas, `playwright`/browser tools to verify live UI, and `git` tools for diff/history.
5. **Proof Before Completion**: Run the project's real test suite, typecheck, or build after the final edit. Never claim passing checks or quote unverified file paths, symbols, or counts.
6. **Hygiene**: Never commit secrets or `.env` values, keep DB MCP read-only, and do not create extra docs or demo files unless requested.

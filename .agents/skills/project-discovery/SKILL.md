---
name: project-discovery
description: Use when starting work on an unfamiliar repository, mapping how a project is structured, finding entry points, understanding tech stack, conventions, database schema, API contracts, and test commands across any language or framework.
---

# Project Discovery

Understand any repository rapidly and accurately from actual files — never guess architecture, endpoints, or tooling.

## 1. Identify Stack & Entrypoints (read manifests first)
Check root and sub-app folders (`backend/`, `frontend/`, `apps/*`, `services/*`) for:
- **PHP / Laravel**: `composer.json`, `artisan`, `routes/`, `bootstrap/app.php` or `app/Http/Kernel.php`, `.env.example`
- **JS / TS / React / Next / Node**: `package.json` (`scripts`, dependencies), `tsconfig.json`, `vite.config.*`, `next.config.*`, `src/main.*`, `src/App.*`
- **Python**: `pyproject.toml`, `requirements.txt`, `manage.py`, `app/main.py`
- **Go / Rust / .NET / Java / Flutter**: `go.mod`, `Cargo.toml`, `*.csproj`, `pom.xml`/`build.gradle*`, `pubspec.yaml`
- **Infra / DB**: `docker-compose.yml`, `Dockerfile`, `.github/workflows/`, schema/migration directories

## 2. Extract Local Rules & Conventions
- Check `AGENTS.md`, `CLAUDE.md`, `README.md`, `.agents/rules/`, `CONTRIBUTING.md` before proposing changes.
- Inspect 1–2 existing modules end-to-end (route → controller/handler → service/domain → data/model → response/UI caller) to mirror naming, error handling, validation, auth, and multi-tenancy patterns.

## 3. Map Frontend ↔ Backend Contracts (for full-stack apps)
- Inspect the HTTP client (`axios`, `fetch`, `trpc`, GraphQL client) for base URL, auth headers, interceptors, and response unwrapping.
- Match exact endpoint paths, HTTP methods, request payload keys, and response shapes across backend and frontend before changing either side.

## 4. Verify Tooling Before Coding
- Identify exact lint, typecheck, test, and build commands from `package.json` / `composer.json` / `Makefile`.
- Check MCP tools available (`context7` for library docs, DB MCP for live schema read-only, `git` for history, `playwright` for live UI) and use them instead of guessing.

## Output (when summarizing a project)
- **Stack & Layout**: folders, frameworks, DB, auth model.
- **Conventions & Patterns**: layering, validation, response format, state management.
- **Run & Verify Commands**: dev, test, build, migrate.
- **Gaps / Risks**: broken configs, mismatched contracts, missing checks.

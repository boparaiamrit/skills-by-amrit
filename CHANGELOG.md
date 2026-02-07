# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-02-07

### 🔄 Complete Rewrite

Complete rewrite of the skills library from the ground up.

### Added — Foundation
- `CLAUDE.md` — System prompt and skill activation table
- `rules/core-principles.md` — Three iron laws, code quality, communication standards
- `rules/anti-hallucination.md` — Evidence-based behavior enforcement
- `rules/severity-framework.md` — Standardized severity classification

### Added — Core Development Skills (8)
- `skills/brainstorming/SKILL.md` — Collaborative design before implementation
- `skills/writing-plans/SKILL.md` — Detailed implementation plans with exact code
- `skills/executing-plans/SKILL.md` — Task-by-task execution with verification
- `skills/test-driven-development/SKILL.md` — RED-GREEN-REFACTOR with iron law
- `skills/systematic-debugging/SKILL.md` — Four-phase root cause investigation
- `skills/code-review/SKILL.md` — Systematic review covering all dimensions
- `skills/verification-before-completion/SKILL.md` — Evidence before claims
- `skills/git-workflow/SKILL.md` — Atomic commits, branching, clean history

### Added — Audit Skills (10)
- `skills/architecture-audit/SKILL.md` — Structure, patterns, coupling, cohesion
- `skills/security-audit/SKILL.md` — Auth, injection, data exposure, infrastructure
- `skills/performance-audit/SKILL.md` — N+1 queries, indexes, caching, frontend
- `skills/database-audit/SKILL.md` — Schema, migrations, constraints, data types
- `skills/frontend-audit/SKILL.md` — Components, state, design system, error states
- `skills/api-design-audit/SKILL.md` — REST conventions, contracts, pagination
- `skills/dependency-audit/SKILL.md` — Security, health, licenses, necessity
- `skills/observability-audit/SKILL.md` — Logging, metrics, health checks, tracing
- `skills/accessibility-audit/SKILL.md` — WCAG, keyboard, screen reader, contrast
- `skills/ci-cd-audit/SKILL.md` — Pipelines, deployment safety, rollback

### Added — Evolution Skills (4)
- `skills/refactoring-safely/SKILL.md` — Test-backed structural changes
- `skills/writing-documentation/SKILL.md` — READMEs, API docs, architecture
- `skills/codebase-mapping/SKILL.md` — Systematic understanding before changes
- `skills/incident-response/SKILL.md` — Triage, mitigate, fix, post-mortem

### Added — Meta Skills (2)
- `skills/writing-skills/SKILL.md` — How to create new skills
- `skills/using-skills/SKILL.md` — How to discover and compose skills

### Added — Project Infrastructure
- `LICENSE` — MIT License
- `CONTRIBUTING.md` — Contribution guidelines
- `CHANGELOG.md` — This file

### Removed
- All previous `agents/` directory (replaced by composable skills)
- All previous `rules/` files (replaced by framework-agnostic rules)
- All previous `workflows/` directory (replaced by skills)
- All previous `commands/` directory
- All previous `templates/` directory
- Old `skills/` directory

### Philosophy Changes
- **Framework-agnostic:** No longer Laravel-specific. Works with any stack
- **Skill-based:** Replaced rigid agent pipeline with composable skills
- **Iron laws:** Every skill has a non-negotiable rule
- **Rationalization prevention:** Skills include tables of common excuses
- **Evidence-based:** Verification required before any completion claims

## [1.0.0] - 2025-01-15

### Initial Release
- Laravel-focused auditing agents
- Framework-specific rules and workflows
- CLI for installation

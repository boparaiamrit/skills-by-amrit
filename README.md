# 🧠 Skills by Amrit

**An agentic skills framework that makes AI coding assistants think like senior staff engineers.**

> 24 composable skills · 34+ supported agents · Agent Skills spec compatible

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/skills-by-amrit.svg)](https://www.npmjs.com/package/skills-by-amrit)

---

## What This Is

A portable, framework-agnostic skills library that transforms AI coding assistants into systematic, process-driven engineers. Install into any project, and your AI assistant gains:

- **Structured processes** — No more random coding. Every task follows a proven methodology
- **Iron laws** — Non-negotiable rules that prevent the most common AI mistakes
- **Composable skills** — Skills chain together naturally (brainstorm → plan → execute → verify)
- **Anti-hallucination protocol** — Forces evidence before claims, verification before completion
- **Comprehensive auditing** — Security, performance, database, frontend, API, accessibility, CI/CD, observability, dependencies

## Quick Start

```bash
# Install all skills (interactive — auto-detects your agents)
npx skills-by-amrit add

# Install to specific agent
npx skills-by-amrit add -a claude-code

# Install specific skills to Cursor
npx skills-by-amrit add systematic-debugging test-driven-development -a cursor

# Install to ALL agents, non-interactive
npx skills-by-amrit add --all -a '*' -y

# Install globally (user-wide, not project-specific)
npx skills-by-amrit add -g -a claude-code

# List all available skills
npx skills-by-amrit list

# See all supported agents
npx skills-by-amrit agents
```

## Supported Agents (34+)

The CLI auto-detects which agents you have installed and installs skills to the correct directories.

| Agent | Local Path | Global Path |
|-------|-----------|------------|
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` |
| **Cursor** | `.cursor/skills/` | `~/.cursor/skills/` |
| **Windsurf** | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| **Antigravity** (Gemini) | `.agent/skills/` | `~/.gemini/antigravity/skills/` |
| **Gemini CLI** | `.agents/skills/` | `~/.gemini/skills/` |
| **GitHub Copilot** | `.agents/skills/` | `~/.copilot/skills/` |
| **Codex** | `.agents/skills/` | `~/.codex/skills/` |
| **Cline** | `.cline/skills/` | `~/.cline/skills/` |
| **Roo** | `.roo/skills/` | `~/.roo/skills/` |
| **Amp** | `.agents/skills/` | `~/.config/agents/skills/` |
| **Kilo Code** | `.kilocode/skills/` | `~/.kilocode/skills/` |
| **Augment** | `.augment/skills/` | `~/.augment/skills/` |
| **Continue** | `.continue/skills/` | `~/.continue/skills/` |
| **Goose** | `.goose/skills/` | `~/.config/goose/skills/` |
| And 20 more... | | |

Run `npx skills-by-amrit agents` to see the full list with detection status.

## Skills Library

### 🏗️ Core Development (8 skills)

| Skill | Iron Law |
|-------|----------|
| [brainstorming](skills/brainstorming/SKILL.md) | No implementation without validated design |
| [writing-plans](skills/writing-plans/SKILL.md) | Every task has exact files, code, verification |
| [executing-plans](skills/executing-plans/SKILL.md) | No task complete until verified |
| [test-driven-development](skills/test-driven-development/SKILL.md) | No production code without failing test first |
| [systematic-debugging](skills/systematic-debugging/SKILL.md) | No fixes without root cause investigation |
| [code-review](skills/code-review/SKILL.md) | No merge without review |
| [verification-before-completion](skills/verification-before-completion/SKILL.md) | No completion claims without fresh evidence |
| [git-workflow](skills/git-workflow/SKILL.md) | Clean history enables clean debugging |

### 🔍 Auditing (10 skills)

| Skill | Iron Law |
|-------|----------|
| [architecture-audit](skills/architecture-audit/SKILL.md) | No claims without reading actual code |
| [security-audit](skills/security-audit/SKILL.md) | No deploy without security review |
| [performance-audit](skills/performance-audit/SKILL.md) | No optimization without profiling data |
| [database-audit](skills/database-audit/SKILL.md) | No nullable column without reason |
| [frontend-audit](skills/frontend-audit/SKILL.md) | No component without clear responsibility |
| [api-design-audit](skills/api-design-audit/SKILL.md) | No endpoint without contract and docs |
| [dependency-audit](skills/dependency-audit/SKILL.md) | No new dependency without justification |
| [observability-audit](skills/observability-audit/SKILL.md) | No production service without observability |
| [accessibility-audit](skills/accessibility-audit/SKILL.md) | No interactive element without keyboard access |
| [ci-cd-audit](skills/ci-cd-audit/SKILL.md) | No manual deployment steps |

### 🔧 Evolution (4 skills)

| Skill | Iron Law |
|-------|----------|
| [refactoring-safely](skills/refactoring-safely/SKILL.md) | No refactoring without behavior-preserving tests |
| [writing-documentation](skills/writing-documentation/SKILL.md) | No public API without documentation |
| [codebase-mapping](skills/codebase-mapping/SKILL.md) | No changes without mapping first |
| [incident-response](skills/incident-response/SKILL.md) | Mitigate impact before investigating |

### 🧩 Meta (2 skills)

| Skill | Purpose |
|-------|---------|
| [writing-skills](skills/writing-skills/SKILL.md) | Create new skills for the library |
| [using-skills](skills/using-skills/SKILL.md) | Discover and compose skills effectively |

## CLI Reference

```
npx skills-by-amrit <command> [options]

Commands:
  add [skills...]    Install skills to agent directories
  list               List all available skills
  agents             Show all supported agents with detection status
  help               Show help

Options:
  -a, --agent <name>    Target specific agent(s), repeat for multiple
  -a '*'                Target ALL agents
  -g, --global          Install to global (user home) directory
  -y, --yes             Non-interactive mode
  --all                 Install all 24 skills
  -v, --version         Show version
```

## How Skills Compose

```
Feature Request
    └── brainstorming → writing-plans → executing-plans
        ├── test-driven-development (per task)
        ├── verification-before-completion (per task)
        └── git-workflow (atomic commits)

Bug Report
    └── systematic-debugging → TDD (fix) → verification

Full Audit
    └── codebase-mapping → architecture + security + performance + database
        + frontend + api-design + dependency + observability + accessibility + ci-cd

Production Incident
    └── incident-response → systematic-debugging → TDD → verification
```

## Agent Skills Specification

This library follows the [Agent Skills specification](https://agentskills.io) — the open standard for giving AI agents reusable capabilities. Each skill:

- Lives in a `skill-name/SKILL.md` file
- Has YAML frontmatter with `name` and `description`
- Is automatically discovered by compatible agents
- Supports progressive disclosure (metadata → instructions → resources)

## Foundation Rules

| Rule | Purpose |
|------|---------|
| [core-principles](rules/core-principles.md) | Three iron laws, code quality, communication standards |
| [anti-hallucination](rules/anti-hallucination.md) | Prevents fabrication, enforces evidence-based behavior |
| [severity-framework](rules/severity-framework.md) | Standardized severity classification for all findings |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT — see [LICENSE](LICENSE)

---

**Built by [Amritpal Singh](https://github.com/boparaiamrit)** — Making AI assistants think like the best engineers.

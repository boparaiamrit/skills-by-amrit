# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] — 2026-02-08 — Agent Intelligence Release 🧠

### 🆕 New Skills
- **persistent-memory** — Automated session memory for ANY agent. Captures decisions, context, and learnings across sessions using file-based protocols. Zero infrastructure — no hooks, no databases, no external services. Inspired by claude-mem.
- **agent-team-coordination** — Multi-role team coordination for ANY agent. Sequential role-switching (Researcher → Architect → Planner → Executor → Reviewer) with shared blackboard and handoff documents. Brings Claude Code Agent Teams to Antigravity, Cursor, and more.

### 🆕 New Commands (22 total)
- `/memory` — Persistent memory management (init, read, write, compress, status)
- `/team` — Agent team coordination (start, resume, next, board, status)
- `/init-project` — Initialize project with `.planning/` structure
- `/plan` — Create detailed implementation plans
- `/execute` — Execute plans with wave-based steps
- `/verify` — Validate implementations against plans
- `/progress` — Display project status
- `/research` — Deep research with structured reports
- `/doc` — Generate documentation
- `/explain` — Explain code, architecture, concepts
- `/review` — Structured code review
- `/test` — Generate and run tests
- `/debug` — Scientific debugging
- `/fix-issue` — Diagnose and fix issues
- `/refactor` — Safe refactoring
- `/migrate` — Database/code migrations
- `/performance` — Performance profiling
- `/security-scan` — Security scanning
- `/deploy-check` — Deployment validation
- `/audit` — Codebase audit
- `/quick` — Quick task execution
- `/commit` — Conventional commit creation

### 🆕 New Workflows (26 total)
- `/memory-sync` — Persistent memory synchronization
- `/team-session` — Multi-role team coordination
- Plus 24 more workflows covering the full project lifecycle

### 🆕 New Agents (7)
- 🔬 **researcher** — Deep codebase and domain research
- 📋 **planner** — Task decomposition and planning
- ⚙️ **executor** — Plan execution with quality gates
- 🔍 **reviewer** — Structured code review
- 🐛 **debugger** — Scientific debugging
- ✅ **verifier** — Work verification and gap analysis
- 🗺️ **mapper** — Codebase mapping and analysis

### 🆕 New Cursor Rules (10 total)
- `memory-protocol.mdc` — Auto-read/write session memory
- `team-protocol.mdc` — Team coordination protocol
- `core-development.mdc` — SOLID, DRY, error handling
- `anti-hallucination.mdc` — Verification-first protocol
- `planning-workflow.mdc` — Structured planning
- `debugging-protocol.mdc` — Scientific debugging
- `security.mdc` — Security best practices
- `database.mdc` — Database standards
- `testing.mdc` — Test standards
- `code-review.mdc` — Review checklist

### 🆕 New Rules (5 total)
- `memory-protocol.md` — Memory instructions for GEMINI.md
- `team-protocol.md` — Team instructions for GEMINI.md
- `core-principles.md` — Foundational engineering principles
- `anti-hallucination.md` — Anti-fabrication protocol
- `severity-framework.md` — Issue severity classification

### 📖 New Documentation
- Exhaustive README with complete asset catalog
- GitHub Wiki with 12 documentation pages
- AGENT-TEAMS-AND-MEMORY.md — Deep dive on v3 features
- COMPETITIVE_ANALYSIS.md — Framework comparison

### ⚡ CLI Enhancements
- Install commands, workflows, agents, and cursor rules alongside skills
- Agent-aware directory mapping (each asset to the right agent directory)
- Comprehensive `list` command showing all asset types
- Preserve existing CLAUDE.md content when appending

### 📊 By the Numbers
- 26 skills (+2 new)
- 22 commands (all new)
- 26 workflows (all new)
- 7 agents (all new)
- 10 cursor rules (all new)
- 5 rules (+2 new)
- **96 total assets**

---

## [2.0.0] — 2026-02-06

### Added
- Support for 30+ AI coding agents
- Interactive agent selection during installation
- Skill categories (Core, Auditing, Evolution, Meta)
- Global installation support
- Auto-detection of installed agents

### Changed
- Complete CLI rewrite in TypeScript
- Improved installation output and summaries

---

## [1.0.0] — 2026-02-04

### Added
- Initial release
- 24 core skills for the full SDLC
- Claude Code integration
- Basic CLI with `add`, `list`, `agents`, `help` commands
- MIT License

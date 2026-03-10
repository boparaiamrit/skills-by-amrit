# Changelog

All notable changes to this project will be documented in this file.

## 4.0.0 — 2026-03-10 — Production Infrastructure & 12-Platform Parity

### 🚀 Major Features

**Production-Grade Hooks System (5 hooks)**
- `security-gate.js` — PostToolUse scanning for secrets, API keys, injection patterns (9 secret patterns + 6 anti-patterns)
- `statusline.js` — PreInputSanitization display: model + context % bar + current task
- `context-monitor.js` — PostToolUse context warnings at 65%/75% with debounce and severity escalation
- `update-check.js` — SessionStart npm version check with 24-hour cache
- `memory-capture.md` — PreCompact weighted memory persistence (W1-W5)

**Expanded CLI Tool (90+ commands across 13 modules)**
- `scripts/lib/core.cjs` — 20 shared utilities, MODEL_PROFILES
- `scripts/lib/state.cjs` — 13 STATE.md CRUD operations (load, json, update, get, patch, add-decision, add-blocker, record-session, advance-task, update-progress)
- `scripts/lib/phase.cjs` — 7 phase operations including plan-index with wave grouping
- `scripts/lib/roadmap.cjs` — ROADMAP.md parsing and progress updates
- `scripts/lib/verify.cjs` — 4 validators (summary, plan-structure, phase-completeness, references)
- `scripts/lib/config.cjs` — Config management with gates, safety, parallelization toggles
- `scripts/lib/template.cjs` — Template rendering with {{variable}} substitution
- `scripts/lib/milestone.cjs` — Milestone archive/complete/list
- `scripts/lib/init.cjs` — 5 compound init commands (execute-phase, plan-phase, new-project, quick, verify-work)
- `scripts/lib/frontmatter.cjs` — 8 YAML frontmatter CRUD operations
- `scripts/lib/model.cjs` — Model profile resolution (quality/balanced/budget)
- `scripts/lib/council.cjs` — 13 council state machine commands

**Council Infrastructure (LLM Council v2)**
- Real subagent spawning via Task() — each agent gets fresh 200k context
- Deterministic state machine: `council init/status/advance/message/handoff/gate-check/board/task-add/task-update/reset/summary/close/resume`
- Code-enforced quality gates between agent transitions
- Auto-generated task board (BOARD.md) with progress tracking
- 6 presets: full (5), rapid (3), debug (3), architecture (3), refactoring (4), audit (3)
- Orchestrator stays lean (~10-15% context), delegates to specialist agents

**12-Platform Parity**
- GitHub Copilot: agents (.agent.md), prompts, instructions, hooks.json, AGENTS.md
- Cursor: commands, AGENTS.md, hooks.json
- Windsurf: rules, AGENTS.md, hooks.json
- Codex: AGENTS.md entry point
- Cline: .clinerules/ with path frontmatter, AGENTS.md
- Roo Code: .roo/rules-code/, .roomodes with 3 custom modes
- Amp: AGENTS.md entry point
- Augment: .augment/rules/, AGENTS.md
- Continue: .continue/prompts/, .continue/rules/
- Kilo Code: .kilocode/rules/, AGENTS.md
- Goose: .goosehints plain text entry point

**Template System (11 templates)**
- 9 markdown templates: project, plan, summary, requirements, research, state, roadmap, context, verification
- config-defaults.json with all workflow toggles
- model-profiles.json with quality/balanced/budget

**Reference Documents**
- questioning.md — Adaptive questioning framework (70/25/5 decision distribution)
- deviation-rules.md — Deviation protocol (auto-fix rules 1-3, permission rules 4-5)

### 🔧 Improvements

**Workflow Upgrades (7 workflows)**
- `execute.md` — Wave-based parallel execution with compound init and atomic commits
- `plan-feature.md` — Compound init, structured PLAN.md output, plan-checker revision loop
- `verify.md` — Goal-backward verification methodology, VERIFICATION.md output
- `init-project.md` — Compound init, template-based project creation
- `quick.md` — Scope guard, atomic commit protocol
- `commit.md` — Attribution config, specific file staging (never git add -A)
- `team-session.md` — Real Task() spawning, CLI orchestration, quality gates, parallel audit

**Agent Upgrades (3 agents)**
- `executor.md` — Deviation protocol (4 rules), context fidelity, mandatory file read
- `planner.md` — Structured PLAN.md output, wave assignment, context budget awareness
- `verifier.md` — Goal-backward verification, VERIFICATION.md structured output

**Installer Upgrades**
- SHA-256 file manifest generation (skills-file-manifest.json)
- Idempotent hook registration with uninstall support
- Attribution handling (--attribution / --no-attribution flags)
- Statusline configuration (--force-statusline flag)
- Copilot conversion functions (agents, prompts, instructions, hooks)
- Universal AGENTS.md generation for 8+ platforms
- Platform-specific rules conversion (Windsurf, Cline, Roo, Augment, Continue, Kilo)

### 📊 Stats
- **New files:** 30
- **Modified files:** 21
- **Total CLI commands:** 90+
- **Platforms supported:** 12 (at full parity)
- **Council commands:** 13
- **Hooks:** 5
- **Templates:** 11
- **Audit score:** 100/100 (post-fix)

---

## [3.5.0] — 2026-02-18 — GSD Planning System 🚀

### 🆕 GSD Planning System — Deterministic State Management
- **`planning-tools.cjs`** — New CLI tool for deterministic state operations. Handles init, state advance, decisions, blockers, config, and progress dashboard. No more trusting LLMs with JSON file edits.
- **Deviation Protocol** — 4-tier deviation handling during execution:
  - Cosmetic → fix silently
  - Minor → document, keep going
  - Moderate → STOP and ask user
  - Major → STOP, go back to planning
- **Context Engineering** — Plans limited to 2-3 tasks to prevent quality degradation at high context usage. Checkpoint every 3 tasks with handoff to `LATEST.md`.
- **Quality Degradation Curve** — Explicit guidance on plan sizing to avoid LLM token-saturation errors.

### 🆕 MCQ `/discuss` Command
- **Multiple-choice format** — Questions presented with lettered options (A, B, C, D), each with a 1-line trade-off description
- **Recommendations** — Each question includes 🏆 Recommended option with rationale
- **Quick-answer sequence** — Answer all questions in one line: `1A 2B 3C 4A 5:"use Redis"`
- **Confirmation table** — Shows which choices match recommendation (🏆), differ (⚠️), or are custom (✏️)
- **✏️ Custom** option always available as last choice

### 🆕 New Commands
- `/discuss` — MCQ pre-planning decision capture with quick-answer
- `/settings` — View and modify planning config (mode, depth, preferences)

### 🆕 New Workflows
- `/discuss` — Structured preference capture with locked decisions
- `/settings` — Configuration management workflow

### 📚 Documentation — Getting Started Overhaul
- **[Getting Started Guide](docs/wiki/Getting-Started.md)** — Comprehensive plain English guide explaining greenfield vs brownfield workflows, what each step does and WHY, where `planning-tools.cjs` and memory fit in the flow
- **[Greenfield Walkthrough](docs/wiki/examples-Getting-Started-Greenfield.md)** — Full conversation transcript: building a crypto trading dashboard from scratch
- **[Brownfield Walkthrough](docs/wiki/examples-Getting-Started-Brownfield.md)** — Full conversation transcript: adding user preferences to an existing Python trading bot with pattern conformity
- **Wiki sidebar** updated with Getting Started section at top
- **Quick-Start** rewritten with greenfield/brownfield path selection
- **Examples index** updated with Getting Started walkthroughs and new commands

### 📝 README Updates
- New "Getting Started — Greenfield vs Brownfield" section with complete workflows
- Key Differences table (first step, context source, pattern adherence, risk level)
- Recent Releases section includes v3.5.0
- Updated asset counts throughout

### 🔧 Fixes
- `planning-tools.js` → `planning-tools.cjs` — renamed throughout to respect ES module setup
- Stale wiki counts updated (96 → 116 assets, 22 → 28 commands, 26 → 32 workflows, 7 → 9 agents)
- `docs/index.html` OG description updated (105 → 116 assets)
- `Agents-Reference.md` updated (7 → 9 specialist agents)

### 📊 By the Numbers
- 31 skills
- 28 commands (+2 new: `/discuss`, `/settings`)
- 32 workflows (+2 new: `/discuss`, `/settings`)
- 9 agents
- 10 cursor rules, 5 universal rules
- **116 total assets**
- 5 new wiki pages

---

## [3.4.0] — 2026-02-10 — Brutal Audit Edition 🔬

### 💎 Major Overhaul: LLM Council + Memory Module
- **agent-team-coordination** completely rewritten as the flagship feature
- **Memory Module** — Deep codebase intelligence gathering (schemas, routes, services, patterns) as a prerequisite to any team coordination
- **LLM Council pattern** — Manager agent with full project knowledge orchestrates specialist sub-agents
- **Dynamic routing** — Manager routes tasks as an intelligent graph, not a fixed linear sequence
- **Peer-to-peer communication** — Sub-agents can talk directly to each other for quick specialist alignment
- **Escalation protocol** — Any agent can escalate to the Manager who guides with deep Memory Module context
- **6 council presets** — Full Council, Rapid, Debug, Architecture, Refactoring, Audit
- **Quality gates** — Manager enforces quality gates at every phase transition
- **Structured messaging** — 5 message types: handoff, question, escalation, status, request
- **Anti-shortcut rules** — with common rationalizations and rebuttals
- **Iron questions** — 10 mandatory questions before closing any council session

### 🔬 Brutal Audit: Agent Team Coordination (20 issues fixed)
- **Standardized directory structure** — All assets now consistently use `.planning/council/` (rules/cursor-rules previously used `.planning/team/`)
- **New agents:** `investigator.md` (bug investigation) and `fixer.md` (fix implementation) for Debug Council preset
- **Message numbering algorithm** — Explicit zero-padded sequential numbering for council messages
- **Council resume protocol** — 5-step state machine for resuming paused/interrupted councils
- **Staleness detection** — Memory Module freshness checking with 48h threshold and priority-ordered file list
- **Error recovery table** — 8 common failure scenarios with recovery procedures
- **Pseudo-parallel execution** — Protocol for Audit Council's parallel auditor assignment
- **Quality gate checking** — 5-step protocol for Manager phase-transition enforcement
- **Watchdog protocol** — Configurable timeout detection for stuck agents
- **Council archival protocol** — 5-step process for archiving completed councils
- **Task file template** — Standardized format for `.planning/council/tasks/` files
- **Handoff naming convention** — `handoff-{NNN}-{agent-name}.md` format
- **Token efficiency estimates** — Per-routing (~2-4K tokens) and full-session (~15-30K tokens) overhead
- **Memory Module vs Persistent Memory** — Comparison table clarifying the two systems
- **Related Assets table** — Cross-references all commands, workflows, rules, and 9 agent definitions
- **All 7 existing agents updated** — Each now has Council Mode + Standalone Mode sections
- **Rules completely rewritten** — `rules/team-protocol.md` and `cursor-rules/team-protocol.mdc` aligned to LLM Council

### 🔬 Brutal Audit: Persistent Memory (18 issues fixed)
- **Session numbering algorithm** — Deterministic naming: `YYYY-MM-DD-N`
- **Handoff archival** — `handoffs/_history/` preservation before overwrite
- **Codebase scan algorithm** — Explicit scan steps for initialization
- **Multi-agent conflict handling** — Git-based workflow for concurrent agents
- **Auto-save reminder** — Periodic prompts during long sessions
- **Edge case handling** — Missing LATEST.md, partial `.planning/` setups, corrupted files
- **Error recovery section** — Recovery table for common failures
- **Cross-references** — Related commands, workflows, and rules listed
- **Token efficiency** — Disclaimer about approximate token counts
- **All related assets updated** — `commands/memory.md`, `workflows/memory-sync.md`, `rules/memory-protocol.md`, `cursor-rules/memory-protocol.mdc`

### 📝 Documentation
- README updated with prominent "💎 The Gem" section for LLM Council
- Council architecture diagram in README

### 📊 By the Numbers
- 9 agents (+2 new: investigator, fixer)

## [3.3.0] — 2026-02-08 — UI/UX Redesign & Database Deep Dive 🎨🗄️

### 🆕 New Skill
- **ui-ux-redesign** — Full-stack visual audit for frontend redesign. Inventories every backend API and data model, audits every frontend component and design token (colors, spacing, typography, radii, shadows), analyzes user flows for friction points, and produces layered redesign recommendations with implementation waves.

### 🆕 New Command
- `/redesign` — Triggers the UI/UX redesign workflow

### 🆕 New Workflow
- `/redesign` — 8-step workflow: backend inventory → component census → token extraction → UX analysis → consistency scoring → recommendations → implementation plan → report

### 📚 New Examples
- `examples-skills-ui-ux-redesign.md`
- `examples-commands-redesign.md`
- `examples-workflows-redesign.md`

### 🧠 Skill Enhancement
- **database-audit** — Massively enhanced with deep indexing strategy for high-volume tables (logs, activity, notifications). New phases: high-volume table audit, text column indexing strategy, partial indexes, table partitioning, query pattern analysis. Added health scoring per table, DDL examples for every recommendation.

### 🔧 Infrastructure
- **Version sync system** — `scripts/sync-version.js` auto-syncs version and asset counts from `package.json` to `docs/index.html` on every release. `postversion` npm hook ensures everything stays in sync.
- **CI fix** — `publish.yml` now checks if version already exists on npm before publishing (prevents E403 errors)

### 📊 By the Numbers
- 31 skills (+1 new)
- 26 commands (+1 new)
- 30 workflows (+1 new)
- 109 example files (+3 new)

---

## [3.2.0] — 2026-02-08 — Examples & Conformity 📚

### 🆕 New Skill
- **codebase-conformity** — Enforces pattern uniformity across frontend and backend. Requires AI to observe existing code patterns before writing, match them exactly, and double-verify conformity.

### 📚 Comprehensive Examples System
- **106 usage examples** covering every skill, command, workflow, agent, and rule
- **Interactive examples page** (`docs/examples.html`) with agent tabs (Antigravity, Claude Code, Cursor)
- **Wiki examples** with organized sidebar navigation via `_Sidebar.md`
- **Search & filter** functionality on examples page
- **Copy-to-clipboard** for all code examples

### 🌐 Website Improvements
- **Logos fixed** — Copied logos to `docs/logos/` for GitHub Pages access
- **Examples link** added to main navigation
- **Agent-specific syntax** shown in all examples

### 📖 Documentation
- **GEMINI.md enhanced** with:
  - 🚀 Release Process section (how to publish to npm)
  - 🚨 Pre-Commit Checklist (prevent uncommitted changes)
- **.github/GEMINI.md** — Maintainer guide for AI agents

### 📊 By the Numbers
- 30 skills (+1 new)
- 106 example files (100% coverage)
- All assets now have usage examples

---

## [3.1.0] — 2026-02-08 — Quality & CLI Overhaul 🔧

### 🧠 Skills Enhancement
- All 29 skills enhanced to **10/10 quality standard**
- Added **Anti-Shortcut Rules** to every skill — prevents common bypasses
- Added **Common Rationalizations** with rebuttals — addresses excuses for cutting corners
- Added **Iron Questions** to every skill — requires evidence-based answers
- Added **When NOT to Use** sections — clear activation boundaries
- Standardized output formats, red flags, and integration sections across all skills
- Enhanced meta-skills (`writing-skills`, `using-skills`) with comprehensive templates

### 🔧 CLI Overhaul
- **New command:** `update` / `upgrade` — updates all skills and refreshes CLAUDE.md/GEMINI.md sections
- **New command:** `status` — shows installed version, agents, and update availability
- **New flag:** `-y, --yes` — non-interactive mode for CI/CD
- **New:** `.skills-by-amrit.json` manifest for version tracking at project root
- **Fix:** CLAUDE.md/GEMINI.md now uses `<!-- START/END -->` markers — re-installs **update** the section instead of silently skipping
- **Fix:** Only appends a **minimal activation section** with correct per-agent paths (previously appended the entire package file with wrong paths)
- **Fix:** Global installs (`-g`) correctly skip entry point files, commands, workflows, and agents
- **Fix:** Skills output now shows separate new vs updated counts
- **Fix:** Entry point file results are deduplicated when multiple agents share GEMINI.md

### 📝 Entry Point Behavior (CLAUDE.md / GEMINI.md)
- **New file:** Creates with activation section wrapped in boundary markers
- **Existing file, no markers:** Appends activation section (preserves your content)
- **Existing file, has markers:** Replaces only the marked section (your content untouched)
- **Global install:** Entry point files are never modified

### 📊 Memory / Planning
- `.planning/MEMORY.md` is **never** installed by the CLI — always created at runtime per-project by the AI agent
- Confirmed: all `.planning/` files are project-local, never global

### 📖 Documentation
- Added `docs/AUDIT-REPORT.md` — comprehensive quality audit of all 29 skills

---

## [3.0.0] — 2026-02-08 — Agent Intelligence Release 🧠

### 🆕 New Skills
- **persistent-memory** — Automated session memory for ANY agent. Captures decisions, context, and learnings across sessions using file-based protocols. Zero infrastructure — no hooks, no databases, no external services. Inspired by claude-mem.
- **agent-team-coordination** — Multi-role team coordination for ANY agent. Sequential role-switching (Researcher → Architect → Planner → Executor → Reviewer) with shared blackboard and handoff documents. Brings Claude Code Agent Teams to Antigravity, Cursor, and more.
- **full-stack-api-integration** — End-to-end API integration from spec to frontend. Spec analysis, surface mapping, SOLID-compliant API layer design, endpoint implementation, and integration testing.
- **product-completeness-audit** — Functional completeness verification with 5-level spectrum. Placeholder detection, broken flow identification, and API connection validation.
- **brutal-exhaustive-audit** — No-shortcuts 5-pass audit — build verification, route checking, data flow tracing, user flow testing, and edge case validation with strict anti-shortcut rules.

### 🆕 New Commands (25 total)
- `/memory` — Persistent memory management (init, read, write, compress, status)
- `/team` — Agent team coordination (start, resume, next, board, status)
- `/integrate` — Full-stack API integration from spec
- `/health-check` — Product completeness audit
- `/deep-audit` — Brutal exhaustive 5-pass audit
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

### 🆕 New Workflows (29 total)
- `/memory-sync` — Persistent memory synchronization
- `/team-session` — Multi-role team coordination
- `/integrate-api` — Full-stack API integration workflow
- `/product-health-check` — Product completeness audit workflow
- `/deep-audit` — Brutal exhaustive audit workflow
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
- 29 skills (+5 new)
- 25 commands (all new)
- 29 workflows (all new)
- 7 agents (all new)
- 10 cursor rules (all new)
- 5 rules (+2 new)
- **105 total assets**

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

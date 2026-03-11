<p align="center">
  <h1 align="center">🧠 Skills by Amrit</h1>
  <p align="center">
    <strong>The ultimate AI agent skills framework — 32 skills · 34 commands · 37 workflows · 9 agents · 10 cursor rules · 8 hooks · 13 modules · 11 templates</strong>
  </p>
  <p align="center">
    Make your AI coding assistant think like a staff engineer.
  </p>
  <p align="center">
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Get_Started-blue?style=for-the-badge" alt="Get Started"></a>
    <a href="https://boparaiamrit.github.io/skills-by-amrit/"><img src="https://img.shields.io/badge/Website-7c3aed?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Website"></a>
    <a href="https://www.npmjs.com/package/skills-by-amrit"><img src="https://img.shields.io/npm/v/skills-by-amrit?style=for-the-badge&color=red" alt="NPM Version"></a>
    <a href="https://github.com/boparaiamrit/skills-by-amrit/blob/main/LICENSE"><img src="https://img.shields.io/github/license/boparaiamrit/skills-by-amrit?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/boparaiamrit/skills-by-amrit/stargazers"><img src="https://img.shields.io/github/stars/boparaiamrit/skills-by-amrit?style=for-the-badge&color=gold" alt="Stars"></a>
  </p>
  <p align="center">
    <a href="https://github.com/boparaiamrit"><img src="https://img.shields.io/badge/GitHub-boparaiamrit-181717?style=flat-square&logo=github" alt="GitHub"></a>
    <a href="https://x.com/boparaiamrit"><img src="https://img.shields.io/badge/X-@boparaiamrit-000000?style=flat-square&logo=x" alt="X/Twitter"></a>
    <a href="https://github.com/boparaiamrit/skills-by-amrit/wiki"><img src="https://img.shields.io/badge/Wiki-Documentation-0969da?style=flat-square&logo=github" alt="Wiki"></a>
    <a href="https://github.com/sponsors/boparaiamrit"><img src="https://img.shields.io/badge/Sponsor-❤️-ea4aaa?style=flat-square" alt="Sponsor"></a>
  </p>
</p>

---

## 🌟 What is This?

**Skills by Amrit** is a comprehensive, agent-agnostic skills framework that transforms AI coding assistants into senior staff engineers. Install once, use everywhere — across **34+ supported agents** including Antigravity, Cursor, Claude Code, Gemini CLI, Windsurf, Copilot, and more.

---

### 💎 The Gem: LLM Council v2 + Memory Module

> The most powerful pattern in AI-assisted development — real subagent spawning with deterministic orchestration.

**The Memory Module** deeply scans your entire codebase BEFORE any work begins — databases, schemas, API routes, service dependencies, frontend components, tech stack — and creates a structured intelligence layer that persists across sessions.

**Council v2** spawns **real subagents** via `Task()` — each specialist gets a fresh 200k context window. The orchestrator stays lean at ~10-15% context, coordinating through 13 deterministic CLI commands with code-enforced quality gates.

```
                    ╔═══════════════════════════════╗
                    ║     🎯 ORCHESTRATOR (lean)      ║
                    ║  13 CLI commands · Quality gates  ║
                    ║  ~10-15% context · Task() spawn   ║
                    ╚════════════╦══════════════════╝
                                 ║
                        Task() spawning
              ┌──────────────────┼──────────────────┐
       ┌──────▼──┐ ┌──────▼──┐ ┌──▼────┐ ┌──▼──────┐
       │🔬Research│ │📐Planner│ │⚙️Exec │ │🔍Review │
       │ Fresh    │ │ Fresh   │ │ Fresh │ │ Fresh   │
       │ 200k ctx │ │ 200k   │ │ 200k  │ │ 200k   │
       └──────────┘ └────────┘ └──────┘ └─────────┘
```

**What makes it different:**
- ✅ **Real subagent spawning** — each agent gets a fresh 200k context via `Task()`, no context pollution
- ✅ **13 deterministic CLI commands** — `council start`, `council next`, `council status`, etc.
- ✅ **Code-enforced quality gates** — agents cannot advance phases without passing automated checks
- ✅ **6 presets** — Full, Rapid, Debug, Architecture, Refactoring, Audit
- ✅ **Lean orchestrator** — stays at ~10-15% context, delegates deep work to specialists
- ✅ **Zero infrastructure** — pure file-based, works in ANY agent environment

---

### 🏆 Recent Releases

#### v4.1.0 — Intelligence Expansion

- 🤖 **Model routing for all 9 agents** (Opus/Sonnet cost optimization)
- ⚡ **6 new commands:** `/learn`, `/quality-gate`, `/checkpoint`, `/loop`, `/orchestrate`, `/context`
- 🔗 **Multi-agent orchestration** with structured handoffs
- 🪝 **Hook profile system** (minimal/standard/strict)
- 📦 **Plugin marketplace + Codex CLI support**
- 📚 **4 stack-specific example projects**

#### v4.0.0 — Production Infrastructure & 12-Platform Parity

- 🪝 **5 production hooks** — security-gate, statusline, context-monitor, update-check, memory-capture
- ⚙️ **90+ CLI commands** across 13 modules — state, phase, roadmap, verify, config, frontmatter, template, milestone, init, model, council
- 💎 **Council v2** — real subagent spawning via Task(), deterministic state machine (13 commands), code-enforced quality gates
- 🌍 **12-platform parity** — full asset support for Claude Code, Copilot, Codex, Cursor, Windsurf, Cline, Roo, Amp, Augment, Continue, Kilo, Goose
- 📐 **11 templates** — project, plan, summary, requirements, research, state, roadmap, context, verification + config + model profiles

#### v3.5.0 — GSD Planning System ⚡

- 🧠 **Deterministic state management** — `planning-tools.cjs` CLI for structured operations (init, state, config, verify, progress)
- 💬 **`/discuss` command** — Pre-planning MCQ decision capture with quick-answer (`1A 2B 3C`), prevents rework from misaligned assumptions
- 📐 **Context engineering** — Quality Degradation Curve, context budget rules, plans limited to 2-3 tasks max
- ⚙️ **Deviation protocol** — 4-category system (Cosmetic → Major) with auth gates for plan changes during execution
- 📊 **31 skills · 28 commands · 32 workflows · 9 agents**

---

## 🚀 Quick Start

### Install globally (recommended)

```bash
npx skills-by-amrit add
```

This auto-detects your installed agents and installs everything — skills, commands, workflows, agents, and rules — to the right directories.

**New in v4.0.0:** Hooks (security-gate, statusline, context-monitor) are automatically registered during installation. Run `/team` to start a multi-agent council session.

### Install to a specific agent

```bash
npx skills-by-amrit add --agent claude-code
npx skills-by-amrit add --agent cursor
npx skills-by-amrit add --agent antigravity
```

### Install specific skills only

```bash
npx skills-by-amrit add persistent-memory agent-team-coordination
npx skills-by-amrit add code-review systematic-debugging
```

### See everything available

```bash
npx skills-by-amrit list
```

---

## 🏁 Getting Started — Greenfield vs Brownfield

After installing skills, your workflow depends on whether you're starting fresh or joining an existing codebase.

### 🟢 New Project (Greenfield)

> You're building something from scratch. No existing code, no legacy decisions.

```
┌─────────────────────────────────────────────────────────────────┐
│  GREENFIELD WORKFLOW                                            │
│                                                                 │
│  Step 1 ─ /init-project                                         │
│           Creates .planning/ structure, ROADMAP, REQUIREMENTS    │
│           Bootstraps memory system + config.json                 │
│           (Uses: node planning-tools.cjs init)                   │
│                          ▼                                      │
│  Step 2 ─ /discuss                                              │
│           Multiple-choice questions with recommendations         │
│           Quick-answer: "1A 2B 3C 4A 5A"                        │
│           Locks decisions in CONTEXT.md                          │
│                          ▼                                      │
│  Step 3 ─ /plan                                                 │
│           Creates 2-3 task plan respecting locked decisions      │
│           Each task has <files> <action> <verify> <done>         │
│                          ▼                                      │
│  Step 4 ─ /execute                                              │
│           Task-by-task execution with checkpoints                │
│           Deviation protocol for plan changes                    │
│           State tracked by planning-tools.cjs                    │
│                          ▼                                      │
│  Step 5 ─ /verify                                               │
│           Validates implementation against the plan              │
│           Gap closure if anything was missed                     │
└─────────────────────────────────────────────────────────────────┘
```

**Quick start for greenfield:**
```bash
# 1. Install skills
npx skills-by-amrit add

# 2. Tell your AI agent:
/init-project

# 3. The agent will walk you through:
#    → Project context gathering
#    → Requirements capture
#    → Roadmap phases
#    → Then suggest /discuss to lock decisions
```

### 🟡 Existing Codebase (Brownfield)

> You're joining a project that already has code, patterns, and decisions. The AI needs to learn the codebase BEFORE making changes.

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWNFIELD WORKFLOW                                            │
│                                                                 │
│  Step 1 ─ /memory init                                          │
│           Creates .planning/ structure for the existing project  │
│           (Uses: node planning-tools.cjs init)                   │
│                          ▼                                      │
│  Step 2 ─ Codebase Mapping (automatic)                          │
│           Agent scans: file structure, patterns, tech stack      │
│           Writes: MEMORY.md with project brain                   │
│           Captures: architecture, conventions, known issues      │
│                          ▼                                      │
│  Step 3 ─ /discuss                                              │
│           "I want to add [feature] to this existing project"     │
│           Agent asks MCQ questions considering existing patterns  │
│           Quick-answer: "1A 2B 3C 4A"                           │
│                          ▼                                      │
│  Step 4 ─ /plan                                                 │
│           Creates plan that respects existing architecture       │
│           References real files, real patterns, real conventions  │
│                          ▼                                      │
│  Step 5 ─ /execute                                              │
│           Implements following existing patterns                 │
│           codebase-conformity skill ensures consistency           │
│                          ▼                                      │
│  Step 6 ─ /verify                                               │
│           Validates against plan + existing test suite            │
└─────────────────────────────────────────────────────────────────┘
```

**Quick start for brownfield:**
```bash
# 1. Install skills into your existing project
npx skills-by-amrit add

# 2. Tell your AI agent:
/memory init

# 3. Let the agent scan your codebase, then:
/discuss add user preferences feature

# 4. Answer the MCQ questions, then:
/plan
/execute
```

### Key Differences

| | 🟢 Greenfield | 🟡 Brownfield |
|:---|:---|:---|
| **First step** | `/init-project` (full setup) | `/memory init` (lightweight) |
| **Context source** | Your answers to questions | Codebase scanning → MEMORY.md |
| **Patterns** | You define them | Agent discovers existing patterns |
| **Planning** | Free to choose any approach | Must respect existing architecture |
| **Risk** | Low (no breaking changes) | Higher (must be compatible) |
| **Skills activated** | `writing-plans`, `executing-plans` | + `codebase-mapping`, `codebase-conformity` |

### The `/discuss` Quick-Answer Format

When the agent presents multiple-choice questions, you can answer everything in one line:

```
### ⚡ Quick Answer

> All recommended: 1A 2B 3A 4B 5A
>
> Your answer: 1A 2B 3C 4A 5:"use Redis for sessions"
```

| Format | Meaning |
|:---|:---|
| `1A` | Question 1, Option A |
| `2B` | Question 2, Option B |
| `5:"custom text"` | Question 5, Custom answer |
| Just press Enter | Accept all recommendations |

---

## 🏗️ Supported Agents

Skills by Amrit works with **30+ AI coding agents**. **12 platforms have full asset parity** (Claude Code, Copilot, Codex, Cursor, Windsurf, Cline, Roo, Amp, Augment, Continue, Kilo, Goose). Each agent gets assets installed to its native directory:

| | Agent | Skills | Commands | Workflows | Rules |
|:---:|:---|:---:|:---:|:---:|:---:|
| <img src="logos/anthropic-com.png" width="48"> | **Claude Code** | `.claude/skills/` | `.claude/commands/` | — | — |
| <img src="logos/cursor-com.png" width="48"> | **Cursor** | `.cursor/skills/` | — | — | `.cursor/rules/` |
| <img src="logos/gemini-google-com.png" width="48"> | **Antigravity (Gemini)** | `.agent/skills/` | — | `.agent/workflows/` | — |
| <img src="logos/gemini-google-com.png" width="48"> | **Gemini CLI** | `.gemini/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **GitHub Copilot** | `.github/skills/` | — | — | — |
| <img src="logos/windsurf-com.png" width="48"> | **Windsurf** | `.windsurf/skills/` | — | — | — |
| <img src="logos/cline-bot.png" width="48"> | **Cline** | `.cline/skills/` | — | — | — |
| <img src="logos/roocode-com.png" width="48"> | **Roo** | `.roo/skills/` | — | — | — |
| <img src="logos/openai-com.png" width="48"> | **Codex** | `.agents/skills/` | — | — | — |
| <img src="logos/sourcegraph-com.png" width="48"> | **Amp** | `.agents/skills/` | — | — | — |
| <img src="logos/kilocode-ai.png" width="48"> | **Kilo Code** | `.kilocode/skills/` | — | — | — |
| <img src="logos/augmentcode-com.png" width="48"> | **Augment** | `.augment/skills/` | — | — | — |
| <img src="logos/continue-dev.png" width="48"> | **Continue** | `.continue/skills/` | — | — | — |
| <img src="logos/block-github-io.png" width="48"> | **Goose** | `.goose/skills/` | — | — | — |
| <img src="logos/opencode-ai.png" width="48"> | **OpenCode** | `.agents/skills/` | — | — | — |
| <img src="logos/trae-ai.png" width="48"> | **Trae** | `.trae/skills/` | — | — | — |
| <img src="logos/jetbrains-com.png" width="48"> | **Junie** | `.junie/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **OpenClaw** | `skills/` | — | — | — |
| <img src="logos/all-hands-dev.png" width="48"> | **OpenHands** | `.openhands/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **Kode** | `.kode/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **Qoder** | `.qoder/skills/` | — | — | — |
| <img src="logos/zencoder-ai.png" width="48"> | **Mux** | `.mux/skills/` | — | — | — |
| <img src="logos/zencoder-ai.png" width="48"> | **Zencoder** | `.zencoder/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **Crush** | `.crush/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **Droid** | `.factory/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **Command Code** | `.commandcode/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **CodeBuddy** | `.codebuddy/skills/` | — | — | — |
| <img src="logos/mistral-ai.png" width="48"> | **Mistral Vibe** | `.vibe/skills/` | — | — | — |
| <img src="logos/qwen-ai.png" width="48"> | **Qwen Code** | `.qwen/skills/` | — | — | — |
| <img src="logos/pi-ai.png" width="48"> | **Pi** | `.pi/skills/` | — | — | — |
| <img src="logos/replit-com.png" width="48"> | **Replit** | `.agents/skills/` | — | — | — |
| <img src="logos/kiro-dev.png" width="48"> | **Kiro CLI** | `.kiro/skills/` | — | — | — |
| <img src="logos/github-com.png" width="48"> | **iFlow CLI** | `.iflow/skills/` | — | — | — |
| <img src="logos/kimi-ai.png" width="48"> | **Kimi CLI** | `.agents/skills/` | — | — | — |

---

## 📚 Complete Asset Catalog

### 🧠 Skills (32)

Skills are deep instructional documents that teach AI agents HOW to think about specific engineering tasks. Each skill contains principles, protocols, anti-patterns, and quality criteria.

#### 🔷 Core Development (8 skills)

| # | Skill | Description |
|:---:|:---|:---|
| 1 | 💡 **brainstorming** | Creative ideation — mind maps, structured exploration, and divergent thinking before any feature work |
| 2 | 📝 **writing-plans** | Task decomposition — dependency-aware plans with effort estimates, risk assessments, and implementation waves |
| 3 | ⚙️ **executing-plans** | Plan execution — wave-based implementation with checkpoints, inline verification, and state tracking |
| 4 | 🧪 **test-driven-development** | TDD methodology — red-green-refactor cycle, test architecture, fixture patterns, and coverage strategies |
| 5 | 🐛 **systematic-debugging** | Scientific debugging — hypothesis-driven investigation with evidence chains and root cause analysis |
| 6 | 🔍 **code-review** | Structured code review — security, performance, correctness checks with severity-based feedback |
| 7 | ✅ **verification-before-completion** | Completion gates — automated checks, compliance verification, and regression testing before marking done |
| 8 | 📦 **git-workflow** | Git best practices — conventional commits, branching strategies, PR workflows, and conflict resolution |

#### 🔶 Auditing (10 skills)

| # | Skill | Description |
|:---:|:---|:---|
| 9 | 🏛️ **architecture-audit** | Architecture review — modularity, coupling, SOLID compliance, dependency direction, and scalability assessment |
| 10 | 🔒 **security-audit** | Security assessment — OWASP top 10, auth flows, input validation, secrets management, and vulnerability scanning |
| 11 | ⚡ **performance-audit** | Performance profiling — N+1 queries, bundle sizes, runtime bottlenecks, caching opportunities, and load testing |
| 12 | 🗄️ **database-audit** | Database health — schema design, indexing strategy, query optimization, migrations, and normalization review |
| 13 | 🎨 **frontend-audit** | Frontend quality — component architecture, state management, rendering efficiency, and responsive design |
| 14 | 🌐 **api-design-audit** | API design review — REST/GraphQL conventions, versioning, error handling, pagination, and documentation |
| 15 | 📦 **dependency-audit** | Dependency health — outdated packages, security vulnerabilities, license compliance, and bundle impact |
| 16 | 📊 **observability-audit** | Observability review — logging strategy, metrics, tracing, alerting, and production debugging capability |
| 17 | ♿ **accessibility-audit** | Accessibility compliance — WCAG standards, keyboard navigation, screen reader support, and color contrast |
| 18 | 🔄 **ci-cd-audit** | CI/CD pipeline review — build times, test reliability, deployment safety, and pipeline optimization |

#### 🔷 Evolution (4 skills)

| # | Skill | Description |
|:---:|:---|:---|
| 19 | ♻️ **refactoring-safely** | Safe refactoring — incremental transformation with test coverage, feature flags, and rollback strategies |
| 20 | 📖 **writing-documentation** | Documentation authoring — API docs, architecture diagrams, README standards, and knowledge transfer |
| 21 | 🗺️ **codebase-mapping** | Codebase analysis — module boundaries, dependency graphs, entry points, and health metrics |
| 22 | 🚨 **incident-response** | Incident handling — triage protocols, root cause analysis, post-mortems, and prevention measures |

#### 🟣 Agent Intelligence (2 skills) — ✨ NEW in v3

| # | Skill | Description |
|:---:|:---|:---|
| 23 | 💾 **persistent-memory** | Automated session memory — captures decisions, context, and learnings across sessions via file-based protocols. Zero infrastructure, works in ANY agent. Inspired by [claude-mem](https://github.com/thedotmack/claude-mem). |
| 24 | 💎 **agent-team-coordination** | **LLM Council** — Manager-orchestrated multi-agent coordination with Memory Module. Manager has full project knowledge (schemas, routes, services), dynamically routes tasks to specialist sub-agents, enables peer communication, handles escalations across 6 council presets. |

#### 🔶 Integration & Completeness (3 skills) — ✨ NEW

| # | Skill | Description |
|:---:|:---|:---|
| 25 | 🔗 **full-stack-api-integration** | End-to-end API integration — spec analysis, surface mapping, SOLID-compliant API layer design, systematic endpoint implementation, and integration testing |
| 26 | 🏥 **product-completeness-audit** | Functional completeness verification — 5-level completeness spectrum, placeholder detection, broken flow identification, and API connection validation |
| 27 | 🔬 **brutal-exhaustive-audit** | No-shortcuts 5-pass audit — build verification, route checking, data flow tracing, user flow testing, and edge case validation with anti-shortcut rules |

#### 🔸 Meta (4 skills)

| # | Skill | Description |
|:---:|:---|:---|
| 28 | 📘 **using-skills** | How to use and combine skills effectively in your workflow |
| 29 | ✍️ **writing-skills** | How to create new skills — format, quality standards, and testing requirements |
| 30 | 🔄 **codebase-conformity** | Pattern uniformity enforcement — read existing patterns before writing, match them exactly, double-verify conformity before claiming done |
| 31 | 🎨 **ui-ux-redesign** | Full-stack visual audit — inventories backend APIs, audits every component and design token, analyzes user flows, and produces layered redesign recommendations |
| 32 | 📏 **_rules** | Master rules skill — consolidates core principles, anti-hallucination protocol, severity framework, and skill activation table |

---

### ⚡ Commands (34)

Commands are Claude Code slash commands (`.md` files installed to `.claude/commands/`). They provide structured workflows for common project tasks.

#### 🔷 Project Lifecycle

| Command | Description |
|:---|:---|
| `/init-project` | 🏗️ Initialize a new project with `.planning/` directory — `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json`. Uses `planning-tools.cjs` for deterministic bootstrapping. |
| `/discuss` | 💬 Pre-planning MCQ decision capture — presents multiple-choice questions with recommendations, quick-answer format (`1A 2B 3C`), locks decisions in CONTEXT.md — ✨ NEW |
| `/plan` | 📋 Create a 2-3 task implementation plan with task anatomy (`<files>` `<action>` `<verify>` `<done>`), context budgets, and locked decision enforcement |
| `/execute` | ⚙️ Execute an implementation plan with deviation protocol (4 categories), checkpoint system, and `planning-tools.cjs` state management |
| `/verify` | ✅ Validate implementations against plans — automated checks, compliance verification, regression testing, conversational UAT |
| `/progress` | 📊 Display project progress, phase status, and task completion from `.planning/` state files |
| `/settings` | ⚙️ View/modify project config — mode (interactive/auto), depth (quick/standard/comprehensive), workflow preferences — ✨ NEW |

#### 🔷 Research & Documentation

| Command | Description |
|:---|:---|
| `/research` | 🔬 Deep research on topics before planning — generates structured reports in `.planning/research/` |
| `/doc` | 📖 Generate documentation for code, APIs, architecture, or setup |
| `/explain` | 💡 Provide detailed explanations of code, architecture, or concepts |

#### 🔷 Code Quality

| Command | Description |
|:---|:---|
| `/review` | 🔍 Structured code review with severity-based feedback (critical/major/minor/nit) |
| `/test` | 🧪 Generate and run tests — unit, integration, e2e with coverage reporting |
| `/debug` | 🐛 Scientific debugging with hypothesis tracking and evidence chains |
| `/fix-issue` | 🔧 Diagnose and fix specific issues with minimal changes and regression testing |
| `/refactor` | ♻️ Safe refactoring with test coverage and incremental transformation |

#### 🔷 Operations & Security

| Command | Description |
|:---|:---|
| `/migrate` | 🗄️ Database or code migrations with safety checks, rollback strategies, and data validation |
| `/performance` | ⚡ Profile and analyze application performance with benchmarking |
| `/security-scan` | 🔒 Comprehensive security scan — OWASP top 10, secrets detection, dependency vulnerabilities |
| `/deploy-check` | 🚀 Pre-deployment validation checklist |
| `/audit` | 📋 Full codebase audit — linting, secrets, console logs, TODOs |

#### 🔷 Workflow

| Command | Description |
|:---|:---|
| `/quick` | ⚡ Execute small, well-defined tasks without full project planning |
| `/commit` | 📦 Create well-formatted Conventional Commits with proper scope and body |

#### 🟣 Agent Intelligence — ✨ NEW in v3

| Command | Description |
|:---|:---|
| `/memory` | 💾 Persistent memory management — `init`, `read`, `write`, `compress`, `status` operations |
| `/team` | 🤝 Multi-role team coordination — `start`, `resume`, `next`, `board`, `status` operations |

#### 🔶 Integration & Auditing — ✨ NEW

| Command | Description |
|:---|:---|
| `/integrate` | 🔗 Full-stack API integration from spec — surface mapping, SOLID architecture, endpoint implementation, and verification |
| `/health-check` | 🏥 Product completeness audit — route inventory, placeholder detection, flow testing, and API connection checks |
| `/deep-audit` | 🔬 Brutal exhaustive 5-pass audit — build, routes, data flow, user flows, and edge cases with anti-shortcut rules |
| `/redesign` | 🎨 Full UI/UX redesign audit — visual audit, component census, token extraction, UX analysis, layered redesign plan |

#### 🟡 Intelligence & Orchestration — ✨ NEW in v4.1

| Command | Description |
|:---|:---|
| `/learn` | 📚 Extract reusable patterns from sessions across 8 categories with deduplication, persisted to `.planning/LEARNINGS.md` |
| `/quality-gate` | ✅ 6-step quality pipeline (Build → Type Check → Lint → Test → Security → Diff) with 4 modes: quick, full, pre-commit, pre-pr |
| `/checkpoint` | 📍 Named progress snapshots with create/verify/list modes stored in `.planning/checkpoints/` |
| `/loop` | 🔁 Bounded loop execution — repetitive tasks with safety bounds (max iterations, stall detection, test-between-iterations) |
| `/orchestrate` | 🔗 Multi-agent orchestration — chain agents in predefined sequences (feature, bugfix, refactor, security) with structured handoffs |
| `/context` | 🎯 Context mode switching — dev (code-first), research (read-widely), review (quality-first) modes that change workflow behavior |

---

### 🔄 Workflows (37)

Workflows are Antigravity step-by-step execution scripts (`.md` files installed to `.agent/workflows/`). Many include `// turbo` annotations for auto-execution.

| Workflow | Description |
|:---|:---|
| `/init-project` | 🏗️ Initialize project with `.planning/` structure |
| `/discuss` | 💬 Pre-planning MCQ discussion with quick-answer —  ✨ NEW |
| `/plan-feature` | 📋 Plan a feature with research, design, and task decomposition |
| `/execute` | ⚙️ Execute plans with wave-based steps and verification |
| `/verify` | ✅ Validate implementation against plans |
| `/research` | 🔬 Deep research with structured report output |
| `/progress` | 📊 Display project status and completion |
| `/quick` | ⚡ Quick task execution without full planning |
| `/debug` | 🐛 Scientific debugging workflow |
| `/fix-issue` | 🔧 Issue diagnosis and fix |
| `/review` | 🔍 Structured code review |
| `/test` | 🧪 Test generation and execution |
| `/refactor` | ♻️ Safe refactoring with tests |
| `/commit` | 📦 Conventional commit creation |
| `/doc` | 📖 Documentation generation |
| `/explain` | 💡 Code explanation |
| `/audit` | 📋 Codebase audit |
| `/security-scan` | 🔒 Security scanning |
| `/performance` | ⚡ Performance profiling |
| `/migrate` | 🗄️ Database/code migration |
| `/deploy-check` | 🚀 Deployment validation |
| `/release` | 🏷️ Release preparation |
| `/codebase-map` | 🗺️ Codebase analysis and mapping |
| `/deps-update` | 📦 Dependency updates |
| `/incident-response` | 🚨 Incident triage and response |
| `/memory-sync` | 💾 Memory read/write/compress operations — ✨ NEW |
| `/team-session` | 🤝 Multi-role team coordination — ✨ NEW |
| `/integrate-api` | 🔗 Full-stack API integration workflow — ✨ NEW |
| `/product-health-check` | 🏥 Product completeness audit workflow — ✨ NEW |
| `/deep-audit` | 🔬 Brutal exhaustive audit workflow — ✨ NEW |
| `/redesign` | 🎨 Full UI/UX redesign workflow — ✨ NEW |
| `/gap-closure` | 🔧 Close execution gaps with focused mini-plans — ✨ NEW |

---

### 🤖 Agents (9)

Agent definitions are specialist AI personas (`.md` files installed to `.claude/agents/`). Each agent has detailed protocols, principles, and anti-patterns.

| Agent | Emoji | Description |
|:---|:---:|:---|
| **researcher** | 🔬 | Deep codebase and domain research — gathers comprehensive evidence and context before planning. Emphasizes accuracy, exhaustive search, and source attribution. |
| **planner** | 📋 | Plans-as-prompts — generates dependency-aware plans with task anatomy (`<files>` `<action>` `<verify>` `<done>`), context budgets, locked decision enforcement, and multi-plan sequencing. |
| **executor** | ⚙️ | Plan execution with deviation protocol — implements tasks with checkpoint handling (standard/context/blocker), DON'T/AVOID instruction enforcement, and `planning-tools.cjs` state management. |
| **reviewer** | 🔍 | Structured code review — examines changes for correctness, security, performance, patterns, and maintainability. Provides severity-based feedback. |
| **debugger** | 🐛 | Scientific debugging with hypothesis tracking — investigates issues using hypothesis-driven methodology with evidence chains and persistent state. |
| **verifier** | ✅ | Work verification and gap analysis — validates implementation against plans, runs comprehensive checks, identifies gaps, and generates fix plans. |
| **mapper** | 🗺️ | Codebase mapping and dependency analysis — analyzes project structure, module boundaries, dependencies, patterns, and health metrics. |
| **investigator** | 🕵️ | Deep investigation for Debug Council — forensic analysis of complex bugs with evidence chains and timeline reconstruction. |
| **fixer** | 🔧 | Targeted fix implementation for Debug Council — minimal, surgical fixes with regression prevention and rollback strategies. |

---

### 🎯 Cursor Rules (10)

Cursor rules are `.mdc` files installed to `.cursor/rules/`. They guide Cursor AI's behavior for specific concerns.

| Rule | Description |
|:---|:---|
| 🏗️ **core-development** | Code quality standards — SOLID principles, DRY, error handling, testing, and Git commit conventions |
| 🚫 **anti-hallucination** | Anti-fabrication protocol — mandates verification of APIs, paths, configs before use. Prevents hallucinated code. |
| 📋 **planning-workflow** | Structured planning — research → design → decompose → estimate → document workflow |
| 🐛 **debugging-protocol** | Scientific debugging — hypothesis → test → evidence → root cause methodology |
| 🔒 **security** | Security best practices — auth, input validation, data handling, secrets management |
| 🗄️ **database** | Database rules — schema design, indexing, query optimization, migrations |
| 🧪 **testing** | Testing standards — coverage requirements, fixture patterns, assertion quality |
| 🔍 **code-review** | Code review checklist — automated and manual review criteria |
| 💾 **memory-protocol** | Persistent memory — auto-read MEMORY.md on start, auto-write on end — ✨ NEW |
| 🤝 **team-protocol** | Team coordination — sequential role-switching with blackboard — ✨ NEW |

---

### 📏 Rules (5)

Universal rules (`.md` files) that can be appended to `GEMINI.md`, `CLAUDE.md`, or any agent's system prompt.

| Rule | Description |
|:---|:---|
| 🏗️ **core-principles** | Foundational engineering principles — SOLID, DRY, KISS, YAGNI, and clean architecture |
| 🚫 **anti-hallucination** | Verification-first protocol — never fabricate APIs, paths, or configs |
| ⚖️ **severity-framework** | Issue severity classification — critical/major/minor/nit with response criteria |
| 💾 **memory-protocol** | Persistent memory instructions — auto-read and auto-write `.planning/MEMORY.md` — ✨ NEW |
| 🤝 **team-protocol** | Team coordination instructions — role-switching and blackboard protocol — ✨ NEW |

---

## 💾 Persistent Memory + State Management

### The Problem
Every AI session starts from scratch. You explain the same architecture, repeat the same decisions, and lose context.

### The Solution
File-based memory protocol + deterministic state management — no hooks, no databases, no external services. Works in **ANY** agent.

```
.planning/
├── MEMORY.md                    # 🧠 Project brain (~300 lines max)
├── STATE.md                     # 📍 Current position (phase/plan/task)
├── config.json                  # ⚙️ Mode, depth, preferences
├── sessions/                    # 📝 Session logs
├── decisions/DECISIONS.md       # 📋 Decision log (append-only)
├── plans/                       # 📋 Implementation plans
├── research/                    # 🔬 Research + CONTEXT.md from /discuss
├── context/
│   ├── architecture.md          # 🏗️ Architecture decisions
│   ├── patterns.md              # 🔄 Established patterns
│   ├── gotchas.md               # ⚠️ Known issues
│   └── tech-debt.md             # 🔧 Technical debt
└── handoffs/LATEST.md           # 📤 Last session's handoff
```

### `planning-tools.cjs` — Deterministic State Management

LLMs are unreliable at structured file operations. The `planning-tools.cjs` CLI handles these deterministically:

```bash
# Bootstrap the .planning/ directory
node planning-tools.cjs init

# Track execution progress
node planning-tools.cjs state load              # Where am I?
node planning-tools.cjs state advance-task      # Mark task complete
node planning-tools.cjs state add-decision      # Record a decision
node planning-tools.cjs state add-blocker       # Flag a blocker

# Manage configuration
node planning-tools.cjs config get mode         # interactive or auto?
node planning-tools.cjs config set depth comprehensive

# Validate and report
node planning-tools.cjs verify structure        # Is .planning/ intact?
node planning-tools.cjs progress                # Show dashboard
```

### How Memory Works

```
SESSION START                    DURING SESSION                  SESSION END
┌────────────────────┐           ┌────────────────────────┐      ┌────────────────────┐
│ 1. Read MEMORY.md  │           │ 4. planning-tools.cjs  │      │ 8. Create session  │
│ 2. Read LATEST.md  │           │    tracks state changes│      │    log              │
│ 3. Read config.json│           │ 5. Decisions → log     │      │ 9. Write handoff   │
│    Full context!   │           │ 6. Blockers → flag     │      │ 10. Update memory  │
└────────────────────┘           └────────────────────────┘      └────────────────────┘
```

### Setup

#### For Antigravity
Add to `~/.gemini/GEMINI.md`:
```markdown
## 🧠 Automatic Memory Protocol
ALWAYS at the START: read .planning/MEMORY.md and .planning/handoffs/LATEST.md
ALWAYS at the END: update MEMORY.md, write handoffs/LATEST.md
```

#### For Cursor
Install the `memory-protocol.mdc` rule (auto-installed with `npx skills-by-amrit add`).

#### For Claude Code
Use `/memory init` to initialize, `/memory write` to save.

### Comparison with claude-mem

| | claude-mem | Skills by Amrit |
|:---|:---:|:---:|
| Infrastructure | SQLite + Chroma + Bun | Zero ✅ |
| Agent support | Claude Code only | ANY agent ✅ |
| State management | None | `planning-tools.cjs` CLI ✅ |
| Capture method | Lifecycle hooks | Instruction-based |
| Storage | Database | Markdown files (git!) |
| Setup | Plugin install + config | Add 4 lines to GEMINI.md |

---

## 💎 LLM Council v2 — Agent Team Coordination

### The Problem
AI coding tasks fail at scale because no single agent can hold all context: database schemas, API routes, service dependencies, frontend components, and business logic — simultaneously. Linear handoffs lose context. Role-switching in a single context window wastes tokens.

### The Solution: Real Subagent Spawning + Deterministic Orchestration

**Council v2** replaces the old role-switching pattern with **real subagent spawning** via `Task()`. Each specialist agent gets a fresh 200k context window — no shared context pollution. The orchestrator stays lean at ~10-15% context usage.

```
                    ╔═══════════════════════════════╗
                    ║     🎯 ORCHESTRATOR (lean)      ║
                    ║  ~10-15% context usage           ║
                    ║  13 deterministic CLI commands    ║
                    ║  Code-enforced quality gates      ║
                    ╚════════════╦══════════════════╝
                                 ║
                        Task() spawning
              ┌──────────────────┼──────────────────┐
       ┌──────▼──┐ ┌──────▼──┐ ┌──▼────┐ ┌──▼──────┐
       │🔬Research│ │📐Planner│ │⚙️Exec │ │🔍Review │
       │ Fresh    │ │ Fresh   │ │ Fresh │ │ Fresh   │
       │ 200k ctx │ │ 200k   │ │ 200k  │ │ 200k   │
       └──────────┘ └────────┘ └──────┘ └─────────┘
```

### Key Capabilities

| Capability | Description |
|:---|:---|
| 🧠 **Real subagent spawning** | Each agent gets a fresh 200k context via `Task()` — no shared context pollution |
| 🎛️ **13 CLI commands** | Deterministic state machine for council orchestration (`council start`, `council next`, `council status`, etc.) |
| 🚪 **Code-enforced quality gates** | Agents cannot advance phases without passing automated gate checks |
| 🎯 **6 presets** | Full, Rapid, Debug, Architecture, Refactoring, Audit councils |
| 📐 **Lean orchestrator** | Orchestrator uses ~10-15% context — delegates deep work to specialists |
| 🧠 **Memory Module** | Deep intelligence layer: schemas, routes, services, components, tech stack |

---

## 📁 Project Structure

```
skills-by-amrit/
├── 📂 skills/                   # 32 deep instructional skills
│   ├── brainstorming/SKILL.md
│   ├── writing-plans/SKILL.md          # Plans-as-prompts with task anatomy
│   ├── executing-plans/SKILL.md        # Deviation protocol + checkpoints
│   ├── persistent-memory/SKILL.md
│   ├── agent-team-coordination/SKILL.md
│   └── ... (26 more)
├── 📂 commands/                 # 34 Claude Code slash commands
│   ├── init-project.md
│   ├── discuss.md                       ✨ MCQ decision capture
│   ├── settings.md                      ✨ Config management
│   ├── memory.md
│   ├── team.md
│   └── ... (23 more)
├── 📂 workflows/                # 37 Antigravity workflows
│   ├── init-project.md
│   ├── discuss.md                       ✨ MCQ discussion workflow
│   ├── gap-closure.md                   ✨ Execution gap closure
│   ├── memory-sync.md
│   ├── team-session.md
│   └── ... (27 more)
├── 📂 agents/                   # 9 specialist agent definitions
│   ├── planner.md                       # Plans-as-prompts, locked decisions
│   ├── executor.md                      # Deviation protocol, context awareness
│   ├── investigator.md                  # Debug Council forensics
│   ├── fixer.md                         # Debug Council surgical fixes
│   └── ... (5 more)
├── 📂 scripts/                  # Deterministic tooling
│   └── planning-tools.cjs              # State management CLI
├── 📂 cursor-rules/             # 10 Cursor .mdc rules
│   ├── core-development.mdc
│   ├── memory-protocol.mdc
│   └── ... (8 more)
├── 📂 rules/                    # 5 universal agent rules
│   ├── core-principles.md               # + Context Engineering principle
│   ├── memory-protocol.md              # + planning-tools.cjs integration
│   └── ... (3 more)
├── 📂 docs/                     # Documentation
├── 📂 src/                      # CLI source
│   └── cli.ts
├── CLAUDE.md                    # Claude Code integration
├── GEMINI.md                    # Gemini/Antigravity integration
├── package.json
└── README.md                    # You are here!
```

---

## 🛠️ CLI Reference

### Commands

```bash
# Install everything (auto-detect agents)
npx skills-by-amrit add

# Install to specific agent
npx skills-by-amrit add --agent antigravity
npx skills-by-amrit add --agent cursor
npx skills-by-amrit add --agent claude-code

# Install globally (available in all projects)
npx skills-by-amrit add --global

# Install specific skills
npx skills-by-amrit add persistent-memory code-review

# Update all skills to latest version
npx skills-by-amrit update

# Show installation status and version
npx skills-by-amrit status

# List all available assets
npx skills-by-amrit list

# Show supported agents
npx skills-by-amrit agents

# Non-interactive install (CI/CD friendly)
npx skills-by-amrit add --all -y -a '*'

# Show help
npx skills-by-amrit help
```

### Flags

| Flag | Description |
|:---|:---|
| `-a, --agent <name>` | Install to a specific agent (use `'*'` for all) |
| `-g, --global` | Install globally (user home) instead of project |
| `--all` | Install all available skills |
| `-y, --yes` | Non-interactive mode (auto-accept) |
| `--help` | Show help text |

### Install Behavior

| Asset | Local Install | Global Install (`-g`) |
|:---|:---|:---|
| **Skills** | Copied to agent dir. Re-running updates existing. | Copied to global agent dir. |
| **Commands** | Copied to `.claude/commands/` | ❌ Skipped |
| **Workflows** | Copied to `.agent/workflows/` | ❌ Skipped |
| **Agent Defs** | Copied to `.claude/agents/` | ❌ Skipped |
| **Cursor Rules** | Copied to `.cursor/rules/` | ❌ Skipped |
| **CLAUDE.md** | Appends activation section (preserves your content). Updates on re-install. | ❌ Skipped |
| **GEMINI.md** | Appends activation section (preserves your content). Updates on re-install. | ❌ Skipped |
| **Memory** | Never installed (created at runtime per-project). | ❌ Never installed |

### What Gets Installed Where

| Asset Type | Claude Code | Cursor | Antigravity |
|:---|:---|:---|:---|
| Skills | `.claude/skills/` | `.cursor/skills/` | `.agent/skills/` |
| Commands | `.claude/commands/` | — | — |
| Workflows | — | — | `.agent/workflows/` |
| Agent Defs | `.claude/agents/` | — | — |
| Rules | — | `.cursor/rules/` | — |

---

## 📖 Documentation

| Document | Description |
|:---|:---|
| [🌐 Website](https://boparaiamrit.github.io/skills-by-amrit/) | Beautiful documentation site with full asset catalog |
| [📖 Wiki](https://github.com/boparaiamrit/skills-by-amrit/wiki) | Comprehensive GitHub Wiki with guides and reference |
| [Agent Teams & Memory](docs/AGENT-TEAMS-AND-MEMORY.md) | Comprehensive guide to the team coordination and persistent memory systems |
| [Competitive Analysis](docs/COMPETITIVE_ANALYSIS.md) | Analysis of GSD, Claude Code, Cursor, and Antigravity frameworks |
| [Audit Report](docs/AUDIT-REPORT.md) | Comprehensive 10/10 quality audit of all 29 skills |
| [Contributing](CONTRIBUTING.md) | How to contribute to this project |
| [Changelog](CHANGELOG.md) | Version history and release notes |

---

## 🔄 Version History

### v3.1.0 — Quality & CLI Overhaul 🔧

**Skills Enhancement:**
- All 29 skills enhanced to 10/10 quality standard
- Added Anti-Shortcut Rules, Common Rationalizations, Iron Questions to every skill
- Added When NOT to Use sections for clear activation boundaries
- Standardized output formats, red flags, and integration sections

**CLI Overhaul:**
- **New:** `update` / `upgrade` command — updates all skills and refreshes entry point files
- **New:** `status` command — shows installed version, agents, update availability
- **New:** `.skills-by-amrit.json` manifest for version tracking
- **Fix:** CLAUDE.md/GEMINI.md now uses `<!-- START/END -->` markers — re-installs update the section instead of skipping
- **Fix:** Only appends a minimal activation section with correct per-agent paths (previously appended entire package file)
- **Fix:** Global installs correctly skip entry point files, commands, workflows, and agents
- **Fix:** Skills output now shows new vs updated counts
- **Note:** Memory/planning is never installed by CLI — always created at runtime per-project

### v3.0.0 — Agent Intelligence Release 🧠

**New Skills:**
- 💾 `persistent-memory` — Zero-infrastructure session memory for ANY agent
- 💎 `agent-team-coordination` — LLM Council with Memory Module for ANY agent

**New Commands (25 total):**
- `/memory` — Memory management (init, read, write, compress, status)
- `/team` — Team coordination (start, resume, next, board, status)
- `/init-project`, `/execute`, `/verify`, `/research`, `/progress`
- `/quick`, `/migrate`, `/performance`, `/security-scan`, `/doc`, `/explain`, `/fix-issue`
- `/deploy-check`, `/audit`, `/refactor`, `/test`, `/review`, `/debug`, `/commit`, `/plan`

**New Workflows (29 total):**
- `/memory-sync` — Persistent memory synchronization
- `/team-session` — Multi-role team sessions
- Plus 24 more workflows for the full project lifecycle

**New Agents (7):**
- `researcher`, `planner`, `executor`, `reviewer`, `debugger`, `verifier`, `mapper`

**New Cursor Rules (10):**
- `memory-protocol.mdc`, `team-protocol.mdc`
- Plus 8 more: core-development, anti-hallucination, planning, debugging, security, database, testing, code-review

**New Rules (5):**
- `memory-protocol.md`, `team-protocol.md`
- Plus: core-principles, anti-hallucination, severity-framework

**CLI Enhancements:**
- Install commands, workflows, agents, and cursor rules alongside skills
- Agent-aware directory mapping
- Comprehensive asset listing with full inventory display

### v2.0.0 — Multi-Agent Support
- 30+ supported AI coding agents
- Skill categories and organization
- Interactive agent selection

### v1.0.0 — Initial Release
- 24 core skills
- Claude Code integration
- Basic CLI

---

## 📊 By the Numbers

| Metric | Count |
|:---:|:---:|
| 🧠 Skills | **32** |
| ⚡ Commands | **34** |
| 🔄 Workflows | **37** |
| 🤖 Agents | **9** |
| 🎯 Cursor Rules | **10** |
| 📏 Rules | **5** |
| 🪝 Hooks | **8** |
| 📦 CLI Modules | **13** |
| 📐 Templates | **11** |
| 📚 References | **2** |
| 🎛️ Council Commands | **13** |
| 🤖 Supported Agents | **34** |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Clone the repo
git clone https://github.com/boparaiamrit/skills-by-amrit.git

# Install dependencies
npm install

# Build
npm run build

# Test locally
node dist/cli.js list
```

---

## 🙏 Acknowledgments

This project stands on the shoulders of giants. Huge thanks to these projects that inspired and influenced the design of Skills by Amrit:

| | Project | Author | Contribution |
|:---:|:---|:---|:---|
| <img src="logos/github-com.png" width="24"> | [**Superpowers**](https://github.com/obra/superpowers) | Jesse Vincent ([@obra](https://github.com/obra)) | Pioneered the agentic skills framework concept — composable skills, TDD-first workflows, and subagent-driven development. The foundation we all build on. |
| <img src="logos/github-com.png" width="24"> | [**GSD (Get Shit Done)**](https://github.com/glittercowboy/get-shit-done) | [@glittercowboy](https://github.com/glittercowboy) | Spec-driven development with context rot prevention, parallel agent spawning, and executable plans. Showed how to keep AI agents focused and productive. |
| <img src="logos/anthropic-com.png" width="24"> | [**Agent Skills Standard**](https://docs.anthropic.com/en/docs/agents/agent-skills) | Anthropic | The open standard for packaging and sharing AI agent capabilities via `SKILL.md` files. |
| <img src="logos/skills-sh.png" width="24"> | [**skills.sh**](https://skills.sh) | Community | The agent skills directory and CLI that makes skill discovery and installation universal. |

---

## 📄 License

[MIT](LICENSE) © [Amritpal Singh Boparai](https://github.com/boparaiamrit)

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/boparaiamrit">Amritpal Singh Boparai</a></strong>
  <br>
  <sub>Making AI agents think like staff engineers, one skill at a time.</sub>
  <br><br>
  <a href="https://github.com/boparaiamrit">🐙 GitHub</a> · <a href="https://x.com/boparaiamrit">🐦 X/Twitter</a> · <a href="https://boparaiamrit.github.io/skills-by-amrit/">🌐 Website</a>
</p>

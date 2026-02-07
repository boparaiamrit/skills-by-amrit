<p align="center">
  <h1 align="center">🧠 Skills by Amrit</h1>
  <p align="center">
    <strong>The ultimate AI agent skills framework — 26 skills · 22 commands · 26 workflows · 7 agents · 10 cursor rules</strong>
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
  </p>
</p>

---

## 🌟 What is This?

**Skills by Amrit** is a comprehensive, agent-agnostic skills framework that transforms AI coding assistants into senior staff engineers. Install once, use everywhere — across **30+ supported agents** including Antigravity, Cursor, Claude Code, Gemini CLI, Windsurf, Copilot, and more.

### 🏆 v3.0.0 Highlights

| What's New | Count | Description |
|:---|:---:|:---|
| 🧠 **Skills** | 26 | Deep instructional skills for the full SDLC |
| ⚡ **Commands** | 22 | Claude Code slash commands for project lifecycle |
| 🔄 **Workflows** | 26 | Antigravity workflows with turbo-mode steps |
| 🤖 **Agents** | 7 | Specialist agent definitions (researcher, executor, etc.) |
| 🎯 **Cursor Rules** | 10 | `.mdc` rules for Cursor AI behavior |
| 📏 **Rules** | 5 | Universal rules for GEMINI.md/CLAUDE.md |
| 🤝 **Agent Teams** | ✅ | Claude Code-style team coordination — for ANY agent |
| 💾 **Persistent Memory** | ✅ | Like claude-mem — zero infrastructure, ANY agent |

---

## 🚀 Quick Start

### Install globally (recommended)

```bash
npx skills-by-amrit add
```

This auto-detects your installed agents and installs everything — skills, commands, workflows, agents, and rules — to the right directories.

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

## 🏗️ Supported Agents

Skills by Amrit works with **30+ AI coding agents**. Each agent gets assets installed to its native directory:

| Flag | Agent | Skills | Commands | Workflows | Rules |
|:---:|:---|:---:|:---:|:---:|:---:|
| 🟣 | **Claude Code** | `.claude/skills/` | `.claude/commands/` | — | — |
| 🔵 | **Cursor** | `.cursor/skills/` | — | — | `.cursor/rules/` |
| 🟢 | **Antigravity (Gemini)** | `.agent/skills/` | — | `.agent/workflows/` | — |
| 🟡 | **Gemini CLI** | `.gemini/skills/` | — | — | — |
| ⚫ | **GitHub Copilot** | `.github/skills/` | — | — | — |
| 🟠 | **Windsurf** | `.windsurf/skills/` | — | — | — |
| 🔴 | **Cline** | `.cline/skills/` | — | — | — |
| 🟤 | **Roo** | `.roo/skills/` | — | — | — |
| ⚪ | **Codex** | `.agents/skills/` | — | — | — |
| 🟣 | **Amp** | `.agents/skills/` | — | — | — |
| 🔵 | **Kilo Code** | `.kilocode/skills/` | — | — | — |
| 🟢 | **Augment** | `.augment/skills/` | — | — | — |
| 🟡 | **Continue** | `.continue/skills/` | — | — | — |
| ⚫ | **Goose** | `.goose/skills/` | — | — | — |
| 🟠 | **OpenCode** | `.agents/skills/` | — | — | — |
| 🔴 | **Trae** | `.trae/skills/` | — | — | — |
| 🟤 | **Junie** | `.junie/skills/` | — | — | — |
| ⚪ | **OpenClaw** | `skills/` | — | — | — |
| 🟣 | **OpenHands** | `.openhands/skills/` | — | — | — |
| 🔵 | **Kode** | `.kode/skills/` | — | — | — |
| 🟢 | **Qoder** | `.qoder/skills/` | — | — | — |
| 🟡 | **Mux** | `.mux/skills/` | — | — | — |
| ⚫ | **Zencoder** | `.zencoder/skills/` | — | — | — |
| 🟠 | **Crush** | `.crush/skills/` | — | — | — |
| 🔴 | **Droid** | `.factory/skills/` | — | — | — |
| 🟤 | **Command Code** | `.commandcode/skills/` | — | — | — |
| ⚪ | **CodeBuddy** | `.codebuddy/skills/` | — | — | — |
| 🟣 | **Mistral Vibe** | `.vibe/skills/` | — | — | — |
| 🔵 | **Qwen Code** | `.qwen/skills/` | — | — | — |
| 🟢 | **Pi** | `.pi/skills/` | — | — | — |
| 🟡 | **Replit** | `.agents/skills/` | — | — | — |
| ⚫ | **Kiro CLI** | `.kiro/skills/` | — | — | — |
| 🟠 | **iFlow CLI** | `.iflow/skills/` | — | — | — |
| 🔴 | **Kimi CLI** | `.agents/skills/` | — | — | — |

---

## 📚 Complete Asset Catalog

### 🧠 Skills (26)

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
| 24 | 🤝 **agent-team-coordination** | Multi-role team coordination — sequential role-switching (Researcher → Architect → Planner → Executor → Reviewer) with shared blackboard. Brings [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams) to ANY agent. |

#### 🔸 Meta (2 skills)

| # | Skill | Description |
|:---:|:---|:---|
| 25 | 📘 **using-skills** | How to use and combine skills effectively in your workflow |
| 26 | ✍️ **writing-skills** | How to create new skills — format, quality standards, and testing requirements |

---

### ⚡ Commands (22)

Commands are Claude Code slash commands (`.md` files installed to `.claude/commands/`). They provide structured workflows for common project tasks.

#### 🔷 Project Lifecycle

| Command | Description |
|:---|:---|
| `/init-project` | 🏗️ Initialize a new project with `.planning/` directory — `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`, `config.json` |
| `/plan` | 📋 Create a detailed implementation plan with task decomposition, dependencies, and effort estimates |
| `/execute` | ⚙️ Execute an implementation plan with wave-based parallelization, checkpoints, and inline verification |
| `/verify` | ✅ Validate implementations against plans — automated checks, compliance verification, regression testing, conversational UAT |
| `/progress` | 📊 Display project progress, phase status, and task completion from `.planning/` state files |

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

---

### 🔄 Workflows (26)

Workflows are Antigravity step-by-step execution scripts (`.md` files installed to `.agent/workflows/`). Many include `// turbo` annotations for auto-execution.

| Workflow | Description |
|:---|:---|
| `/init-project` | 🏗️ Initialize project with `.planning/` structure |
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

---

### 🤖 Agents (7)

Agent definitions are specialist AI personas (`.md` files installed to `.claude/agents/`). Each agent has detailed protocols, principles, and anti-patterns.

| Agent | Emoji | Description |
|:---|:---:|:---|
| **researcher** | 🔬 | Deep codebase and domain research — gathers comprehensive evidence and context before planning. Emphasizes accuracy, exhaustive search, and source attribution. |
| **planner** | 📋 | Task decomposition and implementation planning — generates dependency-aware plans with effort estimates, risk assessments, and implementation waves. |
| **executor** | ⚙️ | Plan execution with quality gates — implements tasks from plans with checkpoint handling, inline verification, and state updates. Fails fast on blockers. |
| **reviewer** | 🔍 | Structured code review — examines changes for correctness, security, performance, patterns, and maintainability. Provides severity-based feedback. |
| **debugger** | 🐛 | Scientific debugging with hypothesis tracking — investigates issues using hypothesis-driven methodology with evidence chains and persistent state. |
| **verifier** | ✅ | Work verification and gap analysis — validates implementation against plans, runs comprehensive checks, identifies gaps, and generates fix plans. |
| **mapper** | 🗺️ | Codebase mapping and dependency analysis — analyzes project structure, module boundaries, dependencies, patterns, and health metrics. |

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

## 💾 Persistent Memory System — ✨ NEW in v3

### The Problem
Every AI session starts from scratch. You explain the same architecture, repeat the same decisions, and lose context.

### The Solution
File-based memory protocol — no hooks, no databases, no external services. Works in **ANY** agent.

```
.planning/
├── MEMORY.md                    # 🧠 Project brain (~300 lines max)
├── sessions/                    # 📝 Session logs
├── decisions/DECISIONS.md       # 📋 Decision log (append-only)
├── context/
│   ├── architecture.md          # 🏗️ Architecture decisions
│   ├── patterns.md              # 🔄 Established patterns
│   ├── gotchas.md               # ⚠️ Known issues
│   └── tech-debt.md             # 🔧 Technical debt
└── handoffs/LATEST.md           # 📤 Last session's handoff
```

### How It Works

```
SESSION START                    SESSION END
┌────────────────────┐           ┌────────────────────┐
│ 1. Read MEMORY.md  │           │ 8. Create session  │
│ 2. Read LATEST.md  │           │    log              │
│ 3. Full context!   │           │ 9. Write handoff   │
└────────────────────┘           │ 10. Update memory  │
                                 └────────────────────┘
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
| Capture method | Lifecycle hooks | Instruction-based |
| Storage | Database | Markdown files (git!) |
| Setup | Plugin install + config | Add 4 lines to GEMINI.md |

---

## 🤝 Agent Team Coordination — ✨ NEW in v3

### The Problem
Claude Code has [Agent Teams](https://code.claude.com/docs/en/agent-teams) — parallel AI instances via tmux. But most devs use Antigravity or Cursor (single-agent).

### The Solution
Sequential role-switching with a shared blackboard. One agent, multiple specialist hats.

```
┌────────────────────────────────────────┐
│           Single Agent Session          │
│                                         │
│  Phase 1: 🔬 Researcher                │
│     → Research, evidence, findings     │
│     → Write handoff document           │
│                                         │
│  Phase 2: 📐 Architect                 │
│     → Read research, design solution   │
│     → Write handoff document           │
│                                         │
│  Phase 3: 📋 Planner                   │
│     → Read design, create tasks        │
│     → Write handoff document           │
│                                         │
│  Phase 4: ⚙️ Executor                  │
│     → Read plan, implement tasks       │
│     → Write handoff document           │
│                                         │
│  Phase 5: 🔍 Reviewer                  │
│     → Read ALL handoffs, review code   │
│     → Write review report              │
└────────────────────────────────────────┘
```

### Role Presets

| Preset | Roles | Best For |
|:---|:---|:---|
| ⚡ Quick | Researcher → Executor → Reviewer | Small features |
| 🏗️ Full | Researcher → Architect → Planner → Executor → Reviewer | Complex features |
| 🐛 Debug | Investigator → Fixer → Verifier | Bug hunting |

---

## 📁 Project Structure

```
skills-by-amrit/
├── 📂 skills/                   # 26 deep instructional skills
│   ├── brainstorming/SKILL.md
│   ├── persistent-memory/SKILL.md      ✨ NEW
│   ├── agent-team-coordination/SKILL.md ✨ NEW
│   └── ... (24 more)
├── 📂 commands/                 # 22 Claude Code slash commands
│   ├── init-project.md
│   ├── memory.md                        ✨ NEW
│   ├── team.md                          ✨ NEW
│   └── ... (20 more)
├── 📂 workflows/                # 26 Antigravity workflows
│   ├── init-project.md
│   ├── memory-sync.md                   ✨ NEW
│   ├── team-session.md                  ✨ NEW
│   └── ... (24 more)
├── 📂 agents/                   # 7 specialist agent definitions
│   ├── researcher.md
│   ├── executor.md
│   └── ... (5 more)
├── 📂 cursor-rules/             # 10 Cursor .mdc rules
│   ├── core-development.mdc
│   ├── memory-protocol.mdc             ✨ NEW
│   ├── team-protocol.mdc               ✨ NEW
│   └── ... (8 more)
├── 📂 rules/                    # 5 universal agent rules
│   ├── core-principles.md
│   ├── memory-protocol.md              ✨ NEW
│   ├── team-protocol.md                ✨ NEW
│   └── ... (3 more)
├── 📂 docs/                     # Documentation
│   ├── AGENT-TEAMS-AND-MEMORY.md
│   └── COMPETITIVE_ANALYSIS.md
├── 📂 src/                      # CLI source
│   └── cli.ts
├── CLAUDE.md                    # Claude Code integration
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

# List all available assets
npx skills-by-amrit list

# Show supported agents
npx skills-by-amrit agents

# Show help
npx skills-by-amrit help
```

### Flags

| Flag | Description |
|:---|:---|
| `--agent <name>` | Install to a specific agent |
| `--global` | Install globally instead of locally |
| `--all` | Install all available skills |
| `--help` | Show help text |

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
| [Contributing](CONTRIBUTING.md) | How to contribute to this project |
| [Changelog](CHANGELOG.md) | Version history and release notes |

---

## 🔄 Version History

### v3.0.0 — Agent Intelligence Release 🧠

**New Skills:**
- 💾 `persistent-memory` — Zero-infrastructure session memory for ANY agent
- 🤝 `agent-team-coordination` — Claude Code-style teams for ANY agent

**New Commands (22 total):**
- `/memory` — Memory management (init, read, write, compress, status)
- `/team` — Team coordination (start, resume, next, board, status)
- `/init-project`, `/execute`, `/verify`, `/research`, `/progress`
- `/quick`, `/migrate`, `/performance`, `/security-scan`, `/doc`, `/explain`, `/fix-issue`
- `/deploy-check`, `/audit`, `/refactor`, `/test`, `/review`, `/debug`, `/commit`, `/plan`

**New Workflows (26 total):**
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
| 🧠 Skills | **26** |
| ⚡ Commands | **22** |
| 🔄 Workflows | **26** |
| 🤖 Agents | **7** |
| 🎯 Cursor Rules | **10** |
| 📏 Rules | **5** |
| 🤖 Supported Agents | **34** |
| 📄 Total Assets | **96** |

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

## � Acknowledgments

This project stands on the shoulders of giants. Huge thanks to these projects that inspired and influenced the design of Skills by Amrit:

| Project | Author | Contribution |
|:---|:---|:---|
| [**Superpowers**](https://github.com/obra/superpowers) | Jesse Vincent ([@obra](https://github.com/obra)) | Pioneered the agentic skills framework concept — composable skills, TDD-first workflows, and subagent-driven development. The foundation we all build on. |
| [**GSD (Get Shit Done)**](https://github.com/glittercowboy/get-shit-done) | [@glittercowboy](https://github.com/glittercowboy) | Spec-driven development with context rot prevention, parallel agent spawning, and executable plans. Showed how to keep AI agents focused and productive. |
| [**Agent Skills Standard**](https://docs.anthropic.com/en/docs/agents/agent-skills) | Anthropic | The open standard for packaging and sharing AI agent capabilities via `SKILL.md` files. |
| [**skills.sh**](https://skills.sh) | Community | The agent skills directory and CLI that makes skill discovery and installation universal. |

---

## �📄 License

[MIT](LICENSE) © [Amritpal Singh Boparai](https://github.com/boparaiamrit)

---

<p align="center">
  <strong>Built with ❤️ by <a href="https://github.com/boparaiamrit">Amritpal Singh Boparai</a></strong>
  <br>
  <sub>Making AI agents think like staff engineers, one skill at a time.</sub>
  <br><br>
  <a href="https://github.com/boparaiamrit">🐙 GitHub</a> · <a href="https://x.com/boparaiamrit">🐦 X/Twitter</a> · <a href="https://boparaiamrit.github.io/skills-by-amrit/">🌐 Website</a>
</p>

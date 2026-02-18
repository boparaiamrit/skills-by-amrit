# 🔄 Workflows Reference

> 32 Antigravity workflows with turbo-mode auto-execution

Workflows are `.md` files installed to `.agent/workflows/`. They provide step-by-step execution guides that Antigravity follows. Steps marked `// turbo` are auto-executed without user confirmation.

---

## 📋 Complete Workflow Catalog

### 🏗️ Project Lifecycle

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 1 | `/init-project` | ✅ | Initialize project with `.planning/` structure — creates project, requirements, roadmap, and state files |
| 2 | `/plan-feature` | — | Plan a feature with research phase, design decisions, task decomposition, and dependency mapping |
| 3 | `/execute` | ✅ | Execute plans wave-by-wave with checkpoints, inline verification, and state tracking |
| 4 | `/verify` | ✅ | Validate implementation against plan — automated checks, criteria compliance, regression testing |
| 5 | `/progress` | ✅ | Display project progress — phase status, task completion, blockers, timeline |
| 6 | `/quick` | ✅ | Execute small, well-defined tasks without full project planning overhead |

### 🔬 Research & Documentation

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 7 | `/research` | — | Deep research on topics — structured reports with source citations and recommendations |
| 8 | `/doc` | — | Generate documentation — README, API docs, architecture docs, setup guides |
| 9 | `/explain` | — | Provide detailed explanations of code, architecture, or concepts |
| 10 | `/codebase-map` | ✅ | Analyze codebase — module boundaries, dependency graphs, health metrics |

### 🔧 Code Quality

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 11 | `/review` | — | Structured code review with severity-based feedback |
| 12 | `/test` | ✅ | Generate and run tests — unit, integration, e2e with coverage |
| 13 | `/debug` | — | Scientific debugging — hypothesis tracking, evidence chains, root cause analysis |
| 14 | `/fix-issue` | — | Diagnose and fix specific issues with minimal changes |
| 15 | `/refactor` | — | Safe refactoring with test coverage validation |
| 16 | `/audit` | ✅ | Full codebase audit — linting, secrets, console logs, TODOs |

### ⚙️ Operations & Security

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 17 | `/security-scan` | ✅ | Comprehensive security scan — OWASP, secrets, dependencies |
| 18 | `/performance` | ✅ | Performance profiling and optimization |
| 19 | `/migrate` | — | Database/code migrations with safety checks and rollback |
| 20 | `/deploy-check` | ✅ | Pre-deployment validation checklist |
| 21 | `/deps-update` | ✅ | Check and update outdated/vulnerable dependencies |
| 22 | `/incident-response` | — | Production incident triage, mitigation, and post-mortem |

### 🔄 Git & Release

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 23 | `/commit` | ✅ | Create Conventional Commits with proper scope and body |
| 24 | `/release` | — | Prepare a release — version bump, changelog, tag, publish |

### 🟣 Agent Intelligence ✨ NEW

| # | Workflow | Turbo? | Description |
|:---:|:---|:---:|:---|
| 25 | `/memory-sync` | ✅ | Initialize, read, write, and compress project memory |
| 26 | `/team-session` | ✅ | Multi-role team coordination with sequential role-switching |

---

## 🏷️ Turbo Mode

Workflows with `// turbo` or `// turbo-all` annotations allow Antigravity to auto-execute steps without asking for user approval. This dramatically speeds up routine operations.

**How it works:**
```markdown
### Step 1: Check project structure
// turbo
List the project directory and identify the tech stack.

### Step 2: Analyze dependencies
// turbo
Read package.json and identify all dependencies.
```

Both steps above will auto-execute because they're marked `// turbo`.

**`// turbo-all`** marks the ENTIRE workflow for auto-execution — every step runs without approval.

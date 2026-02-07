# Competitive Analysis: Agent Skill Frameworks

> **Purpose:** Exhaustive breakdown of competing frameworks to inform the `skills-by-amrit` roadmap.
> **Date:** 2026-02-07
> **Competitors Analyzed:** Get-Shit-Done (GSD), Superpowers, Claude Code Skills/Subagents/Hooks

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Framework Comparison Matrix](#framework-comparison-matrix)
3. [Get-Shit-Done (GSD) Deep Dive](#get-shit-done-gsd-deep-dive)
4. [Claude Code Skills/Subagents/Hooks](#claude-code-skillssubagentshooks)
5. [Cursor Rules System](#cursor-rules-system)
6. [Antigravity Workflows](#antigravity-workflows)
7. [Gap Analysis: What We're Missing](#gap-analysis-what-were-missing)
8. [Innovation Opportunities](#innovation-opportunities)
9. [Prioritized Roadmap](#prioritized-roadmap)
10. [Multi-Agent Strategy](#multi-agent-strategy)

---

## 1. Executive Summary

### Current State of `skills-by-amrit`

| Asset Type | Count | Quality |
|---|---|---|
| Skills (SKILL.md dirs) | 24 | ✅ Solid — covers core dev, auditing, evolution, meta |
| Commands (slash commands) | 11 | ⚠️ Good start — needs more project management commands |
| Workflows (Antigravity) | 10 | ⚠️ Good start — missing project lifecycle workflows |
| Rules | 10 | ✅ Strong — core principles, anti-hallucination, severity |
| CLI Agents Supported | 34 | ✅ Market-leading agent coverage |

### Key Competitive Insights

1. **GSD's killer feature:** End-to-end project lifecycle management with persistent state (`.planning/` directory), wave-based parallel execution via subagents, and conversational UAT verification.
2. **Claude Code's killer feature:** Native subagent system (`context: fork`, `agent: Explore/Plan`), dynamic context injection (`!command`), hooks lifecycle (PreToolUse, PostToolUse, etc.), and `$ARGUMENTS` parameter passing.
3. **Our killer feature:** 34+ agent compatibility, categorized skill taxonomy, one-command installation. No other framework ships to this many agents.

### Strategic Gap
We have **breadth** (agent coverage) but lack **depth** (project lifecycle, persistent state, subagent orchestration). GSD has depth for Claude Code only. The opportunity is to combine our breadth with GSD-level depth.

---

## 2. Framework Comparison Matrix

| Feature | skills-by-amrit | GSD | Claude Code Native | Cursor |
|---|---|---|---|---|
| **Agent Coverage** | 34 agents | Claude Code only | Claude Code only | Cursor only |
| **Skills/Knowledge** | 24 skills | 11 agents (as knowledge) | SKILL.md spec | Rules + .cursorrules |
| **Slash Commands** | 11 commands | 26 GSD commands | SKILL.md w/ frontmatter | N/A |
| **Workflows** | 10 (Antigravity) | 4+ (in workflows/) | Via skills | N/A |
| **Project Lifecycle** | ❌ None | ✅ Full (plan→execute→verify) | Partial (via skills) | ❌ None |
| **Persistent State** | ❌ None | ✅ `.planning/STATE.md` | ❌ None | ❌ None |
| **Subagent Orchestration** | ❌ None | ✅ Wave-based parallel | ✅ `context: fork` | ❌ None |
| **Dynamic Context** | ❌ None | ✅ Reference files | ✅ `!command` injection | ❌ None |
| **Hooks/Lifecycle** | ❌ None | ❌ None | ✅ Full hook system | ❌ None |
| **Argument Passing** | ❌ None | ✅ $ARGUMENTS | ✅ $ARGUMENTS, $N | ❌ None |
| **Research Phase** | ❌ None | ✅ Multi-source research | Partial | ❌ None |
| **Verification/UAT** | ❌ None | ✅ Conversational UAT | ❌ None | ❌ None |
| **Package Distribution** | ✅ npm | Git clone only | Manual file copy | Manual |
| **CLI Tool** | ✅ Full CLI | Bash installer | N/A | N/A |
| **Rules/Constraints** | ✅ 10 rules | Via CLAUDE.md | Via settings | .cursorrules |

---

## 3. Get-Shit-Done (GSD) Deep Dive

### Architecture

```
get-shit-done/
├── agents/                   # 11 specialized subagent definitions
│   ├── gsd-codebase-mapper.md    (16KB)
│   ├── gsd-debugger.md           (35KB!)  ← largest, most complex
│   ├── gsd-executor.md           (13KB)
│   ├── gsd-integration-checker.md (12KB)
│   ├── gsd-phase-researcher.md    (14KB)
│   ├── gsd-plan-checker.md        (17KB)
│   ├── gsd-planner.md            (35KB!)  ← second largest
│   ├── gsd-project-researcher.md  (15KB)
│   ├── gsd-research-synthesizer.md (7KB)
│   ├── gsd-roadmapper.md         (16KB)
│   └── gsd-verifier.md           (15KB)
├── commands/gsd/            # 26 slash commands
│   ├── new-project.md       → PROJECT.md, ROADMAP.md, REQUIREMENTS.md
│   ├── plan-phase.md        → Phase plan with task breakdown
│   ├── execute-phase.md     → Wave-based parallel execution
│   ├── verify-work.md       → Conversational UAT
│   ├── complete-milestone.md → Milestone completion flow
│   ├── debug.md             → Scientific debugging with subagents
│   ├── map-codebase.md      → Codebase mapping
│   ├── research-phase.md    → Deep research before planning
│   ├── progress.md          → Progress tracking
│   ├── pause-work.md        → Save state for later
│   ├── resume-work.md       → Resume from saved state
│   ├── quick.md             → Quick tasks without full planning
│   ├── add-phase.md         → Add phases to roadmap
│   ├── remove-phase.md      → Remove phases
│   ├── insert-phase.md      → Insert phases at position
│   ├── add-todo.md          → Add todo items
│   ├── check-todos.md       → Check todo status
│   ├── discuss-phase.md     → Discuss phase details
│   ├── list-phase-assumptions.md → List assumptions
│   ├── plan-milestone-gaps.md → Identify gaps
│   ├── audit-milestone.md   → Audit milestone
│   ├── new-milestone.md     → New milestone
│   ├── set-profile.md       → Set user profile
│   ├── settings.md          → Framework settings
│   ├── update.md            → Self-update
│   ├── join-discord.md      → Community link
│   └── help.md              → Help docs
├── get-shit-done/
│   ├── bin/                 # Helper scripts (gsd-tools.js)
│   ├── references/          # Reference documents
│   ├── templates/           # Output templates
│   └── workflows/           # Workflow definitions
└── ...
```

### Key Innovation: Project Lifecycle State Machine

GSD implements a persistent state machine in `.planning/`:

```
.planning/
├── PROJECT.md        # Project context, goals, constraints
├── REQUIREMENTS.md   # Scoped requirements
├── ROADMAP.md        # Phase structure with dependencies
├── STATE.md          # Current state, active phase, history
├── config.json       # Workflow preferences
├── research/         # Domain research outputs
├── plans/           # Phase plans with task breakdowns
├── debug/           # Debug session files
└── {phase}-UAT.md   # UAT test results per phase
```

**Flow:**
```
/gsd:new-project → questioning → research → requirements → roadmap
                                                             ↓
/gsd:plan-phase N → plan checker → approved plan → STATE update
                                                      ↓
/gsd:execute-phase N → wave discovery → parallel subagents → verification
                                                               ↓
/gsd:verify-work N → conversational UAT → gap plans → re-execute
                                                        ↓
/gsd:complete-milestone → audit → commit → next milestone
```

### Key Innovation: Wave-Based Parallel Execution

GSD's `execute-phase` command groups tasks into "waves" by analyzing dependencies. Independent tasks run in parallel via subagents, while dependent tasks wait. This is a **massive** context efficiency gain:

- **Orchestrator:** Uses ~15% context budget (task discovery, dependency analysis, wave grouping)
- **Each subagent:** Gets 100% fresh context (200K tokens for the actual work)
- **Result:** Complex phases complete faster with better quality

### Key Innovation: Specialized Agents with Deep Knowledge

Each GSD agent file is essentially a **comprehensive protocol** (12-35KB each):

| Agent | Size | Purpose |
|---|---|---|
| `gsd-debugger` | 35KB | Scientific debugging method, hypothesis tracking, evidence chain |
| `gsd-planner` | 35KB | Task breakdown, dependency analysis, risk assessment |
| `gsd-plan-checker` | 17KB | Plan validation, completeness verification |
| `gsd-codebase-mapper` | 16KB | Codebase structure and relationship mapping |
| `gsd-roadmapper` | 16KB | Roadmap creation with phase dependencies |
| `gsd-project-researcher` | 15KB | Deep research with source validation |
| `gsd-verifier` | 15KB | Work verification and gap identification |
| `gsd-phase-researcher` | 14KB | Phase-specific research |
| `gsd-executor` | 13KB | Plan execution with checkpoint handling |
| `gsd-integration-checker` | 12KB | Cross-component integration verification |
| `gsd-research-synthesizer` | 7KB | Research synthesis and distillation |

### Command Design Pattern (GSD)

Every GSD command follows this structure:
```yaml
---
name: gsd:command-name
description: What it does
argument-hint: "[args]"
allowed-tools:
  - Read, Bash, Write, Task, etc.
---
<objective>What this achieves</objective>
<execution_context>@reference files to load</execution_context>
<context>$ARGUMENTS and state files</context>
<process>Step-by-step execution</process>
<success_criteria>Checklist</success_criteria>
```

**Key patterns:**
- `@reference` syntax loads external files into context
- `$ARGUMENTS` passes user input
- `Task()` spawns subagents with model selection
- `<success_criteria>` checkboxes for verification
- Persistent state in `.planning/STATE.md`

---

## 4. Claude Code Skills/Subagents/Hooks

### Skills System

The native skill spec provides:

```yaml
---
name: my-skill
description: What this skill does
disable-model-invocation: true  # Only user can invoke
user-invocable: false           # Only Claude can invoke
allowed-tools: Read, Grep       # Tool restrictions
context: fork                   # Run in subagent
agent: Explore                  # Which subagent type
argument-hint: "[issue-number]"
hooks:                          # Lifecycle hooks
  PreToolUse: ...
---
```

**Key features we should leverage:**

1. **`$ARGUMENTS` and `$ARGUMENTS[N]`** — Positional argument passing
2. **`$N` shorthand** — `$0`, `$1`, `$2` for positional args
3. **`${CLAUDE_SESSION_ID}`** — Session-scoped file naming
4. **`!command`** — Dynamic context injection (execute before Claude sees prompt)
5. **`context: fork`** — Run in isolated subagent
6. **`agent: Explore | Plan`** — Choose execution agent type
7. **`disable-model-invocation: true`** — User-only commands (deployment, etc.)
8. **`allowed-tools`** — Restrict what tools the skill can use
9. **Supporting files** — `reference.md`, `examples.md`, `scripts/` alongside SKILL.md

### Subagent System

Claude Code has built-in agents and supports custom ones:

- **Built-in:** `Explore` (read-only), `Plan` (planning-focused)
- **Custom:** Place `.md` files in `.claude/agents/` directory
- **Scoping:** Project-local (`.claude/agents/`) or global (`~/.claude/agents/`)
- **Context isolation:** Each subagent gets fresh context
- **Foreground/Background:** Subagents can run in either mode

### Hooks System

```
Hook Events:
├── SessionStart          — When a session begins
├── UserPromptSubmit      — Before processing user input
├── PreToolUse            — Before any tool executes
├── PermissionRequest     — When permission is needed
├── PostToolUse           — After tool completes
├── PostToolUseFailure    — After tool fails
├── Notification          — System notifications
├── SubagentStart/Stop    — Subagent lifecycle
├── TeammateIdle          — Teammate available
├── TaskCompleted         — Task finishes
├── PreCompact            — Before context compaction
├── SessionEnd            — When session ends
└── Stop                  — Session stopping
```

**Hook types:** Script-based, Prompt-based, Agent-based, Async

---

## 5. Cursor Rules System

Cursor uses `.cursor/rules/` directory with MDC (Markdown Components) format:

```yaml
---
description: When to apply this rule
globs: ["*.py", "src/**/*.ts"]
alwaysApply: true/false
---
// Rule content in markdown
```

**Rule types:**
- `alwaysApply: true` — Always loaded
- Glob-matched — Loaded when matching files are open
- Description-matched — AI decides when relevant
- Manual — User explicitly applies via `@rules`

---

## 6. Antigravity Workflows

Antigravity (Gemini in VS Code) uses `.agent/workflows/` with:

```yaml
---
description: short title
---
[step-by-step instructions]
```

**Special annotations:**
- `// turbo` — Auto-run specific step
- `// turbo-all` — Auto-run ALL steps

We've created 10 workflows already. These are solid but lack:
- State persistence
- Subagent delegation
- Dynamic context injection
- Argument passing

---

## 7. Gap Analysis: What We're Missing

### 🔴 Critical Gaps (High Impact, Our Framework Lacks Entirely)

| Gap | GSD Has It | Claude Native | Priority |
|---|---|---|---|
| **Project lifecycle commands** (new-project, plan, execute, verify) | ✅ Full system | Partial | P0 |
| **Persistent state** (`.planning/` or equivalent) | ✅ STATE.md | ❌ | P0 |
| **Subagent/agent definitions** for Claude Code | N/A (GSD uses its own) | ✅ `.claude/agents/` | P0 |
| **Argument passing** in commands/skills | ✅ $ARGUMENTS | ✅ $ARGUMENTS | P0 |
| **`context: fork`** for isolated execution | Via Task() | ✅ Native | P1 |

### 🟡 Important Gaps (High Value, Partially Addressed)

| Gap | Status | Priority |
|---|---|---|
| **Research phase** before planning | ❌ Missing | P1 |
| **Verification/UAT workflow** | ❌ Missing (only have `deploy-check`) | P1 |
| **Progress tracking** | ❌ Missing | P1 |
| **Pause/Resume** state management | ❌ Missing | P1 |
| **Dynamic context injection** (`!command` in skills) | ❌ Missing | P1 |
| **Hooks definitions** for Claude Code | ❌ Missing | P2 |
| **Debug with subagent isolation** | Have debug command, no subagent | P2 |

### 🟢 Our Advantages (Things We Do Better)

| Our Advantage | Detail |
|---|---|
| **34-agent compatibility** | GSD = 1, Claude Native = 1. We ship everywhere. |
| **npm distribution** | `npx skills-by-amrit add` vs. git clone and manual setup |
| **Categorized skill taxonomy** | 4 categories, 24 skills, well-organized |
| **Rule system** | Anti-hallucination, severity framework, core principles |
| **Audit depth** | 10 specialized audit skills (arch, sec, perf, db, frontend, API, deps, observability, accessibility, CI/CD) |

---

## 8. Innovation Opportunities

### 8.1 Universal Project Lifecycle (Multi-Agent)

**Concept:** A `.planning/` state directory that works across ALL agents.

```
.planning/
├── PROJECT.md        # Project context (agent-agnostic markdown)
├── ROADMAP.md        # Phase structure
├── STATE.md          # Current state
├── plans/            # Phase plans
│   ├── phase-1/plan-001.md
│   └── phase-2/plan-001.md
├── research/         # Research outputs
├── debug/            # Debug sessions
├── uat/              # UAT results
└── config.json       # Settings
```

**Why this is innovative:** GSD's planning system only works in Claude Code. Ours would work in Cursor, Antigravity, Gemini CLI, etc. The `.planning/` folder is just markdown and JSON — any agent can read/write it.

### 8.2 Agent-Specific Skill Adapters

```
skills/
├── project-lifecycle/
│   ├── SKILL.md                    # Universal skill definition
│   ├── adapters/
│   │   ├── claude-code.md          # Claude-specific (subagents, hooks, $ARGUMENTS)
│   │   ├── antigravity.md          # Antigravity-specific (workflows, turbo)
│   │   ├── cursor.md               # Cursor-specific (rules format)
│   │   └── gemini-cli.md           # Gemini CLI-specific
│   ├── templates/
│   │   ├── project.md
│   │   ├── roadmap.md
│   │   └── state.md
│   └── reference.md
```

### 8.3 Smart Command Router

Instead of separate command files per agent, one command that auto-adapts:

```yaml
---
name: plan
description: Plan a feature or phase
agents:
  claude-code:
    context: fork
    agent: Plan
    allowed-tools: Read, Grep, Glob
  antigravity:
    workflow: true
    turbo-all: true
  cursor:
    rule-type: manual
---
```

### 8.4 Composable Skill Chains

```yaml
---
name: implement-feature
description: Full feature implementation flow
chain:
  - research: "Understand the codebase context for this feature"
  - plan: "Create an implementation plan"
  - execute: "Implement the plan"
  - test: "Write and run tests"
  - review: "Self-review the implementation"
  - commit: "Create a conventional commit"
---
```

### 8.5 Multi-Agent Verification Matrix

```yaml
---
name: triple-verify
description: Cross-verify code across multiple agents
steps:
  1. agent: claude-code
     task: "Review for logic errors and security"
  2. agent: cursor
     task: "Review for performance and best practices"
  3. agent: antigravity
     task: "Review for architecture and SOLID principles"
  4. synthesize: "Combine all findings into unified feedback"
---
```

---

## 9. Prioritized Roadmap

### Phase 1: Foundation (Commands + Claude Code Agents)
**Goal:** Match GSD's command depth, add Claude Code agent definitions

| # | Task | Type | Status |
|---|---|---|---|
| 1.1 | Create `commands/` for Claude Code with proper frontmatter | Commands | 🟡 Have 11, need more |
| 1.2 | Add `$ARGUMENTS` support to all commands | Commands | ❌ Not done |
| 1.3 | Add `disable-model-invocation` to side-effect commands (deploy, commit) | Commands | ❌ Not done |
| 1.4 | Add `allowed-tools` restrictions to each command | Commands | ❌ Not done |
| 1.5 | Create Claude Code agent definitions in `agents/` | Agents | ❌ Not done |
| 1.6 | Create `agent-debugger.md` (systematic debugging subagent) | Agent | ❌ |
| 1.7 | Create `agent-researcher.md` (codebase/domain research) | Agent | ❌ |
| 1.8 | Create `agent-planner.md` (task breakdown and planning) | Agent | ❌ |
| 1.9 | Create `agent-reviewer.md` (code review subagent) | Agent | ❌ |
| 1.10 | Create `agent-executor.md` (plan execution subagent) | Agent | ❌ |

### Phase 2: Project Lifecycle
**Goal:** Implement persistent state and project lifecycle management

| # | Task | Type | Status |
|---|---|---|---|
| 2.1 | Create `.planning/` state system templates | Templates | ❌ |
| 2.2 | Add `/init-project` command (like GSD's new-project) | Command | ❌ |
| 2.3 | Add `/plan` command with phase breakdown | Command | 🟡 Have basic plan |
| 2.4 | Add `/execute` command with subagent delegation | Command | ❌ |
| 2.5 | Add `/verify` command with conversational UAT | Command | ❌ |
| 2.6 | Add `/progress` command for status tracking | Command | ❌ |
| 2.7 | Add `/research` command for pre-planning research | Command | ❌ |
| 2.8 | Add `/pause` and `/resume` commands | Command | ❌ |
| 2.9 | Add `/quick` command for small tasks without full planning | Command | ❌ |

### Phase 3: CLI Enhancement
**Goal:** CLI installs commands, workflows, agents, AND rules

| # | Task | Type | Status |
|---|---|---|---|
| 3.1 | Add `installCommandsToAgent()` function | CLI | ❌ |
| 3.2 | Add `installWorkflowsToAgent()` function | CLI | ❌ |
| 3.3 | Add `installAgentsToAgent()` function | CLI | ❌ |
| 3.4 | Map asset types to agent directories (commands → .claude/commands/, workflows → .agent/workflows/) | CLI | ❌ |
| 3.5 | Add `--type` flag (skills, commands, workflows, agents, all) | CLI | ❌ |
| 3.6 | Add `list commands`, `list workflows`, `list agents` subcommands | CLI | ❌ |
| 3.7 | Add `init` command to set up `.planning/` and install everything | CLI | ❌ |

### Phase 4: Advanced Features
**Goal:** Dynamic context, hooks, composable chains

| # | Task | Type | Status |
|---|---|---|---|
| 4.1 | Add dynamic context injection (`!command`) to Claude Code skills | Skills | ❌ |
| 4.2 | Create hook definitions for Claude Code | Hooks | ❌ |
| 4.3 | Implement skill chains (research → plan → execute → verify) | Meta | ❌ |
| 4.4 | Add reference documents (like GSD's references/) | Docs | ❌ |
| 4.5 | Add output templates (like GSD's templates/) | Templates | ❌ |

---

## 10. Multi-Agent Strategy

### Asset Distribution Map

| Asset Type | Claude Code | Cursor | Antigravity | Gemini CLI | Others |
|---|---|---|---|---|---|
| **Skills** | `.claude/skills/` | `.cursor/skills/` | `.agent/skills/` | `.agents/skills/` | Agent-specific |
| **Commands** | `.claude/commands/` | N/A (use rules) | N/A (use workflows) | N/A | N/A |
| **Agents** | `.claude/agents/` | N/A | N/A | N/A | N/A |
| **Workflows** | N/A | N/A | `.agent/workflows/` | N/A | N/A |
| **Rules** | `.claude/settings.json` | `.cursor/rules/` | Inline in SKILL.md | `.gemini/settings.json` | Agent-specific |
| **Hooks** | `.claude/settings.json` | N/A | N/A | N/A | N/A |

### Cross-Agent Compatibility Strategy

1. **Skills (SKILL.md)** → Universal, works everywhere ✅
2. **Commands** → Claude Code-only, but can be **adapted** to:
   - Antigravity workflows (`.agent/workflows/`)
   - Cursor rules with manual application
3. **Agents** → Claude Code-only, but the **knowledge** they contain can be:
   - Converted to skills for other agents
   - Used as reference docs
4. **Rules** → Package-specific format, needs adapter per agent

### New CLI `add` Command Matrix

```
npx skills-by-amrit add                    # Interactive, installs all asset types
npx skills-by-amrit add --type skills      # Skills only
npx skills-by-amrit add --type commands    # Commands only (Claude Code)
npx skills-by-amrit add --type workflows   # Workflows only (Antigravity)
npx skills-by-amrit add --type agents      # Agent defs only (Claude Code)
npx skills-by-amrit add --type all         # Everything applicable
npx skills-by-amrit init                   # Full project setup + .planning/
```

---

## Appendix A: GSD Command Quick Reference

| Command | Purpose | Subagent Used |
|---|---|---|
| `/gsd:new-project` | Initialize project with deep context | gsd-project-researcher, gsd-roadmapper |
| `/gsd:plan-phase N` | Plan a specific phase | gsd-planner, gsd-plan-checker |
| `/gsd:execute-phase N` | Execute phase (wave-parallel) | gsd-executor (per wave task) |
| `/gsd:verify-work N` | Conversational UAT | gsd-verifier |
| `/gsd:debug [issue]` | Systematic debugging | gsd-debugger |
| `/gsd:map-codebase` | Map codebase structure | gsd-codebase-mapper |
| `/gsd:research-phase N` | Pre-planning research | gsd-phase-researcher, gsd-research-synthesizer |
| `/gsd:progress` | Show progress | None |
| `/gsd:pause-work` | Save state for later | None |
| `/gsd:resume-work` | Resume from saved state | None |
| `/gsd:quick [task]` | Quick task, no full planning | None |
| `/gsd:complete-milestone` | Complete milestone flow | gsd-integration-checker |
| `/gsd:audit-milestone` | Audit milestone | gsd-verifier |

## Appendix B: Claude Code Skill Frontmatter Reference

```yaml
---
name: skill-name               # Required: identifier
description: What it does       # Required: triggers auto-invocation
argument-hint: "[args]"        # Optional: hint for /skill usage
disable-model-invocation: true  # Optional: user-only invocation
user-invocable: false           # Optional: AI-only knowledge
allowed-tools: Read, Grep       # Optional: tool restrictions
context: fork                   # Optional: run in subagent
agent: Explore | Plan           # Optional: subagent type
model: claude-sonnet-4-20250514 # Optional: specific model
hooks:                          # Optional: lifecycle hooks
  PreToolUse:
    - command: ./validate.sh
---
```

## Appendix C: New Commands/Agents/Workflows Needed

### Commands to Create (Claude Code Format)

| Command | Description | Priority |
|---|---|---|
| `init-project.md` | Initialize project with `.planning/` directory | P0 |
| `plan-feature.md` | Plan a feature with task breakdown | P0 |
| `execute-plan.md` | Execute a plan with verification | P0 |
| `verify.md` | Verify implementation against plan | P0 |
| `progress.md` | Show project progress | P1 |
| `research.md` | Deep research before implementation | P1 |
| `pause.md` | Save work state | P1 |
| `resume.md` | Resume from saved state | P1 |
| `quick.md` | Quick task without full planning | P1 |
| `migrate.md` | Database/code migration | P2 |
| `performance.md` | Performance profiling and optimization | P2 |
| `security-scan.md` | Security vulnerability scanning | P2 |

### Agent Definitions to Create (Claude Code)

| Agent | Description | Priority |
|---|---|---|
| `researcher.md` | Deep codebase/domain research | P0 |
| `planner.md` | Task breakdown and planning | P0 |
| `executor.md` | Plan execution with checkpoints | P0 |
| `reviewer.md` | Code review with structured feedback | P0 |
| `debugger.md` | Scientific debugging with evidence chain | P1 |
| `verifier.md` | Work verification and gap analysis | P1 |
| `mapper.md` | Codebase mapping and dependency analysis | P2 |

### Workflows to Create (Antigravity)

| Workflow | Description | Priority |
|---|---|---|
| `init-project.md` | Initialize project planning structure | P0 |
| `plan-feature.md` | Feature planning workflow | P0 |
| `execute-plan.md` | Plan execution with verification steps | P0 |
| `verify.md` | Verification and UAT workflow | P1 |
| `progress.md` | Progress reporting workflow | P1 |
| `research.md` | Pre-planning research workflow | P1 |
| `performance.md` | Performance audit and optimization | P2 |
| `security-scan.md` | Security scanning and remediation | P2 |

---

*This analysis was compiled from exhaustive review of:*
- *[get-shit-done](https://github.com/glittercowboy/get-shit-done) — 26 commands, 11 agents, 4+ workflows*
- *[Claude Code Skills Docs](https://docs.anthropic.com/en/docs/claude-code/skills)*
- *[Claude Code Subagents Docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents)*
- *[Claude Code Hooks Docs](https://docs.anthropic.com/en/docs/claude-code/hooks)*
- *[Cursor Rules Docs](https://docs.cursor.com/context/rules)*

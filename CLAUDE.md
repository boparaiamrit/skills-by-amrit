# Skills by Amrit

> v4.0.0 — An agentic skills framework for software development that makes AI assistants think like senior staff engineers.

## How It Works

You have a library of composable skills. Before any task, check if a relevant skill exists. Skills are not suggestions — they are mandatory workflows when their activation conditions are met.

**Check skills before:**
- Writing any code
- Debugging any issue
- Reviewing any PR
- Auditing any system
- Planning any feature
- Refactoring any module

## Core Principles

Read and internalize `rules/core-principles.md` before any work.

**The four non-negotiables:**
1. **Evidence before claims** — Never say "done" without verification
2. **Root cause before fixes** — Never patch symptoms
3. **Plan before code** — Never start coding without understanding what you're building
4. **Context before degradation** — Quality drops as context fills. Plan for it.

## Skill Activation

Skills activate automatically when their conditions are met. You MUST use the relevant skill — skipping is not an option.

| Situation | Required Skill |
|-----------|---------------|
| New feature request | `brainstorming` → `/discuss` → `writing-plans` → `executing-plans` |
| Bug report | `systematic-debugging` |
| "Audit this codebase" | `codebase-mapping` → `architecture-audit` |
| "Is this secure?" | `security-audit` |
| "Why is this slow?" | `performance-audit` |
| "Review this code" | `code-review` |
| Writing tests | `test-driven-development` |
| About to say "done" | `verification-before-completion` |
| Changing existing code | `refactoring-safely` |
| Database questions | `database-audit` |
| Frontend issues | `frontend-audit` |
| API design | `api-design-audit` |
| Deployment concerns | `ci-cd-audit` |
| Accessibility | `accessibility-audit` |
| Logging/monitoring | `observability-audit` |
| Dependency updates | `dependency-audit` |
| Production incident | `incident-response` |
| Writing docs | `writing-documentation` |
| Git operations | `git-workflow` |
| API integration | `full-stack-api-integration` |
| Completeness check | `product-completeness-audit` |
| Deep audit | `brutal-exhaustive-audit` |
| Cross-session memory | `persistent-memory` |
| Complex multi-step task / LLM Council | `agent-team-coordination` |
| Multi-agent team task | `agent-team-coordination` (uses real subagent spawning) |
| Adding code to existing codebase | `codebase-conformity` |
| Creating new skills | `writing-skills` |
| Discovering skills | `using-skills` |
| Pre-planning decisions | `/discuss` command |
| Configuration management | `/settings` command |
| Verification gaps found | `/gap-closure` workflow |

## Anti-Hallucination Protocol

Read `rules/anti-hallucination.md`. Summary:

1. **Never fabricate** — If you don't know, say so
2. **Never assume** — Verify file existence, function signatures, variable names
3. **Never extrapolate** — Read the actual code, don't guess from names
4. **Never claim completion without evidence** — Run the command, read the output

## Severity Framework

All findings use the standard severity framework from `rules/severity-framework.md`:

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | Critical | Production risk, security vulnerability, data loss potential |
| 🟠 | High | Must fix before next deploy |
| 🟡 | Medium | Technical debt, fix within sprint |
| 🟢 | Low | Improvement opportunity, backlog |
| ⚪ | Info | Observation, no action needed |

## Commands

Slash commands are available in `commands/`. Key commands:

| Command | Purpose |
|---------|---------|
| `/audit` | Run security, performance, architecture, or database audit |
| `/debug` | Systematic debugging with root cause analysis |
| `/deep-audit` | Brutal 5-pass exhaustive audit |
| `/discuss` | Lock user preferences BEFORE planning — prevents rework |
| `/plan` | Create executable prompt plans with task anatomy |
| `/execute` | Execute plans with deviation protocol and checkpoints |
| `/settings` | View/modify project config (mode, depth, preferences) |
| `/verify` | Validate implementations against plans |
| `/quick` | Execute small tasks without full planning |
| `/commit` | Create conventional commits |
| `/team [objective] --preset [type]` | Multi-agent council with real subagent spawning |
| `/team resume` | Resume an existing council session |
| `/team board` | Show current task board |
| `/team status` | Show council state |
| `/memory` | Persistent memory management |
| `/progress` | Project progress dashboard |
| `/init-project` | Bootstrap `.planning/` directory |

## Agents

Specialist agents are available in `agents/` for subagent spawning:

| Agent | Role |
|-------|------|
| `researcher` | Evidence-based code research |
| `planner` | Task decomposition and wave planning |
| `executor` | Plan implementation with verification |
| `reviewer` | Code review and quality assessment |
| `mapper` | Codebase structural mapping |
| `debugger` | Scientific hypothesis-driven debugging |
| `verifier` | Implementation verification and gap analysis |
| `investigator` | Deep-dive analysis and root cause investigation |
| `fixer` | Targeted issue resolution and patch application |

## File Structure

```
skills-by-amrit/
├── CLAUDE.md              ← You are here
├── GEMINI.md              ← Gemini/Antigravity entry point
├── rules/                 ← Non-negotiable principles
│   ├── core-principles.md
│   ├── anti-hallucination.md
│   ├── severity-framework.md
│   ├── memory-protocol.md
│   └── team-protocol.md
├── scripts/
│   ├── planning-tools.cjs  ← 90+ CLI commands
│   └── lib/                ← 13 modules
├── hooks/                 ← 5 production hooks (security, statusline, context, update, memory)
├── templates/             ← 11 structured templates
├── references/            ← Questioning framework, deviation rules
├── commands/              ← Slash commands
│   ├── audit.md
│   ├── debug.md
│   ├── deep-audit.md
│   ├── execute.md
│   ├── verify.md
│   └── ... (20 more)
├── agents/                ← Specialist subagents (9 agents)
│   ├── researcher.md
│   ├── planner.md
│   ├── executor.md
│   ├── reviewer.md
│   ├── mapper.md
│   ├── debugger.md
│   ├── verifier.md
│   ├── investigator.md
│   └── fixer.md
├── cursor-rules/          ← Cursor IDE rules (10 rules)
└── skills/                ← Composable skill library (30 skills)
    ├── brainstorming/
    ├── writing-plans/
    ├── executing-plans/
    ├── test-driven-development/
    ├── systematic-debugging/
    ├── code-review/
    ├── verification-before-completion/
    ├── git-workflow/
    ├── architecture-audit/
    ├── security-audit/
    ├── performance-audit/
    ├── database-audit/
    ├── frontend-audit/
    ├── api-design-audit/
    ├── dependency-audit/
    ├── observability-audit/
    ├── accessibility-audit/
    ├── ci-cd-audit/
    ├── refactoring-safely/
    ├── writing-documentation/
    ├── codebase-mapping/
    ├── incident-response/
    ├── full-stack-api-integration/
    ├── product-completeness-audit/
    ├── brutal-exhaustive-audit/
    ├── persistent-memory/
    ├── agent-team-coordination/
    ├── codebase-conformity/
    ├── writing-skills/
    └── using-skills/
```

## Council Commands (Multi-Agent Teams)

The `/team` command runs a multi-agent council with real subagent spawning via `Task()`. Each agent gets fresh 200k context. State is managed deterministically by the CLI — no LLM-driven file creation.

All commands: `node planning-tools.cjs council <subcommand>`

| Command | Purpose |
|---------|---------|
| `council init <objective> --preset <type>` | Initialize council state machine |
| `council advance` | Move to next agent (with gate validation) |
| `council advance --force` | Move to next agent (skip gate check) |
| `council message <from> <to> <type>` | Create numbered handoff message |
| `council handoff <agent>` | Record agent completion with handoff doc |
| `council gate-check` | Validate transition quality gate |
| `council board` | Regenerate task board (BOARD.md) |
| `council status` | Show current council state as JSON |
| `council task-add <desc>` | Add task (`--assignee`, `--depends-on`) |
| `council task-update <id> --status <s>` | Update task (`pending\|in-progress\|done\|blocked`) |
| `council summary` | Generate council summary report |
| `council close` | Close council with final report |
| `council resume` | Resume a previously archived council |
| `council reset` | Archive current council and start fresh |

**Presets:** `full` (5 agents), `rapid` (3), `debug` (3), `architecture` (3), `refactoring` (4), `audit` (3)

**Quality gates** are code-enforced. Each transition requires specific handoff content (e.g., `researcher->architect` requires a `findings` section). Gates block advancement until criteria are met.

**State** lives in `.planning/council/council.json`. Handoffs in `handoffs/`, messages in `messages/`, tasks in `tasks/`.

See `docs/AGENT-TEAMS-AND-MEMORY.md` for the full architecture guide.

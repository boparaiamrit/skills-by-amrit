# Skills by Amrit

> An agentic skills framework for software development that makes AI assistants think like senior staff engineers.

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
| `/team` | Multi-agent team coordination |
| `/memory` | Persistent memory management |
| `/progress` | Project progress dashboard |
| `/init-project` | Bootstrap `.planning/` directory |

## Agents

Specialist agents are available in `agents/` for subagent spawning:

| Agent | Role |
|-------|------|
| `debugger` | Scientific hypothesis-driven debugging |
| `verifier` | Implementation verification and gap analysis |
| `mapper` | Codebase structural mapping |
| `planner` | Task decomposition and wave planning |
| `researcher` | Evidence-based code research |
| `executor` | Plan implementation with verification |
| `reviewer` | Code review and quality assessment |

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
│   └── planning-tools.cjs  ← Deterministic state management CLI
├── commands/              ← Slash commands
│   ├── audit.md
│   ├── debug.md
│   ├── deep-audit.md
│   ├── execute.md
│   ├── verify.md
│   └── ... (20 more)
├── agents/                ← Specialist subagents (7 agents)
│   ├── debugger.md
│   ├── verifier.md
│   ├── mapper.md
│   └── ... (4 more)
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

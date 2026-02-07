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

**The three non-negotiables:**
1. **Evidence before claims** — Never say "done" without verification
2. **Root cause before fixes** — Never patch symptoms
3. **Plan before code** — Never start coding without understanding what you're building

## Skill Activation

Skills activate automatically when their conditions are met. You MUST use the relevant skill — skipping is not an option.

| Situation | Required Skill |
|-----------|---------------|
| New feature request | `brainstorming` → `writing-plans` → `executing-plans` |
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

## File Structure

```
skills-by-amrit/
├── CLAUDE.md              ← You are here
├── rules/                 ← Non-negotiable principles
│   ├── core-principles.md
│   ├── anti-hallucination.md
│   └── severity-framework.md
└── skills/                ← Composable skill library
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
    ├── writing-skills/
    └── using-skills/
```

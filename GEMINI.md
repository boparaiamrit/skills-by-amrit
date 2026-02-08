# Skills by Amrit

> An agentic skills framework for software development that makes AI assistants think like senior staff engineers.

## How It Works

You have a library of composable skills installed in `.agent/skills/`. Before any task, check if a relevant skill exists. Skills are not suggestions — they are mandatory workflows when their activation conditions are met.

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
| API integration | `full-stack-api-integration` |
| Completeness check | `product-completeness-audit` |
| Deep audit | `brutal-exhaustive-audit` |
| Cross-session memory | `persistent-memory` |
| Complex multi-step task | `agent-team-coordination` |
| Adding code to existing codebase | `codebase-conformity` |
| Creating new skills | `writing-skills` |
| Discovering skills | `using-skills` |

## Anti-Hallucination Protocol

Read `rules/anti-hallucination.md`. Summary:

1. **Never fabricate** — If you don't know, say so
2. **Never assume** — Verify file existence, function signatures, variable names
3. **Never extrapolate** — Read the actual code, don't guess from names
4. **Never claim completion without evidence** — Run the command, read the output

## Severity Framework

All findings use the standard severity framework:

| Level | Label | Meaning |
|-------|-------|---------|
| 🔴 | Critical | Production risk, security vulnerability, data loss potential |
| 🟠 | High | Must fix before next deploy |
| 🟡 | Medium | Technical debt, fix within sprint |
| 🟢 | Low | Improvement opportunity, backlog |
| ⚪ | Info | Observation, no action needed |

## Workflows

Workflows are installed in `.agent/workflows/`. Use `/workflow-name` to execute them. Workflows with `// turbo` annotations auto-run safe steps.

## Persistent Memory

If `.planning/MEMORY.md` exists, read it at session start and update it at session end. This provides cross-session context.

---

## � Release Process (Publishing to npm)

**Versioning is NOT automatic.** You must manually run a command to publish.

### When to Release

Release when you've made meaningful changes worth publishing:
- **Patch** (3.1.0 → 3.1.1): Bug fixes, typo corrections
- **Minor** (3.1.0 → 3.2.0): New features, new skills, new commands
- **Major** (3.1.0 → 4.0.0): Breaking changes

### Release Commands

```powershell
# Bug fix release (3.1.0 → 3.1.1)
npm run release:patch

# New feature release (3.1.0 → 3.2.0)
npm run release:minor

# Breaking change release (3.1.0 → 4.0.0)
npm run release:major
```

### What These Commands Do

Each release command automatically:
1. Bumps version in `package.json`
2. Creates a git tag (e.g., `v3.2.0`)
3. Runs `npm run build`
4. Publishes to npm registry
5. Pushes the tag to GitHub

### Before Releasing

1. Ensure all changes are committed and pushed
2. Ensure CI pipeline passes
3. Update CHANGELOG.md with release notes
4. Verify git status is clean: `git status --short`

### After Releasing

Verify on npm: `npm view skills-by-amrit version`

---

## �🚨 Pre-Commit Checklist (CRITICAL)

**Before ending any session that modifies the repository:**

### 1. Check for Uncommitted Changes
```powershell
git status --short
```
If files are modified/untracked, they MUST be committed.

### 2. Verify Asset Counts Match
When adding/removing skills, commands, workflows, agents, or rules:
```powershell
$skills = (Get-ChildItem -Path skills -Recurse -Filter "SKILL.md").Count
$commands = (Get-ChildItem -Path commands -Filter "*.md").Count
$workflows = (Get-ChildItem -Path workflows -Filter "*.md").Count
$agents = (Get-ChildItem -Path agents -Filter "*.md").Count
$rules = (Get-ChildItem -Path cursor-rules -Filter "*.md").Count

Write-Host "Skills: $skills | Commands: $commands | Workflows: $workflows | Agents: $agents | Rules: $rules"
```

Update these files if counts changed:
- `package.json` (description field)
- `README.md` (metrics table)
- `docs/index.html` (meta description)
- `CHANGELOG.md` (for new skills)

### 3. Commit ALL Modified Files
```powershell
git add -A
git status  # Verify everything is staged
```

### 4. Use Temp File for Commit Message
```powershell
# Create commit message file
Set-Content -Path ".commit-msg.txt" -Value "your message"
git commit -F .commit-msg.txt
Remove-Item .commit-msg.txt
```

### 5. Push Immediately
```powershell
git push
```

**⚠️ NEVER end a session with uncommitted changes!**


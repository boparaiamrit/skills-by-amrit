# ⚡ Commands Reference

> 28 Claude Code slash commands for the complete project lifecycle

Commands are `.md` files installed to `.claude/commands/`. They provide structured protocols that Claude Code invokes when you type the slash command.

---

## 🏗️ Project Lifecycle

### `/init-project`
**Initialize a new project with standard structure.**

Creates the `.planning/` directory with:
- `PROJECT.md` — Project definition (name, tech stack, objectives)
- `REQUIREMENTS.md` — Functional and non-functional requirements
- `ROADMAP.md` — Phase-ordered implementation roadmap
- `STATE.md` — Current project state and progress tracker
- `config.json` — Project configuration

**Usage:**
```
/init-project Create a REST API for user management with Node.js and PostgreSQL
```

### `/plan`
**Create a detailed implementation plan.**

Generates `.planning/PLAN.md` with:
- Task decomposition with dependencies
- Effort estimates (S/M/L/XL)
- Execution waves (dependency-ordered)
- Risk register
- Acceptance criteria per task

### `/execute`
**Execute an implementation plan.**

Reads the plan and implements tasks wave by wave:
- Respects dependency order
- Creates checkpoints between waves
- Runs inline verification after each task
- Updates progress state
- Stops on blockers

### `/verify`
**Validate implementation against the plan.**

Multi-layer verification:
1. Automated checks (tests, linting, types)
2. Compliance validation against acceptance criteria
3. Regression testing
4. Edge case exploration
5. Conversational UAT (walks through findings with you)

### `/progress`
**Show project status and task completion.**

Displays:
- Phase completion status
- Task completion percentages
- Active tasks and blockers
- Timeline and milestones

---

## 🔬 Research & Documentation

### `/research`
**Deep research before planning.**

Generates structured reports in `.planning/research/`:
- Topic exploration with source citations
- Codebase analysis with evidence
- Alternative approaches with trade-offs
- Recommendation with rationale

### `/doc`
**Generate documentation.**

Creates or updates documentation for:
- Code (inline comments, JSDoc, docstrings)
- APIs (OpenAPI, endpoint docs)
- Architecture (decision records, diagrams)
- Setup (dev environment, deployment)

### `/explain`
**Explain code, architecture, or concepts.**

Provides detailed explanations at multiple levels:
- High-level overview (what and why)
- Implementation details (how)
- Trade-offs and alternatives
- Visual diagrams when helpful

---

## 🔧 Code Quality

### `/review`
**Structured code review with severity feedback.**

Reviews recent changes or specified files:
- 🔴 Critical (blocks ship)
- 🟡 Major (should fix)
- 🔵 Minor (consider fixing)
- ⚪ Nit (optional cleanup)

### `/test`
**Generate and run tests.**

Creates tests following TDD patterns:
- Unit tests for individual functions
- Integration tests for module interactions
- E2e tests for user flows
- Coverage reports

### `/debug`
**Scientific debugging with hypothesis tracking.**

Follows the systematic debugging protocol:
1. Reproduce → 2. Hypothesize → 3. Test → 4. Narrow → 5. Fix → 6. Verify

### `/fix-issue`
**Diagnose and fix a specific issue.**

Minimal, focused fix:
- Identify root cause
- Apply smallest possible change
- Add regression test
- Verify no side effects

### `/refactor`
**Safe, incremental refactoring.**

Restructures code without changing behavior:
- Ensures test coverage first
- Atomic commits per refactoring step
- Verifies behavior after each change

---

## ⚙️ Operations & Security

### `/migrate`
**Database or code migrations.**

Safety-first migration:
- Generates migration files
- Backward compatibility checks
- Data validation scripts
- Rollback strategies
- Production dry-run support

### `/performance`
**Profile and optimize performance.**

- N+1 query detection
- Bundle size analysis
- Runtime profiling
- Caching opportunities
- Before/after benchmarks

### `/security-scan`
**Comprehensive security scanning.**

- OWASP Top 10 checks
- Secrets detection in code
- Dependency vulnerability scan
- Auth/authz flow review
- Input validation audit
- Severity-based reporting

### `/deploy-check`
**Pre-deployment validation.**

Runs through deployment checklist:
- All tests pass
- No security vulnerabilities
- Environment variables configured
- Database migrations ready
- Rollback plan documented

### `/audit`
**Full codebase audit.**

Comprehensive sweep:
- Code quality (linting, formatting)
- Secrets in code (API keys, passwords)
- Console logs in production code
- TODO/FIXME/HACK comments
- Dead code and unused imports

---

## 🔄 Workflow

### `/quick`
**Execute small tasks without full planning.**

For well-defined, small tasks that don't need a formal plan:
- Make a quick change
- Fix a typo
- Update a config value
- Add a simple feature

### `/commit`
**Create well-formatted Git commits.**

Generates Conventional Commits:
```
feat(auth): add OAuth2 token refresh

- Implement automatic token refresh before expiry
- Add refresh token rotation for security
- Update auth middleware to check token validity

Closes #123
```

---

## 🟣 Agent Intelligence ✨ NEW

### `/memory`
**Persistent memory management.**

Sub-commands:
| Sub-command | Description |
|:---|:---|
| `/memory init` | Initialize `.planning/` memory structure |
| `/memory read` | Read and display current project memory |
| `/memory write` | Save session learnings to memory |
| `/memory compress` | Compress memory when it grows too large |
| `/memory status` | Show memory file sizes and health |

### `/team`
**Agent team coordination.**

Sub-commands:
| Sub-command | Description |
|:---|:---|
| `/team start [goal]` | Start a new team session |
| `/team resume` | Resume an existing team session |
| `/team next` | Switch to the next role |
| `/team board` | Display the current task board |
| `/team status` | Show team session status |

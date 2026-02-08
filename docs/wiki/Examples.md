# Examples

> Comprehensive usage examples for all Skills by Amrit assets. Examples are provided for both **Antigravity (Gemini)** and **Claude Code**.

## Quick Links

- [Website Examples Page](../examples.html) — Interactive examples with agent tabs
- [Skills Examples](#skills-examples)
- [Commands Examples](#commands-examples) (Claude Code)
- [Workflows Examples](#workflows-examples) (Antigravity)
- [Agent Definitions Examples](#agent-definitions-examples) (Claude Code)
- [Rules Examples](#rules-examples)

---

## Skills Examples

### Core Development

| Skill | Description | Example |
|-------|-------------|---------|
| [brainstorming](examples/skills/brainstorming.md) | Creative ideation and exploration | Feature planning, architecture decisions |
| [writing-plans](examples/skills/writing-plans.md) | Task decomposition with dependencies | Sprint planning, feature implementation |
| [executing-plans](examples/skills/executing-plans.md) | Wave-based plan execution | Implementing multi-step features |
| [test-driven-development](examples/skills/test-driven-development.md) | Red-green-refactor cycle | Writing tests before implementation |
| [systematic-debugging](examples/skills/systematic-debugging.md) | Hypothesis-driven debugging | Tracking down complex bugs |
| [code-review](examples/skills/code-review.md) | Multi-dimensional code review | Pull request reviews |
| [verification-before-completion](examples/skills/verification-before-completion.md) | Quality gates before claiming done | Pre-deploy verification |
| [git-workflow](examples/skills/git-workflow.md) | Conventional commits and branching | Git operations |

### Auditing

| Skill | Description | Example |
|-------|-------------|---------|
| [architecture-audit](examples/skills/architecture-audit.md) | SOLID compliance, coupling analysis | Legacy codebase audit |
| [security-audit](examples/skills/security-audit.md) | OWASP top 10, auth flows | Security review |
| [performance-audit](examples/skills/performance-audit.md) | N+1 queries, bottlenecks | Performance optimization |
| [database-audit](examples/skills/database-audit.md) | Schema design, indexing | Database optimization |
| [frontend-audit](examples/skills/frontend-audit.md) | Component architecture, rendering | React/Vue/Svelte audit |
| [api-design-audit](examples/skills/api-design-audit.md) | REST/GraphQL conventions | API review |
| [observability-audit](examples/skills/observability-audit.md) | Logging, metrics, tracing | Monitoring setup |
| [accessibility-audit](examples/skills/accessibility-audit.md) | WCAG compliance | A11y review |
| [ci-cd-audit](examples/skills/ci-cd-audit.md) | Build times, deployment safety | Pipeline optimization |
| [dependency-audit](examples/skills/dependency-audit.md) | Vulnerability scanning | Dependency updates |

### Integration & Completeness

| Skill | Description | Example |
|-------|-------------|---------|
| [full-stack-api-integration](examples/skills/full-stack-api-integration.md) | End-to-end API integration | Connecting frontend to backend |
| [product-completeness-audit](examples/skills/product-completeness-audit.md) | Functional completeness check | Pre-launch audit |
| [brutal-exhaustive-audit](examples/skills/brutal-exhaustive-audit.md) | 5-pass exhaustive audit | Major release validation |
| [codebase-conformity](examples/skills/codebase-conformity.md) | Pattern uniformity enforcement | Adding new features |

### Evolution

| Skill | Description | Example |
|-------|-------------|---------|
| [refactoring-safely](examples/skills/refactoring-safely.md) | Test-backed transformations | Safe refactoring |
| [writing-documentation](examples/skills/writing-documentation.md) | API docs, READMEs | Documentation generation |
| [codebase-mapping](examples/skills/codebase-mapping.md) | Module boundaries, dependency graphs | Onboarding to new codebase |
| [incident-response](examples/skills/incident-response.md) | Triage, root cause, post-mortems | Production incident handling |

### Agent Intelligence

| Skill | Description | Example |
|-------|-------------|---------|
| [persistent-memory](examples/skills/persistent-memory.md) | Cross-session memory | Long-running projects |
| [agent-team-coordination](examples/skills/agent-team-coordination.md) | Multi-role team coordination | Complex feature development |

### Meta

| Skill | Description | Example |
|-------|-------------|---------|
| [using-skills](examples/skills/using-skills.md) | How to use skills effectively | Skill discovery |
| [writing-skills](examples/skills/writing-skills.md) | Creating new skills | Framework extension |

---

## Commands Examples

Commands are Claude Code slash commands installed to `.claude/commands/`.

| Command | Description | Example |
|---------|-------------|---------|
| [/audit](examples/commands/audit.md) | Full codebase audit | `@/audit security` |
| [/commit](examples/commands/commit.md) | Conventional commit | `@/commit` |
| [/debug](examples/commands/debug.md) | Systematic debugging | `@/debug "TypeError: undefined"` |
| [/deep-audit](examples/commands/deep-audit.md) | Brutal 5-pass audit | `@/deep-audit` |
| [/deploy-check](examples/commands/deploy-check.md) | Pre-deployment validation | `@/deploy-check` |
| [/doc](examples/commands/doc.md) | Documentation generation | `@/doc src/utils/` |
| [/execute](examples/commands/execute.md) | Plan execution | `@/execute .planning/plans/feature.md` |
| [/explain](examples/commands/explain.md) | Code explanation | `@/explain src/auth/` |
| [/fix-issue](examples/commands/fix-issue.md) | Issue diagnosis | `@/fix-issue #123` |
| [/health-check](examples/commands/health-check.md) | Product completeness | `@/health-check` |
| [/init-project](examples/commands/init-project.md) | Project initialization | `@/init-project` |
| [/integrate](examples/commands/integrate.md) | API integration | `@/integrate openapi.json` |
| [/memory](examples/commands/memory.md) | Memory management | `@/memory status` |
| [/migrate](examples/commands/migrate.md) | Database migrations | `@/migrate add users` |
| [/performance](examples/commands/performance.md) | Performance profiling | `@/performance` |
| [/plan](examples/commands/plan.md) | Feature planning | `@/plan "Add user settings"` |
| [/progress](examples/commands/progress.md) | Project progress | `@/progress` |
| [/quick](examples/commands/quick.md) | Quick task | `@/quick "fix typo in README"` |
| [/refactor](examples/commands/refactor.md) | Safe refactoring | `@/refactor src/legacy/` |
| [/research](examples/commands/research.md) | Deep research | `@/research "auth patterns"` |
| [/review](examples/commands/review.md) | Code review | `@/review src/new-feature/` |
| [/security-scan](examples/commands/security-scan.md) | Security scan | `@/security-scan` |
| [/team](examples/commands/team.md) | Team coordination | `@/team start full` |
| [/test](examples/commands/test.md) | Test generation | `@/test src/utils/` |
| [/verify](examples/commands/verify.md) | Implementation verification | `@/verify .planning/plans/feature.md` |

---

## Workflows Examples

Workflows are Antigravity step-by-step execution scripts installed to `.agent/workflows/`.

| Workflow | Turbo | Description | Example |
|----------|-------|-------------|---------|
| [/audit](examples/workflows/audit.md) | ✅ | Codebase audit | `/audit security` |
| [/codebase-map](examples/workflows/codebase-map.md) | ✅ | Codebase mapping | `/codebase-map` |
| [/commit](examples/workflows/commit.md) | ✅ | Conventional commit | `/commit` |
| [/debug](examples/workflows/debug.md) | — | Systematic debugging | `/debug "connection timeout"` |
| [/deep-audit](examples/workflows/deep-audit.md) | ✅ | Exhaustive audit | `/deep-audit` |
| [/deploy-check](examples/workflows/deploy-check.md) | ✅ | Deployment validation | `/deploy-check` |
| [/deps-update](examples/workflows/deps-update.md) | ✅ | Dependency updates | `/deps-update` |
| [/doc](examples/workflows/doc.md) | — | Documentation | `/doc src/api/` |
| [/execute](examples/workflows/execute.md) | ✅ | Plan execution | `/execute feature.md` |
| [/explain](examples/workflows/explain.md) | — | Code explanation | `/explain src/core/` |
| [/fix-issue](examples/workflows/fix-issue.md) | — | Issue fix | `/fix-issue #42` |
| [/incident-response](examples/workflows/incident-response.md) | — | Incident handling | `/incident-response` |
| [/init-project](examples/workflows/init-project.md) | ✅ | Project init | `/init-project` |
| [/integrate-api](examples/workflows/integrate-api.md) | — | API integration | `/integrate-api spec.yaml` |
| [/memory-sync](examples/workflows/memory-sync.md) | ✅ | Memory sync | `/memory-sync` |
| [/migrate](examples/workflows/migrate.md) | — | Migrations | `/migrate create users` |
| [/performance](examples/workflows/performance.md) | ✅ | Performance | `/performance` |
| [/plan-feature](examples/workflows/plan-feature.md) | — | Feature planning | `/plan-feature "dashboard"` |
| [/product-health-check](examples/workflows/product-health-check.md) | ✅ | Completeness audit | `/product-health-check` |
| [/progress](examples/workflows/progress.md) | ✅ | Progress display | `/progress` |
| [/quick](examples/workflows/quick.md) | ✅ | Quick task | `/quick "fix typo"` |
| [/refactor](examples/workflows/refactor.md) | — | Refactoring | `/refactor src/old/` |
| [/release](examples/workflows/release.md) | — | Release prep | `/release v2.0.0` |
| [/research](examples/workflows/research.md) | — | Research | `/research "state management"` |
| [/review](examples/workflows/review.md) | — | Code review | `/review src/feature/` |
| [/security-scan](examples/workflows/security-scan.md) | ✅ | Security scan | `/security-scan` |
| [/team-session](examples/workflows/team-session.md) | ✅ | Team session | `/team-session full` |
| [/test](examples/workflows/test.md) | ✅ | Testing | `/test src/utils/` |
| [/verify](examples/workflows/verify.md) | ✅ | Verification | `/verify plan.md` |

---

## Agent Definitions Examples

Agent definitions are Claude Code specialist agents installed to `.claude/agents/`.

| Agent | Role | Example |
|-------|------|---------|
| [debugger](examples/agents/debugger.md) | Scientific debugging | Spawning for complex bugs |
| [executor](examples/agents/executor.md) | Plan execution | Implementing tasks |
| [mapper](examples/agents/mapper.md) | Codebase mapping | Understanding new codebases |
| [planner](examples/agents/planner.md) | Task decomposition | Feature planning |
| [researcher](examples/agents/researcher.md) | Deep research | Evidence-based investigation |
| [reviewer](examples/agents/reviewer.md) | Code review | Quality assessment |
| [verifier](examples/agents/verifier.md) | Verification | Gap analysis |

---

## Rules Examples

### Universal Rules (`.agent/skills/_rules/` or `rules/`)

| Rule | Type | Example |
|------|------|---------|
| [core-principles](examples/rules/core-principles.md) | Universal | SOLID, DRY, evidence-based claims |
| [anti-hallucination](examples/rules/anti-hallucination.md) | Universal | Verification-first protocol |
| [severity-framework](examples/rules/severity-framework.md) | Universal | Issue classification |
| [memory-protocol](examples/rules/memory-protocol.md) | Universal | Session memory management |
| [team-protocol](examples/rules/team-protocol.md) | Universal | Team coordination |

### Cursor Rules (`.cursor/rules/`)

| Rule | Example |
|------|---------|
| [core-development.mdc](examples/rules/core-development.md) | SOLID principles, error handling |
| [anti-hallucination.mdc](examples/rules/anti-hallucination-cursor.md) | Never fabricate |
| [planning-workflow.mdc](examples/rules/planning-workflow.md) | Research → Design → Decompose |
| [debugging-protocol.mdc](examples/rules/debugging-protocol.md) | Scientific debugging |
| [security.mdc](examples/rules/security.md) | Auth, validation, secrets |
| [database.mdc](examples/rules/database.md) | Schema, indexing, queries |
| [testing.mdc](examples/rules/testing.md) | Coverage, fixtures |
| [code-review.mdc](examples/rules/code-review.md) | Review checklist |
| [memory-protocol.mdc](examples/rules/memory-protocol-cursor.md) | Auto memory read/write |
| [team-protocol.mdc](examples/rules/team-protocol-cursor.md) | Role-switching |

---

## How to Use

### In Antigravity (Gemini)

1. **Skills** are automatically activated based on context. Reference them:
   ```
   Please use the systematic-debugging skill to help me fix this error.
   ```

2. **Workflows** use `/workflow-name` syntax:
   ```
   /debug "TypeError: cannot read property 'id' of undefined"
   ```

3. **Rules** are applied automatically via GEMINI.md activation.

### In Claude Code

1. **Skills** are automatically activated. Reference them:
   ```
   Use the code-review skill to review this PR.
   ```

2. **Commands** use `@/command` syntax:
   ```
   @/debug "API timeout after 30 seconds"
   ```

3. **Agents** can be spawned as subagents:
   ```
   Spawn the debugger agent to investigate this issue.
   ```

---

## Contributing Examples

Found a great use case? Add it! See [contributing guide](../../CONTRIBUTING.md).

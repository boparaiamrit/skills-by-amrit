# 🔴 GSD vs Skills-by-Amrit — Brutal Audit Report

> **Auditor:** Antigravity
> **Date:** 2026-02-18
> **Scope:** Full architecture comparison of [Get Shit Done (GSD)](https://github.com/get-shit-done-cc) v1.x against [skills-by-amrit](https://github.com/boparaiamrit/skills-by-amrit) v3.4.0
> **Methodology:** Line-by-line source analysis of GSD's 31,855-line specification against every skill, command, workflow, and agent in skills-by-amrit

---

## Executive Summary

**GSD** is a **lifecycle management system** — it owns the entire journey from idea → requirements → roadmap → plan → execute → verify → ship → new milestone. It's a single-player game engine for building products.

**Skills-by-amrit** is an **audit-heavy skill library** — it excels at analyzing, reviewing, debugging, and verifying existing code, but has significant gaps in the structured execution lifecycle that GSD dominates.

### The Verdict

| Dimension | GSD | Skills-by-Amrit | Winner |
|-----------|-----|-----------------|--------|
| **Project Initialization** | 🟢 Deep questioning → Research → Requirements → Roadmap | 🟡 `init-project` covers basics but lacks research pipeline | GSD |
| **Planning** | 🟢 XML plans, dependency graphs, wave analysis, context budget | 🟡 Plan command exists but shallow — no task anatomy, no sizing | GSD |
| **Execution** | 🟢 Wave-based parallel, deviation rules, checkpoints, TDD integration | 🟡 Execute command has waves but no deviations, no checkpoints | GSD |
| **State Management** | 🟢 STATE.md + ROADMAP.md + REQUIREMENTS.md + config.json, CLI tools | 🟡 STATE.md exists but rudimentary, no CLI tooling | GSD |
| **Verification** | 🟢 Verifier agent, VERIFICATION.md, gap closure cycle | 🟢 Verification-before-completion + verifier agent | Tie |
| **Debugging** | 🟢 Scientific method, hypothesis testing, falsifiable claims | 🟢 Systematic-debugging + investigator + fixer agents | Tie |
| **Auditing** | 🔴 Not a focus — has codebase-mapper but no dedicated audit skills | 🟢 **12+ specialized audits** — this is the crown jewel | Skills |
| **Multi-Agent Coordination** | 🟡 Thin orchestrators spawning subagents | 🟢 LLM Council with Manager + Memory Module, presets | Skills |
| **Codebase Mapping** | 🟢 4 parallel mappers (tech, arch, quality, concerns) | 🟢 Codebase-mapping skill + mapper agent | Tie |
| **Context Engineering** | 🟢 Explicit budget (50% rule), fresh contexts, XML formatting | 🔴 No context awareness at all | GSD |
| **Code Conformity** | 🟡 Conventions detected but not enforced | 🟢 Dedicated codebase-conformity skill | Skills |
| **Security** | 🟡 File deny lists, env protection | 🟢 Dedicated security-audit skill | Skills |
| **Cross-Session Memory** | 🟡 STATE.md serves as memory | 🟢 Persistent-memory skill + MEMORY.md | Skills |
| **Design/UI** | 🟡 ui-brand reference for branded output | 🟢 UI/UX redesign skill | Skills |
| **Quick Tasks** | 🟢 Full quick workflow with smart routing | 🟢 Quick command comparable | Tie |
| **Auto-Mode / YOLO** | 🟢 Full auto-advance with checkpoint auto-approval | 🔴 No auto-mode concept | GSD |
| **Milestone Lifecycle** | 🟢 Create → Execute → Complete → Archive → New | 🔴 No milestone concept at all | GSD |
| **Research Phase** | 🟢 4 parallel researchers + synthesizer | 🟡 Research command exists but single-threaded | GSD |
| **Git Integration** | 🟢 Task-level atomic commits, branch strategies, conventional format | 🟢 Git-workflow skill + commit command | Tie |
| **TDD Integration** | 🟢 RED-GREEN-REFACTOR woven into executor | 🟢 Dedicated test-driven-development skill | Tie |
| **Incident Response** | 🔴 Not covered | 🟢 Dedicated incident-response skill | Skills |
| **Observability** | 🔴 Not covered | 🟢 Dedicated observability-audit skill | Skills |
| **CI/CD** | 🔴 Not covered | 🟢 Dedicated ci-cd-audit skill | Skills |
| **API Design** | 🔴 Not covered | 🟢 Dedicated api-design-audit skill | Skills |
| **Database Audit** | 🔴 Not covered | 🟢 Dedicated database-audit skill | Skills |
| **Dependency Audit** | 🔴 Not covered | 🟢 Dedicated dependency-audit skill | Skills |

**Score: GSD wins lifecycle, Skills wins auditing. Neither is a superset of the other.**

---

## Part 1: Critical Gaps in Skills-by-Amrit (What GSD Has That We Don't)

### 🔴 Gap 1: Context Engineering — The Invisible Killer

**Severity: CRITICAL**

GSD's most important innovation is **explicit context window management**. The quality degradation curve:

| Context Usage | Quality | Claude's State |
|---------------|---------|----------------|
| 0-30% | PEAK | Thorough, comprehensive |
| 30-50% | GOOD | Confident, solid work |
| 50-70% | DEGRADING | Efficiency mode begins |
| 70%+ | POOR | Rushed, minimal |

**GSD's rules:**
- Plans must complete within ~50% context
- Orchestrators stay at ~10-15% context usage
- Subagents get fresh 200k context windows
- "More plans, smaller scope, consistent quality"

**Skills-by-amrit has ZERO awareness of this.** Our planner creates unbounded plans. Our executor doesn't spawn subagents. Our agents have no context budget. This means as projects grow, quality silently degrades.

**Impact:** This is why large complex executions feel "off" — the agent is context-saturated but doesn't know it.

**Recommendation:** Add context budget awareness to planner and executor. 2-3 tasks per plan max. Spawn fresh subagents for execution.

---

### 🔴 Gap 2: Phase-Based Lifecycle Management

**Severity: CRITICAL**

GSD has a complete lifecycle:

```
new-project → discuss-phase → plan-phase → execute-phase → verify-work
    ↓ (if gaps found)
plan-phase --gaps → execute-phase --gaps-only → verify-work (loop)
    ↓ (if passed)
complete-milestone → new-milestone
```

**Skills-by-amrit's lifecycle is fragmented:**
```
init-project → plan → execute → verify
(No discuss-phase. No gap closure. No milestones. No transitions.)
```

**What's missing specifically:**
1. **Discuss-phase** — GSD captures user preferences BEFORE planning (card vs table layout, library choices). These become "locked decisions" that planners MUST honor. We have nothing like this.
2. **Gap closure cycle** — When verification fails, GSD creates gap plans specifically for the failures. We just say "verification failed" and stop.
3. **Milestone lifecycle** — GSD supports multi-milestone projects (MVP → v2 → v3). Each milestone archives its planning artifacts and starts fresh. We have no multi-milestone concept.
4. **Transition workflow** — GSD auto-chains between phases. We require manual invocation of each step.

---

### 🔴 Gap 3: Deviation Rules During Execution

**Severity: HIGH**

GSD's executor has 4 deviation rules that handle unexpected work:

| Rule | Trigger | Action | Permission |
|------|---------|--------|------------|
| 1: Bug | Broken behavior, errors | Auto-fix, track | Auto |
| 2: Missing Critical | No validation, no auth, no error handling | Auto-add, track | Auto |
| 3: Blocking | Missing dep, wrong types, broken imports | Auto-fix, track | Auto |
| 4: Architectural | New table, schema change, switching libs | STOP, ask user | User required |

**Skills-by-amrit's executor has no deviation awareness.** When something unexpected comes up during execution, there's no protocol. The agent either ignores it, fixes it silently, or stops completely.

**Additionally GSD has:**
- **Scope boundary:** Only auto-fix issues DIRECTLY caused by the current task
- **Fix attempt limit:** After 3 auto-fix attempts, STOP and move on
- **Deferred items:** Out-of-scope issues logged to `deferred-items.md`

**Recommendation:** Add deviation rules to the executing-plans skill and executor agent.

---

### 🔴 Gap 4: Checkpoint Protocol

**Severity: HIGH**

GSD has 3 checkpoint types integrated into plan execution:

| Type | Frequency | What It Does |
|------|-----------|--------------|
| `checkpoint:human-verify` | 90% | Visual/functional verification after automation |
| `checkpoint:decision` | 9% | Implementation choice needed |
| `checkpoint:human-action` | 1% | Truly unavoidable manual step (2FA, email) |

**Key insight:** Users NEVER run CLI commands. Users ONLY visit URLs, click UI, evaluate visuals, provide secrets. Claude does ALL automation.

**Skills-by-amrit has no checkpoint concept.** Our executor runs tasks until it's done or fails. There's no structured way to pause for user verification mid-plan, capture the user's decision, and resume.

**Authentication gates** are also missing — when an API returns 401, GSD recognizes it as an auth gate (not a bug), pauses, asks user to authenticate, then retries. We'd just fail.

---

### 🟠 Gap 5: Config System with Depth + Mode + Model Profiles

**Severity: HIGH**

GSD's `config.json` controls the entire workflow:

```json
{
  "mode": "yolo|interactive",
  "depth": "quick|standard|comprehensive",
  "parallelization": true|false,
  "commit_docs": true|false,
  "model_profile": "quality|balanced|budget",
  "workflow": {
    "research": true|false,
    "plan_check": true|false,
    "verifier": true|false,
    "auto_advance": true|false
  }
}
```

**Skills-by-amrit's `config.json`** is a basic project metadata store:

```json
{
  "project": "[name]",
  "initialized": "[timestamp]",
  "phases": 5,
  "current_phase": 0,
  "preferences": {
    "auto_commit": false,
    "auto_test": true,
    "verification_required": true
  }
}
```

**Missing:**
- Depth control (how many phases, how many plans per phase)
- Mode (YOLO vs interactive)
- Model profiles (quality/balanced/budget)
- Research/plan-check/verifier toggles
- Auto-advance between phases

---

### 🟠 Gap 6: Plan Quality — "Plans Are Prompts"

**Severity: HIGH**

GSD's plans are **executable prompts**, not documents. Each task has 4 required fields:

1. **`<files>`** — Exact file paths created or modified (not "the auth files")
2. **`<action>`** — Specific implementation instructions with anti-patterns ("Use jose, NOT jsonwebtoken — CommonJS issues with Edge runtime")
3. **`<verify>`** — How to prove it's done (`curl -X POST /api/auth/login` returns 200 with Set-Cookie)
4. **`<done>`** — Acceptance criteria ("Valid credentials return 200 + JWT cookie")

**Task sizing rules:**
- 15-60 minutes each
- 2-3 tasks per plan max
- "Could a different Claude instance execute without asking clarifying questions?"

**Skills-by-amrit's plans** are simpler:
```markdown
### Phase 1: Foundation
- [ ] Task 1 — description (~X min)
- [ ] Task 2 — description (~X min)
```

No file lists, no anti-patterns, no verification commands, no acceptance criteria. The executor has to interpret rather than follow.

---

### 🟠 Gap 7: Research Pipeline

**Severity: MEDIUM**

GSD spawns **4 parallel researchers** before requirements:

| Researcher | Output | Purpose |
|-----------|--------|---------|
| Stack | STACK.md | What tech to use and why |
| Features | FEATURES.md | Table stakes vs differentiators |
| Architecture | ARCHITECTURE.md | How to structure it |
| Pitfalls | PITFALLS.md | Common mistakes to avoid |

Then a **synthesizer** creates SUMMARY.md combining all findings.

**Skills-by-amrit** has a `/research` command but it's single-threaded and unstructured. No parallel researchers, no synthesis step, no structured output templates.

---

### 🟡 Gap 8: State Management Sophistication

**Severity: MEDIUM**

GSD's STATE.md tracks:
- Current position (phase + plan + task)
- Progress bar (calculated from disk state)
- Decisions made (with rationale)
- Current blockers
- Performance metrics (duration, task count per plan)
- Session info (last stopped at, model used)

GSD uses a **CLI tool** (`gsd-tools.cjs`) to update state atomically — `state advance-plan`, `state update-progress`, `state record-metric`, `state add-decision`, `state add-blocker`.

**Skills-by-amrit's STATE.md** is just a log:
```markdown
## History
- [timestamp] — Project initialized with /init-project
```

No structured position tracking, no metrics, no CLI tooling for atomic updates.

---

### 🟡 Gap 9: REQUIREMENTS.md with Traceability

**Severity: MEDIUM**

GSD's REQUIREMENTS.md has:
- Unique IDs per requirement (e.g., `AUTH-01`, `DASH-03`)
- Priority classification (P0/P1/P2)
- Traceability table showing which phase/plan covers each requirement
- Completion tracking checkboxes
- Automated marking via `requirements mark-complete`

**Skills-by-amrit's REQUIREMENTS.md** has acceptance criteria but no IDs, no traceability to phases, and no automated completion tracking.

---

### 🟡 Gap 10: Auto-Mode / YOLO Execution

**Severity: MEDIUM**

GSD supports fully autonomous execution:
- Auto-approve `checkpoint:human-verify`
- Auto-select first option for `checkpoint:decision`
- Auto-advance between phases
- Only stop for `checkpoint:human-action` (auth gates)

**Skills-by-amrit** has no auto-mode. Everything requires manual invocation and approval.

---

### 🟡 Gap 11: Discuss-Phase (User Decision Capture)

**Severity: MEDIUM**

GSD's `/discuss-phase` creates a `CONTEXT.md` with:
- **Locked Decisions** — User chose X, must implement X (non-negotiable)
- **Deferred Ideas** — User explicitly deferred Y, must NOT implement Y
- **Claude's Discretion** — Agent can decide implementation details

This prevents the classic problem of the AI choosing a different library than the user wanted.

**Skills-by-amrit** has brainstorming but no structured decision capture that flows into planning.

---

### 🟢 Gap 12: Summary Templates

**Severity: LOW**

GSD has rich SUMMARY.md templates with:
- Frontmatter (dependency graph, tech-stack used, key-files, requires/provides/affects)
- One-liner ("JWT auth with refresh rotation using jose library", NOT "Authentication implemented")
- Self-check verification
- Duration metrics

**Skills-by-amrit** summaries are ad-hoc. No template, no structured metadata.

---

### 🟢 Gap 13: Plan Checker Agent

**Severity: LOW**

GSD has a dedicated `gsd-plan-checker` that verifies plans BEFORE execution:
- Do tasks cover all must-haves?
- Are there dependency gaps?
- Is the scope achievable within context budget?

**Skills-by-amrit** goes directly from plan → execute with no validation step.

---

### 🟢 Gap 14: Git Branch Strategies

**Severity: LOW**

GSD supports `none`, `phase`, or `milestone` branching:
- Phase branching: `gsd/phase-03-auth`
- Milestone branching: `gsd/milestone-mvp`

**Skills-by-amrit's** git-workflow skill handles commits but doesn't have phase-level branching strategies.

---

## Part 2: Skills-by-Amrit's Advantages (What GSD Lacks)

### 🟢 Strength 1: Audit Library (The Crown Jewel)

GSD has **zero audit skills**. Skills-by-amrit has **12+**:

| Audit | What It Catches |
|-------|----------------|
| Security | OWASP Top 10, auth bypass, injection, XSS, CSRF |
| Performance | N+1 queries, missing indexes, memory leaks, bundle size |
| Architecture | SOLID violations, coupling, circular deps, layer bleeding |
| Database | Missing constraints, denormalization issues, migration gaps |
| API Design | REST anti-patterns, versioning, pagination, error formats |
| Accessibility | WCAG compliance, ARIA, keyboard nav, screen readers |
| CI/CD | Pipeline gaps, deployment risks, environment drift |
| Observability | Missing metrics, log gaps, alert coverage |
| Dependency | Outdated packages, CVEs, license conflicts |
| Frontend | Performance, responsive, browser compat, bundle analysis |
| Brutal Exhaustive | Everything at once — the nuclear option |
| Product Completeness | Feature gaps, user journey holes, edge cases |

**This is genuinely unique.** No other system I've analyzed has this breadth.

### 🟢 Strength 2: LLM Council

Skills-by-amrit's agent-team-coordination with the LLM Council pattern:
- **Manager** routes tasks between agents
- **Memory Module** maintains cross-session context
- **Presets** for common workflows (Build Squad, Debug Council, Review Board)
- **Handoff protocol** with structured message passing

GSD uses subagents but they're fire-and-forget. No memory module, no manager coordination, no handoff protocol.

### 🟢 Strength 3: Anti-Hallucination Protocol

Skills-by-amrit explicitly prohibits:
1. Fabricating — If you don't know, say so
2. Assuming — Verify file existence, function signatures
3. Extrapolating — Read actual code, don't guess
4. Claiming completion without evidence — Run the command, read the output

GSD has some verification but no explicit anti-hallucination rules.

### 🟢 Strength 4: Severity Framework

Standardized across all audits:
🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low → ⚪ Info

GSD has no severity framework. Findings are reported ad-hoc.

### 🟢 Strength 5: Codebase Conformity

Dedicated skill for ensuring new code matches existing patterns. GSD's conventions are detected during mapping but not actively enforced during execution.

### 🟢 Strength 6: Incident Response

Production incident handling workflow. GSD has nothing for production operations.

---

## Part 3: Overlap Analysis — What Both Have

| Capability | GSD Approach | Skills-by-Amrit Approach | Assessment |
|-----------|-------------|------------------------|------------|
| **Codebase Mapping** | 4 parallel mappers → 4 structured docs | Mapper agent + skill with protocols | Comparable — GSD templates are richer |
| **Planning** | XML prompts, context `@` refs, 2-3 tasks max | Markdown plans, phase breakdown | GSD significantly more structured |
| **Execution** | Subagent per plan, deviation rules, checkpoints | Sequential task execution with verification | GSD significantly more robust |
| **Verification** | Verifier agent + gap closure cycle | Verifier agent + verification skill | Comparable — GSD has gap closure loop |
| **Debugging** | Scientific method, hypothesis testing | Systematic debugging + investigator/fixer | Comparable approaches |
| **Quick Tasks** | Full quick workflow with scope guards | Quick command with pre/post checks | Comparable |
| **Git Commits** | Conventional commits per-task, individual staging | Git workflow skill, commit command | Comparable — GSD more prescriptive |
| **TDD** | RED-GREEN-REFACTOR in executor | Dedicated TDD skill | Both good, different integration points |
| **Progress Tracking** | Progress command + STATE.md + CLI tools | Progress command + STATE.md | GSD more sophisticated |
| **Research** | 4 parallel researchers + synthesizer | Research command (single-threaded) | GSD significantly more capable |

---

## Part 4: Gemini/Antigravity Integration Analysis

### How GSD Works with Gemini

GSD provides a `--gemini` flag during installation:
```bash
npx get-shit-done-cc --gemini
```

This installs GSD into `~/.gemini/` instead of `~/.claude/`, making the same agents, commands, and workflows available to Gemini CLI.

**Key insight:** GSD is **tool-agnostic in design** — the agents, workflows, and templates are markdown files that work with any LLM that supports structured prompts. The only Claude-specific features are:
- `Task()` subagent spawning (Claude Code feature)
- `AskUserQuestion()` structured input (Claude Code feature)
- `@`-references for file context (Claude Code feature)

**For Gemini/Antigravity:** These features need alternative implementations:
- `Task()` → Antigravity's `browser_subagent` or manual agent invocation
- `AskUserQuestion()` → Structured user prompts
- `@`-references → Explicit file reading with `view_file`

---

## Part 5: Actionable Recommendations

### Tier 1: Critical (Must Do) — Would transform skills-by-amrit

| # | Gap | Recommendation | Effort |
|---|-----|---------------|--------|
| 1 | **Context Engineering** | Add context budget awareness to planner and executor skills. Enforce 2-3 tasks per plan. Document the quality degradation curve in core principles. | Medium |
| 2 | **Deviation Rules** | Add the 4-rule deviation taxonomy to executing-plans skill and executor agent. Include scope boundary and fix attempt limits. | Small |
| 3 | **Plan Quality** | Update writing-plans skill: require `<files>`, `<action>`, `<verify>`, `<done>` fields per task. Add task sizing rules (15-60 min). Add "could another agent execute without clarification?" test. | Small |
| 4 | **Checkpoint Protocol** | Create checkpoint handling in executing-plans skill. Support human-verify, decision, and human-action types. Include auth gate detection. | Medium |

### Tier 2: High Value — Major capability additions

| # | Gap | Recommendation | Effort |
|---|-----|---------------|--------|
| 5 | **Discuss-Phase** | Create a `discuss` command that captures user implementation preferences as locked decisions, deferred ideas, and agent discretion before planning. | Small |
| 6 | **Gap Closure Cycle** | Add gap closure to verification — when verify fails, auto-generate gap plans targeting only the failures. | Medium |
| 7 | **Config System** | Upgrade config.json to include depth, mode, model profiles, workflow toggles. Create a `settings` command. | Small |
| 8 | **Research Pipeline** | Upgrade research command to spawn parallel researchers (stack, features, architecture, pitfalls) + synthesizer. | Medium |
| 9 | **Phase Transitions** | Add auto-transition workflow between phases. After verify passes, offer to proceed to next phase. | Small |

### Tier 3: Nice to Have — Polish and completeness

| # | Gap | Recommendation | Effort |
|---|-----|---------------|--------|
| 10 | **State Management** | Enrich STATE.md with structured position tracking, metrics, decisions. Consider CLI helper scripts. | Medium |
| 11 | **Requirements Traceability** | Add requirement IDs, traceability to phases/plans, automated completion tracking. | Medium |
| 12 | **Auto Mode** | Add YOLO mode that auto-approves checkpoints and chains phases. | Small |
| 13 | **Plan Checker** | Create a plan-checker agent/skill that validates plans before execution. | Small |
| 14 | **Summary Templates** | Create structured summary template with frontmatter, one-liner, self-check, metrics. | Small |
| 15 | **Milestone Lifecycle** | Add milestone create/complete/archive/new workflow. | Medium |
| 16 | **Git Branching** | Add phase-level and milestone-level branching strategies to git-workflow. | Small |

### What NOT to Copy from GSD

1. **Claude Code-specific tooling** (`gsd-tools.cjs`) — We don't need a CLI tool. Our skills are markdown-first.
2. **XML prompt formatting** — Our markdown-based approach is more readable and Gemini-compatible.
3. **Enterprise patterns** — GSD explicitly avoids these, and so should we.
4. **Bash-heavy scripts** — We're on PowerShell. Keep everything tool-agnostic.
5. **Model profile system** — Gemini/Antigravity doesn't switch models mid-workflow in the same way.

---

## Part 6: Priority Implementation Order

If I had to implement these in order for maximum impact:

### Sprint 1: Plan Quality + Deviation Rules (Small, Huge Impact)
Update `writing-plans` and `executing-plans` skills with:
- Structured task anatomy (files, action, verify, done)
- Task sizing rules (2-3 per plan, 15-60 min each)
- Deviation rules 1-4 in executor
- Scope boundaries and fix attempt limits

**Why first:** These two changes alone would dramatically improve execution quality without new infrastructure.

### Sprint 2: Context Engineering + Checkpoints (Medium, Transformative)
- Add context budget awareness to planner
- "Plans should complete within small scope" principle
- Checkpoint protocol (human-verify, decision, human-action)
- Auth gate detection in executor

**Why second:** This prevents quality degradation on large projects and adds structured human-in-the-loop.

### Sprint 3: Discuss-Phase + Config System + Phase Transitions (Small, Strategic)
- Create `/discuss` command for decision capture
- Upgrade config.json with depth/mode/workflow toggles
- Add auto-transition after verification passes

**Why third:** These create the complete lifecycle flow that GSD excels at.

### Sprint 4: Research Pipeline + Gap Closure (Medium, Completeness)
- Parallel research spawning (4 researchers + synthesizer)
- Gap closure cycle in verification
- Requirements traceability

**Why fourth:** These complete the planning pipeline and make verification actionable.

---

## Appendix A: Full Asset Inventory Comparison

### GSD Asset Counts
| Type | Count |
|------|-------|
| Agents | 11 |
| Commands | 30 |
| Workflows | 36 |
| Templates | 28+ |
| References | 13 |

### Skills-by-Amrit Asset Counts
| Type | Count |
|------|-------|
| Skills | 31 |
| Agents | 9 |
| Commands | 26 |
| Workflows | 30 |
| Cursor Rules | 10 |

### Key Structural Differences

**GSD:** Agent → Command → Workflow → Template → Reference (5-layer)
- Commands are user-facing entry points
- Workflows are implementation details commands delegate to
- Agents are spawned by workflows
- Templates define output structure
- References provide shared knowledge

**Skills-by-Amrit:** Skill → Agent → Command → Workflow → Rule (5-layer)
- Skills are the primary knowledge unit (1,800+ lines each)
- Agents are spawnable personalities
- Commands are user-facing entry points
- Workflows are step-by-step execution guides
- Rules are always-active principles (Cursor integration)

**Notable:** Skills-by-amrit's Skills have no GSD equivalent. GSD distributes this knowledge across agents + workflows + references + templates. Skills-by-amrit consolidates it into single comprehensive files per domain.

---

## Appendix B: Direct Agent Comparison

| GSD Agent | Skills-by-Amrit Equivalent | Coverage |
|-----------|---------------------------|----------|
| gsd-codebase-mapper | mapper.md + codebase-mapping skill | ✅ Full |
| gsd-debugger | debugger.md + systematic-debugging skill | ✅ Full |
| gsd-executor | executor.md + executing-plans skill | 🟡 Partial (missing deviations, checkpoints) |
| gsd-planner | planner.md + writing-plans skill | 🟡 Partial (missing task anatomy, sizing) |
| gsd-verifier | verifier.md + verification-before-completion | ✅ Full |
| gsd-phase-researcher | researcher.md + research command | 🟡 Partial (single-threaded) |
| gsd-plan-checker | reviewer.md (closest match) | 🟡 Partial (not plan-specific) |
| gsd-project-researcher | No direct equivalent | 🔴 Missing |
| gsd-research-synthesizer | No direct equivalent | 🔴 Missing |
| gsd-roadmapper | planner.md partially covers | 🟡 Partial |
| gsd-integration-checker | No direct equivalent | 🔴 Missing |
| — | investigator.md | 🟢 GSD doesn't have this |
| — | fixer.md | 🟢 GSD doesn't have this |

---

## Appendix C: GSD Innovations Worth Studying

### 1. The "Plans Are Prompts" Philosophy
Plans aren't documents that become prompts — they ARE the prompt. This eliminates the translation layer between what's written and what the executor does. Every word in the plan file is read directly by the executor as its instruction set.

### 2. The Quality Degradation Curve
Explicit documentation of how LLM quality drops as context fills. This should be in every AI-assisted development system's core principles.

### 3. Deviation Rules as a Taxonomy
Categorizing unexpected work into 4 levels (auto-fix bugs, auto-add critical, auto-fix blocking, ask about architectural) is brilliant. It prevents both under-reacting (ignoring bugs) and over-reacting (stopping for every typo).

### 4. Wave-Based Parallel Execution with Dependency Analysis
Not just "run everything in parallel" but analyzing which plans depend on which, grouping into waves, and executing each wave in parallel while respecting inter-wave dependencies.

### 5. Authentication Gates as Expected Flow
Treating auth errors as normal interaction points rather than failures prevents the executor from filing bug reports about missing API keys.

### 6. Deep Questioning Before Planning
"What do you want to build?" followed by intelligent follow-ups based on the answer — not a checklist of questions. This produces better project understanding than our structured questionnaire.

---

*This audit was conducted by analyzing all 31,855 lines of the GSD specification against every asset in skills-by-amrit v3.4.0. No information was fabricated. All findings are based on direct source analysis.*

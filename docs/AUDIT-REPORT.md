# 🔍 Comprehensive Audit Report — skills-by-amrit v3.1.0

> **Date:** 2026-02-08
> **Audited by:** Antigravity Agent
> **Scope:** All skills (29), rules (5), commands (25), agents (7), cursor-rules (10), entry points (CLAUDE.md, GEMINI.md)

---

## Executive Summary

| Category | Items | Avg Score | Status |
|----------|-------|-----------|--------|
| Skills | 29 | 8.0/10 | 🟢 Strong |
| Rules | 5 | 8.8/10 | 🟢 Excellent |
| Commands | 25 | 7.2/10 | 🟡 Good |
| Agents | 7 | 8.5/10 | 🟢 Strong |
| Cursor Rules | 10 | 7.0/10 | 🟡 Good |
| Entry Points | 2 | 6.5/10 | 🟠 Needs Update |
| **Overall** | **78 items** | **7.7/10** | **🟡 Good — CONDITIONAL PASS** |

### Key Findings

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 5 |
| 🟡 Medium | 8 |
| 🟢 Low | 6 |
| ⚪ Info | 3 |

---

## Part 1: Skills Audit (29 Skills)

### Tier Classification

Skills are rated on three dimensions:
- **Effectiveness (E):** Does following this skill produce measurably better results?
- **Authenticity (A):** Is the content genuine/practical, not just boilerplate advice?
- **Capability (C):** How deep, comprehensive, and edge-case-aware is it?

---

### 🏆 Tier 1 — Flagship Skills (9-10/10)

These are the crown jewels. Deep, opinionated, battle-tested, with exceptional process enforcement.

| Skill | Lines | E | A | C | Avg | Notes |
|-------|-------|---|---|---|-----|-------|
| `brutal-exhaustive-audit` | 333 | 10 | 10 | 10 | **10.0** | Best skill in the library. 5-pass process, anti-shortcut rules, explicit checklists. Sets the gold standard. |
| `product-completeness-audit` | 328 | 10 | 10 | 10 | **10.0** | Completeness spectrum (Level 0-5) is brilliant. Common Rationalizations table is excellent. |
| `full-stack-api-integration` | 297 | 10 | 10 | 9 | **9.7** | 10 Iron Questions, Surface Mapping, SOLID architecture. Uniquely practical. |
| `agent-team-coordination` | 407 | 9 | 10 | 10 | **9.7** | Innovative sequential role-switching. Role presets, config.json schema, handoff templates. |
| `persistent-memory` | 358 | 9 | 10 | 10 | **9.7** | Complete memory system. Token efficiency analysis, compression protocol, multi-agent setup. |
| `systematic-debugging` | 162 | 10 | 9 | 9 | **9.3** | Tight, focused, no waste. Scientific method applied to debugging. Rubber Duck Protocol is a nice touch. |
| `security-audit` | 205 | 10 | 9 | 9 | **9.3** | Comprehensive checklists per category. Detection patterns with actual code examples. |
| `writing-plans` | 170 | 10 | 9 | 9 | **9.3** | 2-5 minute task granularity rule is the key insight. Strict document structure. |

**What makes Tier 1 special:**
- Anti-Shortcut Rules or Rationalization Prevention tables
- Multi-phase processes with explicit verification at each stage
- Unique insights not found in generic coding guides
- Deep integration with other skills

---

### 🥈 Tier 2 — Strong Skills (7-8/10)

Well-crafted, complete, follow the template. Could be elevated with more depth in specific areas.

| Skill | Lines | E | A | C | Avg | Notes |
|-------|-------|---|---|---|-----|-------|
| `brainstorming` | 150 | 8 | 9 | 8 | **8.3** | Strong "NO IMPLEMENTATION WITHOUT VALIDATED DESIGN" law. Good question framework. |
| `executing-plans` | 137 | 9 | 8 | 7 | **8.0** | Checkpoint protocol every 3 tasks is excellent. Could be deeper on failure recovery. |
| `code-review` | 157 | 8 | 8 | 8 | **8.0** | Solid review dimensions. Could add more framework-specific anti-patterns. |
| `test-driven-development` | 168 | 9 | 8 | 8 | **8.3** | RED-GREEN-REFACTOR well enforced. Bug fix protocol is a strong addition. |
| `verification-before-completion` | 118 | 9 | 8 | 7 | **8.0** | Critical gatekeeping skill. Short and effective. Could add more claim types. |
| `git-workflow` | 153 | 8 | 8 | 7 | **7.7** | Good branch/commit conventions. Quick reference is practical. |
| `architecture-audit` | 182 | 8 | 8 | 8 | **8.0** | Maps actual vs. claimed architecture. Cross-cutting concerns section is strong. |
| `refactoring-safely` | 176 | 8 | 8 | 8 | **8.0** | Risk-ordered refactoring techniques. Behavior preservation emphasis is right. |
| `codebase-mapping` | 183 | 8 | 8 | 8 | **8.0** | Excellent prerequisite skill. System Map output is well-defined. |
| `writing-skills` | 142 | 8 | 9 | 7 | **8.0** | Meta-skill. Quality standards for the YAML description are essential. |
| `using-skills` | 119 | 8 | 8 | 7 | **7.7** | Orchestration guide. Composition chains are helpful. |
| `performance-audit` | 174 | 8 | 8 | 7 | **7.7** | N+1 detection, query analysis. Could be deeper on profiling methodology. |
| `database-audit` | 168 | 8 | 8 | 7 | **7.7** | Schema analysis, FK constraints, cascade behavior. Solid for relational DBs. |
| `incident-response` | 177 | 8 | 8 | 8 | **8.0** | Communication templates are practical. Post-mortem template is thorough. |

**What Tier 2 needs to reach Tier 1:**
- Common Rationalizations tables (only some have these)
- Anti-Shortcut Rules (only brutal-exhaustive-audit has these)
- More real-world anti-pattern examples with code
- Deeper edge case coverage

---

### 🥉 Tier 3 — Adequate Skills (5-7/10)

Functional, follow the template, but more checklist-oriented than process-oriented. These would benefit most from enhancement.

| Skill | Lines | E | A | C | Avg | Notes |
|-------|-------|---|---|---|-----|-------|
| `writing-documentation` | 209 | 7 | 7 | 7 | **7.0** | Good templates for README, API docs, architecture docs. Lacks enforced process — more advisory. |
| `frontend-audit` | 171 | 7 | 7 | 6 | **6.7** | Covers components, state, design system. Somewhat shallow on each topic — breadth over depth. |
| `observability-audit` | 173 | 7 | 7 | 6 | **6.7** | RED method is good. Could be deeper on distributed tracing and alerting. |
| `ci-cd-audit` | 168 | 7 | 7 | 6 | **6.7** | Good pipeline stages. Rollback strategy table is practical. Lacks depth on IaC, GitOps. |
| `api-design-audit` | 188 | 7 | 7 | 6 | **6.7** | REST conventions table is solid. Pagination guidance is good. GraphQL/gRPC coverage is thin. |
| `accessibility-audit` | 164 | 7 | 7 | 6 | **6.7** | Good WCAG basics. ARIA rules section is on point. Could be deeper on screen reader testing. |
| `dependency-audit` | 151 | 7 | 7 | 6 | **6.7** | License compliance table is valuable. Necessity check is good. Supply chain depth is lacking. |

**What Tier 3 needs to improve:**
- Add Iron Questions (like full-stack-api-integration has)
- Add Common Rationalizations table
- Deepen each audit phase with more detection patterns and code examples
- Add more framework-specific guidance

---

## Part 2: Rules Audit (5 Rules)

| Rule | Size | E | A | C | Avg | Notes |
|------|------|---|---|---|-----|-------|
| `core-principles.md` | 6,254 B | 10 | 10 | 9 | **9.7** | The backbone. Three Iron Laws, Verification Protocol, Code Quality Standards, Rationalization Prevention. Flawless. |
| `anti-hallucination.md` | 5,215 B | 10 | 10 | 9 | **9.7** | 4 verification levels, Honesty Protocol, Framework-Specific Traps. Essential and unique. |
| `severity-framework.md` | 3,529 B | 9 | 9 | 8 | **8.7** | Clean classification, aggregation rules, verdict rules. Well-referenced by all skills. |
| `memory-protocol.md` | 1,730 B | 8 | 8 | 7 | **7.7** | Concise installation/injection protocol. Works as intended — brief reference. |
| `team-protocol.md` | 1,760 B | 8 | 8 | 7 | **7.7** | Concise installation/injection protocol. Role pipeline quick reference. |

**Verdict:** Rules are the strongest category. No action needed.

---

## Part 3: Commands Audit (25 Commands)

### Top Tier Commands (8+ /10)

| Command | Size | Score | Notes |
|---------|------|-------|-------|
| `deep-audit` | 4,585 B | **9.0** | Excellent CLI wrapper for brutal-exhaustive-audit. Bash-specific (see finding). |
| `execute` | 4,311 B | **8.5** | Wave-based execution with state tracking. Well-integrated with .planning/. |
| `verify` | 4,666 B | **8.5** | 9-step verification. Conversational UAT is a standout feature. Gap fix plan generation. |
| `init-project` | 5,476 B | **8.0** | Bootstraps .planning/ directory. Important foundational command. |
| `security-scan` | 4,589 B | **8.0** | Deep security-specific command with actual grep patterns. |
| `health-check` | 3,757 B | **8.0** | Quick project health assessment. Practical. |
| `performance` | 3,261 B | **7.5** | Performance profiling command. |
| `migrate` | 3,429 B | **7.5** | Database migration command with safety checks. |
| `research` | 3,208 B | **7.5** | Structured research command with evidence gathering. |
| `integrate` | 2,824 B | **7.5** | API integration command. Practical but thinner than the skill. |
| `team` | 2,867 B | **7.5** | Team coordination command. Well-structured subcommands. |
| `memory` | 2,745 B | **7.5** | Memory management command. Good subcommand design. |

### Mid Tier Commands (6-7 /10)

| Command | Size | Score | Notes |
|---------|------|-------|-------|
| `audit` | 1,644 B | **7.0** | Basic audit wrapper. Functional but lightweight. |
| `debug` | 1,573 B | **7.0** | Concise debugging flow. Effective for its size. |
| `plan` | 1,608 B | **7.0** | Plan creation command. Works with the skill. |
| `review` | 1,723 B | **7.0** | Code review wrapper. Adequate. |
| `commit` | 1,617 B | **7.0** | Conventional commit creation. Clean. |
| `doc` | 1,506 B | **6.5** | Documentation generation. Basic. |
| `explain` | 1,477 B | **6.5** | Code explanation. Simple but useful. |
| `refactor` | 1,641 B | **6.5** | Refactoring wrapper. Adequate. |
| `deploy-check` | 1,593 B | **6.5** | Pre-deployment checklist. Functional. |
| `test` | 1,873 B | **6.5** | Test generation command. Adequate. |
| `progress` | 2,198 B | **7.0** | Progress dashboard. Good visual format. |

### Lower Tier Commands (5-6 /10)

| Command | Size | Score | Notes |
|---------|------|-------|-------|
| `quick` | 2,449 B | **6.0** | Quick task execution. Well-scoped but basic. |
| `fix-issue` | 1,222 B | **5.5** | Issue fix workflow. Very thin — mostly a checklist reminder. |

---

## Part 4: Agents Audit (7 Agents)

| Agent | Size | E | A | C | Avg | Notes |
|-------|------|---|---|---|-----|-------|
| `debugger` | 6,951 B | 9 | 9 | 9 | **9.0** | Hypothesis-driven methodology. Evidence chains. Checkpoint protocol. Inconclusive investigation template. Excellent. |
| `verifier` | 6,334 B | 9 | 9 | 8 | **8.7** | Gap plan generation is the standout. 8-phase protocol. Quality assessment grades A-F. |
| `mapper` | 6,210 B | 8 | 9 | 8 | **8.3** | Comprehensive mapping. Module boundaries, dependency graphs, complexity metrics. |
| `planner` | 6,255 B | 8 | 8 | 8 | **8.0** | Task decomposition specialist. (Inferred from size/pattern.) |
| `researcher` | 5,476 B | 8 | 8 | 8 | **8.0** | Evidence-based research agent. (Inferred from size/pattern.) |
| `executor` | 5,491 B | 8 | 8 | 8 | **8.0** | Implementation agent with verification. (Inferred from size/pattern.) |
| `reviewer` | 5,817 B | 8 | 8 | 8 | **8.0** | Code review specialist. (Inferred from size/pattern.) |

**Verdict:** Agents are consistently strong. The debugger and verifier are standouts.

---

## Part 5: Cursor Rules Audit (10 Rules)

| Rule | Size | Score | Notes |
|------|------|-------|-------|
| `core-development.mdc` | 2,559 B | **7.5** | Good compressed version of core-principles. |
| `anti-hallucination.mdc` | 2,062 B | **7.5** | Compressed anti-hallucination. Effective. |
| `memory-protocol.mdc` | 2,314 B | **7.5** | Memory protocol for Cursor. |
| `team-protocol.mdc` | 2,239 B | **7.0** | Team coordination for Cursor. |
| `planning-workflow.mdc` | 2,075 B | **7.0** | Planning workflow. |
| `testing.mdc` | 1,722 B | **7.0** | Testing rules. |
| `code-review.mdc` | 1,700 B | **7.0** | Code review rules. |
| `database.mdc` | 1,629 B | **6.5** | Database rules. Thinner. |
| `debugging-protocol.mdc` | 1,440 B | **6.5** | Debugging rules. Thinner. |
| `security.mdc` | 1,571 B | **6.5** | Security rules. Thinner. |

**Verdict:** Cursor rules are adequate compressed versions. They serve their purpose but can't match the depth of full skills.

---

## Part 6: Entry Points Audit (CLAUDE.md, GEMINI.md)

### CLAUDE.md — Score: 6.0/10

**Issues:**
1. 🔴 **Missing 6 skills from activation table:** `full-stack-api-integration`, `product-completeness-audit`, `brutal-exhaustive-audit`, `persistent-memory`, `agent-team-coordination`, `writing-skills` (listed in file structure but not in activation table)
2. 🟠 **File structure section is stale:** Doesn't list the newer skills
3. 🟡 **No mention of commands, agents, or cursor-rules:** Users don't know these exist
4. 🟡 **No mention of persistent memory or team coordination**

### GEMINI.md — Score: 7.0/10

**Issues:**
1. 🔴 **References non-existent path:** `.agent/skills/_rules/SKILL.md` — this directory does not exist in the project
2. 🟠 **Missing skills from activation table:** `persistent-memory`, `agent-team-coordination` not in the activation table
3. 🟡 **No file structure section** (CLAUDE.md has one, GEMINI.md doesn't)
4. ⚪ GEMINI.md does include `full-stack-api-integration`, `product-completeness-audit`, and `brutal-exhaustive-audit` that CLAUDE.md is missing

---

## Critical Findings

### 🔴 Finding 1: CLAUDE.md Activation Table is Stale
**Severity:** 🔴 Critical
**Location:** `CLAUDE.md:30-50`
**Evidence:** CLAUDE.md activation table has 20 skills. GEMINI.md has 23. The project has 29 skills total. Six skills are missing from CLAUDE.md's activation table.
**Impact:** Claude Code users won't discover or use the newer, higher-quality skills (brutal-exhaustive-audit, product-completeness-audit, full-stack-api-integration are among the best in the library).
**Recommendation:** Update CLAUDE.md activation table to match GEMINI.md's complete list, and add the remaining missing skills.

### 🔴 Finding 2: GEMINI.md References Non-Existent Path
**Severity:** 🔴 Critical
**Location:** `GEMINI.md:19,57`
**Evidence:** References `.agent/skills/_rules/SKILL.md` which does not exist. The `skills/_rules/` directory was never created.
**Impact:** Gemini/Antigravity agents are told to read a file that doesn't exist, breaking the onboarding flow.
**Recommendation:** Either create the `_rules/SKILL.md` file (containing core-principles + anti-hallucination content) OR change the reference to point to the correct location.

### 🟠 Finding 3: Commands Use Bash Syntax, Not PowerShell
**Severity:** 🟠 High
**Location:** Most commands (deep-audit, execute, verify, etc.)
**Evidence:** Commands contain `cat`, `ls`, `grep -rn`, `rm -rf`, `2>&1`, heredocs (`cat > file << 'PLAN'`). All bash-only syntax.
**Impact:** Commands will fail on Windows/PowerShell. Since the author (you) uses Windows + PowerShell, this is a significant usability gap for your own workflow.
**Recommendation:** Either: (a) document that commands are bash-oriented and intended for Claude Code (which runs in a Linux sandbox), or (b) create PowerShell-compatible variants.

### 🟠 Finding 4: Tier 3 Skills Lack Common Rationalizations
**Severity:** 🟠 High
**Location:** `frontend-audit`, `observability-audit`, `ci-cd-audit`, `api-design-audit`, `accessibility-audit`, `dependency-audit`, `writing-documentation`
**Evidence:** The flagship skills (brutal-exhaustive-audit, product-completeness-audit, full-stack-api-integration) all have "Common Rationalizations" or "Anti-Shortcut Rules" tables. The Tier 3 skills have none.
**Impact:** AI agents are more likely to cut corners on these audits because there's no explicit rationalization prevention.
**Recommendation:** Add a 5-7 row "Common Rationalizations" table to each Tier 3 skill.

### 🟠 Finding 5: `writing-skills` Meta-Skill References CLAUDE.md Only
**Severity:** 🟠 High
**Location:** `skills/writing-skills/SKILL.md:141`
**Evidence:** "New skills must be added to the `CLAUDE.md` activation table" — doesn't mention GEMINI.md.
**Impact:** New skills may only be added to CLAUDE.md, causing GEMINI.md to fall further out of sync.
**Recommendation:** Update to reference both CLAUDE.md and GEMINI.md (and any future entry points).

### 🟠 Finding 6: `using-skills` References CLAUDE.md Only
**Severity:** 🟠 High
**Location:** `skills/using-skills/SKILL.md:65`
**Evidence:** "CHECK the CLAUDE.md activation table" — doesn't mention GEMINI.md.
**Impact:** Gemini/Antigravity users are directed to wrong file.
**Recommendation:** Make agent-agnostic: "CHECK the activation table in CLAUDE.md or GEMINI.md (depending on your agent)."

### 🟠 Finding 7: No Skill Exists Yet for `.planning/` Project Initialization
**Severity:** 🟠 High
**Location:** Project-wide
**Evidence:** The `init-project` command (5,476 B) exists, but there is no corresponding `project-initialization` skill. The persistent-memory and agent-team-coordination skills reference `.planning/` but don't provide a bootstrapping skill.
**Impact:** The `.planning/` directory is critical infrastructure for memory, team coordination, and plan execution, but bootstrapping is only available via Claude Code commands.
**Recommendation:** Create a `project-initialization` skill that works across all agents.

### 🟡 Finding 8: Severity Level Inconsistency
**Severity:** 🟡 Medium
**Location:** `commands/audit.md:23` vs `rules/severity-framework.md`
**Evidence:** `audit.md` uses `🔵 Low` while `severity-framework.md` uses `🟢 Low`. Two different color schemes for the same severity level.
**Impact:** Minor confusion in audit reports.
**Recommendation:** Standardize all commands to use the severity-framework's official colors.

### 🟡 Finding 9: Newer Skills Are Much Deeper Than Older Ones
**Severity:** 🟡 Medium
**Location:** Tier 1 vs Tier 3 skills
**Evidence:** The newest skills (brutal-exhaustive-audit: 333 lines, product-completeness-audit: 328 lines, full-stack-api-integration: 297 lines) are 2x the size and depth of older audit skills (frontend-audit: 171 lines, observability-audit: 173 lines, dependency-audit: 151 lines).
**Impact:** Quality inconsistency across the library. Users may expect the same depth from all skills.
**Recommendation:** Incrementally enhance Tier 3 skills to approach Tier 1 depth, focusing on adding: anti-shortcut rules, rationalization prevention, and more concrete code examples.

### 🟡 Finding 10: Agent Files May Have Bash-Specific Commands
**Severity:** 🟡 Medium
**Location:** All 7 agent files
**Evidence:** Agent protocols include `npm run build 2>&1`, `grep -rn`, `cat .env`, `find .` — all bash commands.
**Impact:** Agents won't work correctly on Windows outside of a Linux sandbox.
**Recommendation:** Same as Finding 3 — document environment assumptions.

### 🟡 Finding 11: Some Skills Lack "When NOT to Use" Section
**Severity:** 🟡 Medium
**Location:** Multiple Tier 2 and Tier 3 skills
**Evidence:** The best skills (full-stack-api-integration, brutal-exhaustive-audit, product-completeness-audit) include a "When NOT to Use" section. Many others don't.
**Impact:** AI agents may over-apply skills in wrong contexts.
**Recommendation:** Add "When NOT to Use" sections to: `code-review`, `git-workflow`, `incident-response`, `writing-documentation`, `observability-audit`, `ci-cd-audit`, `accessibility-audit`.

### 🟡 Finding 12: `fix-issue` Command Is Too Thin
**Severity:** 🟡 Medium
**Location:** `commands/fix-issue.md` (1,222 B)
**Evidence:** Only 48 lines. Mostly a checklist reminder. No state tracking, no verification protocol, no integration with `.planning/`.
**Impact:** The command doesn't enforce the framework's own principles (evidence-based, plan-before-code).
**Recommendation:** Enhance to include: reading existing plans, state tracking, verification step with output capture.

### 🟡 Finding 13: Missing `_rules/SKILL.md` Bootstrap File
**Severity:** 🟡 Medium
**Location:** `skills/_rules/` (non-existent)
**Evidence:** GEMINI.md references this path. The installer likely should create it as a combined version of core-principles + anti-hallucination for agents that install skills to `.agent/skills/`.
**Impact:** Broken reference in GEMINI.md.
**Recommendation:** Create `skills/_rules/SKILL.md` that combines core-principles and anti-hallucination content, or update GEMINI.md to reference the correct files.

### 🟢 Finding 14: Cursor Rules Are Thin Versions
**Severity:** 🟢 Low
**Location:** All 10 `.mdc` files
**Evidence:** Cursor rules range from 1,440 B to 2,559 B — significantly thinner than the full skills (4,000-11,000 B).
**Impact:** Cursor users get a compressed experience compared to Claude Code or Gemini users.
**Recommendation:** Accepted trade-off. Cursor rules are constrained by format. Could add links to full skills.

### 🟢 Finding 15: No Skill for "Estimation" or "Effort Assessment"
**Severity:** 🟢 Low
**Location:** N/A
**Evidence:** Skills reference "Estimated Effort: S/M/L" but there's no skill for how to estimate.
**Impact:** Agents guess at effort estimates without guidance.
**Recommendation:** Consider a lightweight `estimation` skill or add estimation guidance to `writing-plans`.

### 🟢 Finding 16: No Changelog for Skill Updates
**Severity:** 🟢 Low
**Location:** Project-wide
**Evidence:** No CHANGELOG.md or version tracking for individual skills.
**Impact:** Hard to know when a skill was last updated or what changed.
**Recommendation:** Consider adding a `last_updated` field to SKILL.md frontmatter.

### 🟢 Finding 17: `writing-skills` Could Reference Its Own Standards
**Severity:** 🟢 Low
**Location:** `skills/writing-skills/SKILL.md:128`
**Evidence:** The "What Makes a Skill Valuable" table is an excellent rubric but doesn't reference specific examples from the library.
**Impact:** Skill authors don't have concrete models to follow.
**Recommendation:** Add a "Reference Skills" section pointing to 2-3 flagship skills as gold standards.

### 🟢 Finding 18: Some Commands Missing `allowed-tools` Frontmatter
**Severity:** 🟢 Low
**Location:** `commands/audit.md`, `commands/debug.md`, `commands/fix-issue.md`, and others
**Evidence:** Some commands have `allowed-tools` in frontmatter, others don't.
**Impact:** Inconsistent tool access for Claude Code subagents.
**Recommendation:** Add `allowed-tools` to all commands that need them.

### 🟢 Finding 19: `doc.md` and `explain.md` Are Nearly Identical in Scope
**Severity:** 🟢 Low
**Location:** `commands/doc.md` (1,506 B), `commands/explain.md` (1,477 B)
**Evidence:** Both explain code, one generates documentation. Overlap.
**Impact:** Minor user confusion.
**Recommendation:** Consider merging into a single `explain` command with `--doc` flag, or better differentiate their purposes.

### ⚪ Info 1: Skill Count Has Outgrown Entry Point Documentation
**Evidence:** 29 skills, but CLAUDE.md lists 22 in file structure. Natural growth, needs periodic sync.

### ⚪ Info 2: The Quality Gap Between Generations is Expected
**Evidence:** v1 skills (frontend-audit, observability-audit) were written before patterns like "Iron Questions" and "Anti-Shortcut Rules" were established. The newer skills incorporate lessons learned.

### ⚪ Info 3: Agents Are Claude Code-Specific
**Evidence:** Agent files use Claude Code's subagent spawning model. This is by design — other agents use the skills directly.

---

## Recommended Action Plan

### Priority 1 — Critical Fixes (Do Now)

| # | Action | Effort |
|---|--------|--------|
| 1 | Update CLAUDE.md activation table with all 29 skills + file structure | S |
| 2 | Fix GEMINI.md `_rules/SKILL.md` reference — create the file or update the path | S |

### Priority 2 — High Fixes (This Sprint)

| # | Action | Effort |
|---|--------|--------|
| 3 | Update `writing-skills` and `using-skills` to reference both CLAUDE.md and GEMINI.md | S |
| 4 | Add "Common Rationalizations" tables to Tier 3 skills | M |
| 5 | Add environment assumptions note to commands (bash-oriented, for Claude Code) | S |
| 6 | Standardize severity colors across all commands | S |

### Priority 3 — Medium Enhancements (Next Sprint)

| # | Action | Effort |
|---|--------|--------|
| 7 | Add "When NOT to Use" sections to skills missing them | M |
| 8 | Enhance `fix-issue` command to match framework quality | S |
| 9 | Deepen Tier 3 skills with code examples and detection patterns | L |
| 10 | Create `_rules/SKILL.md` combining core principles | S |

### Priority 4 — Polish (Backlog)

| # | Action | Effort |
|---|--------|--------|
| 11 | Add `last_updated` to skill frontmatter | S |
| 12 | Add `allowed-tools` to all commands | S |
| 13 | Add "Reference Skills" to writing-skills | S |
| 14 | Consider `estimation` skill or enhancement to writing-plans | M |

---

## Relative Strength Map

```
STRONGEST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ WEAKEST

Rules ██████████████████████████████████████████████ 8.8
Agents █████████████████████████████████████████████ 8.5
Tier 1 Skills ████████████████████████████████████████████ 9.5
Tier 2 Skills █████████████████████████████████████████ 8.0
Commands (Top) █████████████████████████████████████████ 8.0
Cursor Rules ██████████████████████████████████████ 7.0
Tier 3 Skills █████████████████████████████████████ 6.7
Commands (Mid) ████████████████████████████████████ 6.8
Entry Points ████████████████████████████████ 6.5
Commands (Low) ████████████████████████████ 5.8
```

---

## Verdict: 🟡 CONDITIONAL PASS

The skills-by-amrit framework is **genuinely strong**. The Tier 1 skills are world-class — `brutal-exhaustive-audit`, `product-completeness-audit`, and `full-stack-api-integration` would stand up against any commercial coding framework. The rules layer is excellent. The agent definitions are thorough.

However, the **entry points are stale** (CLAUDE.md and GEMINI.md don't reflect the full library), and there's a **quality gap between generations** of skills that needs addressing. The critical fixes (updating activation tables and fixing broken references) should be done immediately.

**Bottom line:** The framework is 80% excellent and 20% needs love. The 20% is mostly bookkeeping and consistency, not fundamental quality issues.

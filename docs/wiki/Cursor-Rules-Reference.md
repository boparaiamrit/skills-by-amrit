# 🎯 Cursor Rules Reference

> 10 `.mdc` rules that guide Cursor AI behavior

Cursor rules are `.mdc` files installed to `.cursor/rules/`. They contain frontmatter with `description` and `globs` fields, followed by instructions that Cursor follows automatically when working in matching files.

---

## Rule Catalog

### 🏗️ core-development.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- SOLID principles enforcement
- DRY — no code duplication
- Error handling requirements
- Type hints / TypeScript strict mode
- Logging standards (no console.log/print in production)
- Git commit conventions (Conventional Commits)
- File organization patterns

---

### 🚫 anti-hallucination.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- **Verification-first protocol** — never fabricate APIs, file paths, config values, or function signatures
- Mandate checking if imports/modules exist before using them
- Require verification of environment variables before referencing
- Force reading documentation instead of guessing API methods
- Prevent hallucinated error handling for non-existent error types

**Why This Matters:**
AI agents can confidently write code that calls functions that don't exist, reference files that were never created, or use API methods with wrong signatures. This rule catches those issues before they become bugs.

---

### 📋 planning-workflow.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Structured planning workflow: Research → Design → Decompose → Estimate → Document
- Mandates research before implementation
- Requires task decomposition with dependencies
- Enforces planning documentation in `.planning/`

---

### 🐛 debugging-protocol.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Scientific debugging methodology
- Hypothesis → Test → Evidence → Root Cause workflow
- Binary search isolation technique
- Evidence chain documentation
- Regression test requirement after fixes

---

### 🔒 security.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Authentication and authorization best practices
- Input validation and sanitization
- Secrets management (no hardcoded credentials)
- SQL injection prevention
- XSS prevention
- CSRF protection
- Data encryption at rest and in transit

---

### 🗄️ database.mdc

**Globs:** `*.sql, *.prisma, *.drizzle, *migration*, *schema*`
**Context-Sensitive:** Yes — activates for database-related files

**Covers:**
- Schema design standards (normalization, constraints)
- Index strategy (foreign keys, query columns)
- Query optimization (EXPLAIN, avoid N+1)
- Migration safety (backward compatible, reversible)
- Timestamp handling (UTC everywhere)
- Connection pool configuration

---

### 🧪 testing.mdc

**Globs:** `*.test.*, *.spec.*, *__tests__*`
**Context-Sensitive:** Yes — activates for test files

**Covers:**
- Test structure (Arrange-Act-Assert)
- Naming conventions (`should_verb_condition`)
- Test isolation (no test interdependency)
- Mock/stub usage guidelines
- Coverage requirements
- Test data factories

---

### 🔍 code-review.mdc

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Multi-dimensional review checklist
- Severity classification (critical/major/minor/nit)
- Constructive feedback format
- Security review requirements
- Performance review items

---

### 💾 memory-protocol.mdc ✨ NEW

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Auto-read `.planning/MEMORY.md` at session start
- Auto-read `.planning/handoffs/LATEST.md` at session start
- Capture decisions to `DECISIONS.md` during session
- Capture gotchas to `gotchas.md` during session
- Auto-write session log and handoff at session end
- Auto-update `MEMORY.md` at session end
- Compression protocol when MEMORY.md exceeds 300 lines

---

### 🤝 team-protocol.mdc ✨ NEW

**Globs:** `*`
**Always Active:** Yes

**Covers:**
- Team session activation criteria
- Role presets (Quick, Full, Debug)
- Sequential role-switching protocol
- Handoff document requirements
- Task board maintenance
- Phase announcement format
- Integration with memory system

---

## 📐 Rule File Format

Cursor rules use `.mdc` format with YAML frontmatter:

```markdown
---
description: What this rule does
globs: *.ts, *.tsx
---

# Rule Title

## Instructions for the AI

1. Always do this
2. Never do that
3. When you see X, do Y
```

**Fields:**
| Field | Required | Description |
|:---|:---:|:---|
| `description` | Yes | Short description of the rule |
| `globs` | Yes | File patterns to activate on (`*` = always) |

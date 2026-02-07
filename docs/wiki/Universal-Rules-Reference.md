# 📏 Universal Rules Reference

> 5 agent-agnostic rules for GEMINI.md, CLAUDE.md, and system prompts

Universal rules are `.md` files in the `rules/` directory. They can be appended to any agent's system prompt or configuration file to enforce consistent behavior.

---

## Rule Catalog

### 🏗️ core-principles.md

**Purpose:** Foundational engineering principles that ALL code should follow.

**Key Principles:**
1. **SOLID** — Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
2. **DRY** — Don't Repeat Yourself. Extract common logic into reusable functions.
3. **KISS** — Keep It Simple, Stupid. Prefer clear, readable code over clever code.
4. **YAGNI** — You Ain't Gonna Need It. Don't build features for hypothetical future requirements.
5. **Clean Architecture** — Dependencies point inward. Business logic has zero framework dependencies.

**Includes:**
- Code quality standards
- Error handling requirements
- Naming conventions
- File organization patterns
- Documentation expectations

---

### 🚫 anti-hallucination.md

**Purpose:** Prevent AI agents from fabricating code, APIs, or configurations.

**Key Rules:**
1. **Verify before using** — Check that imports, functions, and APIs exist before calling them
2. **Read before assuming** — Open files to verify structure instead of guessing
3. **Check versions** — Verify package versions before using new API features
4. **No fake data** — Don't create placeholder implementations that look real
5. **Admit uncertainty** — Say "I'm not sure" instead of guessing

**Common Hallucination Patterns Prevented:**
- Calling functions that don't exist in the codebase
- Using API methods from wrong versions
- Referencing files or directories that were never created
- Importing packages that aren't installed
- Using environment variables that aren't defined

---

### ⚖️ severity-framework.md

**Purpose:** Consistent classification of issues, bugs, and code review findings.

**Severity Levels:**

| Level | Label | Blocks Ship? | Response Time | Examples |
|:---:|:---|:---:|:---:|:---|
| 🔴 | **Critical** | YES | Immediate | Security vulnerabilities, data loss, auth bypass |
| 🟡 | **Major** | YES | Same session | Logic errors, missing validation, race conditions |
| 🔵 | **Minor** | No | Next session | Naming conventions, refactoring opportunities |
| ⚪ | **Nit** | No | When convenient | Style preferences, formatting |

**Usage:**
Every code review comment, audit finding, and bug report should include a severity level. This ensures consistent prioritization across the team.

---

### 💾 memory-protocol.md ✨ NEW

**Purpose:** Automated persistent memory across AI sessions.

**Key Instructions:**
1. At session start: Read `.planning/MEMORY.md` and `.planning/handoffs/LATEST.md`
2. During session: Capture decisions, gotchas, and architecture changes
3. At session end: Write session log, handoff note, and update MEMORY.md
4. Keep MEMORY.md under 300 lines with compression

**Designed For:** Appending to `GEMINI.md`, `CLAUDE.md`, or any agent config.

---

### 🤝 team-protocol.md ✨ NEW

**Purpose:** Multi-role team coordination for complex tasks.

**Key Instructions:**
1. When to activate team mode (complex tasks, multi-system changes)
2. Role pipeline: Researcher → Architect → Planner → Executor → Reviewer
3. Blackboard protocol: `.planning/team/` directory structure
4. Handoff document requirements between roles
5. Task board maintenance

**Designed For:** Appending to `GEMINI.md`, `CLAUDE.md`, or any agent config.

---

## 📐 How to Use Rules

### In Antigravity (GEMINI.md)
Add the rule content to your `~/.gemini/GEMINI.md` or project-level `GEMINI.md`:

```markdown
# Project Rules

[paste rule content here]
```

### In Claude Code (CLAUDE.md)
Rules are automatically appended to `CLAUDE.md` during installation.

### In Cursor
Use the corresponding `.mdc` rule from the `cursor-rules/` directory instead.

### In Other Agents
Most agents support a system prompt or configuration file. Paste the rule content there.

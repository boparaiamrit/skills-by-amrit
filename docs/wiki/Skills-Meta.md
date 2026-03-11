# 🔮 Skills Reference — Meta

> 3 meta skills for skill discovery, creation, and governance

These skills operate at the meta level — they teach AI agents how to find, create, and govern skills themselves.

---

## 25. 🔎 using-skills

**Use When:** You need to discover which skill applies to your current task, or you want to understand the skill library.

**What It Teaches The Agent:**
- Skill activation conditions and matching
- How to read and follow SKILL.md protocols
- When to combine multiple skills for a task
- Skill precedence rules when multiple skills apply

**Key Protocols:**
1. Check the skill activation table before starting any task
2. If a matching skill exists, follow it — skipping is not an option
3. When multiple skills match, apply the most specific one first
4. Read the full SKILL.md before acting on it

---

## 26. ✍️ writing-skills

**Use When:** Creating new skills for the framework — adding new instructional documents.

**What It Teaches The Agent:**
- Skill file structure (`SKILL.md` in a named folder)
- Required sections (Use When, What It Teaches, Key Protocols, Anti-Patterns)
- Protocol writing style (actionable, numbered, verifiable)
- Quality criteria for effective skills
- Testing skills against real scenarios

**Key Protocols:**
1. Each skill gets its own folder with a `SKILL.md`
2. Include concrete anti-patterns (what NOT to do)
3. Protocols must be actionable and verifiable
4. Test the skill against at least 2 real scenarios before shipping

---

## 27. 📜 _rules

**Use When:** Always — this is the root skill that all others inherit from. Automatically consulted at session start.

**What It Does:**
Master reference skill that consolidates the foundational principles governing all other skills:
- **Core Principles** — Evidence before claims, root cause before fixes, plan before code
- **Anti-Hallucination Protocol** — Never fabricate, never assume, never extrapolate, never claim completion without evidence
- **Severity Framework** — 🔴 Critical → 🟠 High → 🟡 Medium → 🟢 Low → ⚪ Info
- **Skill Activation Table** — Complete mapping of situations to required skills

**Why It Exists:**
Previously, core principles were duplicated across multiple skills and rule files. The `_rules` skill is the single source of truth — one file that every other skill inherits from, ensuring consistency across the entire framework.

**Key Protocols:**
1. Read `_rules/SKILL.md` at session start before any other skill
2. All severity ratings across all skills use the `_rules` severity framework
3. The three non-negotiables apply to every task, every skill, every session
4. The skill activation table is authoritative — if it says use a skill, use it

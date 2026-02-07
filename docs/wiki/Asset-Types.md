# 📦 Asset Types

> Understanding the 6 types of installable assets

Skills by Amrit ships 6 distinct asset types, each targeting different agents and serving different purposes.

---

## Asset Type Matrix

| Type | Format | Count | Target Agents | Purpose |
|:---|:---:|:---:|:---|:---|
| 🧠 **Skills** | `SKILL.md` in folder | 26 | All agents | Deep instructional knowledge |
| ⚡ **Commands** | `.md` file | 22 | Claude Code | Slash commands for project lifecycle |
| 🔄 **Workflows** | `.md` file | 26 | Antigravity | Step-by-step execution scripts |
| 🤖 **Agents** | `.md` file | 7 | Claude Code | Specialist agent definitions |
| 🎯 **Cursor Rules** | `.mdc` file | 10 | Cursor | AI behavior rules |
| 📏 **Rules** | `.md` file | 5 | All agents | Universal agent instructions |

---

## 🧠 Skills

**What:** Deep instructional documents that teach AI agents HOW to approach engineering tasks.

**Format:** Each skill is a folder with a `SKILL.md` file:
```
skills/
└── code-review/
    └── SKILL.md     # 200+ lines of protocols, examples, anti-patterns
```

**Install Location:** Agent's skills directory (e.g., `.claude/skills/`, `.cursor/skills/`, `.agent/skills/`)

**How Agents Use Them:** The agent reads the SKILL.md when you ask it to use a specific skill. The skill teaches the agent a structured approach with principles, protocols, and quality criteria.

---

## ⚡ Commands

**What:** Claude Code slash commands — structured markdown files that Claude Code invokes when you type `/command-name`.

**Format:** Single `.md` file per command:
```
commands/
├── plan.md
├── execute.md
├── review.md
└── memory.md
```

**Install Location:** `.claude/commands/`

**How They Work:** In Claude Code, type `/plan` and it reads `commands/plan.md` as a structured protocol, then follows the instructions.

---

## 🔄 Workflows

**What:** Antigravity step-by-step execution scripts — numbered steps that Antigravity follows sequentially.

**Format:** Single `.md` file per workflow with YAML frontmatter:
```yaml
---
description: Execute plans with wave-based steps and verification
---
### Step 1: Read the plan
// turbo
Read .planning/PLAN.md...
```

**Install Location:** `.agent/workflows/`

**How They Work:** In Antigravity, use `/workflow-name` to activate. Steps marked `// turbo` auto-execute without user approval.

---

## 🤖 Agents

**What:** Specialist AI personas for Claude Code's agent system — detailed role definitions with protocols and anti-patterns.

**Format:** Single `.md` file per agent:
```
agents/
├── researcher.md
├── planner.md
├── executor.md
├── reviewer.md
├── debugger.md
├── verifier.md
└── mapper.md
```

**Install Location:** `.claude/agents/`

**How They Work:** Claude Code can spawn these as specialist sub-agents for specific tasks. Each agent file defines the agent's role, focus areas, principles, and output format.

---

## 🎯 Cursor Rules

**What:** `.mdc` rule files that guide Cursor AI's behavior — automatically applied based on glob patterns.

**Format:** `.mdc` file with frontmatter:
```markdown
---
description: Security best practices
globs: *
---
# Instructions for the AI
...
```

**Install Location:** `.cursor/rules/`

**How They Work:** Cursor automatically loads rules matching the current file's glob pattern. Rules with `globs: *` are always active.

---

## 📏 Rules

**What:** Universal markdown rules that can be pasted into any agent's configuration file.

**Format:** Single `.md` file:
```
rules/
├── core-principles.md
├── anti-hallucination.md
├── severity-framework.md
├── memory-protocol.md
└── team-protocol.md
```

**Install Location:** Appended to `CLAUDE.md`, `GEMINI.md`, or any agent config.

**How They Work:** The content is added to the agent's persistent system prompt, so it's always active for every conversation.

---

## Which Agents Get Which Assets?

| Agent | Skills | Commands | Workflows | Agents | Cursor Rules | Rules |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 🟣 Claude Code | ✅ | ✅ | — | ✅ | — | ✅ (CLAUDE.md) |
| 🔵 Cursor | ✅ | — | — | — | ✅ | — |
| 🟢 Antigravity | ✅ | — | ✅ | — | — | — |
| Others | ✅ | — | — | — | — | — |

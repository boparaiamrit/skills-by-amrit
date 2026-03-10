# 📦 Asset Types

> Understanding the 11 types of installable assets

Skills by Amrit ships 11 distinct asset types, each targeting different agents and serving different purposes.

---

## Asset Type Matrix

| Type | Format | Count | Target Agents | Purpose |
|:---|:---:|:---:|:---|:---|
| 🧠 **Skills** | `SKILL.md` in folder | 26 | All agents | Deep instructional knowledge |
| ⚡ **Commands** | `.md` file | 28 | Claude Code | Slash commands for project lifecycle |
| 🔄 **Workflows** | `.md` file | 32 | Antigravity | Step-by-step execution scripts |
| 🤖 **Agents** | `.md` file | 9 | Claude Code | Specialist agent definitions |
| 🎯 **Cursor Rules** | `.mdc` file | 10 | Cursor | AI behavior rules |
| 📏 **Rules** | `.md` file | 5 | All agents | Universal agent instructions |
| 🔗 **Hooks** | `.js` / `.md` file | 5 | Claude Code | Production lifecycle hooks |
| 📝 **Templates** | `.md` file | 11 | All agents | Structured markdown templates for planning |
| 📚 **References** | `.md` file | 2 | All agents | Questioning framework, deviation rules |
| ⚙️ **CLI Modules** | `.cjs` commands | 13 | Claude Code | Deterministic state management commands |

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

## 🔗 Hooks

**What:** Production lifecycle hooks for Claude Code's hook system — automatically triggered at specific runtime events.

**Format:** `.js` scripts or `.md` prompt hooks:
```
hooks/
├── security-gate.js          # PostToolUse — scans for secrets and injection
├── statusline.js             # PreInputSanitization — model + context % display
├── context-monitor.js        # PostToolUse — warns at 65%/75% context usage
├── update-check.js           # SessionStart — checks npm for newer version
└── memory-capture.md         # PreCompact — captures weighted memories
```

**Install Location:** Registered in Claude Code's `settings.json` hooks array

**How They Work:** Automatically registered during installation. Script hooks read JSON from stdin and output JSON to stdout with a 3-second timeout. Prompt hooks use `type: "prompt"` and run as inline prompts. All hooks silent-fail on errors to never block the user.

See [Hooks Reference](Hooks-Reference.md) for full details.

---

## 📝 Templates

**What:** Structured markdown templates for plans, handoffs, decisions, context documents, and other planning artifacts.

**Format:** `.md` template files with placeholder sections:
```
templates/
├── plan.md                   # PLAN.md structure with <files>, <action>, <verify>, <done>
├── context.md                # CONTEXT.md for locked decisions from /discuss
├── handoff.md                # Session handoff document
├── decision.md               # Decision record template
└── ... (11 total)
```

**Install Location:** Used by commands and workflows internally — not installed to a user-visible directory

**How They Work:** Commands like `/plan`, `/discuss`, and `/execute` use these templates to generate structured output. Templates enforce consistent document structure across all planning artifacts.

---

## 📚 References

**What:** Reference documents that provide lookup tables and decision frameworks used by skills and commands.

**Format:** `.md` reference files:
```
references/
├── questioning.md            # MCQ questioning framework for /discuss
└── deviation-rules.md        # Deviation classification and escalation rules
```

**How They Work:** Skills and commands reference these documents when they need structured decision criteria (e.g., how to classify a deviation, how to structure MCQ questions).

---

## ⚙️ CLI Modules

**What:** Deterministic state management commands that handle operations LLMs are unreliable at — JSON updates, counter tracking, file creation.

**Format:** Sub-commands of `planning-tools.cjs`:
```
13 modules: init, state, config, progress, council-init, council-assign,
council-advance, council-handoff, council-gate, council-board,
council-status, council-message, council-review
```

**Install Location:** Project root (via `planning-tools.cjs`)

**How They Work:** The AI calls these commands during execution (e.g., `node planning-tools.cjs state advance-task`). They handle structured data operations deterministically — no LLM hallucination risk for state management.

See [Council System](Council-System.md) for the council CLI commands and [CLI Reference](CLI-Reference.md) for the full command list.

---

## Which Agents Get Which Assets?

| Agent | Skills | Commands | Workflows | Agents | Cursor Rules | Rules | Hooks | Templates | CLI |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 🟣 Claude Code | ✅ | ✅ | — | ✅ | — | ✅ (CLAUDE.md) | ✅ | ✅ | ✅ |
| 🔵 Cursor | ✅ | — | — | — | ✅ | — | — | ✅ | ✅ |
| 🟢 Antigravity | ✅ | — | ✅ | — | — | — | — | ✅ | ✅ |
| Others | ✅ | — | — | — | — | — | — | ✅ | ✅ |

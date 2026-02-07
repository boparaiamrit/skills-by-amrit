# 🏁 Quick Start

> Get up and running with Skills by Amrit in 60 seconds

---

## Step 1: Install

```bash
npx skills-by-amrit add
```

That's it. The CLI will:
- ✅ Auto-detect your installed agents
- ✅ Let you select which ones to install for
- ✅ Install all 96 assets to the correct directories

---

## Step 2: Use Skills

Skills are automatically available to your AI agent. Just ask it to use a skill:

```
"Use the code-review skill to review my latest changes"
"Use the systematic-debugging skill to investigate this bug"
"Use the brainstorming skill to explore approaches for this feature"
```

---

## Step 3: Enable Persistent Memory (Optional)

Add these lines to your agent config to auto-enable memory:

### Antigravity (`~/.gemini/GEMINI.md`)
```markdown
## 🧠 Automatic Memory Protocol
ALWAYS at the START: check for .planning/MEMORY.md, read it first
ALWAYS at the END: update MEMORY.md, write handoffs/LATEST.md
```

### Cursor (auto-installed)
The `memory-protocol.mdc` rule is already installed. No extra setup needed.

### Claude Code
```
/memory init
```

---

## Step 4: Start a Team Session (Optional)

For complex tasks, tell your agent:

```
"Start a team session for: [describe your task]"
```

The agent will switch through specialist roles:
🔬 Researcher → 📐 Architect → 📋 Planner → ⚙️ Executor → 🔍 Reviewer

---

## What's Next?

- 📖 Read the [Skills Reference](Skills-Core-Development.md) for detailed skill docs
- ⚡ Check the [Commands Reference](Commands-Reference.md) for all slash commands
- 💾 Set up [Persistent Memory](Persistent-Memory.md) for cross-session context
- 🤝 Learn about [Agent Teams](Agent-Teams.md) for structured work

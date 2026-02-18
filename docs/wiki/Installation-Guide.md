# 🏁 Installation Guide

## Prerequisites

- **Node.js** 18.0.0 or later
- One or more AI coding agents installed

---

## 🚀 One-Command Install

```bash
npx skills-by-amrit add
```

This will:
1. ✅ Auto-detect installed agents on your system
2. ✅ Let you select which agents to install for
3. ✅ Install all 116 assets to the correct directories
4. ✅ Show a detailed summary of what was installed

---

## 🎯 Agent-Specific Installation

### 🟣 Claude Code
```bash
npx skills-by-amrit add --agent claude-code
```
**Installs to:**
| Asset | Directory |
|:---|:---|
| Skills (31) | `.claude/skills/{skill-name}/SKILL.md` |
| Commands (28) | `.claude/commands/{name}.md` |
| Agents (9) | `.claude/agents/{name}.md` |
| Rules (5) | CLAUDE.md (appended) |

### 🔵 Cursor
```bash
npx skills-by-amrit add --agent cursor
```
**Installs to:**
| Asset | Directory |
|:---|:---|
| Skills (31) | `.cursor/skills/{skill-name}/SKILL.md` |
| Cursor Rules (10) | `.cursor/rules/{name}.mdc` |

### 🟢 Antigravity (Gemini)
```bash
npx skills-by-amrit add --agent antigravity
```
**Installs to:**
| Asset | Directory |
|:---|:---|
| Skills (31) | `.agent/skills/{skill-name}/SKILL.md` |
| Workflows (32) | `.agent/workflows/{name}.md` |

---

## 🌍 Global vs Local

### Local (default)
```bash
npx skills-by-amrit add
```
Installs into the **current project directory**. Skills are available only in this project.

### Global
```bash
npx skills-by-amrit add --global
```
Installs into your **home directory** agent config. Skills are available in ALL projects.

| Agent | Global Directory |
|:---|:---|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| Antigravity | `~/.gemini/antigravity/skills/` |

> ⚠️ **Note:** Commands, workflows, agents, and rules are only installed locally (not globally), as they are project-specific.

---

## 📦 Selective Installation

### Install specific skills
```bash
npx skills-by-amrit add persistent-memory agent-team-coordination
npx skills-by-amrit add code-review systematic-debugging
npx skills-by-amrit add brainstorming writing-plans executing-plans
```

### Install all skills
```bash
npx skills-by-amrit add --all
```

---

## 🔄 Updating

Re-run the install command to update to the latest versions:
```bash
npx skills-by-amrit@latest add
```

Files are overwritten with the latest versions. Custom modifications to CLAUDE.md are preserved (appended, not overwritten).

---

## ✅ Post-Installation Setup

### For Persistent Memory
Add this to your `~/.gemini/GEMINI.md` (Antigravity) or agent config:

```markdown
## 🧠 Automatic Memory Protocol
ALWAYS at the START of every conversation:
1. Check if `.planning/MEMORY.md` exists
2. If yes, read it FIRST before doing anything else
3. Also read `.planning/handoffs/LATEST.md` if it exists

ALWAYS at the END of significant work:
1. Update `.planning/MEMORY.md` with new learnings
2. Write `.planning/handoffs/LATEST.md` for the next session
3. Keep MEMORY.md under 300 lines
```

### For Agent Teams
No additional setup needed. Just tell your agent:
```
Start a team session for: [describe your task]
```

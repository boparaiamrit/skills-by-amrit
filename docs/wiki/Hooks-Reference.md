# 🔗 Hooks Reference

> 8 production lifecycle hooks for Claude Code

Hooks are `.js` scripts or `.md` prompt hooks installed into Claude Code's `settings.json`. They fire automatically at specific runtime events — no manual invocation needed.

**Key Design Principles:**
- All hooks silent-fail on errors to never block the user
- Script hooks read JSON from stdin, output JSON to stdout (3-second timeout)
- Prompt hooks use `type: "prompt"` — no script needed
- Hook profiles control which hooks are active (see `hook-profiles.js`)

---

## Hook Summary

| Hook | Type | Event | Profile | Purpose |
|:---|:---:|:---|:---:|:---|
| `security-gate.js` | Script | PostToolUse | minimal+ | Scans for secrets and injection |
| `statusline.js` | Script | PreInputSanitization | minimal+ | Model + context % display |
| `context-monitor.js` | Script | PostToolUse | standard+ | Warns at 65%/75% context usage |
| `update-check.js` | Script | SessionStart | standard+ | Checks npm for newer version |
| `memory-capture.md` | Prompt | PreCompact | standard+ | Captures weighted memories |
| `hook-profiles.js` | Library | — | — | Three-tier hook gating system |
| `suggest-compact.js` | Script | PostToolUse | strict | Strategic compaction suggestions |
| `cost-tracker.js` | Script | PostToolUse + Stop | strict | Session metrics tracking |

---

## 1. 🛡️ security-gate.js

**Event:** `PostToolUse`
**Profile:** minimal+ (always active)

Scans tool outputs for leaked secrets and potential injection patterns:
- API keys, tokens, passwords in output
- Suspicious shell commands
- Credential patterns in file writes

**Behavior:** Blocks the tool result and warns the user if a secret is detected.

---

## 2. 📊 statusline.js

**Event:** `PreInputSanitization`
**Profile:** minimal+ (always active)

Displays a persistent status bar showing:
- Current model name
- Context window usage percentage
- Session duration

---

## 3. 🧠 context-monitor.js

**Event:** `PostToolUse`
**Profile:** standard+

Monitors context window consumption and warns at thresholds:
- ⚠️ 65% — Advisory warning
- 🔴 75% — Strong recommendation to compact

---

## 4. 🔄 update-check.js

**Event:** `SessionStart`
**Profile:** standard+

Checks npm registry for a newer version of skills-by-amrit at session start. Displays a one-line notification if an update is available.

---

## 5. 💾 memory-capture.md

**Event:** `PreCompact`
**Profile:** standard+
**Type:** Prompt hook (`type: "prompt"`)

Fires before context compaction. Instructs the agent to capture weighted memories (architecture decisions, debugging breakthroughs, patterns) to `.planning/MEMORY.md` before context is lost.

---

## 6. ⚙️ hook-profiles.js

**Type:** Library module (not a standalone hook)

Three-tier hook gating system that controls which hooks are active:

| Profile | Hooks Active | Use Case |
|:---|:---|:---|
| `minimal` | security-gate, statusline | Low overhead, essential safety only |
| `standard` | minimal + context-monitor, update-check, memory-capture | Recommended default |
| `strict` | standard + suggest-compact, cost-tracker | Full observability |

**Configuration:** Set via `SBA_HOOK_PROFILE` environment variable:
```bash
export SBA_HOOK_PROFILE=strict
```

Other hooks call `hook-profiles.js` to check whether they should run under the current profile.

---

## 7. 📦 suggest-compact.js

**Event:** `PostToolUse`
**Profile:** strict

Monitors session progress and suggests context compaction at strategic logical breakpoints — not just when context is full, but when a natural pause point occurs (e.g., after completing a wave, finishing a review, or resolving a bug).

---

## 8. 💰 cost-tracker.js

**Event:** `PostToolUse` + `Stop` (dual-mode)
**Profile:** strict

Tracks session metrics including tool invocations, token estimates, and session duration:
- **PostToolUse mode:** Increments counters after each tool call
- **Stop mode:** Writes final session summary

**Output:** Appends session metrics to `.planning/cost-log.md`.

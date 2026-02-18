---
name: persistent-memory
description: Automated persistent memory system for AI agents — captures decisions, context, and learnings across sessions using file-based protocols. Works in Antigravity, Cursor, Claude Code, and any agent that can read/write files.
---

# 🧠 Persistent Memory System

> Automated context preservation across AI coding sessions — no hooks, no APIs, no external services.

## Why This Exists

Every AI coding session starts from scratch. You explain the same architecture, repeat the same decisions, and lose the context you built in previous sessions. This skill solves that by creating a **file-based memory protocol** that any AI agent can follow.

Unlike `claude-mem` (which requires Claude Code hooks and a worker service), this system works in **any agent** that can read and write files — Antigravity, Cursor, Claude Code, Gemini CLI, Cline, and more.

---

## Related Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| Command | `commands/memory.md` | `/memory init`, `/memory write`, `/memory compress` |
| Workflow | `workflows/memory-sync.md` | End-to-end memory sync workflow |
| Cursor Rule | `cursor-rules/memory-protocol.mdc` | Auto-enforced memory protocol for Cursor |
| Universal Rule | `rules/memory-protocol.md` | Memory protocol for any agent |
| State Tool | `scripts/planning-tools.cjs` | Deterministic state management CLI |

---

## Architecture

### The Memory Stack

```
.planning/
├── MEMORY.md                    # 🧠 Compressed project brain (~300 lines max)
├── sessions/
│   ├── YYYY-MM-DD-session-N.md  # Session logs (auto-pruned to last 10)
│   └── _archive/                # Older sessions compressed here
├── decisions/
│   └── DECISIONS.md             # Chronological decision log (append-only)
├── context/
│   ├── architecture.md          # Architecture decisions record
│   ├── patterns.md              # Established code patterns
│   ├── gotchas.md               # Known issues, bugs, workarounds
│   └── tech-debt.md             # Known technical debt
├── handoffs/
│   ├── LATEST.md                # Current session's handoff note
│   └── _history/                # Previous handoffs (auto-archived)
└── config.json                  # Optional: memory configuration
```

### How It Works

```
┌─────────────────────────────────────────────────────┐
│                  SESSION START                        │
│                                                       │
│  1. Agent reads MEMORY.md (project brain)             │
│  2. Agent reads handoffs/LATEST.md (last session)     │
│  3. Agent has full context — no questions needed      │
├─────────────────────────────────────────────────────┤
│                  DURING SESSION                       │
│                                                       │
│  4. Agent works normally on tasks                     │
│  5. On significant decisions → append to DECISIONS.md │
│  6. On discovering bugs → append to gotchas.md        │
│  7. On architecture changes → update architecture.md  │
├─────────────────────────────────────────────────────┤
│                  SESSION END                          │
│                                                       │
│  8. Archive LATEST.md to handoffs/_history/           │
│  9. Agent creates session log in sessions/            │
│  10. Agent writes new handoffs/LATEST.md              │
│  11. Agent compresses updates into MEMORY.md          │
│  12. If MEMORY.md > 300 lines, run compression        │
└─────────────────────────────────────────────────────┘
```

---

## Protocol: Session Start

**ALWAYS do this at the start of every conversation involving project work:**

### Step 1: Check for existing memory
```
Look for .planning/MEMORY.md in the project root.
- If .planning/ doesn't exist → this is a new project, skip to Initialization section
- If .planning/ exists but MEMORY.md doesn't → partial setup, run /memory init
```

### Step 2: If MEMORY.md exists, READ IT FIRST
```
Read .planning/MEMORY.md to understand:
- Project overview and current state
- Key architectural decisions
- Active work streams
- Known issues and workarounds
- What happened in recent sessions
```

### Step 3: Read the last handoff (if it exists)
```
Check if .planning/handoffs/LATEST.md exists.

IF IT EXISTS, read it to understand:
- What was being worked on last
- What was completed
- What's pending
- Any blockers or open questions

IF IT DOESN'T EXIST:
- This is normal for newly initialized projects
- Skip to Step 4 — rely on MEMORY.md alone
- Do NOT error or warn the user
```

### Step 4: Acknowledge context
```
Briefly acknowledge what you know from memory:
"I see from memory that we're working on [X], last session we [Y],
and there's a known issue with [Z]."

If LATEST.md was missing, say:
"I loaded project memory. No previous handoff found — this may be a new memory setup."
```

---

## Protocol: During Session

### What Counts as a "Significant Decision"

Capture these types of decisions:

| Category | Examples |
|----------|----------|
| **Architecture** | Database schema changes, API endpoint design, auth flow choice |
| **Technology** | Framework selection, library choice, build tool configuration |
| **Patterns** | State management approach, error handling strategy, testing patterns |
| **Trade-offs** | Performance vs readability, DRY vs explicit, monolith vs microservices |
| **Breaking Changes** | API version bumps, data migration strategies, deprecation plans |

**Do NOT capture:** Minor variable naming, formatting changes, obvious fixes.

### On significant decisions:
Append to `.planning/decisions/DECISIONS.md`:

```markdown
## [DATE] — [Topic]
**Decision:** [What was decided]
**Rationale:** [Why this was chosen]
**Alternatives:** [What was considered but rejected]
**Impact:** [What this affects]
```

### On discovering bugs or gotchas:
Append to `.planning/context/gotchas.md`:

```markdown
## [Component/Area]
**Issue:** [Description]
**Workaround:** [How to handle it]
**Root Cause:** [If known]
**Date Discovered:** [DATE]
```

### On architecture changes:
Update `.planning/context/architecture.md`:

```markdown
## [System/Module Name]
**Pattern:** [What pattern is used]
**Rationale:** [Why this approach]
**Dependencies:** [What it depends on]
**Last Updated:** [DATE]
```

### On identifying technical debt:
Append to `.planning/context/tech-debt.md`:

```markdown
## [Area]
**Debt:** [What needs fixing]
**Severity:** low | medium | high | critical
**Estimated Effort:** [Time estimate]
**Date Identified:** [DATE]
```

### Auto-Save Reminders

After completing significant work milestones (feature complete, major fix, etc.), proactively ask:

> "Would you like me to save progress to memory now? This captures today's work for future sessions."

This prevents data loss if the user forgets to end the session properly.

---

## Protocol: Session End

**ALWAYS do this before ending a significant work session:**

### Step 0: Archive previous handoff
```
IF .planning/handoffs/LATEST.md exists:
  1. Create .planning/handoffs/_history/ if it doesn't exist
  2. Move LATEST.md to _history/YYYY-MM-DD-HH-MM.md (use current timestamp)

This preserves the previous session's handoff — never lose context.
```

### Step 1: Create session log

**Session Numbering Algorithm:**
```
1. List all files matching pattern: .planning/sessions/YYYY-MM-DD-session-*.md
   (where YYYY-MM-DD is TODAY's local date)
2. Extract the N value from each filename
3. Set N = (highest N found) + 1
4. If no sessions exist for today, N = 1

Example:
- Today: 2024-02-09
- Existing: 2024-02-09-session-1.md, 2024-02-09-session-2.md
- New file: 2024-02-09-session-3.md
```

Create `.planning/sessions/YYYY-MM-DD-session-N.md`:

```markdown
# Session: [DATE] — Session [N]

## Duration
[Approximate time spent]

## Objective
[What was the goal]

## Completed
- [x] [Task 1 — brief description]
- [x] [Task 2 — brief description]

## In Progress
- [ ] [Task — what remains]

## Decisions Made
- [Decision 1 — brief]
- [Decision 2 — brief]

## Issues Encountered
- [Issue 1 — brief]

## Files Modified
- `path/to/file.ts` — [what changed]
- `path/to/other.py` — [what changed]

## Next Steps
1. [What should happen next]
2. [Follow-up items]
```

### Step 2: Write handoff note
Create NEW `.planning/handoffs/LATEST.md`:

```markdown
# Handoff: [DATE]

## Last Session Summary
[One paragraph of what happened]

## Current State
- **Working on:** [Active task]
- **Blocked by:** [Any blockers, or "nothing"]
- **Branch:** [Git branch if applicable]

## Immediate Next Steps
1. [Most important next thing]
2. [Second priority]
3. [Third priority]

## Open Questions
- [Any unresolved questions]

## Watch Out For
- [Any gotchas the next session should know about]
```

### Step 3: Update MEMORY.md
Update `.planning/MEMORY.md` with any new information from this session. Keep it under 300 lines by compressing older entries.

---

## MEMORY.md Template

```markdown
# 🧠 Project Memory
> Auto-maintained by persistent-memory skill
> Last updated: [DATE]

## 📋 Project Overview
[2-3 sentence project description]
- **Tech Stack:** [languages, frameworks, databases]
- **Repository:** [repo info]
- **Status:** [active development | maintenance | etc.]

## 🏗️ Architecture
[Key architectural decisions — bullet points]
- [Pattern 1]: [why]
- [Pattern 2]: [why]

## 📊 Current State
### Active Work
- [What's being worked on right now]

### Recently Completed
- [Last 3-5 completed items with dates]

### Blocked / Waiting
- [Anything blocked and why]

## 🔑 Key Decisions
[Last 10 significant decisions, newest first]
1. [DATE] — [Decision]: [Brief rationale]
2. [DATE] — [Decision]: [Brief rationale]

## ⚠️ Known Issues & Gotchas
- [Issue 1]: [Workaround]
- [Issue 2]: [Workaround]

## 📝 Patterns & Conventions
- [Pattern 1]: [How to use it]
- [Pattern 2]: [How to use it]

## 🗓️ Recent Sessions
| Date | Summary |
|------|---------|
| [DATE] | [One-line summary] |
| [DATE] | [One-line summary] |
| [DATE] | [One-line summary] |
```

---

## Compression Protocol

When MEMORY.md exceeds 300 lines, run compression:

### Step-by-Step Algorithm

```
1. COUNT current lines in MEMORY.md

2. IF lines <= 300:
   - No compression needed
   - Exit

3. COMPRESS in this order (stop when under 300 lines):

   a. Recent Sessions table:
      - Keep only last 5 entries
      - Remove older rows from table

   b. Key Decisions:
      - Keep only last 10 decisions
      - Move older decisions to context/architecture.md (if significant)
      - Or delete (if superseded)

   c. Recently Completed:
      - Keep only last 5 items
      - Remove older items (they're in session logs anyway)

   d. Known Issues:
      - Remove any issues marked as resolved
      - Merge related issues into single entries

   e. Patterns & Conventions:
      - Move detailed patterns to context/patterns.md
      - Keep only one-liner summaries in MEMORY.md

4. ARCHIVE old session logs:
   - Move sessions older than 30 days to sessions/_archive/
   - Use filename: _archive/YYYY-MM-compressed.md
   - Combine multiple sessions into monthly summaries

5. VERIFY:
   - Re-count lines
   - If still > 300, repeat step 3 more aggressively
```

### Archive File Format

`sessions/_archive/2024-02-compressed.md`:
```markdown
# Archived Sessions: February 2024

## Summary
- Total sessions: 15
- Major accomplishments: [list]
- Major decisions: [list]

## Session Index
| Date | Session | Summary |
|------|---------|---------|
| 2024-02-01 | 1 | [summary] |
| 2024-02-01 | 2 | [summary] |
...
```

---

## Initialization

To bootstrap memory for an existing project, run the `/memory init` command or workflow.

### Codebase Scan Algorithm

The initialization scan follows this algorithm:

```
1. DETECT PROJECT TYPE:
   - Look for package.json → Node.js/JavaScript/TypeScript
   - Look for requirements.txt/pyproject.toml → Python
   - Look for go.mod → Go
   - Look for Cargo.toml → Rust
   - Look for pom.xml/build.gradle → Java
   - Look for *.sln/*.csproj → .NET
   - No matches → Generic project

2. EXTRACT TECH STACK:
   - Parse dependency files for frameworks (React, Django, etc.)
   - Identify major libraries
   - Note database connections (if visible in config)

3. ANALYZE STRUCTURE:
   - Count files by extension
   - Identify main source directories
   - Detect test directories
   - Note documentation presence

4. IDENTIFY PATTERNS:
   - Look for common patterns (MVC, repository pattern, etc.)
   - Check for existing style guides (.editorconfig, .prettierrc)
   - Note linting configuration

5. GENERATE INITIAL MEMORY:
   - Write project overview based on package.json/readme info
   - Document detected architecture
   - List identified patterns
   - Create empty but structured context files
```

### What Gets Created

| File | Initial Content |
|------|-----------------|
| `MEMORY.md` | Project overview from scan |
| `DECISIONS.md` | Empty with template header |
| `architecture.md` | Detected patterns |
| `patterns.md` | Empty with template header |
| `gotchas.md` | Empty with template header |
| `tech-debt.md` | Empty with template header |
| `LATEST.md` | "Memory initialized" note |

---

## Multi-Agent Handling

When multiple agents (or multiple terminals) may edit memory concurrently:

### Prevention Strategy
```
1. ALWAYS read the latest version of files before editing
2. Keep edits small — append-only where possible
3. Use git for conflict resolution:
   - git pull before reading memory
   - git add && git commit after writing memory
```

### If Conflicts Occur
```
1. Git will detect the conflict on push
2. The later agent should:
   - Pull the latest version
   - Merge manually (memory files are human-readable)
   - Push the merged version
3. For append-only files (DECISIONS.md, gotchas.md):
   - Simply keep both entries — duplicates are better than data loss
```

### Recommended Practice
```
# Start of session
git pull origin main

# End of session (after memory write)
git add .planning/
git commit -m "chore: update project memory"
git push origin main
```

---

## Error Handling

### Common Errors and Recovery

| Error | Cause | Recovery |
|-------|-------|----------|
| `MEMORY.md is empty` | Corrupted or deleted | Re-run `/memory init` to regenerate |
| `MEMORY.md is unreadable` | Malformed markdown | Restore from git, or regenerate from context/ files |
| `.planning/ partially exists` | Interrupted init | Delete .planning/ and re-run `/memory init` |
| `Write permission denied` | File locked or permissions | Check file permissions, close other editors |
| `Session numbering conflict` | Two sessions same second | Use timestamp with seconds: YYYY-MM-DD-HHMMSS-session |

### Recovery from Corrupted Memory

If MEMORY.md is corrupted and git history isn't available:

```
1. Check context/ subdirectory — these files contain detailed info
2. Read recent session logs in sessions/
3. Read handoffs/_history/ for recent handoffs
4. Reconstruct MEMORY.md from these sources
5. Re-run /memory init to validate structure
```

---

## Agent-Specific Setup

### Antigravity (Gemini)
Add to your `GEMINI.md` or `.gemini/GEMINI.md`:

```markdown
## 🧠 Automatic Memory Protocol

ALWAYS at the START of every conversation involving project work:
1. Check if `.planning/MEMORY.md` exists in the project
2. If yes, read it FIRST before doing anything else
3. Also read `.planning/handoffs/LATEST.md` if it exists
4. Use this context to inform your work

ALWAYS at the END of significant work sessions:
1. Archive previous LATEST.md to handoffs/_history/
2. Update `.planning/MEMORY.md` with new learnings
3. Write `.planning/handoffs/LATEST.md` for the next session
4. Append any decisions to `.planning/decisions/DECISIONS.md`
5. Keep MEMORY.md under 300 lines (compress older entries)
```

### Cursor
Add the `memory-protocol.mdc` rule to `.cursor/rules/`.

### Claude Code
Add the `memory.md` command to `.claude/commands/`.

---

## Token Efficiency

This system is designed to be **token-efficient**:

- **MEMORY.md**: ~300 lines ≈ 1,500-3,000 tokens (varies by content density)
- **LATEST.md**: ~30 lines ≈ 150-300 tokens (always loaded)
- **Context files**: Loaded on-demand only when relevant
- **Session logs**: Never loaded unless explicitly requested
- **Total automatic overhead**: ~1,650-3,300 tokens per session start

> ⚠️ **Note:** Token counts vary significantly based on content. Code-heavy files may use 2x more tokens than prose. These are estimates for typical documentation-style content.

Compare to claude-mem's progressive disclosure (50-1,000 tokens per search result) — this is comparable but **zero-infrastructure**.

---

## Configuration (Optional)

Create `.planning/config.json` for customization:

```json
{
  "memory": {
    "auto_read": true,
    "auto_write": false,
    "max_memory_lines": 300,
    "max_sessions": 10,
    "compress_on_write": true,
    "archive_after_days": 30,
    "preserve_handoff_history": true
  }
}
```

---

## .gitignore Template

Add to your project's `.gitignore`:

```gitignore
# Preserve memory but ignore secrets
# Don't add these lines — just ensure .planning/ is NOT in .gitignore

# If you have secrets in memory (you shouldn't), ignore them:
# .planning/secrets/
# .planning/*.secret.md
```

**Best practice:** Commit `.planning/` to version control. This enables:
- Team-shared context
- Git-based conflict resolution
- History of decisions and sessions

---

## Anti-Patterns

❌ **Don't** store raw conversation logs — too large, too noisy
❌ **Don't** let MEMORY.md grow unbounded — compress aggressively
❌ **Don't** duplicate information across files — single source of truth
❌ **Don't** include sensitive data (API keys, passwords) in memory files
❌ **Don't** skip the handoff note — it's the most valuable part
❌ **Don't** manually edit MEMORY.md — let the agent maintain it
❌ **Don't** ignore multi-agent scenarios — use git for coordination

## Best Practices

✅ **Do** keep MEMORY.md under 300 lines at all times
✅ **Do** write a handoff note at the end of EVERY session
✅ **Do** include "watch out for" notes in handoffs
✅ **Do** compress older decisions into one-liners
✅ **Do** reference specific files and line numbers in gotchas
✅ **Do** commit `.planning/` to version control
✅ **Do** use local date (not UTC) for session filenames
✅ **Do** archive previous handoffs before overwriting
✅ **Do** prompt for memory save after significant milestones

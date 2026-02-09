---
description: Synchronize and manage project memory — read context at session start, write learnings at session end
---

# Memory Sync Workflow

This workflow manages the persistent memory system for the current project.

## Usage
Use `/memory-sync` to:
- Initialize memory for a new project
- Read memory at the start of a session
- Write memory at the end of a session
- Compress memory when it grows too large

## Steps

### 1. Check for existing memory
// turbo
Check if `.planning/MEMORY.md` exists in the project root.
- If `.planning/` doesn't exist → proceed to step 2 (initialization)
- If `.planning/` exists but MEMORY.md doesn't → partial setup, still run init
- If MEMORY.md exists → skip to step 3

### 2. Initialize memory (first time only)
Create the `.planning/` directory structure:
```
.planning/
├── MEMORY.md
├── sessions/
│   └── _archive/
├── decisions/
│   └── DECISIONS.md
├── context/
│   ├── architecture.md
│   ├── patterns.md
│   ├── gotchas.md
│   └── tech-debt.md
└── handoffs/
    ├── LATEST.md
    └── _history/
```

**Codebase Scan Algorithm:**
1. Detect project type (package.json, requirements.txt, go.mod, etc.)
2. Extract tech stack from dependency files
3. Analyze directory structure (source, tests, docs)
4. Identify existing patterns and conventions
5. Generate initial MEMORY.md content

### 3. Read current memory
// turbo
Read `.planning/MEMORY.md`.

Also check for `.planning/handoffs/LATEST.md`:
- If it exists, read it
- If it doesn't exist, that's OK — this is normal for new projects

Acknowledge what you know from memory with a brief summary.

### 4. Work on the user's task
Proceed with whatever the user needs. Throughout the session:
- Append significant decisions to `.planning/decisions/DECISIONS.md`
- Update `.planning/context/gotchas.md` if bugs or issues are found
- Update `.planning/context/architecture.md` if architecture changes

**Auto-save reminder:** After completing significant milestones, offer:
> "Would you like me to save progress to memory now?"

### 5. End-of-session memory write
When the user indicates the session is ending, or when significant work is complete:

**Step 5a: Archive previous handoff**
// turbo
If `.planning/handoffs/LATEST.md` exists:
1. Create `.planning/handoffs/_history/` if it doesn't exist
2. Move LATEST.md to `_history/YYYY-MM-DD-HHMMSS.md`

**Step 5b: Determine session number**
```
1. List files: .planning/sessions/YYYY-MM-DD-session-*.md (today's date)
2. Find highest N
3. New N = highest + 1 (or 1 if no sessions today)
```

**Step 5c: Create session log**
Create `.planning/sessions/YYYY-MM-DD-session-N.md` with:
- Objectives, completed work, decisions made
- Issues encountered, files modified, next steps

**Step 5d: Write new handoff**
Create `.planning/handoffs/LATEST.md` with:
- Summary, current state, next steps
- Blockers, open questions, watch-out-for items

**Step 5e: Update MEMORY.md**
Update `.planning/MEMORY.md` with new information from this session.

**Step 5f: Compress if needed**
If MEMORY.md exceeds 300 lines:
1. Keep only last 5 session summaries
2. Keep only last 10 key decisions
3. Keep only last 5 recently completed items
4. Remove resolved issues
5. Archive sessions older than 30 days to `_archive/`

### 6. Verify memory state
// turbo
Confirm that all memory files have been updated:
- [ ] MEMORY.md updated with latest state
- [ ] Previous LATEST.md archived to _history/
- [ ] New session log created
- [ ] New LATEST.md written
- [ ] MEMORY.md under 300 lines

Display a brief summary of what was captured.

## Error Recovery

| Issue | Recovery |
|-------|----------|
| MEMORY.md corrupted | Regenerate from context/ files and session logs |
| LATEST.md missing | Normal for new projects — skip reading |
| Partial .planning/ | Delete and re-initialize |
| Write failed | Check permissions, retry |
| Session conflict | Use timestamp in filename |

## Multi-Agent Tip

For projects with multiple agents or terminals:
```bash
git pull origin main  # Before reading memory
git add .planning/ && git commit -m "chore: memory update" && git push  # After writing
```

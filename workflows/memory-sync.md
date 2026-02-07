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
Check if `.planning/MEMORY.md` exists in the project root. If not, proceed to initialization (step 2). If yes, skip to step 3.

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
    └── LATEST.md
```

Scan the codebase to generate initial MEMORY.md content:
- Analyze project structure, tech stack, key files
- Identify existing patterns and conventions
- Document current project state
- Note any existing documentation

### 3. Read current memory
// turbo
Read `.planning/MEMORY.md` and `.planning/handoffs/LATEST.md`. Acknowledge what you know from memory with a brief summary.

### 4. Work on the user's task
Proceed with whatever the user needs. Throughout the session:
- Append significant decisions to `.planning/decisions/DECISIONS.md`
- Update `.planning/context/gotchas.md` if bugs or issues are found
- Update `.planning/context/architecture.md` if architecture changes

### 5. End-of-session memory write
When the user indicates the session is ending, or when significant work is complete:

a) Create a session log in `.planning/sessions/YYYY-MM-DD-session-N.md`
b) Write `.planning/handoffs/LATEST.md` with:
   - What was done
   - What's pending
   - Any blockers
   - Next steps
c) Update `.planning/MEMORY.md` with new information
d) If MEMORY.md exceeds 300 lines, compress older entries

### 6. Verify memory state
// turbo
Confirm that all memory files have been updated. Display a brief summary of what was captured.

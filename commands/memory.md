# /memory — Persistent Memory Management

Manage the project's persistent memory system. This command handles reading, writing, and maintaining the `.planning/` memory directory.

## Usage
- `/memory init` — Initialize memory for a new project
- `/memory read` — Read current memory and display context
- `/memory write` — Write session learnings to memory
- `/memory compress` — Compress memory when it grows too large
- `/memory status` — Show memory system status

## Protocol

### Initialization (`init`)
1. Create `.planning/` directory structure:
   - `MEMORY.md` — project brain
   - `sessions/` — session logs
   - `sessions/_archive/` — archived sessions
   - `decisions/DECISIONS.md` — decision log
   - `context/architecture.md` — architecture notes
   - `context/patterns.md` — code patterns
   - `context/gotchas.md` — known issues
   - `context/tech-debt.md` — technical debt
   - `handoffs/LATEST.md` — last session handoff
2. Scan codebase to generate initial `MEMORY.md`
3. Identify existing patterns, architecture, tech stack
4. Write initial content to all context files

### Read (`read`)
1. Read `.planning/MEMORY.md`
2. Read `.planning/handoffs/LATEST.md`
3. Display a summary of project context
4. Note any open items or blockers from last session

### Write (`write`)
1. Create session log in `.planning/sessions/YYYY-MM-DD-session-N.md`
2. Capture: objectives, completed work, decisions, issues, files modified, next steps
3. Write handoff note to `.planning/handoffs/LATEST.md`
4. Update `.planning/MEMORY.md` with new information
5. Append any new decisions to `.planning/decisions/DECISIONS.md`
6. Update context files (architecture, patterns, gotchas) as needed

### Compress (`compress`)
1. Check if `MEMORY.md` exceeds 300 lines
2. Compress older entries:
   - Keep only last 5 session summaries
   - Keep only last 10 key decisions
   - Remove resolved issues
   - Archive old session logs to `_archive/`
3. Report compression results

### Status (`status`)
1. Show memory file sizes and line counts
2. Show last updated timestamps
3. Show number of sessions, decisions, gotchas
4. Flag if compression is needed

## Automatic Behavior

At the **START** of every conversation:
- Automatically check for `.planning/MEMORY.md`
- If found, read it silently and use the context
- Acknowledge context briefly: "I see from memory that..."

At the **END** of significant work:
- Remind the user to run `/memory write`
- Or automatically write if the user has auto-memory enabled

## Configuration

In `.planning/config.json`:
```json
{
  "memory": {
    "auto_read": true,
    "auto_write": false,
    "max_memory_lines": 300,
    "max_sessions": 10,
    "compress_on_write": true
  }
}
```

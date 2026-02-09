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
   - `handoffs/_history/` — archived handoffs

2. **Codebase Scan Algorithm:**
   ```
   a. DETECT PROJECT TYPE:
      - package.json → Node.js/JavaScript/TypeScript
      - requirements.txt/pyproject.toml → Python
      - go.mod → Go
      - Cargo.toml → Rust
      - pom.xml/build.gradle → Java
      - *.sln/*.csproj → .NET

   b. EXTRACT TECH STACK:
      - Parse dependency files for frameworks
      - Identify major libraries
      - Note database connections (if visible)

   c. ANALYZE STRUCTURE:
      - Count files by extension
      - Identify source and test directories
      - Note documentation presence

   d. GENERATE MEMORY:
      - Write project overview
      - Document detected architecture
      - List identified patterns
   ```

3. Write initial content to all context files

### Read (`read`)
1. Read `.planning/MEMORY.md`
2. Read `.planning/handoffs/LATEST.md` (if exists — skip if missing)
3. Display a summary of project context
4. Note any open items or blockers from last session

### Write (`write`)

1. **Archive previous handoff:**
   - If `handoffs/LATEST.md` exists, move to `handoffs/_history/YYYY-MM-DD-HHMMSS.md`

2. **Determine session number:**
   ```
   List files matching: sessions/YYYY-MM-DD-session-*.md (today's date)
   N = (highest N found) + 1
   If no sessions today, N = 1
   ```

3. **Create session log:** `sessions/YYYY-MM-DD-session-N.md`
   - Capture: objectives, completed work, decisions, issues, files modified, next steps

4. **Write new handoff:** `handoffs/LATEST.md`

5. **Update MEMORY.md** with new information

6. **Append decisions** to `decisions/DECISIONS.md` if any were made

7. **Update context files** (architecture, patterns, gotchas) as needed

### Compress (`compress`)
1. Check if `MEMORY.md` exceeds 300 lines
2. Compress in order (stop when under 300):
   - Recent Sessions: Keep last 5
   - Key Decisions: Keep last 10
   - Recently Completed: Keep last 5
   - Known Issues: Remove resolved
   - Move details to context/ files
3. Archive old session logs (>30 days) to `sessions/_archive/`
4. Report compression results

### Status (`status`)
1. Show memory file sizes and line counts
2. Show last updated timestamps
3. Show number of sessions, decisions, gotchas
4. Flag if compression is needed
5. Check for missing files or partial setup

## Automatic Behavior

At the **START** of every conversation:
- Automatically check for `.planning/MEMORY.md`
- If found, read it silently and use the context
- Acknowledge context briefly: "I see from memory that..."
- If `LATEST.md` is missing, that's OK — note it but continue

At the **END** of significant work:
- Remind the user to run `/memory write`
- Or automatically write if the user has auto-memory enabled

After **significant milestones**:
- Proactively offer: "Would you like me to save progress to memory now?"

## Configuration

In `.planning/config.json`:
```json
{
  "memory": {
    "auto_read": true,
    "auto_write": false,
    "max_memory_lines": 300,
    "max_sessions": 10,
    "archive_after_days": 30,
    "compress_on_write": true,
    "preserve_handoff_history": true
  }
}
```

## Error Recovery

| Scenario | Action |
|----------|--------|
| MEMORY.md empty/corrupted | Re-run `/memory init` to regenerate |
| Partial .planning/ exists | Delete and re-run `/memory init` |
| LATEST.md missing | Normal for new projects — skip reading |
| Write permission denied | Check file permissions, close other editors |
| Session number conflict | Use timestamp: YYYY-MM-DD-HHMMSS-session |

## Multi-Agent Coordination

When multiple agents may edit memory:
```bash
# Start of session
git pull origin main

# End of session
git add .planning/
git commit -m "chore: update project memory"
git push origin main
```

---
description: Start a coordinated team session with sequential role-switching for complex features
---

# Team Session Workflow

This workflow orchestrates a multi-role team session using sequential role-switching with a shared blackboard.

## Usage
Use `/team-session` to:
- Start a new team session for a feature or task
- Resume an existing team session
- Switch between specialist roles

## Steps

// turbo-all

### 1. Check for existing team session
Check if `.planning/team/config.json` exists. If yes, read it to determine the current phase and offer to resume. If no, proceed to step 2.

### 2. Define the team
Ask the user what they want to accomplish. Based on complexity, choose a role preset:

**Quick Feature (small scope):**
- 🔬 Researcher → ⚙️ Executor → 🔍 Reviewer

**Full Pipeline (complex feature):**
- 🔬 Researcher → 📐 Architect → 📋 Planner → ⚙️ Executor → 🔍 Reviewer

**Debug Investigation:**
- 🕵️ Investigator → 🔧 Fixer → ✅ Verifier

Create `.planning/team/` directory structure and `config.json`.

### 3. Initialize the task board
Create `.planning/team/BOARD.md` with the team objective and empty task sections.

### 4. Execute Phase 1 — First Role
Adopt the first role's persona and focus:
- Read the role's focus area from config
- Perform the role's responsibilities
- Produce the role's expected outputs
- Write the handoff document to `.planning/team/handoffs/phase-N-[role].md`
- Update `config.json` to advance to the next phase

### 5. Role Transition
When a phase completes:
- Update the task board in `BOARD.md`
- Read the previous role's handoff document
- Adopt the next role's persona
- Continue with the new role's focus

### 6. Execute Remaining Phases
Repeat step 5 for each role in the pipeline until all phases are complete.

### 7. Team Completion
When all phases are done:
- Update `config.json` status to "completed"
- Update the task board with final status
- Write a comprehensive summary
- Feed key learnings into `.planning/MEMORY.md` (if persistent-memory is active)
- Clean up or archive the team session

### Notes
- Each role transition should be explicit and acknowledged
- The agent should announce role switches: "Switching to ⚙️ Executor role..."
- Handoff documents are the primary communication channel
- The task board should be updated in real-time
- If a role identifies issues, it creates tasks for a later role to handle

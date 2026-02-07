---
description: Initialize project with .planning/ directory, context gathering, requirements, and roadmap
---

## Steps

// turbo-all

1. Create the planning directory structure:
```
mkdir -p .planning/plans .planning/research .planning/debug .planning/uat
```

2. Check if this is an existing project by examining the codebase:
```
git log --oneline -5 2>&1; echo "---"; ls package.json tsconfig.json setup.py Cargo.toml requirements.txt 2>&1; echo "---"; find . -maxdepth 2 -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | sort | head -30
```

3. Ask the user 6 questions to gather project context:
   - **What are you building?** — Project name, one-line description, 3-sentence vision
   - **Who is this for?** — Target users, use cases, expected scale
   - **Tech stack?** — Language, framework, database, infrastructure
   - **What exists already?** — Greenfield or existing codebase?
   - **Constraints?** — Deadlines, team size, mandatory tech
   - **Quality priorities?** — Rank: speed, reliability, security, maintainability, UX

4. Create `.planning/PROJECT.md` with:
   - Vision (3 sentences)
   - Goals (numbered list)
   - Target users (primary + secondary)
   - Tech stack (language, framework, database, infrastructure, key libraries)
   - Constraints (timeline, quality priorities, non-negotiables)
   - Existing codebase notes (if applicable)

5. Create `.planning/REQUIREMENTS.md` with:
   - Functional requirements (FR-1, FR-2, ...) each with description, acceptance criteria checkboxes, and priority (P0/P1/P2)
   - Non-functional requirements (performance, security, reliability)
   - Out of scope section

6. Create `.planning/ROADMAP.md` with 3-7 phases:
   - Each phase has: name, goal, deliverables, dependencies, effort estimate, requirements covered
   - Phases should be logically ordered with clear dependency chains

7. Create `.planning/STATE.md` with:
   - Current phase: Phase 0 — Initialization
   - Status: 🟢 On Track
   - History: [timestamp] — Project initialized

8. Create `.planning/config.json` with project name, init timestamp, phase count, current_phase: 0, and preferences (auto_commit: false, auto_test: true, verification_required: true)

9. Present summary to user:
   - ✅ List each file created
   - 📋 Show phase overview from roadmap
   - 🔜 Suggest next steps: `/plan Phase 1`, `/research [topic]`, or `/progress`

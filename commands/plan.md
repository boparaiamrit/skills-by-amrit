---
name: plan
description: "Create a detailed implementation plan for a feature or change."
disable-model-invocation: true
argument-hint: "[feature-description]"
---

# /plan — Implementation Planning

Create a detailed, step-by-step implementation plan.

## Instructions

1. **Understand the requirement** from `$ARGUMENTS`:
   - What problem does this solve?
   - Who benefits from this change?
   - What are the acceptance criteria?

2. **Research the codebase**:
   - Map existing relevant code (files, functions, patterns)
   - Identify dependencies and integration points
   - Check for similar existing implementations to follow or reuse

3. **Design the solution**:
   - List all files that need to be created or modified
   - Define the data model changes (if any)
   - Define the API changes (if any)
   - Identify edge cases and error scenarios

4. **Break into tasks**:
   ```markdown
   ## Implementation Plan: [Feature Name]

   ### Phase 1: Foundation
   - [ ] Task 1 — description (~X min)
   - [ ] Task 2 — description (~X min)

   ### Phase 2: Core Logic
   - [ ] Task 3 — description (~X min)

   ### Phase 3: Testing
   - [ ] Task 4 — description (~X min)

   ### Phase 4: Polish
   - [ ] Task 5 — description (~X min)

   ### Risks & Mitigations
   - Risk: [description] → Mitigation: [approach]

   ### Out of Scope
   - [Things explicitly not included in this plan]
   ```

5. **Estimate effort** — provide rough time estimates for each task.
6. **Identify risks** — what could go wrong and how to mitigate it.
7. **Save** the plan as `PLAN.md` in the project root.

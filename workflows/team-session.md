---
description: Start an LLM Council session — Manager-orchestrated multi-agent team with Memory Module for deep codebase intelligence
---

# LLM Council Session Workflow

This workflow orchestrates a full LLM Council session: Memory Module initialization → Manager formation → dynamic routing through specialist agents.

## Usage
Use `/team-session` to:
- Start a new council session for a feature, refactor, or investigation
- Resume an existing council session
- The Manager orchestrates everything — you just provide the objective

## Steps

// turbo-all

### 1. Check for existing council session
Check if `.planning/council/council.json` exists.
- If **yes**: Read it. Read the last message in `messages/`. Read `MEMORY.md`. Offer to resume.
- If **no**: Proceed to step 2.

### 2. Initialize Memory Module
Check if `.planning/memory/` exists and is current.
- If **no** or if **stale** (>48h since last update):
  1. Scan entire codebase directory structure → `codebase-map.md`
  2. Extract ALL database schemas (tables, columns, types, relationships, indexes, RLS) → `database-schemas.md`
  3. Map ALL API routes/endpoints with controllers, auth, middleware → `api-routes.md`
  4. Map ALL services with dependencies, methods, patterns → `service-graph.md`
  5. Map frontend components, state, routing (if applicable) → `frontend-map.md`
  6. Inventory tech stack, config, environment → `tech-stack.md`
  7. Compress highlights into `.planning/MEMORY.md`
- If **yes** and current: Read `MEMORY.md` for full context.

### 3. Define the council
Ask the user what they want to accomplish. Based on complexity and the Memory Module context, select a council preset:

**🏗️ Full Council (complex features, multi-module impact):**
- 🎯 Manager → 🔬 Researcher → 📐 Architect → 📋 Planner → ⚙️ Executor → 🔍 Reviewer

**⚡ Rapid Council (small features, clear requirements):**
- 🎯 Manager → 🔬 Researcher → ⚙️ Executor → 🔍 Reviewer

**🐛 Debug Council (bug investigation, production issues):**
- 🎯 Manager → 🕵️ Investigator → 🔧 Fixer → ✅ Verifier

**📐 Architecture Council (design decisions, tech evaluation):**
- 🎯 Manager → 🔬 Researcher → 📐 Architect → 🔍 Reviewer

**🔄 Refactoring Council (large-scale refactoring):**
- 🎯 Manager → 🔬 Researcher → 📋 Planner → ⚙️ Executor → 🔍 Reviewer

**🔍 Audit Council (system audit, pre-launch review):**
- 🎯 Manager → 🛡️ Security Auditor + ⚡ Performance Auditor + 📐 Architecture Auditor → 📝 Synthesizer

Create `.planning/council/` structure: `council.json`, `BOARD.md`, `messages/`, `handoffs/`, `tasks/`, `reviews/`.

### 4. Manager makes first routing decision
As the Manager:
1. Analyze the objective in context of the Memory Module
2. Identify which areas of the codebase are affected
3. Write the first routing message with Memory Module context:
   - Which agent gets the first task
   - What specific areas to investigate
   - Relevant schema/route/service context from Memory Module
   - Known gotchas to watch out for
4. Route to the first sub-agent

### 5. Sub-agent execution
Switch to the routed sub-agent role:
1. Read the Manager's routing message (includes Memory Module context)
2. Execute the specialist work
3. When complete, write a message back to Manager:
   - Type: handoff, question, escalation, status, or request
   - Include files produced and suggested next action
4. Update the task board

### 6. Manager routing loop
Switch back to Manager role:
1. Read the sub-agent's message
2. Consult Memory Module for context on affected areas
3. Check quality gates for the current phase
4. Make routing decision:
   - **Route to next agent** — provide Memory Module context and quality expectations
   - **Send back to same agent** — with guidance from Memory Module
   - **Handle escalation** — use deep project knowledge to guide
   - **Close council** — if objective is fully met
5. Write routing message and update council.json

### 7. Repeat steps 5-6
Continue the routing loop until the Manager determines the objective is complete.
- Each cycle: sub-agent works → messages Manager → Manager routes next
- **Peer communication** can happen between steps when agents need quick alignment
- **Escalations** always route through the Manager

### 8. Council completion
When the Manager closes the council:
1. Update `council.json` status to "completed"
2. Update the task board with final status
3. Update Memory Module if schemas/routes/services changed
4. Write comprehensive summary
5. Feed key learnings into `.planning/MEMORY.md`
6. Write `.planning/handoffs/LATEST.md` for next session
7. Log decisions to `.planning/decisions/DECISIONS.md`

### Notes
- The **Manager role is always available** — any sub-agent can escalate at any time
- Manager provides **Memory Module context** in every routing message
- **Quality gates** must be checked before advancing phases
- **Peer communication** is allowed between agents in each other's `can_talk_to` list
- The task board should be updated in real-time
- The council can span multiple sessions — `council.json` preserves full state

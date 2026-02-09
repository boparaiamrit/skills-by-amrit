---
name: agent-team-coordination
description: "💎 LLM Council — Manager-orchestrated multi-agent coordination with deep Memory Module. One manager agent with full project knowledge routes tasks to specialist sub-agents, enables peer communication, handles escalations, and ensures quality. The Memory Module provides comprehensive codebase intelligence (schemas, routes, services, patterns) BEFORE any work begins."
---

# 💎 LLM Council — Agent Team Coordination

> The most powerful pattern in AI-assisted development: a **Manager agent** with full project intelligence orchestrating **specialist sub-agents** through dynamic routing, peer communication, and structured escalation.

## What Makes This Different

Every other AI team coordination system does one of two things:
1. **Linear handoffs** — Agent A → Agent B → Agent C (rigid, no feedback loops)
2. **Parallel chaos** — Multiple agents working simultaneously with no shared brain

The LLM Council is neither. It's an **intelligent routing graph** where:

- ✅ A **Manager** has deep knowledge of the ENTIRE project (via Memory Module)
- ✅ **Sub-agents** are specialists who do the actual work
- ✅ Sub-agents can **talk to each other** directly for quick checks
- ✅ Any agent can **escalate to the Manager** when stuck
- ✅ The Manager **dynamically routes** work based on context — not a fixed sequence
- ✅ The Manager can **re-route** work when new information emerges
- ✅ Everything is **file-based** — works in ANY agent (Antigravity, Cursor, Claude Code, Gemini CLI)

```
                         ╔══════════════════════════════╗
                         ║      🎯 MANAGER AGENT        ║
                         ║                               ║
                         ║  ▪ Full Memory Module loaded   ║
                         ║  ▪ Knows ALL schemas, routes   ║
                         ║  ▪ Knows ALL services, flows   ║
                         ║  ▪ Routes tasks dynamically    ║
                         ║  ▪ Resolves conflicts           ║
                         ║  ▪ Guides stuck agents          ║
                         ╚════════════╦═════════════════╝
                                      ║
                    ╔═════════════════╬═════════════════╗
                    ║    Dynamic Task Routing             ║
                    ║    + Escalation Channel              ║
                    ╚═════╦═══╦═══╦═══╦═══╦══════════════╝
                          ║   ║   ║   ║   ║
                 ┌────────▼┐ ┌▼───▼┐ ┌▼───▼┐ ┌──────────┐
                 │🔬Research│ │📐Arch│ │📋Plan│ │⚙️Execute │
                 │  Agent   │ │Agent │ │Agent│ │  Agent   │
                 └─────┬───┘ └──┬──┘ └──┬──┘ └────┬─────┘
                       │        │       │          │
                       ╰────────┴───┬───┴──────────╯
                                    │
                         Peer-to-Peer Communication
                         (Direct specialist handoffs)
```

---

## Related Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| Command | `commands/team.md` | `/team start`, `/team resume`, `/team board` |
| Workflow | `workflows/team-session.md` | End-to-end council session workflow |
| Cursor Rule | `cursor-rules/team-protocol.mdc` | Auto-enforced council protocol for Cursor |
| Universal Rule | `rules/team-protocol.md` | Council protocol for any agent |
| Agents | `agents/*.md` | Individual agent specifications |

### Agent Definitions

| Agent | File | Preset Usage |
|-------|------|--------------|
| 🔬 Researcher | `agents/researcher.md` | Full, Rapid, Architecture, Refactoring |
| 📐 Architect | `agents/mapper.md` | Full, Architecture |
| 📋 Planner | `agents/planner.md` | Full, Refactoring |
| ⚙️ Executor | `agents/executor.md` | Full, Rapid, Refactoring |
| 🔍 Reviewer | `agents/reviewer.md` | All presets |
| 🕵️ Investigator | `agents/investigator.md` | Debug |
| 🔧 Fixer | `agents/fixer.md` | Debug |
| ✅ Verifier | `agents/verifier.md` | Debug |
| 🐛 Debugger | `agents/debugger.md` | Standalone debugging |

---

## Part 1: The Memory Module 🧠

> **PREREQUISITE**: Before ANY council session begins, the Memory Module MUST exist. If it doesn't, the Manager's first job is to create it.

The Memory Module is the project's **comprehensive intelligence layer** — a structured, deep scan of the entire codebase that gives the Manager complete understanding.

### What the Memory Module Contains

```
.planning/
├── MEMORY.md                         # 🧠 Compressed project brain (~300 lines)
└── memory/                           # 📚 Deep intelligence files
    ├── codebase-map.md              # Directory structure + module purposes
    ├── database-schemas.md          # ALL tables, columns, types, relationships
    ├── api-routes.md                # ALL endpoints, controllers, middleware
    ├── service-graph.md             # Service dependencies + business logic
    ├── frontend-map.md              # Components, state, routing (if applicable)
    ├── patterns.md                  # Established code patterns + conventions
    └── tech-stack.md                # Languages, frameworks, tools, config
```

### Memory Module Generation Protocol

When starting a council session and no Memory Module exists, the Manager MUST execute this protocol:

#### Step 1: Codebase Scan (`codebase-map.md`)

```markdown
# Codebase Map
> Generated: [DATE]
> Framework: [Next.js / Laravel / Django / etc.]
> Language: [TypeScript / Python / PHP / etc.]

## Directory Structure
[Full tree with purpose annotations]
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components (147 files)
│   ├── lib/           # Shared utilities and services
│   ├── hooks/         # Custom React hooks (23 files)
│   └── types/         # TypeScript type definitions
├── supabase/
│   ├── migrations/    # 42 migration files
│   └── functions/     # 8 edge functions
└── tests/             # Test files (67 files)

## Module Boundaries
- **Auth Module**: src/lib/auth/ — Better Auth, session management
- **Data Module**: src/lib/services/ — All Supabase queries
- **UI Module**: src/components/ — Presentational components
- **API Module**: src/app/api/ — API routes

## Entry Points
- Main: src/app/layout.tsx
- API: src/app/api/
- Auth: src/lib/auth/auth.ts

## Dependencies (Critical)
[Package dependencies that affect architecture decisions]
```

#### Step 2: Database Intelligence (`database-schemas.md`)

```markdown
# Database Schemas
> Generated: [DATE]
> Database: [PostgreSQL / MySQL / SQLite]
> ORM: [Prisma / Drizzle / SQLAlchemy / Eloquent]
> Total Tables: [N]

## Schema Overview
[Entity-relationship summary]

## Tables

### users
| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | uuid | NO | gen_random_uuid() | PK |
| email | varchar(255) | NO | — | UNIQUE |
| name | varchar(255) | YES | — | |
| created_at | timestamptz | NO | now() | |

**Indexes:** idx_users_email (UNIQUE)
**RLS:** Enabled — users can only read own row
**Relationships:**
- users.id → posts.author_id (1:many)
- users.id → profiles.user_id (1:1)

### posts
[Same format for every table...]

## Relationships Graph
users ──1:many──→ posts
users ──1:1────→ profiles
posts ──many:many→ tags (via post_tags)

## Migration History (Last 10)
| Version | Date | Description |
|---------|------|-------------|
| 20260208_001 | 2026-02-08 | Add notifications table |
| 20260207_001 | 2026-02-07 | Add user preferences |
```

#### Step 3: API Route Intelligence (`api-routes.md`)

```markdown
# API Routes
> Generated: [DATE]
> Total Endpoints: [N]

## Route Map

### Authentication
| Method | Path | Controller/Handler | Auth | Description |
|--------|------|--------------------|------|-------------|
| POST | /api/auth/login | auth.ts:login | None | Email/password login |
| POST | /api/auth/signup | auth.ts:signup | None | Create account |
| POST | /api/auth/logout | auth.ts:logout | Required | End session |
| GET | /api/auth/session | auth.ts:session | Required | Current session |

### Resources
| Method | Path | Controller/Handler | Auth | Description |
|--------|------|--------------------|------|-------------|
| GET | /api/posts | posts.ts:list | Required | List user posts |
| POST | /api/posts | posts.ts:create | Required | Create post |

## Controller Flows
### POST /api/posts (Create Post)
```
Request → Auth Middleware → Validate Body → PostService.create()
  → Database Insert → Revalidate Cache → 201 Response
```

## Middleware Chains
- `/api/*` → rateLimiter → corsHandler
- `/api/protected/*` → authMiddleware → rateLimiter
- `/api/admin/*` → authMiddleware → adminCheck
```

#### Step 4: Service Layer Intelligence (`service-graph.md`)

```markdown
# Service Graph
> Generated: [DATE]

## Services

### PostService (src/lib/services/post-service.ts)
**Purpose:** CRUD operations for blog posts
**Dependencies:** SupabaseClient, CacheService, NotificationService
**Methods:**
- create(data) → Post — Creates post, invalidates cache, sends notification
- update(id, data) → Post — Updates post, invalidates cache
- delete(id) → void — Soft delete, invalidates cache
- list(filters) → Post[] — Paginated list with caching

### NotificationService (src/lib/services/notification-service.ts)
**Purpose:** User notification management
**Dependencies:** SupabaseClient, EmailService
**Methods:**
- send(userId, type, data) → Notification
- markRead(id) → void
- getUnread(userId) → Notification[]

## Dependency Graph
PostService → SupabaseClient
PostService → CacheService
PostService → NotificationService → EmailService
AuthService → SupabaseClient → (Supabase)

## Event/Observer Patterns
- PostCreated → NotificationService.send()
- UserSignup → WelcomeEmailJob

## Background Jobs / Queues
- WelcomeEmailJob — Sends welcome email on signup
- DigestJob — Weekly digest email (cron: every Monday 8am)

## External API Integrations
- Stripe (payments) — src/lib/stripe/
- SendGrid (email) — src/lib/email/
- Cloudinary (images) — src/lib/storage/
```

#### Step 5: Frontend Map (`frontend-map.md`) — if applicable

```markdown
# Frontend Map
> Generated: [DATE]
> Framework: [Next.js / React / Vue / etc.]
> Total Components: [N]

## Page Structure
/                    → HomePage (public)
/login               → LoginPage (public)
/dashboard           → DashboardPage (auth required)
/dashboard/settings  → SettingsPage (auth required)
/posts/[id]          → PostDetailPage (public)
/admin               → AdminPage (admin role required)

## Component Hierarchy
App
├── Layout
│   ├── Sidebar
│   │   ├── NavLink[]
│   │   └── UserAvatar
│   ├── Header
│   │   ├── SearchBar
│   │   └── NotificationBell
│   └── MainContent
│       └── [Page Components]
├── Providers
│   ├── AuthProvider
│   ├── ThemeProvider
│   └── QueryProvider

## State Management
- **Auth state:** React Context (AuthProvider)
- **Server state:** TanStack Query / SWR
- **UI state:** useState/useReducer (local)
- **Theme:** CSS variables + context

## Design System
- **Colors:** CSS custom properties in globals.css
- **Typography:** Inter (body), JetBrains Mono (code)
- **Spacing:** 4px base unit
- **Breakpoints:** 640px, 768px, 1024px, 1280px
```

#### Step 6: Tech Stack & Config (`tech-stack.md`)

```markdown
# Tech Stack
> Generated: [DATE]

## Core
| Layer | Technology | Version |
|-------|-----------|---------|
| Language | TypeScript | 5.3 |
| Framework | Next.js | 14.2 |
| Database | PostgreSQL | 15 (Supabase) |
| Auth | Better Auth | 1.2 |
| Styling | Tailwind CSS | 3.4 |

## Infrastructure
- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **Email:** SendGrid
- **CI/CD:** GitHub Actions

## Configuration Files
- `next.config.js` — Next.js config
- `tsconfig.json` — TypeScript config
- `.env.local` — Environment variables (NOT committed)

## Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| SUPABASE_URL | Database connection | Yes |
| SUPABASE_ANON_KEY | Public API key | Yes |
| STRIPE_SECRET_KEY | Payment processing | Yes |
| SENDGRID_API_KEY | Email sending | Yes |
```

### Memory Module Iron Rules

```
1. The Memory Module MUST be created BEFORE any council work begins.
2. The Memory Module MUST be updated after significant changes.
3. MEMORY.md stays under 300 lines — detail lives in memory/ subdirectory.
4. Every table must be documented with columns, types, relationships and indexes.
5. Every API endpoint must be documented with method, path, auth, and handler.
6. Every service must be documented with purpose, dependencies, and methods.
7. The Memory Module is READ by all agents. Only the MANAGER may UPDATE it.
```

---

## Part 2: The Council Architecture 🎯

### Council Configuration (`council.json`)

```json
{
  "council_name": "feature-oauth-refactor",
  "objective": "Refactor authentication module to support OAuth2",
  "status": "active",
  "created_at": "2026-02-09T10:00:00Z",

  "manager": {
    "name": "manager",
    "emoji": "🎯",
    "status": "active",
    "context": "Full Memory Module loaded. Knows all schemas, routes, services.",
    "responsibilities": [
      "Maintain full project knowledge via Memory Module",
      "Route tasks to appropriate specialist agents",
      "Resolve conflicts between agents",
      "Provide guidance when agents are stuck",
      "Enforce quality gates before phase transitions",
      "Synthesize final output"
    ]
  },

  "agents": [
    {
      "name": "researcher",
      "emoji": "🔬",
      "status": "idle",
      "specialization": "Codebase analysis, external research, evidence gathering",
      "can_talk_to": ["manager", "architect", "planner"],
      "current_task": null
    },
    {
      "name": "architect",
      "emoji": "📐",
      "status": "idle",
      "specialization": "System design, patterns, interfaces, data flow, schema design",
      "can_talk_to": ["manager", "researcher", "planner", "executor"],
      "current_task": null
    },
    {
      "name": "planner",
      "emoji": "📋",
      "status": "idle",
      "specialization": "Task decomposition, dependency analysis, wave planning, estimation",
      "can_talk_to": ["manager", "architect", "executor"],
      "current_task": null
    },
    {
      "name": "executor",
      "emoji": "⚙️",
      "status": "idle",
      "specialization": "Code implementation, testing, database migrations",
      "can_talk_to": ["manager", "architect", "planner", "reviewer"],
      "current_task": null
    },
    {
      "name": "reviewer",
      "emoji": "🔍",
      "status": "idle",
      "specialization": "Code review, security audit, performance analysis, test validation",
      "can_talk_to": ["manager", "executor", "architect"],
      "current_task": null
    }
  ],

  "routing_log": [],
  "message_count": 0,
  "current_agent": "manager"
}
```

### Directory Structure

```
.planning/
├── MEMORY.md                          # 🧠 Compressed project brain
├── memory/                            # 📚 Deep intelligence (Memory Module)
│   ├── codebase-map.md
│   ├── database-schemas.md
│   ├── api-routes.md
│   ├── service-graph.md
│   ├── frontend-map.md
│   └── tech-stack.md
├── council/                           # 🎯 Council state
│   ├── council.json                  # Council configuration + routing log
│   ├── BOARD.md                      # Human-readable task board
│   ├── messages/                     # Structured communication
│   │   ├── msg-001.md
│   │   └── ...
│   ├── handoffs/                     # Role completion documents
│   │   ├── handoff-researcher.md
│   │   └── ...
│   ├── tasks/                        # Task definitions
│   │   ├── 001-task-name.md
│   │   └── ...
│   └── reviews/                      # Review feedback
│       └── review-NNN.md
├── decisions/
│   └── DECISIONS.md
└── context/
    ├── architecture.md
    ├── patterns.md
    ├── gotchas.md
    └── tech-debt.md
```

---

## Part 3: Communication Protocol 💬

### Message Format

All agent-to-agent communication uses structured messages in `.planning/council/messages/`:

```markdown
# Message #[NNN]

## Meta
- **From:** 🔬 researcher
- **To:** 🎯 manager (or 📐 architect for peer-to-peer)
- **Type:** handoff | question | escalation | status | request
- **Timestamp:** [DATE]
- **Related Task:** #[task_id] (if applicable)

## Content
[The actual message content]

## Files Produced
- `.planning/council/handoffs/handoff-researcher.md`
- [Any other files created]

## Suggested Next Action
[What the sender thinks should happen next]
```

### Message Types

#### 1. 📤 Handoff — "I'm done, here's my work"
```markdown
**Type:** handoff
**From:** 🔬 researcher → 🎯 manager
**Content:** Research complete. Found 3 OAuth2 approaches. Recommending PKCE flow
  for our SPA architecture. Documented in handoff-researcher.md.
**Suggested Next Action:** Route to architect for system design.
```

#### 2. ❓ Question — "I need clarification"
```markdown
**Type:** question
**From:** 📐 architect → 🔬 researcher
**Content:** Your research mentions "existing session table has polymorphic
  relationships." Can you clarify which tables reference sessions and how
  the polymorphic type column works?
**Suggested Next Action:** Researcher investigates and responds.
```

#### 3. 🚨 Escalation — "I'm stuck, need manager help"
```markdown
**Type:** escalation
**From:** ⚙️ executor → 🎯 manager
**Content:** The auth migration conflicts with the existing RLS policies.
  Table `user_sessions` has row-level security that blocks the new OAuth
  columns. I need guidance on whether to modify RLS or restructure the schema.
**Suggested Next Action:** Manager provides guidance using Memory Module context.
```

#### 4. 📊 Status — "Here's my progress"
```markdown
**Type:** status
**From:** ⚙️ executor → 🎯 manager
**Content:** Tasks #001 and #002 complete. Starting #003 (token refresh).
  Estimated 20 minutes remaining.
**Suggested Next Action:** No action needed, continuing.
```

#### 5. 🔄 Request — "I need a specific specialist"
```markdown
**Type:** request
**From:** ⚙️ executor → 🎯 manager
**Content:** I've written the API endpoints but need the architect to review
  the schema changes before I write the migration. This affects 3 tables.
**Suggested Next Action:** Route to architect for schema review.
```

### Manager Routing Decisions

When the Manager receives a message, it MUST follow this protocol:

```
1. READ the message carefully
2. CONSULT the Memory Module for relevant context
3. DECIDE the next action:
   a. Route to another agent (specify which and why)
   b. Provide guidance directly (for escalations)
   c. Acknowledge and wait (for status updates)
   d. Create new tasks (if scope expanded)
   e. Close the council (if objective is complete)
4. UPDATE council.json routing_log
5. WRITE a routing message to the next agent
```

**Manager Routing Message:**
```markdown
# Routing Decision #[N]

## From Manager to: 📐 architect
## Reason: Research phase complete, design needed

## Context from Memory Module
[Relevant information the Manager pulls from the Memory Module]
- The current auth system uses Better Auth with session-based auth
- Tables affected: users, sessions, accounts (see database-schemas.md)
- Known gotcha: sessions table has RLS that must be updated

## Task Assignment
[What the architect should do]

## Quality Gate
[What "done" looks like for this assignment]

## Watch Out For
[Specific warnings from the Memory Module]
- The sessions table has a trigger that auto-expires after 30 days
- The accounts table is used by both auth and billing — be careful
```

---

## Part 4: Execution Flow 🔄

### Phase 0: Memory Module Initialization

```
┌──────────────────────────────────────────────────────────────┐
│  🎯 MANAGER: Memory Module Check                             │
│                                                               │
│  Does .planning/memory/ exist and is it current?              │
│                                                               │
│  NO → Execute full codebase intelligence gathering            │
│       1. Scan directory structure → codebase-map.md           │
│       2. Extract ALL database schemas → database-schemas.md   │
│       3. Map ALL API routes/controllers → api-routes.md       │
│       4. Map ALL services/dependencies → service-graph.md     │
│       5. Map frontend (if applicable) → frontend-map.md      │
│       6. Inventory tech stack → tech-stack.md                 │
│       7. Compress into MEMORY.md                              │
│                                                               │
│  YES → Read MEMORY.md + check handoffs/LATEST.md              │
│        Verify Memory Module is still current                  │
└──────────────────────────────────────────────────────────────┘
```

### Phase 1: Council Formation

```
┌──────────────────────────────────────────────────────────────┐
│  🎯 MANAGER: Council Formation                               │
│                                                               │
│  1. Analyze the objective                                     │
│  2. Determine which agents are needed                         │
│  3. Select a Council Preset (or custom)                       │
│  4. Create council.json                                       │
│  5. Create initial task board (BOARD.md)                       │
│  6. Route first task to appropriate agent                     │
└──────────────────────────────────────────────────────────────┘
```

### Phase 2: Dynamic Execution Loop

```
┌─────────────────────────────────────────────────────────────────────┐
│                    COUNCIL EXECUTION LOOP                           │
│                                                                     │
│  ┌─────────────────────────────────────────┐                       │
│  │ 1. Manager assigns task to Agent X       │                       │
│  └────────────────┬────────────────────────┘                       │
│                   ▼                                                  │
│  ┌─────────────────────────────────────────┐                       │
│  │ 2. Agent X works on task                 │                       │
│  │    - Reads Memory Module for context     │                       │
│  │    - Reads previous handoffs             │                       │
│  │    - Executes specialist work            │                       │
│  └────────────────┬────────────────────────┘                       │
│                   ▼                                                  │
│  ┌─────────────────────────────────────────┐                       │
│  │ 3. Agent X writes a message              │    ◄── Can be:       │
│  │    - handoff (done, pass to next)        │    ◄── question       │
│  │    - escalation (stuck, need help)       │    ◄── request        │
│  │    - status (still working)              │    ◄── peer message   │
│  └────────────────┬────────────────────────┘                       │
│                   ▼                                                  │
│  ┌─────────────────────────────────────────────────┐               │
│  │ 4. Manager reads message + consults Memory       │               │
│  │    - What did the agent produce?                  │               │
│  │    - What does the Memory Module say is relevant? │               │
│  │    - Who should handle this next?                 │               │
│  │    - Are there any gotchas to warn about?         │               │
│  └────────────────┬────────────────────────────────┘               │
│                   ▼                                                  │
│  ┌─────────────────────────────────────────┐                       │
│  │ 5. Manager makes routing decision        │                       │
│  │    a) Route to Agent Y                   │ ──→ Loop back to #1   │
│  │    b) Provide guidance + re-route        │ ──→ Loop back to #2   │
│  │    c) Send back to same agent with help  │ ──→ Loop back to #2   │
│  │    d) Close council (objective met)      │ ──→ Exit              │
│  └─────────────────────────────────────────┘                       │
│                                                                     │
│  LOOP CONTINUES until Manager determines objective is complete      │
└─────────────────────────────────────────────────────────────────────┘
```

### Peer-to-Peer Communication

Sub-agents can communicate directly for **quick checks** without going through the Manager:

```
Allowed Peer Conversations:
- 🔬 Researcher ↔ 📐 Architect  (research ↔ design alignment)
- 📐 Architect  ↔ 📋 Planner    (design ↔ task breakdown)
- 📐 Architect  ↔ ⚙️ Executor   (design clarification during impl)
- 📋 Planner    ↔ ⚙️ Executor   (task clarification during impl)
- ⚙️ Executor   ↔ 🔍 Reviewer   (review feedback discussion)
- 🔍 Reviewer   ↔ 📐 Architect  (architecture concerns)

NOT Allowed Without Manager:
- 🔬 Researcher ↔ ⚙️ Executor  (too disconnected, Manager must mediate)
- 🔬 Researcher ↔ 🔍 Reviewer  (no direct relationship)
- 📋 Planner    ↔ 🔍 Reviewer  (Manager handles rework routing)
```

**When to escalate to Manager vs. peer:**
- **Escalate to Manager:** Scope changes, blockers, conflicts, quality concerns
- **Peer communication:** Clarification questions, quick alignment checks, technical details

---

## Part 5: Council Presets 🎛️

### Full Council (5 agents) — Complex features

```json
{
  "preset": "full-council",
  "agents": ["researcher", "architect", "planner", "executor", "reviewer"],
  "use_when": "Complex feature spanning multiple modules, significant architecture impact",
  "typical_flow": "Manager → Researcher → Manager → Architect → Manager → Planner → Manager → Executor → Manager → Reviewer → Manager (close)"
}
```

### Rapid Council (3 agents) — Quick features

```json
{
  "preset": "rapid-council",
  "agents": ["researcher", "executor", "reviewer"],
  "use_when": "Small to medium features, clear requirements, minimal architecture impact",
  "typical_flow": "Manager → Researcher → Manager → Executor → Manager → Reviewer → Manager (close)"
}
```

### Debug Council (3 agents) — Investigation

```json
{
  "preset": "debug-council",
  "agents": ["investigator", "fixer", "verifier"],
  "use_when": "Bug investigation, production issues, performance problems",
  "investigator": {
    "specialization": "Hypothesis generation, log analysis, reproduction steps"
  },
  "fixer": {
    "specialization": "Root cause fix implementation, test writing"
  },
  "verifier": {
    "specialization": "Fix validation, regression testing, edge case verification"
  }
}
```

### Architecture Council (3 agents) — Design decisions

```json
{
  "preset": "architecture-council",
  "agents": ["researcher", "architect", "reviewer"],
  "use_when": "Architecture decisions, tech stack evaluation, migration planning",
  "typical_flow": "Manager → Researcher (multiple investigations) → Manager → Architect → Manager → Reviewer → Manager (decision)"
}
```

### Refactoring Council (4 agents) — Safe refactoring

```json
{
  "preset": "refactoring-council",
  "agents": ["researcher", "planner", "executor", "reviewer"],
  "use_when": "Large-scale refactoring, module extraction, pattern migration",
  "typical_flow": "Manager → Researcher → Manager → Planner (incremental waves) → Manager → Executor (wave by wave) → Manager → Reviewer → Manager (close)"
}
```

### Audit Council (4 agents) — Comprehensive audit

```json
{
  "preset": "audit-council",
  "agents": ["security-auditor", "performance-auditor", "architecture-auditor", "synthesizer"],
  "use_when": "Full system audit, pre-launch review, compliance check",
  "typical_flow": "Manager assigns all auditors in parallel → Manager → Synthesizer combines all findings → Manager (report)"
}
```

---

## Part 6: Manager Role Specification 🎯

The Manager is NOT just another role — it's the **brain** of the council. Here is the exhaustive specification:

### Manager Initialization Checklist

```
BEFORE starting any council work, the Manager MUST:

□ 1. Load MEMORY.md (project brain)
□ 2. Load or create Memory Module (memory/*.md files)
□ 3. Read handoffs/LATEST.md (last session context)
□ 4. Read any existing council state (council.json)
□ 5. Understand the full objective
□ 6. Select appropriate council preset
□ 7. Define quality gates for each agent
□ 8. Create initial task board
```

### Manager's Decision Framework

When routing work, the Manager asks:

```
1. WHAT was just completed?
   → Read the handoff/message carefully

2. WHAT does the Memory Module say about affected areas?
   → Check database-schemas.md for affected tables
   → Check api-routes.md for affected endpoints
   → Check service-graph.md for affected services
   → Check gotchas.md for known issues in those areas

3. WHO should handle this next?
   → Which specialist has the right expertise?
   → Is there a dependency that must be resolved first?

4. WHAT context does the next agent need?
   → Pull relevant sections from Memory Module
   → Include warnings from gotchas.md
   → Reference specific files and line numbers

5. WHAT does "done" look like for the next agent?
   → Define clear quality gates
   → Specify what must be in the handoff
```

### Manager's Quality Gates

The Manager enforces quality gates at each transition:

```markdown
## Quality Gates

### Research → Design
- [ ] All relevant code areas identified with file paths
- [ ] External research includes sources
- [ ] Risks documented with severity
- [ ] At least 2 approaches compared

### Design → Planning
- [ ] Architecture changes documented with diagrams
- [ ] Breaking changes identified
- [ ] Migration path defined
- [ ] Data flow documented

### Planning → Execution
- [ ] Tasks are atomic (max 30 minutes each)
- [ ] Dependencies between tasks are explicit
- [ ] Wave order is dependency-safe
- [ ] Estimated total effort is documented

### Execution → Review
- [ ] All tasks marked done with implementation notes
- [ ] Tests written (or justified why not)
- [ ] Files changed are documented
- [ ] No TODO/FIXME left unexplained

### Review → Close
- [ ] All critical/high issues resolved
- [ ] Test suite passes
- [ ] Memory Module updated with new information
- [ ] DECISIONS.md updated with key decisions
```

### Manager's Guidance Protocol

When a sub-agent escalates a problem, the Manager:

```
1. READ the escalation message carefully
2. CONSULT the Memory Module for context:
   - Has this area been problematic before? (gotchas.md)
   - What patterns exist? (patterns.md)
   - What are the dependencies? (service-graph.md)
3. PROVIDE guidance with specifics:
   - Reference exact files, functions, tables
   - Explain the "why" from the architecture context
   - Suggest a concrete approach
4. DECIDE whether to:
   a. Let the same agent continue with guidance
   b. Route to a different specialist
   c. Create a new task for investigation
5. WRITE a guidance message to the agent
```

---

## Part 7: Sub-Agent Role Specifications 🔧

### 🔬 Researcher

**Activation:** Manager routes a research task

**What the Researcher does:**
1. Reads the Manager's routing message (includes Memory Module context)
2. Investigates the codebase in the areas specified
3. Researches external documentation/best practices
4. Produces evidence-backed findings
5. Writes a handoff message to the Manager

**Researcher Handoff Template:**
```markdown
# 🔬 Research Handoff

## Summary
[3-5 sentences of key findings]

## Codebase Findings
### Area 1: [Module/Component]
- **Location:** `path/to/file.ts:L45-L120`
- **Current behavior:** [What it does now]
- **Relevant patterns:** [What patterns it uses]
- **Dependencies:** [What depends on it]
- **Concerns:** [Any issues found]

### Area 2: [Module/Component]
[Same structure...]

## External Research
- **Option A:** [Approach with sources]
- **Option B:** [Approach with sources]
- **Recommendation:** [Which and why]

## Risks
| Risk | Severity | Mitigation |
|------|----------|-----------|
| [Risk 1] | 🔴 Critical | [Mitigation] |
| [Risk 2] | 🟡 Medium | [Mitigation] |

## Files of Interest
- `path/to/file.ts` — [Why it matters]
- `path/to/other.ts` — [Why it matters]
```

### 📐 Architect

**Activation:** Manager routes a design task (usually after research)

**What the Architect does:**
1. Reads the Researcher's handoff (via Manager)
2. Reads relevant Memory Module files (schemas, routes, services)
3. Designs the solution architecture
4. Documents interfaces, data flows, and patterns
5. Identifies breaking changes and migration needs
6. Can peer-communicate with Researcher for clarification
7. Writes a handoff message to the Manager

**Architect Handoff Template:**
```markdown
# 📐 Architecture Handoff

## Design Overview
[Architecture description with rationale]

## Data Model Changes
### New Tables
[Schema definitions with columns, types, indexes, RLS]

### Modified Tables
[Column additions/modifications with migration approach]

### Relationships
[New relationships between entities]

## API Changes
### New Endpoints
| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| ... | ... | ... | ... |

### Modified Endpoints
[What changes and backward compatibility impact]

## Service Layer Changes
[New services, modified services, dependency changes]

## Component/UI Changes (if applicable)
[New components, modified components, state changes]

## Migration Strategy
[Step-by-step migration plan, rollback plan]

## Breaking Changes
[List of breaking changes with impact assessment]

## Decision Record
**Decision:** [What was decided]
**Alternatives Considered:** [What was rejected and why]
**Trade-offs:** [What we gain vs. what we lose]
```

### 📋 Planner

**Activation:** Manager routes a planning task (usually after architecture)

**What the Planner does:**
1. Reads the Architect's handoff (via Manager)
2. Decomposes the design into atomic tasks
3. Identifies task dependencies
4. Groups tasks into execution waves
5. Creates individual task files
6. Updates the task board
7. Writes a handoff message to the Manager

### ⚙️ Executor

**Activation:** Manager routes an implementation task

**What the Executor does:**
1. Reads the Planner's task breakdown (via Manager)
2. Reads relevant Memory Module files for context
3. Implements tasks in wave order
4. Runs tests after each task
5. Updates task status on the board
6. Can peer-communicate with Architect for design clarification
7. Can escalate blockers to Manager
8. Writes a handoff message to the Manager when wave is complete

### 🔍 Reviewer

**Activation:** Manager routes a review task (usually after execution)

**What the Reviewer does:**
1. Reads ALL previous handoffs for full context
2. Reviews code changes against the architecture design
3. Checks for security, performance, and correctness
4. Runs the full test suite
5. Can peer-communicate with Executor for clarification
6. Can peer-communicate with Architect for architecture concerns
7. Produces a review report with severity-based feedback
8. Writes a handoff message to the Manager

---

## Part 8: Task Board (`BOARD.md`) 📋

```markdown
# 📋 Council Board: [council_name]
> 🎯 Objective: [objective]
> 🎛️ Preset: [preset name]
> 📊 Status: [active | paused | complete]
> 🎯 Current Agent: [emoji name]
> 📬 Messages: [N]
> ⏱️ Last Updated: [DATE]

## 💎 Council Members
| Role | Agent | Status | Current Task |
|------|-------|--------|-------------|
| 🎯 Manager | manager | active | Orchestrating |
| 🔬 Research | researcher | idle | — |
| 📐 Architecture | architect | idle | — |
| 📋 Planning | planner | idle | — |
| ⚙️ Execution | executor | idle | — |
| 🔍 Review | reviewer | idle | — |

## 🔴 Blocked
- [ ] #003 — Write OAuth2 tests (blocked by #002)

## 🟡 In Progress
- [ ] #002 — Implement token refresh logic

## 🟢 Done
- [x] #001 — Research OAuth2 providers
- [x] #004 — Update database schema

## 📬 Recent Routing
| # | From | To | Type | Summary |
|---|------|----|------|---------|
| 5 | ⚙️ executor | 🎯 manager | escalation | RLS conflict on sessions table |
| 4 | 🎯 manager | ⚙️ executor | routing | Start implementation wave 1 |
| 3 | 📋 planner | 🎯 manager | handoff | 6 tasks created in 2 waves |

## 📊 Progress
[██████████░░░░░░░░░░] 40% — 2/5 tasks complete
```

---

## Part 9: How to Use 🚀

### Starting a Council Session

Tell the agent:
```
Start a council session for: [describe the objective]
```

The agent will:
1. Enter **Manager** role
2. Check for existing Memory Module (create if missing)
3. Analyze the objective
4. Select the appropriate council preset
5. Create the council directory structure
6. Begin routing to the first agent

### During the Session

The agent automatically switches between Manager and sub-agent roles. You can:

```
# Let the council run autonomously
Continue the council session

# Check status
Show the council board

# Intervene as the Manager
As manager, route this to the architect instead

# Add context
Manager note: the client requested OAuth2 specifically, not SAML

# Pause the session
Pause the council session
```

### Resuming a Session

If a council session spans multiple conversations:
```
Resume the council session
```

The agent will:
1. Read `council.json` for current state
2. Read `MEMORY.md` + latest handoff
3. Read the last message in `messages/`
4. Continue from where it left off

### Multi-Session Councils

For complex features spanning multiple conversations:
- The Memory Module provides full project context instantly
- `council.json` tracks exactly where the council is
- Messages preserve the full communication history
- The Manager always knows the full picture

---

## Part 10: Integration with Persistent Memory Skill 🔗

The Council and Persistent Memory work together:

```
Persistent Memory (MEMORY.md):
  └── Provides project brain for Manager initialization
  └── Updated at end of council session with decisions + outcomes

Memory Module (memory/*.md):
  └── Deep intelligence files created/updated by Manager
  └── Read by all agents for context
  └── Survives across council sessions

Council State (council/):
  └── Active council configuration + messages
  └── Cleaned up after council closes (archived)
  └── Board preserved as historical record
```

**Session Flow:**
```
1. Session starts → Agent reads MEMORY.md (persistent memory)
2. Council starts → Manager reads memory/*.md (Memory Module)
3. Council runs → Messages + handoffs accumulate
4. Council ends → Manager updates MEMORY.md with outcomes
5. Session ends → Agent writes handoffs/LATEST.md
```

---

## Anti-Shortcut Rules 🚫

```
1. NEVER skip the Memory Module — it's the foundation of everything.
   Rationalization: "I already know this codebase."
   Rebuttal: You don't. Scan it. Document it. The next session won't know.

2. NEVER let one agent do everything — that defeats the council.
   Rationalization: "It's faster if I just implement it directly."
   Rebuttal: Speed ≠ Quality. The council catches what solo agents miss.

3. NEVER skip the Manager routing step — every handoff goes through Manager.
   Rationalization: "The next agent is obvious."
   Rebuttal: The Manager adds context from the Memory Module. That context catches bugs.

4. NEVER skip peer communication when you need clarification.
   Rationalization: "I'll figure it out myself."
   Rebuttal: Wrong assumptions compound. Ask the specialist.

5. NEVER close the council without the Reviewer.
   Rationalization: "The code works, tests pass."
   Rebuttal: Working code ≠ correct code. The Reviewer catches integration risk.

6. NEVER leave the Memory Module outdated after significant changes.
   Rationalization: "I'll update it later."
   Rebuttal: Later never comes. Update it NOW while context is fresh.
```

## Common Rationalizations and Rebuttals

| Rationalization | Rebuttal |
|:---|:---|
| "This is too small for a council" | Use the Rapid Council (3 agents). Even small changes benefit from research → execute → review. |
| "I know the codebase well enough" | Prove it. Can you name every table, every API endpoint, every service dependency from memory? The Memory Module can. |
| "Sequential is too slow" | The council prevents re-work. One hour of research saves ten hours of debugging. |
| "The Memory Module is too much work" | It's created once, updated incrementally. It saves exponentially more time than it costs. |
| "Messages are overhead" | Messages are the evidence trail. When something breaks, they tell you exactly what was decided and why. |

---

## Iron Questions ⚔️

Before closing any council session, the Manager MUST answer:

```
1. Was the Memory Module consulted before every routing decision?
2. Did every agent receive relevant context from the Memory Module?
3. Were all escalations resolved with specific guidance?
4. Did peer communication happen where specialists needed alignment?
5. Were quality gates enforced at every phase transition?
6. Is the task board accurate and up-to-date?
7. Has the Memory Module been updated with new schemas/routes/services?
8. Has DECISIONS.md been updated with key decisions?
9. Has MEMORY.md been updated with the council outcomes?
10. Can the next session resume without losing any context?
```

---

## Red Flags 🚩

🔴 **CRITICAL:**
- Memory Module doesn't exist and wasn't created before starting
- Manager routing without consulting Memory Module context
- Sub-agent writing code without reading Memory Module
- No reviewer in the council
- Council closing without updating MEMORY.md

🟠 **HIGH:**
- Escalation received but Manager didn't check gotchas.md
- Peer communication happening between agents not in each other's `can_talk_to` list
- Tasks not atomic (> 30 minutes estimated)
- Quality gates not checked before phase transition

🟡 **MEDIUM:**
- Task board not updated after task completion
- Messages missing structured format
- Memory Module not updated after schema changes
- Handoffs missing "Watch Out For" section

🟢 **LOW:**
- Council preset not documented in council.json
- Routing log not maintained
- Status messages infrequent during long tasks

---

## Agent-Specific Setup

### Antigravity (Gemini)
Use the `/team-session` workflow in `.agent/workflows/`. The workflow triggers Memory Module initialization and council formation.

### Cursor
The `team-protocol.mdc` rule in `.cursor/rules/` activates council behavior. Memory Module files are read via `@file` references.

### Claude Code
Use the `/team` command in `.claude/commands/`. Supports multi-instance (actual parallel agents via tmux) or single-instance (sequential role-switching with council protocol).

---

## Best Practices ✅

✅ **Do** create the Memory Module FIRST — before any council work
✅ **Do** keep MEMORY.md under 300 lines — detail lives in memory/ files
✅ **Do** have the Manager provide specific Memory Module context in every routing
✅ **Do** use peer communication for quick specialist-to-specialist alignment
✅ **Do** escalate to Manager when stuck — don't guess
✅ **Do** update the task board in real-time
✅ **Do** enforce quality gates at every phase transition
✅ **Do** update the Memory Module after significant changes
✅ **Do** write thorough handoff documents with "Watch Out For" sections
✅ **Do** include file paths and line numbers in all technical references
✅ **Do** commit `.planning/` to version control (except secrets)

---

## Part 11: Operational Protocols 🔧

### Message Numbering Algorithm

All messages go to `.planning/council/messages/msg-NNN.md`:

```
1. List all files: .planning/council/messages/msg-*.md
2. Extract NNN from each filename as integers
3. Find the highest NNN (or 0 if no messages exist)
4. New message number = highest + 1
5. Format with zero-padding: msg-001.md, msg-002.md, etc.

Example:
- Existing: msg-001.md, msg-002.md, msg-003.md
- Next message: msg-004.md
```

### Handoff Naming Convention

Handoffs go to `.planning/council/handoffs/`:

```
Format: handoff-{NNN}-{agent-name}.md

Where:
- NNN = sequential number (matching message that triggered the handoff)
- agent-name = the agent that produced the handoff

Examples:
- handoff-001-researcher.md
- handoff-002-architect.md
- handoff-003-executor.md
```

### Task File Format

Tasks go to `.planning/council/tasks/`:

```markdown
# Task #NNN: [Title]

## Status
- [x] Assigned to: ⚙️ executor
- [ ] In progress
- [ ] Complete
- [ ] Blocked

## Description
[What needs to be done]

## Files to Modify
- `path/to/file.ts` — [what changes]
- `path/to/other.ts` — [what changes]

## Dependencies
- Depends on: #[task-id] (or "None")
- Blocks: #[task-id]

## Verification
[How to confirm this task is done correctly]

## Effort Estimate
[S/M/L with time estimate]

## Completion Notes
[Filled in when task is marked complete]
```

### Staleness Detection Protocol

The Memory Module is considered stale when:

```
1. Check last modified timestamp of each file in .planning/memory/
2. Calculate age = (current time) - (file modified time)
3. Staleness threshold = 48 hours (configurable)

IF any memory file age > threshold:
  → Memory Module is STALE
  → Manager MUST refresh affected files before council work

Staleness check order (most important first):
1. database-schemas.md — Schema changes break everything
2. api-routes.md — Route changes affect integration
3. service-graph.md — Service dependencies affect design
4. codebase-map.md — Structure changes affect navigation
5. frontend-map.md — UI changes (lower priority)
6. tech-stack.md — Rarely changes (lowest priority)
```

### Council Resume Protocol

When resuming a paused or interrupted council:

```
1. READ council.json
   - Check status (active, paused, completed)
   - Get current_agent
   - Get last message number

2. CHECK for unhandled items:
   a. Read the last message in messages/
   b. If type is "escalation" or "question" AND no response exists:
      → Handle this first before continuing
   c. If type is "handoff" AND no routing decision followed:
      → Manager must make routing decision

3. CHECK for orphaned tasks:
   - Read BOARD.md
   - Find tasks with status "in-progress" but no assigned agent
   → Reassign or reset to "todo"

4. CHECK Memory Module staleness:
   - If stale, refresh before continuing
   - Update MEMORY.md with refresh note

5. DETERMINE recovery action:
   a. If last action was Manager routing → sub-agent should execute
   b. If last action was sub-agent handoff → Manager should route
   c. If last action was escalation → Manager should respond
   d. If unclear → Ask user for clarification
```

### Error Recovery Protocol

| Error | Symptoms | Recovery |
|-------|----------|----------|
| **council.json corrupted** | JSON parse error | Recreate from BOARD.md + messages/. Restore routing_log from message headers. |
| **BOARD.md out of sync** | Tasks don't match council.json | Regenerate BOARD.md from tasks/ files + council.json state |
| **Missing message** | Gap in msg-NNN sequence | Accept the gap. Continue from highest number. |
| **Orphaned task** | In-progress but no agent working | Reset to "todo" and notify Manager |
| **Memory Module missing** | memory/ directory empty | Re-run Memory Module generation before continuing |
| **Memory Module partial** | Some files missing | Generate only missing files |
| **Agent stuck** | No message in >10 minutes | Manager sends status request message |
| **Circular routing** | Same agent routed 3+ times without progress | Manager escalates to user with context |

### Council Archival Protocol

When closing a council:

```
1. UPDATE council.json:
   - status: "completed"
   - completed_at: [timestamp]
   - summary: [one-paragraph summary]

2. ARCHIVE the council:
   - Create: .planning/council/_archive/[council-name]-[date]/
   - Move all files from council/ to archive (except _archive/ itself)
   - Keep BOARD.md as historical record

3. UPDATE persistent memory:
   - Update MEMORY.md with council outcomes
   - Update DECISIONS.md with key decisions made
   - Update context/architecture.md if architecture changed
   - Update context/patterns.md if new patterns established
   - Update context/gotchas.md if new issues discovered

4. REFRESH Memory Module:
   - If database schemas changed → update database-schemas.md
   - If routes changed → update api-routes.md
   - If services changed → update service-graph.md

5. WRITE handoff for next session:
   - Create handoffs/LATEST.md with council summary
```

### Parallel Execution Protocol (Audit Council Only)

The Audit Council runs auditors in **pseudo-parallel**:

```
1. Manager assigns all three auditors simultaneously:
   - Create msg-001.md targeting security-auditor
   - Create msg-002.md targeting performance-auditor
   - Create msg-003.md targeting architecture-auditor
   - Update BOARD.md to show all three as "in-progress"

2. Execute auditors SEQUENTIALLY (pseudo-parallel):
   - Since we're one agent, run them one at a time
   - Each writes their handoff independently
   - No inter-auditor communication needed

3. Track completion in council.json:
   - parallel_batch: [security, performance, architecture]
   - completed: [security] (updated as each finishes)

4. When ALL auditors complete:
   - Manager reads all three handoffs
   - Manager routes to Synthesizer with combined findings
```

### Quality Gate Checking Protocol

Manager, before routing to next phase:

```
1. READ the incoming handoff carefully

2. CHECK each gate item for the current transition:
   - Research → Design: Areas identified? Risks documented? Alternatives compared?
   - Design → Planning: Breaking changes? Migration path? Data flow?
   - Planning → Execution: Tasks atomic? Dependencies explicit? Estimates provided?
   - Execution → Review: Tasks done? Tests pass? No unexplained TODOs?
   - Review → Close: Critical issues resolved? Memory updated?

3. IF any gate FAILS:
   - Write message back to sender with feedback
   - Specify exactly what's missing
   - Do NOT advance to next phase

4. IF all gates PASS:
   - Log gate passage in routing message
   - Include context for next agent
   - Proceed with routing

5. UPDATE routing_log in council.json:
   - routing_log.push({
       from: [previous agent],
       to: [next agent],
       gate_check: "passed",
       timestamp: [now]
     })
```

### Watchdog Protocol

For detecting stuck agents:

```
When routing to a sub-agent, note the timestamp.

IF no response message within 10 minutes (configurable):
1. Manager writes a status request message:
   Type: request
   To: [stuck agent]
   Content: "Status check: Please provide a progress update."

IF no response within 5 more minutes:
2. Manager escalates to user:
   "Agent [name] appears stuck on [task].
   Last activity: [timestamp].
   Options: (a) continue waiting, (b) reset and re-route, (c) provide guidance"
```

---

## Token Efficiency Estimates

Approximate token overhead for council sessions:

| Component | Size | Tokens (est.) |
|-----------|------|---------------|
| MEMORY.md | ~300 lines | 1,500-3,000 |
| Memory Module (all files) | ~600 lines | 3,000-6,000 |
| council.json | ~50 lines | 250-500 |
| BOARD.md | ~50 lines | 250-500 |
| Average message | ~30 lines | 150-300 |
| Average handoff | ~100 lines | 500-1,000 |

**Per-routing overhead:**
- Manager reads: MEMORY.md + relevant memory/*.md + last message + BOARD.md
- Estimated: 2,000-4,000 tokens per routing decision

**Session overhead:**
- Initial load (Manager init): ~5,000-10,000 tokens
- Each routing cycle: ~2,000-4,000 tokens
- Full council (5 agents, 5 cycles): ~15,000-30,000 tokens total

> ⚠️ Token counts vary significantly based on project size, content density, and how much context is included in routing messages.

---

## Comparison: Memory Module vs Persistent Memory

| Aspect | MEMORY.md (Persistent Memory) | memory/*.md (Memory Module) |
|--------|-------------------------------|----------------------------|
| **Purpose** | Session continuity | Codebase intelligence |
| **Scope** | Project overview, decisions, gotchas | Deep technical details |
| **Size** | ~300 lines max | ~600 lines across all files |
| **Who writes** | Any agent | Manager only |
| **When updated** | Every session end | Council sessions, after changes |
| **Read frequency** | Every session start | Council sessions only |
| **Content** | Summary, state, recent work | Schemas, routes, services, patterns |
| **Survives** | All sessions | All sessions |

**How they work together:**
1. Session starts → Agent reads MEMORY.md
2. Council starts → Manager reads memory/*.md
3. Council runs → Sub-agents get context from Manager's routing
4. Council ends → Manager updates memory/*.md with changes
5. Session ends → Agent updates MEMORY.md with council outcomes


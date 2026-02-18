# 🏁 Getting Started — Your First Project

> This guide explains **exactly** how to use Skills by Amrit from start to finish, whether you're building something new or adding features to an existing codebase.

---

## Which Path Are You On?

| I want to... | You need the... |
|:---|:---|
| Build something **from scratch** | 🟢 [Greenfield Path](#-greenfield--building-from-scratch) |
| Add a feature to an **existing codebase** | 🟡 [Brownfield Path](#-brownfield--existing-codebase) |
| Just do a quick one-off task | ⚡ [Quick Path](#-quick-path--one-off-tasks) |

---

## Install First (Both Paths)

```bash
npx skills-by-amrit add
```

The CLI auto-detects your AI agents and installs everything — skills, commands, workflows — to the right directories.

---

## 🟢 Greenfield — Building From Scratch

> You're starting a brand new project. No code exists yet.

### The Flow

```
/init-project → /discuss → /plan → /execute → /verify
```

### Step 1: `/init-project` — Set Up the AI's Notebook

**What you say:**
```
/init-project
```

**What happens in plain English:**

The AI creates a folder called `.planning/` in your project. Think of it as **the AI's notebook** where it keeps track of everything:

| File | What it is | Plain English |
|:---|:---|:---|
| `MEMORY.md` | Project brain | "What I know about this project" |
| `STATE.md` | Current position | "I'm on Phase 2, Plan 1, Task 3" |
| `config.json` | Your preferences | "User wants interactive mode, standard depth" |
| `ROADMAP.md` | Phase overview | "Phase 1: Auth, Phase 2: Dashboard, Phase 3: API" |
| `REQUIREMENTS.md` | What to build | "Must have: login, dashboard. Nice to have: dark mode" |
| `decisions/` | Decision log | "Chose PostgreSQL because X. Chose React because Y." |
| `handoffs/LATEST.md` | Session handoff | "Here's where I stopped, here's what the next session needs to know" |

**Under the hood:**
```bash
node planning-tools.cjs init
# Creates all the folders and files deterministically
# Not LLM-generated — it's a CLI tool, so the structure is guaranteed correct
```

The agent also asks you questions to understand what you're building:
- What's the project? (e.g., "A trading dashboard with real-time charts")
- What are the phases? (e.g., "Phase 1: Data pipeline, Phase 2: Charts, Phase 3: Alerts")
- What are the hard requirements?
- What's the tech stack?

**After this step:** The AI has a full notebook and knows your project scope. It's like onboarding a new developer — except it happens in 2 minutes.

---

### Step 2: `/discuss` — Lock Your Preferences Before Planning

**What you say:**
```
/discuss add user authentication
```

**What happens in plain English:**

Instead of the AI guessing what you want, it presents **multiple-choice questions** with its recommendation. You answer in one line.

**Example conversation:**

```markdown
## 📋 Discussion: User Authentication

I've identified 5 decisions we need to lock before planning.

---

### Q1: Auth Method 🔒

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Magic Links | Email-based, passwordless, simple UX |
| **B** | OAuth2 Social | Google/GitHub login, fast but 3rd-party dependency |
| **C** | Email + Password | Traditional, full control, more UI work |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Simplest UX, no password storage, good security

---

### Q2: Session Management 🗄️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | JWT (httpOnly cookies) | Stateless, scales well, secure |
| **B** | Server sessions (Redis) | Revocable, more server resources |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Standard for modern SPAs

---

### Q3: Auth Provider 🛠️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | Supabase Auth | Built-in if using Supabase, free tier |
| **B** | NextAuth.js | Flexible, many providers, Next.js native |
| **C** | Custom JWT | Full control, more work |
| **D** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: B** — Most flexible, great DX

---

### ⚡ Quick Answer

Answer all questions in one line:

> **All recommended:** `1A 2A 3B`
>
> **Example custom:** `1A 2A 3:"use Firebase Auth"`

**Your answer:**
```

**You respond:**
```
1A 2A 3A
```

**What the AI does with your answer:**
1. Creates a `CONTEXT.md` file with your locked decisions
2. Records the decision in the planning state
3. These decisions are now **locked** — the planner and executor cannot change them

**Why this matters:** Without this step, the AI would guess "OAuth2" when you wanted "magic links." You'd reject the plan, waste half the context window, and start over. This step prevents that.

---

### Step 3: `/plan` — Create a Small, Focused Plan

**What you say:**
```
/plan
```

**What happens in plain English:**

The AI creates an implementation plan with **2-3 tasks** (not 10). Each task has a strict format:

```markdown
## Plan: Implement Magic Link Authentication

### Task 1: Database + Auth Schema

<files>
- src/db/schema/auth.ts (CREATE)
- src/db/migrations/001_auth_tables.sql (CREATE)
</files>

<action>
Create the users table and magic_link_tokens table.
Use Supabase Auth SDK (locked decision Q3=A).
DON'T create a password field — we're using magic links (locked decision Q1=A).
</action>

<verify>
Run: npm run db:migrate
Check: Tables exist in database
Check: TypeScript types generate correctly
</verify>

<done>
- [ ] Users table exists with email, created_at, updated_at
- [ ] Magic link tokens table exists with token, user_id, expires_at
- [ ] Migration runs without errors
</done>
```

**Why only 2-3 tasks?** The AI's quality degrades as its context fills up. After ~100K tokens, it starts making mistakes. Small plans = high quality. If the feature needs 10 tasks, it creates 4 separate plans.

**Notice the `DON'T` instruction:** This directly comes from your locked decision in Step 2. The executor is forbidden from adding a password field.

---

### Step 4: `/execute` — Build It, Task by Task

**What you say:**
```
/execute
```

**What happens in plain English:**

The AI implements each task from the plan, one at a time:

1. **Read** the task from the plan file
2. **Write** the code (following the `<action>` instructions)
3. **Verify** it works (running the `<verify>` commands)
4. **Commit** atomically:
   ```
   git commit -m "feat(auth): add users and magic link tables"
   ```
5. **Advance state:**
   ```bash
   node planning-tools.cjs state advance-task
   ```
6. **Move to next task** (or stop if done)

**If something goes wrong** — say the migration doesn't work — there's a **deviation protocol**:

| Category | What Happened | What the AI Does |
|:---|:---|:---|
| **Cosmetic** | Typo in a comment | Fix silently, keep going |
| **Minor** | Need an extra import | Document it, keep going |
| **Moderate** | The approach doesn't work | **STOP and ask you** |
| **Major** | Fundamental design flaw | **STOP, go back to planning** |

**Every 3 tasks** there's a **checkpoint** — the AI saves its progress to `.planning/handoffs/LATEST.md`. If your session crashes or you come back tomorrow, the new session picks up exactly where you left off.

---

### Step 5: `/verify` — Prove It Actually Works

**What you say:**
```
/verify
```

**What happens in plain English:**

The AI validates the implementation against the plan:

- ✅ All planned files exist
- ✅ All `<done>` checklist items are true
- ✅ Tests pass (existing + new)
- ✅ Build succeeds
- ✅ The feature actually works

If something was missed, it runs a **gap closure** — a mini 1-2 task plan to fix the gap.

**The rule:** The AI is **not allowed** to say "done" without running verification. No exceptions. This is enforced by the `verification-before-completion` skill.

---

## 🟡 Brownfield — Existing Codebase

> You've got a project with existing code, patterns, and conventions. The AI needs to **learn** the codebase before touching anything.

### The Flow

```
/memory init → Codebase Mapping → /discuss → /plan → /execute → /verify
```

### Step 1: `/memory init` — Set Up the Notebook (Lightweight)

**What you say:**
```
/memory init
```

**What happens in plain English:**

Same as greenfield Step 1, but lighter. The AI creates the `.planning/` structure but **doesn't** ask you to define phases and requirements from scratch — your existing code IS the requirements.

```bash
node planning-tools.cjs init
```

**After this step:** The AI has its notebook, but it's empty. The next step fills it in.

---

### Step 2: Codebase Mapping — The AI Reads Your Code

**This happens automatically** — you don't need to run a command. The AI activates the `codebase-mapping` skill and scans:

| What it scans | What it writes down |
|:---|:---|
| File structure | "There's a `src/services/` folder with 12 service classes" |
| Tech stack | "Python 3.10, FastAPI, PostgreSQL, Redis" |
| Patterns | "Repository pattern for DB access, Strategy pattern for trading" |
| Conventions | "All functions have type hints, logging via `logger.info()`" |
| Known issues | "TODO in `api_client.py` about rate limiting" |
| Test structure | "pytest with fixtures in `conftest.py`, 85% coverage" |

All of this goes into `MEMORY.md`. Now the AI **knows** your project like a developer who's read every file.

**Why this matters:** Without this step, the AI would write a React component in a Vue project, or add raw SQL in a project that uses SQLAlchemy. Codebase mapping prevents pattern violations.

---

### Step 3: `/discuss` — Lock Decisions (Context-Aware)

**What you say:**
```
/discuss add user preferences feature
```

**What's different from greenfield:** The AI already knows your patterns from Step 2. So its questions and recommendations are based on your **actual codebase**, not generic advice:

```markdown
### Q1: Storage Approach 🗄️

| | Option | What It Means |
|:---:|:---|:---|
| **A** | New `preferences` table | Normalized, follows your existing table pattern |
| **B** | JSONB column on `users` | Flexible, but breaks your normalization convention |
| **C** | ✏️ Custom | Describe your preference |

> 🏆 **Recommended: A** — Your existing tables (orders, positions, signals)
> all follow the normalized pattern. This stays consistent.
```

Notice: the AI recommends Option A **because it matches your existing patterns**, not because it's generically "better."

**You answer:** `1A 2B 3A` → decisions locked.

---

### Steps 4-6: Same as Greenfield

The `/plan`, `/execute`, and `/verify` steps work the same way, but with one key addition:

The **`codebase-conformity` skill** activates during execution to ensure:
- New code follows the same patterns as existing code
- Naming conventions match
- Import styles match
- Test structure matches
- Error handling follows the same approach

**Example:** If your codebase uses `logger.error(f"Failed to {action}: {e}")` for error logging, the AI will use exactly that format — not `print(f"Error: {e}")` or `logging.exception(e)`.

---

## ⚡ Quick Path — One-Off Tasks

For small, self-contained tasks that don't need full planning:

```
/quick fix the typo in the README header
/quick add a .gitignore for Python
/quick update the copyright year to 2026
```

No planning, no discussion, no state management. Just do the thing.

---

## Key Differences: Greenfield vs Brownfield

| | 🟢 Greenfield | 🟡 Brownfield |
|:---|:---|:---|
| **First step** | `/init-project` (full setup with roadmap) | `/memory init` (lightweight) |
| **Context comes from** | Your answers to questions | AI scanning your existing code |
| **Patterns** | You define them | AI discovers existing patterns |
| **Planning** | Free to choose any approach | Must respect existing architecture |
| **Risk level** | Low (no code to break) | Higher (must be compatible) |
| **Extra skills** | `writing-plans`, `executing-plans` | + `codebase-mapping`, `codebase-conformity` |

---

## Where Does Memory Fit In?

Memory runs **automatically** at the start and end of every session:

```
SESSION START                    DURING SESSION                  SESSION END
┌────────────────────┐           ┌────────────────────────┐      ┌────────────────────┐
│ 1. Read MEMORY.md  │           │ 4. planning-tools.cjs  │      │ 8. Create session  │
│ 2. Read LATEST.md  │           │    tracks state changes│      │    log              │
│ 3. Read config.json│           │ 5. Decisions → log     │      │ 9. Write handoff   │
│    Full context!   │           │ 6. Blockers → flag     │      │ 10. Update memory  │
└────────────────────┘           └────────────────────────┘      └────────────────────┘
```

**This means:** You can close your editor, come back tomorrow, and the AI knows exactly where you left off. No re-explaining. No repeating decisions. It reads `MEMORY.md` and `LATEST.md` and continues from the checkpoint.

---

## Where Does `planning-tools.cjs` Fit In?

The `planning-tools.cjs` CLI is called **by the AI during execution**, not by you directly. It handles things LLMs are bad at — like reliably updating JSON files and tracking counters:

| When | What the AI calls | Why |
|:---|:---|:---|
| Project init | `node planning-tools.cjs init` | Creates `.planning/` structure deterministically |
| Each task completed | `node planning-tools.cjs state advance-task` | Tracks progress (Task 1 → Task 2) |
| Important decision | `node planning-tools.cjs state add-decision "..."` | Appends to decision log |
| Hit a blocker | `node planning-tools.cjs state add-blocker "..."` | Flags the blocker for review |
| Check progress | `node planning-tools.cjs progress` | Shows a text dashboard |
| Change preference | `node planning-tools.cjs config set mode auto` | Updates config.json |

**Why not let the AI edit these files directly?** Because LLMs make mistakes with structured data — they might accidentally delete a field in JSON, miscalculate a counter, or corrupt the format. The CLI does it reliably every time.

---

## What's Next?

- 📖 [Examples: Greenfield Walkthrough](examples-Getting-Started-Greenfield) — Full conversation transcript of a greenfield project
- 📖 [Examples: Brownfield Walkthrough](examples-Getting-Started-Brownfield) — Full conversation transcript of adding a feature to an existing project
- 💬 [The `/discuss` Command](examples-commands-discuss) — How MCQ decision capture works
- ⚙️ [The `/settings` Command](examples-commands-settings) — Configure mode, depth, and preferences
- 💾 [Persistent Memory](Skills-Agent-Intelligence) — Deep dive into the memory system

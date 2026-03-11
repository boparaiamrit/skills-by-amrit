# /orchestrate Command Examples

> Chain multiple specialist agents with structured handoffs for complex tasks.

## Usage

```
@/orchestrate [chain] [task-description]
```

## Predefined Chains

| Chain | Agents | Use Case |
|-------|--------|----------|
| `feature` | researcher, planner, executor, reviewer, verifier | New features |
| `bugfix` | debugger, planner, executor, verifier | Bug fixes |
| `refactor` | mapper, planner, executor, reviewer | Restructuring |
| `security` | mapper, investigator, reviewer | Security assessment |

## Examples

### Example 1: Feature Chain with 5 Agents

**You:**
```
@/orchestrate feature "Add Stripe webhook handler for subscription lifecycle events"
```

**What happens:**

**Agent 1 — Researcher:**
- Scans codebase for existing payment code, Stripe SDK usage, webhook patterns
- Finds: Express routes in `src/api/`, existing Stripe config in `src/config/stripe.ts`
- Handoff: "Found existing Stripe client, no webhook endpoint yet. Events needed: `customer.subscription.created`, `updated`, `deleted`. Recommend adding to existing `/api/billing/` route group."

**Agent 2 — Planner:**
- Reads researcher handoff, creates task breakdown
- Handoff: 4 tasks — webhook endpoint, signature verification, event router, subscription state sync
- Acceptance criteria: all 3 event types handled, idempotent processing, signature verified

**Agent 3 — Executor:**
- Implements the plan: creates `src/api/billing/webhooks.ts`, adds event handlers
- Handoff: 4 files created, 2 files modified, all tasks complete

**Agent 4 — Reviewer:**
- Reviews implementation for patterns, edge cases, security
- Handoff: "Missing idempotency key check on `subscription.updated`. Raw body parsing needed for signature verification — current JSON middleware will break it."

**Agent 5 — Verifier:**
- Runs tests, checks acceptance criteria
- Handoff: 12 tests pass, all 3 event types covered, idempotency fix verified

**Final Output:**
```markdown
## Orchestration Complete: Stripe webhook handler

**Chain:** feature
**Agents:** 5 agents executed
**Verdict:** SHIP

### Agent Results
| # | Agent | Status | Key Output |
|---|-------|--------|-----------|
| 1 | Researcher | Done | Found existing Stripe setup, mapped route structure |
| 2 | Planner | Done | 4 tasks, 3 acceptance criteria |
| 3 | Executor | Done | 4 files created, 2 modified |
| 4 | Reviewer | Done | Caught idempotency gap, raw body issue |
| 5 | Verifier | Done | 12 tests pass, all criteria met |

### Files Modified (Total)
- `src/api/billing/webhooks.ts` (new)
- `src/api/billing/webhooks.test.ts` (new)
- `src/config/stripe.ts` (modified)
- `src/middleware/rawBody.ts` (new)
- `src/app.ts` (modified — added webhook route)
```

### Example 2: Bugfix Chain

```
@/orchestrate bugfix "Users lose cart items after OAuth redirect"
```

Runs: debugger (root cause) -> planner (fix strategy) -> executor (implement) -> verifier (confirm fix)

### Example 3: Security Chain

```
@/orchestrate security "Audit the authentication module"
```

Runs: mapper (map auth surface) -> investigator (find vulnerabilities) -> reviewer (severity assessment)

---

## Related Commands

- `/team` — Full multi-agent council with task boards
- `/plan` — Manual planning without agent chain
- `/verify` — Standalone verification

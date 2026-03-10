# PLAN.md Template

Template for `.planning/phases/XX-name/{phase}-{plan}-PLAN.md` -- executable phase plans.

---

## File Template

```markdown
---
phase: {{PHASE_NAME}}
plan: {{PLAN_NUMBER}}
type: execute
wave: {{WAVE_NUMBER}}
autonomous: true
depends_on: []
requirements: []

must_haves:
  truths: []
  artifacts: []
  key_links: []
---

<objective>
[What this plan accomplishes]

Purpose: [Why this matters for the project]
Output: [What artifacts will be created]
</objective>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

[Relevant source files:]
@src/path/to/relevant.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: [Action-oriented name]</name>
  <description>[What this task does and why]</description>
  <file_changes>
    - path/to/file.ext (create | modify | delete)
    - another/file.ext (create | modify | delete)
  </file_changes>
  <action>[Specific implementation -- what to do, how to do it, what to avoid and WHY]</action>
  <verification>[Command or check to prove it worked]</verification>
  <done_when>[Measurable acceptance criteria -- observable behavior, not "code written"]</done_when>
</task>

<task type="auto">
  <name>Task 2: [Action-oriented name]</name>
  <description>[What this task does and why]</description>
  <file_changes>
    - path/to/file.ext (create | modify | delete)
  </file_changes>
  <action>[Specific implementation]</action>
  <verification>[Command or check]</verification>
  <done_when>[Acceptance criteria]</done_when>
</task>

<task type="auto">
  <name>Task 3: [Action-oriented name]</name>
  <description>[What this task does and why]</description>
  <file_changes>
    - path/to/file.ext (create | modify | delete)
  </file_changes>
  <action>[Specific implementation]</action>
  <verification>[Command or check]</verification>
  <done_when>[Acceptance criteria]</done_when>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] [Specific test command]
- [ ] [Build/type check passes]
- [ ] [Behavior verification]
</verification>

<success_criteria>
- All tasks completed
- All verification checks pass
- No errors or warnings introduced
- [Plan-specific criteria]
</success_criteria>

<notes>
[Any additional context, warnings, or implementation hints for the executor]
</notes>
```

---

## Frontmatter Fields

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `phase` | Yes | string | Phase identifier (e.g., `01-foundation`) |
| `plan` | Yes | string | Plan number within phase (e.g., `01`, `02`) |
| `type` | Yes | string | `execute` for standard plans, `tdd` for TDD plans |
| `wave` | Yes | number | Execution wave (1, 2, 3...). Pre-computed at plan time. |
| `autonomous` | Yes | boolean | `true` if no checkpoints, `false` if requires user interaction |
| `depends_on` | Yes | array | Plan IDs this plan requires (e.g., `["01-01"]`) |
| `requirements` | Yes | array | Requirement IDs from ROADMAP this plan addresses |
| `must_haves` | Yes | object | Goal-backward verification criteria |
| `must_haves.truths` | Yes | array | Observable behaviors that must be true |
| `must_haves.artifacts` | Yes | array | Files that must exist with real implementation |
| `must_haves.key_links` | Yes | array | Critical connections between artifacts |

## Task Anatomy

Every task MUST have all five elements:

| Element | Purpose | Example |
|---------|---------|---------|
| `description` | What and why | "Create user model with email/password fields for authentication" |
| `file_changes` | Which files, what action | `src/models/user.ts (create)` |
| `verification` | Proof it works | `npm run build && npm test -- --grep "user model"` |
| `done_when` | Observable completion | "User model exports TypeScript interface, tests pass" |
| `action` | How to implement | Specific steps, patterns to use, pitfalls to avoid |

**Bad tasks (missing elements):**
```xml
<task type="auto">
  <name>Set up authentication</name>
  <action>Add auth to the app</action>
</task>
```

**Good tasks (complete):**
```xml
<task type="auto">
  <name>Task 1: Create JWT authentication middleware</name>
  <description>Add Express middleware that validates JWT tokens on protected routes</description>
  <file_changes>
    - src/middleware/auth.ts (create)
    - src/types/express.d.ts (modify -- add user to Request)
  </file_changes>
  <action>
    Create auth middleware using jose library (NOT jsonwebtoken -- jose is ESM-native).
    Extract token from Authorization header (Bearer scheme).
    Verify with HMAC-SHA256. Attach decoded user to req.user.
    Return 401 for missing/invalid tokens.
  </action>
  <verification>npm run build && npm test -- --grep "auth middleware"</verification>
  <done_when>Protected routes return 401 without token, 200 with valid token</done_when>
</task>
```

## Scope Guidance

- **2-3 tasks per plan** (up to 5 when tightly coupled)
- ~50% context usage maximum
- Prefer vertical slices over horizontal layers
- Split when: different subsystems, >3 tasks, risk of context overflow

## Parallel Execution

Plans in the same wave run in parallel. Wave assignment rules:

- **Wave 1**: Plans with no dependencies and no file conflicts
- **Wave 2+**: Plans that depend on wave 1 results
- **File conflicts**: Two plans modifying the same file cannot be in the same wave

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PHASE_NAME}}` | Roadmap | Phase identifier (e.g., `01-foundation`) |
| `{{PLAN_NUMBER}}` | Planner | Plan number within phase |
| `{{WAVE_NUMBER}}` | Planner | Execution wave for parallelization |

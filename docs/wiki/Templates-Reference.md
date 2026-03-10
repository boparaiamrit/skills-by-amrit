# 📝 Templates Reference

> 11 structured templates for planning documents, state management, and project artifacts

Templates provide consistent structure for all planning artifacts. Commands like `/plan`, `/init-project`, `/discuss`, and `/execute` use these templates internally to generate structured output.

---

## Template Inventory

| Template | Format | Purpose |
|:---|:---:|:---|
| `plan.md` | Markdown | PLAN.md structure with `<files>`, `<action>`, `<verify>`, `<done>` blocks |
| `context.md` | Markdown | CONTEXT.md for locked decisions from `/discuss` |
| `project.md` | Markdown | PROJECT.md with project name, tech stack, objectives |
| `requirements.md` | Markdown | REQUIREMENTS.md with functional and non-functional requirements |
| `roadmap.md` | Markdown | ROADMAP.md with phase-ordered implementation roadmap |
| `state.md` | Markdown | STATE.md for current project state and progress tracking |
| `research.md` | Markdown | Research report structure with findings and recommendations |
| `summary.md` | Markdown | Session summary and handoff document |
| `verification.md` | Markdown | Verification report with checklist and gap analysis |
| `config-defaults.json` | JSON | Default configuration values for project settings |
| `model-profiles.json` | JSON | AI model profiles with capabilities and token limits |

---

## How Templates Work

Templates are used by the CLI tool (`planning-tools.cjs`) and commands during initialization and planning:

1. **`/init-project`** uses `project.md`, `requirements.md`, `roadmap.md`, `state.md`, and `config-defaults.json` to scaffold the `.planning/` directory
2. **`/plan`** uses `plan.md` to structure the generated plan with consistent task format
3. **`/discuss`** uses `context.md` to record locked decisions
4. **`/verify`** uses `verification.md` to structure the verification report
5. **`/research`** uses `research.md` to format research findings

Templates are not installed to a user-visible directory — they are bundled with the package and used internally by commands and the CLI.

---

## Plan Template Structure

The plan template enforces a strict per-task format that the executor can follow deterministically:

```markdown
## Plan: [Feature Name]

### Task 1: [Task Title]

<files>
- path/to/file.ts (CREATE | MODIFY | DELETE)
</files>

<action>
What to implement. References locked decisions from CONTEXT.md.
Explicit DON'T instructions from locked decisions.
</action>

<verify>
Commands to run to verify the task.
Checks to perform.
</verify>

<done>
- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
</done>
```

---

## Context Template Structure

The context template records locked decisions from `/discuss` sessions:

```markdown
# Context: [Feature Name]

## Locked Decisions

| # | Question | Choice | Rationale |
|---|----------|--------|-----------|
| 1 | Auth method | Magic Links (A) | Simplest UX, no password storage |
| 2 | Session management | JWT httpOnly (A) | Standard for modern SPAs |

## Constraints
- DO: [What the executor must do]
- DON'T: [What the executor must not do]
```

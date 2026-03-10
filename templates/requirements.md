# REQUIREMENTS.md Template

Template for `.planning/REQUIREMENTS.md` -- checkable requirements that define "done."

---

## File Template

```markdown
---
project_name: "{{PROJECT_NAME}}"
defined_at: "{{CREATED_AT}}"
core_value: "{{CORE_VALUE}}"
---

# Requirements: {{PROJECT_NAME}}

**Defined:** {{CREATED_AT}}
**Core Value:** {{CORE_VALUE}}

## Table Stakes (Must-Have)

Requirements that MUST ship. Without these, the project fails its core value.

### [Category 1]

- [ ] **[CAT]-01**: [Requirement description]
  - *Acceptance:* [How to verify this is done -- observable behavior]
  - *Priority:* P0

- [ ] **[CAT]-02**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P0

### [Category 2]

- [ ] **[CAT]-01**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P0

## Features (Should-Have)

Requirements that deliver significant value. Ship if possible, defer if needed.

### [Category]

- [ ] **[CAT]-01**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P1

- [ ] **[CAT]-02**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P1

## Stretch Goals (Nice-to-Have)

Enhancements that improve the product but are not critical. Backlog candidates.

### [Category]

- **[CAT]-01**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P2

- **[CAT]-02**: [Requirement description]
  - *Acceptance:* [How to verify]
  - *Priority:* P2

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| [Feature] | [Why excluded] |
| [Feature] | [Why excluded] |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| ID | Requirement | Phase | Status |
|----|-------------|-------|--------|
| [CAT]-01 | [Brief description] | Phase [N] | Pending |
| [CAT]-02 | [Brief description] | Phase [N] | Pending |

**Coverage:**
- Table Stakes: [X] total, [Y] mapped
- Features: [X] total, [Y] mapped
- Unmapped: [Z] (must be zero before execution)

---
*Requirements defined: {{CREATED_AT}}*
*Last updated: {{CREATED_AT}} after initial definition*
```

---

## Guidelines

**Requirement Format:**
- ID: `[CATEGORY]-[NUMBER]` (AUTH-01, CONTENT-02, SOCIAL-03)
- Description: User-centric, testable, atomic
- Acceptance criteria: Observable behavior, not implementation detail
- Priority: P0 (table stakes), P1 (features), P2 (stretch goals)

**Categories:**
- Derive from project domain
- Keep consistent with domain conventions
- Typical: Authentication, Content, Social, Notifications, Payments, Admin, API, Infrastructure

**Priority Tiers:**
- **Table Stakes (P0):** Project fails without these. Non-negotiable.
- **Features (P1):** Significant value. Ship if possible.
- **Stretch Goals (P2):** Nice enhancements. Backlog if time runs out.

**Traceability:**
- Empty initially, populated during roadmap creation
- Each requirement maps to exactly one phase
- Unmapped requirements = roadmap gap (must be zero)

**Status Values:**
- Pending: Not started
- In Progress: Phase is active
- Complete: Requirement verified
- Blocked: Waiting on external factor

## Evolution

**After each phase completes:**
1. Mark covered requirements as Complete
2. Update traceability status
3. Note any requirements that changed scope

**After roadmap updates:**
1. Verify all table stakes still mapped
2. Add new requirements if scope expanded
3. Move requirements between tiers if priorities shift

## Variables

| Variable | Source | Description |
|----------|--------|-------------|
| `{{PROJECT_NAME}}` | PROJECT.md | Name of the project |
| `{{CREATED_AT}}` | System | ISO date of creation |
| `{{CORE_VALUE}}` | PROJECT.md | The ONE thing that matters most |

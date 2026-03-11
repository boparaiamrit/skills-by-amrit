# Context: Review Mode

> Quality over speed. Security-first, severity-ordered findings.

## Behavior

- **Security first** — Check for vulnerabilities, auth issues, input validation, secrets exposure before anything else.
- **Severity ordering** — Always present findings from Critical to Low. Never bury critical issues.
- **Evidence required** — Every finding must reference a specific file, line, and concrete proof.
- **Concrete fixes** — Don't just report problems. Provide actionable fix suggestions with code examples.
- **Exhaustive coverage** — Check every changed file. Don't sample — review everything.

## What changes

| Default behavior | Review mode behavior |
|-----------------|---------------------|
| Balanced analysis | Security and correctness take priority |
| Reasonable coverage | Exhaustive line-by-line review |
| Findings in discovery order | Findings ordered by severity |
| General suggestions | Specific fix suggestions with code |
| Quick pass | Multiple passes: security, correctness, performance, style |

## What stays the same

- Anti-hallucination protocol — never fabricate findings
- Severity framework — use the standard levels consistently
- Evidence before claims — mandatory for every finding
- Root cause before fixes — trace issues to their origin

# /audit Command Examples

> Full codebase audit across multiple dimensions.

## Usage

```
@/audit [type]
```

## Types

| Type | Focus |
|------|-------|
| `security` | OWASP, auth, secrets |
| `performance` | N+1, bundle size |
| `architecture` | SOLID, coupling |
| `accessibility` | WCAG, keyboard |
| `database` | Schema, indexing |
| `frontend` | Components, state |
| `api-design` | REST conventions |
| `observability` | Logging, metrics |

## Examples

```
@/audit security
@/audit performance
@/audit architecture
```

## Output
Structured report with severity-rated findings.

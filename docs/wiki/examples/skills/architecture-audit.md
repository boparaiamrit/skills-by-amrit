# architecture-audit Examples

> SOLID compliance, coupling analysis, dependency direction.

## Usage

### Antigravity
```
/audit architecture
```

### Claude Code
```
@/audit architecture
```

## Checks Performed

- SOLID principles compliance
- Coupling and cohesion
- Dependency direction (clean architecture)
- Module boundaries
- Layering violations
- Circular dependencies
- God classes/functions

## Example Output

```markdown
## Architecture Audit

### 🔴 Critical
- Circular dependency: auth → user → auth
- Database accessed directly in components

### 🟠 High
- UserService: 1200 lines (God class)
- 15 tight couplings to external APIs

### 🟡 Medium
- Inconsistent repository pattern usage
- Missing abstractions for external services

### Dependency Graph
```
┌─────────┐     ┌─────────┐
│   UI    │────▶│ Service │
└─────────┘     └────┬────┘
                     │
                     ▼
              ┌─────────────┐
              │ Repository  │ ← ✓ Correct direction
              └─────────────┘
```

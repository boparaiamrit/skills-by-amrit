# frontend-audit Examples

> Component architecture, state management, rendering performance.

## Usage

### Antigravity
```
/audit frontend
```

### Claude Code
```
@/audit frontend
```

## Checks Performed

- Component structure
- State management patterns
- Re-render optimization
- Bundle size
- Accessibility basics
- Responsive design
- Error boundaries

## Example Output

```markdown
## Frontend Audit

### 🔴 Critical
- No error boundaries (app crashes on any error)
- 45 components re-render on every state change

### 🟠 High
- State in URL not synced (back button broken)
- Forms lose data on navigation

### 🟡 Medium
- 12 prop drilling chains (>3 levels)
- Inconsistent loading patterns

### Component Analysis
| Component | Re-renders | Size | Memoized |
|-----------|------------|------|----------|
| Dashboard | 234/min | 45kb | ❌ |
| UserList | 89/min | 12kb | ❌ |
| Header | 12/min | 3kb | ✅ |

### Recommendations
- Add React.memo to heavy components
- Use React Query for server state
- Implement error boundaries at route level
```

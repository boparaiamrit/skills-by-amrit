# brutal-exhaustive-audit Examples

> 5-pass no-shortcuts audit: build, routes, data flow, user flows, edge cases.

## Usage

### Antigravity
```
/deep-audit
```

### Claude Code
```
@/deep-audit
```

## The 5 Passes

### Pass 1: Build Verification
- Clean build from scratch
- All tests passing
- No lint errors
- No type errors

### Pass 2: Route Inventory
- Every route documented
- Auth requirements verified
- Parameters validated

### Pass 3: Data Flow
- Every API call traced
- State mutations tracked
- Side effects cataloged

### Pass 4: User Flows
- Critical paths tested
- Error states handled
- Edge cases covered

### Pass 5: Edge Cases
- Empty states
- Error boundaries
- Loading states
- Concurrent access

## Example Output

```markdown
## Brutal Exhaustive Audit

### Summary
- Total issues: 47
- 🔴 Critical: 3
- 🟠 High: 8
- 🟡 Medium: 21
- 🟢 Low: 15

### Pass 1: Build ✅
- Build time: 42s
- Bundle size: 1.2MB (acceptable)

### Pass 2: Routes
- 24 routes found
- 3 missing auth guards
- 2 unhandled 404s

### Pass 3: Data Flow
- 156 API calls traced
- 12 unhandled errors
- 4 race conditions

### Pass 4: User Flows
- Login flow: ✅
- Checkout flow: ⚠️ edge case
- Settings flow: ❌ broken

### Pass 5: Edge Cases
- Empty cart: ✅
- Slow network: ❌ no loading state
- Session expiry: ❌ no redirect
```

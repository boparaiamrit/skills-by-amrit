# refactoring-safely Examples

> Incremental transformation with test coverage and safe rollback.

## Usage

### Antigravity
```
/refactor src/legacy/user-service.ts
```

### Claude Code
```
@/refactor src/legacy/user-service.ts
```

## Process

1. **Verify test coverage** — Don't refactor without tests
2. **Small steps** — One change at a time
3. **Run tests** — After every change
4. **Commit frequently** — Easy rollback
5. **No behavior changes** — Same inputs → same outputs

## Example Session

```markdown
## Refactoring: user-service.ts

### Pre-flight
- Test coverage: 78% ✅
- All tests passing: ✅
- Git clean: ✅

### Step 1: Extract method
```ts
// Before
function processUser(user) {
  // 50 lines of validation
  // 30 lines of transformation
}

// After
function validateUser(user) { ... }
function transformUser(user) { ... }
function processUser(user) {
  validateUser(user);
  return transformUser(user);
}
```
Tests: ✅ All passing

### Step 2: Add types
```ts
function processUser(user: User): ProcessedUser { ... }
```
Tests: ✅ All passing

### Summary
- 4 methods extracted
- Types added throughout
- 0 behavior changes
- Tests still at 78%
```

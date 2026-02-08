# test-driven-development Examples

> Red-green-refactor cycle, test architecture, coverage strategies.

## Usage

### Antigravity
```
/test src/services/user.ts
```

### Claude Code
```
@/test src/services/user.ts
```

## The TDD Cycle

1. **Red** — Write failing test
2. **Green** — Make it pass (minimal code)
3. **Refactor** — Clean up

## Example Session

```markdown
## TDD: User Service

### Red: Write failing test
```ts
test('createUser throws on duplicate email', async () => {
  await createUser({ email: 'test@example.com' });
  await expect(
    createUser({ email: 'test@example.com' })
  ).rejects.toThrow('Email already exists');
});
```
Result: ❌ FAIL — No validation exists

### Green: Make it pass
```ts
async function createUser(data: CreateUserInput) {
  const existing = await db.user.findByEmail(data.email);
  if (existing) throw new Error('Email already exists');
  return db.user.create(data);
}
```
Result: ✅ PASS

### Refactor: Clean up
```ts
// Extract to constant
const ERRORS = {
  DUPLICATE_EMAIL: 'Email already exists'
};
```
Result: ✅ PASS — Tests still green

### Coverage: 85% (+3%)
```

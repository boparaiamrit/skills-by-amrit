# core-principles Rule Examples

> SOLID, DRY, evidence-based claims, and clean architecture.

## Overview

The core-principles rule establishes non-negotiable development standards that all AI agents must follow.

---

## The Three Iron Laws

### 1. Evidence Before Claims

**❌ Never say:**
```
"I've fixed the bug."
```

**✅ Always say:**
```
"I've fixed the bug. Here's the evidence:
- Build passes: `npm run build` ✅
- Tests pass: `npm test` ✅
- Error no longer reproduces: [screenshot/log]"
```

### 2. Root Cause Before Fixes

**❌ Never do:**
```
// Quick fix: retry on error
try {
  await api.call();
} catch {
  await api.call(); // Just retry
}
```

**✅ Always do:**
```
// Root cause: Connection pool exhaustion
// Fix: Properly close connections
const connection = await pool.getConnection();
try {
  await connection.query(...);
} finally {
  connection.release(); // Proper cleanup
}
```

### 3. Plan Before Code

**❌ Never start coding immediately**

**✅ Always:**
1. Understand the requirement
2. Research existing patterns
3. Design the solution
4. Break into tasks
5. THEN implement

---

## Code Quality Standards

### Required for ALL Code

```typescript
// ✅ Type hints
function calculateTotal(items: Item[]): number {
  // ✅ Early validation
  if (!items?.length) return 0;

  // ✅ Descriptive variable names
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * TAX_RATE; // ✅ Named constants

  return subtotal + tax;
}
```

### Error Handling

```typescript
// ✅ Specific error types
class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// ✅ Meaningful error messages
throw new ValidationError('email', 'Invalid email format: must contain @');
```

---

## Activation

This rule is automatically active via:
- `rules/core-principles.md` (universal)
- `.cursor/rules/core-development.mdc` (Cursor)
- CLAUDE.md / GEMINI.md (entry points)

---

## Related Rules

- [anti-hallucination](anti-hallucination.md) — Never fabricate
- [severity-framework](severity-framework.md) — Issue classification

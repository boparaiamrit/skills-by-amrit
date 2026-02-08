# codebase-conformity Examples

> Enforces pattern uniformity when adding code to existing codebases.

## When to Use

- Adding new features to existing codebase
- Creating new components/endpoints
- Modifying existing code patterns
- After AI-generated code (verification)

---

## Antigravity Examples

### Example 1: Adding a New API Endpoint

**Context:** You have existing endpoints following a pattern.

```
I need to add a new endpoint for /api/reports. Please follow existing patterns.
```

**The skill process:**
1. **Pattern Discovery** — Reads 3+ sibling files (`/api/users.ts`, `/api/orders.ts`, `/api/products.ts`)
2. **Pattern Catalog** — Documents: error handling style, response format, validation approach
3. **Conformity Implementation** — Matches exactly
4. **Double Verification** — Checks against DIFFERENT sibling file

### Example 2: New React Component

```
Add a new ProductCard component. Use codebase-conformity to match existing patterns.
```

**Discovered patterns:**
- File naming: `kebab-case.tsx`
- Props: TypeScript interface above component
- Styling: CSS modules with `styles.container` pattern
- State: useState with descriptive names

---

## Claude Code Examples

### Example 1: Feature Addition

```
Add user preferences to the settings page. Follow existing patterns.
```

**The skill ensures:**
- Form components match existing forms
- API calls use same service layer pattern
- Error handling matches app conventions
- State management follows established approach

---

## Pattern Catalog Example

```markdown
## Pattern Catalog: [Codebase Name]

### File Structure
- Components: `src/components/[domain]/[ComponentName].tsx`
- Services: `src/services/[domain].service.ts`
- Types: `src/types/[domain].types.ts`

### Naming Conventions
- Components: PascalCase
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case

### Error Handling
- API errors: try/catch with ApiError class
- Validation: Zod schemas
- User feedback: toast notifications

### Data Fetching
- React Query with custom hooks
- Loading: skeleton components
- Error: ErrorBoundary fallback

### Styling
- Tailwind with design tokens
- Dark mode: `dark:` prefix
- Responsive: mobile-first
```

---

## Anti-Patterns to Avoid

| ❌ Don't | ✅ Do |
|----------|-------|
| "My way is cleaner" | Match existing exactly |
| "This is more modern" | Use codebase conventions |
| Introduce new libraries | Use existing dependencies |
| Skip reading siblings | Read 3+ examples first |
| Claim done without check | Double verify against different sibling |

---

## Related Skills

- [code-review](code-review.md) — Verify conformity in review
- [codebase-mapping](codebase-mapping.md) — Understand patterns first
- [refactoring-safely](refactoring-safely.md) — Change patterns safely
